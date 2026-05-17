"use client";

import { useEffect } from "react";

import { useTokenRefresh } from "@/lib/hooks/use-token-refresh";
import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";
import { followRedirectParam } from "@/lib/utils";

const supabase = createClient();

function TokenRefreshManager() {
  useTokenRefresh();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const setCurrentUserId = usePokerStore((s) => s.setCurrentUserId);
  const setSessionInitialized = usePokerStore((s) => s.setSessionInitialized);

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
          followRedirectParam();
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
      followRedirectParam();
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

  // Children render immediately so the landing page (and other public pages)
  // appear in the server-rendered HTML for crawlers. Session-dependent UI
  // (e.g. the "Create Room" button, JoinRoomDialog) gates itself on
  // `currentUserId` / `sessionInitialized` from the store.
  return (
    <>
      <TokenRefreshManager />
      {children}
    </>
  );
}
