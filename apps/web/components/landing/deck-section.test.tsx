import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/test-utils";
import { DeckSection } from "./deck-section";

describe("DeckSection", () => {
  it("renders the section heading and eyebrow", () => {
    render(<DeckSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /the deck/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/04 · Fibonacci, with personality/i),
    ).toBeInTheDocument();
  });

  it("renders all eight Fibonacci card values including the coffee card", () => {
    render(<DeckSection />);
    for (const value of ["1", "2", "3", "5", "8", "13", "21", "☕"]) {
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
    }
  });

  it("renders the editorial pull-quote and attribution", () => {
    render(<DeckSection />);
    expect(
      screen.getByText(/just pick the bigger one\. It always grows\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/every senior engineer, eventually/i),
    ).toBeInTheDocument();
  });

  it("exposes the #deck anchor for in-page navigation", () => {
    const { container } = render(<DeckSection />);
    const section = container.querySelector("section#deck");
    expect(section).not.toBeNull();
  });
});
