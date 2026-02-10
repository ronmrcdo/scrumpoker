import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import type { ChatMessage, Player, Room, VoteStats } from "@/lib/types";

// Custom render function that can be extended with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, { ...options });
}

// Re-export everything from testing-library
export * from "@testing-library/react";
export { customRender as render };

// ============================================
// Mock Data Factories
// ============================================

let idCounter = 0;

export function createMockPlayer(overrides: Partial<Player> = {}): Player {
  idCounter++;
  return {
    id: `player-${idCounter}`,
    name: `Player ${idCounter}`,
    role: "MEMBER",
    vote: null,
    ...overrides,
  };
}

export function createMockRoom(overrides: Partial<Room> = {}): Room {
  idCounter++;
  const facilitatorId = overrides.facilitatorId ?? `facilitator-${idCounter}`;
  return {
    id: `room-${idCounter}`,
    name: `Test Room ${idCounter}`,
    isRevealed: false,
    facilitatorId,
    players: [
      createMockPlayer({ id: facilitatorId, role: "FACILITATOR" }),
      createMockPlayer(),
      createMockPlayer(),
    ],
    ...overrides,
  };
}

export function createMockChatMessage(
  overrides: Partial<ChatMessage> = {},
): ChatMessage {
  idCounter++;
  return {
    id: `msg-${idCounter}`,
    senderId: `user-${idCounter}`,
    senderName: `User ${idCounter}`,
    text: `Test message ${idCounter}`,
    timestamp: "10:00 AM",
    type: "User",
    ...overrides,
  };
}

export function createMockVoteStats(
  overrides: Partial<VoteStats> = {},
): VoteStats {
  return {
    average: 5,
    mode: "5",
    spread: 4,
    consensus: true,
    distribution: { "3": 1, "5": 3, "8": 1 },
    ...overrides,
  };
}

// Create players with specific votes
export function createPlayersWithVotes(votes: (string | null)[]): Player[] {
  return votes.map((vote, index) => ({
    id: `player-${index}`,
    name: `Player ${index + 1}`,
    role: index === 0 ? ("FACILITATOR" as const) : ("MEMBER" as const),
    vote,
  }));
}

// Reset ID counter between tests
export function resetMockIds() {
  idCounter = 0;
}
