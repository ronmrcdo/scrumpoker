import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockRoom } from "@/test/test-utils";
import { PlayerSidebar } from "./player-sidebar";

const mockPush = vi.fn();
const mockLeaveRoom = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

// Keep the test focused on the leave handler rather than the list UI.
vi.mock("../players/player-list", () => ({
  PlayerList: ({ onLeave }: { onLeave: () => void }) => (
    <button type="button" onClick={onLeave}>
      Leave Room
    </button>
  ),
}));

const room = createMockRoom();

vi.mock("@/lib/store/poker-store", () => ({
  usePokerStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      room,
      isPlayerListOpen: true,
      togglePlayerList: vi.fn(),
      leaveRoom: mockLeaveRoom,
      kickPlayer: vi.fn(),
      currentUserId: "user-1",
      onlinePlayerIds: [],
    }),
}));

describe("PlayerSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLeaveRoom.mockResolvedValue(undefined);
  });

  it("redirects home after leaving the room", async () => {
    const user = userEvent.setup();
    render(<PlayerSidebar />);

    await user.click(screen.getByRole("button", { name: "Leave Room" }));

    await waitFor(() => {
      expect(mockLeaveRoom).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  // Regression: a rejected leave_room RPC skipped the redirect entirely and
  // stranded the user in a room they had asked to leave.
  it("still redirects home when leaving fails", async () => {
    mockLeaveRoom.mockRejectedValue(new Error("network down"));
    const user = userEvent.setup();
    render(<PlayerSidebar />);

    await user.click(screen.getByRole("button", { name: "Leave Room" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
