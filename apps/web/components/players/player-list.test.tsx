import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createMockPlayer, render, screen } from "@/test/test-utils";
import { PlayerList } from "./player-list";

describe("PlayerList", () => {
  const createPlayers = (count: number, votedCount = 0) => {
    return Array.from({ length: count }, (_, i) =>
      createMockPlayer({
        id: `player-${i}`,
        name: `Player ${i + 1}`,
        role: i === 0 ? "FACILITATOR" : "MEMBER",
        vote: i < votedCount ? "5" : null,
      }),
    );
  };

  const defaultProps = {
    players: createPlayers(3),
    currentUserId: "player-0",
    isRevealed: false,
    isFacilitator: true,
    onLeave: vi.fn(),
    onKick: vi.fn(),
  };

  describe("header", () => {
    it("should display 'At the table' header", () => {
      render(<PlayerList {...defaultProps} />);
      expect(screen.getByText("At the table")).toBeInTheDocument();
    });

    it("should display vote count in IN format", () => {
      const players = createPlayers(5, 2); // 2 voted out of 5
      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText(/2\/5 In/i)).toBeInTheDocument();
    });

    it("should display 0/N In when no one voted", () => {
      const players = createPlayers(3, 0);
      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText(/0\/3 In/i)).toBeInTheDocument();
    });

    it("should display all voted (4/4 In)", () => {
      const players = createPlayers(4, 4);
      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText(/4\/4 In/i)).toBeInTheDocument();
    });
  });

  describe("player rendering", () => {
    it("should render all players", () => {
      const players = createPlayers(5);
      render(<PlayerList {...defaultProps} players={players} />);

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Player ${i}`)).toBeInTheDocument();
      }
    });

    it("should identify current user", () => {
      const players = createPlayers(3);
      const { container } = render(
        <PlayerList
          {...defaultProps}
          players={players}
          currentUserId="player-1"
        />,
      );
      // The current user row gets bg-bone-2 background highlighting
      expect(container.querySelectorAll(".bg-bone-2").length).toBeGreaterThan(
        0,
      );
    });

    it("should pass isRevealed to player items", () => {
      const players = createPlayers(2, 2);
      render(
        <PlayerList {...defaultProps} players={players} isRevealed={true} />,
      );

      // When revealed, status renders as "In · 5" for each voter
      expect(screen.getAllByText(/In · 5/).length).toBe(2);
    });
  });

  describe("leave room functionality", () => {
    it("should render Leave Room button", () => {
      render(<PlayerList {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /leave room/i }),
      ).toBeInTheDocument();
    });

    it("should open confirmation dialog when Leave Room is clicked", async () => {
      const user = userEvent.setup();
      render(<PlayerList {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      expect(screen.getByText("Leave this room?")).toBeInTheDocument();
    });

    it("should show leave confirmation message", async () => {
      const user = userEvent.setup();
      render(<PlayerList {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      expect(
        screen.getByText(/You'll need the room link to rejoin/),
      ).toBeInTheDocument();
    });

    it("should call onLeave when confirmed", async () => {
      const user = userEvent.setup();
      const onLeave = vi.fn();

      render(<PlayerList {...defaultProps} onLeave={onLeave} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      await user.click(screen.getByRole("button", { name: "Leave" }));

      expect(onLeave).toHaveBeenCalledTimes(1);
    });

    it("should close dialog when Stay is clicked", async () => {
      const user = userEvent.setup();
      render(<PlayerList {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      expect(screen.getByText("Leave this room?")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Stay" }));
      expect(screen.queryByText("Leave this room?")).not.toBeInTheDocument();
    });

    it("should not call onLeave when Stay is clicked", async () => {
      const user = userEvent.setup();
      const onLeave = vi.fn();

      render(<PlayerList {...defaultProps} onLeave={onLeave} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      await user.click(screen.getByRole("button", { name: "Stay" }));

      expect(onLeave).not.toHaveBeenCalled();
    });
  });

  describe("kick functionality", () => {
    it("should pass onKick to player items for facilitator", () => {
      const onKick = vi.fn();
      const players = createPlayers(2);

      render(
        <PlayerList
          {...defaultProps}
          players={players}
          currentUserId="player-0"
          isFacilitator={true}
          onKick={onKick}
        />,
      );

      // Find kick button for Player 2 (not current user)
      const kickButtons = screen.getAllByRole("button", {
        name: /remove .* from room/i,
      });
      expect(kickButtons.length).toBe(1); // Only one kick button (can't kick yourself)
    });

    it("should not show kick buttons for non-facilitators", () => {
      const players = createPlayers(3);

      render(
        <PlayerList
          {...defaultProps}
          players={players}
          isFacilitator={false}
        />,
      );

      expect(
        screen.queryByRole("button", { name: /remove .* from room/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("vote counting", () => {
    it("should correctly count votes with null values", () => {
      const players = [
        createMockPlayer({ vote: "5" }),
        createMockPlayer({ vote: null }),
        createMockPlayer({ vote: "8" }),
        createMockPlayer({ vote: null }),
      ];

      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText(/2\/4 In/i)).toBeInTheDocument();
    });

    it("should count coffee break as a vote", () => {
      const players = [
        createMockPlayer({ vote: "5" }),
        createMockPlayer({ vote: "☕" }),
        createMockPlayer({ vote: null }),
      ];

      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText(/2\/3 In/i)).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should handle empty players array", () => {
      render(<PlayerList {...defaultProps} players={[]} />);
      expect(screen.getByText(/0\/0 In/i)).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have scrollable player list", () => {
      const { container } = render(<PlayerList {...defaultProps} />);
      expect(container.querySelector(".overflow-y-auto")).toBeInTheDocument();
    });

    it("should have flex column layout", () => {
      const { container } = render(<PlayerList {...defaultProps} />);
      expect(container.querySelector(".flex-col")).toBeInTheDocument();
    });
  });

  describe("large player lists", () => {
    it("should render 10 players", () => {
      const players = createPlayers(10);
      render(<PlayerList {...defaultProps} players={players} />);

      expect(screen.getByText("Player 1")).toBeInTheDocument();
      expect(screen.getByText("Player 10")).toBeInTheDocument();
    });
  });
});
