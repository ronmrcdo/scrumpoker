export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
}

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(
  token: string,
  remoteip?: string,
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      return { success: false, errorCodes: ["missing-secret-key"] };
    }
    return { success: true };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
    ...(remoteip ? { remoteip } : {}),
  });

  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await response.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return {
    success: data.success === true,
    errorCodes: data["error-codes"],
  };
}
