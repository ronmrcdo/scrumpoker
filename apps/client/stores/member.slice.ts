import { StateCreator } from "zustand";

export type MemberSlice = {
	id: string | null;
	setId: (id: string) => void;
	clearId: () => void;
};

export const createMemberSlice: StateCreator<
	MemberSlice,
	[],
	[],
	MemberSlice
> = (set) => ({
	id: null,
	setId: (id) => set({ id }),
	clearId: () => set({ id: null }),
});
