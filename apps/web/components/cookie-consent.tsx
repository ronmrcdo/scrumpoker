"use client";

import { Button, Cookie } from "@repo/ui";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const CONSENT_KEY = "cookie-consent";

type ConsentValue = "accepted" | "necessary";

function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "necessary") return value;
  return null;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleConsent = useCallback((value: ConsentValue) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage unavailable (private browsing, quota exceeded)
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const first =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    first?.focus();
    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleConsent("necessary");
        return;
      }
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, handleConsent]);

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 sm:right-auto z-50 sm:w-sm rounded-lg border border-border bg-background/95 shadow-lg backdrop-blur-md animate-fade-up"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-white dark:bg-white/10 rounded-xl shadow-sm shrink-0">
            <Cookie className="size-5 text-primary" />
          </div>
          <div className="space-y-2">
            <p id={titleId} className="text-sm font-semibold text-foreground">
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
