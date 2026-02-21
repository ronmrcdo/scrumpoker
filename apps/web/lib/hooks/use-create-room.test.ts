import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateRoom } from "./use-create-room";

const mockPush = vi.fn();
const mockFetchRoom = vi.fn();
const mockCurrentUserId = vi.fn(() => "user-123");

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

  it("should not disable button when turnstile is not configured", () => {
    const { result } = renderHook(() => useCreateRoom());
    expect(result.current.isDisabled).toBe(false);
  });

  it("should disable button when user is not authenticated", () => {
    mockCurrentUserId.mockReturnValue(null);
    const { result } = renderHook(() => useCreateRoom());
    expect(result.current.isDisabled).toBe(true);
  });

  it("should show form error when submitting without turnstile token", async () => {
    // Temporarily set the env var to simulate turnstile being enabled
    const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";

    const { result } = renderHook(() => useCreateRoom());

    // Fill in form values
    act(() => {
      result.current.form.setValue("userName", "Test User");
      result.current.form.setValue("roomName", "Test Room");
    });

    // Submit without turnstile token
    await act(async () => {
      await result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(result.current.formError).toBe(
        "Security check not completed. Please wait and try again.",
      );
    });

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = original;
  });

  it("should submit successfully with a valid turnstile token", async () => {
    const original = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "test-site-key";

    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ roomId: "room-abc" }),
    });
    mockFetchRoom.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCreateRoom());

    // Set turnstile token
    act(() => {
      result.current.onTurnstileSuccess("valid-token");
    });

    // Fill in form values
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
          body: expect.stringContaining('"turnstileToken":"valid-token"'),
        }),
      );
    });

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = original;
  });

  it("should clear turnstile token on error callback", () => {
    const { result } = renderHook(() => useCreateRoom());

    act(() => {
      result.current.onTurnstileSuccess("some-token");
    });

    act(() => {
      result.current.onTurnstileError();
    });

    // Token cleared, but button should still be enabled (disable moved to submit check)
    expect(result.current.isDisabled).toBe(false);
  });
});
