import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a server-side Supabase client for authentication and session management
 * using the official @supabase/ssr Next.js App Router cookie adapter.
 * 
 * SECURITY SPECIFICATION:
 * - Operates using NEXT_PUBLIC_SUPABASE_ANON_KEY (never the service-role key)
 * - Reads and persists sessions through secure HTTP-only cookies
 * - Returns null safely if Supabase is unconfigured
 */
export async function createSupabaseServerAuthClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  try {
    const cookieStore = await cookies();

    return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Invoked from Server Component where cookies cannot be written; ignored.
          }
        },
      },
    });
  } catch (err) {
    // If called outside Next.js request context (e.g. testing)
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[SUPABASE SSR COOKIES ERROR] ${message}`);
    return null;
  }
}
