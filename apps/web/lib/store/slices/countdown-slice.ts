import type { StateCreator } from "zustand";

export interface CountdownSlice {
  countdownBroadcastCallback: (() => void) | null;
  remoteCountdownTrigger: number;
  setCountdownBroadcastCallback: (callback: (() => void) | null) => void;
  triggerRemoteCountdown: () => void;
  broadcastCountdown: () => void;
}

export const createCountdownSlice: StateCreator<
  CountdownSlice,
  [],
  [],
  CountdownSlice
> = (set, get) => ({
  countdownBroadcastCallback: null,
  remoteCountdownTrigger: 0,

  setCountdownBroadcastCallback: (callback) =>
    set({ countdownBroadcastCallback: callback }),

  triggerRemoteCountdown: () =>
    set((state) => ({
      remoteCountdownTrigger: state.remoteCountdownTrigger + 1,
    })),

  broadcastCountdown: () => {
    const { countdownBroadcastCallback } = get();
    if (countdownBroadcastCallback) {
      countdownBroadcastCallback();
    }
  },
});
