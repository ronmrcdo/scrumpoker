"use client";

import { cn } from "@repo/ui";
import { memo, useCallback } from "react";
import { CARD_VALUES, FOLD_VALUE, suitFor } from "@/lib/constants/cards";
import { FxHandCard } from "./motion-fx";
import { PlayingCard } from "./playing-card";

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
    <fieldset className="border-0 p-0 m-0 w-full">
      <legend className="sr-only">Your hand — pick a card</legend>
      <div
        className={cn(
          "flex gap-2 sm:gap-3 justify-center flex-wrap",
          "pt-3 pb-1",
        )}
      >
        {CARD_VALUES.map((val, index) => {
          const suit = suitFor(val);
          const isSelected = currentVote === val;
          return (
            <FxHandCard key={val} index={index}>
              <PlayingCard
                value={val}
                suit={suit}
                selected={isSelected}
                disabled={isRevealed}
                onClick={() => handleVote(val)}
                ariaLabel={`Vote ${val} story points`}
              />
            </FxHandCard>
          );
        })}
      </div>

      <button
        type="button"
        disabled={isRevealed}
        onClick={() => handleVote(FOLD_VALUE)}
        aria-pressed={currentVote === FOLD_VALUE}
        className={cn(
          "w-full sm:w-auto sm:px-8 sm:mx-auto sm:block mt-4 sm:mt-5 h-10 sm:h-10 rounded-md border text-sm font-medium",
          "transition-[opacity,background-color,border-color,color] duration-150",
          "hover:opacity-85 active:opacity-95",
          "disabled:opacity-50 disabled:pointer-events-none touch-manipulation",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          currentVote === FOLD_VALUE
            ? "bg-destructive text-destructive-foreground border-destructive"
            : "bg-card text-destructive border-border hover:border-destructive",
        )}
      >
        Fold — Need More Info
      </button>
    </fieldset>
  );
});
