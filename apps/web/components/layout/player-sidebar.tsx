"use client";

import { cn } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
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

  const roomId = room?.id ?? "";
  const playerCount = room?.players.length ?? 0;
  const isFacilitator = room ? room.facilitatorId === currentUserId : false;

  const handleLeave = useCallback(async () => {
    if (!room) return;
    trackEvent("room_left", {
      room_id: room.id,
      player_role: isFacilitator ? "FACILITATOR" : "MEMBER",
      player_count: room.players.length,
    });
    await leaveRoom();
    router.push("/");
  }, [room, isFacilitator, leaveRoom, router]);

  const handleKick = useCallback(
    (playerId: string) => {
      trackEvent("player_kicked", {
        room_id: roomId,
        player_count_after: Math.max(playerCount - 1, 0),
      });
      kickPlayer(playerId);
    },
    [roomId, playerCount, kickPlayer],
  );

  if (!room) return null;

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
        id="player-sidebar"
        aria-label="Player list"
        aria-hidden={!isPlayerListOpen}
        inert={!isPlayerListOpen}
        onKeyDown={(e) => {
          if (e.key === "Escape") togglePlayerList();
        }}
        className={cn(
          "border-r border-rule bg-card shrink-0 overflow-hidden",
          "transition-all duration-300 ease-in-out",
          // Desktop
          "md:relative md:z-0",
          isPlayerListOpen ? "md:w-72" : "md:w-0 md:border-r-0",
          // Mobile
          "fixed left-0 top-[57px] bottom-0 w-[300px] z-50 md:top-0",
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
            roomId={room.id}
            onlinePlayerIds={onlinePlayerIds}
            onLeave={handleLeave}
            onKick={handleKick}
          />
        </div>
      </aside>
    </>
  );
}
