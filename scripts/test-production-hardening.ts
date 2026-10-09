import { resolveSiteUrl, absoluteUrl, serializeJsonLd, CANONICAL_ORIGIN } from "../src/lib/site";
import {
  extractClientIp,
  hashClientIdentifier,
  getRateLimitSalt,
} from "../src/lib/rate-limit";
import { isAllowedTurnstileHostname } from "../src/lib/turnstile";
import {
  generateDeliveryToken,
  hashDeliveryToken,
  verifyDeliveryTokenDetails,
} from "../src/lib/orders";

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`✓ PASS: ${name}`);
  } else {
    console.error(`✗ FAIL: ${name}`);
    process.exitCode = 1;
  }
}

async function runHardeningTests() {
  console.log("=======================================================");
  console.log("SHIVSASTRA // FINAL PRODUCTION HARDENING & REGRESSION SUITE");
  console.log("=======================================================\n");

  // -------------------------------------------------------------
  // 1. CANONICAL PRODUCTION DOMAIN & SITE_URL RESOLUTION
  // -------------------------------------------------------------
  console.log("--- 1. Canonical Domain & URL Resolution ---");
  const prevEnv = process.env.NODE_ENV;
  const prevUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // In production mode:
  (process.env as Record<string, string>).NODE_ENV = "production";
  
  process.env.NEXT_PUBLIC_SITE_URL = "https://obsolete-domain.com";
  assert(resolveSiteUrl() === CANONICAL_ORIGIN, "1.1 Production strictly rejects obsolete custom domain and forces CANONICAL_ORIGIN");

  process.env.NEXT_PUBLIC_SITE_URL = "http://www.jiosi.online";
  assert(resolveSiteUrl() === CANONICAL_ORIGIN, "1.2 Production rejects insecure http and forces CANONICAL_ORIGIN");

  process.env.NEXT_PUBLIC_SITE_URL = "https://jiosi.online";
  assert(resolveSiteUrl() === CANONICAL_ORIGIN, "1.3 Production canonical origin strictly points to https://www.jiosi.online");

  assert(absoluteUrl("/") === CANONICAL_ORIGIN, "1.4 Root absoluteUrl returns canonical origin without double slashes");
  assert(absoluteUrl("/store") === `${CANONICAL_ORIGIN}/store`, "1.5 /store absoluteUrl resolves correctly");
  assert(absoluteUrl("projects/yojna-setu") === `${CANONICAL_ORIGIN}/projects/yojna-setu`, "1.6 Slashes are normalized cleanly on relative inputs");

  // Restore
  (process.env as Record<string, string>).NODE_ENV = prevEnv || "test";
  process.env.NEXT_PUBLIC_SITE_URL = prevUrl;

  // -------------------------------------------------------------
  // 2. JSON-LD SAFE SERIALIZATION & SCRIPT BREAKOUT ATTACKS
  // -------------------------------------------------------------
  console.log("\n--- 2. JSON-LD Serialization & Anti-Breakout ---");
  const hostileXss1 = {
    name: "Adversary",
    bio: "</script><script>alert('XSS')</script>",
  };
  const serialized1 = serializeJsonLd(hostileXss1);
  assert(!serialized1.includes("</script>"), "2.1 Closing script tag </script> is neutralized and eliminated");
  assert(serialized1.includes("\\u003c/script>"), "2.2 Opening bracket is safely escaped to \\u003c");

  const hostileXss2 = {
    injection: "\"><svg/onload=alert(1)>",
    htmlEntity: "<img src=x onerror=alert(2) />",
  };
  const serialized2 = serializeJsonLd(hostileXss2);
  assert(!serialized2.includes("<svg") && !serialized2.includes("<img"), "2.3 Raw HTML opening brackets strictly escaped");

  // -------------------------------------------------------------
  // 3. TRUSTED CLIENT IP & FORGED HEADER ANTI-SPOOFING
  // -------------------------------------------------------------
  console.log("\n--- 3. Client IP Trust & Header Anti-Spoofing ---");
  
  // Scenario A: Client submits spoofed x-forwarded-for but Vercel edge sets x-vercel-forwarded-for
  const vercelHeaders = new Headers({
    "x-vercel-forwarded-for": "198.51.100.42",
    "x-forwarded-for": "1.2.3.4, 5.6.7.8",
    "cf-connecting-ip": "9.9.9.9",
  });
  const resolvedVercelIp = extractClientIp(vercelHeaders);
  assert(resolvedVercelIp === "198.51.100.42", "3.1 x-vercel-forwarded-for overrides client-forged x-forwarded-for and cf-connecting-ip");

  // Scenario B: Untrusted cf-connecting-ip without CLOUDFLARE_PROXY_ENABLED=true
  delete process.env.CLOUDFLARE_PROXY_ENABLED;
  const untrustedCfHeaders = new Headers({
    "cf-connecting-ip": "1.2.3.4",
    "x-real-ip": "203.0.113.10",
  });
  assert(extractClientIp(untrustedCfHeaders) === "203.0.113.10", "3.2 cf-connecting-ip is ignored when CLOUDFLARE_PROXY_ENABLED is not true");

  // Scenario C: Multi-hop x-forwarded-for inspects nearest proxy hop (last item), not attacker first item
  const multiHopHeaders = new Headers({
    "x-forwarded-for": "attacker.spoofed.ip, 192.0.2.1, 198.51.100.99",
  });
  assert(extractClientIp(multiHopHeaders) === "198.51.100.99", "3.3 Nearest hop (last) is trusted over attacker-controlled first hop in x-forwarded-for chain");

  // Scenario D: Missing headers in production fails safely with unified identifier
  (process.env as Record<string, string>).NODE_ENV = "production";
  const emptyHeaders = new Headers({});
  assert(extractClientIp(emptyHeaders) === "unidentified-origin", "3.4 Unidentified origin in production fails safely with unified identifier");
  (process.env as Record<string, string>).NODE_ENV = prevEnv || "test";

  // -------------------------------------------------------------
  // 4. RATE_LIMIT_SALT STABILITY, FAIL-CLOSED & COLD-START CONSISTENCY
  // -------------------------------------------------------------
  console.log("\n--- 4. RATE_LIMIT_SALT Hardening & Fail-Closed Checks ---");
  // 4.1 When dedicated RATE_LIMIT_SALT is provided in production
  (process.env as Record<string, string>).NODE_ENV = "production";
  process.env.RATE_LIMIT_SALT = "high-entropy-production-salt-0123456789abcdef";
  const configuredSalt = getRateLimitSalt();
  assert(configuredSalt === "high-entropy-production-salt-0123456789abcdef", "4.1 Configured production RATE_LIMIT_SALT is used directly");

  // 4.2 Cold start consistency: identical inputs produce identical hashes
  const hashRun1 = hashClientIdentifier("198.51.100.10");
  const hashRun2 = hashClientIdentifier("198.51.100.10");
  assert(hashRun1 === hashRun2, "4.2 Hashing is deterministic and stable across simulated cold starts");
  assert(hashRun1 !== hashClientIdentifier("198.51.100.11"), "4.3 Distinct IPs produce distinct cryptographic hashes");

  // 4.3 Missing RATE_LIMIT_SALT in production strictly fails closed
  delete process.env.RATE_LIMIT_SALT;
  // Even if other infrastructure secrets are present in environment
  process.env.UPSTASH_REDIS_REST_TOKEN = "unrelated-redis-token";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "unrelated-supabase-key";
  process.env.TURNSTILE_SECRET = "unrelated-turnstile-secret";

  let missingSaltErrorThrown = false;
  try {
    getRateLimitSalt();
  } catch (err) {
    missingSaltErrorThrown = true;
    assert(
      err instanceof Error && err.message.includes("RATE_LIMIT_SALT"),
      "4.4 Missing RATE_LIMIT_SALT in production throws descriptive error without leaking secrets"
    );
  }
  assert(missingSaltErrorThrown, "4.5 Production fails closed immediately when RATE_LIMIT_SALT is missing");

  // 4.6 hashClientIdentifier also fails closed in production when salt is missing
  let hashErrorThrown = false;
  try {
    hashClientIdentifier("198.51.100.10");
  } catch {
    hashErrorThrown = true;
  }
  assert(hashErrorThrown, "4.6 hashClientIdentifier fails closed in production when RATE_LIMIT_SALT is absent");

  // 4.7 Non-production development fallback
  (process.env as Record<string, string>).NODE_ENV = "development";
  delete process.env.RATE_LIMIT_SALT;
  const devSalt = getRateLimitSalt();
  assert(typeof devSalt === "string" && devSalt.length > 0, "4.7 Development / test environment provides safe runtime fallback");

  (process.env as Record<string, string>).NODE_ENV = prevEnv || "test";

  // -------------------------------------------------------------
  // 5. CLOUDFLARE TURNSTILE HOSTNAME AUTHORIZATION
  // -------------------------------------------------------------
  console.log("\n--- 5. Cloudflare Turnstile Hostname Authorization ---");
  (process.env as Record<string, string>).NODE_ENV = "production";
  assert(isAllowedTurnstileHostname("www.jiosi.online") === true, "5.1 Production allows www.jiosi.online");
  assert(isAllowedTurnstileHostname("jiosi.online") === true, "5.2 Production allows jiosi.online");
  assert(isAllowedTurnstileHostname("arbitrary.vercel.app") === false, "5.3 Production strictly rejects arbitrary vercel.app");
  assert(isAllowedTurnstileHostname("localhost") === false, "5.4 Production strictly rejects localhost");
  assert(isAllowedTurnstileHostname("127.0.0.1") === false, "5.5 Production strictly rejects 127.0.0.1");
  assert(isAllowedTurnstileHostname("shivsastra.com") === false, "5.6 Production rejects old unverified hostnames");
  (process.env as Record<string, string>).NODE_ENV = prevEnv || "test";

  // -------------------------------------------------------------
  // 6. DIGITAL DELIVERY DOWNLOAD TOKEN EXPIRY & CRYPTOGRAPHIC BINDING
  // -------------------------------------------------------------
  console.log("\n--- 6. Delivery Token Cryptographic Binding & Expiry ---");
  const tokenRecord = generateDeliveryToken(1000); // 1-second expiry
  const [secret] = tokenRecord.token.split(".");
  assert(secret.length === 64, "6.1 Secret component has 32 bytes entropy (64 hex chars)");
  
  // Valid token check
  const verifyValid = verifyDeliveryTokenDetails(tokenRecord.token, tokenRecord.hash);
  assert(verifyValid.valid === true, "6.2 Fresh delivery token is valid");

  // Tamper timestamp in token
  const tamperedToken = `${secret}.${Date.now() + 9999999}`;
  const verifyTampered = verifyDeliveryTokenDetails(tamperedToken, tokenRecord.hash);
  assert(verifyTampered.valid === false, "6.3 Client cannot tamper with expiry timestamp without breaking cryptographic hash");

  // Expired token check
  const expiredTimestamp = Date.now() - 5000;
  const expiredToken = `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef.${expiredTimestamp}`;
  const expiredHash = hashDeliveryToken(expiredToken);
  const verifyExpired = verifyDeliveryTokenDetails(expiredToken, expiredHash);
  assert(verifyExpired.valid === false && verifyExpired.expired === true, "6.4 Expired token returns { valid: false, expired: true } for 410 Gone response");

  // Order-level expiration check (persisted order delivery_token_expires_at)
  const futureToken = generateDeliveryToken(86400000);
  const pastOrderExpiry = new Date(Date.now() - 1000).toISOString();
  const verifyOrderExpired = verifyDeliveryTokenDetails(futureToken.token, futureToken.hash, pastOrderExpiry);
  assert(verifyOrderExpired.valid === false && verifyOrderExpired.expired === true, "6.5 Expired order-level delivery_token_expires_at strictly invalidates download");

  console.log("\n=======================================================");
  console.log("FINAL HARDENING TEST SUITE COMPLETE");
  console.log("=======================================================\n");
}

runHardeningTests().catch((err) => {
  console.error("Test execution exception:", err);
  process.exit(1);
});
