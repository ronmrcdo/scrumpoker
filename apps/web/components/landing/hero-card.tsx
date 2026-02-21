"use client";

import { cn } from "@repo/ui";
import { useMemo } from "react";

interface HeroCardProps {
  value: string;
  index: number;
  totalCards: number;
}

export function HeroCard({ value, index, totalCards }: HeroCardProps) {
  // Memoize style calculations to prevent recreation on every render
  const style = useMemo(() => {
    const midpoint = (totalCards - 1) / 2;
    const offset = index - midpoint;
    const spreadX = offset * 48; // horizontal spread in pixels
    const rotation = offset * 10; // rotation in degrees

    return {
      transform: `translateX(${spreadX}px) rotate(${rotation}deg)`,
      zIndex: totalCards - Math.abs(offset),
      animationDelay: `${index * 100}ms`,
      willChange: "transform" as const,
    };
  }, [index, totalCards]);

  return (
    <div
      aria-hidden="true"
      className="card-flip-container absolute cursor-pointer transition-transform duration-400 ease-out"
      style={style}
    >
      <div className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 preserve-3d transition-transform duration-500">
        {/* Card Front (Back of card - shown by default) */}
        <div
          className={cn(
            "card-front absolute inset-0 rounded-lg backface-hidden",
            "bg-gradient-to-br from-primary-500 to-primary-700",
            "border-2 border-primary-400",
            "shadow-soft-lg",
            "flex items-center justify-center",
            "transition-transform duration-500",
          )}
        >
          {/* Card back pattern */}
          <div className="absolute inset-2 rounded border border-primary-300/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary-300/40 flex items-center justify-center">
                <span className="text-primary-200 font-bold text-xs sm:text-sm">
                  MS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Back (Value - shown on hover) */}
        <div
          className={cn(
            "card-back absolute inset-0 rounded-lg backface-hidden rotate-y-180",
            "bg-card border-2 border-primary-500",
            "shadow-soft-lg",
            "flex items-center justify-center",
            "transition-transform duration-500",
          )}
        >
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
