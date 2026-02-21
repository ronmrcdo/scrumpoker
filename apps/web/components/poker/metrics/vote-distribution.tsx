"use client";

import { Card, CardContent } from "@repo/ui";
import { useMemo } from "react";

import type { VoteStats } from "@/lib/types";

interface VoteDistributionProps {
  stats: VoteStats | null;
}

export function VoteDistribution({ stats }: VoteDistributionProps) {
  // Memoize sorting and calculations to prevent recalculation on every render
  const { entries, maxCount, totalVotes } = useMemo(() => {
    if (!stats || Object.keys(stats.distribution).length === 0) {
      return { entries: [], maxCount: 0, totalVotes: 0 };
    }

    const sortedEntries = Object.entries(stats.distribution).sort(
      ([a], [b]) => {
        const numA = Number(a);
        const numB = Number(b);
        if (Number.isNaN(numA) && Number.isNaN(numB)) return a.localeCompare(b);
        if (Number.isNaN(numA)) return 1;
        if (Number.isNaN(numB)) return -1;
        return numA - numB;
      },
    );

    const values = Object.values(stats.distribution);
    const max = values.length > 0 ? Math.max(...values) : 0;
    const total = values.reduce((a, b) => a + b, 0);

    return { entries: sortedEntries, maxCount: max, totalVotes: total };
  }, [stats]);

  if (!stats) return null;

  // Show empty state message if no votes
  if (entries.length === 0) {
    return (
      <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
        <CardContent className="p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Vote Distribution
          </p>
          <p className="text-sm text-muted-foreground text-center py-4">
            No votes yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
      <CardContent className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Vote Distribution
        </p>
        <div className="space-y-2">
          {entries.map(([vote, count], index) => {
            const percentage = (count / maxCount) * 100;
            const votePercentage = ((count / totalVotes) * 100).toFixed(0);

            return (
              <div
                key={vote}
                className="flex items-center gap-2 sm:gap-3 animate-fade-in"
                style={{ animationDelay: `${250 + index * 50}ms` }}
              >
                <span className="w-6 sm:w-8 text-sm sm:text-base font-semibold text-foreground text-right shrink-0">
                  {vote}
                </span>
                <div className="flex-1 h-5 sm:h-6 bg-muted rounded-md overflow-hidden relative">
                  <meter
                    value={count}
                    min={0}
                    max={maxCount}
                    aria-label={`${vote} points: ${count} vote(s), ${votePercentage}%`}
                    className="sr-only"
                  />
                  <div
                    aria-hidden="true"
                    className="h-full bg-primary-500 rounded-md transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 sm:w-14 text-xs sm:text-sm text-muted-foreground text-right shrink-0">
                  {count} ({votePercentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
