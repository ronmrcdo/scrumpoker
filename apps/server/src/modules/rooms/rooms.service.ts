import { Injectable } from "@nestjs/common";
import { Prisma, PrismaService } from "src/lib/prisma";

@Injectable()
export class RoomsService {
	constructor(private readonly prisma: PrismaService) {}

	async findById(args: Prisma.RoomFindUniqueArgs) {
		return this.prisma.room.findUnique(args);
	}

	async create(args: Prisma.RoomCreateArgs) {
		return this.prisma.room.create(args);
	}
}
