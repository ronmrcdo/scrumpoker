import type { StateCreator } from 'zustand';

export interface MemberSlice {
  currentUserId: string;
  currentUserName: string;
  setIdentity: (id: string, name: string) => void;
}

export const createMemberSlice: StateCreator<MemberSlice, [], [], MemberSlice> = (set) => ({
  currentUserId: '',
  currentUserName: '',
  setIdentity: (id, name) => set({ currentUserId: id, currentUserName: name }),
});
