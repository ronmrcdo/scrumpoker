export function trackEvent(
  event: string,
  properties?: Record<string, string | number | boolean>,
) {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(event, { props: properties });
  }
}
