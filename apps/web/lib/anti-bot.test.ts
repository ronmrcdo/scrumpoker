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

    it("treats whitespace-only honeypot as empty", () => {
      const result = validateAntiBot({
        hp: "   ",
        formLoadedAt: Date.now() - 5_000,
      });
      expect(result.passed).toBe(true);
    });
  });

  describe("timing", () => {
    it("rejects submissions faster than 3 seconds", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 500,
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("timing");
    });

    it("rejects submissions just under the 3-second threshold", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 2_999,
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

  describe("stale forms", () => {
    it("rejects submissions older than 1 hour", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 7_200_000, // 2h ago
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("stale");
    });

    it("accepts submissions inside the 1-hour window", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 1_800_000, // 30m ago
      });
      expect(result.passed).toBe(true);
    });
  });

  describe("clock skew", () => {
    it("rejects submissions with a far-future formLoadedAt", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() + 300_000, // 5m in the future
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("clock-skew");
    });

    it("tolerates small future skew (<= 60s)", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() + 30_000, // 30s in the future, still fails timing
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("timing");
    });
  });

  describe("priority ordering", () => {
    it("honeypot check runs before any timing/stale/skew check", () => {
      const result = validateAntiBot({
        hp: "bot-value",
        formLoadedAt: Date.now(),
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("honeypot");
    });

    it("clock-skew check runs before stale and timing checks", () => {
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() + 600_000, // 10m future
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("clock-skew");
    });

    it("stale check runs before timing check", () => {
      // 2h in the past → stale, not timing (timing would accept this anyway)
      const result = validateAntiBot({
        hp: "",
        formLoadedAt: Date.now() - 7_200_000,
      });
      expect(result.passed).toBe(false);
      expect(result.reason).toBe("stale");
    });
  });
});
