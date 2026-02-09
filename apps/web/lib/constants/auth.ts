/** Maximum number of consecutive token refresh failures before re-authenticating. */
export const MAX_REFRESH_RETRIES = 2;

/**
 * Interval in milliseconds between proactive token refresh checks.
 * Supabase access tokens typically have a 3600s lifetime; checking
 * every 30s ensures we catch expiring tokens with margin to spare.
 */
export const TOKEN_REFRESH_INTERVAL_MS = 30_000;

/**
 * Minimum remaining lifetime (in seconds) on the access token before
 * a proactive refresh is triggered.
 */
export const TOKEN_EXPIRY_MARGIN_S = 60;
