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

export const LAB_CATEGORIES = ["idea", "build", "stack", "thought"] as const;
export type LabCategory = (typeof LAB_CATEGORIES)[number];

export const LAB_STATUSES = [
  "draft",
  "wip",
  "experimental",
  "archived",
  "published",
] as const;
export type LabStatus = (typeof LAB_STATUSES)[number];

/**
 * Parses tags input which may be an array of strings, a JSON string, or a comma-separated string.
 * Deduplicates and trims items.
 */
export const normalizeTags = (val: unknown): string[] => {
  let list: string[] = [];

  if (Array.isArray(val)) {
    list = val.map((item) =>
      typeof item === "string" ? item.trim() : String(item).trim()
    );
  } else if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.length > 0) {
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            list = parsed.map((item) => String(item).trim());
          }
        } catch {
          list = trimmed.split(",").map((item) => item.trim());
        }
      } else {
        list = trimmed.split(",").map((item) => item.trim());
      }
    }
  }

  // Filter out empty strings and deduplicate
  const cleanList = list.filter((item) => item.length > 0);
  return Array.from(new Set(cleanList));
};

/**
 * Normalizes input object to support both snake_case and camelCase field names.
 */
export const normalizeAdminLabInput = (raw: unknown): Record<string, unknown> => {
  if (typeof raw !== "object" || raw === null) return {};
  const obj = raw as Record<string, unknown>;
  return {
    slug: obj.slug,
    category: obj.category,
    title: obj.title,
    content_markdown: obj.content_markdown ?? obj.contentMarkdown,
    tags: obj.tags,
    status: obj.status,
    is_public: obj.is_public ?? obj.isPublic,
    published_at: obj.published_at ?? obj.publishedAt,
  };
};

/**
 * Base Zod validation schema for administrative personal lab records.
 */
export const adminLabBaseSchema = z.object({
  slug: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Lab entry slug is required.")
        .min(2, "Slug must be at least 2 characters.")
        .max(100, "Slug cannot exceed 100 characters.")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen."
        )
        .refine((val) => !/[<>]/.test(val), "Slug cannot contain HTML characters.")
    ),

  category: z.enum(LAB_CATEGORIES, {
    error: "Category must be exactly one of: idea, build, stack, thought.",
  }),

  title: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Lab entry title is required.")
        .min(2, "Title must be at least 2 characters.")
        .max(200, "Title cannot exceed 200 characters.")
        .refine((val) => !/[<>]/.test(val), "Title cannot contain HTML characters.")
    ),

  content_markdown: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(20000, "Content markdown cannot exceed 20000 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited in content markdown."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  tags: z
    .preprocess(
      normalizeTags,
      z
        .array(
          z
            .string()
            .max(50, "Tag item cannot exceed 50 characters.")
            .refine((val) => !/[<>]/.test(val), "Tags cannot contain HTML characters.")
        )
        .max(20, "Tags list cannot exceed 20 items.")
    )
    .default([]),

  status: z.enum(LAB_STATUSES, {
    error: "Status must be one of: draft, wip, experimental, archived, published.",
  }),

  is_public: z.preprocess(normalizeBoolean, z.boolean()).default(false),

  published_at: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .refine((val) => {
          if (!val) return true;
          const parsed = Date.parse(val);
          return !isNaN(parsed);
        }, "Published timestamp must be a valid date/timestamp string.")
        .nullable()
        .optional()
    )
    .transform((val) => (val ? new Date(val).toISOString() : null)),
});

/**
 * Preprocesses and validates lab entry input supporting both snake_case and camelCase.
 */
export const adminLabSchema = z.preprocess(
  normalizeAdminLabInput,
  adminLabBaseSchema
);

export type AdminLabInput = z.infer<typeof adminLabBaseSchema>;
