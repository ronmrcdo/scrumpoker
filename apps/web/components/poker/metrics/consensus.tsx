"use client";

import { Badge, Card, CardContent } from "@repo/ui";
import type { VoteStats } from "@/lib/types";

interface ConsensusProps {
  stats: VoteStats | null;
}

export function Consensus({ stats }: ConsensusProps) {
  if (!stats) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-3 sm:p-4 text-center">
          <span className="text-xs sm:text-sm text-muted-foreground animate-pulse-soft">Waiting for votes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Most Common
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1 animate-bounce-once">{stats.mode}</p>
          </div>
          <Badge variant={stats.consensus ? "success" : "warning"} className="shrink-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {stats.consensus ? "Consensus" : "Mixed"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
