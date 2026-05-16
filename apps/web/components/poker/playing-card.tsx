"use client";

import { cn } from "@repo/ui";
import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import { isRedSuit } from "@/lib/constants/cards";

interface PlayingCardProps {
  value: string;
  suit: "♠" | "♥" | "♦" | "♣";
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export const PlayingCard = memo(function PlayingCard({
  value,
  suit,
  selected,
  disabled,
  onClick,
  ariaLabel,
}: PlayingCardProps) {
  const isRed = isRedSuit(suit);
  const isSpecial = value === "☕" || value === "?";
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
      whileHover={prefersReducedMotion || disabled ? undefined : { y: -6 }}
      whileTap={
        prefersReducedMotion || disabled
          ? undefined
          : { y: -10, scale: 1.04, transition: { duration: 0.18 } }
      }
      animate={
        selected && !prefersReducedMotion
          ? { y: -10, scale: 1.02 }
          : { y: 0, scale: 1 }
      }
      transition={{ duration: 0.25, ease: [0.34, 1.4, 0.36, 1] }}
      className={cn(
        "relative aspect-[5/7] w-[60px] sm:w-[80px] md:w-[88px] shrink-0",
        "rounded-xl border bg-card text-card-foreground",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        "px-2 py-2.5 sm:px-2.5 sm:py-3 select-none touch-manipulation",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        selected
          ? "border-foreground outline outline-2 outline-foreground outline-offset-2"
          : "border-border hover:border-ink-3/60",
      )}
    >
      <span className="absolute top-1.5 left-2 sm:top-2 sm:left-2.5 flex flex-col items-start leading-none">
        <span className="text-[13px] sm:text-[15px] font-semibold text-foreground leading-none">
          {value}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-[11px] sm:text-[13px] font-medium leading-none mt-0.5",
            isRed ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {suit}
        </span>
      </span>

      {!isSpecial && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 grid place-items-center font-normal",
            "text-[32px] sm:text-[44px] md:text-[52px]",
            isRed
              ? "text-destructive/15 dark:text-destructive/25"
              : "text-bone-3",
          )}
        >
          {suit}
        </span>
      )}
      {isSpecial && (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center text-[26px] sm:text-[34px] text-foreground"
        >
          {value}
        </span>
      )}

      <span className="absolute bottom-1.5 right-2 sm:bottom-2 sm:right-2.5 flex flex-col items-end leading-none rotate-180">
        <span className="text-[13px] sm:text-[15px] font-semibold text-foreground leading-none">
          {value}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "text-[11px] sm:text-[13px] font-medium leading-none mt-0.5",
            isRed ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {suit}
        </span>
      </span>
    </motion.button>
  );
});
