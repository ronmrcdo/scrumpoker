"use client";

import { cn } from "@repo/ui";
import { CARD_VALUES } from "@/lib/constants/cards";

interface VoteSelectionProps {
  currentVote: string | null;
  isRevealed: boolean;
  onVote: (value: string) => void;
}

export function VoteSelection({
  currentVote,
  isRevealed,
  onVote,
}: VoteSelectionProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 sm:mb-3 animate-fade-in">
        Choose Your Card
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {CARD_VALUES.map((val, index) => (
          <button
            key={val}
            type="button"
            disabled={isRevealed}
            onClick={() => onVote(val)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={cn(
              "h-14 sm:h-16 rounded-lg border-2 text-lg sm:text-xl font-bold",
              "transition-all duration-300 ease-out",
              "hover:shadow-soft-md hover:-translate-y-1 hover:scale-105",
              "active:scale-95 active:transition-transform active:duration-75",
              "disabled:opacity-50 disabled:pointer-events-none touch-manipulation",
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
    </div>
  );
}
