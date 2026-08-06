"use client";

import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";
import type { Room } from "@/lib/types";
import { isValidUUID } from "@/lib/validation";

const supabase = createClient();

const VISIBILITY_REFETCH_DELAY_MS = 300;
const RECONNECT_DELAY_MS = 1000;

export function useRoomSync(roomId: string, initialRoom: Room) {
  const {
    setRoom,
    setWasKicked,
    fetchRoom,
    currentUserId,
    setConnectionStatus,
    setIsOnline,
  } = usePokerStore(
    useShallow((s) => ({
      setRoom: s.setRoom,
      setWasKicked: s.setWasKicked,
      fetchRoom: s.fetchRoom,
      currentUserId: s.currentUserId,
      setConnectionStatus: s.setConnectionStatus,
      setIsOnline: s.setIsOnline,
    })),
  );

  const hydrated = useRef(false);
  const previousPlayersRef = useRef<Map<string, string>>(new Map());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibilityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelIdRef = useRef(0);

  // Track player changes (kept for potential future use; currently a no-op)
  const updatePlayerTracking = useCallback(
    (players: Room["players"], _eventType: "INSERT" | "DELETE" | "UPDATE") => {
      previousPlayersRef.current = new Map(players.map((p) => [p.id, p.name]));
    },
    [],
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

  // Create and subscribe to the realtime channel
  const subscribe = useCallback(() => {
    if (!isValidUUID(roomId)) return;

    // Clean up existing channel before re-subscribing
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Use unique channel name to avoid conflicts with async removeChannel
    const channel = supabase
      .channel(`room-${roomId}-${++channelIdRef.current}`)
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
      .on<{ user_id: string }>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Our own row disappearing means we either left or were kicked.
          // Read the flag from the store rather than the closure — the leave
          // may have started after this subscription was created.
          if (
            payload.eventType === "DELETE" &&
            payload.old?.user_id === currentUserId
          ) {
            if (!usePokerStore.getState().isLeaving) {
              setWasKicked(true);
            }
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
      .subscribe((status) => {
        switch (status) {
          case "SUBSCRIBED":
            setConnectionStatus("connected");
            break;
          case "CHANNEL_ERROR":
          case "TIMED_OUT":
            setConnectionStatus("reconnecting");
            break;
          case "CLOSED":
            setConnectionStatus("disconnected");
            break;
        }
      });

    channelRef.current = channel;
  }, [
    roomId,
    currentUserId,
    setRoom,
    setWasKicked,
    fetchRoom,
    updatePlayerTracking,
    setConnectionStatus,
  ]);

  // Main subscription effect
  useEffect(() => {
    subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [subscribe]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus("reconnecting");
      // Clear any pending reconnect before scheduling a new one
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      // Small delay to let the network stabilize, then re-subscribe
      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;
        subscribe();
        fetchRoom(roomId);
      }, RECONNECT_DELAY_MS);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus("disconnected");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [roomId, subscribe, fetchRoom, setIsOnline, setConnectionStatus]);

  // Leave room on browser/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      const blob = new Blob([JSON.stringify({ roomId })], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/rooms/leave", blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [roomId]);

  // Visibility change: re-fetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (visibilityTimerRef.current) {
          clearTimeout(visibilityTimerRef.current);
        }
        // Re-fetch to catch any events missed while the tab was hidden
        visibilityTimerRef.current = setTimeout(() => {
          visibilityTimerRef.current = null;
          fetchRoom(roomId);
        }, VISIBILITY_REFETCH_DELAY_MS);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
        visibilityTimerRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [roomId, fetchRoom]);
}
