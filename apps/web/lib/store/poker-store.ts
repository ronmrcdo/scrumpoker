import { create } from "zustand";
import {
  type ConnectionSlice,
  createConnectionSlice,
} from "./slices/connection-slice";
import {
  type CountdownSlice,
  createCountdownSlice,
} from "./slices/countdown-slice";
import {
  createPresenceSlice,
  type PresenceSlice,
} from "./slices/presence-slice";
import { createRoomSlice, type RoomSlice } from "./slices/room-slice";
import { createSessionSlice, type SessionSlice } from "./slices/session-slice";
import { createUISlice, type UISlice } from "./slices/ui-slice";

export type PokerStore = SessionSlice &
  RoomSlice &
  CountdownSlice &
  UISlice &
  ConnectionSlice &
  PresenceSlice;

export const usePokerStore = create<PokerStore>()((...a) => ({
  ...createSessionSlice(...a),
  ...createRoomSlice(...a),
  ...createCountdownSlice(...a),
  ...createUISlice(...a),
  ...createConnectionSlice(...a),
  ...createPresenceSlice(...a),
}));
