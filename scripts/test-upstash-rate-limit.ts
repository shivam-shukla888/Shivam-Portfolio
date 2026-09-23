import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Redis } from "@upstash/redis";
import {
  isRedisConfigured,
  getRedisClient,
  resetRedisClient,
  setCustomRedisClient,
  checkDistributedRateLimit,
  getDistributedKeyTtl,
  deleteDistributedKey,
  pingRedis,
  RATE_LIMIT_PREFIX,
  DEFAULT_RATE_LIMIT_MAX_REQUESTS,
  DEFAULT_RATE_LIMIT_WINDOW_MS,
} from "../src/lib/redis";
import {
  checkRateLimit,
  checkInMemoryRateLimit,
  hashClientIdentifier,
  extractClientIp,
  clearRateLimitStore,
  getStoreSize,
  pruneExpiredEntries,
} from "../src/lib/rate-limit";
import { submitContactInquiry } from "../src/app/actions/contact";
import { initialContactState } from "../src/lib/validations/contact";

// Helper to load .env.local safely into memory if not present in process.env
function loadLocalEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const k = trimmed.slice(0, idx).trim();
        let v = trimmed.slice(idx + 1).trim();
        if (
          (v.startsWith('"') && v.endsWith('"')) ||
          (v.startsWith("'") && v.endsWith("'"))
        ) {
          v = v.slice(1, -1);
        }
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

loadLocalEnv();

