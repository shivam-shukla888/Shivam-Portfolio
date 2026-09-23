import {
  getPublishedLabEntries,
  getPublishedLabEntryBySlug,
} from "../src/lib/lab";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runLabIntegrationSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // PERSONAL LAB PUBLIC INTEGRATION SUITE");
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
  // TEST F: SUPABASE UNAVAILABLE / UNCONFIGURED (GRACEFUL DEGRADATION)
  // -------------------------------------------------------------
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const offlineList = await getPublishedLabEntries();
  assert(
    Array.isArray(offlineList) && offlineList.length === 0,
    "F.1 Unconfigured environment returns empty array for getPublishedLabEntries"
  );

  const offlineSlug = await getPublishedLabEntryBySlug("any-slug");
  assert(
    offlineSlug === null,
    "F.2 Unconfigured environment returns null for getPublishedLabEntryBySlug"
  );

  // Unreachable / malformed host
  process.env.NEXT_PUBLIC_SUPABASE_URL =
    "https://invalid-non-existent-subdomain.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";
  resetSupabaseServerClient();

  const networkErrList = await getPublishedLabEntries();
  assert(
    Array.isArray(networkErrList) && networkErrList.length === 0,
    "F.3 Unreachable host degrades gracefully to empty array without throwing"
  );

  const networkErrSlug = await getPublishedLabEntryBySlug("any-slug");
  assert(
    networkErrSlug === null,
    "F.4 Unreachable host degrades gracefully to null for slug query without throwing"
  );

  // -------------------------------------------------------------
  // TEST A: EMPTY LAB / LIVE DATABASE CATALOG VERIFICATION
  // -------------------------------------------------------------
  process.env.NEXT_PUBLIC_SUPABASE_URL =
    "https://vahalxnimswrhmoyzbse.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGFseG5pbXN3cmhtb3l6YnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzUwNTksImV4cCI6MjEwNTY1MTA1OX0.7RzKO58zXuZ_zfulPypETCnwVACba3Iy9uw_7rC1LDk";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const liveList = await getPublishedLabEntries();
  assert(
    Array.isArray(liveList),
    "A.1 Live query returns valid array of lab entries"
  );

  const nonExistentSlug = await getPublishedLabEntryBySlug(
    "non-existent-lab-study-xyz"
  );
  assert(
    nonExistentSlug === null,
    "A.2 Non-existent slug query returns null (triggers notFound)"
  );

  // -------------------------------------------------------------
  // TEST B, C, D, E: CONTROLLED TEST FIXTURE ASSERTIONS
  // (Evaluated when test fixtures are present in active database)
  // -------------------------------------------------------------
  const publishedAlpha = await getPublishedLabEntryBySlug(
    "test-published-entry-alpha"
  );
  const privateEntryC = await getPublishedLabEntryBySlug(
    "test-private-entry-c"
  );
  const unpublishedEntryD = await getPublishedLabEntryBySlug(
    "test-unpublished-entry-d"
  );
  const privatePublishedE = await getPublishedLabEntryBySlug(
    "test-private-published-entry-e"
  );

  if (publishedAlpha) {
    // TEST B: Published public entry
    assert(
      publishedAlpha.slug === "test-published-entry-alpha" &&
        publishedAlpha.title === "TEST_LAB_TITLE_ALPHA" &&
        publishedAlpha.category === "build" &&
        publishedAlpha.status === "experimental" &&
        publishedAlpha.contentMarkdown === "TEST_LAB_CONTENT_ALPHA" &&
        publishedAlpha.isPublic === true &&
        publishedAlpha.publishedAt !== null,
      "B.1 All public lab fields and metadata map accurately to display object"
    );

    assert(
      Array.isArray(publishedAlpha.tags) &&
        publishedAlpha.tags.length === 3 &&
        publishedAlpha.tags[0] === "wasm" &&
        publishedAlpha.tags[1] === "compiler" &&
        publishedAlpha.tags[2] === "distributed",
      "B.2 Postgres text[] tags preserve exact order and content"
    );

    // TEST C: Private entry (is_public = false, published_at is set)
    assert(
      privateEntryC === null,
      "C.1 Direct slug query for private entry strictly returns null (no leakage)"
    );

    // TEST D: Unpublished entry (is_public = true, published_at is null)
    assert(
      unpublishedEntryD === null,
      "D.1 Direct slug query for unpublished entry strictly returns null (no leakage)"
    );

    // TEST E: Published but private entry (is_public = false, status = 'published')
    assert(
      privatePublishedE === null,
      "E.1 Direct slug query for private published entry strictly returns null"
    );

    // Verify collection filtering
    const catalog = await getPublishedLabEntries();
    assert(
      !catalog.some((e) => e.slug === "test-private-entry-c") &&
        !catalog.some((e) => e.slug === "test-unpublished-entry-d") &&
        !catalog.some((e) => e.slug === "test-private-published-entry-e"),
      "C/D/E.2 Collection strictly excludes private, unpublished, and private-published entries"
    );

    // Verify ordering if beta fixture exists
    const publishedBeta = catalog.find(
      (e) => e.slug === "test-published-entry-beta"
    );
    if (publishedBeta) {
      const alphaIndex = catalog.findIndex(
        (e) => e.slug === "test-published-entry-alpha"
      );
      const betaIndex = catalog.findIndex(
        (e) => e.slug === "test-published-entry-beta"
      );
      // alpha was published more recently than beta
      assert(
        alphaIndex !== -1 && betaIndex !== -1 && alphaIndex < betaIndex,
        "B.3 Deterministic ordering verified (published_at DESC puts newer entry first)"
      );
    }
  } else {
    console.log(
      "ℹ Note: Controlled test specimens not currently present in DB (skipping live fixture assertions)."
    );
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

runLabIntegrationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
