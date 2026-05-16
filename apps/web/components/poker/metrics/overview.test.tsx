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

    it("should display the mode label", () => {
      const stats = createMockVoteStats();
      render(<Overview stats={stats} />);
      expect(screen.getByText("Mode")).toBeInTheDocument();
    });

    it("should display the consensus label", () => {
      const stats = createMockVoteStats();
      render(<Overview stats={stats} />);
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });

    it("should display the average value formatted to 1 decimal", () => {
      const stats = createMockVoteStats({ average: 5.333 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("5.3")).toBeInTheDocument();
    });

    it("should display the spread value with ± prefix", () => {
      const stats = createMockVoteStats({ spread: 8 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("±8")).toBeInTheDocument();
    });

    it("should display Tight verdict when consensus", () => {
      const stats = createMockVoteStats({ consensus: true, spread: 1 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("Tight")).toBeInTheDocument();
    });

    it("should display Mixed verdict when no consensus but tight spread", () => {
      const stats = createMockVoteStats({ consensus: false, spread: 4 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("Mixed")).toBeInTheDocument();
    });

    it("should display Wide verdict when no consensus and large spread", () => {
      const stats = createMockVoteStats({ consensus: false, spread: 10 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("Wide")).toBeInTheDocument();
    });

    it("should treat spread === 5 as Mixed (inclusive upper bound)", () => {
      const stats = createMockVoteStats({ consensus: false, spread: 5 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("Mixed")).toBeInTheDocument();
    });

    it("should treat spread === 6 as Wide", () => {
      const stats = createMockVoteStats({ consensus: false, spread: 6 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("Wide")).toBeInTheDocument();
    });

    it("should render the mode value", () => {
      const stats = createMockVoteStats({ mode: "13" });
      render(<Overview stats={stats} />);
      expect(screen.getByText("13")).toBeInTheDocument();
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
  });

  describe("spread values", () => {
    it("should display zero spread", () => {
      const stats = createMockVoteStats({ spread: 0 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("±0")).toBeInTheDocument();
    });

    it("should display small spread", () => {
      const stats = createMockVoteStats({ spread: 2 });
      render(<Overview stats={stats} />);
      expect(screen.getByText("±2")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should render in a 4-column grid on sm+", () => {
      const stats = createMockVoteStats();
      const { container } = render(<Overview stats={stats} />);
      expect(container.querySelector(".sm\\:grid-cols-4")).toBeInTheDocument();
    });

    it("should render all four cells", () => {
      const stats = createMockVoteStats();
      render(<Overview stats={stats} />);

      expect(screen.getByText("Average")).toBeInTheDocument();
      expect(screen.getByText("Mode")).toBeInTheDocument();
      expect(screen.getByText("Spread")).toBeInTheDocument();
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });
  });

  describe("state transitions", () => {
    it("should transition from null to showing stats", () => {
      const { rerender, container } = render(<Overview stats={null} />);
      expect(container.firstChild).toBeNull();

      const stats = createMockVoteStats({ average: 5, spread: 4 });
      rerender(<Overview stats={stats} />);

      expect(screen.getByText("5.0")).toBeInTheDocument();
      expect(screen.getByText("±4")).toBeInTheDocument();
    });

    it("should transition from showing stats to null", () => {
      const stats = createMockVoteStats({ average: 5, spread: 4 });
      const { rerender, container } = render(<Overview stats={stats} />);
      expect(screen.getByText("5.0")).toBeInTheDocument();

      rerender(<Overview stats={null} />);
      expect(container.firstChild).toBeNull();
    });
  });
});
