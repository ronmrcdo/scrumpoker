import type { StateCreator } from 'zustand';
import type { ChatMessage } from '../../types';
import { MOCK_CHAT_MESSAGES } from '../../mock-data';
import { generateUUID } from '../../utils';

export interface ChatSlice {
  chatMessages: ChatMessage[];
  pendingTimeouts: NodeJS.Timeout[];
  initChat: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  sendChatMessage: (text: string, senderId: string, senderName: string) => void;
  clearPendingTimeouts: () => void;
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (set, get) => ({
  chatMessages: [],
  pendingTimeouts: [],

  initChat: () => {
    set({ chatMessages: [...MOCK_CHAT_MESSAGES] });
  },

  addChatMessage: (msg) => {
    set((state) => ({ chatMessages: [...state.chatMessages, msg] }));
  },

  sendChatMessage: (text, senderId, senderName) => {
    const msg: ChatMessage = {
      id: generateUUID(),
      senderId,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'User',
    };

    set((state) => ({ chatMessages: [...state.chatMessages, msg] }));

    // Optional mock reply (only in development)
    if (process.env.NODE_ENV === 'development' && text.toLowerCase().includes('?')) {
      const timeoutId = setTimeout(() => {
        const reply: ChatMessage = {
          id: generateUUID(),
          senderId: 'user-sarah',
          senderName: 'Sarah Chen',
          text: 'Good question! I think we should discuss that.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'User',
        };
        set((state) => ({
          chatMessages: [...state.chatMessages, reply],
          pendingTimeouts: state.pendingTimeouts.filter(id => id !== timeoutId),
        }));
      }, 1500);

      set((state) => ({ pendingTimeouts: [...state.pendingTimeouts, timeoutId] }));
    }
  },

  clearPendingTimeouts: () => {
    const { pendingTimeouts } = get();
    pendingTimeouts.forEach(clearTimeout);
    set({ pendingTimeouts: [] });
  },
});
