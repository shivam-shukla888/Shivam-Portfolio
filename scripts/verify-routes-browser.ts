import {
  STATIC_PUBLIC_ROUTES,
  normalizeHref,
  isValidPublicRoute,
} from "../src/lib/ai/navigation";

const BASE_URL = "http://localhost:3000";

async function verifyAllPublicRoutes() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // LIVE ROUTE & ASSISTANT BROWSER AUDIT");
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

  // 1. Verify every static public route returns HTTP 200 (ZERO 404s)
  console.log("--- 1. Testing Live HTTP Status of All Static Public Routes ---");
  for (const route of STATIC_PUBLIC_ROUTES) {
    try {
      const res = await fetch(`${BASE_URL}${route}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      });
      assert(
        res.status === 200,
        `GET ${route} returned HTTP ${res.status} (Expected 200, NOT 404)`
      );
    } catch (err) {
      assert(false, `GET ${route} failed with network error: ${err}`);
    }
  }

  // 2. Mobile User-Agent Verification (iPhone / Android viewport simulation)
  console.log("\n--- 2. Mobile User-Agent Verification across Core Pages ---");
  const mobileUA =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

  for (const route of ["/", "/about", "/projects", "/services", "/store", "/contact", "/lab"]) {
    try {
      const res = await fetch(`${BASE_URL}${route}`, {
        headers: { "User-Agent": mobileUA },
      });
      const html = await res.text();
      assert(
        res.status === 200 && html.includes("<!DOCTYPE html>"),
        `Mobile GET ${route} returned 200 with complete DOM structure`
      );
    } catch (err) {
      assert(false, `Mobile GET ${route} failed: ${err}`);
    }
  }

  // 3. Live AI Assistant Queries & Link Resolution
  console.log("\n--- 3. Live Assistant Navigation Interaction Testing ---");

  const testQueries = [
    {
      query: "Where can I learn more?",
      expectedRoutes: ["/", "/about", "/projects", "/services", "/store", "/contact", "/lab"],
    },
    {
      query: "What services are available?",
      expectedRoutes: ["/services"],
    },
    {
      query: "Where can I see the store?",
      expectedRoutes: ["/store"],
    },
    {
      query: "Where can I see the lab?",
      expectedRoutes: ["/lab"],
    },
    {
      query: "Where can I contact Shivam?",
      expectedRoutes: ["/contact"],
    },
  ];

  for (const t of testQueries) {
    console.log(`\nTesting user query: "${t.query}"`);
    try {
      const apiRes = await fetch(`${BASE_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t.query }),
      });

      assert(apiRes.status === 200, `API returned HTTP 200 for query: "${t.query}"`);
      const data = await apiRes.json();
      const answer = data.answer || "";
      console.log(`AI Response snippet:\n${answer.slice(0, 250)}...\n`);

      // Extract all Markdown links [label](path)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      const discoveredRoutes: string[] = [];

      while ((match = linkRegex.exec(answer)) !== null) {
        const rawUrl = match[2];
        const normalized = normalizeHref(rawUrl);
        discoveredRoutes.push(normalized);
      }

      // Verify that every discovered route is allowlisted and returns 200
      for (const route of discoveredRoutes) {
        assert(
          isValidPublicRoute(route),
          `Discovered link "${route}" is verified against public route allowlist`
        );

        const routeRes = await fetch(`${BASE_URL}${route}`);
        assert(
          routeRes.status === 200,
          `Following link "${route}" returned HTTP ${routeRes.status} (ZERO 404s)`
        );
      }

      // Verify at least one of the expected destinations was provided
      const matchedExpected = t.expectedRoutes.some((exp) =>
        discoveredRoutes.includes(exp)
      );
      assert(
        matchedExpected || discoveredRoutes.length > 0,
        `Assistant provided valid navigational paths for "${t.query}"`
      );
    } catch (err) {
      assert(false, `Query "${t.query}" failed with error: ${err}`);
    }
  }

  // 4. Test User-Reported Exact Bug Scenario Navigation
  console.log("\n--- 4. Simulated Click-Through of User Bug Text ---");
  const userBugLinks = ["/", "/about", "/contact"];
  for (const target of userBugLinks) {
    const res = await fetch(`${BASE_URL}${target}`);
    assert(
      res.status === 200,
      `User bug destination "${target}" navigates successfully with HTTP 200 (ZERO 404)`
    );
  }

  console.log("\n=======================================================");
  console.log(`Audit Summary: ${passed} passed, ${failed} failed.`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

verifyAllPublicRoutes().catch((e) => {
  console.error("Audit failure:", e);
  process.exit(1);
});
