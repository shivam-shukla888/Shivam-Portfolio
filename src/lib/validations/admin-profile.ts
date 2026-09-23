import { z } from "zod";

/**
 * Preprocessor that trims strings and normalizes empty or whitespace-only values to null.
 */
const emptyStringToNull = (val: unknown): string | null => {
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
const isValidHttpsUrl = (val: string | null): boolean => {
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
 * Normalizes input object to support both snake_case and camelCase field names.
 */
const normalizeAdminProfileInput = (raw: unknown): Record<string, unknown> => {
  if (typeof raw !== "object" || raw === null) return {};
  const obj = raw as Record<string, unknown>;
  return {
    full_name: obj.full_name ?? obj.fullName,
    email: obj.email,
    phone: obj.phone,
    contra_url: obj.contra_url ?? obj.contraUrl,
    linkedin_url: obj.linkedin_url ?? obj.linkedinUrl,
    github_url: obj.github_url ?? obj.githubUrl,
    instagram_url: obj.instagram_url ?? obj.instagramUrl,
    x_url: obj.x_url ?? obj.xUrl,
    positioning_statement:
      obj.positioning_statement ?? obj.positioningStatement,
    hero_supporting_text:
      obj.hero_supporting_text ?? obj.heroSupportingText,
    availability_status:
      obj.availability_status ?? obj.availabilityStatus,
    about_markdown: obj.about_markdown ?? obj.aboutMarkdown,
    contact_instructions:
      obj.contact_instructions ?? obj.contactInstructions,
  };
};

/**
 * Zod validation schema for administrative profile updates.
 * Server-side validated; strict security rules; zero arbitrary HTML.
 */
export const adminProfileBaseSchema = z.object({
  full_name: z
    .preprocess(
      emptyStringToNull,
      z
        .string("Full name is required.")
        .min(2, "Full name must be at least 2 characters.")
        .max(120, "Full name cannot exceed 120 characters.")
        .refine(
          (val) => !/[<>]/.test(val),
          "Full name cannot contain HTML characters."
        )
    ),

  email: z
    .preprocess(
      (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
      z
        .string("Email is required.")
        .email("Must be a valid email address.")
        .max(255, "Email cannot exceed 255 characters.")
    ),

  phone: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(35, "Phone number cannot exceed 35 characters.")
        .refine(
          (val) => /^[\d\s+\-().]{5,35}$/.test(val),
          "Phone number contains invalid characters (digits, spaces, +, -, () only)."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  contra_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "Contra URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  linkedin_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "LinkedIn URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  github_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "GitHub URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  instagram_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "Instagram URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  x_url: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(500, "URL cannot exceed 500 characters.")
        .refine(isValidHttpsUrl, "X URL must be a valid HTTPS URL (https://...).")
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  positioning_statement: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(300, "Positioning statement cannot exceed 300 characters.")
        .refine(
          (val) => !/[<>]/.test(val),
          "Positioning statement cannot contain HTML tags."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  hero_supporting_text: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(600, "Hero supporting text cannot exceed 600 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  availability_status: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(100, "Availability status cannot exceed 100 characters.")
        .refine(
          (val) => !/[<>]/.test(val),
          "Availability status cannot contain HTML tags."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  about_markdown: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(5000, "About content cannot exceed 5000 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),

  contact_instructions: z
    .preprocess(
      emptyStringToNull,
      z
        .string()
        .max(1000, "Contact instructions cannot exceed 1000 characters.")
        .refine(
          (val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val),
          "Script tags are strictly prohibited."
        )
        .nullable()
        .optional()
    )
    .transform((val) => val ?? null),
});

/**
 * Preprocesses and validates input supporting both snake_case and camelCase.
 */
export const adminProfileSchema = z.preprocess(
  normalizeAdminProfileInput,
  adminProfileBaseSchema
);

export type AdminProfileInput = z.infer<typeof adminProfileBaseSchema>;
