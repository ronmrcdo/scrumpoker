import { FOLD_VALUE } from "./constants/cards";
import type { Player, VoteStats } from "./types";

export { cn } from "@repo/ui";

/**
 * Generates a UUID with fallback for environments without crypto.randomUUID
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback using crypto.getRandomValues() for environments without randomUUID
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // Set version 4 (0100xxxx) and variant (10xxxxxx)
  bytes.set([((bytes.at(6) ?? 0) & 0x0f) | 0x40], 6);
  bytes.set([((bytes.at(8) ?? 0) & 0x3f) | 0x80], 8);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getVoteStats(players: Player[]): VoteStats | null {
  const distribution: Record<string, number> = {};
  const numericVotes: number[] = [];
  let voteCount = 0;

  // Single pass: collect distribution and numeric votes simultaneously
  for (const player of players) {
    const vote = player.vote;
    if (vote === null || vote === "☕" || vote === FOLD_VALUE) continue;

    voteCount++;
    distribution[vote] = (distribution[vote] || 0) + 1;
    const num = Number(vote);
    if (!Number.isNaN(num)) numericVotes.push(num);
  }

  if (voteCount === 0 || numericVotes.length === 0) return null;

  let sum = 0;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const n of numericVotes) {
    sum += n;
    if (n < min) min = n;
    if (n > max) max = n;
  }

  const average = sum / numericVotes.length;
  const spread = max - min;

  let maxCount = 0;
  let mode = "0";
  for (const [value, count] of Object.entries(distribution)) {
    if (count > maxCount) {
      maxCount = count;
      mode = value;
    }
  }

  const consensus = maxCount >= Math.ceil(voteCount * 0.7);

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
