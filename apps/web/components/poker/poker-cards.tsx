"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import type { Player } from "@/lib/types";
import { getRadialPosition } from "@/lib/utils";
import { PokerCard } from "./poker-card";

interface PokerCardsProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
  countdown?: number | null;
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

// Memoized player card to prevent unnecessary re-renders and recalculations
interface PlayerCardProps {
  player: Player;
  index: number;
  totalPlayers: number;
  radiusX: number;
  radiusY: number;
  isRevealed: boolean;
  isCurrentUser: boolean;
  compact: boolean;
}

const PlayerCard = memo(function PlayerCard({
  player,
  index,
  totalPlayers,
  radiusX,
  radiusY,
  isRevealed,
  isCurrentUser,
  compact,
}: PlayerCardProps) {
  // Memoize position calculation
  const position = useMemo(
    () => getRadialPosition(index, totalPlayers, radiusX, radiusY),
    [index, totalPlayers, radiusX, radiusY],
  );

  // Memoize style object to prevent recreation
  const style = useMemo(
    () => ({
      transform: `translate(${position.x}px, ${position.y}px)`,
    }),
    [position.x, position.y],
  );

  return (
    <div className="absolute transition-transform duration-500" style={style}>
      <PokerCard
        memberName={player.name}
        vote={player.vote}
        isRevealed={isRevealed}
        isCurrentUser={isCurrentUser}
        compact={compact}
      />
    </div>
  );
});

export function PokerCards({
  players,
  currentUserId,
  isRevealed,
  countdown,
}: PokerCardsProps) {
  const count = players.length;
  const compact = count > 8;

  // Scale factor grows with member count, capped at 1.8x
  const scaleFactor = useMemo(
    () => Math.min(1.8, Math.max(1, count / 6)),
    [count],
  );

  const [radius, setRadius] = useState(SSR_RADIUS);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const update = () => {
      // Debounce resize updates to prevent excessive re-renders
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setRadius(getRadiusForWidth(window.innerWidth, scaleFactor));
      }, 150);
    };

    // Initial update without debounce
    setRadius(getRadiusForWidth(window.innerWidth, scaleFactor));

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scaleFactor]);

  const { radiusX, radiusY } = radius;

  // Memoize style object to prevent new reference on every render
  const tableStyle = useMemo(
    () => ({ maxWidth: `${Math.round(36 * scaleFactor)}rem` }),
    [scaleFactor],
  );

  return (
    <div
      className="relative w-full aspect-[5/3] flex items-center justify-center px-2 sm:px-0"
      style={tableStyle}
    >
      {/* Table surface */}
      <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] md:rounded-[100px] border-2 border-border bg-card shadow-soft-lg" />
      <div className="absolute inset-2 sm:inset-3 rounded-[50px] sm:rounded-[70px] md:rounded-[90px] border border-border/50 bg-muted/30" />

      {/* Countdown overlay */}
      {countdown != null && countdown > 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span
            key={countdown}
            className="text-6xl sm:text-7xl md:text-8xl font-bold text-foreground/80 animate-countdown-pulse"
          >
            {countdown}
          </span>
        </div>
      )}

      {/* Cards arranged radially */}
      {players.map((player, index) => (
        <PlayerCard
          key={player.id}
          player={player}
          index={index}
          totalPlayers={players.length}
          radiusX={radiusX}
          radiusY={radiusY}
          isRevealed={isRevealed}
          isCurrentUser={player.id === currentUserId}
          compact={compact}
        />
      ))}
    </div>
  );
}
