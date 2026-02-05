import { describe, expect, it } from "vitest";

import { createMockVoteStats, render, screen } from "@/test/test-utils";
import { VoteDistribution } from "./vote-distribution";

describe("VoteDistribution", () => {
  describe("when stats is null", () => {
    it("should render nothing", () => {
      const { container } = render(<VoteDistribution stats={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when distribution is empty", () => {
    it("should display 'No votes yet' message", () => {
      const stats = createMockVoteStats({ distribution: {} });
      render(<VoteDistribution stats={stats} />);
      expect(screen.getByText("No votes yet")).toBeInTheDocument();
    });
  });

  describe("when stats are provided", () => {
    it("should display 'Vote Distribution' label", () => {
      const stats = createMockVoteStats();
      render(<VoteDistribution stats={stats} />);
      expect(screen.getByText("Vote Distribution")).toBeInTheDocument();
    });

    it("should display vote values", () => {
      const stats = createMockVoteStats({
        distribution: { "3": 1, "5": 3, "8": 1 },
      });
      render(<VoteDistribution stats={stats} />);
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should display vote counts with percentages", () => {
      const stats = createMockVoteStats({
        distribution: { "5": 3 },
      });
      render(<VoteDistribution stats={stats} />);
      expect(screen.getByText("3 (100%)")).toBeInTheDocument();
    });

    it("should display multiple votes with correct percentages", () => {
      const stats = createMockVoteStats({
        distribution: { "3": 2, "5": 2 },
      });
      render(<VoteDistribution stats={stats} />);
      // Each has 2 out of 4, so 50%
      const percentageTexts = screen.getAllByText(/2 \(50%\)/);
      expect(percentageTexts).toHaveLength(2);
    });
  });

  describe("sorting", () => {
    it("should sort numeric values in ascending order", () => {
      const stats = createMockVoteStats({
        distribution: { "8": 1, "3": 1, "13": 1, "1": 1 },
      });
      const { container } = render(<VoteDistribution stats={stats} />);

      // Get all vote labels
      const voteLabels = container.querySelectorAll(
        ".text-sm.font-semibold, .text-base.font-semibold",
      );
      const values = Array.from(voteLabels).map((el) => el.textContent);

      // Should be sorted: 1, 3, 8, 13
      expect(values).toEqual(["1", "3", "8", "13"]);
    });

    it("should place non-numeric values at the end", () => {
      const stats = createMockVoteStats({
        distribution: { "5": 1, "☕": 1, "3": 1 },
      });
      const { container } = render(<VoteDistribution stats={stats} />);

      const voteLabels = container.querySelectorAll(
        ".text-sm.font-semibold, .text-base.font-semibold",
      );
      const values = Array.from(voteLabels).map((el) => el.textContent);

      // Numeric first, then non-numeric
      expect(values).toEqual(["3", "5", "☕"]);
    });
  });

  describe("bar width calculation", () => {
    it("should show 100% width for the most voted option", () => {
      const stats = createMockVoteStats({
        distribution: { "3": 1, "5": 3, "8": 1 },
      });
      const { container } = render(<VoteDistribution stats={stats} />);

      // The bar for "5" (3 votes) should have 100% width
      const bars = container.querySelectorAll(".bg-primary-500");
      const barStyles = Array.from(bars).map(
        (bar) => (bar as HTMLElement).style.width,
      );

      // One bar should be 100%
      expect(barStyles).toContain("100%");
    });

    it("should calculate relative widths correctly", () => {
      const stats = createMockVoteStats({
        distribution: { "3": 2, "5": 4 },
      });
      const { container } = render(<VoteDistribution stats={stats} />);

      const bars = container.querySelectorAll(".bg-primary-500");
      const barStyles = Array.from(bars).map(
        (bar) => (bar as HTMLElement).style.width,
      );

      // "5" has 4 votes (max) = 100%, "3" has 2 votes = 50%
      expect(barStyles).toContain("100%");
      expect(barStyles).toContain("50%");
    });
  });

  describe("styling", () => {
    it("should have animation class for scale-in effect", () => {
      const stats = createMockVoteStats();
      const { container } = render(<VoteDistribution stats={stats} />);
      expect(container.querySelector(".animate-scale-in")).toBeInTheDocument();
    });

    it("should have animation delay style", () => {
      const stats = createMockVoteStats();
      const { container } = render(<VoteDistribution stats={stats} />);
      const cardWithDelay = container.querySelector(
        "[style*='animation-delay']",
      );
      expect(cardWithDelay).toBeInTheDocument();
    });

    it("should have staggered animation delays on vote rows", () => {
      const stats = createMockVoteStats({
        distribution: { "3": 1, "5": 1, "8": 1 },
      });
      const { container } = render(<VoteDistribution stats={stats} />);

      const rowsWithDelay = container.querySelectorAll(
        ".animate-fade-in[style*='animation-delay']",
      );
      expect(rowsWithDelay.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("state transitions", () => {
    it("should transition from null to showing stats", () => {
      const { rerender, container } = render(<VoteDistribution stats={null} />);
      expect(container.firstChild).toBeNull();

      const stats = createMockVoteStats({ distribution: { "5": 1 } });
      rerender(<VoteDistribution stats={stats} />);

      expect(screen.getByText("Vote Distribution")).toBeInTheDocument();
    });

    it("should transition from showing stats to null", () => {
      const stats = createMockVoteStats({ distribution: { "5": 1 } });
      const { rerender, container } = render(
        <VoteDistribution stats={stats} />,
      );
      expect(screen.getByText("Vote Distribution")).toBeInTheDocument();

      rerender(<VoteDistribution stats={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should transition from stats to empty distribution", () => {
      const stats1 = createMockVoteStats({ distribution: { "5": 1 } });
      const { rerender } = render(<VoteDistribution stats={stats1} />);
      expect(screen.getByText("5")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ distribution: {} });
      rerender(<VoteDistribution stats={stats2} />);

      expect(screen.getByText("No votes yet")).toBeInTheDocument();
    });

    it("should update when distribution changes", () => {
      const stats1 = createMockVoteStats({ distribution: { "3": 2 } });
      const { rerender } = render(<VoteDistribution stats={stats1} />);
      expect(screen.getByText("3")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ distribution: { "8": 3 } });
      rerender(<VoteDistribution stats={stats2} />);

      expect(screen.queryByText("3")).not.toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle single vote", () => {
      const stats = createMockVoteStats({ distribution: { "5": 1 } });
      render(<VoteDistribution stats={stats} />);
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("1 (100%)")).toBeInTheDocument();
    });

    it("should handle many different votes", () => {
      const stats = createMockVoteStats({
        distribution: { "1": 1, "2": 1, "3": 1, "5": 1, "8": 1, "13": 1 },
      });
      render(<VoteDistribution stats={stats} />);

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("13")).toBeInTheDocument();
    });

    it("should handle coffee emoji votes", () => {
      const stats = createMockVoteStats({
        distribution: { "☕": 2, "5": 1 },
      });
      render(<VoteDistribution stats={stats} />);
      expect(screen.getByText("☕")).toBeInTheDocument();
    });
  });
});
