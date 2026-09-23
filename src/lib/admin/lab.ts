if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin, isAuthorizedAdminUser } from "@/lib/auth";
import {
  adminLabSchema,
  LabCategory,
  LabStatus,
} from "@/lib/validations/admin-lab";

export interface AdminLabEntryRecord {
  id: string;
  slug: string;
  category: LabCategory;
  title: string;
  content_markdown: string | null;
  tags: string[];
  status: LabStatus;
  is_public: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;

  // CamelCase aliases
  contentMarkdown: string | null;
  isPublic: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RawLabRow {
  id: string;
  slug: string;
  category: LabCategory;
  title: string;
  content_markdown: string | null;
  tags: string[] | null;
  status: LabStatus;
  is_public: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const LAB_COLUMNS =
  "id, slug, category, title, content_markdown, tags, status, is_public, published_at, created_at, updated_at";

function mapRawLabRow(row: RawLabRow): AdminLabEntryRecord {
  const tags = Array.isArray(row.tags) ? row.tags : [];
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    content_markdown: row.content_markdown,
    tags,
    status: row.status,
    is_public: Boolean(row.is_public),
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,

    // CamelCase aliases
    contentMarkdown: row.content_markdown,
    isPublic: Boolean(row.is_public),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Evaluates caller authorization. Fails closed.
 */
async function checkAdminAuthorization(userId?: string): Promise<boolean> {
  if (userId) {
    return isAuthorizedAdminUser(userId);
  }
  const auth = await getAuthenticatedAdmin();
  return auth.isAuthenticated && auth.isAuthorized;
}

/**
 * Retrieves all administrative Personal Lab entries (public and private),
 * ordered deterministically by created_at DESC.
 */
export async function getAdminLabEntries(options?: {
  userId?: string;
  client?: unknown;
}): Promise<AdminLabEntryRecord[]> {
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
    const { data, error } = await client
      .from("lab_entries")
      .select(LAB_COLUMNS)
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN LAB DATA] Query error: ${error.message}`);
      }
      return [];
    }

    return (data as RawLabRow[]).map(mapRawLabRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Retrieves a single Personal Lab entry by ID for administrative editing.
 */
export async function getAdminLabEntry(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<AdminLabEntryRecord | null> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return null;
  }

  if (!id || typeof id !== "string") {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from("lab_entries")
      .select(LAB_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN LAB DATA] Query error: ${error.message}`);
      }
      return null;
    }

    return mapRawLabRow(data as RawLabRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Creates a new Personal Lab entry in public.lab_entries.
 * Server-only execution; validates input and enforces slug uniqueness.
 */
export async function createAdminLabEntry(
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminLabEntryRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const validation = adminLabSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed. Please correct the invalid fields.",
    };
  }
  const validData = validation.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    // Slug uniqueness check
    const { data: existingSlug } = await client
      .from("lab_entries")
      .select("id")
      .eq("slug", validData.slug)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "That lab entry slug is already in use.",
      };
    }

    const payload = {
      slug: validData.slug,
      category: validData.category,
      title: validData.title,
      content_markdown: validData.content_markdown,
      tags: validData.tags,
      status: validData.status,
      is_public: validData.is_public,
      published_at: validData.published_at,
    };

    const { data, error } = await client
      .from("lab_entries")
      .insert(payload)
      .select(LAB_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That lab entry slug is already in use." };
      }
      const msg = error ? error.message : "No row inserted.";
      console.error(`[ADMIN LAB CREATE ERROR] ${msg}`);
      return { success: false, error: "Failed to create lab entry." };
    }

    try {
      revalidatePath("/admin/lab");
      revalidatePath("/lab");
      revalidatePath(`/lab/${validData.slug}`);
      revalidatePath("/");
    } catch {
      // Revalidation may be skipped in test contexts
    }

    return { success: true, data: mapRawLabRow(data as RawLabRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB CREATE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to create lab entry." };
  }
}

/**
 * Updates an existing Personal Lab entry in public.lab_entries.
 */
