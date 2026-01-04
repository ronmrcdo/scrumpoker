import type { TRoom } from "../schema";
import type { Event } from "./event.types";
import type { WebsocketEventType } from "./poker.events";

export type RoomCreatedEvent = Event<
	WebsocketEventType["CREATE_ROOM"],
	Pick<TRoom, "name">
>;

export type UserJoinedEvent = Event<
	WebsocketEventType["JOIN_ROOM"],
	Pick<TRoom, "code" | "name">
>;

export type UserVotedEvent = Event<
	WebsocketEventType["VOTE"],
	Pick<TRoom, "code"> & { vote: string }
>;

export type RoomRevealedEvent = Event<
	WebsocketEventType["REVEAL"],
	Pick<TRoom, "code">
>;

export type RoomResetEvent = Event<
	WebsocketEventType["RESET"],
	Pick<TRoom, "code">
>;

export type RoomStateEvent = Event<WebsocketEventType["ROOM_STATE"], TRoom>;

export type SignalEvent = Event<
	WebsocketEventType["SIGNAL"],
	{
		targetId: string;
		signal: unknown;
		senderId?: string;
	}
>;

export type ClientJoinedEvent = Event<
	WebsocketEventType["CLIENT_JOIN"],
	{
		clients: string[];
	}
>;
