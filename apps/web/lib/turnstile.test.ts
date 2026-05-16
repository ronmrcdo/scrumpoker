import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { verifyTurnstileToken } from "./turnstile";

describe("verifyTurnstileToken", () => {
  const originalEnv = process.env.TURNSTILE_SECRET_KEY;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalEnv !== undefined) {
      process.env.TURNSTILE_SECRET_KEY = originalEnv;
    } else {
      delete process.env.TURNSTILE_SECRET_KEY;
    }
  });

  it("returns success when Cloudflare responds with success", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    (globalThis.fetch as Mock).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    const result = await verifyTurnstileToken("valid-token");
    expect(result.success).toBe(true);
  });

  it("returns failure when Cloudflare responds with failure", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    (globalThis.fetch as Mock).mockResolvedValue({
      json: async () => ({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
    });

    const result = await verifyTurnstileToken("bad-token");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("invalid-input-response");
  });

  it("sends remoteip to Cloudflare when provided", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    (globalThis.fetch as Mock).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    await verifyTurnstileToken("token", "1.2.3.4");

    const callBody = (globalThis.fetch as Mock).mock.calls[0]?.[1]?.body;
    expect(callBody).toContain("remoteip=1.2.3.4");
  });

  it("sends secret and response in request body", async () => {
    process.env.TURNSTILE_SECRET_KEY = "my-secret";
    (globalThis.fetch as Mock).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    await verifyTurnstileToken("my-token");

    const callBody = (globalThis.fetch as Mock).mock.calls[0]?.[1]?.body;
    expect(callBody).toContain("secret=my-secret");
    expect(callBody).toContain("response=my-token");
  });

  it("bypasses verification in non-production when secret key is missing", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;

    const result = await verifyTurnstileToken("any-token");
    expect(result.success).toBe(true);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("fails in production when secret key is missing", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";

    const result = await verifyTurnstileToken("any-token");
    expect(result.success).toBe(false);
    expect(result.errorCodes).toContain("missing-secret-key");
    expect(globalThis.fetch).not.toHaveBeenCalled();

    (process.env as Record<string, string | undefined>).NODE_ENV =
      originalNodeEnv;
  });
});
