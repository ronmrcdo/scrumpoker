import { z } from "zod";
import { memberSchema } from "./member";

export const roomSchema = z.object({
	id: z.string(),
	code: z.string(),
	name: z.string(),
	isRevealed: z.boolean(),
	facilitatorId: z.string(),
	members: z.map(z.string(), memberSchema),
});

export type TRoom = z.infer<typeof roomSchema>;
