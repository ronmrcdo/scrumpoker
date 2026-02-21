import { beforeEach, describe, expect, it, vi } from "vitest";
import { create } from "zustand";
import { type CountdownSlice, createCountdownSlice } from "./countdown-slice";

describe("CountdownSlice", () => {
  let store: ReturnType<typeof create<CountdownSlice>>;

  beforeEach(() => {
    store = create<CountdownSlice>()((...a) => createCountdownSlice(...a));
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have null countdownBroadcastCallback", () => {
      expect(store.getState().countdownBroadcastCallback).toBeNull();
    });

    it("should have remoteCountdownTrigger at 0", () => {
      expect(store.getState().remoteCountdownTrigger).toBe(0);
    });
  });

  describe("setCountdownBroadcastCallback", () => {
    it("should set the countdown broadcast callback", () => {
      const callback = vi.fn();
      store.getState().setCountdownBroadcastCallback(callback);
      expect(store.getState().countdownBroadcastCallback).toBe(callback);
    });

    it("should allow setting to null", () => {
      store.getState().setCountdownBroadcastCallback(vi.fn());
      store.getState().setCountdownBroadcastCallback(null);
      expect(store.getState().countdownBroadcastCallback).toBeNull();
    });
  });

  describe("triggerRemoteCountdown", () => {
    it("should increment remoteCountdownTrigger", () => {
      store.getState().triggerRemoteCountdown();
      expect(store.getState().remoteCountdownTrigger).toBe(1);
    });

    it("should increment on each call", () => {
      store.getState().triggerRemoteCountdown();
      store.getState().triggerRemoteCountdown();
      store.getState().triggerRemoteCountdown();
      expect(store.getState().remoteCountdownTrigger).toBe(3);
    });
  });

  describe("broadcastCountdown", () => {
    it("should call countdownBroadcastCallback if set", () => {
      const mockCallback = vi.fn();
      store.getState().setCountdownBroadcastCallback(mockCallback);
      store.getState().broadcastCountdown();
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should not throw if callback is null", () => {
      expect(() => {
        store.getState().broadcastCountdown();
      }).not.toThrow();
    });
  });
});
