import crypto from "crypto";
import {
  isRedisConfigured,
  checkDistributedRateLimit,
  RATE_LIMIT_PREFIX,
  AI_RATE_LIMIT_PREFIX,
  CHECKOUT_RATE_LIMIT_PREFIX,
  VERIFY_PAYMENT_RATE_LIMIT_PREFIX,
} from "./redis";

interface RateLimitRecord {
  timestamps: number[];
}

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const RATE_LIMIT_MAX_REQUESTS = 5;
const WINDOW_MS = RATE_LIMIT_WINDOW_MS;
const MAX_REQUESTS = RATE_LIMIT_MAX_REQUESTS;
const MAX_ENTRIES = 1000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export interface RateLimitOptions {
  forceInMemory?: boolean;
  timeoutMs?: number;
}

/**
 * Ephemeral runtime salt generated once per process lifetime.
 * Used if RATE_LIMIT_SALT is not configured, ensuring we NEVER fall back
 * to a publicly predictable hardcoded string.
 */
const SERVER_EPHEMERAL_SALT = crypto.randomBytes(32).toString("hex");

/**
 * Bounded In-Memory Sliding Window Store (Development / Single-Instance fallback)
 */
const memoryStore = new Map<string, RateLimitRecord>();

const cleanupInterval = setInterval(() => {
  pruneExpiredEntries();
  pruneExpiredAiEntries();
  pruneExpiredCheckoutEntries();
  pruneExpiredVerifyPaymentEntries();
}, CLEANUP_INTERVAL_MS);

if (typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

export function pruneExpiredEntries(now: number = Date.now()): number {
  const windowStart = now - WINDOW_MS;
  let prunedCount = 0;

  for (const [key, record] of memoryStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > windowStart);
    if (valid.length === 0) {
      memoryStore.delete(key);
      prunedCount++;
    } else if (valid.length !== record.timestamps.length) {
      memoryStore.set(key, { timestamps: valid });
    }
  }

  return prunedCount;
}

/**
 * Resolves the salt for client IP hashing.
 *
 * Security Requirements:
 * 1. Requires a dedicated, high-entropy server-only secret in production via RATE_LIMIT_SALT.
 * 2. Strictly DOES NOT derive the salt from UPSTASH_REDIS_REST_TOKEN,
 *    SUPABASE_SERVICE_ROLE_KEY, or TURNSTILE_SECRET.
 * 3. Does not silently fall back to an ephemeral random salt in production.
 * 4. Fails closed / throws safely if RATE_LIMIT_SALT is missing in production.
 * 5. In non-production (development, test), falls back safely to process-lifetime secret.
 */
export function isRateLimitSaltConfigured(): boolean {
  const salt = process.env.RATE_LIMIT_SALT;
  return Boolean(salt && salt.trim().length > 0);
}

export function getRateLimitSalt(): string {
  const envSalt = process.env.RATE_LIMIT_SALT;
  if (envSalt && envSalt.trim().length > 0) {
    return envSalt.trim();
  }

  if (process.env.NODE_ENV === "production") {
    console.error(
      "[SECURITY FATAL] RATE_LIMIT_SALT is not configured in production. Failing closed."
    );
    throw new Error(
      "RATE_LIMIT_SALT is not configured in production. A dedicated server-only secret is required."
    );
  }

  return SERVER_EPHEMERAL_SALT;
}

/**
 * Anonymize client IP before storing or using for rate limiting.
 * Raw IP addresses are never retained.
 * Uses RATE_LIMIT_SALT from environment.
 * In production, fails closed if RATE_LIMIT_SALT is missing.
 */
export function hashClientIdentifier(rawIp: string): string {
  const effectiveSalt = getRateLimitSalt();
  return crypto
    .createHash("sha256")
    .update(`${rawIp}:${effectiveSalt}`)
    .digest("hex");
}

/**
 * Resolves the client IP identifier based on trusted edge platform headers.
 *
 * SECURITY SPECIFICATION (Client IP Trust & Anti-Spoofing):
 * 1. If TRUSTED_CLIENT_IP_HEADER is explicitly set, it takes priority.
 * 2. Vercel edge guarantees `x-vercel-forwarded-for` — client-forged headers cannot overwrite this.
 * 3. On Vercel deployments, untrusted client-supplied `cf-connecting-ip` is NOT blindly trusted
 *    unless CLOUDFLARE_PROXY_ENABLED is explicitly true.
 * 4. Fallback reverse proxy headers (`x-real-ip`, nearest hop in `x-forwarded-for`).
 * 5. Fails closed / safely if headers are absent.
 */
