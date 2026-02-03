export type MemberRole = 'FACILITATOR' | 'MEMBER';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  vote: string | null;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  isRevealed: boolean;
  facilitatorId: string;
  members: Member[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: 'User' | 'System';
}

export interface VoteStats {
  average: number;
  mode: string;
  spread: number;
  consensus: boolean;
  distribution: Record<string, number>;
}
