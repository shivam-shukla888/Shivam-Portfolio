import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ProductType =
  | "digital_download"
  | "code_license"
  | "template"
  | "monograph";

export type StoreCategory = "design" | "ai_agents" | "digital_products";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProductRow {
  id: string;
  slug: string;
  release_code: string | null;
  title: string;
  short_description: string | null;
  description: string | null;
  price_in_cents: number | null;
  currency: string | null;
  category: StoreCategory;
  product_type: ProductType;
  features: string[] | null;
  requirements: string | null;
  faq: FaqItem[] | null;
  preview_image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Publicly exposed product data.
 * CRITICAL SECURITY GUARANTEE: storageAssetPath is strictly omitted.
 */
export interface ProductDisplayData {
  id: string;
  slug: string;
  releaseCode: string | null;
  title: string;
  shortDescription: string | null;
  description: string | null;
  priceInCents: number | null;
  currency: string | null;
  category: StoreCategory;
  productType: ProductType;
  features: string[];
  requirements: string | null;
  faq: FaqItem[];
  previewImageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  formattedPrice: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  authorTitle: string | null;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CategoryCounts {
  design: number;
  ai_agents: number;
  digital_products: number;
  total: number;
}

/**
 * Deterministic price formatting helper.
 * Derives output strictly from priceInCents and currency without inventing pricing.
 * Falls back to [PRODUCT PRICE PENDING] if price is null or invalid.
 */
export function formatPrice(
  priceInCents: number | null | undefined,
  currency: string | null | undefined
): string {
  if (
    priceInCents === null ||
    priceInCents === undefined ||
    typeof priceInCents !== "number" ||
    priceInCents < 0
  ) {
    return "[PRODUCT PRICE PENDING]";
  }

  const curr = (currency || "INR").toUpperCase().trim();
  const amount = (priceInCents / 100).toFixed(2);

  switch (curr) {
    case "INR":
      return `₹${amount}`;
    case "USD":
      return `$${amount}`;
    case "EUR":
      return `€${amount}`;
    case "GBP":
      return `£${amount}`;
    default:
      return `${curr} ${amount}`;
  }
}

/**
 * Maps raw database product row to camelCase public ProductDisplayData representation.
 * Explicitly sanitizes and formats pricing.
 */
function mapProduct(row: ProductRow): ProductDisplayData {
  return {
    id: row.id,
    slug: row.slug,
    releaseCode: row.release_code,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    priceInCents: row.price_in_cents,
    currency: row.currency,
    category: row.category || "digital_products",
    productType: row.product_type,
    features: Array.isArray(row.features) ? row.features : [],
    requirements: row.requirements,
    faq: Array.isArray(row.faq) ? row.faq : [],
    previewImageUrl: row.preview_image_url,
    isAvailable: row.is_available,
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    formattedPrice: formatPrice(row.price_in_cents, row.currency),
  };
}

/**
 * Returns a server-side Supabase client for reading active store products.
 * Credentials remain isolated on the server.
 */
function getProductsQueryClient(): SupabaseClient | null {
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

const PUBLIC_PRODUCT_COLUMNS =
  "id, slug, release_code, title, short_description, description, price_in_cents, currency, category, product_type, features, requirements, faq, preview_image_url, is_available, is_featured, sort_order, created_at, updated_at";

export interface StoreProductsOptions {
  limit?: number;
  category?: StoreCategory;
  isFeatured?: boolean;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "featured";
}

/**
 * Fetches available products ordered deterministically.
 * Queries the public view or public columns strictly; never selects storage_asset_path.
 * Gracefully degrades to an empty array if Supabase is unconfigured or unreachable.
 */
export async function getPublishedStoreProducts(
  options?: StoreProductsOptions
): Promise<ProductDisplayData[]> {
  try {
    const client = getProductsQueryClient();
    if (!client) {
      return [];
    }

    let query = client
      .from("public_products")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .eq("is_available", true);

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.isFeatured) {
      query = query.eq("is_featured", true);
    }

    if (options?.search && options.search.trim()) {
      const term = options.search.trim();
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    switch (options?.sort) {
      case "price_asc":
        query = query.order("price_in_cents", { ascending: true }).order("sort_order", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price_in_cents", { ascending: false }).order("sort_order", { ascending: true });
        break;
      case "featured":
        query = query
          .order("is_featured", { ascending: false })
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
        break;
    }

    if (options?.limit && options.limit > 0) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data) {
      // If public_products view fails, fallback to products table public columns
      let fallbackQuery = client
        .from("products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("is_available", true);

      if (options?.category) {
        fallbackQuery = fallbackQuery.eq("category", options.category);
      }
      if (options?.isFeatured) {
        fallbackQuery = fallbackQuery.eq("is_featured", true);
      }
      if (options?.search && options.search.trim()) {
        const term = options.search.trim();
        fallbackQuery = fallbackQuery.or(`title.ilike.%${term}%,description.ilike.%${term}%,short_description.ilike.%${term}%`);
      }

      switch (options?.sort) {
        case "price_asc":
          fallbackQuery = fallbackQuery.order("price_in_cents", { ascending: true }).order("sort_order", { ascending: true });
          break;
        case "price_desc":
          fallbackQuery = fallbackQuery.order("price_in_cents", { ascending: false }).order("sort_order", { ascending: true });
          break;
        case "featured":
          fallbackQuery = fallbackQuery
            .order("is_featured", { ascending: false })
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });
          break;
        case "newest":
        default:
          fallbackQuery = fallbackQuery.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
          break;
      }

      if (options?.limit && options.limit > 0) {
        fallbackQuery = fallbackQuery.limit(options.limit);
      }

      const fallbackResult = await fallbackQuery;
      if (fallbackResult.error || !fallbackResult.data) {
        if (fallbackResult.error) {
          console.error(
            `[STORE DATA] Query failed: ${
              fallbackResult.error.code || fallbackResult.error.message
            }`
          );
        }
        return [];
      }
      return (fallbackResult.data as unknown as ProductRow[]).map(mapProduct);
    }

    return (data as unknown as ProductRow[]).map(mapProduct);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[STORE EXCEPTION] ${message}`);
    return [];
  }
}

/**
 * Resolves a single available product by its slug.
 * Unavailable or non-existent products strictly return null.
 */
export async function getPublishedStoreProductBySlug(
  slug: string
): Promise<ProductDisplayData | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  try {
    const client = getProductsQueryClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client
      .from("public_products")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .eq("slug", slug.trim())
      .eq("is_available", true)
      .maybeSingle();

    if (error || !data) {
      const fallbackResult = await client
        .from("products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("slug", slug.trim())
        .eq("is_available", true)
        .maybeSingle();

      if (fallbackResult.error || !fallbackResult.data) {
        if (fallbackResult.error) {
          console.error(
            `[STORE DATA] Slug query failed: ${
              fallbackResult.error.code || fallbackResult.error.message
            }`
          );
        }
        return null;
      }
      return mapProduct(fallbackResult.data as unknown as ProductRow);
    }

    return mapProduct(data as unknown as ProductRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[STORE EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Resolves a single available product by its UUID or identifier.
 * Unavailable or non-existent products strictly return null.
 */
export async function getPublishedStoreProductById(
  id: string
): Promise<ProductDisplayData | null> {
  if (!id || typeof id !== "string") {
    return null;
  }

  try {
    const client = getProductsQueryClient();
    if (!client) {
      return null;
    }

    // Try finding by UUID id first
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());

    if (isUuid) {
      const { data, error } = await client
        .from("public_products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("id", id.trim())
        .eq("is_available", true)
        .maybeSingle();

      if (!error && data) {
        return mapProduct(data as unknown as ProductRow);
      }

      const fallbackResult = await client
        .from("products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("id", id.trim())
        .eq("is_available", true)
        .maybeSingle();

      if (!fallbackResult.error && fallbackResult.data) {
        return mapProduct(fallbackResult.data as unknown as ProductRow);
      }
    }

    // Fallback search by slug if identifier was provided as slug
    return getPublishedStoreProductBySlug(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[STORE EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Computes live category counts and total available product counts.
 */
export async function getStoreCategoryCounts(): Promise<CategoryCounts> {
  const counts: CategoryCounts = {
    design: 0,
    ai_agents: 0,
    digital_products: 0,
    total: 0,
  };

  try {
    const client = getProductsQueryClient();
    if (!client) return counts;

    const { data, error } = await client
      .from("public_products")
      .select("category")
      .eq("is_available", true);

    if (error || !data) {
      const fallback = await client
        .from("products")
        .select("category")
        .eq("is_available", true);

      if (!fallback.error && fallback.data) {
        for (const row of fallback.data as Array<{ category: StoreCategory }>) {
          if (row.category === "design") counts.design++;
          else if (row.category === "ai_agents") counts.ai_agents++;
          else if (row.category === "digital_products") counts.digital_products++;
          counts.total++;
        }
      }
      return counts;
    }

    for (const row of data as Array<{ category: StoreCategory }>) {
      if (row.category === "design") counts.design++;
      else if (row.category === "ai_agents") counts.ai_agents++;
      else if (row.category === "digital_products") counts.digital_products++;
      counts.total++;
    }

    return counts;
  } catch (err) {
    console.error("[STORE COUNTS EXCEPTION]", err);
    return counts;
  }
}

/**
 * Fetches published reviews for a given product id.
 * Strictly checks is_published = true.
 */
export async function getPublishedProductReviews(
  productId: string
): Promise<ProductReview[]> {
  if (!productId) return [];

  try {
    const client = getProductsQueryClient();
    if (!client) return [];

    const { data, error } = await client
      .from("product_reviews")
      .select("id, product_id, author_name, author_title, rating, content, created_at")
      .eq("product_id", productId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return (data as Array<{
      id: string;
      product_id: string;
      author_name: string;
      author_title: string | null;
      rating: number;
      content: string;
      created_at: string;
    }>).map((r) => ({
      id: r.id,
      productId: r.product_id,
      authorName: r.author_name,
      authorTitle: r.author_title,
      rating: r.rating,
      content: r.content,
      createdAt: r.created_at,
    }));
  } catch (err) {
    console.error("[STORE REVIEWS EXCEPTION]", err);
    return [];
  }
}
