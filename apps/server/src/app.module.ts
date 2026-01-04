import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { ModulesModule } from "./modules/modules.module";
import { PokerModule } from "./poker/poker.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PokerModule,
		ModulesModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					name: "short",
					ttl: 60 * 1000,
					limit: 20,
				},
			],
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
