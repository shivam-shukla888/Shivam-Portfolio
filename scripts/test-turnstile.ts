import fs from "fs";
import path from "path";
import {
  verifyTurnstileToken,
  TurnstileFetcher,
} from "../src/lib/turnstile";
import { submitContactInquiry } from "../src/app/actions/contact";
import { initialContactState } from "../src/lib/validations/contact";
import { clearRateLimitStore } from "../src/lib/rate-limit";

async function runTurnstileSecuritySuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // CLOUDFLARE TURNSTILE SECURITY SUITE (PHASE 31)");
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

  const dummySecret = "0x4AAAAAAFDUMMYSECRETKEY1234567890";

  // Mock fetcher builder
  function createMockFetcher(response: {
    status?: number;
    body?: Record<string, unknown>;
    shouldTimeout?: boolean;
  }): TurnstileFetcher {
    return async () => {
      if (response.shouldTimeout) {
        throw new Error("The operation was aborted due to timeout");
      }
      return {
        ok: (response.status ?? 200) >= 200 && (response.status ?? 200) < 300,
        status: response.status ?? 200,
        json: async () => response.body ?? {},
      } as unknown as Response;
    };
  }

  // --- SECTION 1: TURNSTILE VERIFICATION LOGIC ---
  console.log("--- 1. Turnstile Verification Token Handling ---");

  // 1. Missing token -> rejected
  const resMissing = await verifyTurnstileToken(null, null, {
    customSecret: dummySecret,
  });
  assert(
    resMissing.success === false && resMissing.error === "MISSING_TOKEN",
    "1. Missing token (null) is strictly rejected"
  );

  // 2. Empty token -> rejected
  const resEmpty = await verifyTurnstileToken("   ", null, {
    customSecret: dummySecret,
  });
  assert(
    resEmpty.success === false && resEmpty.error === "MISSING_TOKEN",
    "2. Empty / whitespace-only token is strictly rejected"
  );

  // 3. Invalid token -> rejected
  const resInvalid = await verifyTurnstileToken("invalid-token-xyz", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: false,
        "error-codes": ["invalid-input-response"],
      },
    }),
  });
  assert(
    resInvalid.success === false &&
      resInvalid.error === "VERIFICATION_REJECTED" &&
      !!resInvalid.errorCodes?.includes("invalid-input-response"),
    "3. Invalid token is rejected by Siteverify"
  );

  // 4. Verification success -> accepted
  const resSuccess = await verifyTurnstileToken("valid-token-123", "192.168.1.1", {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "shivsastra.vercel.app",
        challenge_ts: new Date().toISOString(),
      },
    }),
  });
  assert(
    resSuccess.success === true &&
      resSuccess.hostname === "shivsastra.vercel.app",
    "4. Verification success is accepted with valid hostname"
  );

  // 5. Expired token -> rejected
  const resExpired = await verifyTurnstileToken("expired-token-456", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: false,
        "error-codes": ["timeout-or-duplicate"],
      },
    }),
  });
  assert(
    resExpired.success === false &&
      !!resExpired.errorCodes?.includes("timeout-or-duplicate"),
    "5. Expired token is rejected with timeout-or-duplicate error"
  );

  // 6. Duplicate/replayed token -> rejected
  const resReplayed = await verifyTurnstileToken("replayed-token-789", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: false,
        "error-codes": ["timeout-or-duplicate"],
      },
    }),
  });
  assert(
    resReplayed.success === false &&
      !!resReplayed.errorCodes?.includes("timeout-or-duplicate"),
    "6. Duplicate / replayed token is strictly rejected"
  );

  // 7. Siteverify failure (HTTP error 502/500) -> rejected
  const resHttpError = await verifyTurnstileToken("any-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 502,
      body: {},
    }),
  });
  assert(
    resHttpError.success === false &&
      resHttpError.error === "SITEVERIFY_HTTP_ERROR",
    "7. Siteverify 502 HTTP gateway failure rejects submission"
  );

  // 8. Siteverify timeout -> rejected
  const resTimeout = await verifyTurnstileToken("any-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      shouldTimeout: true,
    }),
  });
  assert(
    resTimeout.success === false && resTimeout.error === "TIMEOUT",
    "8. Siteverify timeout fails closed safely"
  );

  // 9. Missing production secret -> fail closed
  const prevSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const prevSecret = process.env.TURNSTILE_SECRET;
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.TURNSTILE_SECRET;
  const resMissingSecret = await verifyTurnstileToken("any-token", null, {
    customSecret: undefined,
  });
  assert(
    resMissingSecret.success === false &&
      resMissingSecret.error === "MISSING_SECRET_KEY",
    "9. Missing production TURNSTILE_SECRET / TURNSTILE_SECRET_KEY strictly fails closed"
  );

  // 9b. Secret resolved from TURNSTILE_SECRET when TURNSTILE_SECRET_KEY is absent
  process.env.TURNSTILE_SECRET = dummySecret;
  const resFromTurnstileSecret = await verifyTurnstileToken("valid-token-secret", null, {
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "www.jiosi.online",
      },
    }),
  });
  assert(
    resFromTurnstileSecret.success === true &&
      resFromTurnstileSecret.hostname === "www.jiosi.online",
    "9b. Secret resolution successfully works with TURNSTILE_SECRET"
  );
  delete process.env.TURNSTILE_SECRET;

  if (prevSecretKey) {
    process.env.TURNSTILE_SECRET_KEY = prevSecretKey;
  }
  if (prevSecret) {
    process.env.TURNSTILE_SECRET = prevSecret;
  }

  // 9c. Hostname validation: unauthorized hostname -> rejected
  const resUnauthorizedHost = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "malicious-phishing-site.com",
      },
    }),
  });
  assert(
    resUnauthorizedHost.success === false &&
      resUnauthorizedHost.error === "UNAUTHORIZED_HOSTNAME",
    "9c. Hostname mismatch (unauthorized domain) is strictly rejected"
  );

  // 9d. Canonical Production Hostnames: www.jiosi.online and jiosi.online accepted
  const resJiosiWww = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "www.jiosi.online",
      },
    }),
  });
  assert(
    resJiosiWww.success === true && resJiosiWww.hostname === "www.jiosi.online",
    "9d-1. Canonical production host 'www.jiosi.online' is strictly accepted"
  );

  const resJiosiApex = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "jiosi.online",
      },
    }),
  });
  assert(
    resJiosiApex.success === true && resJiosiApex.hostname === "jiosi.online",
    "9d-2. Canonical production host 'jiosi.online' is strictly accepted"
  );

  // 9e. In production mode (NODE_ENV=production), arbitrary *.vercel.app and localhost are rejected
  const prevNodeEnv = process.env.NODE_ENV;
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";

  const resProdVercel = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "arbitrary-preview.vercel.app",
      },
    }),
  });
  assert(
    resProdVercel.success === false &&
      resProdVercel.error === "UNAUTHORIZED_HOSTNAME",
    "9e-1. In production, arbitrary *.vercel.app is strictly rejected"
  );

  const resProdLocalhost = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "localhost",
      },
    }),
  });
  assert(
    resProdLocalhost.success === false &&
      resProdLocalhost.error === "UNAUTHORIZED_HOSTNAME",
    "9e-2. In production, localhost/loopback is strictly rejected"
  );

  (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;

  // 9f. Action validation: expected 'contact' action accepted, mismatched action rejected
  const resActionMatch = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    expectedAction: "contact",
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "www.jiosi.online",
        action: "contact",
      },
    }),
  });
  assert(
    resActionMatch.success === true && resActionMatch.action === "contact",
    "9f-1. Matching expectedAction ('contact') is accepted"
  );

  const resActionMismatch = await verifyTurnstileToken("valid-token", null, {
    customSecret: dummySecret,
    expectedAction: "contact",
    customFetcher: createMockFetcher({
      status: 200,
      body: {
        success: true,
        hostname: "www.jiosi.online",
        action: "login",
      },
    }),
  });
  assert(
    resActionMismatch.success === false &&
      resActionMismatch.error === "ACTION_MISMATCH",
    "9f-2. Action mismatch (expected 'contact', received 'login') is strictly rejected"
  );

  // --- SECTION 2: END-TO-END SERVER ACTION INTEGRATION ---
  console.log("\n--- 2. End-to-End Action Verification & Error Sanitation ---");

  // 10. Generic error returned to user on missing / invalid Turnstile token
  const formWithoutToken = new FormData();
  formWithoutToken.append("name", "Valid Sender");
  formWithoutToken.append("email", "sender@domain.com");
  formWithoutToken.append("brief", "This is a valid test brief for the project.");
  // Missing cf-turnstile-response

  const actionRes = await submitContactInquiry(
    initialContactState,
    formWithoutToken
  );
  assert(
    actionRes.status === "verification_error" &&
      (actionRes.message === "Please complete the security verification and try again." ||
        actionRes.message === "Verification failed. Please try again."),
    "10. Submission without valid Turnstile token returns generic user error"
  );

  // 11. Raw Cloudflare error details not exposed in user-facing action state
  const serialized = JSON.stringify(actionRes);
  assert(
    !serialized.includes("invalid-input-response") &&
      !serialized.includes("timeout-or-duplicate") &&
      !serialized.includes("SITEVERIFY") &&
      !serialized.includes("MISSING_TOKEN"),
    "11. Raw internal error codes are strictly excluded from client response"
  );

  // --- SECTION 3: CLIENT / SERVER BOUNDARY & SECRET PRIVACY ---
  console.log("\n--- 3. Client/Server Boundary & Secret Privacy ---");

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

  // 12. Secret key absent from client bundle
  let leakedInClient = false;
  for (const file of clientFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("TURNSTILE_SECRET_KEY")) {
      console.error(`Leaked in client file: ${file}`);
      leakedInClient = true;
    }
  }
  assert(
    !leakedInClient && clientFiles.length > 0,
    `12. TURNSTILE_SECRET_KEY is absent from all ${clientFiles.length} client components`
  );

  // 13. Secret key absent from HTML templates & render outputs
  const contactFormSrc = fs.readFileSync(
    path.resolve(__dirname, "../src/components/contact/ContactForm.tsx"),
    "utf8"
  );
  assert(
    contactFormSrc.includes("NEXT_PUBLIC_TURNSTILE_SITE_KEY") &&
      !contactFormSrc.includes("TURNSTILE_SECRET_KEY"),
    "13. ContactForm references only public site key, never secret key"
  );

  // 14. Secret key absent from logs
  const turnstileSrc = fs.readFileSync(
    path.resolve(__dirname, "../src/lib/turnstile.ts"),
    "utf8"
  );
  const contactActionSrc = fs.readFileSync(
    path.resolve(__dirname, "../src/app/actions/contact.ts"),
    "utf8"
  );
  const logsSafe =
    !turnstileSrc.includes("console.log(secretKey") &&
    !turnstileSrc.includes("console.warn(secretKey") &&
    !turnstileSrc.includes("console.error(secretKey") &&
    !turnstileSrc.includes("console.log(token") &&
    !turnstileSrc.includes("console.log(cleanToken") &&
    !contactActionSrc.includes("console.log(turnstileToken");
  assert(logsSafe, "14. Turnstile tokens and secrets are strictly excluded from console logs");

  // 15. Token not persisted in database
  assert(
    !contactActionSrc.includes("cf_turnstile_response") &&
      !contactActionSrc.includes("turnstile_token:"),
    "15. Turnstile response token is single-use and not persisted to Supabase"
  );

  // 16. Existing honeypot still works
  const formHoneypot = new FormData();
  formHoneypot.append("name", "Spam Bot");
  formHoneypot.append("email", "bot@spam.com");
  formHoneypot.append("brief", "Automated marketing spam exceeding minimum length.");
  formHoneypot.append("hp_website", "https://spamlink.xyz");

  const honeypotRes = await submitContactInquiry(
    initialContactState,
    formHoneypot
  );
  assert(
    honeypotRes.status === "success" &&
      !!honeypotRes.message?.includes("Inquiry received"),
    "16. Existing honeypot triggers silent success without triggering verification"
  );

  // 17. Existing Zod validation still works
  const formInvalidZod = new FormData();
  formInvalidZod.append("name", "A"); // too short
  formInvalidZod.append("email", "bad-email");
  formInvalidZod.append("brief", "short");

  const zodRes = await submitContactInquiry(
    initialContactState,
    formInvalidZod
  );
  assert(
    zodRes.status === "validation_error" &&
      zodRes.errors?.name !== undefined &&
      zodRes.errors?.email !== undefined &&
      zodRes.errors?.brief !== undefined,
    "17. Existing Zod validation blocks invalid submissions before verification"
  );

  // 18. Existing rate limiter still works
  clearRateLimitStore();
  const formRateLimit = new FormData();
  formRateLimit.append("name", "Rate Limited User");
  formRateLimit.append("email", "rate@domain.com");
  formRateLimit.append("brief", "Valid brief exceeding ten characters minimum.");

  let rateLimitedTriggered = false;
  for (let i = 0; i < 7; i++) {
    const res = await submitContactInquiry(initialContactState, formRateLimit);
    if (res.status === "rate_limited") {
      rateLimitedTriggered = true;
      break;
    }
  }
  assert(
    rateLimitedTriggered,
    "18. Existing rate limiter continues to block rapid submissions"
  );
  clearRateLimitStore();

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTurnstileSecuritySuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
