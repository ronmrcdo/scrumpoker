import { describe, expect, it } from "vitest";

import { createMockVoteStats, render, screen } from "@/test/test-utils";
import { Consensus } from "./consensus";

describe("Consensus", () => {
  describe("when stats is null", () => {
    it("should show waiting message", () => {
      render(<Consensus stats={null} />);
      expect(screen.getByText(/Waiting for votes/i)).toBeInTheDocument();
    });
  });

  describe("when stats are provided", () => {
    it("should display 'Consensus' label when consensus is true", () => {
      const stats = createMockVoteStats({ consensus: true });
      render(<Consensus stats={stats} />);
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });

    it("should display 'No consensus' label when consensus is false", () => {
      const stats = createMockVoteStats({ consensus: false });
      render(<Consensus stats={stats} />);
      expect(screen.getByText("No consensus")).toBeInTheDocument();
    });

    it("should display the revealed eyebrow", () => {
      const stats = createMockVoteStats();
      render(<Consensus stats={stats} />);
      expect(screen.getByText(/Revealed/i)).toBeInTheDocument();
    });
  });

  describe("state transitions", () => {
    it("should transition from waiting to showing verdict", () => {
      const { rerender } = render(<Consensus stats={null} />);
      expect(screen.getByText(/Waiting for votes/i)).toBeInTheDocument();

      const stats = createMockVoteStats({ consensus: true });
      rerender(<Consensus stats={stats} />);

      expect(screen.queryByText(/Waiting for votes/i)).not.toBeInTheDocument();
      expect(screen.getByText("Consensus")).toBeInTheDocument();
    });

    it("should update consensus verdict when stats change", () => {
      const stats1 = createMockVoteStats({ consensus: true });
      const { rerender } = render(<Consensus stats={stats1} />);
      expect(screen.getByText("Consensus")).toBeInTheDocument();

      const stats2 = createMockVoteStats({ consensus: false });
      rerender(<Consensus stats={stats2} />);

      expect(screen.queryByText("Consensus")).not.toBeInTheDocument();
      expect(screen.getByText("No consensus")).toBeInTheDocument();
    });
  });
});
