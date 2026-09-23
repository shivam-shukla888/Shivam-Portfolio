/**
 * scripts/test-admin-products.ts
 *
 * SHIVSASTRA // PHASE 18: ADMIN STORE / PRODUCT CATALOG CRUD TEST SUITE
 * Operating Mode: DATABASE-INDEPENDENT MASTER MODE
 *
 * Tests 1–29: Static, schema validation, security inspection, and route/UI assertions.
 * Tests 30–40: Live database operations marked as PENDING — LIVE DATABASE ACCESS REQUIRED.
 */

import fs from "fs";
import path from "path";
import {
  adminProductSchema,
  emptyStringToNull,
  normalizeBoolean,
  normalizeAdminProductInput,
} from "../src/lib/validations/admin-product";

let passCount = 0;
let failCount = 0;
let pendingCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failCount++;
  }
}

function markPending(testName: string) {
  console.log(`○ PENDING — LIVE DATABASE ACCESS REQUIRED: ${testName}`);
  pendingCount++;
}

console.log("=======================================================");
console.log("SHIVSASTRA // ADMIN STORE CRUD TEST SUITE (PHASE 18)");
console.log("Mode: DATABASE-INDEPENDENT MASTER MODE");
console.log("=======================================================\n");

// -----------------------------------------------------------------------------
// SECTION 1: LOCAL / STATIC VALIDATION TESTS
// -----------------------------------------------------------------------------
console.log("--- Section 1: Validation Schema & Normalization ---");

// 1. validation schema loads
assert(typeof adminProductSchema.safeParse === "function", "1. Validation schema loads properly");

// 2. valid product accepted
const validSample = {
  slug: "algorithmic-monograph",
  release_code: "ED-2026-01",
  title: "Algorithmic Monograph",
  description: "An in-depth technical monograph on computational design.",
  price_in_cents: 49900,
  currency: "INR",
  product_type: "monograph",
  preview_image_url: "https://example.com/images/preview.jpg",
  storage_asset_path: "secure/monograph-v1.pdf",
  is_available: true,
  sort_order: 1,
};
const validResult = adminProductSchema.safeParse(validSample);
assert(validResult.success === true, "2. Valid product accepted by schema");

// 3. invalid slug rejected
const invalidSlug = adminProductSchema.safeParse({
  ...validSample,
  slug: "Invalid Slug With Spaces",
});
assert(invalidSlug.success === false, "3. Invalid slug (spaces, uppercase) rejected");

// 4. duplicate-format slug rejected
const trailingHyphenSlug = adminProductSchema.safeParse({
  ...validSample,
  slug: "invalid-slug-",
});
assert(trailingHyphenSlug.success === false, "4. Malformed slug (trailing hyphen) rejected");

// 5. invalid title rejected
const shortTitle = adminProductSchema.safeParse({
  ...validSample,
  title: "A",
});
const htmlTitle = adminProductSchema.safeParse({
  ...validSample,
  title: "Title <script>alert(1)</script>",
});
assert(shortTitle.success === false && htmlTitle.success === false, "5. Invalid title (too short, HTML characters) rejected");

// 6. invalid price rejected
const decimalPrice = adminProductSchema.safeParse({
  ...validSample,
  price_in_cents: 49.99,
});
const stringNaNPrice = adminProductSchema.safeParse({
  ...validSample,
  price_in_cents: "not-a-number",
});
assert(decimalPrice.success === false && stringNaNPrice.success === false, "6. Invalid price (decimals, NaN) rejected");

// 7. negative price rejected
const negativePrice = adminProductSchema.safeParse({
  ...validSample,
  price_in_cents: -500,
});
assert(negativePrice.success === false, "7. Negative price rejected");

// 8. invalid currency rejected
const invalidCurrency = adminProductSchema.safeParse({
  ...validSample,
  currency: "USD",
});
assert(invalidCurrency.success === false, "8. Non-INR currency rejected (INR strictly locked)");

// 9. invalid product type rejected
const invalidType = adminProductSchema.safeParse({
  ...validSample,
  product_type: "unsupported_physical_book",
});
assert(invalidType.success === false, "9. Invalid product type rejected");

// 10. invalid preview URL rejected
const malformedUrl = adminProductSchema.safeParse({
  ...validSample,
  preview_image_url: "not-a-url",
});
assert(malformedUrl.success === false, "10. Malformed preview URL rejected");

// 11. HTTP preview URL rejected
const httpUrl = adminProductSchema.safeParse({
  ...validSample,
  preview_image_url: "http://example.com/preview.jpg",
});
assert(httpUrl.success === false, "11. Insecure HTTP preview URL rejected");

