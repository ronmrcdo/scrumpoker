import { describe, expect, it } from "vitest";
import { CARD_SUITS, FOLD_VALUE, isRedSuit, suitFor } from "./cards";

describe("cards constants", () => {
  describe("suitFor", () => {
    it("returns spade fallback for null", () => {
      expect(suitFor(null)).toBe("♠");
    });

    it("returns spade fallback for FOLD", () => {
      expect(suitFor(FOLD_VALUE)).toBe("♠");
    });

    it("returns the suit for each known card", () => {
      for (const [value, suit] of Object.entries(CARD_SUITS)) {
        expect(suitFor(value)).toBe(suit);
      }
    });

    it("returns spade fallback for unknown values", () => {
      expect(suitFor("not-a-card")).toBe("♠");
      expect(suitFor("")).toBe("♠");
    });
  });

  describe("isRedSuit", () => {
    it("is true for hearts and diamonds", () => {
      expect(isRedSuit("♥")).toBe(true);
      expect(isRedSuit("♦")).toBe(true);
    });

    it("is false for spades and clubs", () => {
      expect(isRedSuit("♠")).toBe(false);
      expect(isRedSuit("♣")).toBe(false);
    });

    it("is false for arbitrary strings", () => {
      expect(isRedSuit("X")).toBe(false);
      expect(isRedSuit("")).toBe(false);
    });
  });
});
