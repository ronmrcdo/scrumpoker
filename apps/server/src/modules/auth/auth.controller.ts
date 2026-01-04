import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import type { GuestLoginDto } from "./dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Throttle({ short: { limit: 2, ttl: 60000 }})
  @Post('auth/login-guest')
  async loginGuest(@Body() body: GuestLoginDto) {
    return this.authService.guestLogin(body);
  }

	@UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async me(@Request() req) {
    return req.user;
  }
}
