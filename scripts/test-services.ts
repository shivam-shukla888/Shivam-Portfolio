import {
  getPublishedServices,
  getPublishedServiceBySlug,
} from "../src/lib/services";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runServicesIntegrationSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // SERVICES PUBLIC SITE INTEGRATION SUITE");
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
  // TEST D: SUPABASE UNAVAILABLE / UNCONFIGURED (GRACEFUL DEGRADATION)
  // -------------------------------------------------------------
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const offlineList = await getPublishedServices();
  assert(
    Array.isArray(offlineList) && offlineList.length === 0,
    "D.1 Unconfigured environment returns empty array for getPublishedServices"
  );

  const offlineSlug = await getPublishedServiceBySlug("any-slug");
  assert(
    offlineSlug === null,
    "D.2 Unconfigured environment returns null for getPublishedServiceBySlug"
  );

  // Unreachable / malformed host
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://invalid-non-existent-subdomain.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";
  resetSupabaseServerClient();

  const networkErrList = await getPublishedServices();
  assert(
    Array.isArray(networkErrList) && networkErrList.length === 0,
    "D.3 Unreachable host degrades gracefully to empty array without throwing"
  );

  const networkErrSlug = await getPublishedServiceBySlug("any-slug");
  assert(
    networkErrSlug === null,
    "D.4 Unreachable host degrades gracefully to null for slug query without throwing"
  );

  // -------------------------------------------------------------
  // TEST A: NO ACTIVE SERVICES (LIVE DATABASE EMPTY STATE)
  // -------------------------------------------------------------
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://vahalxnimswrhmoyzbse.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGFseG5pbXN3cmhtb3l6YnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzUwNTksImV4cCI6MjEwNTY1MTA1OX0.7RzKO58zXuZ_zfulPypETCnwVACba3Iy9uw_7rC1LDk";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const liveList = await getPublishedServices();
  assert(
    Array.isArray(liveList),
    "A.1 Live query returns valid array of services"
  );

  const nonExistentSlug = await getPublishedServiceBySlug("non-existent-service-xyz");
  assert(
    nonExistentSlug === null,
    "A.2 Non-existent slug query returns null (triggers notFound)"
  );

  // -------------------------------------------------------------
  // TEST B & C: POPULATED TEST SPECIMEN VERIFICATION
  // (Evaluated when test records are present in the active database)
  // -------------------------------------------------------------
  const activeAlpha = await getPublishedServiceBySlug("test-active-service-alpha");
  const inactiveGamma = await getPublishedServiceBySlug("test-inactive-service-gamma");

  if (activeAlpha) {
    assert(
      activeAlpha.slug === "test-active-service-alpha" &&
      activeAlpha.title === "TEST_SERVICE_TITLE_ALPHA" &&
      activeAlpha.programCode === "PRG-001" &&
      activeAlpha.summary === "TEST_SERVICE_SUMMARY_ALPHA" &&
      activeAlpha.descriptionMarkdown === "TEST_SERVICE_DESCRIPTION_ALPHA" &&
      activeAlpha.engagementModel === "TEST_ENGAGEMENT_MODEL_ALPHA" &&
      activeAlpha.deliverables.length === 3 &&
      activeAlpha.deliverables[0] === "Architecture Specification" &&
      activeAlpha.isActive === true &&
      activeAlpha.sortOrder === 1,
      "B.1 All mapped service fields and deliverables are accurately retrieved"
    );

    const activeBeta = await getPublishedServiceBySlug("test-active-service-beta");
    assert(
      activeBeta !== null &&
      Array.isArray(activeBeta.deliverables) &&
      activeBeta.deliverables.length === 0,
      "B.2 Service with empty deliverables preserves empty array without error"
    );

    // TEST C: Inactive service must NEVER be exposed
    assert(
      inactiveGamma === null,
      "C.1 Direct slug query for inactive service strictly returns null (no inactive leakage)"
    );

    const fullPublicList = await getPublishedServices();
    assert(
      !fullPublicList.some((s) => s.slug === "test-inactive-service-gamma"),
      "C.2 Public service list strictly excludes inactive service"
    );

    // Verify ordering: sort_order 1 before sort_order 2
    const alphaIndex = fullPublicList.findIndex((s) => s.slug === "test-active-service-alpha");
    const betaIndex = fullPublicList.findIndex((s) => s.slug === "test-active-service-beta");
    assert(
      alphaIndex !== -1 && betaIndex !== -1 && alphaIndex < betaIndex,
      "B.3 Deterministic ordering verified (sort_order 1 appears before sort_order 2)"
    );
  } else {
    console.log("ℹ Note: Controlled test specimens not currently present in DB (skipping live fixture assertions).");
  }

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

runServicesIntegrationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
