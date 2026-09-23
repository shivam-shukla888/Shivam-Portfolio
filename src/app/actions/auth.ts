"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import { isAuthorizedAdminUser } from "@/lib/auth";

export interface LoginActionState {
  error: string | null;
}

/**
 * Server Action for authenticating admin users via Supabase Auth.
 * 
 * SECURITY SPECIFICATION:
 * - Operates strictly server-side.
 * - Enforces authentication via Supabase Auth email/password.
 * - Enforces authorization via SHIVSASTRA_ADMIN_USER_ID.
 * - If user credentials succeed but user ID is unauthorized:
 *   immediately terminates session and returns a generic access error.
 * - Never leaks user existence, account details, or configured admin UUIDs.
 */
export async function loginAdmin(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    !email ||
    typeof email !== "string" ||
    !password ||
    typeof password !== "string"
  ) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createSupabaseServerAuthClient();
  if (!supabase) {
    return { error: "Authentication service is currently unavailable." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return { error: "Invalid login credentials." };
    }

    const isAuthorized = isAuthorizedAdminUser(data.user.id);
    if (!isAuthorized) {
      // Invalidate session immediately to prevent unauthorized session lingering
      await supabase.auth.signOut();
      return {
        error: "Access denied. You are not authorized as an administrator.",
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[LOGIN ACTION ERROR] ${message}`);
    return { error: "An unexpected authentication error occurred." };
  }

  redirect("/admin");
}

/**
 * Server Action for invalidating admin session and redirecting to login.
 */
export async function logoutAdmin(): Promise<void> {
  const supabase = await createSupabaseServerAuthClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore sign-out exceptions
    }
  }
  redirect("/admin/login");
}
