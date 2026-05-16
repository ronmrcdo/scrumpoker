import type { StateCreator } from "zustand";

export interface UISlice {
  isPlayerListOpen: boolean;
  isHydrated: boolean;
  togglePlayerList: () => void;
  setPlayerListOpen: (open: boolean) => void;
  initializeUI: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  isPlayerListOpen: false,
  isHydrated: false,

  togglePlayerList: () =>
    set((state) => ({ isPlayerListOpen: !state.isPlayerListOpen })),
  setPlayerListOpen: (open) => set({ isPlayerListOpen: open }),

  initializeUI: () => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 768;
      set({
        isPlayerListOpen: isDesktop,
        isHydrated: true,
      });
    }
  },
});
