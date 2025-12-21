import { WEBSOCKET_EVENTS } from "@scrumpoker/shared-types";
import { getSocket } from "./";

export const socketCommands = {
	createRoom: (name: string) => {
		getSocket().emit(WEBSOCKET_EVENTS.CREATE_ROOM, { name });
	},

	joinRoom: (
		code: string,
		name: string,
		callback?: (res?: { error?: { code: string; message: string } }) => void,
	) => {
		getSocket().emit(
			WEBSOCKET_EVENTS.JOIN_ROOM,
			{ code, name },
			(res?: { error?: { code: string; message: string } }) => {
				callback?.(res);
			},
		);
	},

	vote: (code: string, vote: string) => {
		getSocket().emit(WEBSOCKET_EVENTS.VOTE, { code, vote });
	},

	reveal: (code: string) => {
		getSocket().emit(WEBSOCKET_EVENTS.REVEAL, { code });
	},

	hide: (code: string) => {
		getSocket().emit(WEBSOCKET_EVENTS.HIDE, { code });
	},

	reset: (code: string) => {
		getSocket().emit(WEBSOCKET_EVENTS.RESET, { code });
	},

	leave: (code: string) => {
		getSocket().emit(WEBSOCKET_EVENTS.LEAVE, { code });
	},
};
