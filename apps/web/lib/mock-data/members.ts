import type { Member } from '../types';

export const MOCK_CURRENT_USER_ID = 'user-you';

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'user-you',
    name: 'You',
    role: 'FACILITATOR',
    vote: null,
  },
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    role: 'MEMBER',
    vote: null,
  },
  {
    id: 'user-mike',
    name: 'Mike Johnson',
    role: 'MEMBER',
    vote: null,
  },
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    role: 'MEMBER',
    vote: null,
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    role: 'MEMBER',
    vote: null,
  },
  {
    id: 'user-tom',
    name: 'Tom Wilson',
    role: 'MEMBER',
    vote: null,
  },
];
