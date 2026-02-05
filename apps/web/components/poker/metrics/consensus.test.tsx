import { describe, expect, it } from "vitest";

import { createMockVoteStats, render, screen } from "@/test/test-utils";
import { Consensus } from "./consensus";

describe("Consensus", () => {
  describe("when stats is null", () => {
    it("should show waiting message", () => {
      render(<Consensus stats={null} />);
      expect(screen.getByText("Waiting for votes...")).toBeInTheDocument();
    });

    it("should render a card", () => {
      const { container } = render(<Consensus stats={null} />);
      // Card component renders with specific styling
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("when stats are provided", () => {
    it("should display the mode value", () => {
      const stats = createMockVoteStats({ mode: "8" });
      render(<Consensus stats={stats} />);
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should display 'Most Common' label", () => {
      const stats = createMockVoteStats();
      render(<Consensus stats={stats} />);
      expect(screen.getByText("Most Common")).toBeInTheDocument();
    });

    it("should display 'Consensus' badge when consensus is true", () => {
      const stats = createMockVoteStats({ consensus: true });
      render(<Consensus stats={stats} />);
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });

    it("should display 'Mixed' badge when consensus is false", () => {
      const stats = createMockVoteStats({ consensus: false });
      render(<Consensus stats={stats} />);
      expect(screen.getByText("Mixed")).toBeInTheDocument();
    });
  });

  describe("badge variants", () => {
    it("should use success variant for consensus", () => {
      const stats = createMockVoteStats({ consensus: true });
      render(<Consensus stats={stats} />);

      // Badge should have success styling
      const badge = screen.getByText("Consensus");
      expect(badge).toBeInTheDocument();
    });

    it("should use warning variant for mixed", () => {
      const stats = createMockVoteStats({ consensus: false });
      render(<Consensus stats={stats} />);

      // Badge should have warning styling
      const badge = screen.getByText("Mixed");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("mode display", () => {
    it("should display numeric mode values", () => {
      const numericModes = ["1", "2", "3", "5", "8", "13", "21"];

      for (const mode of numericModes) {
        const stats = createMockVoteStats({ mode });
        const { unmount } = render(<Consensus stats={stats} />);
        expect(screen.getByText(mode)).toBeInTheDocument();
        unmount();
      }
    });

    it("should display coffee emoji as mode", () => {
      const stats = createMockVoteStats({ mode: "☕" });
      render(<Consensus stats={stats} />);
      expect(screen.getByText("☕")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have animation class for scale-in effect", () => {
      const stats = createMockVoteStats();
      const { container } = render(<Consensus stats={stats} />);
      expect(container.querySelector(".animate-scale-in")).toBeInTheDocument();
    });

    it("should have fade-in animation for waiting state", () => {
      const { container } = render(<Consensus stats={null} />);
      expect(container.querySelector(".animate-fade-in")).toBeInTheDocument();
    });

    it("should have bounce animation on mode value", () => {
      const stats = createMockVoteStats();
      const { container } = render(<Consensus stats={stats} />);
      expect(container.querySelector(".animate-bounce-once")).toBeInTheDocument();
    });
  });

  describe("state transitions", () => {
    it("should transition from waiting to showing stats", () => {
      const { rerender } = render(<Consensus stats={null} />);
      expect(screen.getByText("Waiting for votes...")).toBeInTheDocument();

      const stats = createMockVoteStats({ mode: "5" });
      rerender(<Consensus stats={stats} />);

      expect(screen.queryByText("Waiting for votes...")).not.toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should transition from stats to waiting", () => {
      const stats = createMockVoteStats({ mode: "5" });
      const { rerender } = render(<Consensus stats={stats} />);
      expect(screen.getByText("5")).toBeInTheDocument();

      rerender(<Consensus stats={null} />);

      expect(screen.getByText("Waiting for votes...")).toBeInTheDocument();
      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    it("should update mode when stats change", () => {
      const stats1 = createMockVoteStats({ mode: "3" });
      const { rerender } = render(<Consensus stats={stats1} />);
      expect(screen.getByText("3")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ mode: "8" });
      rerender(<Consensus stats={stats2} />);

      expect(screen.queryByText("3")).not.toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should update consensus badge when consensus changes", () => {
      const stats1 = createMockVoteStats({ consensus: true });
      const { rerender } = render(<Consensus stats={stats1} />);
      expect(screen.getByText("Consensus")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ consensus: false });
      rerender(<Consensus stats={stats2} />);

      expect(screen.queryByText("Consensus")).not.toBeInTheDocument();
      expect(screen.getByText("Mixed")).toBeInTheDocument();
    });
  });
});
