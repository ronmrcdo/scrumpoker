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
		socketInstance.on(WEBSOCKET_EVENTS.ROOM_STATE, (room) => {
			useBoundStore.getState().setRoom(room);
		});

		socketInstance.on(WEBSOCKET_EVENTS.CLIENT_JOIN, (payload) => {
			const activeClientIds = payload.clients;

			// Connect to new peers
			activeClientIds.forEach((clientId: string) => {
				if (
					socketInstance.id &&
					clientId !== socketInstance.id &&
					clientId < socketInstance.id
				) {
					useBoundStore.getState().connectToPeer(clientId, socketInstance);
				}
			});

			// Cleanup disconnected peers
			const currentPeerIds = Object.keys(useBoundStore.getState().peers);
			currentPeerIds.forEach((peerId) => {
				if (!activeClientIds.includes(peerId)) {
					console.log(`[P2P] Cleaning up disconnected peer: ${peerId}`);
					useBoundStore.getState().destroyPeer(peerId);
				}
			});
		});
		socketInstance.on(WEBSOCKET_EVENTS.SIGNAL, (payload) => {
			useBoundStore
				.getState()
				.handleSignal(payload.senderId, payload.signal, socketInstance);
		});

		socketInstance.connect();

		return () => {
			socketInstance.off("connect", onConnect);
			socketInstance.off("disconnect", onDisconnect);
			socketInstance.off(
				WEBSOCKET_EVENTS.ROOM_STATE,
				useBoundStore.getState().clearRoom,
			);
			socketInstance.off(WEBSOCKET_EVENTS.SIGNAL);
			socketInstance.disconnect();
		};
	}, []);
};
