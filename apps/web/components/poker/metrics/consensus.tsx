"use client";

import type { VoteStats } from "@/lib/types";

interface ConsensusProps {
  stats: VoteStats | null;
}

export function Consensus({ stats }: ConsensusProps) {
  if (!stats) {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground animate-pulse-soft"
      >
        Waiting for votes…
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="flex items-baseline justify-between gap-4 animate-fade-in"
    >
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Revealed · Round complete
      </div>
      <div
        className={
          stats.consensus
            ? "font-mono text-[11px] uppercase tracking-widest text-success"
            : "font-mono text-[11px] uppercase tracking-widest text-destructive"
        }
      >
        {stats.consensus ? "Consensus" : "No consensus"}
      </div>
    </div>
  );
}
