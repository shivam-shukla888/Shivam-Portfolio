if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

export interface TurnstileVerificationResult {
  success: boolean;
  hostname?: string;
  action?: string;
  cdata?: string;
  challengeTs?: string;
  error?: string;
  errorCodes?: string[];
  userMessage?: string;
}

export type TurnstileFetcher = (
  url: string,
  options: {
    method: string;
    headers: Record<string, string>;
    body: string;
    signal?: AbortSignal;
  }
) => Promise<Response>;

export interface VerifyTurnstileOptions {
  customSecret?: string;
  customFetcher?: TurnstileFetcher;
  timeoutMs?: number;
  allowedHostnames?: string[];
  expectedAction?: string;
  expectedCdata?: string;
}

const CLOUDFLARE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_VERIFY_TIMEOUT_MS = 5000;

/**
 * Authoritative production hostnames for JIOSI.ONLINE / SHIVSASTRA.
 * In production, only these verified domains are permitted.
 */
export const PRODUCTION_ALLOWED_HOSTNAMES = [
  "www.jiosi.online",
  "jiosi.online",
] as const;

export const NON_PRODUCTION_ALLOWED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "::1",
] as const;

export const DEFAULT_ALLOWED_HOSTNAMES = [...PRODUCTION_ALLOWED_HOSTNAMES];

/**
 * Validates that the hostname returned by Cloudflare Siteverify matches
 * an authorized deployment domain for ShivSastra.
 *
 * Security rules:
 * - Production: Strictly accepts only `www.jiosi.online` and `jiosi.online`.
 * - Production: Rejects arbitrary `*.vercel.app` and loopback/localhost hostnames.
 * - Non-production: Allows localhost, 127.0.0.1, Vercel preview deployments, or explicit allowlist.
 */
export function isAllowedTurnstileHostname(
  hostname?: string | null,
  customAllowed?: string[]
): boolean {
  if (!hostname || typeof hostname !== "string") {
    return false;
  }
  const cleanHost = hostname.trim().toLowerCase();
  const isProd = process.env.NODE_ENV === "production";

  if (customAllowed && customAllowed.length > 0) {
    if (customAllowed.some((h) => h.toLowerCase() === cleanHost)) {
      return true;
    }
  }

  // Explicit environment variable allowlist takes priority if configured
  if (process.env.ALLOWED_TURNSTILE_HOSTNAMES) {
    const envHosts = process.env.ALLOWED_TURNSTILE_HOSTNAMES.split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    if (envHosts.includes(cleanHost)) {
      return true;
    }
  }

  // Canonical production hostnames are valid in all environments
  if (
    (PRODUCTION_ALLOWED_HOSTNAMES as readonly string[]).includes(cleanHost)
  ) {
    return true;
  }

  // Production: strictly accept only the verified production hostnames (already checked above)
  if (isProd) {
    return false;
  }

  // Non-production (development, CI, tests, preview deployments)
  if (
    (NON_PRODUCTION_ALLOWED_HOSTNAMES as readonly string[]).includes(cleanHost)
  ) {
    return true;
  }

  if (cleanHost.endsWith(".vercel.app")) {
    return true;
  }

  if (cleanHost === "dummy") {
    return true;
  }

  return false;
}

