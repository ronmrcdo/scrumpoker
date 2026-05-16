"use client";

import { cn } from "@repo/ui";
import { type CardSuit, isRedSuit } from "@/lib/constants/cards";

const SUIT_BY_INDEX = [
  "♠",
  "♥",
  "♣",
  "♦",
  "♠",
  "♥",
  "♣",
  "♦",
] as const satisfies readonly CardSuit[];

interface HeroCardProps {
  value: string;
  index: number;
  totalCards: number;
}

export function HeroCard({ value, index, totalCards }: HeroCardProps) {
  const suit = SUIT_BY_INDEX[index % SUIT_BY_INDEX.length] ?? "♠";
  const isRed = isRedSuit(suit);

  const midpoint = (totalCards - 1) / 2;
  const offset = index - midpoint;
  const spreadX = offset * 48;
  const rotation = offset * 8;

  const style = {
    transform: `translateX(${spreadX}px) translateY(${Math.abs(offset) * 4}px) rotate(${rotation}deg)`,
    zIndex: totalCards - Math.abs(offset),
    animationDelay: `${index * 100}ms`,
    willChange: "transform" as const,
  };

  return (
    <div
      aria-hidden="true"
      className="absolute transition-transform duration-400 ease-out"
      style={style}
    >
      <div
        className={cn(
          "relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32",
          "rounded-xl border border-border bg-card text-card-foreground",
          "shadow-soft-md",
          "flex flex-col justify-between p-2 sm:p-2.5",
          "transition-transform duration-300 hover:-translate-y-2",
        )}
      >
        <div className="flex flex-col items-center leading-none">
          <span className="text-sm sm:text-base font-semibold text-foreground">
            {value}
          </span>
          <span
            className={cn(
              "text-xs sm:text-sm",
              isRed ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {suit}
          </span>
        </div>

        <div
          className={cn(
            "absolute inset-0 grid place-items-center pointer-events-none",
            "text-3xl sm:text-4xl md:text-5xl",
            isRed ? "text-destructive/20" : "text-bone-3",
          )}
        >
          {suit}
        </div>

        <div className="flex flex-col items-center leading-none self-end rotate-180">
          <span className="text-sm sm:text-base font-semibold text-foreground">
            {value}
          </span>
          <span
            className={cn(
              "text-xs sm:text-sm",
              isRed ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {suit}
          </span>
        </div>
      </div>
    </div>
  );
}
