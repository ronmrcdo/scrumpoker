"use client";

import { Skeleton } from "@repo/ui";
import { useEffect } from "react";

import { useTokenRefresh } from "@/lib/hooks/use-token-refresh";
import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

function TokenRefreshManager() {
  useTokenRefresh();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const setCurrentUserId = usePokerStore((s) => s.setCurrentUserId);
  const setSessionInitialized = usePokerStore((s) => s.setSessionInitialized);
  const sessionInitialized = usePokerStore((s) => s.sessionInitialized);

  useEffect(() => {
    async function initAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Validate the session against the DB — it may be stale after a db reset
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
          setSessionInitialized(true);
          return;
        }
        // Stale session — sign out to clear invalid cookies
        await supabase.auth.signOut();
      }

      // No session (or stale session cleared) — sign in anonymously
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("Anonymous sign-in failed:", error.message);
      }
      if (data.user) {
        setCurrentUserId(data.user.id);
      }
      setSessionInitialized(true);
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [setCurrentUserId, setSessionInitialized]);

  if (!sessionInitialized)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-64 w-full max-w-md rounded-lg" />
      </div>
    );
  return (
    <>
      <TokenRefreshManager />
      {children}
    </>
  );
}
