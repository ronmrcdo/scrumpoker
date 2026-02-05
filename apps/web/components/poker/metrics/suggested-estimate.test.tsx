import { describe, expect, it } from "vitest";

import { createMockVoteStats, render, screen } from "@/test/test-utils";
import { SuggestedEstimate } from "./suggested-estimate";

describe("SuggestedEstimate", () => {
  describe("when stats is null", () => {
    it("should render nothing", () => {
      const { container } = render(<SuggestedEstimate stats={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when stats are provided", () => {
    it("should display 'Suggested Estimate' label", () => {
      const stats = createMockVoteStats();
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("Suggested Estimate")).toBeInTheDocument();
    });

    it("should display 'points' label", () => {
      const stats = createMockVoteStats();
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("points")).toBeInTheDocument();
    });

    it("should display average info text", () => {
      const stats = createMockVoteStats({ average: 5.5, spread: 4 });
      render(<SuggestedEstimate stats={stats} />);
      expect(
        screen.getByText(/Based on average of 5.5 with spread of 4/),
      ).toBeInTheDocument();
    });
  });

  describe("nearest Fibonacci calculation", () => {
    it("should suggest 1 when average is close to 1", () => {
      const stats = createMockVoteStats({ average: 1.2 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should suggest 3 when average is 2.6", () => {
      const stats = createMockVoteStats({ average: 2.6 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should suggest 5 when average is 4.5", () => {
      const stats = createMockVoteStats({ average: 4.5 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should suggest 8 when average is 7", () => {
      const stats = createMockVoteStats({ average: 7 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should suggest 13 when average is 11", () => {
      const stats = createMockVoteStats({ average: 11 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("13")).toBeInTheDocument();
    });

    it("should suggest 21 when average is 18", () => {
      const stats = createMockVoteStats({ average: 18 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("21")).toBeInTheDocument();
    });
  });

  describe("confidence levels", () => {
    it("should display 'High confidence' when consensus is true", () => {
      const stats = createMockVoteStats({ consensus: true });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("High confidence")).toBeInTheDocument();
    });

    it("should display 'Medium confidence' when spread is low relative to average", () => {
      const stats = createMockVoteStats({
        consensus: false,
        average: 10,
        spread: 3,
      });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("Medium confidence")).toBeInTheDocument();
    });

    it("should display 'Low confidence' when spread is high relative to average", () => {
      const stats = createMockVoteStats({
        consensus: false,
        average: 5,
        spread: 10,
      });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("Low confidence")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle zero average gracefully", () => {
      const stats = createMockVoteStats({
        average: 0,
        spread: 0,
        consensus: false,
      });
      const { container } = render(<SuggestedEstimate stats={stats} />);
      // Should render without crashing
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Low confidence")).toBeInTheDocument();
    });

    it("should handle very small average", () => {
      const stats = createMockVoteStats({ average: 0.5 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("should handle very large average", () => {
      const stats = createMockVoteStats({ average: 100 });
      render(<SuggestedEstimate stats={stats} />);
      expect(screen.getByText("21")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have animation class for scale-in effect", () => {
      const stats = createMockVoteStats();
      const { container } = render(<SuggestedEstimate stats={stats} />);
      expect(container.querySelector(".animate-scale-in")).toBeInTheDocument();
    });

    it("should have animation delay style", () => {
      const stats = createMockVoteStats();
      const { container } = render(<SuggestedEstimate stats={stats} />);
      const cardWithDelay = container.querySelector(
        "[style*='animation-delay']",
      );
      expect(cardWithDelay).toBeInTheDocument();
    });

    it("should display lightbulb icon", () => {
      const stats = createMockVoteStats();
      const { container } = render(<SuggestedEstimate stats={stats} />);
      // Lucide icons render as SVG elements
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("state transitions", () => {
    it("should transition from null to showing stats", () => {
      const { rerender, container } = render(
        <SuggestedEstimate stats={null} />,
      );
      expect(container.firstChild).toBeNull();

      const stats = createMockVoteStats({ average: 5 });
      rerender(<SuggestedEstimate stats={stats} />);

      expect(screen.getByText("Suggested Estimate")).toBeInTheDocument();
    });

    it("should transition from showing stats to null", () => {
      const stats = createMockVoteStats({ average: 5 });
      const { rerender, container } = render(
        <SuggestedEstimate stats={stats} />,
      );
      expect(screen.getByText("Suggested Estimate")).toBeInTheDocument();

      rerender(<SuggestedEstimate stats={null} />);
      expect(container.firstChild).toBeNull();
    });

    it("should update when average changes", () => {
      const stats1 = createMockVoteStats({ average: 3 });
      const { rerender } = render(<SuggestedEstimate stats={stats1} />);
      expect(screen.getByText("3")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ average: 7 });
      rerender(<SuggestedEstimate stats={stats2} />);
      expect(screen.getByText("8")).toBeInTheDocument();
    });

    it("should update confidence when consensus changes", () => {
      const stats1 = createMockVoteStats({ consensus: true });
      const { rerender } = render(<SuggestedEstimate stats={stats1} />);
      expect(screen.getByText("High confidence")).toBeInTheDocument();

      const stats2 = createMockVoteStats({
        consensus: false,
        average: 5,
        spread: 10,
      });
      rerender(<SuggestedEstimate stats={stats2} />);
      expect(screen.getByText("Low confidence")).toBeInTheDocument();
    });
  });
});
