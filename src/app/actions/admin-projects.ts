"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { adminProjectSchema } from "@/lib/validations/admin-project";
import {
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  toggleProjectPublish,
  getAdminProject,
  type AdminProjectRecord,
} from "@/lib/admin/projects";

export interface AdminProjectActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: AdminProjectRecord;
}

function parseProjectFormData(formData: FormData): Record<string, unknown> {
  const isFeatured = formData.get("is_featured");
  const publishIntent = formData.get("publish_intent");
  let publishedAt: string | null = null;

  if (publishIntent === "publish") {
    publishedAt = new Date().toISOString();
  } else if (publishIntent === "unpublish") {
    publishedAt = null;
  } else if (formData.has("published_at")) {
    const rawPub = formData.get("published_at");
    publishedAt = rawPub ? String(rawPub) : null;
  }

  return {
    slug: formData.get("slug"),
    title: formData.get("title"),
    edition_code: formData.get("edition_code"),
    summary: formData.get("summary"),
    case_study_markdown: formData.get("case_study_markdown"),
    cover_image_url: formData.get("cover_image_url"),
    category: formData.get("category"),
    tech_stack: formData.get("tech_stack"),
    project_year: formData.get("project_year"),
    live_url: formData.get("live_url"),
    github_url: formData.get("github_url"),
    is_featured: isFeatured === "on" || isFeatured === "true" || isFeatured === "1",
    sort_order: formData.get("sort_order"),
    published_at: publishedAt,
  };
}

/**
 * Server Action: Create Project
 */
export async function createProjectAction(
  prevState: AdminProjectActionState,
  formData: FormData
): Promise<AdminProjectActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const rawInput = parseProjectFormData(formData);
  const validation = adminProjectSchema.safeParse(rawInput);

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

  const result = await createAdminProject(validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while creating project.",
    };
  }

  // Revalidate public and admin project lists and project detail
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");

  return {
    success: true,
    message: "Project successfully created.",
    data: result.data,
  };
}

/**
 * Server Action: Update Project
 */
export async function updateProjectAction(
  id: string,
  prevState: AdminProjectActionState,
  formData: FormData
): Promise<AdminProjectActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  // Fetch current project to track slug changes for revalidation
  const currentProject = await getAdminProject(id, { userId: auth.user.id });

  const rawInput = parseProjectFormData(formData);
  const validation = adminProjectSchema.safeParse(rawInput);

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

  const result = await updateAdminProject(id, validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while updating project.",
    };
  }

  // Revalidate public and admin routes
  revalidatePath("/");
  revalidatePath("/projects");
  if (currentProject && currentProject.slug !== result.data.slug) {
    revalidatePath(`/projects/${currentProject.slug}`);
  }
  revalidatePath(`/projects/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);

  return {
    success: true,
    message: "Project successfully updated.",
    data: result.data,
  };
}

/**
 * Server Action: Delete Project
 */
export async function deleteProjectAction(
  id: string
): Promise<AdminProjectActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentProject = await getAdminProject(id, { userId: auth.user.id });

  const result = await deleteAdminProject(id, { userId: auth.user.id });

  if (!result.success) {
    return {
      success: false,
      error: result.error || "An error occurred while deleting project.",
    };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  if (currentProject?.slug) {
    revalidatePath(`/projects/${currentProject.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/projects");

  return {
    success: true,
    message: "Project successfully deleted.",
  };
}

/**
 * Server Action: Publish Project
 */
export async function publishProjectAction(
  id: string
): Promise<AdminProjectActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await toggleProjectPublish(id, true, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to publish project.",
    };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);

  return {
    success: true,
    message: "Project published successfully.",
    data: result.data,
  };
}

/**
 * Server Action: Unpublish Project
 */
export async function unpublishProjectAction(
  id: string
): Promise<AdminProjectActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await toggleProjectPublish(id, false, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to unpublish project.",
    };
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);

  return {
    success: true,
    message: "Project unpublished successfully.",
    data: result.data,
  };
}
