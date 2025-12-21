import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  type TMember,
  type TRoom,
  UserJoinedEvent,
  UserVotedEvent,
  RoomRevealedEvent,
  RoomResetEvent,
} from "@scrumpoker/shared-types";
import { WEBSOCKET_EVENTS } from "../const/websocket-events";

@WebSocketGateway({ cors: { origin: "*" } })
export class PokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server!: Server;

	private rooms = new Map<string, TRoom>();

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		for (const [code, room] of this.rooms.entries()) {
			if (room.members.has(client.id)) {
				room.members.delete(client.id);
				this.server.to(code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));

        if (room.members.size === 0) {
          this.rooms.delete(code);
        }
				break;
			}
		}
	}

  @SubscribeMessage(WEBSOCKET_EVENTS.LEAVE)
  handleLeaveRoom(
    @MessageBody() payload: UserJoinedEvent["payload"],
    @ConnectedSocket() client: Socket,
  ) {
    const { code } = payload;
    const room = this.rooms.get(code);
    if (room?.members.has(client.id)) {
      room.members.delete(client.id);
      this.server.to(code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));

      if (room.members.size === 0) {
        this.rooms.delete(code);
      }
    }
  }

  @SubscribeMessage(WEBSOCKET_EVENTS.CREATE_ROOM)
  handleCreateRoom(
    @MessageBody() payload: UserJoinedEvent["payload"],
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = payload;

    const room: TRoom = {
      id: uuidv4(),
      code: Math.random().toString(36).substring(2, 8).padEnd(6, '0'),
      name,
      isRevealed: false,
      facilitatorId: client.id,
      members: new Map<string, TMember>(),
    };
    this.rooms.set(room.code, room);

    client.join(room.code);

    this.handleJoinRoom({ code: room.code, name }, client);
  }

	@SubscribeMessage(WEBSOCKET_EVENTS.JOIN_ROOM)
	handleJoinRoom(
		@MessageBody() payload: UserJoinedEvent["payload"],
		@ConnectedSocket() client: Socket,
	) {
		const { code, name } = payload;

    const room = this.rooms.get(code);
    if (!room) {
      return {
        error: {
          code: 'ROOM_NOT_FOUND',
          message:'Room does not exist'
        }
      }
    }

    if (room.members.size >= 5) {
      return {
        error: {
          code: 'ROOM_FULL',
          message:'Room is full'
        }
      }
    }

		client.join(code);

		const member: TMember = {
			id: client.id,
			name,
			role: room.facilitatorId === client.id ? "FACILITATOR" : "MEMBER",
			vote: null,
		};
		room.members.set(client.id, member);

		this.server.to(room.code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));
	}

	@SubscribeMessage(WEBSOCKET_EVENTS.VOTE)
	handleVote(
		@MessageBody() payload: UserVotedEvent["payload"],
		@ConnectedSocket() client: Socket,
	) {
		const { code, vote } = payload;
		const room = this.rooms.get(code);
		if (room?.members.has(client.id)) {
			const member = room.members.get(client.id);
			if (member) {
				member.vote = vote;
				this.server.to(code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));
			}
		}
	}

  @SubscribeMessage(WEBSOCKET_EVENTS.HIDE)
  handleHide(
    @MessageBody() payload: RoomRevealedEvent["payload"],
    @ConnectedSocket() client: Socket
  ) {
    const { code } = payload;
    const room = this.rooms.get(code);
    if (room?.members.has(client.id) && room.facilitatorId === client.id) {
      room.isRevealed = false;
      this.server.to(code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));
    }
  }

	@SubscribeMessage(WEBSOCKET_EVENTS.REVEAL)
	handleReveal(
    @MessageBody() payload: RoomRevealedEvent["payload"],
    @ConnectedSocket() client: Socket
  ) {
		const { code } = payload;
		const room = this.rooms.get(code);
		if (room?.members.has(client.id) && room.facilitatorId === client.id) {
			room.isRevealed = true;
			this.server.to(code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));
		}
	}

	@SubscribeMessage(WEBSOCKET_EVENTS.RESET)
	handleReset(
    @MessageBody() payload: RoomResetEvent["payload"],
    @ConnectedSocket() client: Socket
  ) {
		const { code } = payload;
		const room = this.rooms.get(code);
		if (room?.members.has(client.id) && room.facilitatorId === client.id) {
			room.isRevealed = false;
			for (const member of room.members.values()) {
				member.vote = null;
			}
			this.server.to(code).emit(WEBSOCKET_EVENTS.ROOM_STATE, this.serializeRoom(room));
		}
	}

  private serializeRoom(room: TRoom) {
    return {
      ...room,
      members: Array.from(room.members.values())
    };
  }
}
