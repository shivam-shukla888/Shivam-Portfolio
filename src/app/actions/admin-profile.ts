"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { adminProfileSchema } from "@/lib/validations/admin-profile";
import { updateAdminProfile } from "@/lib/admin/profile";

export interface AdminProfileActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Server Action to securely update the singleton profile settings.
 * 
 * SECURITY & AUTHORIZATION:
 * 1. Authenticates active session via Supabase Auth.
 * 2. Enforces SHIVSASTRA_ADMIN_USER_ID authorization boundary.
 * 3. Never accepts client-provided IDs for row targeting.
 * 4. Validates inputs server-side with Zod.
 * 5. Updates singleton record via server-side service-role client.
 * 6. Never exposes internal database credentials or SQL stack traces.
 * 7. Revalidates public pages consuming profile settings.
 */
export async function updateProfileSettingsAction(
  prevState: AdminProfileActionState,
  formData: FormData
): Promise<AdminProfileActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  // Extract all 13 supported editable profile fields from form data
  const rawInput = {
    full_name: formData.get("full_name") ?? formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    contra_url: formData.get("contra_url") ?? formData.get("contraUrl"),
    linkedin_url: formData.get("linkedin_url") ?? formData.get("linkedinUrl"),
    github_url: formData.get("github_url") ?? formData.get("githubUrl"),
    instagram_url: formData.get("instagram_url") ?? formData.get("instagramUrl"),
    x_url: formData.get("x_url") ?? formData.get("xUrl"),
    positioning_statement:
      formData.get("positioning_statement") ??
      formData.get("positioningStatement"),
    hero_supporting_text:
      formData.get("hero_supporting_text") ??
      formData.get("heroSupportingText"),
    availability_status:
      formData.get("availability_status") ??
      formData.get("availabilityStatus"),
    about_markdown:
      formData.get("about_markdown") ?? formData.get("aboutMarkdown"),
    contact_instructions:
      formData.get("contact_instructions") ??
      formData.get("contactInstructions"),
  };

  const validation = adminProfileSchema.safeParse(rawInput);

  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, issues] of Object.entries(
      validation.error.flatten().fieldErrors
    )) {
      if (issues && issues.length > 0) {
        fieldErrors[key] = issues;
      }
    }

    return {
      success: false,
      error: "Please correct the highlighted fields below.",
      fieldErrors,
    };
  }

  // Invoke server data access layer passing authenticated user ID
  const result = await updateAdminProfile(validation.data, {
    userId: auth.user.id,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error || "An error occurred while updating profile settings.",
    };
  }

  // Revalidate public routes dependent on profile settings
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");

  return {
    success: true,
    message: "Profile settings successfully saved and published.",
  };
}
