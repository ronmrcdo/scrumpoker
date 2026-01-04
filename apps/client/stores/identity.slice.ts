import type { StateCreator } from "zustand";

export interface IdentitySlice {
	clientId: string;
	name: string | null;
	generateClientId: () => void;
	setName: (name: string) => void;
}

export const createIdentitySlice: StateCreator<
	IdentitySlice,
	[],
	[],
	IdentitySlice
> = (set) => ({
	clientId: "",
	name: null,
	generateClientId: () =>
		set((state) => (state.clientId ? {} : { clientId: crypto.randomUUID() })),
	setName: (name: string) => set({ name }),
});
