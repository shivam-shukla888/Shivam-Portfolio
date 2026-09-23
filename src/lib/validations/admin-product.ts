import { z } from "zod";

/**
 * Preprocessor that trims strings and normalizes empty or whitespace-only values to null.
 */
export const emptyStringToNull = (val: unknown): string | null => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length === 0 ? null : trimmed;
  }
  return val === undefined || val === null ? null : String(val).trim() || null;
};

/**
 * Normalizes boolean inputs from forms (e.g. "on", "true", true, 1).
 */
export const normalizeBoolean = (val: unknown): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    const lower = val.trim().toLowerCase();
    return lower === "true" || lower === "on" || lower === "1";
  }
  if (typeof val === "number") return val === 1;
  return false;
};

export const PRODUCT_TYPES = [
  "digital_download",
  "code_license",
  "template",
  "monograph",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export const STORE_CATEGORIES = [
  "design",
  "ai_agents",
  "digital_products",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export const RESERVED_STORE_SLUGS = [
  "design",
  "ai-agents",
  "digital-products",
  "store",
  "new",
  "admin",
] as const;

/**
 * Parses features list from array, JSON string, or newline-delimited string.
 */
export const normalizeFeatures = (val: unknown): string[] => {
  if (Array.isArray(val)) {
    return val.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      return val
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }
  return [];
};

/**
 * Parses FAQ entries array from JSON or object array.
 */
export const normalizeFaq = (
  val: unknown
): Array<{ question: string; answer: string }> => {
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          const q = String((item as { question?: unknown }).question || "").trim();
          const a = String((item as { answer?: unknown }).answer || "").trim();
          if (q && a) return { question: q, answer: a };
        }
        return null;
      })
      .filter((x): x is { question: string; answer: string } => x !== null);
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return normalizeFaq(parsed);
      }
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Normalizes input object to support both snake_case and camelCase field names.
 */
export const normalizeAdminProductInput = (raw: unknown): Record<string, unknown> => {
  if (typeof raw !== "object" || raw === null) return {};
  const obj = raw as Record<string, unknown>;
  return {
    slug: obj.slug,
    release_code: obj.release_code ?? obj.releaseCode,
    title: obj.title,
    short_description: obj.short_description ?? obj.shortDescription,
    description: obj.description,
    price_in_cents: obj.price_in_cents ?? obj.priceInCents,
    currency: obj.currency ?? "INR",
    category: obj.category ?? "digital_products",
    product_type: obj.product_type ?? obj.productType,
    features: obj.features,
    requirements: obj.requirements,
    faq: obj.faq,
    preview_image_url: obj.preview_image_url ?? obj.previewImageUrl,
    storage_asset_path: obj.storage_asset_path ?? obj.storageAssetPath,
    is_available: obj.is_available ?? obj.isAvailable,
    is_featured: obj.is_featured ?? obj.isFeatured,
    sort_order: obj.sort_order ?? obj.sortOrder,
  };
};

/**
 * Base Zod validation schema for administrative product catalog records.
 */
