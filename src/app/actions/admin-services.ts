"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { adminServiceSchema } from "@/lib/validations/admin-service";
import {
  createAdminService,
  updateAdminService,
  deleteAdminService,
  toggleServiceActive,
  getAdminService,
  type AdminServiceRecord,
} from "@/lib/admin/services";

export interface AdminServiceActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: AdminServiceRecord;
}

function parseServiceFormData(formData: FormData): Record<string, unknown> {
  const activationIntent = formData.get("activation_intent");
  const rawActive = formData.get("is_active");
  let isActive = rawActive === "on" || rawActive === "true" || rawActive === "1";

  if (activationIntent === "activate") {
    isActive = true;
  } else if (activationIntent === "deactivate") {
    isActive = false;
  }

  return {
    slug: formData.get("slug"),
    title: formData.get("title"),
    program_code: formData.get("program_code"),
    summary: formData.get("summary"),
    description_markdown: formData.get("description_markdown"),
    engagement_model: formData.get("engagement_model"),
    deliverables: formData.get("deliverables"),
    is_active: isActive,
    sort_order: formData.get("sort_order"),
  };
}

/**
 * Server Action: Create Service
 */
export async function createServiceAction(
  prevState: AdminServiceActionState,
  formData: FormData
): Promise<AdminServiceActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const rawInput = parseServiceFormData(formData);
  const validation = adminServiceSchema.safeParse(rawInput);

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

  const result = await createAdminService(validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while creating service.",
    };
  }

  // Revalidate public and admin paths
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/services/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/services");

  return {
    success: true,
    message: "Service program successfully created.",
    data: result.data,
  };
}

/**
 * Server Action: Update Service
 */
export async function updateServiceAction(
  id: string,
  prevState: AdminServiceActionState,
  formData: FormData
): Promise<AdminServiceActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentService = await getAdminService(id, { userId: auth.user.id });

  const rawInput = parseServiceFormData(formData);
  const validation = adminServiceSchema.safeParse(rawInput);

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

  const result = await updateAdminService(id, validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while updating service.",
    };
  }

  // Revalidate routes
  revalidatePath("/");
  revalidatePath("/services");
  if (currentService && currentService.slug !== result.data.slug) {
    revalidatePath(`/services/${currentService.slug}`);
  }
  revalidatePath(`/services/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/edit`);

  return {
    success: true,
    message: "Service program successfully updated.",
    data: result.data,
  };
}

/**
 * Server Action: Delete Service
 */
export async function deleteServiceAction(
  id: string
): Promise<AdminServiceActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentService = await getAdminService(id, { userId: auth.user.id });

  const result = await deleteAdminService(id, { userId: auth.user.id });

  if (!result.success) {
    return {
      success: false,
      error: result.error || "An error occurred while deleting service.",
    };
  }

  revalidatePath("/");
  revalidatePath("/services");
  if (currentService?.slug) {
    revalidatePath(`/services/${currentService.slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/services");

  return {
    success: true,
    message: "Service program successfully deleted.",
  };
}

/**
 * Server Action: Activate Service
 */
export async function activateServiceAction(
  id: string
): Promise<AdminServiceActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await toggleServiceActive(id, true, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to activate service.",
    };
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/services/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/edit`);

  return {
    success: true,
    message: "Service activated successfully.",
    data: result.data,
  };
}

/**
 * Server Action: Deactivate Service
 */
export async function deactivateServiceAction(
  id: string
): Promise<AdminServiceActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await toggleServiceActive(id, false, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to deactivate service.",
    };
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/services/${result.data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}/edit`);

  return {
    success: true,
    message: "Service deactivated successfully.",
    data: result.data,
  };
}
