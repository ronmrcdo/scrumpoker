import type { StateCreator } from "zustand";

import { MAX_PLAYERS } from "@/lib/constants/cards";
import { createClient } from "@/lib/supabase/client";
import type { Player, Room } from "../../types";
import type { SessionSlice } from "./session-slice";

const supabase = createClient();

interface DbPlayer {
  user_id: string;
  name: string;
  role: string;
  vote: string | null;
}

function mapPlayers(players: DbPlayer[]): Player[] {
  return players.map((p) => ({
    id: p.user_id,
    name: p.name,
    role: p.role as Player["role"],
    vote: p.vote,
  }));
}

export async function fetchRoomWithPlayers(
  roomId: string,
): Promise<Room | null> {
  // Run both queries in parallel to halve latency
  const [roomResult, playersResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .gt("expires_at", new Date().toISOString())
      .single(),
    supabase.from("players_masked").select("*").eq("room_id", roomId),
  ]);

  if (!roomResult.data) return null;

  const room = roomResult.data;
  return {
    id: room.id,
    code: room.code,
    name: room.name,
    isRevealed: room.is_revealed,
    facilitatorId: room.facilitator_id,
    players: mapPlayers(playersResult.data ?? []),
  };
}

export interface RoomSlice {
  room: Room | null;
  wasKicked: boolean;
  setRoom: (room: Room | null) => void;
  setWasKicked: (kicked: boolean) => void;
  fetchRoom: (roomId: string) => Promise<Room | null>;
  joinRoom: (code: string, userName: string) => Promise<string>;
  castVote: (value: string | null) => Promise<void>;
  toggleReveal: () => Promise<void>;
  resetVotes: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  kickPlayer: (playerId: string) => Promise<void>;
}

export const createRoomSlice: StateCreator<
  SessionSlice & RoomSlice,
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

  joinRoom: async (code, userName) => {
    const userId = get().currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const { data: roomId, error } = await supabase.rpc("join_room", {
      p_room_code: code,
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
    const { room, currentUserId } = get();
    if (!room || !currentUserId) return;

    // Optimistic update
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
      const { error } = await supabase
        .from("players")
        .update({ vote: value })
        .eq("room_id", room.id)
        .eq("user_id", currentUserId);

      if (error) set({ room: previousRoom });
    } catch {
      set({ room: previousRoom });
    }
  },

  toggleReveal: async () => {
    const { room } = get();
    if (!room) return;

    const previousRoom = room;
    set({
      room: { ...room, isRevealed: !room.isRevealed },
    });

    try {
      const { error } = await supabase
        .from("rooms")
        .update({ is_revealed: !previousRoom.isRevealed })
        .eq("id", room.id);

      if (error) set({ room: previousRoom });
    } catch {
      set({ room: previousRoom });
    }
  },

  resetVotes: async () => {
    const { room } = get();
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

      if (error) set({ room: previousRoom });
    } catch {
      set({ room: previousRoom });
    }
  },

  leaveRoom: async () => {
    const { room } = get();
    if (!room) return;

    await supabase.rpc("leave_room", { p_room_id: room.id });
    set({ room: null });
  },

  kickPlayer: async (playerId) => {
    const { room } = get();
    if (!room) return;

    // Optimistic update
    const previousRoom = room;
    set({
      room: {
        ...room,
        players: room.players.filter((p) => p.id !== playerId),
      },
    });

    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("room_id", room.id)
        .eq("user_id", playerId);

      if (error) set({ room: previousRoom });
    } catch {
      set({ room: previousRoom });
    }
  },
});
