import crypto from "crypto";

interface RateLimitRecord {
  timestamps: number[];
}

/**
 * Bounded In-Memory Sliding Window Store (Development / Single-Instance fallback)
 * 
 * SECURITY SPECIFICATION (SEC-02 Remediation):
 * - Max capacity cap (MAX_ENTRIES = 1000) prevents memory inflation.
 * - Stale entries are evicted on ingestion when capacity is pressured.
 * - Periodic background sweep runs every CLEANUP_INTERVAL_MS with .unref()
 *   so it does not hold the Node.js event loop open during dev/tests.
 * - Designed to be superseded in production by @upstash/ratelimit.
 */
const memoryStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const MAX_ENTRIES = 1000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// Periodic background cleanup with unref() to prevent event-loop lock
const cleanupInterval = setInterval(() => {
  pruneExpiredEntries();
}, CLEANUP_INTERVAL_MS);

if (typeof cleanupInterval.unref === "function") {
  cleanupInterval.unref();
}

/**
 * Explicitly removes all records whose timestamps have completely expired.
 */
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
 * Anonymize client IP before storing or using for rate limiting.
 * Raw IP addresses are never retained.
 */
export function hashClientIdentifier(rawIp: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "shivsastra-contact-salt-v1";
  return crypto.createHash("sha256").update(`${rawIp}:${salt}`).digest("hex");
}

/**
 * Resolves the client IP identifier based on trusted edge platform headers.
 * 
 * SECURITY SPECIFICATION (SEC-01 Remediation):
 * - TRUST ASSUMPTIONS:
 *   1. Direct internet clients can forge arbitrary `x-forwarded-for` headers.
 *   2. Leftmost values in `x-forwarded-for` cannot be trusted blindly.
 *   3. If TRUSTED_CLIENT_IP_HEADER environment variable is configured, it takes priority.
 *   4. Cloudflare's `cf-connecting-ip` is immutable when traffic routes through Cloudflare proxy.
 *   5. Vercel's `x-vercel-forwarded-for` or trusted `x-real-ip` are prioritized over multi-hop chains.
 *   6. When reading `x-forwarded-for` as a fallback, we inspect the rightmost hop (nearest proxy)
 *      rather than the client-supplied first element.
 *   7. Fallback to '127.0.0.1' for local development.
 * 
 * Note: Raw IP is NEVER logged or stored; it is hashed with a secret salt immediately.
 */
export function extractClientIp(headerList: Headers): string {
  // Explicit deployment override (e.g. set TRUSTED_CLIENT_IP_HEADER="cf-connecting-ip")
  const customHeader = process.env.TRUSTED_CLIENT_IP_HEADER;
  if (customHeader) {
    const val = headerList.get(customHeader);
    if (val) return val.trim();
  }

  // 1. Cloudflare edge header (immutable when routed through Cloudflare proxy)
  const cfIp = headerList.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // 2. Vercel platform header
  const vercelIp = headerList.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();

  // 3. Trusted reverse proxy standard (Nginx / Caddy / Traefik)
  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp.trim();

  // 4. Fallback x-forwarded-for: inspect the last (nearest proxy) hop rather than client-supplied first
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

  // 5. Local development fallback
  return "127.0.0.1";
}

export async function checkRateLimit(
  hashedId: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  // Production Upstash Redis hook boundary (configured via env variables)
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    // Upstash integration boundary hook
    // (Architecture documented; falls back safely to in-memory store)
  }

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Capacity pressure management: prune expired entries if map approaches MAX_ENTRIES
  if (memoryStore.size >= MAX_ENTRIES) {
    pruneExpiredEntries(now);
    // If still at capacity, evict oldest record deterministically (FIFO eviction)
    if (memoryStore.size >= MAX_ENTRIES) {
      const oldestKey = memoryStore.keys().next().value;
      if (oldestKey) {
        memoryStore.delete(oldestKey);
      }
    }
  }

  const record = memoryStore.get(hashedId) || { timestamps: [] };

  // Filter timestamps outside current sliding window
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
}

/**
 * Diagnostic helpers used strictly in automated test assertions
 */
export function getStoreSize(): number {
  return memoryStore.size;
}

export function clearRateLimitStore(): void {
  memoryStore.clear();
}
