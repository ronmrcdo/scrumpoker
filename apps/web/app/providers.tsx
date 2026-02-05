"use client";

import { useEffect } from "react";

import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

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
        setCurrentUserId(session.user.id);
        setSessionInitialized(true);
        return;
      }

      // No session — sign in anonymously
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

  if (!sessionInitialized) return null;
  return <>{children}</>;
}
