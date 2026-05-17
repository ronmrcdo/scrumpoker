import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import { JoinRoomDialog } from "./join-room-dialog";

const mockPush = vi.fn();
const mockJoinRoom = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("@/lib/store/poker-store", () => ({
  usePokerStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      joinRoom: mockJoinRoom,
    }),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

describe("JoinRoomDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockJoinRoom.mockResolvedValue(undefined);
  });

  it("should render with centered icon header", () => {
    render(<JoinRoomDialog roomId="room-123" />);
    expect(
      screen.getByRole("heading", { name: "Join Room" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter your name to join this poker session."),
    ).toBeInTheDocument();
  });

  it("should render name input and buttons", () => {
    render(<JoinRoomDialog roomId="room-123" />);
    expect(screen.getByLabelText("Your Name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Join Room" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go Back" })).toBeInTheDocument();
  });

  it("should navigate home when Go Back is clicked", async () => {
    const user = userEvent.setup();
    render(<JoinRoomDialog roomId="room-123" />);

    await user.click(screen.getByRole("button", { name: "Go Back" }));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should call joinRoom with name, empty honeypot, and a formLoadedAt timestamp", async () => {
    const user = userEvent.setup();
    render(<JoinRoomDialog roomId="room-123" />);

    await user.type(screen.getByLabelText("Your Name"), "Alice");
    await user.click(screen.getByRole("button", { name: "Join Room" }));

    await waitFor(() => {
      expect(mockJoinRoom).toHaveBeenCalledWith(
        "room-123",
        "Alice",
        "",
        expect.any(Number),
      );
    });
  });

  it("should show validation error for empty name", async () => {
    const user = userEvent.setup();
    render(<JoinRoomDialog roomId="room-123" />);

    await user.click(screen.getByRole("button", { name: "Join Room" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(mockJoinRoom).not.toHaveBeenCalled();
  });

  it("should show error when joinRoom fails", async () => {
    mockJoinRoom.mockRejectedValue(new Error("Room not found"));
    const user = userEvent.setup();
    render(<JoinRoomDialog roomId="room-123" />);

    await user.type(screen.getByLabelText("Your Name"), "Alice");
    await user.click(screen.getByRole("button", { name: "Join Room" }));

    await waitFor(() => {
      expect(screen.getByText("Room not found")).toBeInTheDocument();
    });
  });

  it("should show generic error for non-Error rejections", async () => {
    mockJoinRoom.mockRejectedValue("something went wrong");
    const user = userEvent.setup();
    render(<JoinRoomDialog roomId="room-123" />);

    await user.type(screen.getByLabelText("Your Name"), "Alice");
    await user.click(screen.getByRole("button", { name: "Join Room" }));

    await waitFor(() => {
      expect(screen.getByText("Failed to join room")).toBeInTheDocument();
    });
  });

  it("should show Joining... text while submitting", async () => {
    let resolveJoin: (() => void) | undefined;
    mockJoinRoom.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveJoin = resolve;
        }),
    );
    const user = userEvent.setup();
    render(<JoinRoomDialog roomId="room-123" />);

    await user.type(screen.getByLabelText("Your Name"), "Alice");
    await user.click(screen.getByRole("button", { name: "Join Room" }));

    await waitFor(() => {
      expect(screen.getByText("Joining...")).toBeInTheDocument();
    });

    resolveJoin?.();
  });
});
