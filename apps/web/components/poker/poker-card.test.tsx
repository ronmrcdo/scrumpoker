import { act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";
import { PokerCard } from "./poker-card";

describe("PokerCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render member name", () => {
      render(
        <PokerCard
          memberName="Alice"
          vote={null}
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("should show question mark when no vote", () => {
      render(
        <PokerCard
          memberName="Alice"
          vote={null}
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("should show checkmark when voted but not revealed", () => {
      render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("should show vote value when revealed", () => {
      render(
        <PokerCard
          memberName="Alice"
          vote="8"
          isRevealed={true}
          isCurrentUser={false}
        />,
      );
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should show coffee emoji when revealed", () => {
      render(
        <PokerCard
          memberName="Alice"
          vote="☕"
          isRevealed={true}
          isCurrentUser={false}
        />,
      );
      expect(screen.getByText("☕")).toBeInTheDocument();
    });
  });

  describe("styling based on state", () => {
    it("should have dashed border when no vote", () => {
      const { container } = render(
        <PokerCard
          memberName="Alice"
          vote={null}
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      expect(container.querySelector(".border-dashed")).toBeInTheDocument();
    });

    it("should not have dashed border when voted", () => {
      const { container } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      expect(container.querySelector(".border-dashed")).not.toBeInTheDocument();
    });
  });

  describe("compact mode", () => {
    it("should render in compact mode", () => {
      const { container } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
          compact={true}
        />,
      );
      // Compact mode uses smaller dimensions
      expect(container.querySelector(".w-10")).toBeInTheDocument();
    });

    it("should render in normal mode by default", () => {
      const { container } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      // Normal mode uses larger dimensions
      expect(container.querySelector(".w-12")).toBeInTheDocument();
    });
  });

  describe("current user indicator", () => {
    it("should highlight current user name", () => {
      const { container } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={true}
        />,
      );
      expect(container.querySelector(".text-primary-600")).toBeInTheDocument();
    });

    it("should not highlight non-current user name", () => {
      const { container } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      expect(
        container.querySelector(".text-muted-foreground"),
      ).toBeInTheDocument();
    });
  });

  describe("flip animation", () => {
    it("should trigger flip animation when revealed with a vote", () => {
      const { container, rerender } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
        />,
      );

      // Initially no animation
      expect(container.querySelector(".animate-flip")).not.toBeInTheDocument();

      // Reveal the card
      rerender(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={true}
          isCurrentUser={false}
        />,
      );

      // Animation should be applied
      expect(container.querySelector(".animate-flip")).toBeInTheDocument();
    });

    it("should not flip when revealed without a vote", () => {
      const { container, rerender } = render(
        <PokerCard
          memberName="Alice"
          vote={null}
          isRevealed={false}
          isCurrentUser={false}
        />,
      );

      rerender(
        <PokerCard
          memberName="Alice"
          vote={null}
          isRevealed={true}
          isCurrentUser={false}
        />,
      );

      expect(container.querySelector(".animate-flip")).not.toBeInTheDocument();
    });

    it("should remove flip animation after timeout", async () => {
      const { container, rerender } = render(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={false}
          isCurrentUser={false}
        />,
      );

      rerender(
        <PokerCard
          memberName="Alice"
          vote="5"
          isRevealed={true}
          isCurrentUser={false}
        />,
      );

      expect(container.querySelector(".animate-flip")).toBeInTheDocument();

      // Fast forward past the animation timeout (600ms) and flush React updates
      await act(async () => {
        vi.advanceTimersByTime(700);
      });

      expect(container.querySelector(".animate-flip")).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should truncate long names", () => {
      render(
        <PokerCard
          memberName="Very Long Name That Should Be Truncated"
          vote={null}
          isRevealed={false}
          isCurrentUser={false}
        />,
      );
      const nameElement = screen.getByText(
        "Very Long Name That Should Be Truncated",
      );
      expect(nameElement).toHaveClass("truncate");
    });

    it("should handle empty name", () => {
      render(
        <PokerCard
          memberName=""
          vote="5"
          isRevealed={true}
          isCurrentUser={false}
        />,
      );
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should handle all card values", () => {
      const cardValues = ["1", "2", "3", "5", "8", "13", "21", "☕"];

      for (const value of cardValues) {
        const { unmount } = render(
          <PokerCard
            memberName="Alice"
            vote={value}
            isRevealed={true}
            isCurrentUser={false}
          />,
        );
        expect(screen.getByText(value)).toBeInTheDocument();
        unmount();
      }
    });
  });
});
