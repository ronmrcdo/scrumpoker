const MIN_SUBMIT_TIME_MS = 2_000; // 2 seconds — no human fills 2 fields this fast

export interface AntiBotPayload {
  /** Honeypot field value — should be empty for legitimate submissions */
  hp: string;
  /** Timestamp (ms) when the form component mounted */
  formLoadedAt: number;
}

export interface AntiBotResult {
  passed: boolean;
  reason?: string;
}

export function validateAntiBot(payload: AntiBotPayload): AntiBotResult {
  // Honeypot: bots auto-fill hidden fields, humans never see them
  if (payload.hp && payload.hp.trim().length > 0) {
    return { passed: false, reason: "honeypot" };
  }

  // Timing: reject if form was submitted unrealistically fast
  const elapsed = Date.now() - payload.formLoadedAt;
  if (elapsed < MIN_SUBMIT_TIME_MS) {
    return { passed: false, reason: "timing" };
  }

  return { passed: true };
}
