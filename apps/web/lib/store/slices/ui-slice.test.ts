import { describe, expect, it, beforeEach, vi } from "vitest";
import { create } from "zustand";
import { createUISlice, type UISlice } from "./ui-slice";

describe("UISlice", () => {
  let store: ReturnType<typeof create<UISlice>>;

  beforeEach(() => {
    store = create<UISlice>()((...a) => createUISlice(...a));
  });

  describe("initial state", () => {
    it("should have isChatOpen as false", () => {
      expect(store.getState().isChatOpen).toBe(false);
    });

    it("should have isPlayerListOpen as false", () => {
      expect(store.getState().isPlayerListOpen).toBe(false);
    });

    it("should have isHydrated as false", () => {
      expect(store.getState().isHydrated).toBe(false);
    });
  });

  describe("toggleChat", () => {
    it("should toggle isChatOpen from false to true", () => {
      store.getState().toggleChat();
      expect(store.getState().isChatOpen).toBe(true);
    });

    it("should toggle isChatOpen from true to false", () => {
      store.getState().toggleChat();
      store.getState().toggleChat();
      expect(store.getState().isChatOpen).toBe(false);
    });

    it("should not affect isPlayerListOpen", () => {
      store.getState().setPlayerListOpen(true);
      store.getState().toggleChat();
      expect(store.getState().isPlayerListOpen).toBe(true);
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

    it("should not affect isChatOpen", () => {
      store.getState().setChatOpen(true);
      store.getState().togglePlayerList();
      expect(store.getState().isChatOpen).toBe(true);
    });
  });

  describe("setChatOpen", () => {
    it("should set isChatOpen to true", () => {
      store.getState().setChatOpen(true);
      expect(store.getState().isChatOpen).toBe(true);
    });

    it("should set isChatOpen to false", () => {
      store.getState().setChatOpen(true);
      store.getState().setChatOpen(false);
      expect(store.getState().isChatOpen).toBe(false);
    });

    it("should be idempotent for same value", () => {
      store.getState().setChatOpen(true);
      store.getState().setChatOpen(true);
      expect(store.getState().isChatOpen).toBe(true);
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

    it("should open chat and player list on desktop (width >= 768)", () => {
      // Mock window.innerWidth for desktop
      vi.stubGlobal("innerWidth", 1024);

      store.getState().initializeUI();

      expect(store.getState().isChatOpen).toBe(true);
      expect(store.getState().isPlayerListOpen).toBe(true);

      vi.unstubAllGlobals();
    });

    it("should keep chat and player list closed on mobile (width < 768)", () => {
      // Mock window.innerWidth for mobile
      vi.stubGlobal("innerWidth", 375);

      store.getState().initializeUI();

      expect(store.getState().isChatOpen).toBe(false);
      expect(store.getState().isPlayerListOpen).toBe(false);

      vi.unstubAllGlobals();
    });

    it("should keep chat and player list closed at exactly 767px", () => {
      vi.stubGlobal("innerWidth", 767);

      store.getState().initializeUI();

      expect(store.getState().isChatOpen).toBe(false);
      expect(store.getState().isPlayerListOpen).toBe(false);

      vi.unstubAllGlobals();
    });

    it("should open panels at exactly 768px", () => {
      vi.stubGlobal("innerWidth", 768);

      store.getState().initializeUI();

      expect(store.getState().isChatOpen).toBe(true);
      expect(store.getState().isPlayerListOpen).toBe(true);

      vi.unstubAllGlobals();
    });
  });

  describe("state isolation", () => {
    it("should allow all panels to be open simultaneously", () => {
      store.getState().setChatOpen(true);
      store.getState().setPlayerListOpen(true);

      expect(store.getState().isChatOpen).toBe(true);
      expect(store.getState().isPlayerListOpen).toBe(true);
    });

    it("should allow all panels to be closed simultaneously", () => {
      store.getState().setChatOpen(true);
      store.getState().setPlayerListOpen(true);
      store.getState().setChatOpen(false);
      store.getState().setPlayerListOpen(false);

      expect(store.getState().isChatOpen).toBe(false);
      expect(store.getState().isPlayerListOpen).toBe(false);
    });
  });
});
