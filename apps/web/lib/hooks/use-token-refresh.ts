"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  MAX_REFRESH_RETRIES,
  TOKEN_EXPIRY_MARGIN_S,
  TOKEN_REFRESH_INTERVAL_MS,
} from "@/lib/constants/auth";
import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

function isTokenExpiringSoon(expiresAt: number | undefined): boolean {
  if (!expiresAt) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return expiresAt - nowInSeconds <= TOKEN_EXPIRY_MARGIN_S;
}

/**
 * Custom hook that replaces Supabase's built-in autoRefreshToken with
 * bounded retry logic. After MAX_REFRESH_RETRIES consecutive failures,
 * it signs out and re-authenticates anonymously.
 */
export function useTokenRefresh() {
  const setCurrentUserId = usePokerStore((s) => s.setCurrentUserId);
  const retryCountRef = useRef(0);
  const isRefreshingRef = useRef(false);

  const attemptRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    if (!isTokenExpiringSoon(session.expires_at)) {
      retryCountRef.current = 0;
      return;
    }

    isRefreshingRef.current = true;

    try {
      const { error } = await supabase.auth.refreshSession();

      if (!error) {
        retryCountRef.current = 0;
        return;
      }

      retryCountRef.current += 1;
      console.warn(
        `[useTokenRefresh] Refresh attempt ${retryCountRef.current}/${MAX_REFRESH_RETRIES} failed:`,
        error.message,
      );

      if (retryCountRef.current >= MAX_REFRESH_RETRIES) {
        console.warn(
          "[useTokenRefresh] Max retries reached. Re-authenticating anonymously.",
        );

        await supabase.auth.signOut();

        const { data, error: signInError } =
          await supabase.auth.signInAnonymously();

        if (signInError) {
          console.error(
            "[useTokenRefresh] Anonymous re-auth failed:",
            signInError.message,
          );
        } else if (data.user) {
          setCurrentUserId(data.user.id);
        }

        retryCountRef.current = 0;
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [setCurrentUserId]);

  useEffect(() => {
    const intervalId = setInterval(attemptRefresh, TOKEN_REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [attemptRefresh]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptRefresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attemptRefresh]);
}