export function extractClientIp(headerList: Headers): string {
  // 1. Explicit deployment override
  const customHeader = process.env.TRUSTED_CLIENT_IP_HEADER;
  if (customHeader) {
    const val = headerList.get(customHeader);
    if (val && val.trim().length > 0) return val.trim();
  }

  // 2. Vercel platform-guaranteed edge header (prevents client spoofing)
  const vercelIp = headerList.get("x-vercel-forwarded-for");
  if (vercelIp && vercelIp.trim().length > 0) {
    return vercelIp.split(",")[0].trim();
  }

  // 3. Cloudflare edge header (trusted if Cloudflare proxy is confirmed enabled)
  if (process.env.CLOUDFLARE_PROXY_ENABLED === "true") {
    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp && cfIp.trim().length > 0) return cfIp.trim();
  }

  // 4. Trusted reverse proxy standard
  const realIp = headerList.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) return realIp.trim();

  // 5. Fallback x-forwarded-for: inspect nearest hop (last element)
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
    if (hops.length > 0) {
      return hops[hops.length - 1];
    }
  }

  // 6. Production fallback for unidentified request: fail safely with unified identifier
  if (process.env.NODE_ENV === "production") {
    return "unidentified-origin";
  }

  return "127.0.0.1";
}

/**
 * Enforces rate limiting on contact submissions.
 */
export async function checkRateLimit(
  hashedId: string,
  options?: RateLimitOptions
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!hashedId || typeof hashedId !== "string" || hashedId.trim().length === 0) {
    return { success: false, remaining: 0, reset: Date.now() + WINDOW_MS };
  }
  if (isRedisConfigured() && !options?.forceInMemory) {
    try {
      const key = `${RATE_LIMIT_PREFIX}:${hashedId}`;
      const result = await checkDistributedRateLimit(
        key,
        MAX_REQUESTS,
        WINDOW_MS,
        { timeoutMs: options?.timeoutMs }
      );
      return result;
    } catch {
      console.warn(
        "[RATE_LIMIT] Distributed Redis limiter unavailable; falling back safely to bounded in-memory store."
      );
    }
  }

  try {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    if (memoryStore.size >= MAX_ENTRIES) {
      pruneExpiredEntries(now);
      if (memoryStore.size >= MAX_ENTRIES) {
        const oldestKey = memoryStore.keys().next().value;
        if (oldestKey) {
          memoryStore.delete(oldestKey);
        }
      }
    }

    const record = memoryStore.get(hashedId) || { timestamps: [] };
    const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (validTimestamps.length >= MAX_REQUESTS) {
      const oldest = validTimestamps[0];
      const resetTime = oldest + WINDOW_MS;
      return {
        success: false,
        remaining: 0,
        reset: resetTime,
      };
    }

    validTimestamps.push(now);
    memoryStore.set(hashedId, { timestamps: validTimestamps });

    return {
      success: true,
      remaining: MAX_REQUESTS - validTimestamps.length,
      reset: now + WINDOW_MS,
    };
  } catch {
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + WINDOW_MS,
    };
  }
}

export async function checkInMemoryRateLimit(
  hashedId: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  return checkRateLimit(hashedId, { forceInMemory: true });
}

export function getStoreSize(): number {
  return memoryStore.size;
}

export function clearRateLimitStore(): void {
  memoryStore.clear();
}

/**
 * AI Assistant Rate Limiting Policy:
 * 10 chat requests / 10 minutes / client IP (hashed).
 */
export const AI_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const AI_RATE_LIMIT_MAX_REQUESTS = 10;

const aiMemoryStore = new Map<string, RateLimitRecord>();

export function pruneExpiredAiEntries(now: number = Date.now()): number {
  const windowStart = now - AI_RATE_LIMIT_WINDOW_MS;
  let prunedCount = 0;

  for (const [key, record] of aiMemoryStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > windowStart);
    if (valid.length === 0) {
      aiMemoryStore.delete(key);
      prunedCount++;
    } else if (valid.length !== record.timestamps.length) {
      aiMemoryStore.set(key, { timestamps: valid });
    }
  }

  return prunedCount;
}

