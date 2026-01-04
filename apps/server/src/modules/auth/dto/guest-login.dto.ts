import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GuestLoginDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(60)
	name!: string;
}
