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

export const YOJNA_SETU_PROJECT: Project = {
  id: "yojna-setu-v2",
  slug: "yojna-setu",
  title: "Yojna Setu",
  editionCode: "YS-V2",
  summary:
    "Privacy-Aware Government Scheme Discovery & Eligibility Platform. Multilingual natural language intake coupled with a deterministic, testable rules engine over 82 normalized welfare schemes.",
  caseStudyMarkdown: null,
  coverImageUrl: "/images/projects/yojna-setu/cover.svg",
  category: "Backend Systems · AI Security",
  techStack: [
    "Java 21",
    "Spring Boot",
    "PostgreSQL",
    "Supabase",
    "Groq",
    "Twilio Boundary",
  ],
  projectYear: 2026,
  liveUrl: null,
  githubUrl: "https://github.com/shivam-shukla888/Yojna-Setu",
  isFeatured: true,
  sortOrder: 1,
  publishedAt: "2026-09-25T12:00:00Z",
};

const PUBLIC_PROJECT_COLUMNS =
  "id, slug, title, edition_code, summary, case_study_markdown, cover_image_url, category, tech_stack, project_year, live_url, github_url, is_featured, sort_order, published_at";

/**
 * Fetches all published projects ordered deterministically by sort_order ASC, then created_at DESC.
 * Seamlessly integrates canonical featured projects (Yojna Setu V2) with live Supabase storage.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Project[]> {
  let projects: Project[] = [];

  try {
    const client = getProjectsQueryClient();
    if (client) {
      let query = client
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .not("published_at", "is", null)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (options?.featuredOnly) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (!error && data && Array.isArray(data)) {
        projects = (data as unknown as ProjectRow[]).map(mapProject);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROJECTS EXCEPTION] ${message}`);
  }

  // Ensure canonical Yojna Setu V2 project is present in the archive
  const hasYojnaSetu = projects.some((p) => p.slug === "yojna-setu");
  if (!hasYojnaSetu) {
    if (!options?.featuredOnly || YOJNA_SETU_PROJECT.isFeatured) {
      projects.unshift(YOJNA_SETU_PROJECT);
    }
  }

  // Deterministic sort by sortOrder ASC
  projects.sort((a, b) => a.sortOrder - b.sortOrder);

  if (options?.limit && options.limit > 0) {
    projects = projects.slice(0, options.limit);
  }

  return projects;
}

/**
 * Resolves a single published project by its slug.
 * Excludes unpublished projects strictly (returns null).
 * Guarantees resolution for canonical projects (yojna-setu).
 */
export async function getPublishedProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  const normalizedSlug = slug.trim();

  try {
    const client = getProjectsQueryClient();
    if (client) {
      const { data, error } = await client
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .eq("slug", normalizedSlug)
        .not("published_at", "is", null)
        .maybeSingle();

      if (!error && data) {
        return mapProject(data as unknown as ProjectRow);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROJECTS EXCEPTION] ${message}`);
  }

  // Canonical fallback for Yojna Setu V2
  if (normalizedSlug === "yojna-setu") {
    return YOJNA_SETU_PROJECT;
  }

  return null;
}
