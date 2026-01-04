import type { StateCreator } from "zustand";

export type ThemeSlice = {
	isChatOpen: boolean;
	setIsChatOpen: (open: boolean) => void;
	toggleChat: () => void;
};
export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
	isChatOpen: true,
	setIsChatOpen: (open: boolean) => set({ isChatOpen: open }),
	toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
});
