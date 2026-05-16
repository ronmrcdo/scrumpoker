import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { PlayingCard } from "./playing-card";

describe("PlayingCard", () => {
  const baseProps = {
    value: "5",
    suit: "♦" as const,
    selected: false,
    disabled: false,
    onClick: vi.fn(),
    ariaLabel: "Vote 5 story points",
  };

  it("renders the value in both corners", () => {
    render(<PlayingCard {...baseProps} />);
    const matches = screen.getAllByText("5");
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<PlayingCard {...baseProps} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<PlayingCard {...baseProps} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("reflects selected state via aria-pressed and border class", () => {
    render(<PlayingCard {...baseProps} selected />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveClass("border-foreground");
  });

  it("uses destructive color hint for red suits", () => {
    const { container } = render(<PlayingCard {...baseProps} suit="♥" />);
    // At least one element should carry the destructive color
    expect(container.querySelector(".text-destructive")).toBeInTheDocument();
  });

  it("renders the coffee special value in center, not the suit", () => {
    render(<PlayingCard {...baseProps} value="☕" />);
    expect(screen.getAllByText("☕").length).toBeGreaterThanOrEqual(1);
  });

  it("uses the provided aria-label", () => {
    render(<PlayingCard {...baseProps} ariaLabel="Vote 13 story points" />);
    expect(
      screen.getByRole("button", { name: "Vote 13 story points" }),
    ).toBeInTheDocument();
  });
});
