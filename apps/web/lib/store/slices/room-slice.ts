import type { StateCreator } from "zustand";

import { MAX_PLAYERS } from "@/lib/constants/cards";
import { createClient } from "@/lib/supabase/client";
import type { Player, Room } from "../../types";
import type { ConnectionSlice } from "./connection-slice";
import type { SessionSlice } from "./session-slice";

const supabase = createClient();

interface DbPlayer {
  user_id: string;
  name: string;
  role: string;
  vote: string | null;
}

function toRole(value: string): Player["role"] {
  return value === "FACILITATOR" ? "FACILITATOR" : "MEMBER";
}

function mapPlayers(players: DbPlayer[]): Player[] {
  return players.map((p) => ({
    id: p.user_id,
    name: p.name,
    role: toRole(p.role),
    vote: p.vote,
  }));
}

export async function fetchRoomWithPlayers(
  roomId: string,
): Promise<Room | null> {
  const [roomResult, playersResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("id, name, is_revealed, facilitator_id")
      .eq("id", roomId)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle(),
    supabase
      .from("players_masked")
      .select("user_id, name, role, vote")
      .eq("room_id", roomId),
  ]);

  if (!roomResult.data) return null;

  const room = roomResult.data;
  return {
    id: room.id,
    name: room.name,
    isRevealed: room.is_revealed,
    facilitatorId: room.facilitator_id,
    players: mapPlayers((playersResult.data ?? []) as DbPlayer[]),
  };
}

export interface RoomSlice {
  room: Room | null;
  wasKicked: boolean;
  setRoom: (room: Room | null) => void;
  setWasKicked: (kicked: boolean) => void;
  fetchRoom: (roomId: string) => Promise<Room | null>;
  joinRoom: (roomId: string, userName: string) => Promise<string>;
  castVote: (value: string | null) => Promise<void>;
  toggleReveal: () => Promise<void>;
  resetVotes: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  kickPlayer: (playerId: string) => Promise<void>;
}

export const createRoomSlice: StateCreator<
  SessionSlice & RoomSlice & ConnectionSlice,
  [],
  [],
  RoomSlice
> = (set, get) => ({
  room: null,
  wasKicked: false,

  setRoom: (room) => set({ room }),

  setWasKicked: (kicked) => set({ wasKicked: kicked }),

  fetchRoom: async (roomId) => {
    const room = await fetchRoomWithPlayers(roomId);
    if (room) set({ room });
    return room;
  },

  joinRoom: async (roomId, userName) => {
    const userId = get().currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const { error } = await supabase.rpc("join_room", {
      p_room_id: roomId,
      p_user_name: userName,
      p_max_players: MAX_PLAYERS,
    });

    if (error) {
      throw new Error(error.message);
    }

    const fullRoom = await fetchRoomWithPlayers(roomId);
    if (fullRoom) set({ room: fullRoom });
    return roomId;
  },

  castVote: async (value) => {
    const { room, currentUserId, setLastError } = get();
    if (!room || !currentUserId) return;

    const previousRoom = room;
    set({
      room: {
        ...room,
        players: room.players.map((p) =>
          p.id === currentUserId ? { ...p, vote: value } : p,
        ),
      },
    });

    try {
      // p_vote accepts NULL at the SQL level (clears the vote). The generated
      // type widens to `string`, so cast at the call site.
      const { error } = await supabase.rpc("cast_vote", {
        p_room_id: room.id,
        p_vote: value as string,
      });

      if (error) {
        set({ room: previousRoom });
        setLastError(error.message || "Failed to cast vote");
      }
    } catch (err) {
      set({ room: previousRoom });
      setLastError(err instanceof Error ? err.message : "Failed to cast vote");
    }
  },

  toggleReveal: async () => {
    const { room, setLastError } = get();
    if (!room) return;

    const previousRoom = room;
    const nextRevealed = !previousRoom.isRevealed;
    set({
      room: { ...room, isRevealed: nextRevealed },
    });

    try {
      const { error } = await supabase.rpc("set_room_revealed", {
        p_room_id: room.id,
        p_revealed: nextRevealed,
      });

      if (error) {
        set({ room: previousRoom });
        setLastError(error.message || "Failed to update reveal state");
      }
    } catch (err) {
      set({ room: previousRoom });
      setLastError(
        err instanceof Error ? err.message : "Failed to update reveal state",
      );
    }
  },

  resetVotes: async () => {
    const { room, setLastError } = get();
    if (!room) return;

    const previousRoom = room;
    set({
      room: {
        ...room,
        isRevealed: false,
        players: room.players.map((p) => ({ ...p, vote: null })),
      },
    });

    try {
      const { error } = await supabase.rpc("reset_votes", {
        p_room_id: room.id,
      });

      if (error) {
        set({ room: previousRoom });
        setLastError(error.message || "Failed to reset votes");
      }
    } catch (err) {
      set({ room: previousRoom });
      setLastError(
        err instanceof Error ? err.message : "Failed to reset votes",
      );
    }
  },

  leaveRoom: async () => {
    const { room } = get();
    if (!room) return;

    await supabase.rpc("leave_room", { p_room_id: room.id });
    set({ room: null });
  },

  kickPlayer: async (playerId) => {
    const { room, setLastError } = get();
    if (!room) return;

    const previousRoom = room;
    set({
      room: {
        ...room,
        players: room.players.filter((p) => p.id !== playerId),
      },
    });

    try {
      const { error } = await supabase.rpc("kick_player", {
        p_room_id: room.id,
        p_target_user_id: playerId,
      });

      if (error) {
        set({ room: previousRoom });
        setLastError(error.message || "Failed to kick player");
      }
    } catch (err) {
      set({ room: previousRoom });
      setLastError(
        err instanceof Error ? err.message : "Failed to kick player",
      );
    }
  },
});
