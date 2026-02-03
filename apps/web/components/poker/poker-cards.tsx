"use client";

import type { Member } from "@/lib/types";
import { getRadialPosition } from "@/lib/utils";
import { PokerCard } from "./poker-card";

interface PokerCardsProps {
  members: Member[];
  currentUserId: string;
  isRevealed: boolean;
}

export function PokerCards({ members, currentUserId, isRevealed }: PokerCardsProps) {
  const count = members.length;
  const compact = count > 8;

  // Scale factor grows with member count, capped at 1.8x
  const scaleFactor = Math.min(1.8, Math.max(1, count / 6));

  const getResponsiveRadius = () => {
    if (typeof window === 'undefined') return { radiusX: 140, radiusY: 90 };
    const width = window.innerWidth;
    if (width < 640) {
      return { radiusX: Math.round(120 * scaleFactor), radiusY: Math.round(80 * scaleFactor) };
    } else if (width < 768) {
      return { radiusX: Math.round(150 * scaleFactor), radiusY: Math.round(100 * scaleFactor) };
    } else {
      return { radiusX: Math.round(180 * scaleFactor), radiusY: Math.round(120 * scaleFactor) };
    }
  };

  const { radiusX, radiusY } = getResponsiveRadius();

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
      {members.map((member, index) => {
        const { x, y } = getRadialPosition(index, members.length, radiusX, radiusY);
        return (
          <div
            key={member.id}
            className="absolute transition-all duration-500"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <PokerCard
              memberName={member.name}
              vote={member.vote}
              isRevealed={isRevealed}
              isCurrentUser={member.id === currentUserId}
              compact={compact}
            />
          </div>
        );
      })}
    </div>
  );
}
