import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ProfileSettingsRow {
  id: string;
  is_singleton: boolean;
  full_name: string;
  positioning_statement: string | null;
  hero_supporting_text: string | null;
  about_markdown: string | null;
  contact_instructions: string | null;
  availability_status: string | null;
  email: string | null;
  phone: string | null;
  contra_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  updated_at: string;
}

export interface ProfileDisplayData {
  fullName: string;
  positioningStatement: string;
  heroSupportingText: string;
  aboutMarkdown: string;
  contactInstructions: string;
  availabilityStatus: string | null;
  email: string | null;
  phone: string | null;
  contraUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  instagramUrl: string | null;
  xUrl: string | null;
}

/**
 * Exact zero-invention fallback values.
 * Never invent marketing copy, claims, biographies, or speculative credentials.
 * Reflects verified user-provided identity and canonical placeholders for pending copy.
 */
export const PROFILE_FALLBACK: ProfileDisplayData = {
  fullName: "Shivam Shukla",
  positioningStatement: "[PERSONAL POSITIONING PENDING]",
  heroSupportingText: "[SHORT SUPPORTING CONTENT PENDING]",
  aboutMarkdown: "[ABOUT CONTENT PENDING]",
  contactInstructions: "[CONTACT DETAILS PENDING]",
  availabilityStatus: null,
  email: "theshivamshukla.4uu@gmail.com",
  phone: "8887780625",
  contraUrl: "https://contra.com/shivam_shukla_7duxsdr7/work",
  linkedinUrl: "https://www.linkedin.com/in/shivam-shukla-186276374/",
  githubUrl: "https://github.com/shivam-shukla888",
  instagramUrl: "https://www.instagram.com/shastra2003",
  xUrl: "https://x.com/shastra2003",
};

/**
 * Returns a server-side Supabase client for reading public profile settings.
 * Prioritizes service-role client if configured, or falls back to public anon credentials
 * for server-side public read queries.
 */
function getProfileQueryClient(): SupabaseClient | null {
  // 1. Prefer administrative service-role client if present
  const serverClient = getSupabaseServerClient();
  if (serverClient) {
    return serverClient;
  }

  // 2. Otherwise, use public anon credentials for server-side public reads
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

/**
 * Queries the singleton profile row from `public.profile_settings`.
 * 
 * Guarantees:
 * - Server-only execution; credentials never leak to the client bundle.
 * - Graceful degradation: If Supabase is unconfigured, unreachable, or throws an error,
 *   the function catches it safely and returns standard zero-invention placeholders.
 * - Handles nullable/empty database values strictly by falling back to placeholders.
 */
export async function getProfileSettings(): Promise<ProfileDisplayData> {
  try {
    const client = getProfileQueryClient();
    if (!client) {
      return PROFILE_FALLBACK;
    }

    const { data, error } = await client
      .from("profile_settings")
      .select(
        "full_name, positioning_statement, hero_supporting_text, about_markdown, contact_instructions, availability_status, email, phone, contra_url, linkedin_url, github_url, instagram_url, x_url"
      )
      .eq("is_singleton", true)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(
          `[PROFILE DATA] Database query failed: ${error.code || error.message}`
        );
      }
      return PROFILE_FALLBACK;
    }

    return {
      fullName: data.full_name?.trim() || PROFILE_FALLBACK.fullName,
      positioningStatement:
        data.positioning_statement?.trim() || PROFILE_FALLBACK.positioningStatement,
      heroSupportingText:
        data.hero_supporting_text?.trim() || PROFILE_FALLBACK.heroSupportingText,
      aboutMarkdown: data.about_markdown?.trim() || PROFILE_FALLBACK.aboutMarkdown,
      contactInstructions:
        data.contact_instructions?.trim() || PROFILE_FALLBACK.contactInstructions,
      availabilityStatus: data.availability_status?.trim() || null,
      email: data.email?.trim() || PROFILE_FALLBACK.email,
      phone: data.phone?.trim() || PROFILE_FALLBACK.phone,
      contraUrl: data.contra_url?.trim() || PROFILE_FALLBACK.contraUrl,
      linkedinUrl: data.linkedin_url?.trim() || PROFILE_FALLBACK.linkedinUrl,
      githubUrl: data.github_url?.trim() || PROFILE_FALLBACK.githubUrl,
      instagramUrl: data.instagram_url?.trim() || PROFILE_FALLBACK.instagramUrl,
      xUrl: data.x_url?.trim() || PROFILE_FALLBACK.xUrl,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROFILE DATA EXCEPTION] ${message}`);
    return PROFILE_FALLBACK;
  }
}
