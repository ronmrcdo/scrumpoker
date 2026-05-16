import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";
import { PokerHeader } from "./poker-header";

describe("PokerHeader", () => {
  const defaultProps = {
    roomId: "room-123",
    roomName: "Sprint Planning",
    isPlayerListOpen: false,
    onTogglePlayerList: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("should display room name", () => {
      render(<PokerHeader {...defaultProps} />);
      expect(screen.getByText("Sprint Planning")).toBeInTheDocument();
    });

    it("should render player list toggle button", () => {
      render(<PokerHeader {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /open player list/i }),
      ).toBeInTheDocument();
    });

    it("should render share button", () => {
      render(<PokerHeader {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /copy share link/i }),
      ).toBeInTheDocument();
    });
  });

  describe("player list toggle", () => {
    it("should call onTogglePlayerList when button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onTogglePlayerList = vi.fn();

      render(
        <PokerHeader
          {...defaultProps}
          onTogglePlayerList={onTogglePlayerList}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /open player list/i }),
      );
      expect(onTogglePlayerList).toHaveBeenCalledTimes(1);
    });

    it("should render toggle button regardless of state", () => {
      const { rerender } = render(
        <PokerHeader {...defaultProps} isPlayerListOpen={false} />,
      );
      expect(
        screen.getByRole("button", { name: /open player list/i }),
      ).toBeInTheDocument();

      rerender(<PokerHeader {...defaultProps} isPlayerListOpen={true} />);
      expect(
        screen.getByRole("button", { name: /close player list/i }),
      ).toBeInTheDocument();
    });
  });

  describe("share functionality", () => {
    it("should trigger share and show copied state", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<PokerHeader {...defaultProps} roomId="room-456" />);

      await user.click(
        screen.getByRole("button", { name: /copy share link/i }),
      );

      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    it("should show Copied text after sharing", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<PokerHeader {...defaultProps} />);

      await user.click(
        screen.getByRole("button", { name: /copy share link/i }),
      );

      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  describe("app name display", () => {
    it("should fall back to generic name when roomName is empty", () => {
      render(<PokerHeader {...defaultProps} roomName="" />);
      expect(screen.getByText("Scrum Poker Game")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have sticky header", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      expect(container.querySelector(".sticky")).toBeInTheDocument();
    });

    it("should have border bottom", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      expect(container.querySelector(".border-b")).toBeInTheDocument();
    });
  });

  describe("responsive behavior", () => {
    it("should have responsive Share text", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      const shareSpan = container.querySelector("span.hidden");
      expect(shareSpan).toBeInTheDocument();
    });
  });
});
