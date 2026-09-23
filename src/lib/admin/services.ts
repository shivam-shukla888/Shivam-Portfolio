if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin, isAuthorizedAdminUser } from "@/lib/auth";
import {
  adminServiceSchema,
} from "@/lib/validations/admin-service";

export interface AdminServiceRecord {
  id: string;
  slug: string;
  program_code: string | null;
  title: string;
  summary: string | null;
  description_markdown: string | null;
  engagement_model: string | null;
  deliverables: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;

  // CamelCase aliases
  programCode: string | null;
  descriptionMarkdown: string | null;
  engagementModel: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface RawServiceRow {
  id: string;
  slug: string;
  program_code: string | null;
  title: string;
  summary: string | null;
  description_markdown: string | null;
  engagement_model: string | null;
  deliverables: string[] | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const SERVICE_COLUMNS =
  "id, slug, program_code, title, summary, description_markdown, engagement_model, deliverables, is_active, sort_order, created_at, updated_at";

function mapRawServiceRow(row: RawServiceRow): AdminServiceRecord {
  const deliverables = Array.isArray(row.deliverables) ? row.deliverables : [];
  return {
    id: row.id,
    slug: row.slug,
    program_code: row.program_code,
    title: row.title,
    summary: row.summary,
    description_markdown: row.description_markdown,
    engagement_model: row.engagement_model,
    deliverables,
    is_active: Boolean(row.is_active),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: row.created_at,
    updated_at: row.updated_at,

    // CamelCase aliases
    programCode: row.program_code,
    descriptionMarkdown: row.description_markdown,
    engagementModel: row.engagement_model,
    isActive: Boolean(row.is_active),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
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
 * Retrieves all administrative service records (active and inactive),
 * ordered deterministically by sort_order ASC, then created_at DESC.
 */
export async function getAdminServices(options?: {
  userId?: string;
  client?: unknown;
}): Promise<AdminServiceRecord[]> {
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
      .from("services")
      .select(SERVICE_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN SERVICES DATA] Query error: ${error.message}`);
      }
      return [];
    }

    return (data as RawServiceRow[]).map(mapRawServiceRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN SERVICES EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Retrieves a single service record by its primary key UUID.
 */
export async function getAdminService(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<AdminServiceRecord | null> {
  if (!id || typeof id !== "string") {
    return null;
  }

  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from("services")
      .select(SERVICE_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN SERVICE DATA] Query error: ${error.message}`);
      }
      return null;
    }

    return mapRawServiceRow(data as RawServiceRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN SERVICE EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Creates a new service in public.services.
 * Server-only execution; validates input and enforces slug uniqueness.
 */
export async function createAdminService(
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminServiceRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const validation = adminServiceSchema.safeParse(input);
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
      .from("services")
      .select("id")
      .eq("slug", validData.slug)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "That service slug is already in use.",
      };
    }

    const payload = {
      slug: validData.slug,
      title: validData.title,
      program_code: validData.program_code,
      summary: validData.summary,
      description_markdown: validData.description_markdown,
      engagement_model: validData.engagement_model,
      deliverables: validData.deliverables,
      is_active: validData.is_active,
      sort_order: validData.sort_order,
    };

    const { data, error } = await client
      .from("services")
      .insert(payload)
      .select(SERVICE_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That service slug is already in use." };
      }
      const msg = error ? error.message : "No row inserted.";
      console.error(`[ADMIN SERVICE CREATE ERROR] ${msg}`);
      return { success: false, error: "Failed to create service." };
    }

    return {
      success: true,
      data: mapRawServiceRow(data as RawServiceRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN SERVICE CREATE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while creating service.",
    };
  }
}

/**
 * Updates an existing service in public.services.
 * Validates input and enforces slug uniqueness excluding current service.
 */
export async function updateAdminService(
  id: string,
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminServiceRecord; error?: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid service ID." };
  }

  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const validation = adminServiceSchema.safeParse(input);
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
    // Check if new slug conflicts with another service
    const { data: existingSlug } = await client
      .from("services")
      .select("id")
      .eq("slug", validData.slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "That service slug is already in use.",
      };
    }

    const payload = {
      slug: validData.slug,
      title: validData.title,
      program_code: validData.program_code,
      summary: validData.summary,
      description_markdown: validData.description_markdown,
      engagement_model: validData.engagement_model,
      deliverables: validData.deliverables,
      is_active: validData.is_active,
      sort_order: validData.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("services")
      .update(payload)
      .eq("id", id)
      .select(SERVICE_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That service slug is already in use." };
      }
      const msg = error ? error.message : "No row updated.";
      console.error(`[ADMIN SERVICE UPDATE ERROR] ${msg}`);
      return { success: false, error: "Failed to update service." };
    }

    return {
      success: true,
      data: mapRawServiceRow(data as RawServiceRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN SERVICE UPDATE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while updating service.",
    };
  }
}

/**
 * Deletes a service by primary key ID.
 */
export async function deleteAdminService(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; error?: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid service ID." };
  }

  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
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
    const { error, count } = await client
      .from("services")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      console.error(`[ADMIN SERVICE DELETE ERROR] ${error.message}`);
      return { success: false, error: "Failed to delete service." };
    }

    if (count === 0) {
      return { success: false, error: "Service not found or already deleted." };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN SERVICE DELETE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while deleting service.",
    };
  }
}

/**
 * Toggles service active status (controlling public visibility).
 */
export async function toggleServiceActive(
  id: string,
  active: boolean,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminServiceRecord; error?: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid service ID." };
  }

  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
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
      .from("services")
      .update({
        is_active: active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(SERVICE_COLUMNS)
      .single();

    if (error || !data) {
      const msg = error ? error.message : "Failed to toggle service status.";
      console.error(`[ADMIN SERVICE TOGGLE ACTIVE ERROR] ${msg}`);
      return { success: false, error: "Failed to update service status." };
    }

    return {
      success: true,
      data: mapRawServiceRow(data as RawServiceRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN SERVICE TOGGLE ACTIVE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while updating service status.",
    };
  }
}
