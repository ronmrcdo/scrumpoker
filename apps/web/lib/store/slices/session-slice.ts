import type { StateCreator } from "zustand";

export interface SessionSlice {
  currentUserId: string;
  sessionInitialized: boolean;
  setCurrentUserId: (id: string) => void;
  setSessionInitialized: (initialized: boolean) => void;
}

export const createSessionSlice: StateCreator<
  SessionSlice,
  [],
  [],
  SessionSlice
> = (set) => ({
  currentUserId: "",
  sessionInitialized: false,
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setSessionInitialized: (initialized) =>
    set({ sessionInitialized: initialized }),
});
