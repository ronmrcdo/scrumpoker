import type { StateCreator } from "zustand";
import type { ChatMessage, TypingUser } from "../../types";
import { generateUUID } from "../../utils";

const MAX_CHAT_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 500;
const TYPING_INDICATOR_TTL_MS = 10000;

type BroadcastCallback = (message: ChatMessage) => void;
type TypingBroadcastCallback = (
  userId: string,
  name: string,
  isTyping: boolean,
) => void;

function sanitizeMessage(text: string): string {
  return text.slice(0, MAX_MESSAGE_LENGTH).trim();
}

function addMessageWithLimit(
  messages: ChatMessage[],
  newMessage: ChatMessage,
): ChatMessage[] {
  const updated = [...messages, newMessage];
  if (updated.length > MAX_CHAT_MESSAGES) {
    return updated.slice(-MAX_CHAT_MESSAGES);
  }
  return updated;
}

function cleanupStaleTypingUsers(
  typingUsers: Map<string, TypingUser>,
): Map<string, TypingUser> {
  const now = Date.now();
  const cleaned = new Map<string, TypingUser>();
  for (const [userId, user] of typingUsers) {
    if (now - user.timestamp < TYPING_INDICATOR_TTL_MS) {
      cleaned.set(userId, user);
    }
  }
  return cleaned;
}

export interface ChatSlice {
  chatMessages: ChatMessage[];
  typingUsers: Map<string, TypingUser>;
  broadcastCallback: BroadcastCallback | null;
  typingBroadcastCallback: TypingBroadcastCallback | null;
  addChatMessage: (msg: ChatMessage) => void;
  sendChatMessage: (text: string, senderId: string, senderName: string) => void;
  addSystemMessage: (text: string) => void;
  clearChat: () => void;
  setBroadcastCallback: (callback: BroadcastCallback | null) => void;
  setTypingBroadcastCallback: (
    callback: TypingBroadcastCallback | null,
  ) => void;
  setUserTyping: (userId: string, name: string, isTyping: boolean) => void;
  broadcastTyping: (userId: string, name: string, isTyping: boolean) => void;
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (
  set,
  get,
) => ({
  chatMessages: [],
  typingUsers: new Map(),
  broadcastCallback: null,
  typingBroadcastCallback: null,

  addChatMessage: (msg) => {
    set((state) => ({
      chatMessages: addMessageWithLimit(state.chatMessages, msg),
    }));
  },

  sendChatMessage: (text, senderId, senderName) => {
    const sanitizedText = sanitizeMessage(text);
    if (!sanitizedText) return;

    const msg: ChatMessage = {
      id: generateUUID(),
      senderId,
      senderName,
      text: sanitizedText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "User",
    };

    // Add to local state immediately
    set((state) => ({
      chatMessages: addMessageWithLimit(state.chatMessages, msg),
    }));

    // Broadcast to other clients via callback
    const { broadcastCallback } = get();
    if (broadcastCallback) {
      broadcastCallback(msg);
    }
  },

  addSystemMessage: (text) => {
    const msg: ChatMessage = {
      id: generateUUID(),
      senderId: "system",
      senderName: "System",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "System",
    };
    set((state) => ({
      chatMessages: addMessageWithLimit(state.chatMessages, msg),
    }));
  },

  clearChat: () => {
    set({ chatMessages: [], typingUsers: new Map() });
  },

  setBroadcastCallback: (callback) => {
    set({ broadcastCallback: callback });
  },

  setTypingBroadcastCallback: (callback) => {
    set({ typingBroadcastCallback: callback });
  },

  setUserTyping: (userId, name, isTyping) => {
    set((state) => {
      // Clean up stale typing indicators first
      const cleanedTypingUsers = cleanupStaleTypingUsers(state.typingUsers);

      if (isTyping) {
        cleanedTypingUsers.set(userId, { userId, name, timestamp: Date.now() });
      } else {
        cleanedTypingUsers.delete(userId);
      }
      return { typingUsers: cleanedTypingUsers };
    });
  },

  broadcastTyping: (userId, name, isTyping) => {
    const { typingBroadcastCallback } = get();
    if (typingBroadcastCallback) {
      typingBroadcastCallback(userId, name, isTyping);
    }
  },
});
