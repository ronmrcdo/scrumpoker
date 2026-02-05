import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
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
  });
}
