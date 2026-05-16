import { beforeEach, describe, expect, it, vi } from "vitest";
import { create, type StoreApi } from "zustand";
import { createMockPlayer, createMockRoom } from "@/test/test-utils";
import { createRoomSlice, type RoomSlice } from "./room-slice";
import { createSessionSlice, type SessionSlice } from "./session-slice";

type CombinedSlice = SessionSlice & RoomSlice;

function buildStore(): StoreApi<CombinedSlice> {
  return create<CombinedSlice>()((...a) => ({
    ...createSessionSlice(...a),
    ...createRoomSlice(...a),
  }));
}

describe("RoomSlice", () => {
  let store: StoreApi<CombinedSlice>;

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe("castVote optimistic update", () => {
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
      // No room, no user — should not throw
      store.getState().castVote("5");
      expect(store.getState().room).toBeNull();
    });
  });

  describe("toggleReveal optimistic update", () => {
    it("flips isRevealed immediately", () => {
      const room = createMockRoom({ isRevealed: false });
      store.getState().setRoom(room);
      store.getState().toggleReveal();
      expect(store.getState().room?.isRevealed).toBe(true);
    });
  });

  describe("kickPlayer optimistic update", () => {
    it("removes the player from the local state immediately", () => {
      const a = createMockPlayer({ id: "a" });
      const b = createMockPlayer({ id: "b" });
      store.getState().setRoom(createMockRoom({ players: [a, b] }));
      store.getState().kickPlayer("a");
      expect(store.getState().room?.players.map((p) => p.id)).not.toContain(
        "a",
      );
    });
  });

  describe("resetVotes optimistic update", () => {
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
  });
});
