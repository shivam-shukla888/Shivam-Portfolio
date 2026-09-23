if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin, isAuthorizedAdminUser } from "@/lib/auth";
import {
  adminProductSchema,
  ProductType,
  StoreCategory,
} from "@/lib/validations/admin-product";
import { formatPrice, FaqItem } from "@/lib/products";

export interface AdminProductRecord {
  id: string;
  slug: string;
  release_code: string | null;
  title: string;
  short_description: string | null;
  description: string | null;
  price_in_cents: number;
  currency: string;
  category: StoreCategory;
  product_type: ProductType;
  features: string[];
  requirements: string | null;
  faq: FaqItem[];
  preview_image_url: string | null;
  storage_asset_path: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;

  // CamelCase aliases
  releaseCode: string | null;
  shortDescription: string | null;
  priceInCents: number;
  productType: ProductType;
  previewImageUrl: string | null;
  storageAssetPath: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  formattedPrice: string;
}

interface RawProductRow {
  id: string;
  slug: string;
  release_code: string | null;
  title: string;
  short_description: string | null;
  description: string | null;
  price_in_cents: number;
  currency: string;
  category: StoreCategory;
  product_type: ProductType;
  features: string[] | null;
  requirements: string | null;
  faq: FaqItem[] | null;
  preview_image_url: string | null;
  storage_asset_path: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const PRODUCT_COLUMNS =
  "id, slug, release_code, title, short_description, description, price_in_cents, currency, category, product_type, features, requirements, faq, preview_image_url, storage_asset_path, is_available, is_featured, sort_order, created_at, updated_at";

function mapRawProductRow(row: RawProductRow): AdminProductRecord {
  return {
    id: row.id,
    slug: row.slug,
    release_code: row.release_code,
    title: row.title,
    short_description: row.short_description,
    description: row.description,
    price_in_cents: row.price_in_cents,
    currency: row.currency,
    category: row.category || "digital_products",
    product_type: row.product_type,
    features: Array.isArray(row.features) ? row.features : [],
    requirements: row.requirements,
    faq: Array.isArray(row.faq) ? row.faq : [],
    preview_image_url: row.preview_image_url,
    storage_asset_path: row.storage_asset_path,
    is_available: Boolean(row.is_available),
    is_featured: Boolean(row.is_featured),
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: row.created_at,
    updated_at: row.updated_at,

    // CamelCase aliases
    releaseCode: row.release_code,
    shortDescription: row.short_description,
    priceInCents: row.price_in_cents,
    productType: row.product_type,
    previewImageUrl: row.preview_image_url,
    storageAssetPath: row.storage_asset_path,
    isAvailable: Boolean(row.is_available),
    isFeatured: Boolean(row.is_featured),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    formattedPrice: formatPrice(row.price_in_cents, row.currency),
  };
}

/**
 * Evaluates caller authorization. Fails closed.
 */
async function checkAdminAuthorization(userId?: string): Promise<boolean> {
  if (userId) {
    return isAuthorizedAdminUser(userId);
  }
  const auth = await getAuthenticatedAdmin();
  return auth.isAuthenticated && auth.isAuthorized;
}

/**
 * Retrieves all administrative product records (available and unavailable),
 * ordered deterministically by sort_order ASC, then created_at DESC.
 */
export async function getAdminProducts(options?: {
  userId?: string;
  client?: unknown;
}): Promise<AdminProductRecord[]> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN PRODUCT DATA] Query error: ${error.message}`);
      }
      return [];
    }

    return (data as RawProductRow[]).map(mapRawProductRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PRODUCT EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Retrieves a single product by ID for administrative editing.
 */
export async function getAdminProduct(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<AdminProductRecord | null> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return null;
  }

  if (!id || typeof id !== "string") {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(`[ADMIN PRODUCT DATA] Query error: ${error.message}`);
      }
      return null;
    }

    return mapRawProductRow(data as RawProductRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PRODUCT EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Creates a new product in public.products.
 * Server-only execution; validates input and enforces slug uniqueness.
 */
export async function createAdminProduct(
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProductRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  const validation = adminProductSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed. Please correct the invalid fields.",
    };
  }
  const validData = validation.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    // Slug uniqueness check
    const { data: existingSlug } = await client
      .from("products")
      .select("id")
      .eq("slug", validData.slug)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: "That product slug is already in use.",
      };
    }

    const payload = {
      slug: validData.slug,
      release_code: validData.release_code,
      title: validData.title,
      short_description: validData.short_description,
      description: validData.description,
      price_in_cents: validData.price_in_cents,
      currency: validData.currency,
      category: validData.category,
      product_type: validData.product_type,
      features: validData.features,
      requirements: validData.requirements,
      faq: validData.faq,
      preview_image_url: validData.preview_image_url,
      storage_asset_path: validData.storage_asset_path,
      is_available: validData.is_available,
      is_featured: validData.is_featured,
      sort_order: validData.sort_order,
    };

    const { data, error } = await client
      .from("products")
      .insert(payload)
      .select(PRODUCT_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That product slug is already in use." };
      }
      const msg = error ? error.message : "No row inserted.";
      console.error(`[ADMIN PRODUCT CREATE ERROR] ${msg}`);
      return { success: false, error: "Failed to create product." };
    }

    try {
      revalidatePath("/admin/store");
      revalidatePath("/store");
      revalidatePath("/store/design");
      revalidatePath("/store/ai-agents");
      revalidatePath("/store/digital-products");
      revalidatePath(`/store/${validData.slug}`);
      revalidatePath("/");
    } catch {
      // Revalidation may be skipped in test contexts
    }

    return { success: true, data: mapRawProductRow(data as RawProductRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PRODUCT CREATE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to create product." };
  }
}

/**
 * Updates an existing product in public.products.
 */
export async function updateAdminProduct(
  id: string,
  input: unknown,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProductRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid product identifier." };
  }

  const validation = adminProductSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed. Please correct the invalid fields.",
    };
  }
  const validData = validation.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    // Check if product exists
    const { data: currentProduct, error: fetchError } = await client
      .from("products")
      .select("id, slug")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !currentProduct) {
      return { success: false, error: "Product not found." };
    }

    // Slug collision check
    if (validData.slug !== currentProduct.slug) {
      const { data: collision } = await client
        .from("products")
        .select("id")
        .eq("slug", validData.slug)
        .neq("id", id)
        .maybeSingle();

      if (collision) {
        return {
          success: false,
          error: "That product slug is already in use by another edition.",
        };
      }
    }

    const payload = {
      slug: validData.slug,
      release_code: validData.release_code,
      title: validData.title,
      short_description: validData.short_description,
      description: validData.description,
      price_in_cents: validData.price_in_cents,
      currency: validData.currency,
      category: validData.category,
      product_type: validData.product_type,
      features: validData.features,
      requirements: validData.requirements,
      faq: validData.faq,
      preview_image_url: validData.preview_image_url,
      storage_asset_path: validData.storage_asset_path,
      is_available: validData.is_available,
      is_featured: validData.is_featured,
      sort_order: validData.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from("products")
      .update(payload)
      .eq("id", id)
      .select(PRODUCT_COLUMNS)
      .single();

    if (error || !data) {
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        return { success: false, error: "That product slug is already in use." };
      }
      const msg = error ? error.message : "No row returned.";
      console.error(`[ADMIN PRODUCT UPDATE ERROR] ${msg}`);
      return { success: false, error: "Failed to update product." };
    }

    try {
      revalidatePath("/admin/store");
      revalidatePath("/store");
      revalidatePath("/store/design");
      revalidatePath("/store/ai-agents");
      revalidatePath("/store/digital-products");
      revalidatePath(`/store/${currentProduct.slug}`);
      if (validData.slug !== currentProduct.slug) {
        revalidatePath(`/store/${validData.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true, data: mapRawProductRow(data as RawProductRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PRODUCT UPDATE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to update product." };
  }
}

