import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createIdentitySlice, type IdentitySlice } from "./identity.slice";
import { createMemberSlice, type MemberSlice } from "./member.slice";
import { createRoomSlice, type RoomSlice } from "./room.slice";
import { createThemeSlice, type ThemeSlice } from "./theme.slice";
import { createChatSlice, type ChatSlice } from "./chat.slice";

const useBoundStore = create<
	RoomSlice & MemberSlice & ThemeSlice & IdentitySlice & ChatSlice
>()(
	persist(
		(...a) => ({
			...createRoomSlice(...a),
			...createMemberSlice(...a),
			...createThemeSlice(...a),
			...createIdentitySlice(...a),
			...createChatSlice(...a),
		}),
		{
			name: "scrumpoker-storage",
			partialize: (state) => ({
				clientId: state.clientId,
			}),
		},
	),
);

export default useBoundStore;
