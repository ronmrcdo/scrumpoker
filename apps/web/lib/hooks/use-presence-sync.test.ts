import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePokerStore } from "@/lib/store/poker-store";
import { createClient } from "@/lib/supabase/client";
import { usePresenceSync } from "./use-presence-sync";

// Track presence event handlers registered via channel.on()
type PresenceHandler = (payload: Record<string, unknown>) => void;

let presenceHandlers: Map<string, PresenceHandler>;
let subscribeCallback: ((status: string) => void) | null;
let mockTrack: ReturnType<typeof vi.fn>;
let mockUntrack: ReturnType<typeof vi.fn>;
let mockPresenceState: ReturnType<typeof vi.fn>;
let mockRemoveChannel: ReturnType<typeof vi.fn>;

vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(),
}));

function setupMockChannel() {
  presenceHandlers = new Map();
  subscribeCallback = null;
  mockTrack = vi.fn().mockResolvedValue("ok");
  mockUntrack = vi.fn().mockResolvedValue("ok");
  mockPresenceState = vi.fn().mockReturnValue({});
  mockRemoveChannel = vi.fn();

  const mockChannel = {
    on: vi.fn(
      (type: string, opts: { event: string }, handler: PresenceHandler) => {
        if (type === "presence") {
          presenceHandlers.set(opts.event, handler);
        }
        return mockChannel;
      },
    ),
    subscribe: vi.fn((cb: (status: string) => void) => {
      subscribeCallback = cb;
      return mockChannel;
    }),
    track: mockTrack,
    untrack: mockUntrack,
    presenceState: mockPresenceState,
    send: vi.fn(),
    unsubscribe: vi.fn(),
  };

  (createClient as ReturnType<typeof vi.fn>).mockReturnValue({
    channel: vi.fn(() => mockChannel),
    removeChannel: mockRemoveChannel,
  });

  return mockChannel;
}

function initStoreWithRoom(facilitatorId = "user-1") {
  usePokerStore.setState({
    currentUserId: "user-1",
    chatMessages: [],
    room: {
      id: "room-1",
      name: "Test Room",
      isRevealed: false,
      facilitatorId,
      players: [
        { id: "user-1", name: "Alice", role: "FACILITATOR", vote: null },
        { id: "user-2", name: "Bob", role: "MEMBER", vote: null },
        { id: "user-3", name: "Charlie", role: "MEMBER", vote: null },
      ],
    },
  });
}

