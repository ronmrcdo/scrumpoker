import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createMockPlayer, render, screen } from "@/test/test-utils";
import { PlayerItem } from "./player-item";

describe("PlayerItem", () => {
  const defaultProps = {
    player: createMockPlayer({ name: "Alice", vote: null }),
    isCurrentUser: false,
    isRevealed: false,
    isFacilitator: false,
    onKick: undefined,
  };

  describe("basic rendering", () => {
    it("should render player name", () => {
      render(<PlayerItem {...defaultProps} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("should show initials in avatar", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ name: "Alice Brown" })}
        />,
      );
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("should show single initial for single name", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ name: "Alice" })}
        />,
      );
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("should limit initials to 2 characters", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ name: "Alice Brown Charlie" })}
        />,
      );
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("should uppercase initials", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ name: "alice brown" })}
        />,
      );
      expect(screen.getByText("AB")).toBeInTheDocument();
    });
  });

  describe("voting status", () => {
    it("should show 'Thinking...' when player has not voted", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
        />,
      );
      expect(screen.getByText("Thinking...")).toBeInTheDocument();
    });

    it("should show 'Voted' when player has voted but not revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
          isRevealed={false}
        />,
      );
      expect(screen.getByText("Voted")).toBeInTheDocument();
    });

    it("should show vote value when revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "8" })}
          isRevealed={true}
        />,
      );
      expect(screen.getByText("Voted: 8")).toBeInTheDocument();
    });

    it("should show coffee emoji vote when revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "☕" })}
          isRevealed={true}
        />,
      );
      expect(screen.getByText("Voted: ☕")).toBeInTheDocument();
    });
  });

  describe("vote indicator dot", () => {
    it("should show inactive dot when not voted", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
        />,
      );
      expect(
        container.querySelector(".bg-muted-foreground\\/40"),
      ).toBeInTheDocument();
    });

    it("should show active dot when voted", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
        />,
      );
      expect(container.querySelector(".bg-accent-500")).toBeInTheDocument();
    });
  });

  describe("facilitator badge", () => {
    it("should show Host badge for facilitators", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ role: "FACILITATOR" })}
        />,
      );
      expect(screen.getByText("Host")).toBeInTheDocument();
    });

    it("should not show Host badge for regular members", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ role: "MEMBER" })}
        />,
      );
      expect(screen.queryByText("Host")).not.toBeInTheDocument();
    });
  });

  describe("current user styling", () => {
    it("should highlight current user", () => {
      const { container } = render(
        <PlayerItem {...defaultProps} isCurrentUser={true} />,
      );
      expect(container.querySelector(".bg-primary-50")).toBeInTheDocument();
    });

    it("should not highlight non-current users", () => {
      const { container } = render(
        <PlayerItem {...defaultProps} isCurrentUser={false} />,
      );
      expect(container.querySelector(".bg-primary-50")).not.toBeInTheDocument();
    });

    it("should style avatar differently for current user", () => {
      const { container } = render(
        <PlayerItem {...defaultProps} isCurrentUser={true} />,
      );
      expect(container.querySelector(".bg-primary-100")).toBeInTheDocument();
    });
  });

  describe("kick functionality", () => {
    it("should not show kick button for non-facilitators", () => {
      render(
        <PlayerItem {...defaultProps} isFacilitator={false} onKick={vi.fn()} />,
      );
      expect(
        screen.queryByRole("button", { name: /kick/i }),
      ).not.toBeInTheDocument();
    });

    it("should not show kick button for current user", () => {
      render(
        <PlayerItem
          {...defaultProps}
          isFacilitator={true}
          isCurrentUser={true}
          onKick={vi.fn()}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /kick/i }),
      ).not.toBeInTheDocument();
    });

    it("should not show kick button when onKick is not provided", () => {
      render(
        <PlayerItem
          {...defaultProps}
          isFacilitator={true}
          onKick={undefined}
        />,
      );
      expect(
        screen.queryByRole("button", { name: /kick/i }),
      ).not.toBeInTheDocument();
    });

    it("should show kick button for facilitator on other players", () => {
      render(
        <PlayerItem
          {...defaultProps}
          isFacilitator={true}
          isCurrentUser={false}
          onKick={vi.fn()}
        />,
      );
      expect(screen.getByRole("button", { name: /kick/i })).toBeInTheDocument();
    });

    it("should open confirmation dialog when kick button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlayerItem {...defaultProps} isFacilitator={true} onKick={vi.fn()} />,
      );

      await user.click(screen.getByRole("button", { name: /kick/i }));
      expect(screen.getByText("Kick Player?")).toBeInTheDocument();
    });

    it("should show player name in confirmation dialog", async () => {
      const user = userEvent.setup();
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ name: "Bob" })}
          isFacilitator={true}
          onKick={vi.fn()}
        />,
      );

      await user.click(screen.getByRole("button", { name: /kick/i }));
      expect(
        screen.getByText(/Are you sure you want to remove Bob/),
      ).toBeInTheDocument();
    });

    it("should call onKick when confirmed", async () => {
      const user = userEvent.setup();
      const onKick = vi.fn();
      const player = createMockPlayer({ id: "player-123" });

      render(
        <PlayerItem
          {...defaultProps}
          player={player}
          isFacilitator={true}
          onKick={onKick}
        />,
      );

      await user.click(screen.getByRole("button", { name: /kick/i }));
      await user.click(screen.getByRole("button", { name: "Kick Player" }));

      expect(onKick).toHaveBeenCalledWith("player-123");
    });

    it("should close dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlayerItem {...defaultProps} isFacilitator={true} onKick={vi.fn()} />,
      );

      await user.click(screen.getByRole("button", { name: /kick/i }));
      expect(screen.getByText("Kick Player?")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByText("Kick Player?")).not.toBeInTheDocument();
    });

    it("should not call onKick when cancelled", async () => {
      const user = userEvent.setup();
      const onKick = vi.fn();

      render(
        <PlayerItem {...defaultProps} isFacilitator={true} onKick={onKick} />,
      );

      await user.click(screen.getByRole("button", { name: /kick/i }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onKick).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle very long names", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({
            name: "This Is A Very Long Player Name That Should Be Truncated",
          })}
        />,
      );
      const nameElement = screen.getByText(
        "This Is A Very Long Player Name That Should Be Truncated",
      );
      expect(nameElement).toHaveClass("truncate");
    });

    it("should handle empty name", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ name: "" })}
        />,
      );
      // Should still render without crashing
      expect(screen.getByText("Thinking...")).toBeInTheDocument();
    });
  });
});
