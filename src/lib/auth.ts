import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

export interface AuthenticatedAdminUser {
  id: string;
  email: string | null;
}

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  user: AuthenticatedAdminUser | null;
  error?: string;
}

/**
 * Pure authorization determination rule.
 * 
 * SECURITY SPECIFICATION:
 * - Compares authenticated Supabase user ID with SHIVSASTRA_ADMIN_USER_ID.
 * - If SHIVSASTRA_ADMIN_USER_ID is missing, undefined, or empty, MUST FAIL CLOSED (returns false).
 * - If userId is missing, undefined, or empty, MUST FAIL CLOSED (returns false).
 * - Never trusts client-submitted parameters, query strings, or request bodies.
 */
export function isAuthorizedAdminUser(
  userId: string | null | undefined,
  configuredAdminId: string | null | undefined = process.env.SHIVSASTRA_ADMIN_USER_ID
): boolean {
  if (
    !configuredAdminId ||
    typeof configuredAdminId !== "string" ||
    configuredAdminId.trim().length === 0
  ) {
    // Fail closed: Missing admin configuration rejects all access
    return false;
  }

  if (
    !userId ||
    typeof userId !== "string" ||
    userId.trim().length === 0
  ) {
    return false;
  }

  return userId.trim() === configuredAdminId.trim();
}

/**
 * Resolves current authenticated user from Supabase Auth and evaluates admin authorization.
 * 
 * SECURITY GUARANTEES:
 * - Server-only execution.
 * - Validates JWT cryptographically via Supabase Auth server (getUser).
 * - Enforces SHIVSASTRA_ADMIN_USER_ID authorization boundary.
 * - Fails closed upon unconfigured environment, invalid sessions, or non-admin users.
 */
export async function getAuthenticatedAdmin(): Promise<AdminAuthResult> {
  const configuredAdminId = process.env.SHIVSASTRA_ADMIN_USER_ID;

  if (!configuredAdminId || !configuredAdminId.trim()) {
    return {
      isAuthenticated: false,
      isAuthorized: false,
      user: null,
      error: "ADMIN_CONFIG_MISSING",
    };
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return {
      isAuthenticated: false,
      isAuthorized: false,
      user: null,
      error: "SUPABASE_UNCONFIGURED",
    };
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        isAuthenticated: false,
        isAuthorized: false,
        user: null,
        error: error?.message || "UNAUTHENTICATED",
      };
    }

    const authorized = isAuthorizedAdminUser(user.id, configuredAdminId);

    if (!authorized) {
      return {
        isAuthenticated: true,
        isAuthorized: false,
        user: {
          id: user.id,
          email: user.email ?? null,
        },
        error: "UNAUTHORIZED_ADMIN_ID",
      };
    }

    return {
      isAuthenticated: true,
      isAuthorized: true,
      user: {
        id: user.id,
        email: user.email ?? null,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN AUTH EXCEPTION] ${message}`);
    return {
      isAuthenticated: false,
      isAuthorized: false,
      user: null,
      error: "AUTH_EXCEPTION",
    };
  }
}
