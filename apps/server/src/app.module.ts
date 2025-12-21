import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PokerModule } from "./poker/poker.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PokerModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
