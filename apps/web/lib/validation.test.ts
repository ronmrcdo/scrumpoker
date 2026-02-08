import { describe, expect, it } from "vitest";
import { isValidUUID } from "./validation";

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
