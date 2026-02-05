import { beforeEach, describe, expect, it } from "vitest";
import { create } from "zustand";
import { createSessionSlice, type SessionSlice } from "./session-slice";

describe("SessionSlice", () => {
  let store: ReturnType<typeof create<SessionSlice>>;

  beforeEach(() => {
    store = create<SessionSlice>()((...a) => createSessionSlice(...a));
  });

  describe("initial state", () => {
    it("should have empty currentUserId", () => {
      expect(store.getState().currentUserId).toBe("");
    });

    it("should have sessionInitialized as false", () => {
      expect(store.getState().sessionInitialized).toBe(false);
    });
  });

  describe("setCurrentUserId", () => {
    it("should set the currentUserId", () => {
      store.getState().setCurrentUserId("user-123");
      expect(store.getState().currentUserId).toBe("user-123");
    });

    it("should update to a different userId", () => {
      store.getState().setCurrentUserId("user-123");
      store.getState().setCurrentUserId("user-456");
      expect(store.getState().currentUserId).toBe("user-456");
    });

    it("should allow setting empty string", () => {
      store.getState().setCurrentUserId("user-123");
      store.getState().setCurrentUserId("");
      expect(store.getState().currentUserId).toBe("");
    });

    it("should handle UUID format IDs", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      store.getState().setCurrentUserId(uuid);
      expect(store.getState().currentUserId).toBe(uuid);
    });
  });

  describe("setSessionInitialized", () => {
    it("should set sessionInitialized to true", () => {
      store.getState().setSessionInitialized(true);
      expect(store.getState().sessionInitialized).toBe(true);
    });

    it("should set sessionInitialized to false", () => {
      store.getState().setSessionInitialized(true);
      store.getState().setSessionInitialized(false);
      expect(store.getState().sessionInitialized).toBe(false);
    });

    it("should be independent of currentUserId", () => {
      store.getState().setCurrentUserId("user-123");
      store.getState().setSessionInitialized(true);
      expect(store.getState().currentUserId).toBe("user-123");
      expect(store.getState().sessionInitialized).toBe(true);
    });
  });
});
