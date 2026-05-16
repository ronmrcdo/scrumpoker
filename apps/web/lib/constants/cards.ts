export const FOLD_VALUE = "FOLD";

export const CARD_VALUES = ["1", "2", "3", "5", "8", "13", "21", "☕"];

export const MAX_PLAYERS = 10;

export type CardSuit = "♠" | "♥" | "♦" | "♣";

// Suit assignments for the deck — classic playing-card metaphor.
// Reds are ♥/♦; blacks are ♠/♣.
export const CARD_SUITS = {
  "1": "♠",
  "2": "♥",
  "3": "♣",
  "5": "♦",
  "8": "♠",
  "13": "♥",
  "21": "♣",
  "☕": "♦",
} satisfies Record<string, CardSuit>;

const RED_SUITS = new Set<CardSuit>(["♥", "♦"]);

export function suitFor(value: string | null): CardSuit {
  if (value === null || value === FOLD_VALUE) return "♠";
  return (CARD_SUITS as Record<string, CardSuit>)[value] ?? "♠";
}

export function isRedSuit(suit: string): boolean {
  return RED_SUITS.has(suit as CardSuit);
}
