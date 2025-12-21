import { create } from "zustand";
import { createRoomSlice, type RoomSlice } from "./room.slice";
import { createMemberSlice, type MemberSlice } from "./member.slice";

const useBoundStore = create<RoomSlice & MemberSlice>()((...a) => ({
	...createRoomSlice(...a),
	...createMemberSlice(...a),
}));

export default useBoundStore;
