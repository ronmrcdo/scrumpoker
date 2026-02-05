"use client";

import { cn, Eye, EyeOff } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

interface Voter {
  id: number;
  name: string;
  vote: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const VOTERS: Voter[] = [
  { id: 1, name: "Sarah", vote: "5", position: "top-left" },
  { id: 2, name: "Mike", vote: "8", position: "top-right" },
  { id: 3, name: "Alex", vote: "5", position: "bottom-left" },
  { id: 4, name: "Jordan", vote: "13", position: "bottom-right" },
];

export function MiniAnonymousDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState<"hidden" | "countdown" | "revealed">(
    "hidden",
  );

  // Track visibility to pause animations when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.1 },
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Don't run animations when not visible
    if (!isVisible) return;

    const cycle = () => {
      setPhase("hidden");
      setIsRevealed(false);
      setCountdown(3);

      const countdownStart = setTimeout(() => {
        setPhase("countdown");
      }, 2000);

      const tick1 = setTimeout(() => setCountdown(2), 3000);
      const tick2 = setTimeout(() => setCountdown(1), 4000);

      const revealTimeout = setTimeout(() => {
        setPhase("revealed");
        setIsRevealed(true);
      }, 5000);

      const resetTimeout = setTimeout(() => {
        cycle();
      }, 8000);

      return () => {
        clearTimeout(countdownStart);
        clearTimeout(tick1);
        clearTimeout(tick2);
        clearTimeout(revealTimeout);
        clearTimeout(resetTimeout);
      };
    };

    const cleanup = cycle();
    return cleanup;
  }, [isVisible]);

  const getPositionClasses = (position: Voter["position"]) => {
    switch (position) {
      case "top-left":
        return "-top-2 left-4";
      case "top-right":
        return "-top-2 right-4";
      case "bottom-left":
        return "-bottom-2 left-4";
      case "bottom-right":
        return "-bottom-2 right-4";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden h-[340px] bg-background border border-border shadow-soft-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-semibold text-foreground">
          Anonymous Voting
        </span>
        <div className="flex items-center gap-2">
          {isRevealed ? (
            <Eye className="h-3.5 w-3.5 text-accent" />
          ) : (
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              isRevealed
                ? "bg-accent/10 text-accent"
                : "bg-muted text-muted-foreground",
            )}
          >
            {isRevealed ? "Revealed" : "Hidden"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col items-center">
        {/* Mini Poker Table */}
        <div className="relative w-full max-w-[240px] h-[140px] flex items-center justify-center">
          {/* Table surface */}
          <div className="absolute inset-0 rounded-[40px] border-2 border-border bg-card shadow-soft-md" />
          <div className="absolute inset-2 rounded-[32px] border border-border/50 bg-muted/30" />

          {/* Players around the table */}
          {VOTERS.map((voter) => (
            <div
              key={voter.id}
              className={cn(
                "absolute flex flex-col items-center gap-1",
                getPositionClasses(voter.position),
              )}
            >
              <div
                className={cn(
                  "w-8 h-11 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-soft-sm",
                  !isRevealed &&
                    "bg-primary-500 text-white border border-primary-500 shadow-soft-md",
                  isRevealed &&
                    "bg-card border-2 border-primary-500 text-primary-600 shadow-soft-md",
                )}
              >
                {isRevealed ? voter.vote : "✓"}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">
                {voter.name}
              </span>
            </div>
          ))}
        </div>

        {/* Status message */}
        <div className="mt-6 text-center">
          {phase === "hidden" && (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                <EyeOff className="w-3.5 h-3.5" />
                Votes are hidden
              </div>
              <p className="text-[10px] text-muted-foreground">
                Preventing anchoring bias
              </p>
            </div>
          )}
          {phase === "countdown" && (
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 border border-primary-200">
                <span className="text-2xl font-bold text-primary-600 animate-pulse">
                  {countdown}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Revealing votes...
              </p>
            </div>
          )}
          {phase === "revealed" && (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                <Eye className="w-3.5 h-3.5" />
                Votes revealed!
              </div>
              <p className="text-[10px] text-muted-foreground">
                Now discuss the differences
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
