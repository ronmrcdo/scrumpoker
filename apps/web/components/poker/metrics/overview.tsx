"use client";

import { Card, CardContent } from "@repo/ui";
import type { VoteStats } from "@/lib/types";

interface OverviewProps {
  stats: VoteStats | null;
}

export function Overview({ stats }: OverviewProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      <Card className="animate-scale-in" style={{ animationDelay: "100ms" }}>
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Average
          </p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 transition-colors duration-300">
            {stats.average.toFixed(1)}
          </p>
        </CardContent>
      </Card>
      <Card className="animate-scale-in" style={{ animationDelay: "150ms" }}>
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Spread
          </p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1 transition-colors duration-300">
            {stats.spread}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
