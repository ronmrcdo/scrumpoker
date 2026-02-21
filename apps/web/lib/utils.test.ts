import { afterEach, describe, expect, it, vi } from "vitest";
import type { Player } from "./types";
import {
  followRedirectParam,
  generateUUID,
  getRadialPosition,
  getVoteStats,
} from "./utils";

describe("generateUUID", () => {
  it("should generate a valid UUID format", () => {
    const uuid = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  it("should generate unique UUIDs", () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      uuids.add(generateUUID());
    }
    expect(uuids.size).toBe(100);
  });

  it("should always have version 4 in the correct position", () => {
    const uuid = generateUUID();
    expect(uuid[14]).toBe("4");
  });
});

describe("getVoteStats", () => {
  it("should return null for empty players array", () => {
    const result = getVoteStats([]);
    expect(result).toBeNull();
  });

  it("should return null when no players have voted", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "MEMBER", vote: null },
      { id: "2", name: "Bob", role: "MEMBER", vote: null },
    ];
    const result = getVoteStats(players);
    expect(result).toBeNull();
  });

  it("should return null when all votes are coffee breaks", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "MEMBER", vote: "☕" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "☕" },
    ];
    const result = getVoteStats(players);
    expect(result).toBeNull();
  });

  it("should calculate correct stats for numeric votes", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "3" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "5" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "5" },
      { id: "4", name: "Diana", role: "MEMBER", vote: "8" },
    ];
    const result = getVoteStats(players);

    expect(result).not.toBeNull();
    expect(result!.average).toBeCloseTo(5.25, 2);
    expect(result!.mode).toBe("5");
    expect(result!.spread).toBe(5); // 8 - 3
    expect(result!.distribution).toEqual({ "3": 1, "5": 2, "8": 1 });
  });

  it("should detect consensus when 70%+ agree", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "5" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "5" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "5" },
      { id: "4", name: "Diana", role: "MEMBER", vote: "3" },
    ];
    const result = getVoteStats(players);

    expect(result!.consensus).toBe(true); // 3/4 = 75% voted "5"
  });

  it("should not detect consensus when less than 70% agree", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "3" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "5" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "8" },
      { id: "4", name: "Diana", role: "MEMBER", vote: "13" },
    ];
    const result = getVoteStats(players);

    expect(result!.consensus).toBe(false); // All different votes
  });

  it("should ignore coffee break votes in calculations", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "5" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "☕" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "5" },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBe(5);
    expect(result!.mode).toBe("5");
    expect(result!.spread).toBe(0);
    expect(result!.distribution).toEqual({ "5": 2 });
  });

  it("should ignore null votes in calculations", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "3" },
      { id: "2", name: "Bob", role: "MEMBER", vote: null },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "5" },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBe(4);
    expect(result!.distribution).toEqual({ "3": 1, "5": 1 });
  });

  it("should handle single voter correctly", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "8" },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBe(8);
    expect(result!.mode).toBe("8");
    expect(result!.spread).toBe(0);
    expect(result!.consensus).toBe(true); // 100% = 1/1
  });

  it("should handle ties by returning first mode found", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "3" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "5" },
    ];
    const result = getVoteStats(players);

    // Both have count 1, mode should be one of them
    expect(["3", "5"]).toContain(result!.mode);
  });

  it("should calculate correct stats for large Fibonacci numbers", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "13" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "21" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "21" },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBeCloseTo(18.33, 1);
    expect(result!.mode).toBe("21");
    expect(result!.spread).toBe(8);
  });

  it("should handle mixed voted and non-voted players", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "5" },
      { id: "2", name: "Bob", role: "MEMBER", vote: null },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "☕" },
      { id: "4", name: "Diana", role: "MEMBER", vote: "5" },
      { id: "5", name: "Eve", role: "MEMBER", vote: null },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBe(5);
    expect(result!.mode).toBe("5");
    expect(result!.consensus).toBe(true); // 2/2 numeric votes = 100%
  });

  it("should ignore fold votes in calculations", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "5" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "FOLD" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "5" },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBe(5);
    expect(result!.mode).toBe("5");
    expect(result!.spread).toBe(0);
    expect(result!.distribution).toEqual({ "5": 2 });
  });

  it("should return null when all votes are fold", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "MEMBER", vote: "FOLD" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "FOLD" },
    ];
    const result = getVoteStats(players);
    expect(result).toBeNull();
  });

  it("should handle mixed fold, coffee, and numeric votes", () => {
    const players: Player[] = [
      { id: "1", name: "Alice", role: "FACILITATOR", vote: "3" },
      { id: "2", name: "Bob", role: "MEMBER", vote: "FOLD" },
      { id: "3", name: "Charlie", role: "MEMBER", vote: "☕" },
      { id: "4", name: "Diana", role: "MEMBER", vote: "5" },
      { id: "5", name: "Eve", role: "MEMBER", vote: null },
    ];
    const result = getVoteStats(players);

    expect(result!.average).toBe(4);
    expect(result!.distribution).toEqual({ "3": 1, "5": 1 });
  });
});

