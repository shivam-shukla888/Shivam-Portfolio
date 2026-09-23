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
 * Parses deliverables input which may be an array of strings, a JSON string,
 * or a comma-separated string.
 */
export const normalizeDeliverables = (val: unknown): string[] => {
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
 * Normalizes input object to support both snake_case and camelCase field names.
 */
export const normalizeAdminServiceInput = (raw: unknown): Record<string, unknown> => {
  if (typeof raw !== "object" || raw === null) return {};
  const obj = raw as Record<string, unknown>;
  return {
    slug: obj.slug,
    title: obj.title,
    program_code: obj.program_code ?? obj.programCode,
    summary: obj.summary,
    description_markdown: obj.description_markdown ?? obj.descriptionMarkdown,
    engagement_model: obj.engagement_model ?? obj.engagementModel,
    deliverables: obj.deliverables,
    is_active: obj.is_active ?? obj.isActive,
    sort_order: obj.sort_order ?? obj.sortOrder,
  };
};

/**
 * Base Zod validation schema for administrative service records.
 */
export const adminServiceBaseSchema = z.object({
  slug: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Service slug is required.")
        .min(2, "Service slug must be at least 2 characters.")
        .max(100, "Service slug cannot exceed 100 characters.")
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
        .string("Service title is required.")
        .min(2, "Service title must be at least 2 characters.")
        .max(160, "Service title cannot exceed 160 characters.")
        .refine((val) => !/[<>]/.test(val), "Service title cannot contain HTML characters.")
    ),

  program_code: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(50, "Program code cannot exceed 50 characters.")
        .refine((val) => !/[<>]/.test(val), "Program code cannot contain HTML characters.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  summary: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Service summary is required.")
        .min(5, "Service summary must be at least 5 characters.")
        .max(1000, "Service summary cannot exceed 1000 characters.")
        .refine((val) => !/[<>]/.test(val), "Service summary cannot contain HTML characters.")
    ),

  description_markdown: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(20000, "Description markdown cannot exceed 20000 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited in description markdown."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  engagement_model: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "Engagement model cannot exceed 500 characters.")
        .refine((val) => !/[<>]/.test(val), "Engagement model cannot contain HTML characters.")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  deliverables: z
    .preprocess(
      normalizeDeliverables,
      z
        .array(
          z
            .string()
            .max(100, "Deliverable items cannot exceed 100 characters each.")
            .refine((val) => !/[<>]/.test(val), "Deliverable items cannot contain HTML characters.")
        )
        .max(20, "Deliverables list cannot exceed 20 items.")
    )
    .default([]),

  is_active: z.preprocess(normalizeBoolean, z.boolean()).default(true),

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
 * Preprocesses and validates service input supporting both snake_case and camelCase.
 */
export const adminServiceSchema = z.preprocess(
  normalizeAdminServiceInput,
  adminServiceBaseSchema
);

export type AdminServiceInput = z.infer<typeof adminServiceBaseSchema>;
