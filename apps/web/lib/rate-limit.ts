/**
 * In-memory sliding window rate limiter keyed by IP address.
 *
 * NOTE: This works for single-process deployments (Docker, VPS). For
 * serverless/edge (Vercel Functions), each cold start gets a fresh store —
 * swap this for Redis/Upstash KV if you need distributed rate limiting.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number | null;
}

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

const DEFAULT_WINDOW_MS = 60_000; // 1 minute
const DEFAULT_MAX_REQUESTS = 5;
const CLEANUP_INTERVAL_MS = 60_000;

export class SlidingWindowRateLimiter {
  private store = new Map<string, number[]>();
  private windowMs: number;
  private maxRequests: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: RateLimitOptions = {}) {
    this.windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
    this.maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS;
    this.startCleanup();
  }

  check(key: string): RateLimitResult {
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
    // Avoid starting the interval in test environments or if already started
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

    // Allow the Node.js process to exit without waiting for cleanup
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /** Visible for testing — clear all entries */
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

/** Singleton used by the API route handler */
export const roomCreationLimiter = new SlidingWindowRateLimiter({
  windowMs: DEFAULT_WINDOW_MS,
  maxRequests: DEFAULT_MAX_REQUESTS,
});

/** Higher-cap limiter for the leave-room beacon endpoint */
export const leaveRoomLimiter = new SlidingWindowRateLimiter({
  windowMs: 10_000,
  maxRequests: 20,
});
