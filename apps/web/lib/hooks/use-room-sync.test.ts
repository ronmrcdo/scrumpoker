import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePokerStore } from "@/lib/store/poker-store";
import { createMockRoom } from "@/test/test-utils";
import { useRoomSync } from "./use-room-sync";

type ChangeHandler = (payload: unknown) => unknown;

const { channelHandlers, removeChannelMock } = vi.hoisted(() => ({
  channelHandlers: [] as ChangeHandler[],
  removeChannelMock: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => {
  const channel = {
    on: vi.fn((_event: string, _filter: unknown, handler: ChangeHandler) => {
      channelHandlers.push(handler);
      return channel;
    }),
    subscribe: vi.fn(() => channel),
  };

  return {
    createClient: () => ({
      channel: vi.fn(() => channel),
      removeChannel: removeChannelMock,
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gt: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
      rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  };
});

const CURRENT_USER_ID = "user-1";
// useRoomSync only subscribes for a well-formed room id.
const ROOM_ID = "3f2504e0-4f89-11d3-9a0c-0305e82c3301";

/** The players table subscription is registered second (rooms is first). */
function playersHandler(): ChangeHandler {
  const handler = channelHandlers[1];
  if (!handler) throw new Error("players handler was not registered");
  return handler;
}

function ownRowDeleted() {
  return { eventType: "DELETE", old: { user_id: CURRENT_USER_ID } };
}

describe("useRoomSync", () => {
  beforeEach(() => {
    channelHandlers.length = 0;
    usePokerStore.setState({
      room: null,
      wasKicked: false,
      isLeaving: false,
      currentUserId: CURRENT_USER_ID,
    });
  });

  it("flags a kick when the current user's row is deleted by someone else", async () => {
    const room = createMockRoom({ id: ROOM_ID });
    renderHook(() => useRoomSync(room.id, room));

    await playersHandler()(ownRowDeleted());

    expect(usePokerStore.getState().wasKicked).toBe(true);
    expect(usePokerStore.getState().room).toBeNull();
  });

  // Regression: leaving deletes the same row, so the leaver was flagged as
  // kicked and bounced to /?kicked=true instead of the home page.
  it("does not flag a kick when the user is leaving intentionally", async () => {
    const room = createMockRoom({ id: ROOM_ID });
    renderHook(() => useRoomSync(room.id, room));

    usePokerStore.setState({ isLeaving: true });
    await playersHandler()(ownRowDeleted());

    expect(usePokerStore.getState().wasKicked).toBe(false);
    expect(usePokerStore.getState().room).toBeNull();
  });

  it("ignores deletions of other players' rows", async () => {
    const room = createMockRoom({ id: ROOM_ID });
    renderHook(() => useRoomSync(room.id, room));

    await playersHandler()({
      eventType: "DELETE",
      old: { user_id: "someone-else" },
    });

    expect(usePokerStore.getState().wasKicked).toBe(false);
  });
});
