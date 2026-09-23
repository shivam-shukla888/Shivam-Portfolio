"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { adminLabSchema } from "@/lib/validations/admin-lab";
import {
  createAdminLabEntry,
  updateAdminLabEntry,
  deleteAdminLabEntry,
  publishAdminLabEntry,
  unpublishAdminLabEntry,
  getAdminLabEntry,
  type AdminLabEntryRecord,
} from "@/lib/admin/lab";

export interface AdminLabActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: AdminLabEntryRecord;
}

function parseLabFormData(formData: FormData): Record<string, unknown> {
  const publishIntent = formData.get("publish_intent");
  const rawPublic = formData.get("is_public");
  let isPublic = rawPublic === "on" || rawPublic === "true" || rawPublic === "1";
  let publishedAt = formData.get("published_at") as string | null;

  if (publishIntent === "publish") {
    isPublic = true;
    publishedAt = new Date().toISOString();
  } else if (publishIntent === "unpublish") {
    isPublic = false;
    publishedAt = null;
  }

  return {
    slug: formData.get("slug"),
    category: formData.get("category"),
    title: formData.get("title"),
    content_markdown: formData.get("content_markdown"),
    tags: formData.get("tags"),
    status: formData.get("status"),
    is_public: isPublic,
    published_at: publishedAt,
  };
}

/**
 * Server Action: Create Personal Lab Entry
 */
export async function createLabEntryAction(
  prevState: AdminLabActionState,
  formData: FormData
): Promise<AdminLabActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const rawInput = parseLabFormData(formData);
  const validation = adminLabSchema.safeParse(rawInput);

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

  const result = await createAdminLabEntry(validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while creating lab artifact.",
    };
  }

  // Revalidate public and admin paths
  revalidatePath("/");
  revalidatePath("/lab");
  revalidatePath(`/lab/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/lab");

  return {
    success: true,
    message: "Personal Lab artifact successfully created.",
    data: result.data,
  };
}

/**
 * Server Action: Update Personal Lab Entry
 */
export async function updateLabEntryAction(
  id: string,
  prevState: AdminLabActionState,
  formData: FormData
): Promise<AdminLabActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentEntry = await getAdminLabEntry(id, { userId: auth.user.id });

  const rawInput = parseLabFormData(formData);
  const validation = adminLabSchema.safeParse(rawInput);

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

  const result = await updateAdminLabEntry(id, validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while updating lab artifact.",
    };
  }

  // Revalidate routes
  revalidatePath("/");
  revalidatePath("/lab");
  if (currentEntry && currentEntry.slug !== result.data.slug) {
    revalidatePath(`/lab/${currentEntry.slug}`);
  }
  revalidatePath(`/lab/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/lab");
  revalidatePath(`/admin/lab/${id}/edit`);

  return {
    success: true,
    message: "Personal Lab artifact successfully updated.",
    data: result.data,
  };
}

/**
 * Server Action: Delete Personal Lab Entry
 */
export async function deleteLabEntryAction(
  id: string
): Promise<AdminLabActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentEntry = await getAdminLabEntry(id, { userId: auth.user.id });

  const result = await deleteAdminLabEntry(id, { userId: auth.user.id });

  if (!result.success) {
    return {
      success: false,
      error: result.error || "An error occurred while deleting lab artifact.",
    };
  }

  revalidatePath("/");
  revalidatePath("/lab");
  if (currentEntry?.slug) {
    revalidatePath(`/lab/${currentEntry.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/lab");

  return {
    success: true,
    message: "Personal Lab artifact permanently deleted.",
  };
}

/**
 * Server Action: Publish Lab Entry
 */
export async function publishLabEntryAction(
  id: string
): Promise<AdminLabActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await publishAdminLabEntry(id, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to publish lab entry.",
    };
  }

  revalidatePath("/");
  revalidatePath("/lab");
  revalidatePath(`/lab/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/lab");
  revalidatePath(`/admin/lab/${id}/edit`);

  return {
    success: true,
    message: "Lab entry published successfully.",
    data: result.data,
  };
}

/**
 * Server Action: Unpublish Lab Entry
 */
export async function unpublishLabEntryAction(
  id: string
): Promise<AdminLabActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await unpublishAdminLabEntry(id, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to unpublish lab entry.",
    };
  }

  revalidatePath("/");
  revalidatePath("/lab");
  revalidatePath(`/lab/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/lab");
  revalidatePath(`/admin/lab/${id}/edit`);

  return {
    success: true,
    message: "Lab entry unpublished successfully.",
    data: result.data,
  };
}
