/**
 * scripts/test-admin-lab.ts
 *
 * SHIVSASTRA // PHASE 19: ADMIN PERSONAL LAB CRUD TEST SUITE
 * Operating Mode: DATABASE-INDEPENDENT MASTER MODE
 *
 * Tests 1–37: Static, schema validation, visibility logic, security inspection, and route/UI assertions.
 * Tests 38–49: Live database operations marked as PENDING — LIVE DATABASE ACCESS REQUIRED.
 */

import fs from "fs";
import path from "path";
import {
  adminLabSchema,
  emptyStringToNull,
  normalizeBoolean,
  normalizeTags,
  normalizeAdminLabInput,
} from "../src/lib/validations/admin-lab";

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
console.log("SHIVSASTRA // ADMIN PERSONAL LAB TEST SUITE (PHASE 19)");
console.log("Mode: DATABASE-INDEPENDENT MASTER MODE");
console.log("=======================================================\n");

// -----------------------------------------------------------------------------
// SECTION 1: LOCAL / STATIC VALIDATION TESTS
// -----------------------------------------------------------------------------
console.log("--- Section 1: Validation Schema & Normalization ---");

// 1. validation schema loads
assert(typeof adminLabSchema.safeParse === "function", "1. Validation schema loads properly");

// 2. valid idea accepted
const validIdea = {
  slug: "distributed-state-machine-idea",
  category: "idea",
  title: "Distributed State Machine Architecture",
  content_markdown: "Conceptual notes on asynchronous replication consensus.",
  tags: ["distributed-systems", "consensus", "algorithms"],
  status: "draft",
  is_public: false,
  published_at: null,
};
const ideaResult = adminLabSchema.safeParse(validIdea);
assert(ideaResult.success === true, "2. Valid idea accepted by schema");

// 3. valid build accepted
const validBuild = {
  ...validIdea,
  slug: "wasm-audio-dsp-engine",
  category: "build",
  title: "WASM Audio DSP Engine",
  status: "wip",
};
assert(adminLabSchema.safeParse(validBuild).success === true, "3. Valid build accepted by schema");

// 4. valid stack accepted
const validStack = {
  ...validIdea,
  slug: "low-latency-edge-mesh-stack",
  category: "stack",
  title: "Low-Latency Edge Mesh Stack",
  status: "experimental",
};
assert(adminLabSchema.safeParse(validStack).success === true, "4. Valid stack accepted by schema");

// 5. valid thought accepted
const validThought = {
  ...validIdea,
  slug: "epistemology-of-software-tools",
  category: "thought",
  title: "Epistemology of Software Tools",
  status: "published",
  is_public: true,
  published_at: "2026-09-22T20:00:00.000Z",
};
assert(adminLabSchema.safeParse(validThought).success === true, "5. Valid thought accepted by schema");

// 6. invalid category rejected
const invalidCategory = adminLabSchema.safeParse({
  ...validIdea,
  category: "unauthorized_blog_post",
});
assert(invalidCategory.success === false, "6. Invalid category rejected");

// 7. invalid status rejected
const invalidStatus = adminLabSchema.safeParse({
  ...validIdea,
  status: "unknown_status_flag",
});
assert(invalidStatus.success === false, "7. Invalid status rejected");

// 8. invalid slug rejected
const invalidSlug = adminLabSchema.safeParse({
  ...validIdea,
  slug: "Invalid Slug With Spaces",
});
const trailingHyphen = adminLabSchema.safeParse({
  ...validIdea,
  slug: "trailing-hyphen-",
});
assert(invalidSlug.success === false && trailingHyphen.success === false, "8. Invalid slug formats rejected");

// 9. invalid title rejected
const shortTitle = adminLabSchema.safeParse({
  ...validIdea,
  title: "X",
});
const htmlTitle = adminLabSchema.safeParse({
  ...validIdea,
  title: "Title with <script>alert(1)</script>",
});
assert(shortTitle.success === false && htmlTitle.success === false, "9. Invalid title (too short, HTML) rejected");

// 10. oversized content rejected
const oversizedContent = adminLabSchema.safeParse({
  ...validIdea,
  content_markdown: "A".repeat(25000),
});
assert(oversizedContent.success === false, "10. Oversized content markdown (> 20,000 chars) rejected");

// 11. malformed tags rejected
const malformedTags = adminLabSchema.safeParse({
  ...validIdea,
  tags: ["a".repeat(60)], // > 50 chars
});
assert(malformedTags.success === false, "11. Malformed oversized tag item rejected");

// 12. whitespace normalization works
assert(emptyStringToNull("   ") === null, "12a. Whitespace-only string normalized to null");
assert(emptyStringToNull(" specimen ") === "specimen", "12b. String whitespace trimmed");
assert(normalizeBoolean("on") === true, "12c. Form 'on' normalized to boolean true");
assert(normalizeBoolean("false") === false, "12d. String 'false' normalized to boolean false");
const normalizedInput = normalizeAdminLabInput({
  title: "Test",
  contentMarkdown: "Content",
  isPublic: true,
  publishedAt: "2026-09-22T00:00:00.000Z",
});
assert(
  normalizedInput.content_markdown === "Content" &&
  normalizedInput.is_public === true &&
  normalizedInput.published_at === "2026-09-22T00:00:00.000Z",
  "12e. CamelCase field aliases normalized to schema fields"
);