// 12. javascript preview URL rejected
const jsUrl = adminProductSchema.safeParse({
  ...validSample,
  preview_image_url: "javascript:alert('xss')",
});
assert(jsUrl.success === false, "12. Malicious javascript: preview URL rejected");

// 13. invalid sort order rejected
const invalidSort = adminProductSchema.safeParse({
  ...validSample,
  sort_order: 99999999,
});
assert(invalidSort.success === false, "13. Out-of-bounds sort order rejected");

// 14. whitespace normalization works
assert(emptyStringToNull("   ") === null, "14a. Whitespace-only string normalized to null");
assert(emptyStringToNull(" valid text ") === "valid text", "14b. Leading/trailing whitespace trimmed");
assert(normalizeBoolean("on") === true, "14c. Form 'on' normalized to boolean true");
assert(normalizeBoolean("false") === false, "14d. String 'false' normalized to boolean false");
const normalizedInput = normalizeAdminProductInput({
  title: "Test",
  productType: "template",
  priceInCents: 1000,
  releaseCode: "REL-01",
});
assert(
  normalizedInput.product_type === "template" &&
  normalizedInput.price_in_cents === 1000 &&
  normalizedInput.release_code === "REL-01",
  "14e. CamelCase field aliases normalized to schema fields"
);

// 15. HTML/script injection rejected
const xssDesc = adminProductSchema.safeParse({
  ...validSample,
  description: "Specimen <script>window.stealTokens()</script> description.",
});
const rawHtmlDesc = adminProductSchema.safeParse({
  ...validSample,
  description: "Description with <div onclick='hack()'>evil</div>.",
});
assert(xssDesc.success === false && rawHtmlDesc.success === false, "15. HTML and script tag injection in description rejected");

// -----------------------------------------------------------------------------
// SECTION 2: SECURITY STATIC TESTS
// -----------------------------------------------------------------------------
console.log("\n--- Section 2: Security & Privacy Static Tests ---");

const productsLibContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/lib/products.ts"),
  "utf-8"
);
const adminProductsLibContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/lib/admin/products.ts"),
  "utf-8"
);
const storePageContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/app/store/page.tsx"),
  "utf-8"
);
const storeSlugPageContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/app/store/[slug]/page.tsx"),
  "utf-8"
);

// 16. storage_asset_path not returned by public product layer
const publicColumnsMatch = productsLibContent.match(/PUBLIC_PRODUCT_COLUMNS\s*=\s*["']([^"']+)["']/);
const publicColumns = publicColumnsMatch ? publicColumnsMatch[1] : "";
assert(
  !publicColumns.includes("storage_asset_path") &&
  !publicColumns.includes("storageAssetPath"),
  "16. storage_asset_path is strictly excluded from public product query columns"
);

// 17. storage_asset_path not imported into client component
assert(
  !storePageContent.includes("storage_asset_path") &&
  !storeSlugPageContent.includes("storage_asset_path") &&
  !storePageContent.includes("storageAssetPath") &&
  !storeSlugPageContent.includes("storageAssetPath"),
  "17. storage_asset_path is not referenced or rendered in public store pages"
);

// 18. service-role key not exposed
const productFormContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/components/admin/ProductForm.tsx"),
  "utf-8"
);
assert(
  !productFormContent.includes("SUPABASE_SERVICE_ROLE_KEY") &&
  !productFormContent.includes("service_role"),
  "18. SUPABASE_SERVICE_ROLE_KEY is never imported or referenced in ProductForm client component"
);

// 19. admin mutation layer is server-only
assert(
  adminProductsLibContent.includes('typeof window !== "undefined"') ||
  adminProductsLibContent.includes("server-only"),
  "19. src/lib/admin/products.ts enforces server-only execution"
);

// 20. client cannot supply authorization identity
assert(
  !productFormContent.includes('name="user_id"') &&
  !productFormContent.includes('name="admin_id"') &&
  !productFormContent.includes('name="owner_id"'),
  "20. ProductForm does not contain hidden client-supplied ownership or authorization IDs"
);

