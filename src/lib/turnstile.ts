if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

export interface TurnstileVerificationResult {
  success: boolean;
  hostname?: string;
  challengeTs?: string;
  error?: string;
  errorCodes?: string[];
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
}

const CLOUDFLARE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const DEFAULT_VERIFY_TIMEOUT_MS = 5000;

/**
 * Verifies a Cloudflare Turnstile token server-side using the official Siteverify endpoint.
 *
 * Rules:
 * - Single-use token: token is evaluated once and never persisted.
 * - Fail closed: if TURNSTILE_SECRET_KEY is missing/empty, verification fails closed immediately.
 * - Timeout handling: requests timeout after 5000ms and fail closed.
 * - Zero secret or token exposure: tokens and secrets are strictly excluded from logs and return values.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null,
  options?: VerifyTurnstileOptions
): Promise<TurnstileVerificationResult> {
  // 1. Missing or whitespace-only token
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return {
      success: false,
      error: "MISSING_TOKEN",
    };
  }

  const cleanToken = token.trim();

  // 2. Secret key resolution (fails closed if missing)
  const secretKey = options?.customSecret ?? process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey || secretKey.trim().length === 0) {
    console.error(
      "[SECURITY] TURNSTILE_SECRET_KEY is not configured. Failing closed."
    );
    return {
      success: false,
      error: "MISSING_SECRET_KEY",
    };
  }

  // 3. Prepare POST payload
  const bodyParams = new URLSearchParams();
  bodyParams.append("secret", secretKey.trim());
  bodyParams.append("response", cleanToken);
  if (remoteIp && remoteIp !== "127.0.0.1" && remoteIp !== "unknown") {
    bodyParams.append("remoteip", remoteIp);
  }

  const fetcher = options?.customFetcher ?? fetch;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_VERIFY_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetcher(CLOUDFLARE_SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[SECURITY] Cloudflare Siteverify HTTP error: ${res.status}`);
      return {
        success: false,
        error: "SITEVERIFY_HTTP_ERROR",
      };
    }

    const data = (await res.json()) as {
      success?: boolean;
      hostname?: string;
      challenge_ts?: string;
      "error-codes"?: string[];
    };

    if (data.success !== true) {
      const errorCodes = data["error-codes"] || [];
      console.warn(
        `[SECURITY] Turnstile verification failed. Error codes: ${errorCodes.join(", ") || "none"}`
      );
      return {
        success: false,
        error: "VERIFICATION_REJECTED",
        errorCodes,
      };
    }

    return {
      success: true,
      hostname: data.hostname,
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
    };
  }
}
