"use client";

import { cn } from "@repo/ui";
import { useEffect, useState } from "react";
import { FOLD_VALUE, isRedSuit, suitFor } from "@/lib/constants/cards";

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
  const suit = suitFor(vote);
  const isRed = isRedSuit(suit);
  const showFace = isRevealed && hasVoted && !isFold;
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    if (isRevealed && hasVoted) {
      setShouldFlip(true);
      const timer = setTimeout(() => setShouldFlip(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, hasVoted]);

  const sizeClasses = compact
    ? "w-11 h-16 sm:w-12 sm:h-[68px] text-base"
    : "w-14 h-20 sm:w-16 sm:h-[88px] text-lg";

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div
        className={cn(
          sizeClasses,
          "relative rounded-lg border bg-card text-card-foreground",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
          "transition-[transform,background-color,border-color,color] duration-300",
          shouldFlip && "animate-flip",
          !hasVoted &&
            "border-dashed border-border bg-transparent text-muted-foreground",
          isFold && "bg-destructive/10 border-destructive text-destructive",
          !isFold &&
            hasVoted &&
            !isRevealed &&
            "bg-foreground border-foreground text-background",
          hasVoted && isRevealed && !isFold && "border-border bg-card",
          isCurrentUser &&
            !isRevealed &&
            "ring-2 ring-ring ring-offset-1 sm:ring-offset-2 ring-offset-background",
        )}
      >
        {showFace ? (
          <>
            <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
              <span className="text-xs font-semibold text-foreground">
                {vote}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "text-[10px]",
                  isRed ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {suit}
              </span>
            </div>
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 grid place-items-center text-2xl sm:text-3xl",
                isRed ? "text-destructive/20" : "text-bone-3",
              )}
            >
              {suit}
            </div>
            <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
              <span className="text-xs font-semibold text-foreground">
                {vote}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "text-[10px]",
                  isRed ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {suit}
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span
              aria-hidden="true"
              className={cn(
                "font-medium",
                !hasVoted && "text-base sm:text-lg text-muted-foreground/80",
              )}
            >
              {!hasVoted ? "?" : isFold ? "✋" : ""}
            </span>
          </div>
        )}
        <span className="sr-only">
          {!hasVoted
            ? "No vote yet"
            : isFold
              ? "Folded"
              : isRevealed
                ? `Voted: ${vote}`
                : "Voted"}
        </span>
      </div>
      <span
        className={cn(
          compact
            ? "text-[10px] sm:text-xs font-medium truncate max-w-[64px] sm:max-w-[72px] text-center leading-tight"
            : "text-[11px] sm:text-xs font-medium truncate max-w-[80px] sm:max-w-[96px] text-center leading-tight",
          "px-2 py-0.5 rounded-full border border-border bg-card",
          isCurrentUser
            ? "text-foreground font-semibold"
            : "text-muted-foreground",
        )}
      >
        {memberName}
      </span>
    </div>
  );
}
