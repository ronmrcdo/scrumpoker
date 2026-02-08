import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRevealCountdown } from "./use-reveal-countdown";

describe("useRevealCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start with no countdown", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useRevealCountdown(onComplete));

    expect(result.current.countdown).toBeNull();
    expect(result.current.isCounting).toBe(false);
  });

  it("should start countdown at 3", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useRevealCountdown(onComplete));

    act(() => result.current.start());

    expect(result.current.countdown).toBe(3);
    expect(result.current.isCounting).toBe(true);
  });

  it("should count down 3, 2, 1 then call onComplete", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useRevealCountdown(onComplete));

    act(() => result.current.start());
    expect(result.current.countdown).toBe(3);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.countdown).toBe(2);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.countdown).toBe(1);

    act(() => vi.advanceTimersByTime(1000));
    // After reaching 0, the effect fires onComplete and resets to null
    expect(result.current.countdown).toBeNull();
    expect(result.current.isCounting).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should not call onComplete before countdown finishes", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useRevealCountdown(onComplete));

    act(() => result.current.start());

    act(() => vi.advanceTimersByTime(2000));
    expect(onComplete).not.toHaveBeenCalled();
    expect(result.current.isCounting).toBe(true);
  });

  it("should clean up timer on unmount", () => {
    const onComplete = vi.fn();
    const { result, unmount } = renderHook(() =>
      useRevealCountdown(onComplete),
    );

    act(() => result.current.start());
    unmount();

    act(() => vi.advanceTimersByTime(5000));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
