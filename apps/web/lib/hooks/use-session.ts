"use client";

import { usePokerStore } from "@/lib/store/poker-store";

interface SessionState {
  userId: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export function useSession(): SessionState {
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const sessionInitialized = usePokerStore((s) => s.sessionInitialized);

  return {
    userId: currentUserId || null,
    isLoading: !sessionInitialized,
    isInitialized: sessionInitialized,
  };
}
