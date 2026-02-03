import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMemberSlice, type MemberSlice } from './slices/member-slice';
import { createRoomSlice, type RoomSlice } from './slices/room-slice';
import { createChatSlice, type ChatSlice } from './slices/chat-slice';
import { createUISlice, type UISlice } from './slices/ui-slice';

export type PokerStore = MemberSlice & RoomSlice & ChatSlice & UISlice;

export const usePokerStore = create<PokerStore>()(
  persist(
    (...a) => ({
      ...createMemberSlice(...a),
      ...createRoomSlice(...a),
      ...createChatSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'myscrum-poker',
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        currentUserName: state.currentUserName,
      }),
    },
  ),
);