export async function checkAiRateLimit(
  hashedId: string,
  options?: RateLimitOptions
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!hashedId || typeof hashedId !== "string" || hashedId.trim().length === 0) {
    return { success: false, remaining: 0, reset: Date.now() + AI_RATE_LIMIT_WINDOW_MS };
  }
  if (isRedisConfigured() && !options?.forceInMemory) {
    try {
      const key = `${AI_RATE_LIMIT_PREFIX}:${hashedId}`;
      const result = await checkDistributedRateLimit(
        key,
        AI_RATE_LIMIT_MAX_REQUESTS,
        AI_RATE_LIMIT_WINDOW_MS,
        { timeoutMs: options?.timeoutMs }
      );
      return result;
    } catch {
      console.warn(
        "[AI_RATE_LIMIT] Distributed Redis limiter unavailable; falling back safely to bounded in-memory store."
      );
    }
  }

  try {
    const now = Date.now();
    const windowStart = now - AI_RATE_LIMIT_WINDOW_MS;

    if (aiMemoryStore.size >= MAX_ENTRIES) {
      pruneExpiredAiEntries(now);
      if (aiMemoryStore.size >= MAX_ENTRIES) {
        const oldestKey = aiMemoryStore.keys().next().value;
        if (oldestKey) {
          aiMemoryStore.delete(oldestKey);
        }
      }
    }

    const record = aiMemoryStore.get(hashedId) || { timestamps: [] };
    const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (validTimestamps.length >= AI_RATE_LIMIT_MAX_REQUESTS) {
      const oldest = validTimestamps[0];
      const resetTime = oldest + AI_RATE_LIMIT_WINDOW_MS;
      return {
        success: false,
        remaining: 0,
        reset: resetTime,
      };
    }

    validTimestamps.push(now);
    aiMemoryStore.set(hashedId, { timestamps: validTimestamps });

    return {
      success: true,
      remaining: AI_RATE_LIMIT_MAX_REQUESTS - validTimestamps.length,
      reset: now + AI_RATE_LIMIT_WINDOW_MS,
    };
  } catch {
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + AI_RATE_LIMIT_WINDOW_MS,
    };
  }
}

export function clearAiRateLimitStore(): void {
  aiMemoryStore.clear();
}

/**
 * Checkout Rate Limiting Policy:
 * - 10 checkout initializations / 10 minutes / client IP (hashed).
 * - Optional per-email hourly cap: 5 orders / hour / email.
 */
export const CHECKOUT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const CHECKOUT_RATE_LIMIT_MAX_REQUESTS = 10;
export const CHECKOUT_EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const CHECKOUT_EMAIL_MAX_REQUESTS = 5;

const checkoutMemoryStore = new Map<string, RateLimitRecord>();

export function pruneExpiredCheckoutEntries(now: number = Date.now()): number {
  const windowStart = now - CHECKOUT_RATE_LIMIT_WINDOW_MS;
  let prunedCount = 0;

  for (const [key, record] of checkoutMemoryStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > windowStart);
    if (valid.length === 0) {
      checkoutMemoryStore.delete(key);
      prunedCount++;
    } else if (valid.length !== record.timestamps.length) {
      checkoutMemoryStore.set(key, { timestamps: valid });
    }
  }

  return prunedCount;
}

export async function checkCheckoutRateLimit(
  hashedId: string,
  customerEmail?: string,
  options?: RateLimitOptions
): Promise<{ success: boolean; remaining: number; reset: number; reason?: string }> {
  if (!hashedId || typeof hashedId !== "string" || hashedId.trim().length === 0) {
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + CHECKOUT_RATE_LIMIT_WINDOW_MS,
      reason: "INVALID_IDENTIFIER",
    };
  }
  // 1. IP-level rate limit
  if (isRedisConfigured() && !options?.forceInMemory) {
    try {
      const key = `${CHECKOUT_RATE_LIMIT_PREFIX}:${hashedId}`;
      const result = await checkDistributedRateLimit(
        key,
        CHECKOUT_RATE_LIMIT_MAX_REQUESTS,
        CHECKOUT_RATE_LIMIT_WINDOW_MS,
        { timeoutMs: options?.timeoutMs }
      );
      if (!result.success) {
        return { ...result, reason: "IP_RATE_LIMITED" };
      }
    } catch {
      console.warn(
        "[CHECKOUT_RATE_LIMIT] Distributed Redis limiter unavailable; falling back safely to in-memory store."
      );
    }
  }

  // In-memory IP check
  try {
    const now = Date.now();
    const windowStart = now - CHECKOUT_RATE_LIMIT_WINDOW_MS;

    if (checkoutMemoryStore.size >= MAX_ENTRIES) {
      pruneExpiredCheckoutEntries(now);
      if (checkoutMemoryStore.size >= MAX_ENTRIES) {
        const oldestKey = checkoutMemoryStore.keys().next().value;
        if (oldestKey) checkoutMemoryStore.delete(oldestKey);
      }
    }

    const record = checkoutMemoryStore.get(hashedId) || { timestamps: [] };
    const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (validTimestamps.length >= CHECKOUT_RATE_LIMIT_MAX_REQUESTS) {
      const oldest = validTimestamps[0];
      return {
        success: false,
        remaining: 0,
        reset: oldest + CHECKOUT_RATE_LIMIT_WINDOW_MS,
        reason: "IP_RATE_LIMITED",
      };
    }

    validTimestamps.push(now);
    checkoutMemoryStore.set(hashedId, { timestamps: validTimestamps });

    // 2. Email-level hourly limit if email is provided
    if (customerEmail) {
      const emailHash = crypto
        .createHash("sha256")
        .update(`email:${customerEmail.toLowerCase().trim()}`)
        .digest("hex");
      const emailKey = `${CHECKOUT_RATE_LIMIT_PREFIX}:email:${emailHash}`;

      if (isRedisConfigured() && !options?.forceInMemory) {
        try {
          const emailResult = await checkDistributedRateLimit(
            emailKey,
            CHECKOUT_EMAIL_MAX_REQUESTS,
            CHECKOUT_EMAIL_WINDOW_MS,
            { timeoutMs: options?.timeoutMs }
          );
          if (!emailResult.success) {
            return { ...emailResult, reason: "EMAIL_RATE_LIMITED" };
          }
        } catch {
          // Ignore Redis error for email check fallback
        }
      }
    }

    return {
      success: true,
      remaining: CHECKOUT_RATE_LIMIT_MAX_REQUESTS - validTimestamps.length,
      reset: now + CHECKOUT_RATE_LIMIT_WINDOW_MS,
    };
  } catch {
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + CHECKOUT_RATE_LIMIT_WINDOW_MS,
      reason: "RATE_LIMIT_ERROR",
    };
  }
}

