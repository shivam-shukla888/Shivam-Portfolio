import {
  getPublishedProjects,
  getPublishedProjectBySlug,
} from "../src/lib/projects";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runProjectsIntegrationSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // PROJECTS PUBLIC SITE INTEGRATION SUITE");
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

  const offlineList = await getPublishedProjects();
  assert(
    Array.isArray(offlineList) && offlineList.some((p) => p.slug === "yojna-setu"),
    "D.1 Unconfigured environment returns canonical published projects (yojna-setu)"
  );

  const offlineSlug = await getPublishedProjectBySlug("any-non-existent-slug");
  assert(
    offlineSlug === null,
    "D.2 Unconfigured environment returns null for non-existent slug query"
  );

  // Unreachable / malformed host
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://invalid-non-existent-subdomain.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";
  resetSupabaseServerClient();

  const networkErrList = await getPublishedProjects();
  assert(
    Array.isArray(networkErrList) && networkErrList.some((p) => p.slug === "yojna-setu"),
    "D.3 Unreachable host degrades gracefully to canonical published projects without throwing"
  );

  const networkErrSlug = await getPublishedProjectBySlug("any-non-existent-slug");
  assert(
    networkErrSlug === null,
    "D.4 Unreachable host degrades gracefully to null for non-existent slug query without throwing"
  );

  // -------------------------------------------------------------
  // TEST A: NO PUBLISHED PROJECTS (LIVE DATABASE EMPTY STATE)
  // -------------------------------------------------------------
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://vahalxnimswrhmoyzbse.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGFseG5pbXN3cmhtb3l6YnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzUwNTksImV4cCI6MjEwNTY1MTA1OX0.7RzKO58zXuZ_zfulPypETCnwVACba3Iy9uw_7rC1LDk";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const liveList = await getPublishedProjects();
  assert(
    Array.isArray(liveList),
    "A.1 Live query returns valid array of projects"
  );

  const nonExistentSlug = await getPublishedProjectBySlug("non-existent-project-xyz");
  assert(
    nonExistentSlug === null,
    "A.2 Non-existent slug query returns null (triggers notFound)"
  );

  const yojnaSetuProject = await getPublishedProjectBySlug("yojna-setu");
  assert(
    yojnaSetuProject !== null &&
    yojnaSetuProject.slug === "yojna-setu" &&
    yojnaSetuProject.title === "Yojna Setu" &&
    yojnaSetuProject.isFeatured === true,
    "A.3 Canonical Yojna Setu slug resolves successfully with correct metadata"
  );

  // Import and verify YOJNA_SETU_DATA simplified structures
  const { YOJNA_SETU_DATA } = await import("../src/data/projects/yojna-setu-data");
  const totalCatTests = YOJNA_SETU_DATA.testCategories.reduce((acc, c) => acc + c.count, 0);
  assert(
    totalCatTests === 42 && YOJNA_SETU_DATA.testCategories.length === 4,
    "A.4 Simplified test suite correctly aggregates exactly 42 tests across 4 human categories"
  );
  assert(
    YOJNA_SETU_DATA.forensicAudit.length === 5,
    "A.5 Forensic audit displays exactly 5 prioritized engineering changes"
  );

  // -------------------------------------------------------------
  // TEST B & C: POPULATED TEST SPECIMEN VERIFICATION
  // (Evaluated when test records are present in the active database)
  // -------------------------------------------------------------
  const publishedAlpha = await getPublishedProjectBySlug("test-published-featured-specimen");
  const unpublishedDraft = await getPublishedProjectBySlug("test-unpublished-draft-specimen");

  if (publishedAlpha) {
    assert(
      publishedAlpha.slug === "test-published-featured-specimen" &&
      publishedAlpha.title === "TEST_PUBLISHED_PROJECT_TITLE_ALPHA" &&
      publishedAlpha.editionCode === "ED-001" &&
      publishedAlpha.summary === "TEST_PUBLISHED_SUMMARY_ALPHA" &&
      publishedAlpha.caseStudyMarkdown === "TEST_CASE_STUDY_MONOGRAPH_ALPHA" &&
      publishedAlpha.coverImageUrl === "https://example.com/specimen-alpha.jpg" &&
      publishedAlpha.category === "ARCHITECTURE" &&
      publishedAlpha.techStack.includes("TypeScript") &&
      publishedAlpha.projectYear === 2026 &&
      publishedAlpha.liveUrl === "https://alpha.example.com" &&
      publishedAlpha.githubUrl === "https://github.com/example/alpha" &&
      publishedAlpha.isFeatured === true &&
      publishedAlpha.sortOrder === 1,
      "B.1 All mapped project fields are accurately retrieved"
    );

    const publishedStandard = await getPublishedProjectBySlug("test-published-standard-specimen");
    assert(
      publishedStandard !== null && publishedStandard.isFeatured === false,
      "B.2 Non-featured published project accurately retrieved"
    );

    const featuredList = await getPublishedProjects({ featuredOnly: true });
    assert(
      featuredList.some((p) => p.slug === "test-published-featured-specimen") &&
      !featuredList.some((p) => p.slug === "test-published-standard-specimen"),
      "B.3 Featured filter restricts results strictly to is_featured = true"
    );

    // TEST C: Unpublished project must NEVER be exposed
    assert(
      unpublishedDraft === null,
      "C.1 Direct slug query for unpublished project strictly returns null (no draft leakage)"
    );

    const fullPublicList = await getPublishedProjects();
    assert(
      !fullPublicList.some((p) => p.slug === "test-unpublished-draft-specimen"),
      "C.2 Public project list strictly excludes unpublished draft project"
    );

    // Verify ordering: sort_order 1 before sort_order 2
    const alphaIndex = fullPublicList.findIndex((p) => p.slug === "test-published-featured-specimen");
    const betaIndex = fullPublicList.findIndex((p) => p.slug === "test-published-standard-specimen");
    assert(
      alphaIndex !== -1 && betaIndex !== -1 && alphaIndex < betaIndex,
      "B.4 Deterministic ordering verified (sort_order 1 appears before sort_order 2)"
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

runProjectsIntegrationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
