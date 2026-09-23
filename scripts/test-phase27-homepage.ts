import fs from "fs";
import path from "path";

const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { createClient } from "@supabase/supabase-js";

async function runPhase27Tests() {
  console.log("=== SHIVSASTRA PHASE 27: PERSONAL BRAND POSITIONING & HOMEPAGE SUITE ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  const pagePath = path.resolve(process.cwd(), "src/app/page.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf8");

  const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
  const layoutContent = fs.readFileSync(layoutPath, "utf8");
  assert(
    layoutContent.includes("Shivam Shukla — Backend Systems, Agentic AI & AI Security"),
    "0.1 Root layout metadata default title aligns with primary brand positioning"
  );

  const navbarPath = path.resolve(process.cwd(), "src/components/layout/Navbar.tsx");
  const navbarContent = fs.readFileSync(navbarPath, "utf8");

  const footerPath = path.resolve(process.cwd(), "src/components/layout/Footer.tsx");
  const footerContent = fs.readFileSync(footerPath, "utf8");

  // 1. Core Brand Positioning: "Backend Systems · Agentic AI · AI Security"
  assert(
    pageContent.includes("Backend Systems · Agentic AI · AI Security"),
    "1.1 Primary technical positioning 'Backend Systems · Agentic AI · AI Security' is prominent"
  );
  assert(
    !pageContent.includes("Backend Engineer + AI Agent Engineer + AI Security"),
    "1.2 Job-title headline format is strictly avoided"
  );

  // 2. Supporting Statement
  assert(
    pageContent.includes(
      "Building intelligent systems, AI agents, and security-focused software — and creating useful digital work along the way."
    ),
    "2.1 Approved dual-identity supporting statement is present in Hero"
  );

  // 3. Hero CTAs: Explore My Work AND Visit Store
  assert(
    pageContent.includes("Explore My Work →") &&
      pageContent.includes("Visit Store →"),
    "3.1 Hero contains both 'Explore My Work →' and 'Visit Store →' actions on screen 1"
  );

  // 4. "What I Build" Section
  assert(
    pageContent.includes("What I Build") &&
      pageContent.includes("Backend Systems") &&
      pageContent.includes("Agentic AI") &&
      pageContent.includes("AI Security"),
    "4.1 'What I Build' section introduces the 3 technical disciplines"
  );

  // 5. "THE STORE" Section
  assert(
    pageContent.includes("THE STORE") &&
      pageContent.includes("Digital work, tools, and resources.") &&
      pageContent.includes("VISIT STORE →"),
    "5.1 Prominent 'THE STORE' discovery section is present with large CTA"
  );
  assert(
    pageContent.includes("/store/design") &&
      pageContent.includes("/store/ai-agents") &&
      pageContent.includes("/store/digital-products"),
    "5.2 Store discovery links to all 3 category hubs"
  );

  // 6. Zero Fake Placeholder Cards
  assert(
    !pageContent.includes("[1, 2, 3].map") &&
      !pageContent.includes("[Project title pending]") &&
      !pageContent.includes("[Service title pending]") &&
      !pageContent.includes("[Product title pending]"),
    "6.1 Zero fake placeholder loops: '[1, 2, 3]' pending loops eliminated from homepage"
  );

  // 7. Schema.org Structured Data
  assert(
    pageContent.includes('application/ld+json') &&
      pageContent.includes('"@type": "Person"') &&
      pageContent.includes('"@type": "WebSite"'),
    "7.1 Valid Schema.org Person and WebSite JSON-LD present on homepage"
  );

  // 8. Canonical URLs
  assert(
    pageContent.includes('canonical: "https://shivsastra.com"'),
    "8.1 Homepage canonical declared"
  );

  const storePageContent = fs.readFileSync(
    path.resolve(process.cwd(), "src/app/store/page.tsx"),
    "utf8"
  );
  assert(
    storePageContent.includes('canonical: "https://shivsastra.com/store"'),
    "8.2 /store canonical declared"
  );

  const designPageContent = fs.readFileSync(
    path.resolve(process.cwd(), "src/app/store/design/page.tsx"),
    "utf8"
  );
  assert(
    designPageContent.includes('canonical: "https://shivsastra.com/store/design"'),
    "8.3 /store/design canonical declared"
  );

  const agentsPageContent = fs.readFileSync(
    path.resolve(process.cwd(), "src/app/store/ai-agents/page.tsx"),
    "utf8"
  );
  assert(
    agentsPageContent.includes('canonical: "https://shivsastra.com/store/ai-agents"'),
    "8.4 /store/ai-agents canonical declared"
  );

  const digitalPageContent = fs.readFileSync(
    path.resolve(process.cwd(), "src/app/store/digital-products/page.tsx"),
    "utf8"
  );
  assert(
    digitalPageContent.includes(
      'canonical: "https://shivsastra.com/store/digital-products"'
    ),
    "8.5 /store/digital-products canonical declared"
  );

  // 9. Navbar & Footer
  assert(
    navbarContent.includes('label: "Store"') && navbarContent.includes("isStore"),
    "9.1 Navbar contains Store with subtle visual emphasis"
  );
  assert(
    footerContent.includes("/store/design") &&
      footerContent.includes("/store/ai-agents") &&
      footerContent.includes("/store/digital-products"),
    "9.2 Footer contains deep internal links to all 3 Store category hubs"
  );

  // 10. Live Database Content Safety
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey) {
    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { count: prodCount } = await client
      .from("public_products")
      .select("*", { count: "exact", head: true });
    assert(
      (prodCount ?? 0) === 0,
      `10.1 ZERO FAKE CONTENT: products row count is 0 (actual: ${prodCount})`
    );

    const { count: projCount } = await client
      .from("projects")
      .select("*", { count: "exact", head: true });
    assert(
      (projCount ?? 0) === 0,
      `10.2 ZERO FAKE CONTENT: projects row count is 0 (actual: ${projCount})`
    );

    const { count: servCount } = await client
      .from("services")
      .select("*", { count: "exact", head: true });
    assert(
      (servCount ?? 0) === 0,
      `10.3 ZERO FAKE CONTENT: services row count is 0 (actual: ${servCount})`
    );

    const { count: revCount } = await client
      .from("product_reviews")
      .select("*", { count: "exact", head: true });
    assert(
      (revCount ?? 0) === 0,
      `10.4 ZERO FAKE CONTENT: product_reviews row count is 0 (actual: ${revCount})`
    );
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runPhase27Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
