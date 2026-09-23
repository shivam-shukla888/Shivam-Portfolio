if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import { Redis } from "@upstash/redis";

export interface DistributedRateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export interface DistributedRateLimitOptions {
  timeoutMs?: number;
  customRedis?: Redis;
}

export const RATE_LIMIT_PREFIX = "shivsastra:ratelimit:contact";
export const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 5;
export const DEFAULT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const DEFAULT_REDIS_TIMEOUT_MS = 3000; // 3 seconds timeout

let singletonRedis: Redis | null = null;

/**
 * Checks whether Upstash Redis environment variables are defined.
 * Server-only; credentials are never exposed.
 */
export function isRedisConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(
    url && url.trim().length > 0 && token && token.trim().length > 0
  );
}

/**
 * Returns a singleton instance of the Upstash Redis client.
 * Returns null if environment variables are not configured.
 */
export function getRedisClient(): Redis | null {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!singletonRedis) {
    const url = process.env.UPSTASH_REDIS_REST_URL!.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN!.trim();
    singletonRedis = new Redis({
      url,
      token,
    });
  }

  return singletonRedis;
}

/**
 * Resets the Redis client singleton for test isolation.
 */
export function resetRedisClient(): void {
  singletonRedis = null;
}

/**
 * Injects a mock Redis client for test simulation.
 */
export function setCustomRedisClient(client: Redis | null): void {
  singletonRedis = client;
}

/**
 * Atomic Lua script executing a sliding window rate limit on a Redis Sorted Set (ZSET).
 * 
 * 1. ZREMRANGEBYSCORE: atomically purges entries older than current sliding window.
 * 2. ZCARD: atomically counts valid entries within current window.
 * 3. If count < limit:
 *    - ZADD: records the current request timestamp with a unique random suffix.
 *    - EXPIRE: updates key TTL to window length (in seconds) to prevent stale state buildup.
 *    - returns {1, remaining, resetTime}
 * 4. If count >= limit:
 *    - ZRANGE: reads the oldest timestamp to compute exact sliding reset time.
 *    - returns {0, 0, resetTime}
 */
const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
local clearBefore = now - windowMs

redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
local currentCount = redis.call('ZCARD', key)

if currentCount < limit then
  redis.call('ZADD', key, now, member)
  local ttlSeconds = math.ceil(windowMs / 1000)
  redis.call('EXPIRE', key, ttlSeconds)
  local remaining = limit - currentCount - 1
  return {1, remaining, math.floor(now + windowMs)}
else
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local resetTime = now + windowMs
  if oldest and #oldest >= 2 then
    resetTime = tonumber(oldest[2]) + windowMs
  end
  return {0, 0, math.floor(resetTime)}
end
`;

/**
 * Executes an atomic distributed rate limit check using Upstash Redis.
 * 
 * Throws an error if Redis is unavailable or times out, allowing the caller
 * to degrade safely to the bounded in-memory fallback.
 */
export async function checkDistributedRateLimit(
  key: string,
  limit: number = DEFAULT_RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = DEFAULT_RATE_LIMIT_WINDOW_MS,
  options?: DistributedRateLimitOptions
): Promise<DistributedRateLimitResult> {
  const client = options?.customRedis ?? getRedisClient();

  if (!client) {
    throw new Error("Redis client is not configured");
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_REDIS_TIMEOUT_MS;
  const now = Date.now();
  const member = `${now}:${Math.random().toString(36).slice(2, 9)}`;

  // Wrap Redis eval with a timeout to guard against network stalls
  let timerId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error("Redis request timed out"));
    }, timeoutMs);
  });

  try {
    const rawResult = (await Promise.race([
      client.eval(
        SLIDING_WINDOW_LUA,
        [key],
        [now, windowMs, limit, member]
      ),
      timeoutPromise,
    ])) as [number, number, number];

    if (timerId) clearTimeout(timerId);

    if (!Array.isArray(rawResult) || rawResult.length < 3) {
      throw new Error("Invalid response format from Redis rate limit script");
    }

    const [allowedFlag, remaining, reset] = rawResult;

    return {
      success: allowedFlag === 1,
      remaining: Math.max(0, remaining),
      reset: Number(reset),
    };
  } catch (err) {
    if (timerId) clearTimeout(timerId);
    throw err;
  }
}

/**
 * Diagnostic helpers used strictly in automated test suites
 */
export async function getDistributedKeyTtl(
  key: string,
  client?: Redis
): Promise<number> {
  const redis = client ?? getRedisClient();
  if (!redis) return -1;
  return await redis.ttl(key);
}

export async function deleteDistributedKey(
  key: string,
  client?: Redis
): Promise<number> {
  const redis = client ?? getRedisClient();
  if (!redis) return 0;
  return await redis.del(key);
}

export async function pingRedis(client?: Redis): Promise<boolean> {
  try {
    const redis = client ?? getRedisClient();
    if (!redis) return false;
    const res = await redis.ping();
    return res === "PONG";
  } catch {
    return false;
  }
}
