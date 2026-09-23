import fs from "fs";
import path from "path";
import { getPublishedServices, getPublishedServiceBySlug } from "../src/lib/services";
import { createClient } from "@supabase/supabase-js";

function getLocalSupabaseEnv(): { url: string; anonKey: string; serviceRoleKey?: string } {
  const envPath = path.resolve(__dirname, "../.env.local");
  const content = fs.readFileSync(envPath, "utf8");
  const parsed: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      parsed[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
  }

  const url = parsed.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = parsed.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  if (anonKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;
  if (serviceRoleKey) process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;

  if (!url || !anonKey) {
    throw new Error("Supabase credentials missing in .env.local");
  }

  return { url, anonKey, serviceRoleKey };
}

const env = getLocalSupabaseEnv();

let passed = 0;
let failed = 0;

function assert(condition: unknown, message: string) {
  if (Boolean(condition)) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

async function runPhase28TestSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // PHASE 28 SERVICES ARCHITECTURE SUITE");
  console.log("=======================================================\n");

  // 1. LIVE DATABASE STATUS
  console.log("--- 1. Live Database Invariants ---");
  const supabase = createClient(env.url, env.serviceRoleKey || env.anonKey);
  const { count, error } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  assert(!error, "1.1 Supabase services query succeeds without error");
  assert(count === 0, `1.2 Live database 'services' table count is strictly 0 (found: ${count})`);

  // 2. PUBLIC QUERY & EDITORIAL PENDING STATE
  console.log("\n--- 2. Public Services Archive & Editorial State ---");
  const publishedServices = await getPublishedServices();
  assert(
    Array.isArray(publishedServices) && publishedServices.length === 0,
    "2.1 getPublishedServices() returns empty array (zero live services)"
  );

  const servicesPagePath = path.resolve(__dirname, "../src/app/services/page.tsx");
  const servicesPageContent = fs.readFileSync(servicesPagePath, "utf8");

  assert(
    !servicesPageContent.includes("[1, 2, 3].map"),
    "2.2 Legacy [1, 2, 3] fake pending cards eliminated from /services"
  );
  assert(
    servicesPageContent.includes("BACKEND SYSTEMS") &&
    servicesPageContent.includes("AGENTIC AI") &&
    servicesPageContent.includes("AI SECURITY"),
    "2.3 Three core technical domains present in /services architecture"
  );
  assert(
    servicesPageContent.includes("WORK WITH SHIVAM") &&
    servicesPageContent.includes("Looking to purchase digital tools? Visit Store"),
    "2.4 Services vs Store distinction clearly communicated on /services"
  );
  assert(
    servicesPageContent.includes("canonical: \"/services\""),
    "2.5 Canonical URL tag configured for /services"
  );

  // 3. SERVICE DETAIL PAGE INVARIANTS
  console.log("\n--- 3. Public Service Detail Page Invariants ---");
  const nonExistent = await getPublishedServiceBySlug("non-existent-service");
  assert(nonExistent === null, "3.1 Non-existent service slug returns null from query");

  const serviceDetailPath = path.resolve(__dirname, "../src/app/services/[slug]/page.tsx");
  const serviceDetailContent = fs.readFileSync(serviceDetailPath, "utf8");

  assert(
    serviceDetailContent.includes("notFound()") &&
    serviceDetailContent.includes("if (!service || !service.isActive)"),
    "3.2 Inactive or missing service strictly triggers notFound() (404)"
  );
  assert(
    serviceDetailContent.includes("alternates: {\n      canonical: `/services/${service.slug}`"),
    "3.3 Dynamic canonical URL tag configured on /services/[slug]"
  );
  assert(
    serviceDetailContent.includes("Discuss a Project →") ||
    serviceDetailContent.includes("Start a Conversation →"),
    "3.4 Neutral CTA used on service detail page (no guaranteed quotes or fake urgency)"
  );

  // 4. HOMEPAGE SERVICES SECTION
  console.log("\n--- 4. Homepage Services Section (Disciplines & Positioning) ---");
  const homepagePath = path.resolve(__dirname, "../src/app/page.tsx");
  const homepageContent = fs.readFileSync(homepagePath, "utf8");

  assert(
    homepageContent.includes('id="services"'),
    "4.1 Homepage contains #services section anchor"
  );
  assert(
    homepageContent.includes("Work with Shivam Shukla · Bespoke Scopes & Advisory"),
    "4.2 Homepage services section clearly frames 'Work with Shivam'"
  );
  assert(
    homepageContent.includes("Backend Systems") &&
    homepageContent.includes("Agentic AI") &&
    homepageContent.includes("AI Security"),
    "4.3 Homepage services section articulates the three technical domains"
  );
  assert(
    homepageContent.includes("Services represent bespoke scopes where you work directly WITH Shivam"),
    "4.4 Homepage explicitly explains the distinction between Services and Store"
  );

  // 5. ADMIN SERVICES CONFIGURATION & GUIDANCE
  console.log("\n--- 5. Admin Form Guidance & Integrity ---");
  const formPath = path.resolve(__dirname, "../src/components/admin/ServiceForm.tsx");
  const formContent = fs.readFileSync(formPath, "utf8");

  assert(
    formContent.includes("Fixed Scope, Project-Based, Consulting, Custom Engagement"),
    "5.1 Admin form provides clear guidance on supported engagement models"
  );
  assert(
    formContent.includes("Factual capabilities only — do not claim unverified certifications"),
    "5.2 Admin form contains explicit anti-hallucination warning for descriptions"
  );
  assert(
    formContent.includes("no fake metrics or unverified certifications"),
    "5.3 Admin form contains explicit anti-hallucination warning for deliverables"
  );

  // 6. ROUTE PRESENCE
  console.log("\n--- 6. Route Files Presence ---");
  const routesToCheck = [
    "src/app/services/page.tsx",
    "src/app/services/[slug]/page.tsx",
    "src/app/admin/services/page.tsx",
    "src/app/admin/services/new/page.tsx",
    "src/app/admin/services/[id]/edit/page.tsx",
    "src/app/actions/admin-services.ts",
    "src/lib/services.ts",
    "src/lib/admin/services.ts",
    "src/lib/validations/admin-service.ts",
  ];

  for (const r of routesToCheck) {
    const full = path.resolve(__dirname, "..", r);
    assert(fs.existsSync(full), `6. File exists: ${r}`);
  }

  // 7. POST-CHECK DATABASE COUNT
  console.log("\n--- 7. Post-Test DB Row Count Invariant ---");
  const { count: finalCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });
  assert(finalCount === 0, `7.1 Live database 'services' table count remains 0 after all checks (count: ${finalCount})`);

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPhase28TestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
