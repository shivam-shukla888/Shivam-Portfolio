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
import {
  adminProductSchema,
  STORE_CATEGORIES,
  RESERVED_STORE_SLUGS,
} from "../src/lib/validations/admin-product";
import {
  getPublishedStoreProducts,
  getStoreCategoryCounts,
  getPublishedProductReviews,
} from "../src/lib/products";

async function runStoreV2Tests() {
  console.log("=== SHIVSASTRA PHASE 26: STORE V2 ARCHITECTURE VERIFICATION ===");
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

  // 1. Validation Schema: Valid store categories
  for (const cat of STORE_CATEGORIES) {
    const slugSuffix = cat.replace(/_/g, "-");
    const res = adminProductSchema.safeParse({
      title: `Sample ${cat} product`,
      slug: `sample-${slugSuffix}-product`,
      price_in_cents: 1000,
      currency: "INR",
      product_type: "digital_download",
      category: cat,
      features: ["Feature 1", "Feature 2"],
      is_featured: true,
    });
    assert(res.success === true, `adminProductSchema accepts category: ${cat}`);
  }

  // 2. Validation Schema: Rejects invalid categories
  const invalidCatRes = adminProductSchema.safeParse({
    title: "Invalid category product",
    slug: "invalid-cat-product",
    price_in_cents: 1000,
    currency: "INR",
    product_type: "digital_download",
    category: "crypto_tokens",
  });
  assert(!invalidCatRes.success, "adminProductSchema rejects unlisted category");

  // 3. Validation Schema: Reserved slugs collision prevention
  for (const reservedSlug of RESERVED_STORE_SLUGS) {
    const reservedRes = adminProductSchema.safeParse({
      title: "Reserved slug test",
      slug: reservedSlug,
      price_in_cents: 1000,
      currency: "INR",
      product_type: "digital_download",
      category: "design",
    });
    assert(
      !reservedRes.success,
      `adminProductSchema rejects reserved slug: '${reservedSlug}'`
    );
  }

  // 4. Features & FAQ normalization
  const normRes = adminProductSchema.safeParse({
    title: "Normalized features and FAQ test",
    slug: "normalized-features-and-faq-test",
    price_in_cents: 25000,
    currency: "INR",
    product_type: "template",
    category: "digital_products",
    features: "Feature A\nFeature B\nFeature C",
    faq: JSON.stringify([
      { question: "What is included?", answer: "Complete source code." },
    ]),
  });
  assert(normRes.success === true, "adminProductSchema parses string features & FAQ JSON");
  if (normRes.success) {
    assert(
      normRes.data.features.length === 3 &&
        normRes.data.features[1] === "Feature B",
      "Features correctly split newline string into 3 items"
    );
    assert(
      normRes.data.faq.length === 1 &&
        normRes.data.faq[0].question === "What is included?",
      "FAQ correctly parsed from JSON string"
    );
  }

  // 5. Query Layer: getStoreCategoryCounts returns numeric counts
  const counts = await getStoreCategoryCounts();
  assert(
    typeof counts.design === "number" &&
      typeof counts.ai_agents === "number" &&
      typeof counts.digital_products === "number" &&
      typeof counts.total === "number",
    `getStoreCategoryCounts returns valid structure (total: ${counts.total})`
  );

  // 6. Query Layer: getPublishedStoreProducts execution
  const products = await getPublishedStoreProducts();
  assert(
    Array.isArray(products),
    `getPublishedStoreProducts returns an array (length: ${products.length})`
  );

  // 7. Security: storage_asset_path privacy verification
  for (const p of products) {
    assert(
      !("storage_asset_path" in p) && !("storageAssetPath" in p),
      `Product ${p.slug} does not expose storage_asset_path to public`
    );
  }

  // 8. Reviews Query: getPublishedProductReviews handles queries gracefully
  const testReviews = await getPublishedProductReviews(
    "00000000-0000-0000-0000-000000000000"
  );
  assert(Array.isArray(testReviews), "getPublishedProductReviews returns array");

  // 9. Live Database Security & Content Invariant Verification
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && anonKey) {
    const anonClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // A. Anonymous SELECT on products.storage_asset_path MUST fail with 42501 permission denied
    const { error: privError } = await anonClient
      .from("products")
      .select("id, storage_asset_path");
    assert(
      privError !== null && privError.code === "42501",
      `Anon cannot query products.storage_asset_path (PostgreSQL 42501: ${privError?.code})`
    );

    // B. Anonymous INSERT on product_reviews MUST be rejected
    const { error: revInsertError } = await anonClient
      .from("product_reviews")
      .insert({
        product_id: "00000000-0000-0000-0000-000000000000",
        author_name: "Attacker",
        rating: 5,
        content: "Fake review attempt",
      });
    assert(
      revInsertError !== null,
      `Anon write to product_reviews rejected (${revInsertError?.code || revInsertError?.message})`
    );

    // C. products table row count MUST be 0 (Zero fake content invariant)
    const { count: prodCount, error: countErr } = await anonClient
      .from("public_products")
      .select("*", { count: "exact", head: true });
    assert(
      !countErr && (prodCount ?? 0) === 0,
      `ZERO FAKE CONTENT: products row count is exactly 0 (actual: ${prodCount})`
    );

    // D. product_reviews table row count MUST be 0 (Zero fake reviews invariant)
    const { count: revCount, error: revCountErr } = await anonClient
      .from("product_reviews")
      .select("*", { count: "exact", head: true });
    assert(
      !revCountErr && (revCount ?? 0) === 0,
      `ZERO FAKE REVIEWS: product_reviews row count is exactly 0 (actual: ${revCount})`
    );
  } else {
    console.warn("[WARN] Supabase URL / Anon key missing, skipping live DB network assertions.");
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runStoreV2Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
