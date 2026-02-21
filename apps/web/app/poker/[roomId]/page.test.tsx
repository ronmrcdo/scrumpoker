import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.hoisted runs before vi.mock hoisting — safe for shared references
const { notFoundMock, mockSingle, mockPlayersEq, mockRpc, mockFrom } =
  vi.hoisted(() => {
    const notFoundMock = vi.fn();
    const mockSingle = vi.fn();
    const mockGt = vi.fn(() => ({ single: mockSingle }));
    const mockEqChained = vi.fn(() => ({ gt: mockGt }));
    const mockSelect = vi.fn(() => ({ eq: mockEqChained }));

    const mockPlayersEq = vi.fn();
    const mockPlayersSelect = vi.fn(() => ({ eq: mockPlayersEq }));

    const mockRpc = vi.fn();

    const mockFrom = vi.fn((table: string) => {
      if (table === "rooms") {
        return { select: mockSelect };
      }
      if (table === "players_masked") {
        return { select: mockPlayersSelect };
      }
      return { select: vi.fn() };
    });

    return {
      notFoundMock,
      mockSingle,
      mockPlayersEq,
      mockRpc,
      mockFrom,
    };
  });

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() =>
    Promise.resolve({
      from: mockFrom,
      rpc: mockRpc,
    }),
  ),
}));

vi.mock("./poker-room-client", () => ({
  PokerRoomClient: () => null,
}));

import type { Room } from "@/lib/types";
import PokerRoomPage from "./page";

type PageResult = React.ReactElement<{ initialRoom: Room }>;

describe("PokerRoomPage", () => {
  const validRoomId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  beforeEach(() => {
    vi.clearAllMocks();
    notFoundMock.mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });
  });

  it("should call notFound for invalid UUID", async () => {
    await expect(
      PokerRoomPage({ params: Promise.resolve({ roomId: "not-a-uuid" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalled();
  });

  it("should render full room for members", async () => {
    const roomData = {
      id: validRoomId,
      name: "Sprint Planning",
      is_revealed: false,
      facilitator_id: "user-1",
    };
    const playersData = [
      { user_id: "user-1", name: "Alice", role: "FACILITATOR", vote: null },
      { user_id: "user-2", name: "Bob", role: "MEMBER", vote: "5" },
    ];

    mockSingle.mockResolvedValue({ data: roomData, error: null });
    mockPlayersEq.mockResolvedValue({ data: playersData, error: null });

    const result = await PokerRoomPage({
      params: Promise.resolve({ roomId: validRoomId }),
    });

    expect(mockRpc).not.toHaveBeenCalled();

    // The page returns <PokerRoomClient initialRoom={...} /> — access props directly
    const { initialRoom } = (result as PageResult).props;
    expect(initialRoom.id).toBe(validRoomId);
    expect(initialRoom.name).toBe("Sprint Planning");
    expect(initialRoom.facilitatorId).toBe("user-1");
    expect(initialRoom.players).toHaveLength(2);
    expect(initialRoom.players[0]?.name).toBe("Alice");
    expect(initialRoom.players[1]?.vote).toBe("5");
  });

  it("should fall back to preview RPC for non-members", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
    mockPlayersEq.mockResolvedValue({ data: [], error: null });

    mockRpc.mockResolvedValue({
      data: [{ name: "Sprint Planning", is_expired: false }],
      error: null,
    });

    const result = await PokerRoomPage({
      params: Promise.resolve({ roomId: validRoomId }),
    });

    expect(mockRpc).toHaveBeenCalledWith("get_room_preview", {
      p_room_id: validRoomId,
    });

    const { initialRoom } = (result as PageResult).props;
    expect(initialRoom.id).toBe(validRoomId);
    expect(initialRoom.name).toBe("Sprint Planning");
    expect(initialRoom.facilitatorId).toBe("");
    expect(initialRoom.players).toEqual([]);
  });

  it("should call notFound when room does not exist", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
    mockPlayersEq.mockResolvedValue({ data: [], error: null });
    mockRpc.mockResolvedValue({ data: [], error: null });

    await expect(
      PokerRoomPage({
        params: Promise.resolve({ roomId: validRoomId }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalled();
  });

  it("should call notFound when room is expired", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
    mockPlayersEq.mockResolvedValue({ data: [], error: null });
    mockRpc.mockResolvedValue({
      data: [{ name: "Old Room", is_expired: true }],
      error: null,
    });

    await expect(
      PokerRoomPage({
        params: Promise.resolve({ roomId: validRoomId }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalled();
  });
});
