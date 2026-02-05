import type { Player, VoteStats } from "./types";

export { cn } from "@repo/ui";

/**
 * Generates a UUID with fallback for environments without crypto.randomUUID
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers or SSR
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getVoteStats(players: Player[]): VoteStats | null {
  const votes = players
    .map((m) => m.vote)
    .filter((v): v is string => v !== null && v !== "☕");

  if (votes.length === 0) return null;

  const numericVotes = votes.map(Number).filter((n) => !Number.isNaN(n));

  if (numericVotes.length === 0) return null;

  const average = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
  const spread = Math.max(...numericVotes) - Math.min(...numericVotes);

  const distribution: Record<string, number> = {};
  for (const v of votes) {
    distribution[v] = (distribution[v] || 0) + 1;
  }

  const maxCount = Math.max(...Object.values(distribution));
  const mode =
    Object.entries(distribution).find(([, count]) => count === maxCount)?.[0] ??
    votes[0] ??
    "0";

  const consensus = maxCount >= Math.ceil(votes.length * 0.7);

  return { average, mode, spread, consensus, distribution };
}

export function getRadialPosition(
  index: number,
  total: number,
  radiusX: number,
  radiusY: number,
): { x: number; y: number } {
  const angle = (2 * Math.PI * index) / total - Math.PI / 2;
  return {
    x: radiusX * Math.cos(angle),
    y: radiusY * Math.sin(angle),
  };
}
