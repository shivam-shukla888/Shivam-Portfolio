"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { adminProductSchema } from "@/lib/validations/admin-product";
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductAvailability,
  getAdminProduct,
  type AdminProductRecord,
} from "@/lib/admin/products";

export interface AdminProductActionState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: AdminProductRecord;
}

function parseProductFormData(formData: FormData): Record<string, unknown> {
  const availabilityIntent = formData.get("availability_intent");
  const rawAvailable = formData.get("is_available");
  let isAvailable = rawAvailable === "on" || rawAvailable === "true" || rawAvailable === "1";

  if (availabilityIntent === "available") {
    isAvailable = true;
  } else if (availabilityIntent === "unavailable") {
    isAvailable = false;
  }

  const rawFeatured = formData.get("is_featured");
  const isFeatured = rawFeatured === "on" || rawFeatured === "true" || rawFeatured === "1";

  return {
    slug: formData.get("slug"),
    release_code: formData.get("release_code"),
    title: formData.get("title"),
    short_description: formData.get("short_description"),
    description: formData.get("description"),
    price_in_cents: formData.get("price_in_cents"),
    currency: formData.get("currency") || "INR",
    category: formData.get("category") || "digital_products",
    product_type: formData.get("product_type"),
    features: formData.get("features"),
    requirements: formData.get("requirements"),
    faq: formData.get("faq"),
    preview_image_url: formData.get("preview_image_url"),
    storage_asset_path: formData.get("storage_asset_path"),
    is_available: isAvailable,
    is_featured: isFeatured,
    sort_order: formData.get("sort_order"),
  };
}

const revalidateAllStorePaths = (slug?: string) => {
  try {
    revalidatePath("/");
    revalidatePath("/store");
    revalidatePath("/store/design");
    revalidatePath("/store/ai-agents");
    revalidatePath("/store/digital-products");
    if (slug) {
      revalidatePath(`/store/${slug}`);
    }
    revalidatePath("/admin");
    revalidatePath("/admin/store");
  } catch {
    // Revalidation may be skipped in non-web contexts
  }
};

/**
 * Server Action: Create Product
 */
export async function createProductAction(
  prevState: AdminProductActionState,
  formData: FormData
): Promise<AdminProductActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const rawInput = parseProductFormData(formData);
  const validation = adminProductSchema.safeParse(rawInput);

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

  const result = await createAdminProduct(validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while creating product release.",
    };
  }

  revalidateAllStorePaths(result.data.slug);

  return {
    success: true,
    message: "Product edition successfully created.",
    data: result.data,
  };
}

/**
 * Server Action: Update Product
 */
export async function updateProductAction(
  id: string,
  prevState: AdminProductActionState,
  formData: FormData
): Promise<AdminProductActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentProduct = await getAdminProduct(id, { userId: auth.user.id });

  const rawInput = parseProductFormData(formData);
  const validation = adminProductSchema.safeParse(rawInput);

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

  const result = await updateAdminProduct(id, validation.data, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "An error occurred while updating product release.",
    };
  }

  if (currentProduct && currentProduct.slug !== result.data.slug) {
    revalidateAllStorePaths(currentProduct.slug);
  }
  revalidateAllStorePaths(result.data.slug);
  try {
    revalidatePath(`/admin/store/${id}/edit`);
  } catch {
    // Ignore in non-web
  }

  return {
    success: true,
    message: "Product edition successfully updated.",
    data: result.data,
  };
}

/**
 * Server Action: Delete Product
 */
export async function deleteProductAction(
  id: string
): Promise<AdminProductActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const currentProduct = await getAdminProduct(id, { userId: auth.user.id });

  const result = await deleteAdminProduct(id, { userId: auth.user.id });

  if (!result.success) {
    return {
      success: false,
      error: result.error || "An error occurred while deleting product release.",
    };
  }

  revalidateAllStorePaths(currentProduct?.slug);

  return {
    success: true,
    message: "Product edition permanently deleted.",
  };
}

/**
 * Server Action: Make Product Available
 */
export async function makeProductAvailableAction(
  id: string
): Promise<AdminProductActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await toggleProductAvailability(id, true, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to make product available.",
    };
  }

  revalidateAllStorePaths(result.data.slug);
  try {
    revalidatePath(`/admin/store/${id}/edit`);
  } catch {
    // Ignore in non-web
  }

  return {
    success: true,
    message: "Product is now available in public store.",
    data: result.data,
  };
}

/**
 * Server Action: Make Product Unavailable
 */
export async function makeProductUnavailableAction(
  id: string
): Promise<AdminProductActionState> {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthenticated || !auth.isAuthorized || !auth.user) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const result = await toggleProductAvailability(id, false, {
    userId: auth.user.id,
  });

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || "Failed to make product unavailable.",
    };
  }

  revalidateAllStorePaths(result.data.slug);
  try {
    revalidatePath(`/admin/store/${id}/edit`);
  } catch {
    // Ignore in non-web
  }

  return {
    success: true,
    message: "Product made unavailable from public store.",
    data: result.data,
  };
}
