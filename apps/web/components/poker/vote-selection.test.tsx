import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { VoteSelection } from "./vote-selection";

describe("VoteSelection", () => {
  const defaultProps = {
    currentVote: null,
    isRevealed: false,
    onVote: vi.fn(),
  };

  describe("rendering", () => {
    it("should render the header text", () => {
      render(<VoteSelection {...defaultProps} />);
      expect(screen.getByText("Choose Your Card")).toBeInTheDocument();
    });

    it("should render all card values", () => {
      render(<VoteSelection {...defaultProps} />);

      const cardValues = ["1", "2", "3", "5", "8", "13", "21", "☕"];
      for (const value of cardValues) {
        expect(screen.getByRole("button", { name: value })).toBeInTheDocument();
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

      await user.click(screen.getByRole("button", { name: "5" }));
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
        await user.click(screen.getByRole("button", { name: value }));
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

      await user.click(screen.getByRole("button", { name: "8" }));
      expect(onVote).toHaveBeenCalledWith("8");

      // Simulate vote change
      rerender(
        <VoteSelection currentVote="8" isRevealed={false} onVote={onVote} />,
      );

      await user.click(screen.getByRole("button", { name: "3" }));
      expect(onVote).toHaveBeenCalledWith("3");
    });
  });

  describe("current vote styling", () => {
    it("should highlight the currently selected vote", () => {
      render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={vi.fn()} />,
      );

      const selectedButton = screen.getByRole("button", { name: "5" });
      expect(selectedButton).toHaveClass("bg-primary-500");
      expect(selectedButton).toHaveClass("text-white");
    });

    it("should not highlight unselected votes", () => {
      render(
        <VoteSelection currentVote="5" isRevealed={false} onVote={vi.fn()} />,
      );

      const unselectedButton = screen.getByRole("button", { name: "3" });
      expect(unselectedButton).not.toHaveClass("bg-primary-500");
      expect(unselectedButton).toHaveClass("bg-card");
    });

    it("should highlight coffee break when selected", () => {
      render(
        <VoteSelection currentVote="☕" isRevealed={false} onVote={vi.fn()} />,
      );

      const coffeeButton = screen.getByRole("button", { name: "☕" });
      expect(coffeeButton).toHaveClass("bg-primary-500");
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
        expect(button).not.toHaveClass("bg-primary-500");
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

      await user.click(screen.getByRole("button", { name: "8" }));
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
    it("should use grid layout", () => {
      const { container } = render(<VoteSelection {...defaultProps} />);
      expect(container.querySelector(".grid")).toBeInTheDocument();
    });

    it("should apply animation delay to card buttons", () => {
      render(<VoteSelection {...defaultProps} />);

      const cardValues = ["1", "2", "3", "5", "8", "13", "21", "☕"];
      cardValues.forEach((value, index) => {
        const button = screen.getByRole("button", { name: value });
        expect(button).toHaveStyle({
          animationDelay: `${index * 50}ms`,
        });
      });
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
  });

  describe("edge cases", () => {
    it("should handle rapid clicking", async () => {
      const user = userEvent.setup();
      const onVote = vi.fn();

      render(
        <VoteSelection currentVote={null} isRevealed={false} onVote={onVote} />,
      );

      const button = screen.getByRole("button", { name: "5" });

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
      await user.click(screen.getByRole("button", { name: "5" }));

      rerender(
        <VoteSelection currentVote="5" isRevealed={false} onVote={onVote} />,
      );

      const selectedButton = screen.getByRole("button", { name: "5" });
      expect(selectedButton).toHaveClass("bg-primary-500");
    });
  });
});
