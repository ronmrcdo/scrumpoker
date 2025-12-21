import { z } from "zod";

export const joinRoomSchema = z.object({
	code: z
		.string()
		.min(6, "Code must be at least 6 characters long")
		.max(32, "Code must be at most 32 characters long"),
	name: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(50, "Name must be at most 50 characters long"),
});

export const createRoomSchema = z.object({
	code: z.string().optional(),
	name: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(50, "Name must be at most 50 characters long"),
});

export type JoinRoomSchema = z.infer<typeof joinRoomSchema>;
export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
