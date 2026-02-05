"use client";

import { Badge, Card, CardContent, cn } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

interface VoteData {
  value: string;
  count: number;
  voters: string[];
}

const VOTE_RESULTS: VoteData[] = [
  { value: "3", count: 1, voters: ["Alex"] },
  { value: "5", count: 3, voters: ["Sarah", "Mike", "Jordan"] },
  { value: "8", count: 1, voters: ["Chris"] },
];

const STATS = {
  average: 5.2,
  spread: 5,
  mode: "5",
  consensus: true,
};

export function MiniAnalyticsDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleBars, setVisibleBars] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showConsensus, setShowConsensus] = useState(false);

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
      setVisibleBars(0);
      setShowStats(false);
      setShowConsensus(false);

      const bar1 = setTimeout(() => setVisibleBars(1), 300);
      const bar2 = setTimeout(() => setVisibleBars(2), 600);
      const bar3 = setTimeout(() => setVisibleBars(3), 900);

      const statsTimeout = setTimeout(() => setShowStats(true), 1400);
      const consensusTimeout = setTimeout(() => setShowConsensus(true), 2000);
      const resetTimeout = setTimeout(() => cycle(), 6000);

      return () => {
        clearTimeout(bar1);
        clearTimeout(bar2);
        clearTimeout(bar3);
        clearTimeout(statsTimeout);
        clearTimeout(consensusTimeout);
        clearTimeout(resetTimeout);
      };
    };

    const cleanup = cycle();
    return cleanup;
  }, [isVisible]);

  const maxCount = Math.max(...VOTE_RESULTS.map((v) => v.count));

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden h-[340px] bg-background border border-border shadow-soft-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <span className="text-sm font-semibold text-foreground">
          Vote Analytics
        </span>
        {showConsensus && (
          <Badge
            variant="success"
            className="animate-in fade-in slide-in-from-right-2"
          >
            Consensus
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Vote Distribution */}
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Vote Distribution
          </p>
          <div className="space-y-2">
            {VOTE_RESULTS.map((vote, index) => (
              <div key={vote.value} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-card border-2 border-primary-500 flex items-center justify-center text-[10px] font-bold text-primary-600">
                  {vote.value}
                </div>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-primary-500 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2",
                      visibleBars > index ? "opacity-100" : "opacity-0",
                    )}
                    style={{
                      width:
                        visibleBars > index
                          ? `${(vote.count / maxCount) * 100}%`
                          : "0%",
                    }}
                  >
                    <span className="text-[9px] font-bold text-white">
                      {vote.count}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground w-12 truncate">
                  {vote.voters.slice(0, 2).join(", ")}
                  {vote.voters.length > 2 && "..."}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid - matches Overview component */}
        <div
          className={cn(
            "grid grid-cols-2 gap-2 transition-all duration-500",
            showStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          <Card>
            <CardContent className="p-3">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Average
              </p>
              <p className="text-xl font-bold text-foreground mt-1">
                {STATS.average.toFixed(1)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Spread
              </p>
              <p className="text-xl font-bold text-foreground mt-1">
                {STATS.spread}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Consensus Card - matches Consensus component */}
        <Card
          className={cn(
            "transition-all duration-500 delay-200",
            showStats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Most Common
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {STATS.mode}
                </p>
              </div>
              {showConsensus && (
                <Badge variant="success" className="animate-in fade-in">
                  Consensus
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
