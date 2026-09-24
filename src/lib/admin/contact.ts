if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin, isAuthorizedAdminUser } from "@/lib/auth";

export interface AdminContactSubmission {
  id: string;
  name: string;
  email: string;
  brief: string;
  ipHash: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

interface RawContactRow {
  id: string;
  name: string;
  email: string;
  brief: string;
  ip_hash: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

function mapRowToSubmission(row: RawContactRow): AdminContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    brief: row.brief,
    ipHash: row.ip_hash,
    isRead: Boolean(row.is_read),
    isArchived: Boolean(row.is_archived),
    createdAt: row.created_at,
  };
}

async function checkAdminAuthorization(userId?: string): Promise<boolean> {
  if (userId) {
    return isAuthorizedAdminUser(userId);
  }
  const auth = await getAuthenticatedAdmin();
  return auth.isAuthenticated && auth.isAuthorized;
}

/**
 * Retrieves contact submissions for the authenticated admin.
 * Default view returns non-archived submissions ordered by created_at DESC.
 */
export async function getAdminContactSubmissions(options?: {
  userId?: string;
  filter?: "all" | "unread" | "archived";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client?: any;
}): Promise<AdminContactSubmission[]> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return [];
  }

  try {
    let query = client
      .from("contact_submissions")
      .select("id, name, email, brief, ip_hash, is_read, is_archived, created_at");

    if (options?.filter === "unread") {
      query = query.eq("is_read", false).eq("is_archived", false);
    } else if (options?.filter === "archived") {
      query = query.eq("is_archived", true);
    } else {
      // Default: active non-archived
      query = query.eq("is_archived", false);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data) {
      console.error(`[ADMIN CONTACT ERROR] Failed to fetch submissions: ${error?.message || "UNKNOWN"}`);
      return [];
    }

    return (data as RawContactRow[]).map(mapRowToSubmission);
  } catch (err) {
    console.error("[ADMIN CONTACT EXCEPTION]", err);
    return [];
  }
}

/**
 * Updates the read status of a contact submission.
 */
export async function updateSubmissionReadStatus(
  id: string,
  isRead: boolean,
  options?: { userId?: string; client?: any } // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<{ success: boolean; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return { success: false, error: "DATABASE_UNAVAILABLE" };
  }

  try {
    const { error } = await client
      .from("contact_submissions")
      .update({ is_read: isRead })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "UPDATE_FAILED";
    return { success: false, error: msg };
  }
}

/**
 * Updates the archived status of a contact submission.
 */
export async function updateSubmissionArchiveStatus(
  id: string,
  isArchived: boolean,
  options?: { userId?: string; client?: any } // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<{ success: boolean; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return { success: false, error: "DATABASE_UNAVAILABLE" };
  }

  try {
    const { error } = await client
      .from("contact_submissions")
      .update({ is_archived: isArchived })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ARCHIVE_FAILED";
    return { success: false, error: msg };
  }
}
