import type { StateCreator } from "zustand";

import { MAX_PLAYERS } from "@/lib/constants/cards";
import { createClient } from "@/lib/supabase/client";
import type { Player, Room } from "../../types";
import type { SessionSlice } from "./session-slice";

const supabase = createClient();

function getSecureRandomIndex(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] ?? 0) % max;
}

function generateRoomCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const alphanumeric = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 3; i++) {
    code += letters[getSecureRandomIndex(letters.length)];
  }
  code += "-";
  for (let i = 0; i < 3; i++) {
    code += alphanumeric[getSecureRandomIndex(alphanumeric.length)];
  }
  return code;
}

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
  const { data: room } = await supabase
    .from("rooms")
    .select("*, players(*)")
    .eq("id", roomId)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!room) return null;

  return {
    id: room.id,
    code: room.code,
    name: room.name,
    isRevealed: room.is_revealed,
    facilitatorId: room.facilitator_id,
    players: mapPlayers(room.players),
  };
}

export interface RoomSlice {
  room: Room | null;
  wasKicked: boolean;
  setRoom: (room: Room | null) => void;
  setWasKicked: (kicked: boolean) => void;
  fetchRoom: (roomId: string) => Promise<Room | null>;
  createRoom: (name: string, userName: string) => Promise<string>;
  joinRoom: (code: string, userName: string) => Promise<string>;
  castVote: (value: string) => Promise<void>;
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

  createRoom: async (name, userName) => {
    const userId = get().currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const code = generateRoomCode();

    const { data: room, error } = await supabase
      .from("rooms")
      .insert({ name, code, facilitator_id: userId })
      .select()
      .single();

    if (error || !room) {
      throw new Error(error?.message ?? "Failed to create room");
    }

    const { error: playerError } = await supabase.from("players").insert({
      room_id: room.id,
      user_id: userId,
      name: userName,
      role: "FACILITATOR",
    });

    if (playerError) {
      throw new Error(playerError.message);
    }

    const fullRoom = await fetchRoomWithPlayers(room.id);
    if (fullRoom) set({ room: fullRoom });
    return room.id;
  },

  joinRoom: async (code, userName) => {
    const userId = get().currentUserId;
    if (!userId) throw new Error("Not authenticated");

    const { data: room } = await supabase
      .from("rooms")
      .select("id")
      .eq("code", code.toUpperCase())
      .gt("expires_at", new Date().toISOString())
      .single();

    if (!room) throw new Error("Room not found");

    // Check player count before joining
    const { count } = await supabase
      .from("players")
      .select("*", { count: "exact", head: true })
      .eq("room_id", room.id);

    // Check if user is already in the room (rejoin case)
    const { data: existingPlayer } = await supabase
      .from("players")
      .select("user_id")
      .eq("room_id", room.id)
      .eq("user_id", userId)
      .single();

    if (!existingPlayer && count !== null && count >= MAX_PLAYERS) {
      throw new Error(`Room is full (max ${MAX_PLAYERS} players)`);
    }

    await supabase
      .from("players")
      .upsert(
        { room_id: room.id, user_id: userId, name: userName, role: "MEMBER" },
        { onConflict: "room_id,user_id" },
      );

    const fullRoom = await fetchRoomWithPlayers(room.id);
    if (fullRoom) set({ room: fullRoom });
    return room.id;
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
      const { error: roomError } = await supabase
        .from("rooms")
        .update({ is_revealed: false })
        .eq("id", room.id);

      const { error: playersError } = await supabase
        .from("players")
        .update({ vote: null })
        .eq("room_id", room.id);

      if (roomError || playersError) set({ room: previousRoom });
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
