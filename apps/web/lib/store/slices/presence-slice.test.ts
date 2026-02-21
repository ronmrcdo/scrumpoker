import { beforeEach, describe, expect, it } from "vitest";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { createPresenceSlice, type PresenceSlice } from "./presence-slice";

describe("PresenceSlice", () => {
  let store: UseBoundStore<StoreApi<PresenceSlice>>;

  beforeEach(() => {
    store = create<PresenceSlice>()((...a) => createPresenceSlice(...a));
  });

  it("should initialize with empty onlinePlayerIds", () => {
    expect(store.getState().onlinePlayerIds.size).toBe(0);
  });

  describe("setOnlinePlayerIds", () => {
    it("should replace the entire set", () => {
      store.getState().setOnlinePlayerIds(new Set(["a", "b", "c"]));
      expect(store.getState().onlinePlayerIds).toEqual(
        new Set(["a", "b", "c"]),
      );
    });

    it("should overwrite previous values", () => {
      store.getState().setOnlinePlayerIds(new Set(["a", "b"]));
      store.getState().setOnlinePlayerIds(new Set(["c"]));
      expect(store.getState().onlinePlayerIds).toEqual(new Set(["c"]));
    });
  });

  describe("addOnlinePlayer", () => {
    it("should add a player to the set", () => {
      store.getState().addOnlinePlayer("player-1");
      expect(store.getState().onlinePlayerIds.has("player-1")).toBe(true);
    });

    it("should not duplicate existing players", () => {
      store.getState().addOnlinePlayer("player-1");
      store.getState().addOnlinePlayer("player-1");
      expect(store.getState().onlinePlayerIds.size).toBe(1);
    });

    it("should preserve existing players when adding new ones", () => {
      store.getState().addOnlinePlayer("player-1");
      store.getState().addOnlinePlayer("player-2");
      expect(store.getState().onlinePlayerIds).toEqual(
        new Set(["player-1", "player-2"]),
      );
    });
  });

  describe("removeOnlinePlayer", () => {
    it("should remove a player from the set", () => {
      store.getState().setOnlinePlayerIds(new Set(["a", "b", "c"]));
      store.getState().removeOnlinePlayer("b");
      expect(store.getState().onlinePlayerIds).toEqual(new Set(["a", "c"]));
    });

    it("should be a no-op for non-existent players", () => {
      store.getState().setOnlinePlayerIds(new Set(["a"]));
      store.getState().removeOnlinePlayer("z");
      expect(store.getState().onlinePlayerIds).toEqual(new Set(["a"]));
    });
  });

  describe("clearPresence", () => {
    it("should reset to empty set", () => {
      store
        .getState()
        .setOnlinePlayerIds(new Set(["player-1", "player-2", "player-3"]));
      store.getState().clearPresence();
      expect(store.getState().onlinePlayerIds.size).toBe(0);
    });
  });
});
