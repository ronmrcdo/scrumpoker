import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockRpc,
  mockGetUser,
  mockCreateClient,
  mockLimiterCheck,
  mockValidateAntiBot,
} = vi.hoisted(() => ({
  mockRpc: vi.fn(),
  mockGetUser: vi.fn(),
  mockCreateClient: vi.fn(),
  mockLimiterCheck: vi.fn(),
  mockValidateAntiBot: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: mockCreateClient,
}));
vi.mock("@/lib/rate-limit", () => ({
  joinRoomLimiter: { check: mockLimiterCheck },
}));
vi.mock("@/lib/anti-bot", () => ({
  validateAntiBot: mockValidateAntiBot,
}));

import { NextRequest } from "next/server";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/rooms/join", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  roomId: "11111111-2222-3333-4444-555555555555",
  userName: "Bob",
  hp: "",
  formLoadedAt: Date.now() - 5_000,
};

describe("POST /api/rooms/join", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLimiterCheck.mockResolvedValue({
      allowed: true,
      remaining: 9,
      retryAfterMs: null,
    });
    mockValidateAntiBot.mockReturnValue({ passed: true });
    mockCreateClient.mockResolvedValue({
      auth: { getUser: mockGetUser },
      rpc: mockRpc,
    });
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockRpc.mockResolvedValue({ data: null, error: null });
  });

  it("returns 429 when rate limited", async () => {
    mockLimiterCheck.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 30_000,
    });
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");
  });

  it("returns 400 for invalid JSON body", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest("garbage"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid roomId", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest({ ...validBody, roomId: "not-a-uuid" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing userName", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest({ ...validBody, userName: "" }));
    expect(res.status).toBe(400);
  });

  it("returns 422 when anti-bot fails", async () => {
    mockValidateAntiBot.mockReturnValue({ passed: false, reason: "timing" });
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(422);
  });

  it("returns 401 when unauthenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(401);
  });

  it("returns 500 when RPC errors", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "Room full" } });
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Room full");
  });

  it("returns ok on success and calls join_room RPC", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(mockRpc).toHaveBeenCalledWith("join_room", {
      p_room_id: validBody.roomId,
      p_user_name: "Bob",
      p_max_players: 10,
    });
  });
});
