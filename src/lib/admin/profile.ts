if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin, isAuthorizedAdminUser } from "@/lib/auth";
import {
  adminProfileSchema,
} from "@/lib/validations/admin-profile";

export interface AdminProfileRecord {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  contra_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  positioning_statement: string | null;
  hero_supporting_text: string | null;
  availability_status: string | null;
  about_markdown: string | null;
  contact_instructions: string | null;
  is_singleton: boolean;
  created_at: string;
  updated_at: string;

  // CamelCase aliases for template convenience
  fullName: string;
  contraUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  instagramUrl: string | null;
  xUrl: string | null;
  positioningStatement: string | null;
  heroSupportingText: string | null;
  availabilityStatus: string | null;
  aboutMarkdown: string | null;
  contactInstructions: string | null;
  isSingleton: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RawProfileRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  contra_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  positioning_statement: string | null;
  hero_supporting_text: string | null;
  availability_status: string | null;
  about_markdown: string | null;
  contact_instructions: string | null;
  is_singleton: boolean;
  created_at: string;
  updated_at: string;
}

const PROFILE_COLUMNS =
  "id, full_name, email, phone, contra_url, linkedin_url, github_url, instagram_url, x_url, positioning_statement, hero_supporting_text, availability_status, about_markdown, contact_instructions, is_singleton, created_at, updated_at";

export const KNOWN_SINGLETON_ID = "00000000-0000-0000-0000-000000000001";

function mapRawProfileRow(row: RawProfileRow): AdminProfileRecord {
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    contra_url: row.contra_url,
    linkedin_url: row.linkedin_url,
    github_url: row.github_url,
    instagram_url: row.instagram_url,
    x_url: row.x_url,
    positioning_statement: row.positioning_statement,
    hero_supporting_text: row.hero_supporting_text,
    availability_status: row.availability_status,
    about_markdown: row.about_markdown,
    contact_instructions: row.contact_instructions,
    is_singleton: row.is_singleton,
    created_at: row.created_at,
    updated_at: row.updated_at,

    // CamelCase convenience
    fullName: row.full_name,
    contraUrl: row.contra_url,
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    instagramUrl: row.instagram_url,
    xUrl: row.x_url,
    positioningStatement: row.positioning_statement,
    heroSupportingText: row.hero_supporting_text,
    availabilityStatus: row.availability_status,
    aboutMarkdown: row.about_markdown,
    contactInstructions: row.contact_instructions,
    isSingleton: row.is_singleton,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Retrieves the raw administrative profile settings singleton record.
 * Server-only execution; targets the singleton record exclusively.
 */
export async function getAdminProfile(): Promise<AdminProfileRecord | null> {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from("profile_settings")
      .select(PROFILE_COLUMNS)
      .eq("is_singleton", true)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN PROFILE DATA] Query error: ${error.message}`);
      }
      return null;
    }

    return mapRawProfileRow(data as unknown as RawProfileRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROFILE EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Alias for backward compatibility.
 */
export const getAdminProfileSettings = getAdminProfile;

/**
 * Updates the administrative profile settings singleton row.
 * 
 * SECURITY & SINGLETON GUARANTEES:
 * 1. Authenticates current user / verifies admin authorization (Fail Closed).
 * 2. Validates inputs server-side using Zod schema.
 * 3. Never accepts client-provided row IDs or user IDs to target mutation.
 * 4. Mutates singleton row (WHERE is_singleton = true) using server-only service-role client.
 * 5. Re-reads and returns the updated typed record.
 */
export async function updateAdminProfile(
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProfileRecord; error?: string }> {
  // 1 & 2 & 3. Authentication & Authorization evaluation
  let isAuthorized = false;
  if (options?.userId) {
    isAuthorized = isAuthorizedAdminUser(options.userId);
  } else {
    const auth = await getAuthenticatedAdmin();
    isAuthorized = auth.isAuthenticated && auth.isAuthorized;
  }

  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  // 4. Validate input
  const validation = adminProfileSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed. Please correct the invalid fields.",
    };
  }
  const validData = validation.data;

  // Verify privileged server client (or injected client)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const updatePayload = {
      full_name: validData.full_name,
      email: validData.email,
      phone: validData.phone,
      contra_url: validData.contra_url,
      linkedin_url: validData.linkedin_url,
      github_url: validData.github_url,
      instagram_url: validData.instagram_url,
      x_url: validData.x_url,
      positioning_statement: validData.positioning_statement,
      hero_supporting_text: validData.hero_supporting_text,
      availability_status: validData.availability_status,
      about_markdown: validData.about_markdown,
      contact_instructions: validData.contact_instructions,
      updated_at: new Date().toISOString(),
    };

    // 5. Update singleton row strictly
    const { data, error } = await client
      .from("profile_settings")
      .update(updatePayload)
      .eq("is_singleton", true)
      .select(PROFILE_COLUMNS)
      .single();

    if (error || !data) {
      const msg = error ? error.message : "No row updated.";
      console.error(`[ADMIN PROFILE UPDATE ERROR] ${msg}`);
      return { success: false, error: "Failed to update profile settings." };
    }

    // 6 & 7. Re-read and return safe typed record
    return {
      success: true,
      data: mapRawProfileRow(data as unknown as RawProfileRow),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PROFILE UPDATE EXCEPTION] ${message}`);
    return {
      success: false,
      error: "An unexpected error occurred during update.",
    };
  }
}

/**
 * Alias for backward compatibility.
 */
export const updateAdminProfileSettings = updateAdminProfile;
