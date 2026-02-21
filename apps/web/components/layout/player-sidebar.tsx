"use client";

import { cn } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { trackEvent } from "@/lib/analytics";
import { usePokerStore } from "@/lib/store/poker-store";
import { PlayerList } from "../players/player-list";

export function PlayerSidebar() {
  const router = useRouter();
  const {
    room,
    isPlayerListOpen,
    togglePlayerList,
    leaveRoom,
    kickPlayer,
    currentUserId,
    onlinePlayerIds,
  } = usePokerStore(
    useShallow((s) => ({
      room: s.room,
      isPlayerListOpen: s.isPlayerListOpen,
      togglePlayerList: s.togglePlayerList,
      leaveRoom: s.leaveRoom,
      kickPlayer: s.kickPlayer,
      currentUserId: s.currentUserId,
      onlinePlayerIds: s.onlinePlayerIds,
    })),
  );

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isPlayerListOpen) {
      const focusTarget = sidebarRef.current?.querySelector<HTMLElement>(
        "button, a, input, [tabindex]",
      );
      focusTarget?.focus();
    }
  }, [isPlayerListOpen]);

  if (!room) return null;

  const isFacilitator = room.facilitatorId === currentUserId;

  const handleLeave = async () => {
    trackEvent("room_left", {
      room_id: room.id,
      player_role: isFacilitator ? "FACILITATOR" : "MEMBER",
      player_count: room.players.length,
    });
    await leaveRoom();
    router.push("/");
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <button
        type="button"
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden cursor-default",
          "transition-opacity duration-300",
          isPlayerListOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={togglePlayerList}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            togglePlayerList();
          }
        }}
        aria-label="Close player list"
        tabIndex={-1}
      />
      <aside
        ref={sidebarRef}
        className={cn(
          "border-r border-border bg-card shrink-0 overflow-hidden",
          "transition-all duration-300 ease-in-out",
          // Desktop
          "md:relative md:z-0",
          isPlayerListOpen ? "md:w-64" : "md:w-0 md:border-r-0",
          // Mobile
          "fixed left-0 top-[57px] bottom-0 w-[280px] z-50 md:top-0",
          isPlayerListOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="h-full overflow-y-auto pb-safe">
          <PlayerList
            players={room.players}
            currentUserId={currentUserId}
            isRevealed={room.isRevealed}
            isFacilitator={isFacilitator}
            onlinePlayerIds={onlinePlayerIds}
            onLeave={handleLeave}
            onKick={(playerId) => {
              trackEvent("player_kicked", {
                room_id: room.id,
                player_count_after: room.players.length - 1,
              });
              kickPlayer(playerId);
            }}
          />
        </div>
      </aside>
    </>
  );
}
