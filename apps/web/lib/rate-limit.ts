/**
 * Sliding window rate limiter keyed by IP address.
 *
 * Uses Redis (via Upstash REST API or self-hosted serverless-redis-http)
 * when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are configured,
 * giving consistent counters across multiple app instances. Falls back to a
 * per-process in-memory store otherwise (useful for local dev and tests).
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number | null;
}

interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  prefix: string;
}

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
  reset(): void;
  destroy(): void;
}

// ── In-memory implementation (fallback / tests) ──────────────────────────────

const CLEANUP_INTERVAL_MS = 60_000;
const FAILURE_LOG_INTERVAL_MS = 60_000;

export class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, number[]>();
  private windowMs: number;
  private maxRequests: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: Pick<RateLimiterOptions, "windowMs" | "maxRequests">) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.startCleanup();
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    const timestamps = this.store.get(key) ?? [];
    const valid = timestamps.filter((t) => t > cutoff);

    if (valid.length >= this.maxRequests) {
      const oldestInWindow = valid[0] ?? now;
      const retryAfterMs = oldestInWindow + this.windowMs - now;

      this.store.set(key, valid);
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(retryAfterMs, 0),
      };
    }

    valid.push(now);
    this.store.set(key, valid);

    return {
      allowed: true,
      remaining: this.maxRequests - valid.length,
      retryAfterMs: null,
    };
  }

  private startCleanup() {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const cutoff = now - this.windowMs;

      for (const [key, timestamps] of this.store) {
        const newest = timestamps[timestamps.length - 1];
        if (newest === undefined || newest <= cutoff) {
          this.store.delete(key);
        }
      }
    }, CLEANUP_INTERVAL_MS);

    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  reset() {
    this.store.clear();
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.store.clear();
  }
}

// Backward-compat alias — existing tests import this name.
export const SlidingWindowRateLimiter = InMemoryRateLimiter;

// ── Redis-backed implementation (production) ─────────────────────────────────

/**
 * Redis is best-effort: it makes counters consistent across instances, but it
 * is not a correctness dependency. If the REST endpoint is unreachable or
 * misconfigured, `limit()` rejects — so every call is guarded and degrades to
 * the per-process in-memory limiter instead of taking the route down.
 */
export class RedisRateLimiter implements RateLimiter {
  private limiter: Ratelimit;
  private fallback: InMemoryRateLimiter;
  private lastFailureLoggedAt = 0;

  constructor(redis: Redis, options: RateLimiterOptions) {
    const windowSeconds = Math.max(1, Math.round(options.windowMs / 1_000));
    this.limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        options.maxRequests,
        `${windowSeconds} s`,
      ),
      analytics: false,
      prefix: options.prefix,
    });
    this.fallback = new InMemoryRateLimiter(options);
  }

  async check(key: string): Promise<RateLimitResult> {
    try {
      const result = await this.limiter.limit(key);
      return {
        allowed: result.success,
        remaining: Math.max(0, result.remaining),
        retryAfterMs: result.success
          ? null
          : Math.max(result.reset - Date.now(), 0),
      };
    } catch (error) {
      this.logFailure(error);
      return this.fallback.check(key);
    }
  }

  /** Throttled so a sustained Redis outage cannot flood the logs. */
  private logFailure(error: unknown) {
    const now = Date.now();
    if (now - this.lastFailureLoggedAt < FAILURE_LOG_INTERVAL_MS) return;
    this.lastFailureLoggedAt = now;
    console.error(
      "[rate-limit] Redis unavailable, falling back to in-memory limiting:",
      error instanceof Error ? error.message : error,
    );
  }

  reset() {
    this.fallback.reset();
  }

  destroy() {
    /* The Redis client manages its own connection lifecycle. */
    this.fallback.destroy();
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

function buildRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const sharedRedis = buildRedisClient();

function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  if (sharedRedis) {
    return new RedisRateLimiter(sharedRedis, options);
  }
  return new InMemoryRateLimiter(options);
}

export const roomCreationLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 5,
  prefix: "rl:room-create",
});

export const joinRoomLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 10,
  prefix: "rl:room-join",
});

export const leaveRoomLimiter = createRateLimiter({
  windowMs: 10_000,
  maxRequests: 20,
  prefix: "rl:room-leave",
});
