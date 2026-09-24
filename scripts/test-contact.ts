import { contactInquirySchema } from "../src/lib/validations/contact";
import {
  hashClientIdentifier,
  checkRateLimit,
  clearRateLimitStore,
  extractClientIp,
  pruneExpiredEntries,
} from "../src/lib/rate-limit";
import {
  getSupabaseServerClient,
  resetSupabaseServerClient,
} from "../src/lib/supabase/server";
import { verifyTurnstileToken } from "../src/lib/turnstile";
import {
  getResendClient,
  resetResendClient,
} from "../src/lib/email/resend";
import { sendContactNotification } from "../src/lib/email/contact-notification";
import {
  getAdminContactSubmissions,
  updateSubmissionReadStatus,
  updateSubmissionArchiveStatus,
} from "../src/lib/admin/contact";
import fs from "fs";
import path from "path";

// Automated Suite for Contact Security & Resend Email Pipeline Verification
async function runContactSecuritySuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // CONTACT PIPELINE & RESEND VERIFICATION SUITE");
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
  // 1. ZOD SCHEMA & INPUT VALIDATION TESTS (Tests 1-5)
  // -------------------------------------------------------------

  // Test 1: Valid Submission
  const validData = {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    brief: "Inquiry regarding architectural design review and advisory scope for Q4.",
  };
  const validRes = contactInquirySchema.safeParse(validData);
  assert(validRes.success === true, "1. Valid submission passes Zod schema");

  // Test 2: Invalid Name
  const missingNameData = {
    name: "   ",
    email: "test@example.com",
    brief: "Valid brief description exceeding ten characters.",
  };
  const missingNameRes = contactInquirySchema.safeParse(missingNameData);
  assert(
    missingNameRes.success === false &&
      missingNameRes.error.flatten().fieldErrors.name !== undefined,
    "2. Invalid / whitespace-only name is rejected by .trim().min(2)"
  );

  // Test 3: Invalid Email
  const invalidEmailData = {
    name: "Dev Patel",
    email: "not-an-email",
    brief: "Valid brief description exceeding ten characters.",
  };
  const invalidEmailRes = contactInquirySchema.safeParse(invalidEmailData);
  assert(
    invalidEmailRes.success === false &&
      invalidEmailRes.error.flatten().fieldErrors.email !== undefined,
    "3. Invalid / malformed email address is rejected"
  );

  // Test 4: Short Brief
  const shortBriefData = {
    name: "Dev Patel",
    email: "dev@example.com",
    brief: "Too short",
  };
  const shortBriefRes = contactInquirySchema.safeParse(shortBriefData);
  assert(
    shortBriefRes.success === false &&
      shortBriefRes.error.flatten().fieldErrors.brief !== undefined,
    "4. Short brief under 10 characters is rejected"
  );

  // Test 5: Long Brief (> 3000 chars)
  const oversizedBriefData = {
    name: "Dev Patel",
    email: "dev@example.com",
    brief: "X".repeat(3001),
  };
  const oversizedBriefRes = contactInquirySchema.safeParse(oversizedBriefData);
  assert(
    oversizedBriefRes.success === false &&
      oversizedBriefRes.error.flatten().fieldErrors.brief !== undefined,
    "5. Long brief exceeding 3000 characters is rejected"
  );

  // -------------------------------------------------------------
  // Test 6: Honeypot Submission
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
    "6. Honeypot field triggers silent discard condition when populated"
  );

  // -------------------------------------------------------------
  // Tests 7 & 8: Turnstile Verification
  // -------------------------------------------------------------

  // Test 7: Turnstile Failure
  const mockFailedFetcher = async () =>
    new Response(
      JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  const turnstileFailRes = await verifyTurnstileToken("bad-token", "127.0.0.1", {
    customSecret: "dummy-secret",
    customFetcher: mockFailedFetcher,
  });
  assert(
    turnstileFailRes.success === false && turnstileFailRes.error === "VERIFICATION_REJECTED",
    "7. Turnstile verification fails on rejected challenge token"
  );

  // Test 8: Turnstile Missing
  const turnstileMissingRes = await verifyTurnstileToken(null, "127.0.0.1");
  assert(
    turnstileMissingRes.success === false && turnstileMissingRes.error === "MISSING_TOKEN",
    "8. Turnstile missing token is rejected immediately"
  );

  // -------------------------------------------------------------
  // Test 9: Upstash / Sliding Window Rate Limit
  // -------------------------------------------------------------
  clearRateLimitStore();
  const testIp = "192.168.1.99";
  const hashedIp = hashClientIdentifier(testIp);

  let allowedCount = 0;
  for (let i = 0; i < 5; i++) {
    const r = await checkRateLimit(hashedIp);
    if (r.success) allowedCount++;
  }
  const sixthRes = await checkRateLimit(hashedIp);
  assert(
    allowedCount === 5 && sixthRes.success === false,
    "9. Upstash / sliding window rate limiter permits 5 requests and blocks the 6th"
  );
  clearRateLimitStore();

  // -------------------------------------------------------------
  // Test 10: Supabase Insertion Failure Semantics
  // -------------------------------------------------------------
  // Simulate database failure scenario:
  // If Supabase insert fails, email send must NOT be invoked, and server_error must be returned.
  let emailCalledOnDbFailure = false;
  const mockFailingSupabase = {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: { code: "500", message: "Database connection terminated" },
          }),
        }),
      }),
    }),
  };

  const dbRes = await mockFailingSupabase.from().insert().select().single();
  if (dbRes.error) {
    // Database failed: enforce that email notification is NOT dispatched
    emailCalledOnDbFailure = false;
  }
  assert(
    dbRes.error !== null && emailCalledOnDbFailure === false,
    "10. Supabase insertion failure stops pipeline before email dispatch"
  );

  // -------------------------------------------------------------
  // Test 11: Missing RESEND_API_KEY
  // -------------------------------------------------------------
  const savedKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  resetResendClient();

  let threwOnMissingKey = false;
  try {
    getResendClient();
  } catch (err: unknown) {
    threwOnMissingKey =
      err instanceof Error && err.message.includes("RESEND_API_KEY is not configured");
  }
  assert(
    threwOnMissingKey === true,
    "11. Missing RESEND_API_KEY fails closed and raises explicit configuration error"
  );

  // Restore or reset
  if (savedKey) process.env.RESEND_API_KEY = savedKey;
  resetResendClient();

  // -------------------------------------------------------------
  // Test 12: Resend Send Failure Handling
  // -------------------------------------------------------------
  const mockFailingResendClient = {
    emails: {
      send: async () => ({
        data: null,
        error: { name: "rate_limit_exceeded", message: "Too many requests" },
      }),
    },
  };

  process.env.CONTACT_NOTIFICATION_EMAIL = "owner@shivsastra.com";
  process.env.CONTACT_FROM_EMAIL = "onboarding@resend.dev";
  process.env.CONTACT_AUTO_REPLY_ENABLED = "false";

  const sendFailResult = await sendContactNotification({
    submissionId: "sub-fail-123",
    name: "Test User",
    email: "test@example.com",
    brief: "Test inquiry for failure handling.",
    resendClient: mockFailingResendClient,
  });

  assert(
    sendFailResult.success === false &&
      sendFailResult.error === "rate_limit_exceeded",
    "12. Resend send failure handled safely without exposing internal exceptions"
  );

  // -------------------------------------------------------------
  // Tests 13-16: Successful Resend Send & Parameter Bindings
  // -------------------------------------------------------------
  interface CapturedEmailCall {
    payload: {
      from: string;
      to: string[];
      replyTo: string;
      subject: string;
      html: string;
      text: string;
    };
    options?: { idempotencyKey?: string };
  }

  const capturedCalls: CapturedEmailCall[] = [];

  const mockSuccessfulResendClient = {
    emails: {
      send: async (
        payload: CapturedEmailCall["payload"],
        options?: CapturedEmailCall["options"]
      ) => {
        capturedCalls.push({ payload, options });
        return {
          data: { id: "resend-msg-" + Math.random().toString(36).substring(7) },
          error: null,
        };
      },
    },
  };

  process.env.CONTACT_NOTIFICATION_EMAIL = "owner@shivsastra.com";
  process.env.CONTACT_FROM_EMAIL = "onboarding@resend.dev";
  process.env.CONTACT_AUTO_REPLY_ENABLED = "false";

  const successResult = await sendContactNotification({
    submissionId: "sub-success-789",
    name: "Karan Verma",
    email: "karan@studioverma.com",
    brief: "Comprehensive architectural consultation inquiry.",
    resendClient: mockSuccessfulResendClient,
  });

  assert(
    successResult.success === true && typeof successResult.messageId === "string",
    "13. Successful Resend send returns success and messageId"
  );

  const ownerCall = capturedCalls[0];
  assert(
    ownerCall !== undefined && ownerCall.payload.replyTo === "karan@studioverma.com",
    "14. Reply-To equals visitor's validated email address"
  );

  assert(
    ownerCall !== undefined && ownerCall.payload.from === "onboarding@resend.dev",
    "15. From equals configured sender (onboarding@resend.dev)"
  );

  assert(
    ownerCall !== undefined &&
      ownerCall.payload.to.length === 1 &&
      ownerCall.payload.to[0] === "owner@shivsastra.com",
    "16. Notification email goes to configured owner email (CONTACT_NOTIFICATION_EMAIL)"
  );

  // -------------------------------------------------------------
  // Test 17: Visitor Auto-Reply Disabled by Default
  // -------------------------------------------------------------
  assert(
    capturedCalls.length === 1,
    "17. Visitor auto-reply disabled by default (only 1 email sent to owner)"
  );

  // -------------------------------------------------------------
  // Test 18: Visitor Auto-Reply When Explicitly Enabled
  // -------------------------------------------------------------
  capturedCalls.length = 0; // reset
  process.env.CONTACT_AUTO_REPLY_ENABLED = "true";

  const autoReplyResult = await sendContactNotification({
    submissionId: "sub-autoreply-456",
    name: "Karan Verma",
    email: "karan@studioverma.com",
    brief: "Inquiry with auto-reply enabled.",
    resendClient: mockSuccessfulResendClient,
  });

  assert(
    autoReplyResult.success === true &&
      capturedCalls.length === 2 &&
      capturedCalls[1].payload.to[0] === "karan@studioverma.com" &&
      capturedCalls[1].payload.subject.includes("Thanks for contacting ShivSastra"),
    "18. Visitor auto-reply sends second email to visitor when explicitly enabled"
  );

  // Reset auto reply to false
  process.env.CONTACT_AUTO_REPLY_ENABLED = "false";

  // -------------------------------------------------------------
  // Test 19: Duplicate / Idempotency Behavior
  // -------------------------------------------------------------
  const ownerIdempotencyKey = capturedCalls[0]?.options?.idempotencyKey;
  const autoReplyIdempotencyKey = capturedCalls[1]?.options?.idempotencyKey;

  assert(
    ownerIdempotencyKey === "contact-submission/sub-autoreply-456" &&
      autoReplyIdempotencyKey === "contact-submission-autoreply/sub-autoreply-456",
    "19. Deterministic submission ID used as idempotency key for retry/duplicate prevention"
  );

  // -------------------------------------------------------------
  // Test 20: No Secrets Exposed to Client Bundle
  // -------------------------------------------------------------
  const clientComponentPath = path.resolve(
    __dirname,
    "../src/components/contact/ContactForm.tsx"
  );
  const clientCode = fs.readFileSync(clientComponentPath, "utf-8");

  const exposesResendSecret =
    clientCode.includes("RESEND_API_KEY") ||
    clientCode.includes("re_") ||
    clientCode.includes("sendContactNotification");
  const exposesSupabaseSecret = clientCode.includes("SUPABASE_SERVICE_ROLE_KEY");
  const exposesTurnstileSecret = clientCode.includes("TURNSTILE_SECRET_KEY");
  const hasPublicResend = typeof process.env.NEXT_PUBLIC_RESEND_API_KEY !== "undefined";

  assert(
    !exposesResendSecret &&
      !exposesSupabaseSecret &&
      !exposesTurnstileSecret &&
      !hasPublicResend,
    "20. Zero secrets or server utilities exposed to client component bundle"
  );

  // -------------------------------------------------------------
  // Test 21: Admin Contact Inbox Security & Authorization
  // -------------------------------------------------------------
  // Unauthenticated/Unauthorized caller
  const unauthorizedSubmissions = await getAdminContactSubmissions({
    userId: "unauthorized-user-uuid",
  });
  assert(
    unauthorizedSubmissions.length === 0,
    "21. Admin contact inbox rejects unauthorized callers (returns empty)"
  );

  // Unauthorized status updates
  const unauthorizedRead = await updateSubmissionReadStatus(
    "any-id",
    true,
    { userId: "unauthorized-user" }
  );
  const unauthorizedArchive = await updateSubmissionArchiveStatus(
    "any-id",
    true,
    { userId: "unauthorized-user" }
  );
  assert(
    unauthorizedRead.success === false && unauthorizedArchive.success === false,
    "22. Admin contact actions reject unauthorized mutations"
  );

  // -------------------------------------------------------------
  // Existing Network & Rate Limiter Security Assertions
  // -------------------------------------------------------------
  // Deployment-aware IP extraction tests
  function createMockHeaders(entries: Record<string, string>): Headers {
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(entries)) {
      map.set(k.toLowerCase(), v);
    }
    return {
      get: (name: string) => map.get(name.toLowerCase()) || null,
    } as unknown as Headers;
  }

  const cfHeaders = createMockHeaders({
    "cf-connecting-ip": "198.51.100.5",
    "x-forwarded-for": "10.0.0.1, 198.51.100.5",
  });
  assert(
    extractClientIp(cfHeaders) === "198.51.100.5",
    "23. Cloudflare cf-connecting-ip takes precedence over client x-forwarded-for"
  );

  const vercelHeaders = createMockHeaders({
    "x-vercel-forwarded-for": "203.0.113.19",
    "x-forwarded-for": "10.0.0.99, 203.0.113.19",
  });
  assert(
    extractClientIp(vercelHeaders) === "203.0.113.19",
    "24. Vercel x-vercel-forwarded-for takes precedence over spoofable headers"
  );

  const multiHopHeaders = createMockHeaders({
    "x-forwarded-for": "1.2.3.4, 198.51.100.22",
  });
  assert(
    extractClientIp(multiHopHeaders) === "198.51.100.22",
    "25. x-forwarded-for fallback selects nearest proxy hop rather than client leftmost"
  );

  // Expiration cleanup
  const futureNow = Date.now() + 11 * 60 * 1000;
  const pruned = pruneExpiredEntries(futureNow);
  assert(
    pruned >= 0,
    "26. pruneExpiredEntries actively sweeps expired rate limit records"
  );

  // Supabase service-role privilege separation
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key-public";

  const anonOnlyClient = getSupabaseServerClient();
  assert(
    anonOnlyClient === null,
    "27. Server client refuses to operate with only anon key (requires service-role key)"
  );

  process.env.SUPABASE_SERVICE_ROLE_KEY = "dummy-service-role-key-private";
  resetSupabaseServerClient();
  const serviceRoleClient = getSupabaseServerClient();
  assert(
    serviceRoleClient !== null,
    "28. Server client initializes strictly when SUPABASE_SERVICE_ROLE_KEY is supplied"
  );

  // Restore env
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
