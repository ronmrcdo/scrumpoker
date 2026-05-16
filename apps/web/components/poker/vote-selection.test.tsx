import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { VoteSelection } from "./vote-selection";

/** Helper to get a vote button by its card value using the aria-label pattern */
function getVoteButton(value: string) {
  return screen.getByRole("button", {
    name: `Vote ${value} story points`,
  });
}

describe("VoteSelection", () => {
  const defaultProps = {
    currentVote: null,
    isRevealed: false,
    onVote: vi.fn(),
  };

  describe("rendering", () => {
    it("should render the hidden legend for screen readers", () => {
      render(<VoteSelection {...defaultProps} />);
      expect(screen.getByText(/pick a card/i)).toBeInTheDocument();
    });

    it("should render all card values", () => {
      render(<VoteSelection {...defaultProps} />);

      const cardValues = ["1", "2", "3", "5", "8", "13", "21", "☕"];
      for (const value of cardValues) {
        expect(getVoteButton(value)).toBeInTheDocument();
      }
    });

    it("should render 8 card buttons plus 1 fold button", () => {
      render(<VoteSelection {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(9);
    });
  });

  describe("voting interaction", () => {
    it("should call onVote when a card is clicked", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      render(
        <VoteSelection currentVote={null} isRevealed={false} onVote={onVote} />,
      );

      await user.click(getVoteButton("5"));
      expect(onVote).toHaveBeenCalledWith("5");
    });

    it("should call onVote with correct value for each card", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      render(
        <VoteSelection currentVote={null} isRevealed={false} onVote={onVote} />,
      );

      const cardValues = ["1", "2", "3", "5", "8", "13", "21", "☕"];
      for (const value of cardValues) {
        await user.click(getVoteButton(value));
        expect(onVote).toHaveBeenCalledWith(value);
      }

      expect(onVote).toHaveBeenCalledTimes(8);
    });

    it("should allow changing vote by clicking different card", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      const { rerender } = render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={onVote} />,
      );

      await user.click(getVoteButton("8"));
      expect(onVote).toHaveBeenCalledWith("8");

      // Simulate vote change
      rerender(
        <VoteSelection currentVote="8" isRevealed={false} onVote={onVote} />,
      );

      await user.click(getVoteButton("3"));
      expect(onVote).toHaveBeenCalledWith("3");
    });
  });

  describe("current vote styling", () => {
    it("should highlight the currently selected vote with foreground border + outline", () => {
      render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={vi.fn()} />,
      );

      const selectedButton = getVoteButton("5");
      expect(selectedButton).toHaveClass("border-foreground");
      expect(selectedButton.getAttribute("aria-pressed")).toBe("true");
    });

    it("should not highlight unselected votes", () => {
      render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={vi.fn()} />,
      );

      const unselectedButton = getVoteButton("3");
      expect(unselectedButton).not.toHaveClass("border-foreground");
      expect(unselectedButton).toHaveClass("bg-card");
    });

    it("should highlight coffee break when selected", () => {
      render(
        <VoteSelection currentVote="☕" isRevealed={false} onVote={vi.fn()} />,
      );

      const coffeeButton = getVoteButton("☕");
      expect(coffeeButton).toHaveClass("border-foreground");
    });

    it("should have no highlighted card when no vote", () => {
      render(
        <VoteSelection
          currentVote={null}
          isRevealed={false}
          onVote={vi.fn()}
        />,
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveClass("border-foreground");
      });
    });
  });

  describe("disabled state when revealed", () => {
    it("should disable all buttons when isRevealed is true", () => {
      render(
        <VoteSelection currentVote="5" isRevealed={true} onVote={vi.fn()} />,
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("should not call onVote when clicking disabled button", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      render(
        <VoteSelection currentVote="5" isRevealed={true} onVote={onVote} />,
      );

      await user.click(getVoteButton("8"));
      expect(onVote).not.toHaveBeenCalled();
    });

    it("should enable buttons when isRevealed changes to false", () => {
      const { rerender } = render(
        <VoteSelection currentVote="5" isRevealed={true} onVote={vi.fn()} />,
      );

      // All buttons disabled
      screen.getAllByRole("button").forEach((button) => {
        expect(button).toBeDisabled();
      });

      rerender(
        <VoteSelection currentVote="5" isRevealed={false} onVote={vi.fn()} />,
      );

      // All buttons enabled
      screen.getAllByRole("button").forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe("styling and layout", () => {
    it("should use flex layout for the hand row", () => {
      const { container } = render(<VoteSelection {...defaultProps} />);
      expect(container.querySelector(".flex")).toBeInTheDocument();
    });

    it("should render a dedicated Fold button below the hand", () => {
      render(<VoteSelection {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /fold — need more info/i }),
      ).toBeInTheDocument();
    });

    it("should be full-width on mobile and auto-width centered on desktop", () => {
      render(<VoteSelection {...defaultProps} />);
      const foldButton = screen.getByRole("button", {
        name: /fold — need more info/i,
      });

      expect(foldButton).toHaveClass("w-full");
      expect(foldButton).toHaveClass("sm:w-auto");
      expect(foldButton).toHaveClass("sm:px-8");
      expect(foldButton).toHaveClass("sm:mx-auto");
      expect(foldButton).toHaveClass("sm:block");
    });
  });

  describe("accessibility", () => {
    it("should have button type attribute", () => {
      render(<VoteSelection {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });

    it("should have aria-pressed on vote buttons", () => {
      render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={vi.fn()} />,
      );

      expect(getVoteButton("5")).toHaveAttribute("aria-pressed", "true");
      expect(getVoteButton("3")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("edge cases", () => {
    it("should handle rapid clicking", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      render(
        <VoteSelection currentVote={null} isRevealed={false} onVote={onVote} />,
      );

      const button = getVoteButton("5");

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(onVote).toHaveBeenCalledTimes(3);
    });

    it("should maintain selection styling after rapid reselection", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      const { rerender } = render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={onVote} />,
      );

      // Click same button
      await user.click(getVoteButton("5"));

      rerender(
        <VoteSelection currentVote="5" isRevealed={false} onVote={onVote} />,
      );

      const selectedButton = getVoteButton("5");
      expect(selectedButton).toHaveClass("border-foreground");
    });
  });
});
