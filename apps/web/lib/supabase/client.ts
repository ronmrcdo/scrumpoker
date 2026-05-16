import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

// We assign the SupabaseClient<Database> type directly rather than relying
// on createBrowserClient<Database>'s return type — @supabase/ssr 0.6 passes
// generics in a positional order that the newer SupabaseClient signature
// (2.94+) interprets incorrectly, collapsing the schema to `never` and
// erasing all .from()/.rpc() type information.
type TypedClient = SupabaseClient<Database>;

let browserClient: TypedClient | null = null;

export function createClient(): TypedClient {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
      },
    },
  ) as unknown as TypedClient;
  return browserClient;
}
