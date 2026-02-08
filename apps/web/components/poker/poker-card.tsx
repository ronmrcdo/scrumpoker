"use client";

import { cn } from "@repo/ui";
import { useEffect, useState } from "react";
import { FOLD_VALUE } from "@/lib/constants/cards";

interface PokerCardProps {
  memberName: string;
  vote: string | null;
  isRevealed: boolean;
  isCurrentUser: boolean;
  compact?: boolean;
}

export function PokerCard({
  memberName,
  vote,
  isRevealed,
  isCurrentUser,
  compact = false,
}: PokerCardProps) {
  const hasVoted = vote !== null;
  const isFold = vote === FOLD_VALUE;
  const [shouldFlip, setShouldFlip] = useState(false);

  // Trigger flip animation when card is revealed
  useEffect(() => {
    if (isRevealed && hasVoted) {
      setShouldFlip(true);
      const timer = setTimeout(() => setShouldFlip(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, hasVoted]);

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div
        className={cn(
          compact
            ? "w-10 h-14 sm:w-12 sm:h-16 rounded-md flex items-center justify-center text-sm sm:text-base font-bold shadow-soft-sm"
            : "w-12 h-16 sm:w-14 sm:h-20 rounded-md sm:rounded-lg flex items-center justify-center text-base sm:text-lg font-bold shadow-soft-sm",
          "transition-[transform,background-color,border-color,box-shadow,color] duration-300",
          shouldFlip && "animate-flip",
          !hasVoted &&
            "border-2 border-dashed border-border bg-card text-muted-foreground",
          isFold &&
            "bg-amber-100 border-2 border-amber-400 text-amber-600 shadow-soft-md dark:bg-amber-950/30",
          !isFold &&
            hasVoted &&
            !isRevealed &&
            "bg-primary-500 text-white border border-primary-500 shadow-soft-md scale-105",
          !isFold &&
            hasVoted &&
            isRevealed &&
            "bg-card border-2 border-primary-500 text-primary-600 shadow-soft-md",
          isCurrentUser &&
            hasVoted &&
            !isRevealed &&
            "ring-2 ring-primary-300 ring-offset-1 sm:ring-offset-2 ring-offset-background",
        )}
      >
        {!hasVoted ? "?" : isFold ? "✋" : isRevealed ? vote : "✓"}
      </div>
      <span
        className={cn(
          compact
            ? "text-[10px] sm:text-xs font-medium truncate max-w-[56px] sm:max-w-[68px] text-center leading-tight transition-colors duration-200"
            : "text-[10px] sm:text-xs font-medium truncate max-w-[64px] sm:max-w-[80px] text-center leading-tight transition-colors duration-200",
          isCurrentUser
            ? "text-primary-600 font-semibold"
            : "text-muted-foreground",
        )}
      >
        {memberName}
      </span>
    </div>
  );
}
