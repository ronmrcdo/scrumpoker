import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions } from "socket.io";

export class SocketAdapter extends IoAdapter {
	createIOServer(port: number, options?: ServerOptions): Server {
		const server = super.createIOServer(port, options);
		return server;
	}
}
