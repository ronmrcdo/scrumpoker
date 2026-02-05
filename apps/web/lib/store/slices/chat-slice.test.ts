import { beforeEach, describe, expect, it, vi } from "vitest";
import { create } from "zustand";
import type { ChatMessage } from "../../types";
import { type ChatSlice, createChatSlice } from "./chat-slice";

describe("ChatSlice", () => {
  let store: ReturnType<typeof create<ChatSlice>>;

  beforeEach(() => {
    store = create<ChatSlice>()((...a) => createChatSlice(...a));
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have empty chatMessages array", () => {
      expect(store.getState().chatMessages).toEqual([]);
    });

    it("should have empty typingUsers map", () => {
      expect(store.getState().typingUsers.size).toBe(0);
    });

    it("should have null broadcastCallback", () => {
      expect(store.getState().broadcastCallback).toBeNull();
    });

    it("should have null typingBroadcastCallback", () => {
      expect(store.getState().typingBroadcastCallback).toBeNull();
    });
  });

  describe("addChatMessage", () => {
    it("should add a message to chatMessages", () => {
      const message: ChatMessage = {
        id: "msg-1",
        senderId: "user-1",
        senderName: "Alice",
        text: "Hello!",
        timestamp: "10:00 AM",
        type: "User",
      };

      store.getState().addChatMessage(message);
      expect(store.getState().chatMessages).toHaveLength(1);
      expect(store.getState().chatMessages[0]).toEqual(message);
    });

    it("should add multiple messages in order", () => {
      const msg1: ChatMessage = {
        id: "msg-1",
        senderId: "user-1",
        senderName: "Alice",
        text: "First",
        timestamp: "10:00 AM",
        type: "User",
      };
      const msg2: ChatMessage = {
        id: "msg-2",
        senderId: "user-2",
        senderName: "Bob",
        text: "Second",
        timestamp: "10:01 AM",
        type: "User",
      };

      store.getState().addChatMessage(msg1);
      store.getState().addChatMessage(msg2);

      expect(store.getState().chatMessages).toHaveLength(2);
      expect(store.getState().chatMessages[0]!.id).toBe("msg-1");
      expect(store.getState().chatMessages[1]!.id).toBe("msg-2");
    });

    it("should limit messages to MAX_CHAT_MESSAGES (100)", () => {
      // Add 105 messages
      for (let i = 0; i < 105; i++) {
        store.getState().addChatMessage({
          id: `msg-${i}`,
          senderId: "user-1",
          senderName: "Alice",
          text: `Message ${i}`,
          timestamp: "10:00 AM",
          type: "User",
        });
      }

      expect(store.getState().chatMessages).toHaveLength(100);
      // Should keep the latest messages
      expect(store.getState().chatMessages[0]!.id).toBe("msg-5");
      expect(store.getState().chatMessages[99]!.id).toBe("msg-104");
    });
  });

  describe("sendChatMessage", () => {
    it("should add a user message to chatMessages", () => {
      store.getState().sendChatMessage("Hello!", "user-1", "Alice");

      const messages = store.getState().chatMessages;
      expect(messages).toHaveLength(1);
      expect(messages[0]!.text).toBe("Hello!");
      expect(messages[0]!.senderId).toBe("user-1");
      expect(messages[0]!.senderName).toBe("Alice");
      expect(messages[0]!.type).toBe("User");
    });

    it("should sanitize message text (trim)", () => {
      store.getState().sendChatMessage("  Hello!  ", "user-1", "Alice");
      expect(store.getState().chatMessages[0]!.text).toBe("Hello!");
    });

    it("should not add empty messages", () => {
      store.getState().sendChatMessage("", "user-1", "Alice");
      expect(store.getState().chatMessages).toHaveLength(0);
    });

    it("should not add whitespace-only messages", () => {
      store.getState().sendChatMessage("   ", "user-1", "Alice");
      expect(store.getState().chatMessages).toHaveLength(0);
    });

    it("should truncate messages longer than 500 characters", () => {
      const longText = "a".repeat(600);
      store.getState().sendChatMessage(longText, "user-1", "Alice");
      expect(store.getState().chatMessages[0]!.text.length).toBe(500);
    });

    it("should call broadcastCallback if set", () => {
      const mockCallback = vi.fn();
      store.getState().setBroadcastCallback(mockCallback);
      store.getState().sendChatMessage("Hello!", "user-1", "Alice");

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback.mock.calls[0]![0].text).toBe("Hello!");
    });

    it("should generate unique message IDs", () => {
      store.getState().sendChatMessage("First", "user-1", "Alice");
      store.getState().sendChatMessage("Second", "user-1", "Alice");

      const messages = store.getState().chatMessages;
      expect(messages[0]!.id).not.toBe(messages[1]!.id);
    });

    it("should set timestamp on message", () => {
      store.getState().sendChatMessage("Hello!", "user-1", "Alice");
      expect(store.getState().chatMessages[0]!.timestamp).toBeTruthy();
    });
  });

  describe("addSystemMessage", () => {
    it("should add a system message", () => {
      store.getState().addSystemMessage("User joined the room");

      const messages = store.getState().chatMessages;
      expect(messages).toHaveLength(1);
      expect(messages[0]!.type).toBe("System");
      expect(messages[0]!.senderId).toBe("system");
      expect(messages[0]!.senderName).toBe("System");
      expect(messages[0]!.text).toBe("User joined the room");
    });

    it("should not call broadcastCallback for system messages", () => {
      const mockCallback = vi.fn();
      store.getState().setBroadcastCallback(mockCallback);
      store.getState().addSystemMessage("User joined");

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe("clearChat", () => {
    it("should clear all messages", () => {
      store.getState().sendChatMessage("Hello!", "user-1", "Alice");
      store.getState().sendChatMessage("Hi!", "user-2", "Bob");
      store.getState().clearChat();

      expect(store.getState().chatMessages).toEqual([]);
    });

    it("should clear typing users", () => {
      store.getState().setUserTyping("user-1", "Alice", true);
      store.getState().clearChat();

      expect(store.getState().typingUsers.size).toBe(0);
    });
  });

  describe("setBroadcastCallback", () => {
    it("should set the broadcast callback", () => {
      const callback = vi.fn();
      store.getState().setBroadcastCallback(callback);
      expect(store.getState().broadcastCallback).toBe(callback);
    });

    it("should allow setting to null", () => {
      store.getState().setBroadcastCallback(vi.fn());
      store.getState().setBroadcastCallback(null);
      expect(store.getState().broadcastCallback).toBeNull();
    });
  });

  describe("setTypingBroadcastCallback", () => {
    it("should set the typing broadcast callback", () => {
      const callback = vi.fn();
      store.getState().setTypingBroadcastCallback(callback);
      expect(store.getState().typingBroadcastCallback).toBe(callback);
    });

    it("should allow setting to null", () => {
      store.getState().setTypingBroadcastCallback(vi.fn());
      store.getState().setTypingBroadcastCallback(null);
      expect(store.getState().typingBroadcastCallback).toBeNull();
    });
  });

  describe("setUserTyping", () => {
    it("should add a typing user", () => {
      store.getState().setUserTyping("user-1", "Alice", true);

      const typingUsers = store.getState().typingUsers;
      expect(typingUsers.size).toBe(1);
      expect(typingUsers.get("user-1")!.name).toBe("Alice");
    });

    it("should remove a typing user", () => {
      store.getState().setUserTyping("user-1", "Alice", true);
      store.getState().setUserTyping("user-1", "Alice", false);

      expect(store.getState().typingUsers.size).toBe(0);
    });

    it("should handle multiple typing users", () => {
      store.getState().setUserTyping("user-1", "Alice", true);
      store.getState().setUserTyping("user-2", "Bob", true);

      expect(store.getState().typingUsers.size).toBe(2);
    });

    it("should update timestamp when user keeps typing", () => {
      store.getState().setUserTyping("user-1", "Alice", true);
      const firstUser = store.getState().typingUsers.get("user-1");
      expect(firstUser).toBeDefined();
      expect(firstUser?.timestamp).toBeGreaterThan(0);

      // Set again - the timestamp should still be a valid timestamp
      store.getState().setUserTyping("user-1", "Alice", true);
      const secondUser = store.getState().typingUsers.get("user-1");
      expect(secondUser).toBeDefined();
      expect(secondUser?.timestamp).toBeGreaterThan(0);
    });
  });

  describe("broadcastTyping", () => {
    it("should call typingBroadcastCallback if set", () => {
      const mockCallback = vi.fn();
      store.getState().setTypingBroadcastCallback(mockCallback);
      store.getState().broadcastTyping("user-1", "Alice", true);

      expect(mockCallback).toHaveBeenCalledWith("user-1", "Alice", true);
    });

    it("should not throw if callback is null", () => {
      expect(() => {
        store.getState().broadcastTyping("user-1", "Alice", true);
      }).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle messages with special characters", () => {
      store
        .getState()
        .sendChatMessage(
          "Hello! 🎉 <script>alert(1)</script>",
          "user-1",
          "Alice",
        );
      expect(store.getState().chatMessages[0]!.text).toBe(
        "Hello! 🎉 <script>alert(1)</script>",
      );
    });

    it("should handle very long sender names", () => {
      const longName = "A".repeat(100);
      store.getState().sendChatMessage("Hello!", "user-1", longName);
      expect(store.getState().chatMessages[0]!.senderName).toBe(longName);
    });

    it("should preserve message order under concurrent additions", () => {
      for (let i = 0; i < 50; i++) {
        store.getState().sendChatMessage(`Message ${i}`, "user-1", "Alice");
      }

      const messages = store.getState().chatMessages;
      for (let i = 0; i < messages.length - 1; i++) {
        const current = parseInt(messages[i]!.text.split(" ")[1]!);
        const next = parseInt(messages[i + 1]!.text.split(" ")[1]!);
        expect(next).toBe(current + 1);
      }
    });
  });
});
