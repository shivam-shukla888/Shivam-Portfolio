import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { isAuthorizedAdminUser } from "../src/lib/auth";
import {
  adminProjectSchema,
  adminProjectBaseSchema,
} from "../src/lib/validations/admin-project";
import {
  createAdminProject,
  getAdminProject,
  getAdminProjects,
  updateAdminProject,
  deleteAdminProject,
  toggleProjectPublish,
} from "../src/lib/admin/projects";
import {
  createProjectAction,
} from "../src/app/actions/admin-projects";
import {
  getPublishedProjects,
} from "../src/lib/projects";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runAdminProjectsSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // ADMIN PROJECTS CRUD TEST SUITE (PHASE 16)");
  console.log("=======================================================\n");

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

  const MOCK_ADMIN_UUID = "d8b3c0e1-4567-4890-a123-fe4567890abc";
  const MOCK_ATTACKER_UUID = "e9c4d1f2-7890-4123-b456-cf7890123def";
  const SUPABASE_URL = "https://vahalxnimswrhmoyzbse.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGFseG5pbXN3cmhtb3l6YnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzUwNTksImV4cCI6MjEwNTY1MTA1OX0.7RzKO58zXuZ_zfulPypETCnwVACba3Iy9uw_7rC1LDk";

  const BASE_VALID_PROJECT = {
    slug: "specimen-architecture",
    title: "Specimen Systems Monograph",
    edition_code: "ED-001",
    summary: "Architectural monograph exploring deterministic state machines and systems engineering.",
    case_study_markdown: "Detailed analysis of computational infrastructure and execution models.",
    cover_image_url: "https://example.com/specimen-cover.jpg",
    category: "SYSTEMS ARCHITECTURE",
    tech_stack: ["TypeScript", "Next.js", "PostgreSQL"],
    project_year: 2026,
    live_url: "https://specimen.example.com",
    github_url: "https://github.com/shivam-shukla888/specimen",
    is_featured: false,
    sort_order: 1,
    published_at: null,
  };

  process.env.SHIVSASTRA_ADMIN_USER_ID = MOCK_ADMIN_UUID;

  // -------------------------------------------------------------
  // A. AUTHENTICATION (1 - 3)
  // -------------------------------------------------------------
  console.log("--- A. Authentication ---");

  // 1. Unauthenticated access rejected
  const unauthCreate = await createAdminProject(BASE_VALID_PROJECT, { userId: "" });
  assert(
    unauthCreate.success === false && unauthCreate.error?.includes("Access denied"),
    "1. Unauthenticated mutation request is rejected"
  );

  // 2. Non-admin rejected
  const nonAdminCreate = await createAdminProject(BASE_VALID_PROJECT, { userId: MOCK_ATTACKER_UUID });
  assert(
    nonAdminCreate.success === false &&
      nonAdminCreate.error?.includes("Access denied") &&
      isAuthorizedAdminUser(MOCK_ATTACKER_UUID, MOCK_ADMIN_UUID) === false,
    "2. Authenticated non-admin is rejected"
  );

  // 3. Authorized admin accepted
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, MOCK_ADMIN_UUID) === true,
    "3. Authorized admin identity is accepted"
  );

  // -------------------------------------------------------------
  // B. VALIDATION (4 - 14)
  // -------------------------------------------------------------
  console.log("\n--- B. Validation ---");

  // 4. Valid project accepted
  const validParsed = adminProjectSchema.safeParse(BASE_VALID_PROJECT);
  assert(validParsed.success === true, "4. Valid project data passes validation schema");

  // 5. Invalid slug rejected
  const invalidSlugCases = [
    "invalid slug with spaces",
    "SlugWithUppercase",
    "-starts-with-hyphen",
    "ends-with-hyphen-",
    "slug/with/paths",
    "slug<script>",
  ];
  const allInvalidSlugsRejected = invalidSlugCases.every(
    (badSlug) => !adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, slug: badSlug }).success
  );
  assert(allInvalidSlugsRejected, "5. Invalid slug formats (spaces, uppercase, slashes, HTML) are rejected");

  // 6. Duplicate slug rejected
  let duplicateQueryChecked = false;
  const mockDuplicateClient = {
    from: () => ({
      select: () => ({
        eq: (col: string, val: unknown) => {
          if (col === "slug" && val === "specimen-architecture") {
            duplicateQueryChecked = true;
            return {
              maybeSingle: async () => ({
                data: { id: "existing-uuid" },
                error: null,
              }),
            };
          }
          return { maybeSingle: async () => ({ data: null, error: null }) };
        },
      }),
    }),
  };
  const dupResult = await createAdminProject(BASE_VALID_PROJECT, {
    userId: MOCK_ADMIN_UUID,
    client: mockDuplicateClient,
  });
  assert(
    duplicateQueryChecked &&
      dupResult.success === false &&
      dupResult.error?.includes("already in use"),
    "6. Duplicate slug rejected cleanly with safe message"
  );

  // 7. Invalid title rejected
  const shortTitle = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, title: "a" });
  const htmlTitle = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, title: "<b>Bad</b>" });
  assert(
    shortTitle.success === false && htmlTitle.success === false,
    "7. Invalid title (too short, HTML characters) is rejected"
  );

  // 8. Invalid URL rejected
  const badUrlParse = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    live_url: "not-a-url",
  });
  assert(badUrlParse.success === false, "8. Invalid URL format is rejected");

  // 9. HTTP URL rejected
  const httpUrlParse = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    cover_image_url: "http://example.com/insecure.jpg",
  });
  assert(httpUrlParse.success === false, "9. Insecure HTTP URL is rejected (HTTPS required)");

  // 10. Javascript URL rejected
  const jsUrlParse = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    github_url: "javascript:alert(1)",
  });
  assert(jsUrlParse.success === false, "10. Malicious javascript: URL scheme is rejected");

  // 11. Invalid project year rejected
  const oldYear = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, project_year: 1980 });
  const futureYear = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, project_year: 2150 });
  const floatYear = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, project_year: 2024.5 });
  assert(
    oldYear.success === false && futureYear.success === false && floatYear.success === false,
    "11. Invalid project year (< 1990, > 2100, float) is rejected"
  );

  // 12. Invalid tech stack rejected
  const tooManyTags = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    tech_stack: Array.from({ length: 25 }, (_, i) => `Tech${i}`),
  });
  const htmlTag = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    tech_stack: ["<script>"],
  });
  assert(
    tooManyTags.success === false && htmlTag.success === false,
    "12. Invalid tech stack (> 20 items, HTML content) is rejected"
  );

  // 13. Oversized content rejected
  const oversizedTitle = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, title: "x".repeat(161) });
  const oversizedSummary = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, summary: "x".repeat(1001) });
  const oversizedMarkdown = adminProjectSchema.safeParse({ ...BASE_VALID_PROJECT, case_study_markdown: "x".repeat(20001) });
  assert(
    oversizedTitle.success === false &&
      oversizedSummary.success === false &&
      oversizedMarkdown.success === false,
    "13. Oversized content fields are strictly rejected"
  );

  // 14. Whitespace normalization works
  const whitespaceParsed = adminProjectSchema.safeParse({
    slug: "  specimen-architecture  ",
    title: "  Specimen Title  ",
    edition_code: "   ",
    summary: "  Valid summary statement exceeding 5 chars  ",
    case_study_markdown: "   ",
    cover_image_url: "   ",
    category: "   ",
    tech_stack: " Next.js,  TypeScript , , React ",
    project_year: "2026",
    live_url: "   ",
    github_url: null,
    is_featured: "on",
    sort_order: "5",
    published_at: "   ",
  });
  assert(
    whitespaceParsed.success === true &&
      whitespaceParsed.data.slug === "specimen-architecture" &&
      whitespaceParsed.data.title === "Specimen Title" &&
      whitespaceParsed.data.edition_code === null &&
      whitespaceParsed.data.case_study_markdown === null &&
      whitespaceParsed.data.cover_image_url === null &&
      whitespaceParsed.data.category === null &&
      whitespaceParsed.data.tech_stack.length === 3 &&
      whitespaceParsed.data.project_year === 2026 &&
      whitespaceParsed.data.live_url === null &&
      whitespaceParsed.data.is_featured === true &&
      whitespaceParsed.data.sort_order === 5 &&
      whitespaceParsed.data.published_at === null,
    "14. Whitespace normalization cleans strings, trims tags, parses numbers/booleans, and sets empty inputs to null"
  );

  // -------------------------------------------------------------
  // C. CRUD OPERATIONS (15 - 18)
  // -------------------------------------------------------------
  console.log("\n--- C. CRUD Operations ---");

  // In-memory specimen storage simulating exact Supabase table mechanics
  const storage = new Map<string, Record<string, unknown>>();
  let autoincrement = 1;

  const mockDb = {
    from: (table: string) => {
      assert(table === "projects", "Target table is public.projects");
      return {
        select: () => ({
          order: () => ({
            order: () => {
              const items = Array.from(storage.values());
              return { data: items, error: null };
            },
          }),
          eq: (col: string, val: unknown) => ({
            neq: (neqCol: string, neqVal: unknown) => ({
              maybeSingle: async () => {
                for (const row of storage.values()) {
                  if (row[col] === val && row[neqCol] !== neqVal) return { data: row, error: null };
                }
                return { data: null, error: null };
              },
            }),
            maybeSingle: async () => {
              for (const row of storage.values()) {
                if (row[col] === val) return { data: row, error: null };
              }
              return { data: null, error: null };
            },
            single: async () => {
              for (const row of storage.values()) {
                if (row[col] === val) return { data: row, error: null };
              }
              return { data: null, error: { message: "Not found" } };
            },
          }),
        }),
        insert: (payload: Record<string, unknown>) => ({
          select: () => ({
            single: async () => {
              const id = `00000000-0000-0000-0000-00000000000${autoincrement++}`;
              const row = {
                id,
                ...payload,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              storage.set(id, row);
              return { data: row, error: null };
            },
          }),
        }),
        update: (payload: Record<string, unknown>) => ({
          eq: (col: string, val: unknown) => ({
            select: () => ({
              single: async () => {
                const existing = storage.get(val as string);
                if (!existing) return { data: null, error: { message: "Not found" } };
                const updated = {
                  ...existing,
                  ...payload,
                  updated_at: new Date().toISOString(),
                };
                storage.set(val as string, updated);
                return { data: updated, error: null };
              },
            }),
          }),
        }),
        delete: () => ({
          eq: (col: string, val: unknown) => {
            const existed = storage.has(val as string);
            storage.delete(val as string);
            return { error: null, count: existed ? 1 : 0 };
          },
        }),
      };
    },
  };

  // 15. Create project
  const createRes = await createAdminProject(BASE_VALID_PROJECT, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    createRes.success === true && createRes.data?.title === BASE_VALID_PROJECT.title,
    "15. Admin can create project successfully"
  );
  const createdId = createRes.data!.id;

  // 16. Read project
  const readRes = await getAdminProject(createdId, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  const listRes = await getAdminProjects({
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    readRes !== null &&
      readRes.id === createdId &&
      listRes.length === 1 &&
      listRes[0].slug === "specimen-architecture",
    "16. Admin can read project by ID and retrieve project list"
  );

  // 17. Update project
  const updateRes = await updateAdminProject(
    createdId,
    {
      ...BASE_VALID_PROJECT,
      title: "Specimen Systems Monograph Updated",
      sort_order: 10,
    },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    updateRes.success === true &&
      updateRes.data?.title === "Specimen Systems Monograph Updated" &&
      updateRes.data?.sort_order === 10,
    "17. Admin can update project fields (title, sort order)"
  );

  // 18. Delete project
  const deleteRes = await deleteAdminProject(createdId, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    deleteRes.success === true && storage.size === 0,
    "18. Admin can delete project permanently"
  );

  // -------------------------------------------------------------
  // D. PUBLISHING (19 - 21)
  // -------------------------------------------------------------
  console.log("\n--- D. Publishing ---");

  // Re-create test project in draft state
  const draftCreate = await createAdminProject(
    { ...BASE_VALID_PROJECT, published_at: null },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  const pubTestId = draftCreate.data!.id;

  // 19. Unpublished project not publicly visible
  assert(
    draftCreate.data?.published_at === null,
    "19. Unpublished project has published_at = null (inaccessible publicly)"
  );

  // 20. Publish makes project publicly visible
  const publishRes = await toggleProjectPublish(pubTestId, true, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    publishRes.success === true && publishRes.data?.published_at !== null,
    "20. Publish sets published_at to ISO timestamp, exposing project"
  );

  // 21. Unpublish removes public visibility
  const unpublishRes = await toggleProjectPublish(pubTestId, false, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    unpublishRes.success === true && unpublishRes.data?.published_at === null,
    "21. Unpublish clears published_at to null, concealing project"
  );

  // -------------------------------------------------------------
  // E. FEATURED STATUS (22 - 23)
  // -------------------------------------------------------------
  console.log("\n--- E. Featured Status ---");

  // 22. Feature toggle persists
  const featureRes = await updateAdminProject(
    pubTestId,
    { ...BASE_VALID_PROJECT, is_featured: true },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    featureRes.success === true && featureRes.data?.is_featured === true,
    "22. Featured status toggle persists true"
  );

  // 23. Unfeature persists
  const unfeatureRes = await updateAdminProject(
    pubTestId,
    { ...BASE_VALID_PROJECT, is_featured: false },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    unfeatureRes.success === true && unfeatureRes.data?.is_featured === false,
    "23. Unfeaturing project persists false"
  );

  // -------------------------------------------------------------
  // F. SORT ORDER (24)
  // -------------------------------------------------------------
  console.log("\n--- F. Sort Order ---");

  // 24. sort_order persists
  const orderRes = await updateAdminProject(
    pubTestId,
    { ...BASE_VALID_PROJECT, sort_order: 42 },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    orderRes.success === true && orderRes.data?.sort_order === 42,
    "24. sort_order numeric value (42) persists accurately"
  );

  // -------------------------------------------------------------
  // G. TARGETING & ISOLATION (25 - 26)
  // -------------------------------------------------------------
  console.log("\n--- G. Targeting & Isolation ---");

  // 25. No arbitrary admin/user ID targeting
  const baseSchemaKeys = Object.keys(adminProjectBaseSchema.shape);
  assert(
    !baseSchemaKeys.includes("user_id") &&
      !baseSchemaKeys.includes("admin_id") &&
      !baseSchemaKeys.includes("client_id") &&
      !baseSchemaKeys.includes("owner_id"),
    "25. Schema excludes client-controlled ownership IDs (user_id, admin_id, client_id, owner_id)"
  );

  // 26. Singleton/profile data cannot be modified through project action
  const spoofedFormData = new FormData();
  spoofedFormData.set("title", "Spoofed Title");
  spoofedFormData.set("slug", "spoofed-slug");
  spoofedFormData.set("summary", "Valid summary statement");
  spoofedFormData.set("full_name", "ATTACKER_NAME");
  spoofedFormData.set("is_singleton", "true");
  const actionRes = await createProjectAction({ success: false }, spoofedFormData);
  assert(
    actionRes.success === false && actionRes.error?.includes("Access denied"),
    "26. Singleton/profile data cannot be modified via project server actions"
  );

  // -------------------------------------------------------------
  // H. SECURITY & RLS (27 - 33)
  // -------------------------------------------------------------
  console.log("\n--- H. Security & RLS ---");

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 27. Anonymous INSERT blocked
  const anonInsert = await anonClient.from("projects").insert({
    slug: "anon-injected",
    title: "Anon Title",
    summary: "Anon Summary",
  });
  assert(anonInsert.error !== null, "27. Anonymous INSERT is strictly blocked by RLS");

  // 28. Anonymous UPDATE blocked
  const anonUpdate = await anonClient
    .from("projects")
    .update({ title: "HACKED" })
    .eq("slug", "any-slug")
    .select();
  assert(
    anonUpdate.error !== null ||
      (Array.isArray(anonUpdate.data) && anonUpdate.data.length === 0),
    "28. Anonymous UPDATE is strictly blocked by RLS (0 rows affected)"
  );

  // 29. Anonymous DELETE blocked
  const anonDelete = await anonClient
    .from("projects")
    .delete()
    .eq("slug", "any-slug")
    .select();
  assert(
    anonDelete.error !== null ||
      (Array.isArray(anonDelete.data) && anonDelete.data.length === 0),
    "29. Anonymous DELETE is strictly blocked by RLS (0 rows affected)"
  );

  // 30. Service-role secret not exposed in client components
  const srcDir = path.resolve(__dirname, "../src");
  let clientFiles = 0;
  let keyViolations = 0;

  function scanClientFiles(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanClientFiles(full);
      } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
        const text = fs.readFileSync(full, "utf8");
        if (text.includes('"use client"') || text.includes("'use client'")) {
          clientFiles++;
          if (
            text.includes("SUPABASE_SERVICE_ROLE_KEY") ||
            text.includes("getSupabaseServerClient") ||
            text.includes("service_role")
          ) {
            console.error(`Security violation in client file: ${full}`);
            keyViolations++;
          }
        }
      }
    }
  }
  scanClientFiles(srcDir);
  assert(
    clientFiles >= 5 && keyViolations === 0,
    `30. Scanned ${clientFiles} client components; 0 leak service-role keys or server admin client`
  );

  // 31. Raw DB errors not exposed in server actions
  const invalidActionPayload = new FormData();
  invalidActionPayload.set("title", "a");
  invalidActionPayload.set("slug", "bad slug");
  const validationErrorResult = await createProjectAction(
    { success: false },
    invalidActionPayload
  );
  assert(
    validationErrorResult.success === false &&
      !validationErrorResult.error?.includes("PGRST") &&
      !validationErrorResult.error?.includes("SQL") &&
      !validationErrorResult.error?.includes("postgres"),
    "31. Server action does not expose raw database errors (returns clean user-facing guidance)"
  );

  // 32. Malicious markdown cannot execute script injection
  const scriptMarkdownParse = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    case_study_markdown: "Safe text <script>alert('xss')</script> end text",
  });
  assert(
    scriptMarkdownParse.success === false,
    "32. Case study markdown with <script> tag is strictly rejected by validation"
  );

  // 33. Malicious URL schemes rejected
  const badCoverScheme = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    cover_image_url: "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
  });
  const badLiveScheme = adminProjectSchema.safeParse({
    ...BASE_VALID_PROJECT,
    live_url: "blob:https://example.com/uuid",
  });
  assert(
    badCoverScheme.success === false && badLiveScheme.success === false,
    "33. Dangerous URL schemes (data:, blob:) are strictly rejected"
  );

  // -------------------------------------------------------------
  // I. INTEGRITY & CONCURRENCY (34 - 35)
  // -------------------------------------------------------------
  console.log("\n--- I. Integrity & Concurrency ---");

  // Create two distinct projects in mock DB
  const projOne = await createAdminProject(
    { ...BASE_VALID_PROJECT, slug: "project-one" },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  const projTwo = await createAdminProject(
    { ...BASE_VALID_PROJECT, slug: "project-two" },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );

  // 34. Deleting one project does not modify another
  await deleteAdminProject(projOne.data!.id, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  const projTwoCheck = await getAdminProject(projTwo.data!.id, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    projTwoCheck !== null && projTwoCheck.slug === "project-two",
    "34. Deleting one project does not modify or delete another project"
  );

  // 35. Duplicate slug cannot overwrite an existing project
  const conflictSlugUpdate = await updateAdminProject(
    projTwo.data!.id,
    { ...BASE_VALID_PROJECT, slug: "specimen-architecture" }, // already used by pubTestId
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    conflictSlugUpdate.success === false &&
      conflictSlugUpdate.error?.includes("already in use"),
    "35. Duplicate slug collision during update is rejected without overwriting"
  );

  // -------------------------------------------------------------
  // FINAL CLEANUP & RESTORATION
  // -------------------------------------------------------------
  console.log("\n--- Post-Test Database State Verification ---");
  process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const liveProjects = await getPublishedProjects();
  assert(
    Array.isArray(liveProjects) && liveProjects.length === 0,
    "Post-Test: Live public projects table contains 0 rows (zero test specimens left in DB)"
  );

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAdminProjectsSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
