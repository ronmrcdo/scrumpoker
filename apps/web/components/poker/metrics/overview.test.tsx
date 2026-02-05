import { describe, expect, it } from "vitest";
import { createMockVoteStats, render, screen } from "@/test/test-utils";
import { Overview } from "./overview";

describe("Overview", () => {
  describe("when stats is null", () => {
    it("should render nothing", () => {
      const { container } = render(<Overview stats={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when stats are provided", () => {
    it("should display the average label", () => {
      const stats = createMockVoteStats();
      render(<Overview stats={stats} />);
      expect(screen.getByText("Average")).toBeInTheDocument();
    });

    it("should display the spread label", () => {
      const stats = createMockVoteStats();
      render(<Overview stats={stats} />);
      expect(screen.getByText("Spread")).toBeInTheDocument();
    });

    it("should display the average value formatted to 1 decimal", () => {
      const stats = createMockVoteStats({ average: 5.333 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("5.3")).toBeInTheDocument();
    });

    it("should display the spread value", () => {
      const stats = createMockVoteStats({ spread: 8 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("8")).toBeInTheDocument();
    });
  });

  describe("average formatting", () => {
    it("should format integer averages with one decimal", () => {
      const stats = createMockVoteStats({ average: 5 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("5.0")).toBeInTheDocument();
    });

    it("should round average to one decimal place", () => {
      const stats = createMockVoteStats({ average: 5.666 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("5.7")).toBeInTheDocument();
    });

    it("should handle decimal averages", () => {
      const stats = createMockVoteStats({ average: 3.14 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("3.1")).toBeInTheDocument();
    });

    it("should handle large averages", () => {
      const stats = createMockVoteStats({ average: 21 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("21.0")).toBeInTheDocument();
    });

    it("should handle small averages", () => {
      const stats = createMockVoteStats({ average: 1 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("1.0")).toBeInTheDocument();
    });
  });

  describe("spread values", () => {
    it("should display zero spread", () => {
      const stats = createMockVoteStats({ spread: 0 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should display small spread", () => {
      const stats = createMockVoteStats({ spread: 2 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("should display large spread", () => {
      const stats = createMockVoteStats({ spread: 20 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should render in a 2-column grid", () => {
      const stats = createMockVoteStats();
      const { container } = render(<Overview stats={stats} />);
      expect(container.querySelector(".grid-cols-2")).toBeInTheDocument();
    });

    it("should render two cards", () => {
      const stats = createMockVoteStats();
      render(<Overview stats={stats} />);

      // Should have two card elements (Average and Spread)
      expect(screen.getByText("Average")).toBeInTheDocument();
      expect(screen.getByText("Spread")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have animation classes", () => {
      const stats = createMockVoteStats();
      const { container } = render(<Overview stats={stats} />);
      expect(container.querySelectorAll(".animate-scale-in").length).toBe(2);
    });

    it("should have staggered animation delays", () => {
      const stats = createMockVoteStats();
      const { container } = render(<Overview stats={stats} />);

      // Check that animation delays are applied via style attribute
      const cardsWithDelay = container.querySelectorAll(
        "[style*='animation-delay']",
      );
      expect(cardsWithDelay.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("state transitions", () => {
    it("should transition from null to showing stats", () => {
      const { rerender, container } = render(<Overview stats={null} />);
      expect(container.firstChild).toBeNull();

      const stats = createMockVoteStats({ average: 5, spread: 4 });
      rerender(<Overview stats={stats} />);

      expect(screen.getByText("5.0")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("should transition from showing stats to null", () => {
      const stats = createMockVoteStats({ average: 5, spread: 4 });
      const { rerender, container } = render(<Overview stats={stats} />);
      expect(screen.getByText("5.0")).toBeInTheDocument();

      rerender(<Overview stats={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should update when average changes", () => {
      const stats1 = createMockVoteStats({ average: 3 });
      const { rerender } = render(<Overview stats={stats1} />);
      expect(screen.getByText("3.0")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ average: 8 });
      rerender(<Overview stats={stats2} />);
      expect(screen.getByText("8.0")).toBeInTheDocument();
    });

    it("should update when spread changes", () => {
      const stats1 = createMockVoteStats({ spread: 2 });
      const { rerender } = render(<Overview stats={stats1} />);
      expect(screen.getByText("2")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ spread: 10 });
      rerender(<Overview stats={stats2} />);
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle all zeros", () => {
      const stats = createMockVoteStats({ average: 0, spread: 0 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("0.0")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle very small decimal averages", () => {
      const stats = createMockVoteStats({ average: 0.1 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("0.1")).toBeInTheDocument();
    });
  });
});
