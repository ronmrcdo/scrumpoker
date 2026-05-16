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
    it("should show '?' when player has not voted", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
        />,
      );
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("should show 'In' when player has voted but not revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
          isRevealed={false}
        />,
      );
      expect(screen.getByText("In")).toBeInTheDocument();
    });

    it("should show vote value when revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "8" })}
          isRevealed={true}
        />,
      );
      expect(screen.getByText("In · 8")).toBeInTheDocument();
    });

    it("should show coffee emoji vote when revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "☕" })}
          isRevealed={true}
        />,
      );
      expect(screen.getByText("In · ☕")).toBeInTheDocument();
    });
  });

  describe("vote indicator dot", () => {
    it("should show muted dot when online and not voted", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
        />,
      );
      expect(
        container.querySelector(".bg-muted-foreground"),
      ).toBeInTheDocument();
    });

    it("should show success dot when voted", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
        />,
      );
      expect(container.querySelector(".bg-success")).toBeInTheDocument();
    });
  });

  describe("facilitator badge", () => {
    it("should show Facilitator badge for facilitators", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ role: "FACILITATOR" })}
        />,
      );
      expect(screen.getByText("Facilitator")).toBeInTheDocument();
    });

    it("should not show Facilitator badge for regular members", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ role: "MEMBER" })}
        />,
      );
      expect(screen.queryByText("Facilitator")).not.toBeInTheDocument();
    });
  });

  describe("fold status", () => {
    it("should show Fold text when player has folded", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "FOLD" })}
          isRevealed={false}
        />,
      );
      expect(screen.getByText("Fold")).toBeInTheDocument();
    });

    it("should show Fold with destructive styling", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "FOLD" })}
        />,
      );
      const foldedText = screen.getByText("Fold");
      expect(foldedText).toHaveClass("text-destructive");
    });

    it("should show destructive indicator dot when folded", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "FOLD" })}
        />,
      );
      expect(container.querySelector(".bg-destructive")).toBeInTheDocument();
    });

    it("should show Fold even when revealed", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "FOLD" })}
          isRevealed={true}
        />,
      );
      expect(screen.getByText("Fold")).toBeInTheDocument();
    });
  });

  describe("current user styling", () => {
    it("should highlight current user", () => {
      const { container } = render(
        <PlayerItem {...defaultProps} isCurrentUser={true} />,
      );
      expect(container.querySelector(".bg-bone-2")).toBeInTheDocument();
    });

    it("should not highlight non-current users", () => {
      const { container } = render(
        <PlayerItem {...defaultProps} isCurrentUser={false} />,
      );
      // Only avatar uses bg-bone-2 in non-current state; the row itself shouldn't
      const row = container.querySelector(".items-center.gap-3.px-4");
      expect(row?.className).not.toMatch(/\bbg-bone-2\b/);
    });

    it("should still render avatar fallback for current user", () => {
      render(<PlayerItem {...defaultProps} isCurrentUser={true} />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  describe("kick functionality", () => {
    it("should not show kick button for non-facilitators", () => {
      render(
        <PlayerItem {...defaultProps} isFacilitator={false} onKick={vi.fn()} />,
      );
      expect(
        screen.queryByRole("button", { name: /remove .* from room/i }),
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
        screen.queryByRole("button", { name: /remove .* from room/i }),
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
        screen.queryByRole("button", { name: /remove .* from room/i }),
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
      expect(
        screen.getByRole("button", { name: /remove .* from room/i }),
      ).toBeInTheDocument();
    });

    it("should open confirmation dialog when kick button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlayerItem {...defaultProps} isFacilitator={true} onKick={vi.fn()} />,
      );

      await user.click(
        screen.getByRole("button", { name: /remove .* from room/i }),
      );
      expect(screen.getByText(/Remove Alice\?/)).toBeInTheDocument();
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

      await user.click(
        screen.getByRole("button", { name: /remove .* from room/i }),
      );
      expect(screen.getByText("Remove Bob?")).toBeInTheDocument();
      expect(
        screen.getByText(/removed from the room.*rejoin with the room link/),
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

      await user.click(
        screen.getByRole("button", { name: /remove .* from room/i }),
      );
      await user.click(screen.getByRole("button", { name: "Remove" }));

      expect(onKick).toHaveBeenCalledWith("player-123");
    });

    it("should close dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      render(
        <PlayerItem {...defaultProps} isFacilitator={true} onKick={vi.fn()} />,
      );

      await user.click(
        screen.getByRole("button", { name: /remove .* from room/i }),
      );
      expect(screen.getByText(/Remove Alice\?/)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByText(/Remove Alice\?/)).not.toBeInTheDocument();
    });

    it("should not call onKick when cancelled", async () => {
      const user = userEvent.setup();
      const onKick = vi.fn();

      render(
        <PlayerItem {...defaultProps} isFacilitator={true} onKick={onKick} />,
      );

      await user.click(
        screen.getByRole("button", { name: /remove .* from room/i }),
      );
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onKick).not.toHaveBeenCalled();
    });
  });

  describe("online/offline status", () => {
    it("should show gray dot when player is offline", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
          isOnline={false}
        />,
      );
      expect(
        container.querySelector(".bg-muted-foreground"),
      ).toBeInTheDocument();
    });

    it("should show 'Offline' text when player is offline", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
          isOnline={false}
        />,
      );
      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(screen.queryByText("?")).not.toBeInTheDocument();
    });

    it("should show 'Offline' text even when player has voted", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
          isOnline={false}
        />,
      );
      expect(screen.getByText("Offline")).toBeInTheDocument();
      expect(screen.queryByText("In")).not.toBeInTheDocument();
    });

    it("should show gray dot when offline even if player voted", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
          isOnline={false}
        />,
      );
      expect(
        container.querySelector(".bg-muted-foreground"),
      ).toBeInTheDocument();
      expect(container.querySelector(".bg-success")).not.toBeInTheDocument();
    });

    it("should show success vote dot when online", () => {
      const { container } = render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: "5" })}
          isOnline={true}
        />,
      );
      expect(container.querySelector(".bg-success")).toBeInTheDocument();
      expect(
        container.querySelector(".bg-muted-foreground"),
      ).not.toBeInTheDocument();
    });

    it("should default to online when isOnline is not provided", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
        />,
      );
      expect(screen.getByText("?")).toBeInTheDocument();
      expect(screen.queryByText("Offline")).not.toBeInTheDocument();
    });

    it("should apply muted text styling when offline", () => {
      render(
        <PlayerItem
          {...defaultProps}
          player={createMockPlayer({ vote: null })}
          isOnline={false}
        />,
      );
      const offlineText = screen.getByText("Offline");
      expect(offlineText).toHaveClass("text-muted-foreground");
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
      expect(screen.getByText("?")).toBeInTheDocument();
    });
  });
});