export const adminProductBaseSchema = z.object({
  slug: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Product slug is required.")
        .min(2, "Product slug must be at least 2 characters.")
        .max(100, "Product slug cannot exceed 100 characters.")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen."
        )
        .refine((val) => !/[<>]/.test(val), "Slug cannot contain HTML characters.")
        .refine(
          (val) => !RESERVED_STORE_SLUGS.includes(val.toLowerCase() as unknown as (typeof RESERVED_STORE_SLUGS)[number]),
          "That slug is reserved for store category navigation."
        )
    ),

  release_code: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(50, "Release code cannot exceed 50 characters.")
        .refine((val) => !/[<>]/.test(val), "Release code cannot contain HTML characters.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  title: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Product title is required.")
        .min(2, "Product title must be at least 2 characters.")
        .max(160, "Product title cannot exceed 160 characters.")
        .refine((val) => !/[<>]/.test(val), "Product title cannot contain HTML characters.")
    ),

  short_description: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(300, "Short description cannot exceed 300 characters.")
        .refine((val) => !/[<>]/.test(val), "Short description cannot contain HTML markup.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  description: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(5000, "Description cannot exceed 5000 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited in product description."
        )
        .refine((val) => !/[<>]/.test(val), "Description cannot contain HTML markup.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  price_in_cents: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") {
        return NaN;
      }
      const num = Number(val);
      return num;
    },
    z
      .number("Price in cents is required.")
      .refine((val) => !isNaN(val), "Price must be a valid number.")
      .refine((val) => Number.isInteger(val), "Price in cents must be an integer without decimals.")
      .refine((val) => val >= 0, "Price in cents cannot be negative.")
      .refine((val) => val <= 100_000_000, "Price in cents exceeds maximum permitted bound.")
  ),

  currency: z
    .preprocess(
      (val) => (typeof val === "string" ? val.trim().toUpperCase() : "INR"),
      z.literal("INR", {
        error: "Only INR currency is currently supported by the studio store.",
      })
    )
    .default("INR"),

  category: z
    .enum(STORE_CATEGORIES, {
      error: "Category must be one of: design, ai_agents, digital_products.",
    })
    .default("digital_products"),

  product_type: z.enum(PRODUCT_TYPES, {
    error: "Product type must be one of: digital_download, code_license, template, monograph.",
  }),

  features: z
    .preprocess(
      normalizeFeatures,
      z
        .array(
          z
            .string()
            .max(200, "Feature item cannot exceed 200 characters.")
            .refine((val) => !/[<>]/.test(val), "Feature item cannot contain HTML characters.")
        )
        .max(20, "Features list cannot exceed 20 items.")
    )
    .default([]),

  requirements: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(2000, "Requirements cannot exceed 2000 characters.")
        .refine((val) => !/<script\b/i.test(val), "Script execution is prohibited in requirements.")
        .refine((val) => !/[<>]/.test(val), "Requirements cannot contain HTML characters.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  faq: z
    .preprocess(
      normalizeFaq,
      z
        .array(
          z.object({
            question: z
              .string()
              .min(2, "FAQ question must be at least 2 characters.")
              .max(200, "FAQ question cannot exceed 200 characters.")
              .refine((val) => !/[<>]/.test(val), "FAQ question cannot contain HTML characters."),
            answer: z
              .string()
              .min(2, "FAQ answer must be at least 2 characters.")
              .max(1000, "FAQ answer cannot exceed 1000 characters.")
              .refine((val) => !/[<>]/.test(val), "FAQ answer cannot contain HTML characters."),
          })
        )
        .max(10, "FAQ list cannot exceed 10 items.")
    )
    .default([]),

  preview_image_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(1000, "Preview image URL cannot exceed 1000 characters.")
        .refine((val) => {
          try {
            const parsed = new URL(val);
            return parsed.protocol === "https:";
          } catch {
            return false;
          }
        }, "Preview image URL must be a valid secure HTTPS URL.")
        .refine(
          (val) =>
            !val.toLowerCase().startsWith("javascript:") &&
            !val.toLowerCase().startsWith("data:") &&
            !val.toLowerCase().startsWith("blob:") &&
            !val.toLowerCase().startsWith("http:"),
          "Insecure or executable URL protocols are strictly rejected."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  storage_asset_path: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "Storage asset path cannot exceed 500 characters.")
        .refine((val) => !/[<>]/.test(val), "Storage asset path cannot contain HTML characters.")
        .refine(
          (val) => !/<script\b/i.test(val),
          "Script execution is prohibited in storage asset path."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  is_available: z.preprocess(normalizeBoolean, z.boolean()).default(true),

  is_featured: z.preprocess(normalizeBoolean, z.boolean()).default(false),

  sort_order: z
    .preprocess(
      (val) => {
        if (val === undefined || val === null || val === "") return 0;
        const num = Number(val);
        return isNaN(num) ? 0 : Math.round(num);
      },
      z
        .number()
        .int("Sort order must be an integer.")
        .min(-10000, "Sort order must be between -10000 and 10000.")
        .max(10000, "Sort order must be between -10000 and 10000.")
    )
    .default(0),
});

/**
 * Preprocesses and validates product input supporting both snake_case and camelCase.
 */
export const adminProductSchema = z.preprocess(
  normalizeAdminProductInput,
  adminProductBaseSchema
);

export type AdminProductInput = z.infer<typeof adminProductBaseSchema>;
