import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

// See note in client.ts: the generics @supabase/ssr 0.6 passes through to
// SupabaseClient 2.94+ collapse to `never`, so we widen by casting.
type TypedClient = SupabaseClient<Database>;

export async function createServerSupabaseClient(): Promise<TypedClient> {
  const cookieStore = await cookies();

  const client = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[],
        ) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch (error) {
            // setAll is called from Server Components where cookies can't be set.
            // This can be safely ignored if middleware is handling session refresh.
            if (process.env.NODE_ENV === "development") {
              console.debug(
                "[Supabase] Cookie set attempted in Server Component (expected behavior):",
                error instanceof Error ? error.message : "Unknown error",
              );
            }
          }
        },
      },
    },
  );

  return client as unknown as TypedClient;
}