export async function updateAdminLabEntry(
  id: string,
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminLabEntryRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid lab entry identifier." };
  }

  const validation = adminLabSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed. Please correct the invalid fields.",
    };
  }
  const validData = validation.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const { data: currentEntry, error: fetchError } = await client
      .from("lab_entries")
      .select("id, slug")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !currentEntry) {
      return { success: false, error: "Lab entry not found." };
    }

    // Slug collision check
    if (validData.slug !== currentEntry.slug) {
      const { data: collision } = await client
        .from("lab_entries")
        .select("id")
        .eq("slug", validData.slug)
        .neq("id", id)
        .maybeSingle();

      if (collision) {
        return {
          success: false,
          error: "That lab entry slug is already in use by another entry.",
        };
      }
    }

    const payload = {
      slug: validData.slug,
      category: validData.category,
      title: validData.title,
      content_markdown: validData.content_markdown,
      tags: validData.tags,
      status: validData.status,
      is_public: validData.is_public,
      published_at: validData.published_at,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("lab_entries")
      .update(payload)
      .eq("id", id)
      .select(LAB_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That lab entry slug is already in use." };
      }
      const msg = error ? error.message : "No row returned.";
      console.error(`[ADMIN LAB UPDATE ERROR] ${msg}`);
      return { success: false, error: "Failed to update lab entry." };
    }

    try {
      revalidatePath("/admin/lab");
      revalidatePath("/lab");
      revalidatePath(`/lab/${currentEntry.slug}`);
      if (validData.slug !== currentEntry.slug) {
        revalidatePath(`/lab/${validData.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true, data: mapRawLabRow(data as RawLabRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB UPDATE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to update lab entry." };
  }
}

/**
 * Permanently deletes a Personal Lab entry from public.lab_entries.
 */
export async function deleteAdminLabEntry(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid lab entry identifier." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const { data: targetEntry } = await client
      .from("lab_entries")
      .select("id, slug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await client.from("lab_entries").delete().eq("id", id);

    if (error) {
      console.error(`[ADMIN LAB DELETE ERROR] ${error.message}`);
      return { success: false, error: "Failed to delete lab entry." };
    }

    try {
      revalidatePath("/admin/lab");
      revalidatePath("/lab");
      if (targetEntry?.slug) {
        revalidatePath(`/lab/${targetEntry.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB DELETE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to delete lab entry." };
  }
}

/**
 * Publishes a Personal Lab entry:
 * - sets is_public = true
 * - sets published_at = current ISO timestamp
 * - preserves existing status (unless explicitly requested otherwise)
 */
export async function publishAdminLabEntry(
  id: string,
  options?: { userId?: string; client?: unknown; setStatusPublished?: boolean }
): Promise<{ success: boolean; data?: AdminLabEntryRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid lab entry identifier." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const updates: Record<string, unknown> = {
      is_public: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (options?.setStatusPublished) {
      updates.status = "published";
    }

    const { data, error } = await client
      .from("lab_entries")
      .update(updates)
      .eq("id", id)
      .select(LAB_COLUMNS)
      .single();

    if (error || !data) {
      const msg = error ? error.message : "No row returned.";
      console.error(`[ADMIN LAB PUBLISH ERROR] ${msg}`);
      return { success: false, error: "Failed to publish lab entry." };
    }

    try {
      revalidatePath("/admin/lab");
      revalidatePath("/lab");
      if (data.slug) {
        revalidatePath(`/lab/${data.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true, data: mapRawLabRow(data as RawLabRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB PUBLISH EXCEPTION] ${message}`);
    return { success: false, error: "Failed to publish lab entry." };
  }
}

/**
 * Unpublishes a Personal Lab entry:
 * - sets is_public = false
 * - sets published_at = null
 */
export async function unpublishAdminLabEntry(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminLabEntryRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid lab entry identifier." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const { data, error } = await client
      .from("lab_entries")
      .update({
        is_public: false,
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(LAB_COLUMNS)
      .single();

    if (error || !data) {
      const msg = error ? error.message : "No row returned.";
      console.error(`[ADMIN LAB UNPUBLISH ERROR] ${msg}`);
      return { success: false, error: "Failed to unpublish lab entry." };
    }

    try {
      revalidatePath("/admin/lab");
      revalidatePath("/lab");
      if (data.slug) {
        revalidatePath(`/lab/${data.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true, data: mapRawLabRow(data as RawLabRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN LAB UNPUBLISH EXCEPTION] ${message}`);
    return { success: false, error: "Failed to unpublish lab entry." };
  }
}