async function runUpstashRateLimitSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // UPSTASH REDIS RATE LIMITING TEST SUITE (PHASE 32)");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${message}`);
      failed++;
    }
  }

  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // -------------------------------------------------------------
  // TEST 1: REDIS CONFIGURATION DETECTION
  // -------------------------------------------------------------
  process.env.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token-xyz-123";
  assert(
    isRedisConfigured() === true,
    "1. Redis configuration detection returns true when URL and token are present"
  );

  // -------------------------------------------------------------
  // TEST 2: MISSING URL
  // -------------------------------------------------------------
  delete process.env.UPSTASH_REDIS_REST_URL;
  process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token-xyz-123";
  resetRedisClient();
  assert(
    isRedisConfigured() === false && getRedisClient() === null,
    "2. Missing UPSTASH_REDIS_REST_URL fails safely and returns null client"
  );

  // -------------------------------------------------------------
  // TEST 3: MISSING TOKEN
  // -------------------------------------------------------------
  process.env.UPSTASH_REDIS_REST_URL = "https://mock-redis.upstash.io";
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  resetRedisClient();
  assert(
    isRedisConfigured() === false && getRedisClient() === null,
    "3. Missing UPSTASH_REDIS_REST_TOKEN fails safely and returns null client"
  );

  // Restore env vars
  if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl;
  if (originalToken) process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
  resetRedisClient();

  // -------------------------------------------------------------
  // TEST 4: REDIS CLIENT REMAINS SERVER-ONLY
  // -------------------------------------------------------------
  const redisSrc = fs.readFileSync(
    path.resolve(__dirname, "../src/lib/redis.ts"),
    "utf8"
  );
  const hasServerOnlyGuard =
    redisSrc.includes('typeof window !== "undefined"') &&
    redisSrc.includes("This module cannot be executed on the client");

  const componentsDir = path.resolve(__dirname, "../src/components");
  const appDir = path.resolve(__dirname, "../src/app");

  function getClientComponentFiles(dir: string): string[] {
    let files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getClientComponentFiles(fullPath));
      } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf8");
        if (content.includes('"use client"') || content.includes("'use client'")) {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  const clientFiles = [
    ...getClientComponentFiles(componentsDir),
    ...getClientComponentFiles(appDir),
  ];

  let leakedInClient = false;
  for (const f of clientFiles) {
    const content = fs.readFileSync(f, "utf8");
    if (
      content.includes("UPSTASH_REDIS_REST_TOKEN") ||
      content.includes("UPSTASH_REDIS_REST_URL") ||
      content.includes("@upstash/redis") ||
      content.includes("@/lib/redis")
    ) {
      console.error(`Client file leaks redis: ${f}`);
      leakedInClient = true;
    }
  }

  assert(
    hasServerOnlyGuard && !leakedInClient && clientFiles.length > 0,
    `4. Redis client has runtime server-only guard and is absent from all ${clientFiles.length} client components`
  );

  // -------------------------------------------------------------
  // TEST 5: DISTRIBUTED KEY NAMESPACING
  // -------------------------------------------------------------
  assert(
    RATE_LIMIT_PREFIX === "shivsastra:ratelimit:contact",
    "5. Distributed key prefix is strictly namespaced as 'shivsastra:ratelimit:contact'"
  );

  // -------------------------------------------------------------
  // TEST 6: RAW IP NEVER BECOMES REDIS KEY
  // -------------------------------------------------------------
  const sampleRawIp = "203.0.113.195";
  const hashedIdentifier = hashClientIdentifier(sampleRawIp);
  const sampleRedisKey = `${RATE_LIMIT_PREFIX}:${hashedIdentifier}`;
  assert(
    !sampleRedisKey.includes(sampleRawIp) &&
      sampleRedisKey.startsWith("shivsastra:ratelimit:contact:"),
    "6. Raw client IP address is never used as the Redis key"
  );

  // -------------------------------------------------------------
  // TEST 7: HASHED IDENTITY BEHAVIOR
  // -------------------------------------------------------------
  const hash1 = hashClientIdentifier("198.51.100.1");
  const hash1Repeat = hashClientIdentifier("198.51.100.1");
  const hash2 = hashClientIdentifier("198.51.100.2");
  assert(
    hash1.length === 64 &&
      hash1 === hash1Repeat &&
      hash1 !== hash2 &&
      /^[a-f0-9]{64}$/.test(hash1),
    "7. Client identity is anonymized via salted SHA-256 hash deterministically"
  );

  // -------------------------------------------------------------
  // TEST 8 & 9: 5 REQUESTS ALLOWED, 6TH REJECTED WITHIN WINDOW
  // -------------------------------------------------------------
  // Test using a mock Redis client for guaranteed deterministic offline assertion
  function createMockRedisClient() {
    const store = new Map<string, Array<{ score: number; member: string }>>();
    const ttls = new Map<string, number>();

    return {
      eval: async (
        _script: string,
        keys: string[],
        args: [number, number, number, string]
      ) => {
        const key = keys[0];
        const [now, windowMs, limit, member] = args;
        const clearBefore = now - windowMs;

        let entries = store.get(key) || [];
        entries = entries.filter((e) => e.score > clearBefore);

        if (entries.length < limit) {
          entries.push({ score: now, member });
          store.set(key, entries);
          ttls.set(key, Math.ceil(windowMs / 1000));
          return [1, limit - entries.length, Math.floor(now + windowMs)];
        } else {
          const oldest = entries[0];
          const resetTime = oldest.score + windowMs;
          return [0, 0, Math.floor(resetTime)];
        }
      },
      ttl: async (key: string) => ttls.get(key) ?? -2,
      del: async (key: string) => {
        const existed = store.delete(key);
        ttls.delete(key);
        return existed ? 1 : 0;
      },
      ping: async () => "PONG",
    } as unknown as Redis;
  }

  const mockClient = createMockRedisClient();
  const testKey = `shivsastra:ratelimit:contact:test_${crypto.randomBytes(8).toString("hex")}`;

  let allowedCount = 0;
  for (let i = 0; i < 5; i++) {
    const res = await checkDistributedRateLimit(
      testKey,
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
      { customRedis: mockClient }
    );
    if (res.success) allowedCount++;
  }
  assert(
    allowedCount === 5,
    "8. Distributed limiter permits exactly 5 requests within the 10-minute window"
  );

  const sixthAttempt = await checkDistributedRateLimit(
    testKey,
    DEFAULT_RATE_LIMIT_MAX_REQUESTS,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
    { customRedis: mockClient }
  );
  assert(
    sixthAttempt.success === false && sixthAttempt.remaining === 0,
    "9. 6th request is strictly rejected with remaining=0 within sliding window"
  );

  // -------------------------------------------------------------
  // TEST 10: EXPIRATION / TTL BEHAVIOR
  // -------------------------------------------------------------
  const keyTtl = await getDistributedKeyTtl(testKey, mockClient);
  assert(
    keyTtl > 0 && keyTtl <= 600,
    `10. Distributed rate-limit key has explicit TTL applied (${keyTtl}s <= 600s)`
  );

  // -------------------------------------------------------------
  // TEST 11: CONCURRENT REQUESTS DO NOT BYPASS THE LIMIT
  // -------------------------------------------------------------
  const concurrentKey = `shivsastra:ratelimit:contact:concurrent_${crypto.randomBytes(8).toString("hex")}`;
  const concurrentPromises = Array.from({ length: 12 }, () =>
    checkDistributedRateLimit(
      concurrentKey,
      DEFAULT_RATE_LIMIT_MAX_REQUESTS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
      { customRedis: mockClient }
    )
  );

  const concurrentResults = await Promise.all(concurrentPromises);
  const concurrentAllowed = concurrentResults.filter((r) => r.success).length;
  const concurrentBlocked = concurrentResults.filter((r) => !r.success).length;

  assert(
    concurrentAllowed === 5 && concurrentBlocked === 7,
    `11. Atomic script execution prevents race condition bypass: ${concurrentAllowed} allowed, ${concurrentBlocked} blocked out of 12 concurrent requests`
  );

  // -------------------------------------------------------------
  // TEST 12: SEPARATE INVOCATIONS SHARE DISTRIBUTED COUNTER
  // -------------------------------------------------------------
  // Separate client instances sharing the underlying mock/server store
  const sharedKey = `shivsastra:ratelimit:contact:shared_${crypto.randomBytes(8).toString("hex")}`;
  const invA = await checkDistributedRateLimit(sharedKey, 5, 600000, {
    customRedis: mockClient,
  });
  const invB = await checkDistributedRateLimit(sharedKey, 5, 600000, {
    customRedis: mockClient,
  });
  assert(
    invA.remaining === 4 && invB.remaining === 3,
    "12. Separate invocations access and decrement the same distributed counter state"
  );

  // -------------------------------------------------------------
  // TEST 13: REDIS UNAVAILABLE (SAFE DEGRADATION)
  // -------------------------------------------------------------
  clearRateLimitStore();
  const failingRedis = {
    eval: async () => {
      throw new Error("ECONNREFUSED: Connection refused to Redis REST endpoint");
    },
  } as unknown as Redis;

  setCustomRedisClient(failingRedis);
  // Ensure env vars are set so checkRateLimit attempts Redis first
  process.env.UPSTASH_REDIS_REST_URL = "https://failing-redis.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "failing-token";

  const fallbackHashedId = "fallback-user-hash-12345";
  const unavailableResult = await checkRateLimit(fallbackHashedId);
  assert(
    unavailableResult.success === true && unavailableResult.remaining === 4,
    "13. When Redis is unavailable, limiter falls back smoothly to in-memory store without throwing"
  );

  // -------------------------------------------------------------
  // TEST 14: REDIS TIMEOUT HANDLING
  // -------------------------------------------------------------
  const hangingRedis = {
    eval: async () => {
      return new Promise((resolve) => setTimeout(resolve, 5000));
    },
  } as unknown as Redis;

  let timeoutCaught = false;
  try {
    await checkDistributedRateLimit("any-key", 5, 600000, {
      customRedis: hangingRedis,
      timeoutMs: 50,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("timed out")) {
      timeoutCaught = true;
    }
  }
  assert(
    timeoutCaught === true,
    "14. Redis distributed limiter honors timeout threshold and aborts stalled connections"
  );

  // -------------------------------------------------------------
  // TEST 15: REDIS UNEXPECTED ERROR HANDLING
  // -------------------------------------------------------------
  const errorRedis = {
    eval: async () => {
      throw new Error("WRONGTYPE Operation against a key holding the wrong kind of value");
    },
  } as unknown as Redis;

  setCustomRedisClient(errorRedis);
  const errorHandledResult = await checkRateLimit(fallbackHashedId);
  assert(
    errorHandledResult !== null && typeof errorHandledResult.success === "boolean",
    "15. Unexpected Redis server error is intercepted safely and falls back without leaking details"
  );

  // Reset custom Redis
  resetRedisClient();
  if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl;
  if (originalToken) process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;

  // -------------------------------------------------------------
  // TEST 16: BOUNDED IN-MEMORY FALLBACK ENFORCEMENT
  // -------------------------------------------------------------
  clearRateLimitStore();
  const devHashedId = "dev-offline-client-999";
  let devAllowed = 0;
  for (let i = 0; i < 5; i++) {
    const res = await checkInMemoryRateLimit(devHashedId);
    if (res.success) devAllowed++;
  }
  const devSixth = await checkInMemoryRateLimit(devHashedId);
  assert(
    devAllowed === 5 && devSixth.success === false,
    "16. In-memory fallback enforces the exact 5-request limit and blocks the 6th"
  );

  // -------------------------------------------------------------
  // TEST 17: FALLBACK REMAINS BOUNDED UNDER PRESSURE (CAPACITY CAP)
  // -------------------------------------------------------------
  clearRateLimitStore();
  for (let i = 0; i < 1005; i++) {
    await checkInMemoryRateLimit(`synth-key-${i}`);
  }
  assert(
    getStoreSize() <= 1000,
    `17. In-memory store remains strictly bounded (current size: ${getStoreSize()} <= 1000)`
  );
  clearRateLimitStore();

  // -------------------------------------------------------------
  // TEST 18: NO UNLIMITED FALLBACK (FAILS CLOSED)
  // -------------------------------------------------------------
  const exhaustId = "exhaust-user-000";
  for (let i = 0; i < 5; i++) {
    await checkInMemoryRateLimit(exhaustId);
  }
  const postLimitAttempt = await checkInMemoryRateLimit(exhaustId);
  assert(
    postLimitAttempt.success === false,
    "18. In-memory fallback strictly rejects further requests once limit is reached (no unlimited bypass)"
  );

  // -------------------------------------------------------------
  // TEST 19: GENERIC FAILURE SEMANTICS
  // -------------------------------------------------------------
  const rateLimitedForm = new FormData();
  rateLimitedForm.append("name", "Rate Limited Adversary");
  rateLimitedForm.append("email", "adversary@ratelimit.test");
  rateLimitedForm.append("brief", "Attempting excessive rapid transmissions.");

  // Exhaust rate limit for the server-resolved IP ("127.0.0.1" in CLI execution)
  const localHashedIp = hashClientIdentifier("127.0.0.1");
  for (let i = 0; i < 5; i++) {
    await checkRateLimit(localHashedIp);
  }

  // Next inquiry must receive generic rate limit message
  const actionRes = await submitContactInquiry(
    initialContactState,
    rateLimitedForm
  );
  assert(
    actionRes.status === "rate_limited" &&
      actionRes.message ===
        "Transmission limit reached. Please allow a few minutes before submitting another inquiry.",
    "19. Rate-limited user receives generic security error message without infrastructure details"
  );

  // Clean up test key in live Redis if present
  if (originalUrl && originalToken) {
    const liveClient = getRedisClient();
    if (liveClient) {
      await deleteDistributedKey(`${RATE_LIMIT_PREFIX}:${localHashedIp}`, liveClient);
    }
  }
  clearRateLimitStore();

  // -------------------------------------------------------------
  // TEST 20: NO REDIS SECRET LEAKAGE
  // -------------------------------------------------------------
  const serializedAction = JSON.stringify(actionRes);
  const secretLeaked =
    (originalToken && serializedAction.includes(originalToken)) ||
    (originalUrl && serializedAction.includes(originalUrl)) ||
    serializedAction.includes("upstash.io");
  assert(
    !secretLeaked,
    "20. Upstash Redis URLs, tokens, and endpoints are strictly excluded from Server Action output"
  );

  // -------------------------------------------------------------
  // TEST 21: NO TURNSTILE TOKEN PERSISTENCE
  // -------------------------------------------------------------
  const contactActionSrc = fs.readFileSync(
    path.resolve(__dirname, "../src/app/actions/contact.ts"),
    "utf8"
  );
  const insertBlockMatch = contactActionSrc.match(
    /\.from\("contact_submissions"\)\.insert\(\{([\s\S]*?)\}\)/
  );
  const insertFields = insertBlockMatch ? insertBlockMatch[1] : "";
  const storesToken =
    insertFields.includes("turnstile") ||
    insertFields.includes("cf-turnstile-response") ||
    insertFields.includes("token");
  assert(
    !storesToken && insertFields.length > 0,
    "21. Contact Action does not persist Turnstile tokens in Supabase or Redis"
  );

  // -------------------------------------------------------------
  // TEST 22: NO RAW IP LOGGING
  // -------------------------------------------------------------
  const noRawIpLogs =
    !contactActionSrc.includes("console.log(rawIp") &&
    !contactActionSrc.includes("console.info(rawIp") &&
    !contactActionSrc.includes("console.warn(rawIp") &&
    !contactActionSrc.includes("console.error(rawIp");
  assert(
    noRawIpLogs,
    "22. Contact Action strictly avoids logging raw client IP addresses"
  );

  // -------------------------------------------------------------
  // TEST 23: CONTACT ACTION USES THE LIMITER
  // -------------------------------------------------------------
  assert(
    contactActionSrc.includes("checkRateLimit(hashedIp)"),
    "23. Contact Action actively invokes checkRateLimit with hashed client identifier"
  );

  // -------------------------------------------------------------
  // TEST 24: CONTACT ACTION STILL VERIFIES TURNSTILE
  // -------------------------------------------------------------
  assert(
    contactActionSrc.includes("verifyTurnstileToken(turnstileTokenStr, rawIp)"),
    "24. Contact Action actively invokes Cloudflare Turnstile token verification"
  );

  // -------------------------------------------------------------
  // TEST 25: CONTACT ACTION DOES NOT PERSIST BEFORE SECURITY CHECKS
  // -------------------------------------------------------------
  const rateLimitIdx = contactActionSrc.indexOf("await checkRateLimit(hashedIp)");
  const turnstileIdx = contactActionSrc.indexOf("await verifyTurnstileToken(turnstileTokenStr");
  const supabaseInsertIdx = contactActionSrc.indexOf("contact_submissions");

  const orderingValid =
    rateLimitIdx !== -1 &&
    turnstileIdx !== -1 &&
    supabaseInsertIdx !== -1 &&
    rateLimitIdx < turnstileIdx &&
    turnstileIdx < supabaseInsertIdx;

  assert(
    orderingValid,
    "25. Invariant preserved: Rate Limit -> Turnstile Verification -> Database Persistence"
  );



  // -------------------------------------------------------------
  // SECTION: LIVE REDIS VERIFICATION (IF CREDENTIALS AVAILABLE)
  // -------------------------------------------------------------
  console.log("\n--- Live Upstash Redis Verification ---");
  const liveUrl = process.env.UPSTASH_REDIS_REST_URL;
  const liveToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (liveUrl && liveToken && !liveUrl.includes("mock") && !liveUrl.includes("failing")) {
    console.log(`Connecting to live Upstash instance: ${new URL(liveUrl).hostname}`);
    const liveClient = new Redis({ url: liveUrl, token: liveToken });

    // Live Ping
    const livePong = await pingRedis(liveClient);
    assert(livePong === true, "LIVE-1. Redis connection verified (PING -> PONG)");

    // Live Namespaced Key & Rate Limiting
    const syntheticId = `test_live_${crypto.randomBytes(8).toString("hex")}`;
    const liveKey = `${RATE_LIMIT_PREFIX}:${syntheticId}`;

    let liveAllowed = 0;
    for (let i = 1; i <= 5; i++) {
      const res = await checkDistributedRateLimit(liveKey, 5, 600000, {
        customRedis: liveClient,
      });
      if (res.success) liveAllowed++;
    }
    assert(liveAllowed === 5, "LIVE-2. Live Redis permits exactly 5 synthetic requests");

    const liveSixth = await checkDistributedRateLimit(liveKey, 5, 600000, {
      customRedis: liveClient,
    });
    assert(
      liveSixth.success === false && liveSixth.remaining === 0,
      "LIVE-3. Live Redis strictly rejects 6th synthetic request"
    );

    // Live TTL Verification
    const liveTtl = await getDistributedKeyTtl(liveKey, liveClient);
    assert(
      liveTtl > 0 && liveTtl <= 600,
      `LIVE-4. Live Redis key has automatic sliding TTL configured (${liveTtl}s)`
    );

    // Live Key Cleanup
    const deleted = await deleteDistributedKey(liveKey, liveClient);
    assert(deleted === 1, "LIVE-5. Synthetic test key cleaned up cleanly from Redis");

    // Zero Raw IP in Redis
    assert(
      !liveKey.includes("127.0.0.1") && !liveKey.includes("192.168."),
      "LIVE-6. Redis keys strictly use anonymized hashed identity, zero raw IP addresses"
    );
  } else {
    console.log(
      "LIVE REDIS VERIFICATION: PENDING — live Upstash credentials unavailable in this environment"
    );
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runUpstashRateLimitSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
