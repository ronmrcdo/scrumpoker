"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect, useRef } from "react";
import { usePokerStore } from "@/lib/store/poker-store";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    disable_session_recording:
      process.env.NEXT_PUBLIC_POSTHOG_SESSION_REPLAY !== "true",
  });
}

function PostHogPageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const sessionInitialized = usePokerStore((s) => s.sessionInitialized);
  const identifiedRef = useRef(false);

  // Track pageviews on route change
  useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      ph.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, ph]);

  // Identify user when Supabase session initializes
  useEffect(() => {
    if (sessionInitialized && currentUserId && ph && !identifiedRef.current) {
      ph.identify(currentUserId, {
        auth_type: "anonymous",
      });
      ph.people.set_once({
        first_seen_at: new Date().toISOString(),
      });
      ph.people.set({
        last_active_at: new Date().toISOString(),
      });
      identifiedRef.current = true;
    }
  }, [sessionInitialized, currentUserId, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
