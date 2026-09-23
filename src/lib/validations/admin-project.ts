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
 * Strict HTTPS URL validator:
 * - Must be a valid absolute URL
 * - Protocol must be https:
 * - Rejects http, ftp, javascript, data, blob, and other protocols
 * - Rejects any HTML tags
 */
export const isValidHttpsUrl = (val: string | null): boolean => {
  if (!val) return true;
  if (val.includes("<") || val.includes(">")) return false;
  try {
    const parsed = new URL(val);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Parses tech_stack input which may be an array of strings, a JSON string,
 * or a comma-separated string.
 */
export const normalizeTechStack = (val: unknown): string[] => {
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter((item) => item.length > 0);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.length === 0) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);
        }
      } catch {
        // Fall back to comma-separated
      }
    }
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return [];
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

/**
 * Normalizes integer inputs from forms or query parameters.
 */
export const normalizeInteger = (val: unknown): unknown => {
  if (val === undefined || val === null || val === "") return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.length === 0) return null;
    const num = Number(trimmed);
    return isNaN(num) ? val : num;
  }
  return val;
};

/**
 * Normalizes input object to support both snake_case and camelCase field names.
 */
export const normalizeAdminProjectInput = (raw: unknown): Record<string, unknown> => {
  if (typeof raw !== "object" || raw === null) return {};
  const obj = raw as Record<string, unknown>;
  return {
    slug: obj.slug,
    title: obj.title,
    edition_code: obj.edition_code ?? obj.editionCode,
    summary: obj.summary,
    case_study_markdown: obj.case_study_markdown ?? obj.caseStudyMarkdown,
    cover_image_url: obj.cover_image_url ?? obj.coverImageUrl,
    category: obj.category,
    tech_stack: obj.tech_stack ?? obj.techStack,
    project_year: obj.project_year ?? obj.projectYear,
    live_url: obj.live_url ?? obj.liveUrl,
    github_url: obj.github_url ?? obj.githubUrl,
    is_featured: obj.is_featured ?? obj.isFeatured,
    sort_order: obj.sort_order ?? obj.sortOrder,
    published_at: obj.published_at ?? obj.publishedAt,
  };
};

/**
 * Base Zod validation schema for administrative project records.
 */
export const adminProjectBaseSchema = z.object({
  slug: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Project slug is required.")
        .min(2, "Project slug must be at least 2 characters.")
        .max(100, "Project slug cannot exceed 100 characters.")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen."
        )
        .refine((val) => !/[<>]/.test(val), "Slug cannot contain HTML characters.")
    ),

  title: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Project title is required.")
        .min(2, "Project title must be at least 2 characters.")
        .max(160, "Project title cannot exceed 160 characters.")
        .refine((val) => !/[<>]/.test(val), "Project title cannot contain HTML characters.")
    ),

  edition_code: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(50, "Edition code cannot exceed 50 characters.")
        .refine((val) => !/[<>]/.test(val), "Edition code cannot contain HTML characters.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  summary: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Project summary is required.")
        .min(5, "Project summary must be at least 5 characters.")
        .max(1000, "Project summary cannot exceed 1000 characters.")
        .refine((val) => !/[<>]/.test(val), "Project summary cannot contain HTML characters.")
    ),

  case_study_markdown: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(20000, "Case study markdown cannot exceed 20000 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited in case study markdown."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  cover_image_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "Cover image URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "Cover image URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  category: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(80, "Category cannot exceed 80 characters.")
        .refine((val) => !/[<>]/.test(val), "Category cannot contain HTML characters.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  tech_stack: z
    .preprocess(
      normalizeTechStack,
      z
        .array(
          z
            .string()
            .max(50, "Tech stack items cannot exceed 50 characters each.")
            .refine((val) => !/[<>]/.test(val), "Tech stack items cannot contain HTML characters.")
        )
        .max(20, "Tech stack cannot exceed 20 items.")
    )
    .default([]),

  project_year: z
    .preprocess(
      normalizeInteger,
      z
        .number()
        .int("Project year must be an integer.")
        .min(1990, "Project year must be 1990 or later.")
        .max(2100, "Project year must be 2100 or earlier.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  live_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "Live URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "Live URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  github_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "GitHub URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "GitHub URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

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

  published_at: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), "Published date must be a valid ISO timestamp.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),
});

/**
 * Preprocesses and validates project input supporting both snake_case and camelCase.
 */
export const adminProjectSchema = z.preprocess(
  normalizeAdminProjectInput,
  adminProjectBaseSchema
);

export type AdminProjectInput = z.infer<typeof adminProjectBaseSchema>;