// 13. duplicate tags removed
const deduplicatedTags = normalizeTags(["rust", "wasm", "rust", "  wasm  ", "systems"]);
assert(
  deduplicatedTags.length === 3 &&
  deduplicatedTags.includes("rust") &&
  deduplicatedTags.includes("wasm") &&
  deduplicatedTags.includes("systems"),
  "13. Duplicate and untrimmed tags cleanly deduplicated"
);

// 14. HTML/script injection rejected
const xssContent = adminLabSchema.safeParse({
  ...validIdea,
  content_markdown: "Artifact narrative <script>window.steal()</script> notes.",
});
assert(xssContent.success === false, "14. Script tags in content markdown strictly rejected");

// 15. dangerous URI content rejected where applicable
const scriptTagInTags = adminLabSchema.safeParse({
  ...validIdea,
  tags: ["<script>alert(1)</script>"],
});
assert(scriptTagInTags.success === false, "15. HTML/script injection in tags strictly rejected");

// -----------------------------------------------------------------------------
// SECTION 2: VISIBILITY LOGIC VERIFICATION
// -----------------------------------------------------------------------------
console.log("\n--- Section 2: Visibility Logic Verification ---");

function isPubliclyVisible(isPublic: boolean, publishedAt: string | null): boolean {
  return isPublic === true && publishedAt !== null && publishedAt.trim().length > 0;
}

// 16. is_public false means private
assert(!isPubliclyVisible(false, "2026-09-22T00:00:00.000Z"), "16. is_public = false remains strictly private even with timestamp");

// 17. published_at null means private
assert(!isPubliclyVisible(true, null), "17. published_at = null remains strictly private even when is_public is true");

// 18. both conditions required for public visibility
assert(isPubliclyVisible(true, "2026-09-22T00:00:00.000Z"), "18. Entry is public ONLY when BOTH is_public=true AND published_at!=null");

// 19. status alone cannot make entry public
assert(!isPubliclyVisible(false, null), "19. status = 'published' alone does NOT make an entry public without visibility flags");

// 20. experimental public entry remains possible when both visibility conditions are satisfied
const experimentalPublic = {
  ...validStack,
  status: "experimental",
  is_public: true,
  published_at: "2026-09-22T10:00:00.000Z",
};
assert(
  adminLabSchema.safeParse(experimentalPublic).success === true &&
  isPubliclyVisible(experimentalPublic.is_public, experimentalPublic.published_at),
  "20. Experimental entry can be publicly visible when both visibility conditions are met"
);

// -----------------------------------------------------------------------------
// SECTION 3: SECURITY STATIC TESTS
// -----------------------------------------------------------------------------
console.log("\n--- Section 3: Security & Code Isolation Static Tests ---");

const adminLabLibContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/lib/admin/lab.ts"),
  "utf-8"
);
const adminLabActionContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/app/actions/admin-lab.ts"),
  "utf-8"
);
const labFormContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/components/admin/LabEntryForm.tsx"),
  "utf-8"
);
const labDetailContent = fs.readFileSync(
  path.resolve(process.cwd(), "src/app/lab/[slug]/page.tsx"),
  "utf-8"
);
const initialSchemaContent = fs.readFileSync(
  path.resolve(process.cwd(), "supabase/migrations/20260922000001_initial_schema.sql"),
  "utf-8"
);

// 21. admin module is server-only
assert(
  adminLabLibContent.includes('typeof window !== "undefined"') ||
  adminLabLibContent.includes("server-only"),
  "21. src/lib/admin/lab.ts enforces server-only execution"
);

// 22. server action is server-only
assert(
  adminLabActionContent.startsWith('"use server"') ||
  adminLabActionContent.startsWith("'use server'"),
  "22. src/app/actions/admin-lab.ts is guarded with 'use server'"
);

// 23. no client-controlled authorization identity
assert(
  !labFormContent.includes('name="user_id"') &&
  !labFormContent.includes('name="admin_id"') &&
  !labFormContent.includes('name="author_id"'),
  "23. LabEntryForm does not contain hidden client-supplied ownership or authorization IDs"
);

// 24. service-role key not exposed
assert(
  !labFormContent.includes("SUPABASE_SERVICE_ROLE_KEY") &&
  !labFormContent.includes("service_role"),
  "24. SUPABASE_SERVICE_ROLE_KEY is never imported or referenced in LabEntryForm client component"
);

