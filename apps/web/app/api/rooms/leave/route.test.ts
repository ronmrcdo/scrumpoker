import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockRpc, mockGetUser, mockCreateClient, mockLimiterCheck } = vi.hoisted(
  () => ({
    mockRpc: vi.fn(),
    mockGetUser: vi.fn(),
    mockCreateClient: vi.fn(),
    mockLimiterCheck: vi.fn(),
  }),
);

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mockCreateClient,
}));

vi.mock("@/lib/rate-limit", () => ({
  leaveRoomLimiter: { check: mockLimiterCheck },
}));

import { POST } from "./route";

const VALID_ROOM_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/rooms/leave", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/rooms/leave", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimiterCheck.mockReturnValue({
      allowed: true,
      remaining: 19,
      retryAfterMs: null,
    });
    mockCreateClient.mockResolvedValue({
      auth: { getUser: mockGetUser },
      rpc: mockRpc,
    });
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockRpc.mockResolvedValue({ data: null, error: null });
  });

  it("returns 429 when rate limit exceeded", async () => {
    mockLimiterCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 5_000,
    });
    const res = await POST(makeRequest({ roomId: VALID_ROOM_ID }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("5");
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid UUID", async () => {
    const res = await POST(makeRequest({ roomId: "not-a-uuid" }));
    expect(res.status).toBe(400);
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const res = await POST(makeRequest({ roomId: VALID_ROOM_ID }));
    expect(res.status).toBe(401);
  });

  it("returns 500 if RPC errors", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "boom" } });
    const res = await POST(makeRequest({ roomId: VALID_ROOM_ID }));
    expect(res.status).toBe(500);
  });

  it("returns ok on success", async () => {
    const res = await POST(makeRequest({ roomId: VALID_ROOM_ID }));
    expect(res.status).toBe(200);
    expect(mockRpc).toHaveBeenCalledWith("leave_room", {
      p_room_id: VALID_ROOM_ID,
    });
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });
});
