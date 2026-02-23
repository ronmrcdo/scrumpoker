"use client";

import { cn } from "@repo/ui";
import { memo, useCallback } from "react";
import { CARD_VALUES, FOLD_VALUE } from "@/lib/constants/cards";

interface VoteSelectionProps {
  currentVote: string | null;
  isRevealed: boolean;
  onVote: (value: string | null) => void;
}

export const VoteSelection = memo(function VoteSelection({
  currentVote,
  isRevealed,
  onVote,
}: VoteSelectionProps) {
  const handleVote = useCallback(
    (val: string) => {
      onVote(currentVote === val ? null : val);
    },
    [currentVote, onVote],
  );

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3">
        Choose Your Card
      </legend>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3">
        {CARD_VALUES.map((val, index) => (
          <button
            key={val}
            type="button"
            disabled={isRevealed}
            onClick={() => handleVote(val)}
            aria-pressed={currentVote === val}
            aria-label={`Vote ${val} story points`}
            style={{ animationDelay: `${index * 50}ms` }}
            className={cn(
              "h-14 sm:h-16 md:h-[4.5rem] rounded-lg border-2 text-lg sm:text-xl font-bold",
              "transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out",
              "hover:shadow-soft-md hover:-translate-y-1 hover:scale-105",
              "active:scale-95 active:duration-75",
              "disabled:opacity-50 disabled:pointer-events-none touch-manipulation",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
              "animate-scale-in",
              currentVote === val
                ? "bg-primary-500 text-white border-primary-500 shadow-soft-md -translate-y-1 scale-105 animate-bounce-once"
                : "bg-card text-foreground border-border hover:border-primary-300",
            )}
          >
            {val}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={isRevealed}
        onClick={() => handleVote(FOLD_VALUE)}
        aria-pressed={currentVote === FOLD_VALUE}
        className={cn(
          "w-full mt-3 sm:mt-4 h-10 sm:h-11 rounded-lg border-2 text-sm font-semibold",
          "transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out",
          "hover:shadow-soft-md",
          "active:scale-[0.98] active:duration-75",
          "disabled:opacity-50 disabled:pointer-events-none touch-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "animate-scale-in",
          currentVote === FOLD_VALUE
            ? "bg-warm-500 text-white border-warm-500 shadow-soft-md"
            : "bg-card text-warm-600 border-warm-300 hover:border-warm-400 hover:bg-warm-50 dark:hover:bg-warm-950/20",
        )}
      >
        Fold — Need More Info
      </button>
    </fieldset>
  );
});
