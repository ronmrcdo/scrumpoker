"use client";

import { X } from "@repo/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function KickedAlert() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("kicked") === "true") {
      setShow(true);
      // Clean up URL without triggering a navigation
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div
        role="alert"
        className="bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-soft-lg flex items-center gap-3"
      >
        <span className="text-sm font-medium">
          You have been removed from the room by the facilitator
        </span>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="p-1 hover:bg-destructive-foreground/10 rounded-lg transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
