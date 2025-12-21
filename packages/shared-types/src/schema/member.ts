import { z } from "zod";

const rolesEnum = z.enum(["FACILITATOR", "MEMBER"]);

export const memberSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: rolesEnum,
	vote: z.string().nullable(),
});

export type TMember = z.infer<typeof memberSchema>;
