import type { Room } from '../types';
import { MOCK_MEMBERS } from './members';

export const MOCK_ROOM: Room = {
  id: 'room-sprint42',
  code: 'SPR-42X',
  name: 'Sprint 42: API Refactoring',
  isRevealed: false,
  facilitatorId: 'user-you',
  members: MOCK_MEMBERS,
};
