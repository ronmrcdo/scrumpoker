import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test/test-utils";
import { createMockPlayer } from "@/test/test-utils";
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
    it("should display Players header", () => {
      render(<PlayerList {...defaultProps} />);
      expect(screen.getByText("Players")).toBeInTheDocument();
    });

    it("should display vote count", () => {
      const players = createPlayers(5, 2); // 2 voted out of 5
      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText("2/5 voted")).toBeInTheDocument();
    });

    it("should display 0 voted when no one voted", () => {
      const players = createPlayers(3, 0);
      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText("0/3 voted")).toBeInTheDocument();
    });

    it("should display all voted", () => {
      const players = createPlayers(4, 4);
      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText("4/4 voted")).toBeInTheDocument();
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
        <PlayerList {...defaultProps} players={players} currentUserId="player-1" />,
      );
      // The current user item should have highlighting
      expect(container.querySelectorAll(".bg-primary-50").length).toBeGreaterThan(0);
    });

    it("should pass isRevealed to player items", () => {
      const players = createPlayers(2, 2);
      render(<PlayerList {...defaultProps} players={players} isRevealed={true} />);

      // When revealed, should show the actual votes
      expect(screen.getAllByText(/Voted: 5/).length).toBe(2);
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
      expect(screen.getByText("Leave Room?")).toBeInTheDocument();
    });

    it("should show leave confirmation message", async () => {
      const user = userEvent.setup();
      render(<PlayerList {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      expect(
        screen.getByText(/Are you sure you want to leave this room/),
      ).toBeInTheDocument();
    });

    it("should call onLeave when confirmed", async () => {
      const user = userEvent.setup();
      const onLeave = vi.fn();

      render(<PlayerList {...defaultProps} onLeave={onLeave} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      await user.click(screen.getByRole("button", { name: "Leave Room" }));

      expect(onLeave).toHaveBeenCalledTimes(1);
    });

    it("should close dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(<PlayerList {...defaultProps} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      expect(screen.getByText("Leave Room?")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByText("Leave Room?")).not.toBeInTheDocument();
    });

    it("should not call onLeave when cancelled", async () => {
      const user = userEvent.setup();
      const onLeave = vi.fn();

      render(<PlayerList {...defaultProps} onLeave={onLeave} />);

      await user.click(screen.getByRole("button", { name: /leave room/i }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onLeave).not.toHaveBeenCalled();
    });
  });

  describe("kick functionality", () => {
    it("should pass onKick to player items for facilitator", async () => {
      const user = userEvent.setup();
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
      const kickButtons = screen.getAllByRole("button", { name: /kick/i });
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

      expect(screen.queryByRole("button", { name: /kick/i })).not.toBeInTheDocument();
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
      expect(screen.getByText("2/4 voted")).toBeInTheDocument();
    });

    it("should count coffee break as a vote", () => {
      const players = [
        createMockPlayer({ vote: "5" }),
        createMockPlayer({ vote: "☕" }),
        createMockPlayer({ vote: null }),
      ];

      render(<PlayerList {...defaultProps} players={players} />);
      expect(screen.getByText("2/3 voted")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should handle empty players array", () => {
      render(<PlayerList {...defaultProps} players={[]} />);
      expect(screen.getByText("0/0 voted")).toBeInTheDocument();
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
