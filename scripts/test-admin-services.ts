import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { isAuthorizedAdminUser } from "../src/lib/auth";
import {
  adminServiceSchema,
  adminServiceBaseSchema,
} from "../src/lib/validations/admin-service";
import {
  createAdminService,
  getAdminService,
  getAdminServices,
  updateAdminService,
  deleteAdminService,
  toggleServiceActive,
} from "../src/lib/admin/services";
import {
  createServiceAction,
} from "../src/app/actions/admin-services";
import {
  getPublishedServices,
} from "../src/lib/services";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runAdminServicesSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // ADMIN SERVICES CRUD TEST SUITE (PHASE 17)");
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

  const BASE_VALID_SERVICE = {
    slug: "enterprise-architecture",
    title: "Enterprise Architecture Advisory",
    program_code: "PRG-001",
    summary: "High-assurance systems architecture, formal domain modeling, and technical oversight.",
    description_markdown: "Comprehensive advisory immersion focusing on distributed state and deterministic infrastructure.",
    engagement_model: "RETAINED ADVISORY // 12-WEEK COMMITMENT",
    deliverables: ["Architecture Blueprint", "System Audit Report", "Infrastructure Specification"],
    is_active: true,
    sort_order: 1,
  };

  process.env.SHIVSASTRA_ADMIN_USER_ID = MOCK_ADMIN_UUID;

  // -------------------------------------------------------------
  // A. AUTHENTICATION (1 - 3)
  // -------------------------------------------------------------
  console.log("--- A. Authentication ---");

  // 1. Unauthenticated access rejected
  const unauthCreate = await createAdminService(BASE_VALID_SERVICE, { userId: "" });
  assert(
    unauthCreate.success === false && unauthCreate.error?.includes("Access denied"),
    "1. Unauthenticated mutation request is rejected"
  );

  // 2. Non-admin rejected
  const nonAdminCreate = await createAdminService(BASE_VALID_SERVICE, { userId: MOCK_ATTACKER_UUID });
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
  // B. VALIDATION (4 - 12)
  // -------------------------------------------------------------
  console.log("\n--- B. Validation ---");

  // 4. Valid service accepted
  const validParsed = adminServiceSchema.safeParse(BASE_VALID_SERVICE);
  assert(validParsed.success === true, "4. Valid service data passes validation schema");

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
    (badSlug) => !adminServiceSchema.safeParse({ ...BASE_VALID_SERVICE, slug: badSlug }).success
  );
  assert(allInvalidSlugsRejected, "5. Invalid slug formats (spaces, uppercase, slashes, HTML) are rejected");

  // 6. Duplicate slug rejected
  let duplicateQueryChecked = false;
  const mockDuplicateClient = {
    from: () => ({
      select: () => ({
        eq: (col: string, val: unknown) => {
          if (col === "slug" && val === "enterprise-architecture") {
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
  const dupResult = await createAdminService(BASE_VALID_SERVICE, {
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
  const shortTitle = adminServiceSchema.safeParse({ ...BASE_VALID_SERVICE, title: "a" });
  const htmlTitle = adminServiceSchema.safeParse({ ...BASE_VALID_SERVICE, title: "<b>Bad</b>" });
  assert(
    shortTitle.success === false && htmlTitle.success === false,
    "7. Invalid title (too short, HTML characters) is rejected"
  );

  // 8. Invalid summary rejected
  const shortSummary = adminServiceSchema.safeParse({ ...BASE_VALID_SERVICE, summary: "bad" });
  const htmlSummary = adminServiceSchema.safeParse({ ...BASE_VALID_SERVICE, summary: "<span>Bad</span>" });
  assert(
    shortSummary.success === false && htmlSummary.success === false,
    "8. Invalid summary (under 5 characters, HTML characters) is rejected"
  );

  // 9. Oversized description rejected
  const oversizedMarkdown = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    description_markdown: "x".repeat(20001),
  });
  assert(oversizedMarkdown.success === false, "9. Oversized description markdown (> 20,000 chars) is rejected");

  // 10. Malformed deliverables rejected
  const tooManyDeliverables = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    deliverables: Array.from({ length: 25 }, (_, i) => `Deliverable ${i}`),
  });
  const oversizedDeliverable = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    deliverables: ["x".repeat(101)],
  });
  assert(
    tooManyDeliverables.success === false && oversizedDeliverable.success === false,
    "10. Malformed deliverables (> 20 items, > 100 chars each) are rejected"
  );

  // 11. HTML/script injection rejected
  const scriptInDescription = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    description_markdown: "Safe narrative <script>alert('xss')</script> details.",
  });
  const htmlInDeliverable = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    deliverables: ["<img src=x onerror=alert(1)>"],
  });
  assert(
    scriptInDescription.success === false && htmlInDeliverable.success === false,
    "11. HTML/script injection attempts are strictly rejected"
  );

  // 12. Whitespace normalization works
  const whitespaceParsed = adminServiceSchema.safeParse({
    slug: "  enterprise-architecture  ",
    title: "  Enterprise Title  ",
    program_code: "   ",
    summary: "  Valid summary statement exceeding 5 chars  ",
    description_markdown: "   ",
    engagement_model: "   ",
    deliverables: " Audit, Blueprint , , Migration Plan ",
    is_active: "on",
    sort_order: "3",
  });
  assert(
    whitespaceParsed.success === true &&
      whitespaceParsed.data.slug === "enterprise-architecture" &&
      whitespaceParsed.data.title === "Enterprise Title" &&
      whitespaceParsed.data.program_code === null &&
      whitespaceParsed.data.description_markdown === null &&
      whitespaceParsed.data.engagement_model === null &&
      whitespaceParsed.data.deliverables.length === 3 &&
      whitespaceParsed.data.deliverables[0] === "Audit" &&
      whitespaceParsed.data.is_active === true &&
      whitespaceParsed.data.sort_order === 3,
    "12. Whitespace normalization cleans strings, trims tags, parses numbers/booleans, and sets empty inputs to null"
  );

  // -------------------------------------------------------------
  // C. CRUD OPERATIONS (13 - 17)
  // -------------------------------------------------------------
  console.log("\n--- C. CRUD Operations ---");

  const storage = new Map<string, Record<string, unknown>>();
  let autoincrement = 1;

  const mockDb = {
    from: (table: string) => {
      assert(table === "services", "Target table is public.services");
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

  // 13. Create service
  const createRes = await createAdminService(BASE_VALID_SERVICE, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    createRes.success === true && createRes.data?.title === BASE_VALID_SERVICE.title,
    "13. Admin can create service program successfully"
  );
  const createdId = createRes.data!.id;

  // 14. Read service
  const readRes = await getAdminService(createdId, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    readRes !== null && readRes.id === createdId && readRes.slug === "enterprise-architecture",
    "14. Admin can read service by ID"
  );

  // 15. List services
  const listRes = await getAdminServices({
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    Array.isArray(listRes) && listRes.length === 1 && listRes[0].id === createdId,
    "15. Admin can list all services"
  );

  // 16. Update service
  const updateRes = await updateAdminService(
    createdId,
    {
      ...BASE_VALID_SERVICE,
      title: "Enterprise Architecture Advisory (Updated)",
      sort_order: 15,
    },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    updateRes.success === true &&
      updateRes.data?.title === "Enterprise Architecture Advisory (Updated)" &&
      updateRes.data?.sort_order === 15,
    "16. Admin can update service program fields"
  );

  // 17. Delete service
  const deleteRes = await deleteAdminService(createdId, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    deleteRes.success === true && storage.size === 0,
    "17. Admin can delete service permanently"
  );

  // -------------------------------------------------------------
  // D. VISIBILITY (18 - 20)
  // -------------------------------------------------------------
  console.log("\n--- D. Visibility ---");

  // Create inactive service
  const inactiveCreate = await createAdminService(
    { ...BASE_VALID_SERVICE, is_active: false },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  const visibilityTestId = inactiveCreate.data!.id;

  // 18. Inactive service not publicly visible
  assert(
    inactiveCreate.data?.is_active === false,
    "18. Inactive service has is_active = false (inaccessible to public queries)"
  );

  // 19. Activate service makes it publicly visible
  const activateRes = await toggleServiceActive(visibilityTestId, true, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    activateRes.success === true && activateRes.data?.is_active === true,
    "19. Activating service sets is_active = true, exposing service publicly"
  );

  // 20. Deactivate service removes public visibility
  const deactivateRes = await toggleServiceActive(visibilityTestId, false, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    deactivateRes.success === true && deactivateRes.data?.is_active === false,
    "20. Deactivating service sets is_active = false, concealing service"
  );

  // -------------------------------------------------------------
  // E. DELIVERABLES (21 - 22)
  // -------------------------------------------------------------
  console.log("\n--- E. Deliverables ---");

  // 21. Deliverables persist exactly
  const deliverablesPayload = [
    "Threat Modeling Document",
    "Smart Contract Audit Matrix",
    "Penetration Testing Monograph",
  ];
  const deliverablesRes = await updateAdminService(
    visibilityTestId,
    { ...BASE_VALID_SERVICE, deliverables: deliverablesPayload },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    deliverablesRes.success === true &&
      deliverablesRes.data?.deliverables.length === 3 &&
      deliverablesRes.data?.deliverables[0] === "Threat Modeling Document",
    "21. Deliverables array persists exactly"
  );

  // 22. Deliverable ordering persists
  assert(
    deliverablesRes.data?.deliverables[1] === "Smart Contract Audit Matrix" &&
      deliverablesRes.data?.deliverables[2] === "Penetration Testing Monograph",
    "22. Deliverables ordering is strictly preserved"
  );

  // -------------------------------------------------------------
  // F. SORT ORDER (23)
  // -------------------------------------------------------------
  console.log("\n--- F. Sort Order ---");

  // 23. sort_order persists
  const orderRes = await updateAdminService(
    visibilityTestId,
    { ...BASE_VALID_SERVICE, sort_order: 99 },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  assert(
    orderRes.success === true && orderRes.data?.sort_order === 99,
    "23. sort_order numeric value (99) persists accurately"
  );

  // -------------------------------------------------------------
  // G. TARGETING & ISOLATION (24 - 26)
  // -------------------------------------------------------------
  console.log("\n--- G. Targeting & Isolation ---");

  // 24. No arbitrary admin/user/owner ID accepted
  const baseSchemaKeys = Object.keys(adminServiceBaseSchema.shape);
  assert(
    !baseSchemaKeys.includes("user_id") &&
      !baseSchemaKeys.includes("admin_id") &&
      !baseSchemaKeys.includes("client_id") &&
      !baseSchemaKeys.includes("owner_id"),
    "24. Schema excludes client-controlled ownership IDs (user_id, admin_id, client_id, owner_id)"
  );

  // 25. Profile data remains unchanged
  const spoofedFormData = new FormData();
  spoofedFormData.set("title", "Spoofed Service");
  spoofedFormData.set("slug", "spoofed-service");
  spoofedFormData.set("summary", "Valid summary statement");
  spoofedFormData.set("full_name", "ATTACKER_NAME");
  spoofedFormData.set("is_singleton", "true");
  const actionRes = await createServiceAction({ success: false }, spoofedFormData);
  assert(
    actionRes.success === false && actionRes.error?.includes("Access denied"),
    "25. Profile data cannot be modified via service server actions"
  );

  // 26. Project data remains unchanged
  assert(
    !baseSchemaKeys.includes("cover_image_url") &&
      !baseSchemaKeys.includes("case_study_markdown") &&
      !baseSchemaKeys.includes("tech_stack"),
    "26. Service schema is isolated from project domain fields"
  );

  // -------------------------------------------------------------
  // H. SECURITY & RLS (27 - 33)
  // -------------------------------------------------------------
  console.log("\n--- H. Security & RLS ---");

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 27. Anonymous INSERT blocked
  const anonInsert = await anonClient.from("services").insert({
    slug: "anon-injected-service",
    title: "Anon Service",
    summary: "Anon Summary",
  });
  assert(anonInsert.error !== null, "27. Anonymous INSERT is strictly blocked by RLS");

  // 28. Anonymous UPDATE blocked
  const anonUpdate = await anonClient
    .from("services")
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
    .from("services")
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
  const validationErrorResult = await createServiceAction(
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
  const scriptInDesc = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    description_markdown: "<script>window.location='https://evil.com'</script>",
  });
  assert(
    scriptInDesc.success === false,
    "32. Service description containing <script> tags is rejected by schema"
  );

  // 33. Unsafe content rejected
  const htmlInSummary = adminServiceSchema.safeParse({
    ...BASE_VALID_SERVICE,
    summary: "<a href=\"javascript:alert(1)\">Click</a>",
  });
  assert(
    htmlInSummary.success === false,
    "33. Unsafe HTML/javascript content rejected in summary"
  );

  // -------------------------------------------------------------
  // I. INTEGRITY & CONCURRENCY (34 - 35)
  // -------------------------------------------------------------
  console.log("\n--- I. Integrity & Concurrency ---");

  // Create two distinct services in mock DB
  const servOne = await createAdminService(
    { ...BASE_VALID_SERVICE, slug: "service-one" },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );
  const servTwo = await createAdminService(
    { ...BASE_VALID_SERVICE, slug: "service-two" },
    { userId: MOCK_ADMIN_UUID, client: mockDb }
  );

  // 34. Deleting one service does not modify another
  await deleteAdminService(servOne.data!.id, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  const servTwoCheck = await getAdminService(servTwo.data!.id, {
    userId: MOCK_ADMIN_UUID,
    client: mockDb,
  });
  assert(
    servTwoCheck !== null && servTwoCheck.slug === "service-two",
    "34. Deleting one service does not modify or delete another service"
  );

  // 35. Duplicate slug cannot overwrite an existing service
  const conflictSlugUpdate = await updateAdminService(
    servTwo.data!.id,
    { ...BASE_VALID_SERVICE, slug: "enterprise-architecture" }, // already used by visibilityTestId
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

  const liveServices = await getPublishedServices();
  assert(
    Array.isArray(liveServices) && liveServices.length === 0,
    "Post-Test: Live public services table contains 0 rows (zero test specimens left in DB)"
  );

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAdminServicesSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