describe("usePresenceSync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setupMockChannel();
    initStoreWithRoom();
  });

  afterEach(() => {
    vi.useRealTimers();
    usePokerStore.setState({
      onlinePlayerIds: new Set(),
      room: null,
      currentUserId: "",
    });
  });

  it("should not create channel when roomId is null", () => {
    renderHook(() => usePresenceSync(null));
    expect(usePokerStore.getState().onlinePlayerIds.size).toBe(0);
  });

  it("should track current user on SUBSCRIBED", async () => {
    renderHook(() => usePresenceSync("room-1"));

    await act(async () => {
      subscribeCallback?.("SUBSCRIBED");
    });

    expect(mockTrack).toHaveBeenCalledWith({
      userId: "user-1",
      name: "Alice",
    });
  });

  it("should update onlinePlayerIds on presence sync", () => {
    renderHook(() => usePresenceSync("room-1"));

    mockPresenceState.mockReturnValue({
      "user-1": [{ userId: "user-1", name: "Alice" }],
      "user-2": [{ userId: "user-2", name: "Bob" }],
    });

    act(() => {
      presenceHandlers.get("sync")?.({});
    });

    const { onlinePlayerIds } = usePokerStore.getState();
    expect(onlinePlayerIds).toEqual(new Set(["user-1", "user-2"]));
  });

  it("should add system message when a player disconnects", () => {
    renderHook(() => usePresenceSync("room-1"));

    // First sync to populate name cache
    mockPresenceState.mockReturnValue({
      "user-1": [{ userId: "user-1", name: "Alice" }],
      "user-2": [{ userId: "user-2", name: "Bob" }],
    });
    act(() => {
      presenceHandlers.get("sync")?.({});
    });

    // Simulate Bob leaving
    act(() => {
      presenceHandlers.get("leave")?.({
        key: "user-2",
        leftPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    const messages = usePokerStore.getState().chatMessages;
    const disconnectMsg = messages.find(
      (m) => m.type === "System" && m.text.includes("Bob disconnected"),
    );
    expect(disconnectMsg).toBeDefined();
  });

  it("should add reconnect message when player rejoins within grace period", () => {
    renderHook(() => usePresenceSync("room-1"));

    // Populate name cache
    mockPresenceState.mockReturnValue({
      "user-1": [{ userId: "user-1", name: "Alice" }],
      "user-2": [{ userId: "user-2", name: "Bob" }],
    });
    act(() => {
      presenceHandlers.get("sync")?.({});
    });

    // Bob disconnects
    act(() => {
      presenceHandlers.get("leave")?.({
        key: "user-2",
        leftPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    // Bob reconnects within grace period
    act(() => {
      presenceHandlers.get("join")?.({
        key: "user-2",
        newPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    const messages = usePokerStore.getState().chatMessages;
    const reconnectMsg = messages.find(
      (m) => m.type === "System" && m.text.includes("Bob reconnected"),
    );
    expect(reconnectMsg).toBeDefined();
  });

  it("should auto-kick player after grace period when current user is facilitator", () => {
    const kickPlayer = vi.fn();
    usePokerStore.setState({ kickPlayer });

    renderHook(() => usePresenceSync("room-1"));

    // Populate name cache
    mockPresenceState.mockReturnValue({
      "user-2": [{ userId: "user-2", name: "Bob" }],
    });
    act(() => {
      presenceHandlers.get("sync")?.({});
    });

    // Bob disconnects
    act(() => {
      presenceHandlers.get("leave")?.({
        key: "user-2",
        leftPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    // Advance past grace period
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(kickPlayer).toHaveBeenCalledWith("user-2");
  });

  it("should NOT auto-kick when current user is not facilitator", () => {
    const kickPlayer = vi.fn();
    // Set up so user-1 is NOT the facilitator
    initStoreWithRoom("user-3");
    usePokerStore.setState({ kickPlayer });

    renderHook(() => usePresenceSync("room-1"));

    // Populate name cache
    mockPresenceState.mockReturnValue({
      "user-2": [{ userId: "user-2", name: "Bob" }],
    });
    act(() => {
      presenceHandlers.get("sync")?.({});
    });

    // Bob disconnects
    act(() => {
      presenceHandlers.get("leave")?.({
        key: "user-2",
        leftPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    // Advance past grace period
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(kickPlayer).not.toHaveBeenCalled();
  });

  it("should cancel grace timer when player rejoins", () => {
    const kickPlayer = vi.fn();
    usePokerStore.setState({ kickPlayer });

    renderHook(() => usePresenceSync("room-1"));

    // Populate name cache
    mockPresenceState.mockReturnValue({
      "user-2": [{ userId: "user-2", name: "Bob" }],
    });
    act(() => {
      presenceHandlers.get("sync")?.({});
    });

    // Bob disconnects
    act(() => {
      presenceHandlers.get("leave")?.({
        key: "user-2",
        leftPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    // Bob reconnects at 30s (within grace period)
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    act(() => {
      presenceHandlers.get("join")?.({
        key: "user-2",
        newPresences: [{ userId: "user-2", name: "Bob" }],
      });
    });

    // Advance past original grace period
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(kickPlayer).not.toHaveBeenCalled();
  });

  it("should clean up on unmount", async () => {
    const { unmount } = renderHook(() => usePresenceSync("room-1"));

    await act(async () => {
      subscribeCallback?.("SUBSCRIBED");
    });

    unmount();

    expect(mockUntrack).toHaveBeenCalled();
    expect(mockRemoveChannel).toHaveBeenCalled();
    expect(usePokerStore.getState().onlinePlayerIds.size).toBe(0);
  });

  it("should ignore own leave events", () => {
    renderHook(() => usePresenceSync("room-1"));

    const messagesBefore = usePokerStore.getState().chatMessages.length;

    act(() => {
      presenceHandlers.get("leave")?.({
        key: "user-1",
        leftPresences: [{ userId: "user-1", name: "Alice" }],
      });
    });

    // No system message should be added for self
    expect(usePokerStore.getState().chatMessages.length).toBe(messagesBefore);
  });
});
