import type { StateCreator } from "zustand";

export interface UISlice {
  isChatOpen: boolean;
  isPlayerListOpen: boolean;
  isHydrated: boolean;
  toggleChat: () => void;
  togglePlayerList: () => void;
  setChatOpen: (open: boolean) => void;
  setPlayerListOpen: (open: boolean) => void;
  initializeUI: () => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  // Initialize to false for SSR safety
  isChatOpen: false,
  isPlayerListOpen: false,
  isHydrated: false,

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  togglePlayerList: () =>
    set((state) => ({ isPlayerListOpen: !state.isPlayerListOpen })),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setPlayerListOpen: (open) => set({ isPlayerListOpen: open }),

  // Initialize UI based on screen size (call this client-side only)
  initializeUI: () => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 768;
      set({
        isChatOpen: isDesktop,
        isPlayerListOpen: isDesktop,
        isHydrated: true,
      });
    }
  },
});
