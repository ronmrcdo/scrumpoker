"use client";

import { Badge, Card, CardContent, Lightbulb } from "@repo/ui";
import { useMemo } from "react";

import { CARD_VALUES } from "@/lib/constants/cards";
import type { VoteStats } from "@/lib/types";

interface SuggestedEstimateProps {
  stats: VoteStats | null;
}

// Filter out non-numeric values and NaN at module load time
const FIBONACCI_VALUES = CARD_VALUES.filter((v) => v !== "☕")
  .map(Number)
  .filter((n) => !Number.isNaN(n));

function getNearestFibonacci(average: number): number {
  if (FIBONACCI_VALUES.length === 0 || Number.isNaN(average)) return 0;

  let nearest = FIBONACCI_VALUES[0] as number;
  let minDiff = Math.abs(average - nearest);

  for (const value of FIBONACCI_VALUES) {
    const diff = Math.abs(average - value);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = value;
    }
  }

  return nearest;
}

function getConfidenceLevel(stats: VoteStats): {
  level: "high" | "medium" | "low";
  label: string;
} {
  if (stats.consensus) {
    return { level: "high", label: "High confidence" };
  }

  // Guard against division by zero
  if (stats.average === 0) {
    return { level: "low", label: "Low confidence" };
  }

  const spreadRatio = stats.spread / stats.average;
  if (spreadRatio <= 0.5) {
    return { level: "medium", label: "Medium confidence" };
  }

  return { level: "low", label: "Low confidence" };
}

export function SuggestedEstimate({ stats }: SuggestedEstimateProps) {
  // Memoize calculations to prevent recalculation on every render
  const suggested = useMemo(
    () => (stats ? getNearestFibonacci(stats.average) : 0),
    [stats],
  );

  const confidence = useMemo(
    () => (stats ? getConfidenceLevel(stats) : null),
    [stats],
  );

  if (!stats || !confidence) return null;

  const confidenceVariant =
    confidence.level === "high"
      ? "success"
      : confidence.level === "medium"
        ? "warning"
        : "destructive";

  return (
    <Card className="animate-scale-in" style={{ animationDelay: "250ms" }}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Suggested Estimate
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-foreground animate-bounce-once">
              {suggested}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              points
            </span>
          </div>
          <Badge
            variant={confidenceVariant}
            className="shrink-0 animate-fade-in"
          >
            {confidence.label}
          </Badge>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
          Based on average of {stats.average.toFixed(1)} with spread of{" "}
          {stats.spread}
        </p>
      </CardContent>
    </Card>
  );
}
