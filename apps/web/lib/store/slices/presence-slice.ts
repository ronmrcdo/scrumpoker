import type { StateCreator } from "zustand";

export interface PresenceSlice {
  onlinePlayerIds: Set<string>;
  setOnlinePlayerIds: (ids: Set<string>) => void;
  addOnlinePlayer: (id: string) => void;
  removeOnlinePlayer: (id: string) => void;
  clearPresence: () => void;
}

export const createPresenceSlice: StateCreator<
  PresenceSlice,
  [],
  [],
  PresenceSlice
> = (set, get) => ({
  onlinePlayerIds: new Set<string>(),

  setOnlinePlayerIds: (ids) => set({ onlinePlayerIds: ids }),

  addOnlinePlayer: (id) => {
    const next = new Set(get().onlinePlayerIds);
    next.add(id);
    set({ onlinePlayerIds: next });
  },

  removeOnlinePlayer: (id) => {
    const next = new Set(get().onlinePlayerIds);
    next.delete(id);
    set({ onlinePlayerIds: next });
  },

  clearPresence: () => set({ onlinePlayerIds: new Set<string>() }),
});
