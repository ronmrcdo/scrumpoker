import type { ChatMessage } from '../types';

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'system',
    senderName: 'System',
    text: 'Room created. Waiting for players to join...',
    timestamp: '10:00 AM',
    type: 'System',
  },
  {
    id: 'msg-2',
    senderId: 'user-sarah',
    senderName: 'Sarah Chen',
    text: 'Hey everyone! Ready to estimate?',
    timestamp: '10:02 AM',
    type: 'User',
  },
  {
    id: 'msg-3',
    senderId: 'user-mike',
    senderName: 'Mike Johnson',
    text: 'Let\'s do it. The API refactoring story looks straightforward.',
    timestamp: '10:03 AM',
    type: 'User',
  },
  {
    id: 'msg-4',
    senderId: 'user-you',
    senderName: 'You',
    text: 'Alright, pick your cards!',
    timestamp: '10:04 AM',
    type: 'User',
  },
];
