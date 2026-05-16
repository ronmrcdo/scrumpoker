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

export interface CountdownBroadcastPayload {
  type: "countdown_start";
}

export interface VoteStats {
  average: number;
  mode: string;
  spread: number;
  consensus: boolean;
  distribution: Record<string, number>;
}
