/**
 * Lightweight, Privacy-Conscious UTM Attribution Module
 *
 * Privacy Guarantees:
 * - Zero tracking cookies: No third-party or persistent cookies are set.
 * - Ephemeral scope: Values are handled in-memory / session-scoped only.
 * - Strict sanitization: Discards dangerous characters, scripts, emails, or excessive length.
 * - AI Assistant exclusion: The AI assistant does not collect, forward, or inspect UTM data.
 * - Zero external SDK: No third-party tracking or advertising scripts are loaded.
 */

export interface UtmAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

/**
 * Sanitizes an individual UTM parameter value.
 * Enforces length limits and restricts to safe alphanumeric, hyphen, and underscore characters.
 */
export function sanitizeUtmValue(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 64) return undefined;

  // Strict regex: allow alphanumeric, hyphen, underscore, and period only
  const sanitized = trimmed.replace(/[^a-zA-Z0-9_\-\.]/g, "");
  return sanitized.length > 0 ? sanitized : undefined;
}

/**
 * Extracts and sanitizes UTM parameters from URL search parameters.
 * Returns null if no valid UTM parameters are present.
 */
export function extractUtmParameters(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): UtmAttribution | null {
  const getParam = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(key) || undefined;
    }
    const val = params[key];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const source = sanitizeUtmValue(getParam("utm_source"));
  const medium = sanitizeUtmValue(getParam("utm_medium"));
  const campaign = sanitizeUtmValue(getParam("utm_campaign"));
  const content = sanitizeUtmValue(getParam("utm_content"));
  const term = sanitizeUtmValue(getParam("utm_term"));

  if (!source && !medium && !campaign && !content && !term) {
    return null;
  }

  return {
    ...(source ? { source } : {}),
    ...(medium ? { medium } : {}),
    ...(campaign ? { campaign } : {}),
    ...(content ? { content } : {}),
    ...(term ? { term } : {}),
  };
}
