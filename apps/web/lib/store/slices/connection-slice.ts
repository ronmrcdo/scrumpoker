import type { StateCreator } from "zustand";

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "disconnected";

export interface ConnectionSlice {
  connectionStatus: ConnectionStatus;
  isOnline: boolean;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsOnline: (online: boolean) => void;
}

export const createConnectionSlice: StateCreator<
  ConnectionSlice,
  [],
  [],
  ConnectionSlice
> = (set) => ({
  connectionStatus: "connecting",
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsOnline: (online) => set({ isOnline: online }),
});
