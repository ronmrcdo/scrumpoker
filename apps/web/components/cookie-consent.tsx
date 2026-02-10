"use client";

import { Button, Cookie } from "@repo/ui";
import Link from "next/link";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";

type ConsentValue = "accepted" | "necessary";

function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "necessary") return value;
  return null;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value: ConsentValue) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage unavailable (private browsing, quota exceeded)
    }
    if (value === "accepted") {
      posthog.opt_in_capturing();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 sm:w-sm rounded-lg border border-border bg-background/95 shadow-lg backdrop-blur-md animate-fade-up"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-white dark:bg-white/10 rounded-xl shadow-sm shrink-0">
            <Cookie className="size-5 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Security &amp; Analytics
            </p>
            <p className="text-xs text-muted-foreground">
              We use local storage for rate-limiting and analytics. We never
              sell your data.{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConsent("necessary")}
              >
                Necessary only
              </Button>
              <Button size="sm" onClick={() => handleConsent("accepted")}>
                Accept all
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
