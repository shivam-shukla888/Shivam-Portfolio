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

export const YOJNA_SETU_STORE_ITEM: ProductDisplayData = {
  id: "yojna-setu-agent",
  slug: "yojna-setu",
  releaseCode: "YS-V2",
  title: "Yojna Setu",
  shortDescription:
    "A WhatsApp AI agent for welfare-scheme discovery. Users talk naturally — AI extracts demographic profile attributes, while deterministic Java rules evaluate eligibility over 82 normalized schemes.",
  description:
    "A WhatsApp AI agent for welfare-scheme discovery. Users describe themselves in natural language in conversational Hindi or English — AI extracts demographic attributes, then deterministic Java rules evaluate eligibility over 82 normalized schemes.",
  priceInCents: null,
  currency: null,
  category: "ai_agents",
  productType: "code_license",
  features: [
    "82 normalized schemes (63 Central, 11 State, 8 Philanthropic)",
    "42/42 automated tests passing · 0 Critical findings",
    "Deterministic Java eligibility engine (<1 ms)",
    "Interactive product case study & architecture monograph",
  ],
  requirements: "Java 21, Spring Boot 3.2, PostgreSQL 17, Groq Cloud, Twilio",
  faq: [
    {
      question: "Is this a purchasable store product?",
      answer:
        "No. Yojna Setu is an open architectural case study and agent engineering showcase, not a commercial paid product.",
    },
  ],
  previewImageUrl: "/images/projects/yojna-setu/evidence-whatsapp-discovery.png",
  isAvailable: true,
  isFeatured: true,
  sortOrder: 1,
  createdAt: "2026-09-25T12:00:00Z",
  updatedAt: "2026-09-25T12:00:00Z",
  formattedPrice: "Case Study",
};

/**
 * Authoritative canonical store items.
 * Single source of truth for portfolio showcases represented inside the store.
 */
export const CANONICAL_STORE_PRODUCTS: ProductDisplayData[] = [
  YOJNA_SETU_STORE_ITEM,
];

/**
 * Fetches available products ordered deterministically.
 * Merges canonical store items (Yojna Setu) with live Supabase database products.
 * Queries the public view or public columns strictly; never selects storage_asset_path.
 * Gracefully degrades to canonical items if Supabase is unconfigured or unreachable.
 */
export async function getPublishedStoreProducts(
  options?: StoreProductsOptions
): Promise<ProductDisplayData[]> {
  let products: ProductDisplayData[] = [];

  try {
    const client = getProductsQueryClient();
    if (client) {
      const { data, error } = await client
        .from("public_products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("is_available", true);

      if (!error && data && Array.isArray(data)) {
        products = (data as unknown as ProductRow[]).map(mapProduct);
      } else {
        const fallback = await client
          .from("products")
          .select(PUBLIC_PRODUCT_COLUMNS)
          .eq("is_available", true);

        if (!fallback.error && fallback.data && Array.isArray(fallback.data)) {
          products = (fallback.data as unknown as ProductRow[]).map(mapProduct);
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[STORE EXCEPTION] ${message}`);
  }

  // Merge canonical store items ensuring single source of truth
  for (const canonical of CANONICAL_STORE_PRODUCTS) {
    if (
      canonical.isAvailable &&
      !products.some((p) => p.slug === canonical.slug || p.id === canonical.id)
    ) {
      products.push(canonical);
    }
  }

  // Filter by category
  if (options?.category) {
    products = products.filter((p) => p.category === options.category);
  }

  // Filter by isFeatured
  if (options?.isFeatured) {
    products = products.filter((p) => p.isFeatured);
  }

  // Filter by search query
  if (options?.search && options.search.trim()) {
    const term = options.search.trim().toLowerCase();
    products = products.filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(term);
      const descMatch = p.description?.toLowerCase().includes(term) ?? false;
      const shortDescMatch =
        p.shortDescription?.toLowerCase().includes(term) ?? false;
      const codeMatch = p.releaseCode?.toLowerCase().includes(term) ?? false;
      return titleMatch || descMatch || shortDescMatch || codeMatch;
    });
  }

  // Deterministic sorting
  switch (options?.sort) {
    case "price_asc":
      products.sort((a, b) => (a.priceInCents ?? 0) - (b.priceInCents ?? 0));
      break;
    case "price_desc":
      products.sort((a, b) => (b.priceInCents ?? 0) - (a.priceInCents ?? 0));
      break;
    case "featured":
      products.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) {
          return a.sortOrder - b.sortOrder;
        }
        return a.isFeatured ? -1 : 1;
      });
      break;
    case "newest":
    default:
      products.sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      break;
  }

  // Limit
  if (options?.limit && options.limit > 0) {
    products = products.slice(0, options.limit);
  }

  return products;
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

  const trimmedSlug = slug.trim();
  const canonical = CANONICAL_STORE_PRODUCTS.find(
    (p) => p.slug === trimmedSlug && p.isAvailable
  );
  if (canonical) {
    return canonical;
  }

  try {
    const client = getProductsQueryClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client
      .from("public_products")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .eq("slug", trimmedSlug)
      .eq("is_available", true)
      .maybeSingle();

    if (error || !data) {
      const fallbackResult = await client
        .from("products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("slug", trimmedSlug)
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

  const trimmedId = id.trim();
  const canonical = CANONICAL_STORE_PRODUCTS.find(
    (p) => (p.id === trimmedId || p.slug === trimmedId) && p.isAvailable
  );
  if (canonical) {
    return canonical;
  }

  try {
    const client = getProductsQueryClient();
    if (!client) {
      return null;
    }

    // Try finding by UUID id first
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmedId);

    if (isUuid) {
      const { data, error } = await client
        .from("public_products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("id", trimmedId)
        .eq("is_available", true)
        .maybeSingle();

      if (!error && data) {
        return mapProduct(data as unknown as ProductRow);
      }

      const fallbackResult = await client
        .from("products")
        .select(PUBLIC_PRODUCT_COLUMNS)
        .eq("id", trimmedId)
        .eq("is_available", true)
        .maybeSingle();

      if (!fallbackResult.error && fallbackResult.data) {
        return mapProduct(fallbackResult.data as unknown as ProductRow);
      }
    }

    // Fallback search by slug if identifier was provided as slug
    return getPublishedStoreProductBySlug(trimmedId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[STORE EXCEPTION] ${message}`);
    return null;
  }
}

/**
 * Computes live category counts and total available product counts.
 * Derives counts directly from the authoritative store product catalog.
 */
export async function getStoreCategoryCounts(): Promise<CategoryCounts> {
  try {
    const products = await getPublishedStoreProducts();
    return {
      design: products.filter((p) => p.category === "design").length,
      ai_agents: products.filter((p) => p.category === "ai_agents").length,
      digital_products: products.filter((p) => p.category === "digital_products").length,
      total: products.length,
    };
  } catch (err) {
    console.error("[STORE COUNTS EXCEPTION]", err);
    return {
      design: 0,
      ai_agents: 0,
      digital_products: 0,
      total: 0,
    };
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
