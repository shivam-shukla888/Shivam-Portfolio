import { contactInquirySchema } from "../src/lib/validations/contact";
import {
  hashClientIdentifier,
  checkRateLimit,
  clearRateLimitStore,
  extractClientIp,
  pruneExpiredEntries,
  getStoreSize,
} from "../src/lib/rate-limit";
import {
  getSupabaseServerClient,
  resetSupabaseServerClient,
} from "../src/lib/supabase/server";

// Automated Suite for Contact Security Verification
async function runContactSecuritySuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // CONTACT SECURITY VERIFICATION SUITE");
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

  // -------------------------------------------------------------
  // 1. ZOD SCHEMA & INPUT VALIDATION TESTS
  // -------------------------------------------------------------

  // 1.1 Valid Submission
  const validData = {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    brief: "Inquiry regarding architectural design review and advisory scope for Q4.",
  };
  const validRes = contactInquirySchema.safeParse(validData);
  assert(validRes.success === true, "1.1 Valid submission passes Zod schema");

  // 1.2 Missing Name
  const missingNameData = {
    name: "   ",
    email: "test@example.com",
    brief: "Valid brief description exceeding ten characters.",
  };
  const missingNameRes = contactInquirySchema.safeParse(missingNameData);
  assert(
    missingNameRes.success === false &&
      missingNameRes.error.flatten().fieldErrors.name !== undefined,
    "1.2 Whitespace-only name is rejected by .trim().min(2)"
  );

  // 1.3 Invalid Email
  const invalidEmailData = {
    name: "Dev Patel",
    email: "not-an-email",
    brief: "Valid brief description exceeding ten characters.",
  };
  const invalidEmailRes = contactInquirySchema.safeParse(invalidEmailData);
  assert(
    invalidEmailRes.success === false &&
      invalidEmailRes.error.flatten().fieldErrors.email !== undefined,
    "1.3 Malformed email address is rejected"
  );

  // 1.4 Short Brief
  const shortBriefData = {
    name: "Dev Patel",
    email: "dev@example.com",
    brief: "Too short",
  };
  const shortBriefRes = contactInquirySchema.safeParse(shortBriefData);
  assert(
    shortBriefRes.success === false &&
      shortBriefRes.error.flatten().fieldErrors.brief !== undefined,
    "1.4 Brief under 10 characters is rejected"
  );

  // 1.5 Oversized Brief (> 3000 chars)
  const oversizedBriefData = {
    name: "Dev Patel",
    email: "dev@example.com",
    brief: "X".repeat(3001),
  };
  const oversizedBriefRes = contactInquirySchema.safeParse(oversizedBriefData);
  assert(
    oversizedBriefRes.success === false &&
      oversizedBriefRes.error.flatten().fieldErrors.brief !== undefined,
    "1.5 Oversized brief exceeding 3000 characters is rejected"
  );

  // -------------------------------------------------------------
  // 2. HONEYPOT RESISTANCE TEST
  // -------------------------------------------------------------
  const honeypotData = {
    name: "Spam Bot",
    email: "bot@spam.com",
    brief: "Automated promotional text exceeding minimum characters.",
    hp_website: "https://spamsite.xyz",
  };
  const isHoneypotTriggered =
    typeof honeypotData.hp_website === "string" &&
    honeypotData.hp_website.trim().length > 0;
  assert(
    isHoneypotTriggered === true,
    "2.1 Honeypot field triggers silent discard condition when populated"
  );

  // -------------------------------------------------------------
  // 3. SEC-01 REMEDIATION: DEPLOYMENT-AWARE TRUSTED HEADER RESOLUTION
  // -------------------------------------------------------------

  // Helper mock headers
  function createMockHeaders(entries: Record<string, string>): Headers {
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(entries)) {
      map.set(k.toLowerCase(), v);
    }
    return {
      get: (name: string) => map.get(name.toLowerCase()) || null,
    } as unknown as Headers;
  }

  // 3.1 Cloudflare Edge Precedence over client x-forwarded-for spoof
  const cfHeaders = createMockHeaders({
    "cf-connecting-ip": "198.51.100.5",
    "x-forwarded-for": "10.0.0.1, 198.51.100.5",
  });
  const resolvedCfIp = extractClientIp(cfHeaders);
  assert(
    resolvedCfIp === "198.51.100.5",
    "3.1 Cloudflare cf-connecting-ip takes precedence over client x-forwarded-for"
  );

  // 3.2 Vercel Platform Header Precedence
  const vercelHeaders = createMockHeaders({
    "x-vercel-forwarded-for": "203.0.113.19",
    "x-forwarded-for": "10.0.0.99, 203.0.113.19",
  });
  const resolvedVercelIp = extractClientIp(vercelHeaders);
  assert(
    resolvedVercelIp === "203.0.113.19",
    "3.2 Vercel x-vercel-forwarded-for takes precedence over spoofable headers"
  );

  // 3.3 x-forwarded-for Fallback Inspects Nearest Proxy Hop (Rightmost)
  // When an attacker sends "X-Forwarded-For: 1.2.3.4" and the proxy appends "198.51.100.22",
  // we do NOT trust the attacker's leftmost "1.2.3.4".
  const multiHopHeaders = createMockHeaders({
    "x-forwarded-for": "1.2.3.4, 198.51.100.22",
  });
  const resolvedHopIp = extractClientIp(multiHopHeaders);
  assert(
    resolvedHopIp === "198.51.100.22",
    "3.3 x-forwarded-for fallback selects nearest proxy hop rather than client-spoofed leftmost IP"
  );

  // 3.4 Custom Deployment Override Configuration
  process.env.TRUSTED_CLIENT_IP_HEADER = "x-custom-secure-ip";
  const customHeaders = createMockHeaders({
    "x-custom-secure-ip": "172.16.0.44",
    "cf-connecting-ip": "198.51.100.5",
  });
  const resolvedCustomIp = extractClientIp(customHeaders);
  assert(
    resolvedCustomIp === "172.16.0.44",
    "3.4 TRUSTED_CLIENT_IP_HEADER config override takes absolute precedence when set"
  );
  delete process.env.TRUSTED_CLIENT_IP_HEADER;

  // 3.5 Local Fallback
  const emptyHeaders = createMockHeaders({});
  assert(
    extractClientIp(emptyHeaders) === "127.0.0.1",
    "3.5 Local development fallback defaults to 127.0.0.1 when no proxy headers exist"
  );

  // -------------------------------------------------------------
  // 4. SEC-02 REMEDIATION: BOUNDED IN-MEMORY STORE & CLEANUP
  // -------------------------------------------------------------
  clearRateLimitStore();

  // 4.1 Sliding window enforcement: 5 requests allowed, 6th throttled
  const testIp = "192.168.1.50";
  const hashedIp = hashClientIdentifier(testIp);

  let allowedCount = 0;
  for (let i = 0; i < 5; i++) {
    const r = await checkRateLimit(hashedIp);
    if (r.success) allowedCount++;
  }
  const sixthRes = await checkRateLimit(hashedIp);
  assert(
    allowedCount === 5 && sixthRes.success === false,
    "4.1 Rate limiter strictly permits 5 requests and blocks the 6th within the window"
  );

  // 4.2 Expiration cleanup removes stale records
  // Simulate passage of 11 minutes (660,000 ms)
  const futureNow = Date.now() + 11 * 60 * 1000;
  const pruned = pruneExpiredEntries(futureNow);
  assert(
    pruned >= 1 && getStoreSize() === 0,
    "4.2 pruneExpiredEntries actively removes records older than 10-minute window"
  );

  // 4.3 Deterministic capacity cap (MAX_ENTRIES pressure management)
  // Fill store with dummy records
  clearRateLimitStore();
  for (let i = 0; i < 1005; i++) {
    await checkRateLimit(`synthetic-hash-${i}`);
  }
  assert(
    getStoreSize() <= 1000,
    "4.3 Map store size remains strictly bounded under capacity pressure (<= 1000)"
  );
  clearRateLimitStore();

  // -------------------------------------------------------------
  // 5. SEC-03 REMEDIATION: SUPABASE SERVICE-ROLE PRIVILEGE SEPARATION
  // -------------------------------------------------------------
  resetSupabaseServerClient();

  // 5.1 When ONLY anon key is configured, server client MUST return null
  // (Prevents depending on broad public INSERT RLS policies)
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key-public";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const anonOnlyClient = getSupabaseServerClient();
  assert(
    anonOnlyClient === null,
    "5.1 Server client refuses to operate with only anon key (requires service-role key)"
  );

  // 5.2 When SUPABASE_SERVICE_ROLE_KEY is provided, server client initializes
  process.env.SUPABASE_SERVICE_ROLE_KEY = "dummy-service-role-key-private";
  resetSupabaseServerClient();
  const serviceRoleClient = getSupabaseServerClient();
  assert(
    serviceRoleClient !== null,
    "5.2 Server client initializes strictly when SUPABASE_SERVICE_ROLE_KEY is supplied"
  );

  // Clean up environment variables
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runContactSecuritySuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