// 21. no public write code path
const initialSchemaContent = fs.readFileSync(
  path.resolve(process.cwd(), "supabase/migrations/20260922000001_initial_schema.sql"),
  "utf-8"
);
const protectStorageContent = fs.readFileSync(
  path.resolve(process.cwd(), "supabase/migrations/20260922000002_protect_storage_asset_path.sql"),
  "utf-8"
);
assert(
  !initialSchemaContent.includes("GRANT INSERT ON products TO anon") &&
  !initialSchemaContent.includes("GRANT UPDATE ON products TO anon") &&
  !initialSchemaContent.includes("GRANT DELETE ON products TO anon") &&
  protectStorageContent.includes("REVOKE SELECT ON TABLE public.products FROM anon, authenticated"),
  "21. Zero public/anonymous INSERT/UPDATE/DELETE grants exist on public.products and whole-table SELECT is revoked"
);

// 22. unsafe protocols rejected
const dataProtocol = adminProductSchema.safeParse({
  ...validSample,
  preview_image_url: "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
});
const blobProtocol = adminProductSchema.safeParse({
  ...validSample,
  preview_image_url: "blob:https://example.com/uuid-here",
});
assert(
  dataProtocol.success === false && blobProtocol.success === false,
  "22. Dangerous URL protocols (data:, blob:) strictly rejected"
);

// -----------------------------------------------------------------------------
// SECTION 3: ROUTE & UI STATIC TESTS
// -----------------------------------------------------------------------------
console.log("\n--- Section 3: Route & UI Component Static Tests ---");

// 23. admin store route exists
const storeListPath = path.resolve(process.cwd(), "src/app/admin/store/page.tsx");
assert(fs.existsSync(storeListPath), "23. /admin/store catalog list page exists");

// 24. new route exists
const storeNewPath = path.resolve(process.cwd(), "src/app/admin/store/new/page.tsx");
assert(fs.existsSync(storeNewPath), "24. /admin/store/new creation page exists");

// 25. edit route exists
const storeEditPath = path.resolve(process.cwd(), "src/app/admin/store/[id]/edit/page.tsx");
assert(fs.existsSync(storeEditPath), "25. /admin/store/[id]/edit editor page exists");

// 26. protected route configuration exists
const storeListContent = fs.readFileSync(storeListPath, "utf-8");
const storeNewContent = fs.readFileSync(storeNewPath, "utf-8");
const storeEditContent = fs.readFileSync(storeEditPath, "utf-8");
assert(
  storeListContent.includes("getAuthenticatedAdmin") &&
  storeNewContent.includes("getAuthenticatedAdmin") &&
  storeEditContent.includes("getAuthenticatedAdmin"),
  "26. All three admin store routes enforce getAuthenticatedAdmin() guard"
);

// 27. product form labels exist
assert(
  productFormContent.includes('htmlFor="title"') &&
  productFormContent.includes('htmlFor="slug"') &&
  productFormContent.includes('htmlFor="price_in_cents"') &&
  productFormContent.includes('htmlFor="product_type"') &&
  productFormContent.includes('htmlFor="currency"'),
  "27. Form fields have explicit htmlFor associated label tags"
);

// 28. delete confirmation exists
assert(
  productFormContent.includes("showDeleteModal") &&
  productFormContent.includes("Delete this product permanently?"),
  "28. Explicit confirmation dialog exists for irreversible product deletion"
);

// 29. availability controls exist
assert(
  productFormContent.includes("is_available") &&
  productFormContent.includes("availability_intent"),
  "29. Product availability toggles and intent controls are fully wired"
);

// -----------------------------------------------------------------------------
// SECTION 4: LIVE DATABASE TESTS (MARKED PENDING PER MASTER EXECUTION MODE)
// -----------------------------------------------------------------------------
console.log("\n--- Section 4: Live Database Tests (Master Mode Classification) ---");

markPending("30. Actual Supabase product INSERT mutation");
markPending("31. Actual Supabase product SELECT read by ID");
markPending("32. Actual Supabase product UPDATE mutation");
markPending("33. Actual Supabase product DELETE permanent purge");
markPending("34. Actual Supabase duplicate slug unique constraint rejection");
markPending("35. Actual Supabase availability public catalog visibility filtering");
markPending("36. Actual Supabase RLS anonymous INSERT denial");
markPending("37. Actual Supabase RLS anonymous UPDATE denial");
markPending("38. Actual Supabase RLS anonymous DELETE denial");
markPending("39. Actual Supabase storage_asset_path column-level revocation enforcement");
markPending("40. Actual Supabase production row-count verification");

console.log("\n=======================================================");
console.log(`TEST SUITE RESULTS:`);
console.log(`- PASS (Local/Static): ${passCount}`);
console.log(`- FAIL: ${failCount}`);
console.log(`- PENDING (Live Database): ${pendingCount}`);
console.log("=======================================================");

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
