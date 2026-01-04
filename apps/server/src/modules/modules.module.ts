import { Module } from "@nestjs/common";

import { AuthModule } from "./auth";
import { RoomsModule } from "./rooms";
import { UsersModule } from "./users";

@Module({
	imports: [AuthModule, UsersModule, RoomsModule],
})
export class ModulesModule {}
