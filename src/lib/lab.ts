import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type LabCategory = "idea" | "build" | "stack" | "thought";

export type LabStatus =
  | "draft"
  | "wip"
  | "experimental"
  | "archived"
  | "published";

export interface LabEntryRow {
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
}

/**
 * Publicly exposed Personal Lab entry data.
 * Adheres strictly to the database contract with camelCase mapping.
 */
export interface LabEntryDisplayData {
  id: string;
  slug: string;
  category: LabCategory;
  title: string;
  contentMarkdown: string | null;
  tags: string[];
  status: LabStatus;
  isPublic: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps raw database lab entry row to camelCase public LabEntryDisplayData.
 */
function mapLabEntry(row: LabEntryRow): LabEntryDisplayData {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    contentMarkdown: row.content_markdown,
    tags: Array.isArray(row.tags) ? [...row.tags] : [],
    status: row.status,
    isPublic: row.is_public,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Returns a server-side Supabase client for reading active lab entries.
 * Credentials remain isolated on the server.
 */
function getLabQueryClient(): SupabaseClient | null {
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

const PUBLIC_LAB_COLUMNS =
  "id, slug, category, title, content_markdown, tags, status, is_public, published_at, created_at, updated_at";

/**
 * Fetches all public, published lab entries ordered deterministically by published_at DESC, then created_at DESC.
 * Enforces is_public = true AND published_at IS NOT NULL.
 * Gracefully degrades to an empty array if Supabase is unconfigured or unreachable.
 */
export async function getPublishedLabEntries(): Promise<LabEntryDisplayData[]> {
  try {
    const client = getLabQueryClient();
    if (!client) {
      return [];
    }

    const { data, error } = await client
      .from("lab_entries")
      .select(PUBLIC_LAB_COLUMNS)
      .eq("is_public", true)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) {
        console.error(
          `[LAB DATA] Query failed: ${error.code || error.message}`
        );
      }
      return [];
    }

    return (data as unknown as LabEntryRow[]).map(mapLabEntry);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[LAB EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Resolves a single public, published lab entry by its slug.
 * Unavailable, private, unpublished, or non-existent entries strictly return null.
 */
export async function getPublishedLabEntryBySlug(
  slug: string
): Promise<LabEntryDisplayData | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    const client = getLabQueryClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client
      .from("lab_entries")
      .select(PUBLIC_LAB_COLUMNS)
      .eq("slug", slug.trim())
      .eq("is_public", true)
      .not("published_at", "is", null)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(
          `[LAB DATA] Slug query failed: ${error.code || error.message}`
        );
      }
      return null;
    }

    return mapLabEntry(data as unknown as LabEntryRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[LAB EXCEPTION] Slug fetch error: ${message}`);
    return null;
  }
}
