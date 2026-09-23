import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ProjectRow {
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
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  editionCode: string | null;
  summary: string | null;
  caseStudyMarkdown: string | null;
  coverImageUrl: string | null;
  category: string | null;
  techStack: string[];
  projectYear: number | null;
  liveUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt: string;
}

/**
 * Maps raw database project row to camelCase public Project representation.
 */
function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    editionCode: row.edition_code,
    summary: row.summary,
    caseStudyMarkdown: row.case_study_markdown,
    coverImageUrl: row.cover_image_url,
    category: row.category,
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    projectYear: row.project_year,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    publishedAt: row.published_at || "",
  };
}

/**
 * Returns a server-side Supabase client for reading published projects.
 * Adheres strictly to the server-only boundary without leaking credentials.
 */
function getProjectsQueryClient(): SupabaseClient | null {
  const serverClient = getSupabaseServerClient();
  if (serverClient) {
    return serverClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && anonKey) {
    return createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return null;
}

const PUBLIC_PROJECT_COLUMNS =
  "id, slug, title, edition_code, summary, case_study_markdown, cover_image_url, category, tech_stack, project_year, live_url, github_url, is_featured, sort_order, published_at";

/**
 * Fetches all published projects ordered deterministically by sort_order ASC, then created_at DESC.
 * Gracefully degrades to an empty array if Supabase is unconfigured or unreachable.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Project[]> {
  try {
    const client = getProjectsQueryClient();
    if (!client) {
      return [];
    }

    let query = client
      .from("projects")
      .select(PUBLIC_PROJECT_COLUMNS)
      .not("published_at", "is", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }

    if (options?.limit && options.limit > 0) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data) {
      if (error) {
        console.error(
          `[PROJECTS DATA] Query failed: ${error.code || error.message}`
        );
      }
      return [];
    }

    return (data as unknown as ProjectRow[]).map(mapProject);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROJECTS EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Resolves a single published project by its slug.
 * Excludes unpublished projects strictly (returns null).
 */
export async function getPublishedProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    const client = getProjectsQueryClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client
      .from("projects")
      .select(PUBLIC_PROJECT_COLUMNS)
      .eq("slug", slug.trim())
      .not("published_at", "is", null)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(
          `[PROJECTS DATA] Slug query failed: ${error.code || error.message}`
        );
      }
      return null;
    }

    return mapProject(data as unknown as ProjectRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROJECTS EXCEPTION] ${message}`);
    return null;
  }
}
