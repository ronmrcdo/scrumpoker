import type { StateCreator } from "zustand";

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "disconnected";

export interface ConnectionSlice {
  connectionStatus: ConnectionStatus;
  isOnline: boolean;
  lastError: string | null;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setIsOnline: (online: boolean) => void;
  setLastError: (message: string | null) => void;
}

export const createConnectionSlice: StateCreator<
  ConnectionSlice,
  [],
  [],
  ConnectionSlice
> = (set) => ({
  connectionStatus: "connecting",
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  lastError: null,

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setIsOnline: (online) => set({ isOnline: online }),
  setLastError: (message) => set({ lastError: message }),
});
