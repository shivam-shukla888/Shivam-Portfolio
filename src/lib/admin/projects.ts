if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin, isAuthorizedAdminUser } from "@/lib/auth";
import {
  adminProjectSchema,
} from "@/lib/validations/admin-project";

export interface AdminProjectRecord {
  id: string;
  slug: string;
  title: string;
  edition_code: string | null;
  summary: string | null;
  case_study_markdown: string | null;
  cover_image_url: string | null;
  category: string | null;
  tech_stack: string[];
  project_year: number | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;

  // CamelCase aliases for convenience
  editionCode: string | null;
  caseStudyMarkdown: string | null;
  coverImageUrl: string | null;
  techStack: string[];
  projectYear: number | null;
  liveUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface RawProjectRow {
  id: string;
  slug: string;
  title: string;
  edition_code: string | null;
  summary: string | null;
  case_study_markdown: string | null;
  cover_image_url: string | null;
  category: string | null;
  tech_stack: string[] | null;
  project_year: number | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const PROJECT_COLUMNS =
  "id, slug, title, edition_code, summary, case_study_markdown, cover_image_url, category, tech_stack, project_year, live_url, github_url, is_featured, sort_order, published_at, created_at, updated_at";

function mapRawProjectRow(row: RawProjectRow): AdminProjectRecord {
  const techStack = Array.isArray(row.tech_stack) ? row.tech_stack : [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    edition_code: row.edition_code,
    summary: row.summary,
    case_study_markdown: row.case_study_markdown,
    cover_image_url: row.cover_image_url,
    category: row.category,
    tech_stack: techStack,
    project_year: row.project_year,
    live_url: row.live_url,
    github_url: row.github_url,
    is_featured: Boolean(row.is_featured),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,

    // CamelCase aliases
    editionCode: row.edition_code,
    caseStudyMarkdown: row.case_study_markdown,
    coverImageUrl: row.cover_image_url,
    techStack,
    projectYear: row.project_year,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    isFeatured: Boolean(row.is_featured),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
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
 * Retrieves all administrative project records (published and drafts),
 * ordered deterministically by sort_order ASC, then created_at DESC.
 */
export async function getAdminProjects(options?: {
  userId?: string;
  client?: unknown;
}): Promise<AdminProjectRecord[]> {
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
      .from("projects")
      .select(PROJECT_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN PROJECTS DATA] Query error: ${error.message}`);
      }
      return [];
    }

    return (data as RawProjectRow[]).map(mapRawProjectRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROJECTS EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Retrieves a single project record by its primary key UUID.
 */
export async function getAdminProject(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<AdminProjectRecord | null> {
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
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN PROJECT DATA] Query error: ${error.message}`);
      }
      return null;
    }

    return mapRawProjectRow(data as RawProjectRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROJECT EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Creates a new project in public.projects.
 * Server-only execution; validates input and enforces slug uniqueness.
 */
export async function createAdminProject(
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProjectRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const validation = adminProjectSchema.safeParse(input);
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
      .from("projects")
      .select("id")
      .eq("slug", validData.slug)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "That project slug is already in use.",
      };
    }

    const payload = {
      slug: validData.slug,
      title: validData.title,
      edition_code: validData.edition_code,
      summary: validData.summary,
      case_study_markdown: validData.case_study_markdown,
      cover_image_url: validData.cover_image_url,
      category: validData.category,
      tech_stack: validData.tech_stack,
      project_year: validData.project_year,
      live_url: validData.live_url,
      github_url: validData.github_url,
      is_featured: validData.is_featured,
      sort_order: validData.sort_order,
      published_at: validData.published_at,
    };

    const { data, error } = await client
      .from("projects")
      .insert(payload)
      .select(PROJECT_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That project slug is already in use." };
      }
      const msg = error ? error.message : "No row inserted.";
      console.error(`[ADMIN PROJECT CREATE ERROR] ${msg}`);
      return { success: false, error: "Failed to create project." };
    }

    return {
      success: true,
      data: mapRawProjectRow(data as RawProjectRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROJECT CREATE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while creating project.",
    };
  }
}

/**
 * Updates an existing project in public.projects.
 * Validates input and enforces slug uniqueness excluding current project.
 */
export async function updateAdminProject(
  id: string,
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProjectRecord; error?: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid project ID." };
  }

  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const validation = adminProjectSchema.safeParse(input);
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
    // Check if new slug conflicts with another project
    const { data: existingSlug } = await client
      .from("projects")
      .select("id")
      .eq("slug", validData.slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "That project slug is already in use.",
      };
    }

    const payload = {
      slug: validData.slug,
      title: validData.title,
      edition_code: validData.edition_code,
      summary: validData.summary,
      case_study_markdown: validData.case_study_markdown,
      cover_image_url: validData.cover_image_url,
      category: validData.category,
      tech_stack: validData.tech_stack,
      project_year: validData.project_year,
      live_url: validData.live_url,
      github_url: validData.github_url,
      is_featured: validData.is_featured,
      sort_order: validData.sort_order,
      published_at: validData.published_at,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select(PROJECT_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That project slug is already in use." };
      }
      const msg = error ? error.message : "No row updated.";
      console.error(`[ADMIN PROJECT UPDATE ERROR] ${msg}`);
      return { success: false, error: "Failed to update project." };
    }

    return {
      success: true,
      data: mapRawProjectRow(data as RawProjectRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROJECT UPDATE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while updating project.",
    };
  }
}

/**
 * Deletes a project by primary key ID.
 */
export async function deleteAdminProject(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; error?: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid project ID." };
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
      .from("projects")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      console.error(`[ADMIN PROJECT DELETE ERROR] ${error.message}`);
      return { success: false, error: "Failed to delete project." };
    }

    if (count === 0) {
      return { success: false, error: "Project not found or already deleted." };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROJECT DELETE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while deleting project.",
    };
  }
}

/**
 * Sets project publication state: published_at = timestamp or null.
 */
export async function toggleProjectPublish(
  id: string,
  publish: boolean,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProjectRecord; error?: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid project ID." };
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
    const publishedAt = publish ? new Date().toISOString() : null;

    const { data, error } = await client
      .from("projects")
      .update({
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(PROJECT_COLUMNS)
      .single();

    if (error || !data) {
      const msg = error ? error.message : "Failed to toggle publication.";
      console.error(`[ADMIN PROJECT TOGGLE PUBLISH ERROR] ${msg}`);
      return { success: false, error: "Failed to update publication status." };
    }

    return {
      success: true,
      data: mapRawProjectRow(data as RawProjectRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROJECT TOGGLE PUBLISH EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred while updating publication status.",
    };
  }
}
