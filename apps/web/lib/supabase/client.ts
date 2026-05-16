import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

type BrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserClient | null = null;

export function createClient(): BrowserClient {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
      },
    },
  );
  return browserClient;
}