describe("getRadialPosition", () => {
  it("should position first element at the top (12 o'clock)", () => {
    const { x, y } = getRadialPosition(0, 4, 100, 100);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(-100, 5);
  });

  it("should position second element at 3 o'clock for 4 items", () => {
    const { x, y } = getRadialPosition(1, 4, 100, 100);
    expect(x).toBeCloseTo(100, 5);
    expect(y).toBeCloseTo(0, 5);
  });

  it("should position third element at bottom for 4 items", () => {
    const { x, y } = getRadialPosition(2, 4, 100, 100);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(100, 5);
  });

  it("should position fourth element at 9 o'clock for 4 items", () => {
    const { x, y } = getRadialPosition(3, 4, 100, 100);
    expect(x).toBeCloseTo(-100, 5);
    expect(y).toBeCloseTo(0, 5);
  });

  it("should handle elliptical radius correctly", () => {
    const { x, y } = getRadialPosition(1, 4, 200, 100);
    expect(x).toBeCloseTo(200, 5);
    expect(y).toBeCloseTo(0, 5);
  });

  it("should distribute positions evenly for 6 items", () => {
    const positions = [];
    for (let i = 0; i < 6; i++) {
      positions.push(getRadialPosition(i, 6, 100, 100));
    }

    // Each position should be 60 degrees apart
    // Position 0 at top (-90deg), position 1 at -30deg, etc.
    expect(positions[0]!.y).toBeCloseTo(-100, 5); // Top
    expect(positions[3]!.y).toBeCloseTo(100, 5); // Bottom
  });

  it("should handle single player at top", () => {
    const { x, y } = getRadialPosition(0, 1, 100, 100);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(-100, 5);
  });

  it("should handle large number of players", () => {
    const positions = [];
    for (let i = 0; i < 10; i++) {
      positions.push(getRadialPosition(i, 10, 100, 100));
    }

    // All positions should be within the radius
    for (const pos of positions) {
      expect(Math.abs(pos.x)).toBeLessThanOrEqual(100.001);
      expect(Math.abs(pos.y)).toBeLessThanOrEqual(100.001);
    }
  });

  it("should return 0,0 when radius is 0", () => {
    const { x, y } = getRadialPosition(0, 4, 0, 0);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(0, 5);
  });
});

describe("followRedirectParam", () => {
  const replaceSpy = vi.fn();

  afterEach(() => {
    replaceSpy.mockReset();
    // Restore default location (no query params)
    Object.defineProperty(window, "location", {
      writable: true,
      value: { search: "", replace: replaceSpy },
    });
  });

  function setSearch(search: string) {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { search, replace: replaceSpy },
    });
  }

  it("should redirect to the poker room when redirect param is a valid poker path", () => {
    setSearch("?redirect=/poker/a1b2c3d4-e5f6-7890-abcd-ef1234567890");
    followRedirectParam();
    expect(replaceSpy).toHaveBeenCalledWith(
      "/poker/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    );
  });

  it("should do nothing when there is no redirect param", () => {
    setSearch("");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should do nothing when redirect param does not start with /poker/", () => {
    setSearch("?redirect=/admin/settings");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should do nothing for an external URL disguised as redirect", () => {
    setSearch("?redirect=https://evil.com/poker/room");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should do nothing for protocol-relative redirect", () => {
    setSearch("?redirect=//evil.com/poker/room");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should reject path traversal attempts", () => {
    setSearch("?redirect=/poker/../../admin");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should reject URL-encoded path traversal", () => {
    setSearch("?redirect=/poker/%2e%2e%2fadmin");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should reject poker path without valid UUID segment", () => {
    setSearch("?redirect=/poker/not-a-uuid");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it("should reject bare /poker/ with no room segment", () => {
    setSearch("?redirect=/poker/");
    followRedirectParam();
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});
