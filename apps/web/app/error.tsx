"use client";

import { AlertTriangle } from "@repo/ui";
import { useEffect } from "react";
import { ErrorLayout } from "@/components/error/error-layout";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorLayout
      icon={AlertTriangle}
      iconClassName="text-warm-500"
      title="Something went wrong"
      description="We ran into an unexpected issue while loading this page."
      suggestion="Don't worry, your work is safe. Try refreshing or head back to the lobby."
      primaryAction={{
        label: "Try Again",
        onClick: reset,
      }}
      secondaryAction={{
        label: "Go to Lobby",
        href: "/",
      }}
    />
  );
}
