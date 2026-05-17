import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SlidingWindowRateLimiter } from "./rate-limit";

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
