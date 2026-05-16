import { beforeEach, describe, expect, it, vi } from "vitest";
import { create, type StoreApi } from "zustand";
import { createMockPlayer, createMockRoom } from "@/test/test-utils";
import {
  type ConnectionSlice,
  createConnectionSlice,
} from "./connection-slice";
import { createRoomSlice, type RoomSlice } from "./room-slice";
import { createSessionSlice, type SessionSlice } from "./session-slice";

// Override the broad mock in test/setup.tsx with a per-test rpc spy so we can
// assert that the right RPC was called with the right args. Use vi.hoisted to
// share the spy across the hoisted vi.mock factory and the test bodies.
const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: rpcMock,
  }),
}));

type CombinedSlice = SessionSlice & RoomSlice & ConnectionSlice;

function buildStore(): StoreApi<CombinedSlice> {
  return create<CombinedSlice>()((...a) => ({
    ...createSessionSlice(...a),
    ...createRoomSlice(...a),
    ...createConnectionSlice(...a),
  }));
}

describe("RoomSlice", () => {
  let store: StoreApi<CombinedSlice>;

  beforeEach(() => {
    vi.clearAllMocks();
    rpcMock.mockResolvedValue({ data: null, error: null });
    store = buildStore();
  });

  describe("setRoom / setWasKicked", () => {
    it("setRoom updates state", () => {
      const room = createMockRoom();
      store.getState().setRoom(room);
      expect(store.getState().room?.id).toBe(room.id);
    });

    it("setWasKicked toggles flag", () => {
      store.getState().setWasKicked(true);
      expect(store.getState().wasKicked).toBe(true);
      store.getState().setWasKicked(false);
      expect(store.getState().wasKicked).toBe(false);
    });
  });

  describe("joinRoom", () => {
    it("throws when not authenticated", async () => {
      await expect(store.getState().joinRoom("rid", "Alice")).rejects.toThrow(
        /not authenticated/i,
      );
    });
  });

  describe("castVote", () => {
    it("applies the vote immediately on the local player", () => {
      const me = createMockPlayer({ id: "me", vote: null });
      const other = createMockPlayer({ id: "other" });
      store.getState().setRoom(createMockRoom({ players: [me, other] }));
      store.getState().setCurrentUserId("me");

      store.getState().castVote("5");
      expect(
        store.getState().room?.players.find((p) => p.id === "me")?.vote,
      ).toBe("5");
    });

    it("is a no-op when there is no room or no user", () => {
      store.getState().castVote("5");
      expect(store.getState().room).toBeNull();
    });

    it("calls the cast_vote RPC with the room id and value", async () => {
      const me = createMockPlayer({ id: "me", vote: null });
      const room = createMockRoom({ players: [me], id: "room-xyz" });
      store.getState().setRoom(room);
      store.getState().setCurrentUserId("me");

      await store.getState().castVote("5");

      expect(rpcMock).toHaveBeenCalledWith("cast_vote", {
        p_room_id: "room-xyz",
        p_vote: "5",
      });
    });

    it("reverts the optimistic update and surfaces error when RPC fails", async () => {
      const me = createMockPlayer({ id: "me", vote: null });
      const room = createMockRoom({ players: [me] });
      store.getState().setRoom(room);
      store.getState().setCurrentUserId("me");

      rpcMock.mockResolvedValueOnce({
        data: null,
        error: { message: "permission denied for cast_vote" },
      });

      await store.getState().castVote("3");

      expect(
        store.getState().room?.players.find((p) => p.id === "me")?.vote,
      ).toBeNull();
      expect(store.getState().lastError).toBe(
        "permission denied for cast_vote",
      );
    });
  });

  describe("toggleReveal", () => {
    it("flips isRevealed immediately", () => {
      const room = createMockRoom({ isRevealed: false });
      store.getState().setRoom(room);
      store.getState().toggleReveal();
      expect(store.getState().room?.isRevealed).toBe(true);
    });

    it("calls the set_room_revealed RPC with the new value", async () => {
      const room = createMockRoom({ isRevealed: false, id: "r1" });
      store.getState().setRoom(room);
      await store.getState().toggleReveal();
      expect(rpcMock).toHaveBeenCalledWith("set_room_revealed", {
        p_room_id: "r1",
        p_revealed: true,
      });
    });

    it("reverts and sets lastError on RPC failure", async () => {
      const room = createMockRoom({ isRevealed: false });
      store.getState().setRoom(room);

      rpcMock.mockResolvedValueOnce({
        data: null,
        error: { message: "Only the facilitator can change reveal state" },
      });

      await store.getState().toggleReveal();
      expect(store.getState().room?.isRevealed).toBe(false);
      expect(store.getState().lastError).toBe(
        "Only the facilitator can change reveal state",
      );
    });
  });

  describe("kickPlayer", () => {
    it("removes the player from the local state immediately", () => {
      const a = createMockPlayer({ id: "a" });
      const b = createMockPlayer({ id: "b" });
      store.getState().setRoom(createMockRoom({ players: [a, b] }));
      store.getState().kickPlayer("a");
      expect(store.getState().room?.players.map((p) => p.id)).not.toContain(
        "a",
      );
    });

    it("calls the kick_player RPC with the target user id", async () => {
      const a = createMockPlayer({ id: "a" });
      const b = createMockPlayer({ id: "b" });
      store.getState().setRoom(createMockRoom({ players: [a, b], id: "r2" }));
      await store.getState().kickPlayer("b");
      expect(rpcMock).toHaveBeenCalledWith("kick_player", {
        p_room_id: "r2",
        p_target_user_id: "b",
      });
    });

    it("reverts and sets lastError on RPC failure", async () => {
      const a = createMockPlayer({ id: "a" });
      const b = createMockPlayer({ id: "b" });
      store.getState().setRoom(createMockRoom({ players: [a, b] }));

      rpcMock.mockResolvedValueOnce({
        data: null,
        error: { message: "Only the facilitator can kick" },
      });

      await store.getState().kickPlayer("b");
      expect(store.getState().room?.players.map((p) => p.id)).toContain("b");
      expect(store.getState().lastError).toBe("Only the facilitator can kick");
    });
  });

  describe("resetVotes", () => {
    it("clears all votes and sets isRevealed to false", () => {
      const a = createMockPlayer({ id: "a", vote: "3" });
      const b = createMockPlayer({ id: "b", vote: "5" });
      store
        .getState()
        .setRoom(createMockRoom({ players: [a, b], isRevealed: true }));
      store.getState().resetVotes();
      expect(store.getState().room?.isRevealed).toBe(false);
      expect(store.getState().room?.players.every((p) => p.vote === null)).toBe(
        true,
      );
    });

    it("calls the reset_votes RPC with the room id", async () => {
      const room = createMockRoom({ id: "r3" });
      store.getState().setRoom(room);
      await store.getState().resetVotes();
      expect(rpcMock).toHaveBeenCalledWith("reset_votes", {
        p_room_id: "r3",
      });
    });
  });
});
