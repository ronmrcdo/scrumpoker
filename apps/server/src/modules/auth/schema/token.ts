import z from "zod";
import { UserType } from "../../../lib/prisma/@generated/enums";

export const tokenSchema = z.object({
	sub: z.uuid(),
	userType: z.enum(UserType),
});

export type Token = z.infer<typeof tokenSchema>;

export const guestLoginSchema = z.object({
	name: z.string().min(1).max(255),
});

export type GuestLogin = z.infer<typeof guestLoginSchema>;
