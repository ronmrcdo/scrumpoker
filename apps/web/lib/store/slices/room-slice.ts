import type { StateCreator } from 'zustand';
import type { Room } from '../../types';
import { MOCK_ROOM, MOCK_CURRENT_USER_ID } from '../../mock-data';

/**
 * Room state slice for poker sessions
 *
 * Performance note: This slice creates new room objects on each update.
 * For better performance with selective subscriptions:
 * 1. Install immer: `pnpm add immer`
 * 2. Use immer middleware: `import { immer } from 'zustand/middleware/immer'`
 * 3. Or normalize the store structure (separate members by ID)
 *
 * Components should use selective subscriptions:
 * @example
 * const room = usePokerStore(s => s.room);
 * const members = usePokerStore(s => s.room?.members);
 */
export interface RoomSlice {
  room: Room | null;
  createRoom: (name: string, userName: string) => string;
  joinRoom: (code: string, userName: string) => string;
  castVote: (value: string) => void;
  toggleReveal: () => void;
  resetVotes: () => void;
  leaveRoom: () => void;
  kickPlayer: (playerId: string) => void;
}

export const createRoomSlice: StateCreator<RoomSlice, [], [], RoomSlice> = (set, get) => ({
  room: null,

  createRoom: (name, userName) => {
    const state = get();
    const currentUserId = state.currentUserId || MOCK_CURRENT_USER_ID;

    const room: Room = {
      ...MOCK_ROOM,
      name,
      facilitatorId: currentUserId, // Set creator as facilitator
      members: MOCK_ROOM.members.map((m) =>
        m.id === MOCK_CURRENT_USER_ID ? { ...m, id: currentUserId, name: userName } : m,
      ),
    };
    set({ room });

    // Simulate other players voting after a delay (development only)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        set((state) => {
          if (!state.room) return state;
          const currentUserId = state.currentUserId || MOCK_CURRENT_USER_ID;
          const mockVotes = ['5', '8', '5', '13', '8'];
          return {
            room: {
              ...state.room,
              members: state.room.members.map((m, i) =>
                m.id !== currentUserId && i - 1 < mockVotes.length
                  ? { ...m, vote: mockVotes[i - 1] ?? null }
                  : m,
              ),
            },
          };
        });
      }, 2000);
    }

    return room.id;
  },

  joinRoom: (_code, userName) => {
    const state = get();
    const currentUserId = state.currentUserId || MOCK_CURRENT_USER_ID;

    const room: Room = {
      ...MOCK_ROOM,
      members: MOCK_ROOM.members.map((m) =>
        m.id === MOCK_CURRENT_USER_ID
          ? { ...m, id: currentUserId, name: userName, role: 'MEMBER' }
          : m,
      ),
      facilitatorId: 'user-sarah', // When joining, someone else is facilitator
    };
    set({ room });
    return room.id;
  },

  castVote: (value) => {
    set((state) => {
      if (!state.room) return state;

      const currentUserId = state.currentUserId || MOCK_CURRENT_USER_ID;

      // Only update if vote actually changed
      const currentVote = state.room.members.find(m => m.id === currentUserId)?.vote;
      if (currentVote === value) return state;

      return {
        room: {
          ...state.room,
          members: state.room.members.map((m) =>
            m.id === currentUserId ? { ...m, vote: value } : m,
          ),
        },
      };
    });
  },

  toggleReveal: () => {
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          isRevealed: !state.room.isRevealed,
        },
      };
    });
  },

  resetVotes: () => {
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          isRevealed: false,
          members: state.room.members.map((m) => ({ ...m, vote: null })),
        },
      };
    });
  },

  leaveRoom: () => {
    set({ room: null });
  },

  kickPlayer: (playerId) => {
    set((state) => {
      if (!state.room) return state;
      return {
        room: {
          ...state.room,
          members: state.room.members.filter((m) => m.id !== playerId),
        },
      };
    });
  },
});
