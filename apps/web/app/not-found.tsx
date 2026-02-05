"use client";

import { Button, Home } from "@repo/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-48 h-48 bg-warm-500/10 rounded-full blur-3xl animate-pulse-soft"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary-500/20 rounded-full" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent/30 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-warm-500/25 rounded-full" />
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-primary-500/15 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center animate-fade-in">
        {/* Large 404 Display */}
        <div className="relative mb-8">
          {/* Background 404 */}
          <div className="text-[180px] sm:text-[220px] font-bold leading-none text-muted/30 select-none">
            404
          </div>

          {/* Floating card with icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card rounded-2xl border border-border shadow-soft-xl p-6 sm:p-8 animate-scale-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-labelledby="not-found-icon-title"
                >
                  <title id="not-found-icon-title">Lost page icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 12H20.25"
                  />
                  <circle cx="6" cy="12" r="2" strokeWidth={1.5} />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Lost in space</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-soft-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Page not found
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground mb-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground/70 mb-6">
            The room may have been closed, or the link might be incorrect.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground/50 uppercase tracking-wider">
              Let&apos;s get you back
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Action Button */}
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Lobby
            </Link>
          </Button>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-muted-foreground/50">
          Error code: 404 • Page not found
        </p>
      </div>
    </div>
  );
}
