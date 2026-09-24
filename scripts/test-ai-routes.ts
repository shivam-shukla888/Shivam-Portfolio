import fs from "fs";
import path from "path";
import {
  STATIC_PUBLIC_ROUTES,
  PUBLIC_NAVIGATION,
  normalizeHref,
  isValidPublicRoute,
} from "../src/lib/ai/navigation";
import {
  validateAndSanitizeAssistantOutput,
} from "../src/lib/ai/knowledge";

async function runRouteIntegrationSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // AI ROUTE & NAVIGATION INTEGRATION SUITE");
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
  // SECTION 1: Static Public Route Tree Verification
  // -------------------------------------------------------------
  console.log("--- 1. Static Route Allowlist & Filesystem Verification ---");

  const expectedRoutePaths: Record<string, string> = {
    "/": "src/app/page.tsx",
    "/about": "src/app/about/page.tsx",
    "/projects": "src/app/projects/page.tsx",
    "/services": "src/app/services/page.tsx",
    "/store": "src/app/store/page.tsx",
    "/store/design": "src/app/store/design/page.tsx",
    "/store/ai-agents": "src/app/store/ai-agents/page.tsx",
    "/store/digital-products": "src/app/store/digital-products/page.tsx",
    "/contact": "src/app/contact/page.tsx",
    "/lab": "src/app/lab/page.tsx",
    "/privacy": "src/app/privacy/page.tsx",
  };

  for (const route of STATIC_PUBLIC_ROUTES) {
    const filePath = expectedRoutePaths[route];
    assert(
      Boolean(filePath && fs.existsSync(path.resolve(process.cwd(), filePath))),
      `Static route "${route}" exists in filesystem at ${filePath}`
    );
    assert(
      isValidPublicRoute(route),
      `Static route "${route}" passes isValidPublicRoute allowlist`
    );
    assert(
      normalizeHref(route) === route,
      `Static route "${route}" normalizes deterministically`
    );
  }

  // -------------------------------------------------------------
  // SECTION 2: Dynamic Route Handling & Allowlisting
  // -------------------------------------------------------------
  console.log("\n--- 2. Dynamic Route Isolation & Allowlist Testing ---");

  const mockDynamicRoutes = new Set([
    "/projects/sanjeevani-backend",
    "/projects/agentic-security-kernel",
    "/services/ai-security-audit",
    "/store/terminal-tokens",
    "/lab/distributed-consensus-notes",
  ]);

  // Valid dynamic routes must pass
  for (const validDynamic of mockDynamicRoutes) {
    assert(
      isValidPublicRoute(validDynamic, mockDynamicRoutes),
      `Published dynamic route "${validDynamic}" is allowed`
    );
  }

  // Unpublished or fake dynamic routes MUST be rejected
  const fakeDynamicRoutes = [
    "/projects/unknown-fake-project",
    "/services/non-existent-service",
    "/store/phantom-product",
    "/lab/secret-unpublished-draft",
    "/projects/fake-dynamic-slug",
    "/services//fake",
  ];

  for (const fake of fakeDynamicRoutes) {
    assert(
      !isValidPublicRoute(fake, mockDynamicRoutes),
      `Unpublished/fake route "${fake}" is strictly rejected`
    );
  }

  // -------------------------------------------------------------
  // SECTION 3: Malformed & Malicious Link Protection
  // -------------------------------------------------------------
  console.log("\n--- 3. Malformed Link & Attack Vector Rejection ---");

  const maliciousVectors = [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "//evil.com",
    "https://evil.com",
    "http://evil.com",
    "/admin",
    "/admin/contact",
    "/admin/profile",
    "/admin/projects/new",
    "/api/assistant",
    "/api/contact",
    "/../../admin",
    "/%2F%2Fevil.com",
    "/%5c%5cevil.com",
    "\\about",
    "/about\\evil",
    "vbscript:msgbox(1)",
    "/about/../../admin",
  ];

  for (const vector of maliciousVectors) {
    assert(
      !isValidPublicRoute(vector, mockDynamicRoutes),
      `Malicious/forbidden vector "${vector}" rejected by isValidPublicRoute`
    );

    // Also verify output sanitizer strips it from markdown links
    const sanitized = validateAndSanitizeAssistantOutput(
      `Check this: [Explore](${vector})`,
      mockDynamicRoutes
    );
    assert(
      !sanitized.includes(`(${vector})`) && !sanitized.includes("href"),
      `Sanitizer stripped unauthorized link syntax for: ${vector}`
    );
  }

  // Trailing punctuation normalization
  const punctuationVariants = [
    { input: "/about.", expected: "/about" },
    { input: "/about)", expected: "/about" },
    { input: "/about]", expected: "/about" },
    { input: "/about,", expected: "/about" },
    { input: "/about:", expected: "/about" },
    { input: "/about;", expected: "/about" },
    { input: "/about/", expected: "/about" },
    { input: "/about%20", expected: "/about" },
    { input: "/about\u200B", expected: "/about" },
  ];

  for (const { input, expected } of punctuationVariants) {
    const normalized = normalizeHref(input);
    assert(
      normalized === expected,
      `Punctuation variant "${input}" normalizes to "${expected}"`
    );
    assert(
      isValidPublicRoute(input),
      `Input "${input}" successfully resolves to valid public route`
    );
  }

  // -------------------------------------------------------------
  // SECTION 4: Reproduction & Fix of Exact User-Reported Bug
  // -------------------------------------------------------------
  console.log("\n--- 4. Exact User-Reported Bug Reproduction & Verification ---");

  // Format 1: Text-based navigation format reported by user
  const rawUserBugText = `### Where to learn more

- Home: /
- About: /about
- Contact: /contact`;

  const sanitizedUserBug = validateAndSanitizeAssistantOutput(rawUserBugText);

  assert(
    sanitizedUserBug.includes("[Home](/)"),
    "User bug format converts Home to verified markdown link [Home](/)"
  );
  assert(
    sanitizedUserBug.includes("[About](/about)"),
    "User bug format converts About to verified markdown link [About](/about)"
  );
  assert(
    sanitizedUserBug.includes("[Contact](/contact)"),
    "User bug format converts Contact to verified markdown link [Contact](/contact)"
  );

  // Format 2: Markdown link format
  const rawMarkdownLinks = `### Where to learn more

- [Home](/)
- [About](/about)
- [Services](/services)
- [Store](/store)
- [Contact](/contact)`;

  const sanitizedMarkdown = validateAndSanitizeAssistantOutput(rawMarkdownLinks);
  assert(
    sanitizedMarkdown.includes("[Home](/)") &&
      sanitizedMarkdown.includes("[About](/about)") &&
      sanitizedMarkdown.includes("[Services](/services)") &&
      sanitizedMarkdown.includes("[Store](/store)") &&
      sanitizedMarkdown.includes("[Contact](/contact)"),
    "All allowlisted markdown navigation destinations preserved cleanly"
  );

  // Format 3: Punctuation trailing user error reproduction
  const punctuatedLink = "Visit [About ShivSastra](/about.) or reach out at [Contact](/contact.)";
  const sanitizedPunctuated = validateAndSanitizeAssistantOutput(punctuatedLink);
  assert(
    sanitizedPunctuated.includes("[About ShivSastra](/about)") &&
      sanitizedPunctuated.includes("[Contact](/contact)"),
    "Trailing periods inside link URLs normalized to prevent 404s"
  );

  // -------------------------------------------------------------
  // SECTION 5: Controlled Public Navigation Definition
  // -------------------------------------------------------------
  console.log("\n--- 5. Controlled PUBLIC_NAVIGATION Registry ---");

  for (const [key, dest] of Object.entries(PUBLIC_NAVIGATION)) {
    assert(
      Boolean(dest.label && dest.href && dest.description),
      `PUBLIC_NAVIGATION[${key}] has label, href, and description`
    );
    assert(
      isValidPublicRoute(dest.href),
      `PUBLIC_NAVIGATION[${key}] href "${dest.href}" is in valid public route allowlist`
    );
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runRouteIntegrationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