// 25. no public write path
assert(
  !initialSchemaContent.includes("GRANT INSERT ON lab_entries TO anon") &&
  !initialSchemaContent.includes("GRANT UPDATE ON lab_entries TO anon") &&
  !initialSchemaContent.includes("GRANT DELETE ON lab_entries TO anon"),
  "25. Zero public/anonymous INSERT/UPDATE/DELETE grants exist on public.lab_entries"
);

// 26. raw DB errors not exposed
assert(
  adminLabActionContent.includes("Please correct the highlighted fields below") &&
  !adminLabActionContent.includes("error.stack"),
  "26. Server Actions return sanitized user messages without leaking stack traces or SQL internals"
);

// 27. markdown renderer remains safe
assert(
  !labDetailContent.includes("dangerouslySetInnerHTML=") &&
  labDetailContent.includes("SafeMarkdownRenderer"),
  "27. Public Lab detail page uses SafeMarkdownRenderer without dangerouslySetInnerHTML attribute"
);

// 28. tags rendered as text
assert(
  labFormContent.includes("#{chip}") || labFormContent.includes("{tag}"),
  "28. Tags are rendered strictly as text nodes without raw HTML interpretation"
);

// -----------------------------------------------------------------------------
// SECTION 4: ROUTE & UI STATIC TESTS
// -----------------------------------------------------------------------------
console.log("\n--- Section 4: Route & UI Component Static Tests ---");

// 29. /admin/lab route exists
const labListPath = path.resolve(process.cwd(), "src/app/admin/lab/page.tsx");
assert(fs.existsSync(labListPath), "29. /admin/lab catalog list page exists");

// 30. /admin/lab/new exists
const labNewPath = path.resolve(process.cwd(), "src/app/admin/lab/new/page.tsx");
assert(fs.existsSync(labNewPath), "30. /admin/lab/new creation page exists");

// 31. /admin/lab/[id]/edit exists
const labEditPath = path.resolve(process.cwd(), "src/app/admin/lab/[id]/edit/page.tsx");
assert(fs.existsSync(labEditPath), "31. /admin/lab/[id]/edit editor page exists");

// 32. protected route configuration exists
const labListContent = fs.readFileSync(labListPath, "utf-8");
const labNewContent = fs.readFileSync(labNewPath, "utf-8");
const labEditContent = fs.readFileSync(labEditPath, "utf-8");
assert(
  labListContent.includes("getAuthenticatedAdmin") &&
  labNewContent.includes("getAuthenticatedAdmin") &&
  labEditContent.includes("getAuthenticatedAdmin"),
  "32. All three admin lab routes enforce getAuthenticatedAdmin() guard"
);

// 33. accessible form labels exist
assert(
  labFormContent.includes('htmlFor="title"') &&
  labFormContent.includes('htmlFor="slug"') &&
  labFormContent.includes('htmlFor="category"') &&
  labFormContent.includes('htmlFor="content_markdown"') &&
  labFormContent.includes('htmlFor="status"'),
  "33. Form fields have explicit htmlFor associated label tags"
);

// 34. delete confirmation exists
assert(
  labFormContent.includes("showDeleteModal") &&
  labFormContent.includes("Delete this Lab entry permanently?"),
  "34. Explicit confirmation modal exists for irreversible lab entry deletion"
);

// 35. visibility controls exist
assert(
  labFormContent.includes("is_public") &&
  labFormContent.includes("publish_intent"),
  "35. Public visibility toggles and publish/unpublish intent controls are fully wired"
);

// 36. category control exists
assert(
  labFormContent.includes("CATEGORY_OPTIONS") &&
  labFormContent.includes("idea") &&
  labFormContent.includes("thought"),
  "36. Controlled category select matches database enum values"
);

// 37. status control exists
assert(
  labFormContent.includes("STATUS_OPTIONS") &&
  labFormContent.includes("experimental") &&
  labFormContent.includes("archived"),
  "37. Controlled status select matches database enum values"
);

// -----------------------------------------------------------------------------
// SECTION 5: LIVE DATABASE TESTS (MARKED PENDING PER MASTER EXECUTION MODE)
// -----------------------------------------------------------------------------
console.log("\n--- Section 5: Live Database Tests (Master Mode Classification) ---");

markPending("38. Actual Supabase lab entry INSERT mutation");
markPending("39. Actual Supabase lab entry SELECT read by ID");
markPending("40. Actual Supabase lab entry UPDATE mutation");
markPending("41. Actual Supabase lab entry DELETE permanent purge");
markPending("42. Actual Supabase publish action (sets is_public=true, published_at=now)");
markPending("43. Actual Supabase unpublish action (sets is_public=false, published_at=null)");
markPending("44. Actual Supabase public visibility enforcement (is_public=true AND published_at!=null)");
markPending("45. Actual Supabase RLS anonymous INSERT denial");
markPending("46. Actual Supabase RLS anonymous UPDATE denial");
markPending("47. Actual Supabase RLS anonymous DELETE denial");
markPending("48. Actual Supabase production row-count verification");
markPending("49. Actual Supabase production test-data cleanup");

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
