import { WEBSOCKET_EVENTS } from "@scrumpoker/shared-types";

import type { StateCreator } from "zustand";

// We need to define the socket interface loosely or import it if available
interface Socket {
	emit: (event: string, data: any) => void;
}

export type ChatMessage = {
	id: string;
	senderId: string;
	senderName: string;
	text: string;
	timestamp: string;
	type: "User" | "System";
};

export type ChatSlice = {
	chatMessages: ChatMessage[];
	peers: Record<string, RTCPeerConnection>;
	dataChannels: Record<string, RTCDataChannel>;

	addChatMessage: (msg: ChatMessage) => void;

	// P2P Actions
	initializeP2P: (socket: Socket) => void;
	disconnectP2P: () => void;

	connectToPeer: (targetId: string, socket: Socket) => Promise<void>;
	handleSignal: (
		senderId: string,
		signal: any,
		socket: Socket,
	) => Promise<void>;
	destroyPeer: (targetId: string) => void;

	sendChatMessage: (
		text: string,
		senderInfo: { id: string; name: string },
	) => void;
};

const rtcConfig: RTCConfiguration = {
	iceServers: [
		{ urls: "stun:stun.l.google.com:19302" },
		{ urls: "stun:global.stun.twilio.com:3478" },
	],
};

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
	chatMessages: [],
	peers: {},
	dataChannels: {},

	addChatMessage: (msg) => {
		console.log("[Store] Adding chat message:", msg);
		set((state) => ({ chatMessages: [...state.chatMessages, msg] }));
	},

	initializeP2P: (socket) => {
		// This might be where we set up listeners if we passed the socket,
		// but usually listener setup is outside.
		// We actually don't need to do much initialization here
		// other than clearing previous state if any.
		set({ peers: {}, dataChannels: {}, chatMessages: [] });
	},

	disconnectP2P: () => {
		const { peers } = get();
		Object.values(peers).forEach((pc) => pc.close());
		set({ peers: {}, dataChannels: {}, chatMessages: [] });
	},

	connectToPeer: async (targetId, socket) => {
		const { peers } = get();
		if (peers[targetId]) return; // Already connected or connecting

		console.log(`[P2P] Initiating connection to ${targetId}`);
		const pc = new RTCPeerConnection(rtcConfig);

		// Create Data Channel
		const dc = pc.createDataChannel("chat");
		setupDataChannel(dc, targetId, get);

		setupPeerConnection(pc, targetId, socket, set, get);

		// Update state with new peer Immediately to prevent duplicate connections
		set((state) => ({
			peers: { ...state.peers, [targetId]: pc },
			dataChannels: { ...state.dataChannels, [targetId]: dc },
		}));

		try {
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);
			socket.emit(WEBSOCKET_EVENTS.SIGNAL, {
				targetId,
				signal: offer,
			});
		} catch (err) {
			console.error("[P2P] Error creating offer:", err);
		}
	},

	handleSignal: async (senderId, signal, socket) => {
		const { peers } = get();
		let pc = peers[senderId];

		console.log(
			`[P2P] Received signal from ${senderId}`,
			signal.type || "candidate",
		);

		if (!pc) {
			// If we receive an answer or candidate without an offer first, ignore (or handle gracefully)
			// But if it's an offer, we accept it.
			if (signal.type === "offer") {
				console.log(`[P2P] Accepting connection from ${senderId}`);
				pc = new RTCPeerConnection(rtcConfig);

				pc.ondatachannel = (event) => {
					console.log(`[P2P] Received DataChannel from ${senderId}`);
					setupDataChannel(event.channel, senderId, get);
					set((state) => ({
						dataChannels: { ...state.dataChannels, [senderId]: event.channel },
					}));
				};

				setupPeerConnection(pc, senderId, socket, set, get);
				set((state) => ({ peers: { ...state.peers, [senderId]: pc } }));
			} else {
				console.warn(`[P2P] Received orphan signal from ${senderId}`, signal);
				return;
			}
		}

		try {
			if (signal.type === "offer" || signal.type === "answer") {
				await pc.setRemoteDescription(new RTCSessionDescription(signal));
				if (signal.type === "offer") {
					const answer = await pc.createAnswer();
					await pc.setLocalDescription(answer);
					socket.emit(WEBSOCKET_EVENTS.SIGNAL, {
						targetId: senderId,
						signal: answer,
					});
				}
			} else if (signal.candidate) {
				// It's an ICE candidate
				await pc.addIceCandidate(new RTCIceCandidate(signal));
			} else {
				// Assuming it is a candidate object directly
				await pc.addIceCandidate(new RTCIceCandidate(signal));
			}
		} catch (err) {
			console.error("[P2P] Error handling signal:", err);
		}
	},

	destroyPeer: (targetId) => {
		set((state) => {
			const pc = state.peers[targetId];
			if (pc) pc.close();

			const newPeers = { ...state.peers };
			delete newPeers[targetId];

			const newDataChannels = { ...state.dataChannels };
			delete newDataChannels[targetId];

			return { peers: newPeers, dataChannels: newDataChannels };
		});
	},

	sendChatMessage: (text, senderInfo) => {
		const { dataChannels } = get();

		const msg: ChatMessage = {
			id: crypto.randomUUID(),
			senderId: senderInfo.id,
			senderName: senderInfo.name,
			text,
			timestamp: new Date().toLocaleTimeString(),
			type: "User",
		};

		// Optimistic add
		set((state) => ({ chatMessages: [...state.chatMessages, msg] }));

		const payload = JSON.stringify(msg);
		Object.values(dataChannels).forEach((dc) => {
			if (dc.readyState === "open") {
				dc.send(payload);
			}
		});
	},
});

// Helpers
function setupPeerConnection(
	pc: RTCPeerConnection,
	targetId: string,
	socket: Socket,
	set: any,
	get: any,
) {
	pc.onicecandidate = (event) => {
		if (event.candidate) {
			socket.emit(WEBSOCKET_EVENTS.SIGNAL, {
				targetId,
				signal: event.candidate,
			});
		}
	};

	pc.onconnectionstatechange = () => {
		console.log(`[P2P] Connection with ${targetId}: ${pc.connectionState}`);
		if (
			pc.connectionState === "disconnected" ||
			pc.connectionState === "failed"
		) {
			get().destroyPeer(targetId);
		}
	};
}

function setupDataChannel(dc: RTCDataChannel, senderId: string, get: any) {
	dc.onopen = () => {
		console.log(`[P2P] DataChannel open with ${senderId}`);
	};

	dc.onmessage = (event) => {
		try {
			const msg = JSON.parse(event.data) as ChatMessage;
			// Ensure we don't duplicate or we might trust the sender's details?
			// For now, trust the sender's payload but maybe override senderId with the peer ID to be safe?
			console.log(`[P2P] Message from ${senderId}:`, msg);
			get().addChatMessage(msg);
		} catch (e) {
			console.error("Failed to parse P2P message", e);
		}
	};
}