/**
 * Permanently deletes a product from public.products.
 */
export async function deleteAdminProduct(
  id: string,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid product identifier." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const { data: targetProduct } = await client
      .from("products")
      .select("id, slug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await client.from("products").delete().eq("id", id);

    if (error) {
      console.error(`[ADMIN PRODUCT DELETE ERROR] ${error.message}`);
      return { success: false, error: "Failed to delete product." };
    }

    try {
      revalidatePath("/admin/store");
      revalidatePath("/store");
      revalidatePath("/store/design");
      revalidatePath("/store/ai-agents");
      revalidatePath("/store/digital-products");
      if (targetProduct?.slug) {
        revalidatePath(`/store/${targetProduct.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PRODUCT DELETE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to delete product." };
  }
}

/**
 * Toggles product availability between active (available) and inactive (unavailable).
 */
export async function toggleProductAvailability(
  id: string,
  isAvailable: boolean,
  options?: { userId?: string; client?: unknown }
): Promise<{ success: boolean; data?: AdminProductRecord; error?: string }> {
  const isAuthorized = await checkAdminAuthorization(options?.userId);
  if (!isAuthorized) {
    return {
      success: false,
      error: "Access denied. You are not authorized to perform this operation.",
    };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid product identifier." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = options?.client ?? getSupabaseServerClient();
  if (!client) {
    return {
      success: false,
      error: "Database service unavailable.",
    };
  }

  try {
    const { data, error } = await client
      .from("products")
      .update({
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(PRODUCT_COLUMNS)
      .single();

    if (error || !data) {
      const msg = error ? error.message : "No row returned.";
      console.error(`[ADMIN PRODUCT TOGGLE ERROR] ${msg}`);
      return { success: false, error: "Failed to update availability status." };
    }

    try {
      revalidatePath("/admin/store");
      revalidatePath("/store");
      revalidatePath("/store/design");
      revalidatePath("/store/ai-agents");
      revalidatePath("/store/digital-products");
      if (data.slug) {
        revalidatePath(`/store/${data.slug}`);
      }
      revalidatePath("/");
    } catch {
      // Skip revalidation in test contexts
    }

    return { success: true, data: mapRawProductRow(data as RawProductRow) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[ADMIN PRODUCT TOGGLE EXCEPTION] ${message}`);
    return { success: false, error: "Failed to update availability status." };
  }
}
