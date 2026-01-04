import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GuestLogin, Token } from "./schema/token";
import { UserType } from "../../lib/prisma/@generated/client";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	private async signToken(payload: Token) {
		return this.jwtService.signAsync(payload);
	}

	async guestLogin(payload: GuestLogin) {
		const user = await this.usersService.create({
			data: {
				name: payload.name,
				type: UserType.GUEST,
			},
			select: {
				id: true,
				type: true,
			},
		});

		const token = await this.signToken({
			sub: user.id,
			userType: user.type,
		});

		return {
			user,
			token,
		};
	}
}
