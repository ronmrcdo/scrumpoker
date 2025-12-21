"use client";

import { WEBSOCKET_EVENTS } from "@scrumpoker/shared-types";
import { useEffect } from "react";

import { getSocket } from "@/socket";
import useBoundStore from "@/stores";

export const useSocketBindings = () => {
	useEffect(() => {
		const socketInstance = getSocket();

		function onConnect() {
			if (socketInstance.id) {
				useBoundStore.getState().setId(socketInstance.id);
			}
			console.log("connected id", socketInstance.id);
		}

		function onDisconnect() {
			console.log("disconnected");
		}

		socketInstance.on("connect", onConnect);
		socketInstance.on("disconnect", onDisconnect);
		socketInstance.on(
			WEBSOCKET_EVENTS.ROOM_STATE,
			useBoundStore.getState().setRoom,
		);

		socketInstance.connect();

		return () => {
			socketInstance.off("connect", onConnect);
			socketInstance.off("disconnect", onDisconnect);
			socketInstance.off(
				WEBSOCKET_EVENTS.ROOM_STATE,
				useBoundStore.getState().clearRoom,
			);
			socketInstance.disconnect();
		};
	}, []);
};
