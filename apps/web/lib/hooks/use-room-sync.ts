"use client";

import { useCallback, useEffect, useRef } from "react";

import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";
import type { Room } from "@/lib/types";

const supabase = createClient();

export function useRoomSync(roomId: string, initialRoom: Room) {
  const setRoom = usePokerStore((s) => s.setRoom);
  const setWasKicked = usePokerStore((s) => s.setWasKicked);
  const fetchRoom = usePokerStore((s) => s.fetchRoom);
  const addSystemMessage = usePokerStore((s) => s.addSystemMessage);
  const currentUserId = usePokerStore((s) => s.currentUserId);
  const hydrated = useRef(false);
  const previousPlayersRef = useRef<Map<string, string>>(new Map());

  // Track player changes for detecting joins and leaves
  const updatePlayerTracking = useCallback(
    (players: Room["players"], eventType: "INSERT" | "DELETE" | "UPDATE") => {
      const currentPlayers = new Map(players.map((p) => [p.id, p.name]));
      const prevPlayers = previousPlayersRef.current;

      if (eventType === "INSERT") {
        // Find new players (not including self)
        for (const player of players) {
          if (!prevPlayers.has(player.id) && player.id !== currentUserId) {
            addSystemMessage(`${player.name} joined the room`);
          }
        }
      } else if (eventType === "DELETE") {
        // Find players who left (not including self)
        for (const [playerId, playerName] of prevPlayers) {
          if (!currentPlayers.has(playerId) && playerId !== currentUserId) {
            addSystemMessage(`${playerName} left the room`);
          }
        }
      }

      previousPlayersRef.current = currentPlayers;
    },
    [currentUserId, addSystemMessage],
  );

  // Hydrate store with server-fetched data on mount
  useEffect(() => {
    if (!hydrated.current) {
      setRoom(initialRoom);
      // Initialize player tracking with initial players
      previousPlayersRef.current = new Map(
        initialRoom.players.map((p) => [p.id, p.name]),
      );
      hydrated.current = true;
    }
  }, [initialRoom, setRoom]);

  // Subscribe to Postgres Changes on rooms and players tables
  useEffect(() => {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setRoom(null);
            return;
          }
          fetchRoom(roomId);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Check if current user was kicked
          if (
            payload.eventType === "DELETE" &&
            (payload.old as Record<string, unknown>)?.user_id === currentUserId
          ) {
            setWasKicked(true);
            setRoom(null);
            return;
          }
          const updatedRoom = await fetchRoom(roomId);
          if (
            updatedRoom &&
            (payload.eventType === "INSERT" || payload.eventType === "DELETE")
          ) {
            updatePlayerTracking(updatedRoom.players, payload.eventType);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    roomId,
    currentUserId,
    setRoom,
    setWasKicked,
    fetchRoom,
    updatePlayerTracking,
  ]);
}
