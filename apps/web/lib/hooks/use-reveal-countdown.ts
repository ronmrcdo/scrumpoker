import { useCallback, useEffect, useRef, useState } from "react";

export function useRevealCountdown(onComplete: () => void) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref in sync without re-triggering effects
  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Watch for countdown reaching 0 and fire the callback outside of the updater
  useEffect(() => {
    if (countdown === 0) {
      clearTimer();
      setCountdown(null);
      onCompleteRef.current();
    }
  }, [countdown, clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    setCountdown(3);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
  }, [clearTimer]);

  return { countdown, isCounting: countdown !== null && countdown > 0, start };
}
