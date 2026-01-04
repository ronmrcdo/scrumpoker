import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SocketAdapter } from "./lib/socket/socket.adapter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: process.env.POKER_CLIENT_URL,
		credentials: true,
	});

	app.useGlobalPipes(new ValidationPipe());

	app.useWebSocketAdapter(new SocketAdapter(app));

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
