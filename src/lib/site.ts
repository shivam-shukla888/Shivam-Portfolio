/**
 * CANONICAL SITE CONFIGURATION & IDENTITY (SHIVSASTRA)
 *
 * Single source of truth for the production hostname, canonical origin,
 * URL resolution, and safe JSON-LD serialization.
 *
 * Rules:
 * - Production canonical origin is strictly `https://www.jiosi.online`.
 * - In production, only verified hostnames (`www.jiosi.online`, `jiosi.online`) are accepted.
 * - HTTP is rejected in production (requires HTTPS).
 * - Trailing slashes are normalized consistently (never a trailing slash on origin).
 * - Safe for both client and server imports (zero environment secret leakage).
 */

export const CANONICAL_HOST = "www.jiosi.online";
export const CANONICAL_ORIGIN = "https://www.jiosi.online";

export const ALLOWED_PRODUCTION_HOSTS = [
  "www.jiosi.online",
  "jiosi.online",
] as const;

export const BRAND_NAME = "ShivSastra";
export const OWNER_NAME = "Shivam Shukla";
export const VERIFIED_CONTACT_EMAIL = "theshivamshukla.4uu@gmail.com";

/**
 * Validates and resolves the authoritative site base URL.
 * Falls back safely to `https://www.jiosi.online` in production.
 */
export function resolveSiteUrl(): string {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return CANONICAL_ORIGIN;
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && typeof envUrl === "string") {
    try {
      const parsed = new URL(envUrl.trim());
      const hostname = parsed.hostname.toLowerCase();
      const portPart = parsed.port ? `:${parsed.port}` : "";
      return `${parsed.protocol}//${hostname}${portPart}`;
    } catch {
      return "http://localhost:3000";
    }
  }

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/**
 * Generates an absolute canonical URL for a given pathname.
 * Guarantees no double slashes and consistent normalization.
 */
export function absoluteUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = resolveSiteUrl();
  if (cleanPath === "/") {
    return baseUrl;
  }
  return `${baseUrl}${cleanPath}`;
}

/**
 * Safely serializes data to a JSON string for injection into <script type="application/ld+json">.
 * Replaces `<` with `\u003c` to strictly prevent breakout vectors such as `</script>`.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
