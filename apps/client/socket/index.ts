"use client";

import { io, type Socket } from "socket.io-client";

const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8111";

let socket: Socket;

export const getSocket = (): Socket => {
	if (!socket) {
		socket = io(SERVER_URL, {
			transports: ["websocket"],
			autoConnect: false,
		});
	}
	return socket;
};
