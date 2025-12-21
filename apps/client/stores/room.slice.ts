import type { TMember, TRoom } from "@scrumpoker/shared-types";
import type { StateCreator } from "zustand";

export type TRoomSerialize = Omit<TRoom, "members"> & { members: TMember[] };

export type RoomSlice = {
	room: TRoomSerialize | null;
	setRoom: (room: TRoomSerialize) => void;
	clearRoom: () => void;
};

export const createRoomSlice: StateCreator<RoomSlice, [], [], RoomSlice> = (
	set,
) => ({
	room: null,
	setRoom: (room) => set({ room }),
	clearRoom: () => set({ room: null }),
});
