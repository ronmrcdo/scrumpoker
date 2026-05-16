import { beforeEach, describe, expect, it, vi } from "vitest";
import { create, type StoreApi } from "zustand";
import { createUISlice, type UISlice } from "./ui-slice";

describe("UISlice", () => {
  let store: StoreApi<UISlice>;

  beforeEach(() => {
    store = create<UISlice>()((...a) => createUISlice(...a));
  });

  describe("initial state", () => {
    it("should have isPlayerListOpen as false", () => {
      expect(store.getState().isPlayerListOpen).toBe(false);
    });

    it("should have isHydrated as false", () => {
      expect(store.getState().isHydrated).toBe(false);
    });
  });

  describe("togglePlayerList", () => {
    it("should toggle isPlayerListOpen from false to true", () => {
      store.getState().togglePlayerList();
      expect(store.getState().isPlayerListOpen).toBe(true);
    });

    it("should toggle isPlayerListOpen from true to false", () => {
      store.getState().togglePlayerList();
      store.getState().togglePlayerList();
      expect(store.getState().isPlayerListOpen).toBe(false);
    });
  });

  describe("setPlayerListOpen", () => {
    it("should set isPlayerListOpen to true", () => {
      store.getState().setPlayerListOpen(true);
      expect(store.getState().isPlayerListOpen).toBe(true);
    });

    it("should set isPlayerListOpen to false", () => {
      store.getState().setPlayerListOpen(true);
      store.getState().setPlayerListOpen(false);
      expect(store.getState().isPlayerListOpen).toBe(false);
    });

    it("should be idempotent for same value", () => {
      store.getState().setPlayerListOpen(true);
      store.getState().setPlayerListOpen(true);
      expect(store.getState().isPlayerListOpen).toBe(true);
    });
  });

  describe("initializeUI", () => {
    it("should set isHydrated to true", () => {
      store.getState().initializeUI();
      expect(store.getState().isHydrated).toBe(true);
    });

    it("should open player list on desktop (width >= 768)", () => {
      vi.stubGlobal("innerWidth", 1024);
      store.getState().initializeUI();
      expect(store.getState().isPlayerListOpen).toBe(true);
      vi.unstubAllGlobals();
    });

    it("should keep player list closed on mobile (width < 768)", () => {
      vi.stubGlobal("innerWidth", 375);
      store.getState().initializeUI();
      expect(store.getState().isPlayerListOpen).toBe(false);
      vi.unstubAllGlobals();
    });

    it("should keep player list closed at exactly 767px", () => {
      vi.stubGlobal("innerWidth", 767);
      store.getState().initializeUI();
      expect(store.getState().isPlayerListOpen).toBe(false);
      vi.unstubAllGlobals();
    });

    it("should open player list at exactly 768px", () => {
      vi.stubGlobal("innerWidth", 768);
      store.getState().initializeUI();
      expect(store.getState().isPlayerListOpen).toBe(true);
      vi.unstubAllGlobals();
    });
  });
});
