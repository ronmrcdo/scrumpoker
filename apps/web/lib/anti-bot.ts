const MIN_SUBMIT_TIME_MS = 3_000; // 3 seconds — no human fills 2 fields this fast
const MAX_FORM_AGE_MS = 3_600_000; // 1 hour — stale loads are likely replays
const MAX_FUTURE_SKEW_MS = 60_000; // tolerate up to 1 minute of clock skew

export interface AntiBotPayload {
  /** Honeypot field value — should be empty for legitimate submissions */
  hp: string;
  /** Timestamp (ms) when the form component mounted */
  formLoadedAt: number;
}

export type AntiBotReason = "honeypot" | "clock-skew" | "stale" | "timing";

export interface AntiBotResult {
  passed: boolean;
  reason?: AntiBotReason;
}

export function validateAntiBot(payload: AntiBotPayload): AntiBotResult {
  // Honeypot: bots auto-fill hidden fields, humans never see them
  if (payload.hp && payload.hp.trim().length > 0) {
    return { passed: false, reason: "honeypot" };
  }

  const now = Date.now();
  const elapsed = now - payload.formLoadedAt;

  // Clock skew: a future-dated formLoadedAt is suspicious (and could bypass timing)
  if (elapsed < -MAX_FUTURE_SKEW_MS) {
    return { passed: false, reason: "clock-skew" };
  }

  // Stale: a very old formLoadedAt suggests replay or abandoned tab being weaponized
  if (elapsed > MAX_FORM_AGE_MS) {
    return { passed: false, reason: "stale" };
  }

  // Timing: reject if form was submitted unrealistically fast
  if (elapsed < MIN_SUBMIT_TIME_MS) {
    return { passed: false, reason: "timing" };
  }

  return { passed: true };
}
