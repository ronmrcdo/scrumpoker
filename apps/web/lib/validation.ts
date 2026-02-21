import { z } from "zod";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/** Rejects control characters. Allows all printable Unicode. */
const PRINTABLE_CHARS_REGEX = /^\P{Cc}+$/u;

export const userNameSchema = z
  .string()
  .trim()
  .min(1, "Your name is required")
  .max(50, "Name must be 50 characters or fewer")
  .regex(PRINTABLE_CHARS_REGEX, "Name contains invalid characters");

export const roomNameSchema = z
  .string()
  .trim()
  .min(1, "Room name is required")
  .max(100, "Room name must be 100 characters or fewer")
  .regex(PRINTABLE_CHARS_REGEX, "Room name contains invalid characters");
