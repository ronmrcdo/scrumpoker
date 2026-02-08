import { describe, expect, it, vi } from "vitest";

import { validateAntiBot } from "./anti-bot";

describe("validateAntiBot", () => {
  describe("honeypot", () => {
    it("passes when honeypot is empty", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 5_000,
      });
      expect(result.passed).toBe(true);
    });

    it("rejects when honeypot is filled", () => {
      const result = validateAntiBot({
        hp: "https://spam.example.com",
        formLoadedAt: Date.now() - 5_000,
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("honeypot");
    });

    it("rejects when honeypot has only whitespace", () => {
      // Whitespace-only is treated as empty (trimmed)
      const result = validateAntiBot({
        hp: "   ",
        formLoadedAt: Date.now() - 5_000,
      });
      expect(result.passed).toBe(true);
    });
  });

  describe("timing", () => {
    it("rejects submissions faster than 2 seconds", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 500,
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("timing");
    });

    it("accepts submissions at normal human speed", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 5_000,
      });
      expect(result.passed).toBe(true);
    });

    it("accepts submissions that took several minutes", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 300_000,
      });
      expect(result.passed).toBe(true);
    });

    it("rejects at exactly 0ms elapsed", () => {
      vi.useFakeTimers();
      const now = Date.now();
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: now,
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("timing");
      vi.useRealTimers();
    });
  });

  describe("combined checks", () => {
    it("honeypot check runs before timing check", () => {
      // Both would fail, but honeypot should be the reported reason
      const result = validateAntiBot({
        hp: "bot-value",
        formLoadedAt: Date.now(),
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("honeypot");
    });
  });
});
