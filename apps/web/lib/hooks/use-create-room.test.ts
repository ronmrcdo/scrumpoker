import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateRoom } from "./use-create-room";

const mockPush = vi.fn();
const mockFetchRoom = vi.fn();
const mockCurrentUserId = vi.fn<() => string | null>(() => "user-123");

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/store/poker-store", () => ({
  usePokerStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      fetchRoom: mockFetchRoom,
      get currentUserId() {
        return mockCurrentUserId();
      },
    }),
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

describe("useCreateRoom", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    mockCurrentUserId.mockReturnValue("user-123");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("enables submit when authenticated", () => {
    const { result } = renderHook(() => useCreateRoom());
    expect(result.current.isDisabled).toBe(false);
  });

  it("disables submit when user is not authenticated", () => {
    mockCurrentUserId.mockReturnValue(null);
    const { result } = renderHook(() => useCreateRoom());
    expect(result.current.isDisabled).toBe(true);
  });

  it("posts honeypot + formLoadedAt to /api/rooms and surfaces server errors", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Unable to create room" }),
    });

    const { result } = renderHook(() => useCreateRoom());

    act(() => {
      result.current.form.setValue("userName", "Test User");
      result.current.form.setValue("roomName", "Test Room");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/rooms",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"hp":""'),
        }),
      );
      const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
      const init = fetchMock.mock.calls[0]?.[1] as { body: string };
      expect(init.body).toContain('"formLoadedAt":');
      expect(init.body).not.toContain("turnstileToken");
      expect(result.current.formError).toBe("Unable to create room");
    });
  });

  // Regression: a bare 500 with an empty body made response.json() throw
  // "Unexpected end of JSON input", which leaked to the user as the form error.
  it("surfaces a readable error when the response body is not JSON", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new SyntaxError("Unexpected end of JSON input");
      },
    });

    const { result } = renderHook(() => useCreateRoom());

    act(() => {
      result.current.form.setValue("userName", "Test User");
      result.current.form.setValue("roomName", "Test Room");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(result.current.formError).toBe(
        "Failed to create room. Please try again.",
      );
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("redirects to the new room on success", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ roomId: "room-abc" }),
    });
    mockFetchRoom.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateRoom());

    act(() => {
      result.current.form.setValue("userName", "Test User");
      result.current.form.setValue("roomName", "Test Room");
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockFetchRoom).toHaveBeenCalledWith("room-abc");
      expect(mockPush).toHaveBeenCalledWith("/poker/room-abc");
    });
  });
});
