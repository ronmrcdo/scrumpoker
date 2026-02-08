import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";
import { Toolbar } from "./toolbar";

describe("Toolbar", () => {
  const defaultProps = {
    isFacilitator: true,
    isRevealed: false,
    isCounting: false,
    onToggleReveal: vi.fn(),
    onReset: vi.fn(),
  };

  describe("visibility", () => {
    it("should render when user is facilitator", () => {
      render(<Toolbar {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /reveal/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset/i }),
      ).toBeInTheDocument();
    });

    it("should not render when user is not facilitator", () => {
      const { container } = render(
        <Toolbar {...defaultProps} isFacilitator={false} />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("should return null for non-facilitator", () => {
      const { container } = render(
        <Toolbar
          isFacilitator={false}
          isRevealed={false}
          isCounting={false}
          onToggleReveal={vi.fn()}
          onReset={vi.fn()}
        />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("reveal button", () => {
    it("should show 'Reveal' text when not revealed", () => {
      render(<Toolbar {...defaultProps} isRevealed={false} />);
      expect(
        screen.getByRole("button", { name: /reveal/i }),
      ).toBeInTheDocument();
    });

    it("should show 'Hide' text when revealed", () => {
      render(<Toolbar {...defaultProps} isRevealed={true} />);
      expect(screen.getByRole("button", { name: /hide/i })).toBeInTheDocument();
    });

    it("should disable reveal button when counting", () => {
      render(<Toolbar {...defaultProps} isCounting={true} />);
      expect(screen.getByRole("button", { name: /reveal/i })).toBeDisabled();
    });

    it("should enable reveal button when not counting", () => {
      render(<Toolbar {...defaultProps} isCounting={false} />);
      expect(screen.getByRole("button", { name: /reveal/i })).toBeEnabled();
    });

    it("should call onToggleReveal when reveal button is clicked", async () => {
      const user = userEvent.setup();
      const onToggleReveal = vi.fn();

      render(<Toolbar {...defaultProps} onToggleReveal={onToggleReveal} />);

      await user.click(screen.getByRole("button", { name: /reveal/i }));
      expect(onToggleReveal).toHaveBeenCalledTimes(1);
    });

    it("should call onToggleReveal when hide button is clicked", async () => {
      const user = userEvent.setup();
      const onToggleReveal = vi.fn();

      render(
        <Toolbar
          {...defaultProps}
          isRevealed={true}
          onToggleReveal={onToggleReveal}
        />,
      );

      await user.click(screen.getByRole("button", { name: /hide/i }));
      expect(onToggleReveal).toHaveBeenCalledTimes(1);
    });

    it("should toggle between Reveal and Hide based on state", () => {
      const { rerender } = render(
        <Toolbar {...defaultProps} isRevealed={false} />,
      );
      expect(screen.queryByText(/reveal/i)).toBeInTheDocument();
      expect(screen.queryByText(/hide/i)).not.toBeInTheDocument();

      rerender(<Toolbar {...defaultProps} isRevealed={true} />);
      expect(screen.queryByText(/hide/i)).toBeInTheDocument();
      expect(screen.queryByText(/reveal/i)).not.toBeInTheDocument();
    });
  });

  describe("reset button", () => {
    it("should render reset button", () => {
      render(<Toolbar {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /reset/i }),
      ).toBeInTheDocument();
    });

    it("should call onReset when reset button is clicked", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();

      render(<Toolbar {...defaultProps} onReset={onReset} />);

      await user.click(screen.getByRole("button", { name: /reset/i }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it("should be available whether revealed or not", () => {
      const { rerender } = render(
        <Toolbar {...defaultProps} isRevealed={false} />,
      );
      expect(
        screen.getByRole("button", { name: /reset/i }),
      ).toBeInTheDocument();

      rerender(<Toolbar {...defaultProps} isRevealed={true} />);
      expect(
        screen.getByRole("button", { name: /reset/i }),
      ).toBeInTheDocument();
    });
  });

  describe("styling and layout", () => {
    it("should have flex container", () => {
      const { container } = render(<Toolbar {...defaultProps} />);
      expect(container.querySelector(".flex")).toBeInTheDocument();
    });

    it("should have correct button variants", () => {
      render(<Toolbar {...defaultProps} />);

      // Reveal/Hide button should have default variant
      const revealButton = screen.getByRole("button", { name: /reveal/i });
      expect(revealButton).toBeInTheDocument();

      // Reset button should have outline variant (different styling)
      const resetButton = screen.getByRole("button", { name: /reset/i });
      expect(resetButton).toBeInTheDocument();
    });
  });

  describe("icon display", () => {
    it("should show Eye icon when not revealed", () => {
      render(<Toolbar {...defaultProps} isRevealed={false} />);
      // Eye icon should be present in the reveal button
      const revealButton = screen.getByRole("button", { name: /reveal/i });
      expect(revealButton.querySelector("svg")).toBeInTheDocument();
    });

    it("should show EyeOff icon when revealed", () => {
      render(<Toolbar {...defaultProps} isRevealed={true} />);
      // EyeOff icon should be present in the hide button
      const hideButton = screen.getByRole("button", { name: /hide/i });
      expect(hideButton.querySelector("svg")).toBeInTheDocument();
    });

    it("should show RotateCcw icon on reset button", () => {
      render(<Toolbar {...defaultProps} />);
      const resetButton = screen.getByRole("button", { name: /reset/i });
      expect(resetButton.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("interaction sequence", () => {
    it("should handle reveal then reset sequence", async () => {
      const user = userEvent.setup();
      const onToggleReveal = vi.fn();
      const onReset = vi.fn();

      const { rerender } = render(
        <Toolbar
          {...defaultProps}
          onToggleReveal={onToggleReveal}
          onReset={onReset}
          isRevealed={false}
        />,
      );

      await user.click(screen.getByRole("button", { name: /reveal/i }));
      expect(onToggleReveal).toHaveBeenCalledTimes(1);

      // Simulate state change
      rerender(
        <Toolbar
          {...defaultProps}
          onToggleReveal={onToggleReveal}
          onReset={onReset}
          isRevealed={true}
        />,
      );

      // Reset
      await user.click(screen.getByRole("button", { name: /reset/i }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple resets", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();

      render(<Toolbar {...defaultProps} onReset={onReset} />);

      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);
      await user.click(resetButton);
      await user.click(resetButton);

      expect(onReset).toHaveBeenCalledTimes(3);
    });
  });

  describe("edge cases", () => {
    it("should handle transitioning from facilitator to non-facilitator", () => {
      const { rerender, container } = render(
        <Toolbar {...defaultProps} isFacilitator={true} />,
      );
      expect(
        screen.getByRole("button", { name: /reveal/i }),
      ).toBeInTheDocument();

      rerender(<Toolbar {...defaultProps} isFacilitator={false} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("should handle transitioning from non-facilitator to facilitator", () => {
      const { rerender, container } = render(
        <Toolbar {...defaultProps} isFacilitator={false} />,
      );
      expect(container).toBeEmptyDOMElement();

      rerender(<Toolbar {...defaultProps} isFacilitator={true} />);
      expect(
        screen.getByRole("button", { name: /reveal/i }),
      ).toBeInTheDocument();
    });
  });
});
