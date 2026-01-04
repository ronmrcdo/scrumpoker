import { Module } from "@nestjs/common";
import { PrismaModule } from "src/lib/prisma";

import { RoomsService } from "./rooms.service";

@Module({
	imports: [PrismaModule],
	providers: [RoomsService],
})
export class RoomsModule {}