export function clearCheckoutRateLimitStore(): void {
  checkoutMemoryStore.clear();
}

/**
 * Payment Verification Rate Limiting Policy:
 * 15 verification attempts / 10 minutes / client IP (hashed).
 * Prevents signature brute-forcing or retry flooding.
 */
export const VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const VERIFY_PAYMENT_RATE_LIMIT_MAX_REQUESTS = 15;

const verifyPaymentMemoryStore = new Map<string, RateLimitRecord>();

export function pruneExpiredVerifyPaymentEntries(now: number = Date.now()): number {
  const windowStart = now - VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS;
  let prunedCount = 0;

  for (const [key, record] of verifyPaymentMemoryStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > windowStart);
    if (valid.length === 0) {
      verifyPaymentMemoryStore.delete(key);
      prunedCount++;
    } else if (valid.length !== record.timestamps.length) {
      verifyPaymentMemoryStore.set(key, { timestamps: valid });
    }
  }

  return prunedCount;
}

export async function checkVerifyPaymentRateLimit(
  hashedId: string,
  options?: RateLimitOptions
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!hashedId || typeof hashedId !== "string" || hashedId.trim().length === 0) {
    return { success: false, remaining: 0, reset: Date.now() + VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS };
  }
  if (isRedisConfigured() && !options?.forceInMemory) {
    try {
      const key = `${VERIFY_PAYMENT_RATE_LIMIT_PREFIX}:${hashedId}`;
      const result = await checkDistributedRateLimit(
        key,
        VERIFY_PAYMENT_RATE_LIMIT_MAX_REQUESTS,
        VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS,
        { timeoutMs: options?.timeoutMs }
      );
      return result;
    } catch {
      console.warn(
        "[VERIFY_PAYMENT_RATE_LIMIT] Distributed Redis limiter unavailable; falling back safely to in-memory store."
      );
    }
  }

  try {
    const now = Date.now();
    const windowStart = now - VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS;

    if (verifyPaymentMemoryStore.size >= MAX_ENTRIES) {
      pruneExpiredVerifyPaymentEntries(now);
      if (verifyPaymentMemoryStore.size >= MAX_ENTRIES) {
        const oldestKey = verifyPaymentMemoryStore.keys().next().value;
        if (oldestKey) verifyPaymentMemoryStore.delete(oldestKey);
      }
    }

    const record = verifyPaymentMemoryStore.get(hashedId) || { timestamps: [] };
    const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (validTimestamps.length >= VERIFY_PAYMENT_RATE_LIMIT_MAX_REQUESTS) {
      const oldest = validTimestamps[0];
      return {
        success: false,
        remaining: 0,
        reset: oldest + VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS,
      };
    }

    validTimestamps.push(now);
    verifyPaymentMemoryStore.set(hashedId, { timestamps: validTimestamps });

    return {
      success: true,
      remaining: VERIFY_PAYMENT_RATE_LIMIT_MAX_REQUESTS - validTimestamps.length,
      reset: now + VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS,
    };
  } catch {
    return {
      success: false,
      remaining: 0,
      reset: Date.now() + VERIFY_PAYMENT_RATE_LIMIT_WINDOW_MS,
    };
  }
}

export function clearVerifyPaymentRateLimitStore(): void {
  verifyPaymentMemoryStore.clear();
}
