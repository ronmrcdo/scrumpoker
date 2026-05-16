import { describe, expect, it } from "vitest";
import { isValidUUID, roomNameSchema, userNameSchema } from "./validation";

describe("isValidUUID", () => {
  it("accepts valid v4 UUIDs", () => {
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("accepts uppercase UUIDs", () => {
    expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidUUID("")).toBe(false);
  });

  it("rejects SQL injection attempts", () => {
    expect(isValidUUID("'; DROP TABLE rooms;--")).toBe(false);
  });

  it("rejects partial UUIDs", () => {
    expect(isValidUUID("550e8400-e29b")).toBe(false);
  });

  it("rejects UUIDs without dashes", () => {
    expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(false);
  });

  it("rejects random strings", () => {
    expect(isValidUUID("not-a-uuid-at-all")).toBe(false);
  });
});

describe("userNameSchema", () => {
  it("accepts a valid name", () => {
    const result = userNameSchema.safeParse("Alice");
    expect(result.success).toBe(true);
  });

  it("rejects empty string", () => {
    const result = userNameSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only string", () => {
    const result = userNameSchema.safeParse("   ");
    expect(result.success).toBe(false);
  });

  it("trims leading and trailing whitespace", () => {
    const result = userNameSchema.safeParse("  Alice  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Alice");
    }
  });

  it("rejects strings longer than 50 characters", () => {
    const result = userNameSchema.safeParse("a".repeat(51));
    expect(result.success).toBe(false);
  });

  it("accepts name exactly 50 characters", () => {
    const result = userNameSchema.safeParse("a".repeat(50));
    expect(result.success).toBe(true);
  });

  it("rejects control characters", () => {
    expect(userNameSchema.safeParse("Alice\x00").success).toBe(false);
    expect(userNameSchema.safeParse("Alice\x1F").success).toBe(false);
    expect(userNameSchema.safeParse("Alice\x7F").success).toBe(false);
  });

  it("accepts names with Unicode letters", () => {
    expect(userNameSchema.safeParse("Björn Ångström").success).toBe(true);
  });

  it("accepts names with basic punctuation", () => {
    expect(userNameSchema.safeParse("O'Brien-Smith").success).toBe(true);
  });

  it("provides a meaningful error for empty input", () => {
    const result = userNameSchema.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Your name is required");
    }
  });

  it("provides a meaningful error for exceeding max length", () => {
    const result = userNameSchema.safeParse("a".repeat(51));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Name must be 50 characters or fewer",
      );
    }
  });
});

describe("roomNameSchema", () => {
  it("accepts a valid room name", () => {
    const result = roomNameSchema.safeParse("Sprint 42: API Refactoring");
    expect(result.success).toBe(true);
  });

  it("rejects empty string", () => {
    const result = roomNameSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only string", () => {
    const result = roomNameSchema.safeParse("   ");
    expect(result.success).toBe(false);
  });

  it("trims leading and trailing whitespace", () => {
    const result = roomNameSchema.safeParse("  Sprint 42  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Sprint 42");
    }
  });

  it("rejects strings longer than 100 characters", () => {
    const result = roomNameSchema.safeParse("a".repeat(101));
    expect(result.success).toBe(false);
  });

  it("accepts name exactly 100 characters", () => {
    const result = roomNameSchema.safeParse("a".repeat(100));
    expect(result.success).toBe(true);
  });

  it("rejects control characters", () => {
    expect(roomNameSchema.safeParse("Room\x00Name").success).toBe(false);
  });

  it("accepts room names with colons and numbers", () => {
    expect(roomNameSchema.safeParse("Sprint 42: API Refactoring").success).toBe(
      true,
    );
  });

  it("provides a meaningful error for empty input", () => {
    const result = roomNameSchema.safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Room name is required");
    }
  });

  it("provides a meaningful error for exceeding max length", () => {
    const result = roomNameSchema.safeParse("a".repeat(101));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Room name must be 100 characters or fewer",
      );
    }
  });
});
