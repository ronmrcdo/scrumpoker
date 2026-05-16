"use client";

import { memo, useMemo } from "react";

import type { Player } from "@/lib/types";
import { FxFeltTable, FxSeat } from "./motion-fx";
import { PokerCard } from "./poker-card";

interface PokerCardsProps {
  players: Player[];
  currentUserId: string;
  isRevealed: boolean;
  countdown?: number | null;
}

// Position other-players around the top arc (-150° to -30° from center)
function seatPosition(index: number, total: number) {
  if (total <= 0) {
    return { left: "50%", top: "50%" } as const;
  }
  const startAngle = -150;
  const endAngle = -30;
  const step = total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
  const angle = total === 1 ? -90 : startAngle + step * index;
  const rad = (angle * Math.PI) / 180;
  const rx = 38; // % of table width radius
  const ry = 36; // % of table height radius
  const x = 50 + rx * Math.cos(rad);
  const y = 50 + ry * Math.sin(rad);
  return { left: `${x}%`, top: `${y}%` } as const;
}

interface SeatProps {
  player: Player;
  index: number;
  total: number;
  isRevealed: boolean;
  isCurrentUser: boolean;
}

const Seat = memo(function Seat({
  player,
  index,
  total,
  isRevealed,
  isCurrentUser,
}: SeatProps) {
  const pos = useMemo(() => seatPosition(index, total), [index, total]);
  // Positioning is on a plain wrapper so its translate(-50%, -50%) doesn't
  // collide with FxSeat's motion.div scale/opacity transform.
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pos.left, top: pos.top }}
    >
      <FxSeat index={index}>
        <PokerCard
          memberName={player.name}
          vote={player.vote}
          isRevealed={isRevealed}
          isCurrentUser={isCurrentUser}
        />
      </FxSeat>
    </div>
  );
});

export function PokerCards({
  players,
  currentUserId,
  isRevealed,
  countdown,
}: PokerCardsProps) {
  const yourSeat = useMemo(
    () => players.find((p) => p.id === currentUserId),
    [players, currentUserId],
  );
  const others = useMemo(
    () => players.filter((p) => p.id !== currentUserId),
    [players, currentUserId],
  );

  return (
    <FxFeltTable className="w-full">
      <div
        className="relative w-full max-w-[820px] mx-auto rounded-3xl border border-rule bg-bone-2"
        style={{ aspectRatio: "820 / 360", minHeight: 280 }}
      >
        {countdown != null && countdown > 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span
              key={countdown}
              aria-hidden="true"
              className="text-6xl sm:text-7xl md:text-8xl font-semibold text-foreground/80 animate-countdown-pulse"
            >
              {countdown}
            </span>
            <span className="sr-only" aria-live="assertive" aria-atomic="true">
              {`Revealing cards in ${countdown}`}
            </span>
          </div>
        )}

        {/* Other players' seats around the top arc */}
        {others.map((player, i) => (
          <Seat
            key={player.id}
            player={player}
            index={i}
            total={others.length}
            isRevealed={isRevealed}
            isCurrentUser={false}
          />
        ))}

        {/* "Your" seat at the bottom-center, slightly pulled below the felt to mirror the top arc */}
        {yourSeat && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: -16 }}
          >
            <FxSeat index={others.length}>
              <PokerCard
                memberName={yourSeat.name}
                vote={yourSeat.vote}
                isRevealed={isRevealed}
                isCurrentUser={true}
              />
            </FxSeat>
          </div>
        )}
      </div>
      {/* Spacer for the bottom-overlap of your seat */}
      <div aria-hidden="true" className="h-8 sm:h-10" />
    </FxFeltTable>
  );
}