/**
 * Verifies a Cloudflare Turnstile token server-side using the official Siteverify endpoint.
 *
 * Rules:
 * - Single-use token: token is evaluated once and never persisted.
 * - Secret key: resolved from TURNSTILE_SECRET or TURNSTILE_SECRET_KEY server-side environment variables.
 * - Fail closed: if secret is missing/empty, verification fails closed immediately.
 * - Timeout handling: requests timeout after 5000ms and fail closed.
 * - Zero secret or token exposure: tokens and secrets are strictly excluded from logs and return values.
 * - Hostname verification: validates Siteverify returned hostname against authorized production domains.
 * - Action validation: enforces matching action when expectedAction is provided.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null,
  options?: VerifyTurnstileOptions
): Promise<TurnstileVerificationResult> {
  // 1. Token presence check (fail closed immediately if null/empty)
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return {
      success: false,
      error: "MISSING_TOKEN",
      userMessage: "Please complete the security verification and try again.",
    };
  }

  const cleanToken = token.trim();

  // 2. Secret key resolution (supports TURNSTILE_SECRET and TURNSTILE_SECRET_KEY, fails closed if missing)
  const secretKey =
    options?.customSecret ??
    process.env.TURNSTILE_SECRET ??
    process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey || secretKey.trim().length === 0) {
    console.error(
      "[SECURITY] TURNSTILE_SECRET / TURNSTILE_SECRET_KEY is not configured. Failing closed."
    );
    return {
      success: false,
      error: "MISSING_SECRET_KEY",
      userMessage: "Unable to verify the submission. Please try again.",
    };
  }

  // 3. Prepare parameters for official Cloudflare Siteverify POST request
  const bodyParams = new URLSearchParams();
  bodyParams.append("secret", secretKey.trim());
  bodyParams.append("response", cleanToken);
  if (
    remoteIp &&
    remoteIp !== "127.0.0.1" &&
    remoteIp !== "::1" &&
    remoteIp !== "unknown" &&
    remoteIp !== "localhost"
  ) {
    bodyParams.append("remoteip", remoteIp);
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_VERIFY_TIMEOUT_MS;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

  const fetcher = options?.customFetcher ?? fetch;

  try {
    const res = await fetcher(CLOUDFLARE_SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`[SECURITY] Cloudflare Siteverify HTTP error: ${res.status}`);
      return {
        success: false,
        error: "SITEVERIFY_HTTP_ERROR",
        userMessage: "Unable to verify the submission. Please try again.",
      };
    }

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
      challenge_ts?: string;
      hostname?: string;
      action?: string;
      cdata?: string;
    };

    if (!data.success) {
      const errorCodes = data["error-codes"] || [];
      console.warn(
        `[SECURITY] Turnstile verification failed. Error codes: ${errorCodes.join(", ") || "none"}`
      );

      const isExpiredOrDuplicate = errorCodes.includes("timeout-or-duplicate");
      const userMessage = isExpiredOrDuplicate
        ? "Security verification expired. Please try again."
        : "Unable to verify the submission. Please try again.";

      return {
        success: false,
        error: isExpiredOrDuplicate ? "EXPIRED_OR_DUPLICATE" : "VERIFICATION_REJECTED",
        errorCodes,
        userMessage,
      };
    }

    // 4. Hostname validation against authorized production and deployment domains
    if (
      data.hostname &&
      !isAllowedTurnstileHostname(data.hostname, options?.allowedHostnames)
    ) {
      console.warn(
        `[SECURITY] Turnstile verification rejected: unauthorized hostname "${data.hostname}".`
      );
      return {
        success: false,
        error: "UNAUTHORIZED_HOSTNAME",
        hostname: data.hostname,
        userMessage: "Unable to verify the submission. Please try again.",
      };
    }

    // 5. Action validation if expectedAction is specified
    if (options?.expectedAction) {
      if (!data.action || data.action !== options.expectedAction) {
        console.warn(
          `[SECURITY] Turnstile action mismatch: expected "${options.expectedAction}", got "${data.action || "none"}".`
        );
        return {
          success: false,
          error: "ACTION_MISMATCH",
          userMessage: "Unable to verify the submission. Please try again.",
        };
      }
    }

    // 6. Cdata validation if expectedCdata is specified
    if (options?.expectedCdata) {
      if (!data.cdata || data.cdata !== options.expectedCdata) {
        console.warn(
          `[SECURITY] Turnstile cdata mismatch: expected "${options.expectedCdata}", got "${data.cdata || "none"}".`
        );
        return {
          success: false,
          error: "CDATA_MISMATCH",
          userMessage: "Unable to verify the submission. Please try again.",
        };
      }
    }

    return {
      success: true,
      hostname: data.hostname,
      action: data.action,
      cdata: data.cdata,
      challengeTs: data.challenge_ts,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isTimeout =
      err instanceof Error &&
      (err.name === "AbortError" ||
        err.message.toLowerCase().includes("timeout") ||
        err.message.toLowerCase().includes("abort"));

    console.error(
      `[SECURITY] Turnstile verification network exception: ${
        isTimeout ? "Request timed out" : "Network error"
      }`
    );

    return {
      success: false,
      error: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      userMessage: "Unable to verify the submission. Please try again.",
    };
  }
}
