import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ServiceRow {
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

export interface ServiceDisplayData {
  id: string;
  slug: string;
  programCode: string | null;
  title: string;
  summary: string | null;
  descriptionMarkdown: string | null;
  engagementModel: string | null;
  deliverables: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps raw database service row to camelCase public ServiceDisplayData representation.
 */
function mapService(row: ServiceRow): ServiceDisplayData {
  return {
    id: row.id,
    slug: row.slug,
    programCode: row.program_code,
    title: row.title,
    summary: row.summary,
    descriptionMarkdown: row.description_markdown,
    engagementModel: row.engagement_model,
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Returns a server-side Supabase client for reading active services.
 * Keeps server credentials strictly isolated.
 */
function getServicesQueryClient(): SupabaseClient | null {
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

const PUBLIC_SERVICE_COLUMNS =
  "id, slug, program_code, title, summary, description_markdown, engagement_model, deliverables, is_active, sort_order, created_at, updated_at";

/**
 * Fetches all active services ordered deterministically by sort_order ASC, then created_at DESC.
 * Gracefully degrades to an empty array if Supabase is unconfigured or unreachable.
 */
export async function getPublishedServices(options?: {
  limit?: number;
}): Promise<ServiceDisplayData[]> {
  try {
    const client = getServicesQueryClient();
    if (!client) {
      return [];
    }

    let query = client
      .from("services")
      .select(PUBLIC_SERVICE_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (options?.limit && options.limit > 0) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data) {
      if (error) {
        console.error(
          `[SERVICES DATA] Query failed: ${error.code || error.message}`
        );
      }
      return [];
    }

    return (data as unknown as ServiceRow[]).map(mapService);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[SERVICES EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Resolves a single active service by its slug.
 * Inactive or non-existent services strictly return null.
 */
export async function getPublishedServiceBySlug(
  slug: string
): Promise<ServiceDisplayData | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    const client = getServicesQueryClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client
      .from("services")
      .select(PUBLIC_SERVICE_COLUMNS)
      .eq("slug", slug.trim())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(
          `[SERVICES DATA] Slug query failed: ${error.code || error.message}`
        );
      }
      return null;
    }

    return mapService(data as unknown as ServiceRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[SERVICES EXCEPTION] ${message}`);
    return null;
  }
}
