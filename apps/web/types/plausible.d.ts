interface PlausibleEventOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
}

interface Window {
  plausible?: (event: string, options?: PlausibleEventOptions) => void;
}
