import {
  getPublishedStoreProducts,
  getPublishedStoreProductBySlug,
  formatPrice,
} from "../src/lib/products";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runStoreIntegrationSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // STORE & PRODUCTS INTEGRATION SUITE");
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
  // UNIT TEST: PRICE FORMATTING HELPER
  // -------------------------------------------------------------
  assert(
    formatPrice(49900, "INR") === "₹499.00",
    "Price Helper: Formats INR cents to ₹499.00"
  );
  assert(
    formatPrice(1900, "USD") === "$19.00",
    "Price Helper: Formats USD cents to $19.00"
  );
  assert(
    formatPrice(2500, "EUR") === "€25.00",
    "Price Helper: Formats EUR cents to €25.00"
  );
  assert(
    formatPrice(null, "INR") === "[PRODUCT PRICE PENDING]",
    "Price Helper: Null price strictly returns [PRODUCT PRICE PENDING]"
  );

  // -------------------------------------------------------------
  // TEST E: SUPABASE UNAVAILABLE / UNCONFIGURED (GRACEFUL DEGRADATION)
  // -------------------------------------------------------------
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const offlineList = await getPublishedStoreProducts();
  assert(
    Array.isArray(offlineList) && offlineList.length === 0,
    "E.1 Unconfigured environment returns empty array for getPublishedStoreProducts"
  );

  const offlineSlug = await getPublishedStoreProductBySlug("any-slug");
  assert(
    offlineSlug === null,
    "E.2 Unconfigured environment returns null for getPublishedStoreProductBySlug"
  );

  // Unreachable / malformed host
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://invalid-non-existent-subdomain.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-anon-key";
  resetSupabaseServerClient();

  const networkErrList = await getPublishedStoreProducts();
  assert(
    Array.isArray(networkErrList) && networkErrList.length === 0,
    "E.3 Unreachable host degrades gracefully to empty array without throwing"
  );

  const networkErrSlug = await getPublishedStoreProductBySlug("any-slug");
  assert(
    networkErrSlug === null,
    "E.4 Unreachable host degrades gracefully to null for slug query without throwing"
  );

  // -------------------------------------------------------------
  // TEST A: NO AVAILABLE PRODUCTS (LIVE DATABASE EMPTY STATE)
  // -------------------------------------------------------------
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://vahalxnimswrhmoyzbse.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGFseG5pbXN3cmhtb3l6YnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzUwNTksImV4cCI6MjEwNTY1MTA1OX0.7RzKO58zXuZ_zfulPypETCnwVACba3Iy9uw_7rC1LDk";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const liveList = await getPublishedStoreProducts();
  assert(
    Array.isArray(liveList),
    "A.1 Live query returns valid array of products"
  );

  const nonExistentSlug = await getPublishedStoreProductBySlug("non-existent-edition-xyz");
  assert(
    nonExistentSlug === null,
    "A.2 Non-existent slug query returns null (triggers notFound)"
  );

  // -------------------------------------------------------------
  // TEST B & C & D: POPULATED TEST SPECIMEN VERIFICATION
  // (Evaluated when test records are present in the active database)
  // -------------------------------------------------------------
  const availableAlpha = await getPublishedStoreProductBySlug("test-available-product-alpha");
  const unavailableGamma = await getPublishedStoreProductBySlug("test-unavailable-product-gamma");

  if (availableAlpha) {
    assert(
      availableAlpha.slug === "test-available-product-alpha" &&
      availableAlpha.title === "TEST_PRODUCT_TITLE_ALPHA" &&
      availableAlpha.releaseCode === "REL-001" &&
      availableAlpha.description === "TEST_PRODUCT_DESCRIPTION_ALPHA" &&
      availableAlpha.priceInCents === 49900 &&
      availableAlpha.currency === "INR" &&
      availableAlpha.formattedPrice === "₹499.00" &&
      availableAlpha.productType === "digital_download" &&
      availableAlpha.previewImageUrl === "https://example.com/preview-alpha.jpg" &&
      availableAlpha.isAvailable === true &&
      availableAlpha.sortOrder === 1,
      "B.1 All public product fields and currency formatting map accurately"
    );

    const availableBeta = await getPublishedStoreProductBySlug("test-available-product-beta");
    assert(
      availableBeta !== null &&
      availableBeta.currency === "USD" &&
      availableBeta.formattedPrice === "$19.00" &&
      availableBeta.productType === "code_license",
      "B.2 USD currency and code_license product type mapped accurately"
    );

    // TEST C: Unavailable product must NEVER be exposed
    assert(
      unavailableGamma === null,
      "C.1 Direct slug query for unavailable product strictly returns null (no leakage)"
    );

    const fullCatalog = await getPublishedStoreProducts();
    assert(
      !fullCatalog.some((p) => p.slug === "test-unavailable-product-gamma"),
      "C.2 Public store catalog strictly excludes unavailable products"
    );

    // Verify ordering: sort_order 1 before sort_order 2
    const alphaIndex = fullCatalog.findIndex((p) => p.slug === "test-available-product-alpha");
    const betaIndex = fullCatalog.findIndex((p) => p.slug === "test-available-product-beta");
    assert(
      alphaIndex !== -1 && betaIndex !== -1 && alphaIndex < betaIndex,
      "B.3 Deterministic ordering verified (sort_order 1 appears before sort_order 2)"
    );

    // -------------------------------------------------------------
    // TEST D: STORAGE_ASSET_PATH SECURITY AUDIT
    // -------------------------------------------------------------
    const alphaKeys = Object.keys(availableAlpha);
    assert(
      !alphaKeys.includes("storageAssetPath") &&
      !alphaKeys.includes("storage_asset_path"),
      "D.1 storageAssetPath is strictly omitted from ProductDisplayData object keys"
    );

    const serializedPayload = JSON.stringify(availableAlpha);
    assert(
      !serializedPayload.includes("vault/secure") &&
      !serializedPayload.includes("digital-bundle-001.zip") &&
      !serializedPayload.includes("storage_asset_path"),
      "D.2 Browser-visible JSON payload contains zero private storage path information"
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

runStoreIntegrationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
