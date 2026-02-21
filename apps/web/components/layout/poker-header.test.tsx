import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";
import { PokerHeader } from "./poker-header";

describe("PokerHeader", () => {
  const defaultProps = {
    roomId: "room-123",
    isChatOpen: false,
    isPlayerListOpen: false,
    onToggleChat: vi.fn(),
    onTogglePlayerList: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Mock clipboard API properly
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
    it("should display app name", () => {
      render(<PokerHeader {...defaultProps} />);
      expect(screen.getByText("Scrum Poker Game")).toBeInTheDocument();
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

    it("should render chat toggle button", () => {
      render(<PokerHeader {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(3);
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

  describe("chat toggle", () => {
    it("should call onToggleChat when chat button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onToggleChat = vi.fn();

      render(<PokerHeader {...defaultProps} onToggleChat={onToggleChat} />);

      const buttons = screen.getAllByRole("button");
      const chatButton = buttons[buttons.length - 1];

      await user.click(chatButton!);
      expect(onToggleChat).toHaveBeenCalledTimes(1);
    });
  });

  describe("share functionality", () => {
    it("should trigger share and show copied state", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<PokerHeader {...defaultProps} roomId="room-456" />);

      await user.click(
        screen.getByRole("button", { name: /copy share link/i }),
      );

      // Verify share action triggered by checking UI state change
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    it("should show Copied text after sharing", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(<PokerHeader {...defaultProps} />);

      await user.click(
        screen.getByRole("button", { name: /copy share link/i }),
      );

      // After clicking, the text should change to "Copied!"
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  describe("app name display", () => {
    it("should always display Scrum Poker Game", () => {
      render(<PokerHeader {...defaultProps} />);
      expect(screen.getByText("Scrum Poker Game")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have sticky header", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      expect(container.querySelector(".sticky")).toBeInTheDocument();
    });

    it("should have backdrop blur", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      expect(container.querySelector(".backdrop-blur-sm")).toBeInTheDocument();
    });

    it("should have border bottom", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      expect(container.querySelector(".border-b")).toBeInTheDocument();
    });
  });

  describe("responsive behavior", () => {
    it("should have responsive Share text", () => {
      const { container } = render(<PokerHeader {...defaultProps} />);
      // Share text uses responsive classes
      const shareSpan = container.querySelector("span.hidden");
      expect(shareSpan).toBeInTheDocument();
    });
  });
});
