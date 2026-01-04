import { Injectable } from "@nestjs/common";
import { Prisma, PrismaService } from "src/lib/prisma";

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	findById(args: Prisma.UserFindUniqueArgs) {
		return this.prismaService.user.findUnique(args);
	}

	create(args: Prisma.UserCreateArgs) {
		return this.prismaService.user.create(args);
	}
}
