"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/lib/types";
import { getRadialPosition } from "@/lib/utils";
import { PokerCard } from "./poker-card";

interface PokerCardsProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
}

function getRadiusForWidth(width: number, scaleFactor: number) {
  if (width < 640) {
    return {
      radiusX: Math.round(120 * scaleFactor),
      radiusY: Math.round(80 * scaleFactor),
    };
  }
  if (width < 768) {
    return {
      radiusX: Math.round(150 * scaleFactor),
      radiusY: Math.round(100 * scaleFactor),
    };
  }
  return {
    radiusX: Math.round(180 * scaleFactor),
    radiusY: Math.round(120 * scaleFactor),
  };
}

const SSR_RADIUS = { radiusX: 140, radiusY: 90 };

export function PokerCards({
  players,
  currentUserId,
  isRevealed,
}: PokerCardsProps) {
  const count = players.length;
  const compact = count > 8;

  // Scale factor grows with member count, capped at 1.8x
  const scaleFactor = Math.min(1.8, Math.max(1, count / 6));

  const [radius, setRadius] = useState(SSR_RADIUS);

  useEffect(() => {
    const update = () =>
      setRadius(getRadiusForWidth(window.innerWidth, scaleFactor));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [scaleFactor]);

  const { radiusX, radiusY } = radius;

  // Dynamic max-width: base 36rem (xl), scales up with factor
  const tableMaxWidth = `${Math.round(36 * scaleFactor)}rem`;

  return (
    <div
      className="relative w-full aspect-[5/3] flex items-center justify-center px-2 sm:px-0"
      style={{ maxWidth: tableMaxWidth }}
    >
      {/* Table surface */}
      <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] md:rounded-[100px] border-2 border-border bg-card shadow-soft-lg" />
      <div className="absolute inset-2 sm:inset-3 rounded-[50px] sm:rounded-[70px] md:rounded-[90px] border border-border/50 bg-muted/30" />

      {/* Cards arranged radially */}
      {players.map((player, index) => {
        const { x, y } = getRadialPosition(
          index,
          players.length,
          radiusX,
          radiusY,
        );
        return (
          <div
            key={player.id}
            className="absolute transition-all duration-500"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <PokerCard
              memberName={player.name}
              vote={player.vote}
              isRevealed={isRevealed}
              isCurrentUser={player.id === currentUserId}
              compact={compact}
            />
          </div>
        );
      })}
    </div>
  );
}
