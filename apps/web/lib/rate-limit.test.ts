import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockLimit } = vi.hoisted(() => ({ mockLimit: vi.fn() }));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow = () => ({});
    limit = mockLimit;
  },
}));

import { RedisRateLimiter, SlidingWindowRateLimiter } from "./rate-limit";

describe("SlidingWindowRateLimiter (in-memory fallback)", () => {
  let limiter: InstanceType<typeof SlidingWindowRateLimiter>;

  beforeEach(() => {
    vi.useFakeTimers();
    limiter = new SlidingWindowRateLimiter({
      windowMs: 60_000,
      maxRequests: 3,
    });
  });

  afterEach(() => {
    limiter.destroy();
    vi.useRealTimers();
  });

  it("allows requests under the limit", async () => {
    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(result.retryAfterMs).toBeNull();
  });

  it("tracks remaining count correctly", async () => {
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("blocks requests at the limit", async () => {
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");

    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThanOrEqual(0);
  });

  it("allows requests after the window expires", async () => {
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");

    // Advance past the window
    vi.advanceTimersByTime(61_000);

    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("tracks IPs independently", async () => {
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");

    const blocked = await limiter.check("1.2.3.4");
    expect(blocked.allowed).toBe(false);

    const other = await limiter.check("5.6.7.8");
    expect(other.allowed).toBe(true);
    expect(other.remaining).toBe(2);
  });

  it("returns a positive retryAfterMs when blocked", async () => {
    await limiter.check("1.2.3.4");
    vi.advanceTimersByTime(10_000);
    await limiter.check("1.2.3.4");
    vi.advanceTimersByTime(10_000);
    await limiter.check("1.2.3.4");

    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(false);
    // The oldest request was ~20s ago, window is 60s, so ~40s remaining
    expect(result.retryAfterMs).toBeGreaterThan(30_000);
    expect(result.retryAfterMs).toBeLessThanOrEqual(60_000);
  });

  it("reset clears all entries", async () => {
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    limiter.reset();

    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });
});

describe("RedisRateLimiter", () => {
  let limiter: RedisRateLimiter;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    limiter = new RedisRateLimiter({} as never, {
      windowMs: 60_000,
      maxRequests: 3,
      prefix: "rl:test",
    });
  });

  afterEach(() => {
    limiter.destroy();
    mockLimit.mockReset();
    vi.restoreAllMocks();
  });

  it("uses the Redis verdict when the call succeeds", async () => {
    mockLimit.mockResolvedValue({ success: true, remaining: 2, reset: 0 });

    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  // Regression: an unreachable Redis/SRH endpoint made check() reject, which
  // bubbled out of the route handler as a bare 500 with an empty body.
  it("does not reject when Redis is unreachable", async () => {
    mockLimit.mockRejectedValue(new Error("fetch failed"));

    await expect(limiter.check("1.2.3.4")).resolves.toMatchObject({
      allowed: true,
    });
  });

  it("falls back to in-memory limiting while Redis is unreachable", async () => {
    mockLimit.mockRejectedValue(new Error("fetch failed"));

    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");
    await limiter.check("1.2.3.4");

    const blocked = await limiter.check("1.2.3.4");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);

    const other = await limiter.check("5.6.7.8");
    expect(other.allowed).toBe(true);
  });

  it("resumes using Redis once it recovers", async () => {
    mockLimit.mockRejectedValueOnce(new Error("fetch failed"));
    mockLimit.mockResolvedValue({ success: false, remaining: 0, reset: 0 });

    await limiter.check("1.2.3.4");
    const result = await limiter.check("1.2.3.4");
    expect(result.allowed).toBe(false);
  });
});
