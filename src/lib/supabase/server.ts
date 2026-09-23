import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverClientInstance: SupabaseClient | null = null;

/**
 * Returns an administrative server-side Supabase client if environment variables are configured.
 * 
 * SECURITY SPECIFICATION (SEC-03 Remediation):
 * - Requires SUPABASE_SERVICE_ROLE_KEY for server-side persistence.
 * - Does NOT fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *   This ensures we never depend on broad, unauthenticated "INSERT TO anon" RLS policies.
 * - If credentials are missing, returns null safely without throwing or crashing the build.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  if (!serverClientInstance) {
    serverClientInstance = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClientInstance;
}

/**
 * Helper to reset instance for automated test isolation
 */
export function resetSupabaseServerClient(): void {
  serverClientInstance = null;
}
