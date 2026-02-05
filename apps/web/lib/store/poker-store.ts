import { create } from "zustand";
import { type ChatSlice, createChatSlice } from "./slices/chat-slice";
import { createRoomSlice, type RoomSlice } from "./slices/room-slice";
import { createSessionSlice, type SessionSlice } from "./slices/session-slice";
import { createUISlice, type UISlice } from "./slices/ui-slice";

export type PokerStore = SessionSlice & RoomSlice & ChatSlice & UISlice;

export const usePokerStore = create<PokerStore>()((...a) => ({
  ...createSessionSlice(...a),
  ...createRoomSlice(...a),
  ...createChatSlice(...a),
  ...createUISlice(...a),
}));
