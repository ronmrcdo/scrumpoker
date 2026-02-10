export type PlayerRole = "FACILITATOR" | "MEMBER";

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  vote: string | null;
}

export interface Room {
  id: string;
  name: string;
  isRevealed: boolean;
  facilitatorId: string;
  players: Player[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  type: "User" | "System";
}

export interface ChatBroadcastPayload {
  type: "chat_message";
  message: ChatMessage;
}

export interface TypingUser {
  userId: string;
  name: string;
  timestamp: number;
}

export interface TypingBroadcastPayload {
  type: "typing_indicator";
  userId: string;
  name: string;
  isTyping: boolean;
}

export interface VoteStats {
  average: number;
  mode: string;
  spread: number;
  consensus: boolean;
  distribution: Record<string, number>;
}
