"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";

const PRESENCE_GRACE_PERIOD_MS = 60_000;

interface PresencePayload {
  userId: string;
  name: string;
}

export function usePresenceSync(roomId: string | null) {
  const { currentUserId, room, setOnlinePlayerIds, clearPresence, kickPlayer } =
    usePokerStore(
      useShallow((s) => ({
        currentUserId: s.currentUserId,
        room: s.room,
        setOnlinePlayerIds: s.setOnlinePlayerIds,
        clearPresence: s.clearPresence,
        kickPlayer: s.kickPlayer,
      })),
    );

  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());
  const graceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  // Track names so we can identify them after disconnect
  const playerNamesRef = useRef<Map<string, string>>(new Map());

  const clearAllTimers = useCallback(() => {
    for (const timer of graceTimersRef.current.values()) {
      clearTimeout(timer);
    }
    graceTimersRef.current.clear();
  }, []);

  useEffect(() => {
    if (!roomId || !currentUserId) return;

    const supabase = supabaseRef.current;
    const channelName = `presence:${roomId}`;

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<PresencePayload>();
      const onlineIds = new Set<string>();
      for (const key of Object.keys(state)) {
        onlineIds.add(key);
        const presences = state[key];
        const first = presences?.[0];
        if (first) {
          playerNamesRef.current.set(key, first.name);
        }
      }
      setOnlinePlayerIds(onlineIds);
    });

    channel.on(
      "presence",
      { event: "join" },
      ({
        key,
        newPresences,
      }: {
        key: string;
        newPresences: PresencePayload[];
      }) => {
        if (key === currentUserId) return;

        const existingTimer = graceTimersRef.current.get(key);
        if (existingTimer) {
          clearTimeout(existingTimer);
          graceTimersRef.current.delete(key);
        }

        if (newPresences[0]?.name) {
          playerNamesRef.current.set(key, newPresences[0].name);
        }
      },
    );

    channel.on(
      "presence",
      { event: "leave" },
      ({ key }: { key: string; leftPresences: PresencePayload[] }) => {
        if (key === currentUserId) return;

        const existingLeaveTimer = graceTimersRef.current.get(key);
        if (existingLeaveTimer) {
          clearTimeout(existingLeaveTimer);
        }

        const timer = setTimeout(() => {
          graceTimersRef.current.delete(key);
          const currentRoom = usePokerStore.getState().room;
          const isFacilitator = currentRoom?.facilitatorId === currentUserId;
          if (isFacilitator) {
            kickPlayer(key);
          }
        }, PRESENCE_GRACE_PERIOD_MS);

        graceTimersRef.current.set(key, timer);
      },
    );

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        channelRef.current = channel;
        const currentRoom = usePokerStore.getState().room;
        const currentPlayer = currentRoom?.players.find(
          (p) => p.id === currentUserId,
        );
        await channel.track({
          userId: currentUserId,
          name: currentPlayer?.name ?? "Unknown",
        });
      }
    });

    return () => {
      clearAllTimers();
      channelRef.current = null;
      channel.untrack();
      supabase.removeChannel(channel);
      clearPresence();
    };
  }, [
    roomId,
    currentUserId,
    setOnlinePlayerIds,
    clearPresence,
    kickPlayer,
    clearAllTimers,
  ]);

  useEffect(() => {
    if (!room) return;
    const playerIds = new Set(room.players.map((p) => p.id));
    for (const [playerId, timer] of graceTimersRef.current) {
      if (!playerIds.has(playerId)) {
        clearTimeout(timer);
        graceTimersRef.current.delete(playerId);
      }
    }
  }, [room]);
}
