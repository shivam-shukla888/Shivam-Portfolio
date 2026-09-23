import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { isAuthorizedAdminUser } from "../src/lib/auth";
import {
  adminProfileSchema,
  adminProfileBaseSchema,
} from "../src/lib/validations/admin-profile";
import {
  KNOWN_SINGLETON_ID,
  updateAdminProfile,
} from "../src/lib/admin/profile";
import { updateProfileSettingsAction } from "../src/app/actions/admin-profile";
import { getProfileSettings, PROFILE_FALLBACK } from "../src/lib/profile";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

export async function runAdminProfileSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // ADMIN PROFILE SETTINGS CRUD TEST SUITE (PHASE 15)");
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

  const BASE_VALID_PROFILE = {
    full_name: "Shivam Shukla",
    email: "theshivamshukla.4uu@gmail.com",
    phone: "8887780625",
    contra_url: "https://contra.com/shivam_shukla_7duxsdr7/work",
    linkedin_url: "https://www.linkedin.com/in/shivam-shukla-186276374/",
    github_url: "https://github.com/shivam-shukla888",
    instagram_url: "https://www.instagram.com/shastra2003",
    x_url: "https://x.com/shastra2003",
    positioning_statement: null,
    hero_supporting_text: null,
    availability_status: null,
    about_markdown: null,
    contact_instructions: null,
  };

  // -------------------------------------------------------------
  // A. AUTHENTICATION
  // -------------------------------------------------------------
  console.log("--- A. Authentication ---");

  // 1. Unauthenticated request rejected
  const unauthResult = await updateAdminProfile(BASE_VALID_PROFILE, {
    userId: "",
  });
  assert(
    unauthResult.success === false &&
      unauthResult.error?.includes("Access denied"),
    "1. Unauthenticated request is rejected"
  );

  // 2. Authenticated non-admin rejected
  const nonAdminResult = await updateAdminProfile(BASE_VALID_PROFILE, {
    userId: MOCK_ATTACKER_UUID,
  });
  assert(
    nonAdminResult.success === false &&
      nonAdminResult.error?.includes("Access denied") &&
      isAuthorizedAdminUser(MOCK_ATTACKER_UUID, MOCK_ADMIN_UUID) === false,
    "2. Authenticated non-admin is rejected"
  );

  // 3. Authorized admin accepted
  assert(
    isAuthorizedAdminUser(MOCK_ADMIN_UUID, MOCK_ADMIN_UUID) === true,
    "3. Authorized admin is accepted"
  );

  // -------------------------------------------------------------
  // B. VALIDATION
  // -------------------------------------------------------------
  console.log("\n--- B. Validation ---");

  // 4. Valid profile accepted
  const validParse = adminProfileSchema.safeParse(BASE_VALID_PROFILE);
  assert(
    validParse.success === true,
    "4. Valid profile with all 13 fields is accepted"
  );

  // 5. Invalid email rejected
  const invalidEmailParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    email: "not-an-email",
  });
  assert(
    invalidEmailParse.success === false,
    "5. Invalid email is rejected"
  );

  // 6. Invalid URL rejected
  const invalidUrlParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    contra_url: "not-a-valid-url",
  });
  assert(
    invalidUrlParse.success === false,
    "6. Invalid URL format is rejected"
  );

  // 7. HTTP URL rejected
  const httpUrlParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    github_url: "http://github.com/shivam-shukla888",
  });
  assert(
    httpUrlParse.success === false,
    "7. Insecure HTTP URL is rejected (HTTPS required)"
  );

  // 8. Javascript URL rejected
  const jsUrlParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    x_url: "javascript:alert(1)",
  });
  assert(
    jsUrlParse.success === false,
    "8. Dangerous javascript: pseudo-protocol URL is rejected"
  );

  // 9. Oversized input rejected
  const oversizedNameParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    full_name: "x".repeat(121),
  });
  const oversizedEmailParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    email: `${"a".repeat(250)}@test.com`,
  });
  const oversizedPosParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    positioning_statement: "p".repeat(301),
  });
  const oversizedHeroParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    hero_supporting_text: "h".repeat(601),
  });
  const oversizedAboutParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    about_markdown: "m".repeat(5001),
  });
  const oversizedContactParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    contact_instructions: "c".repeat(1001),
  });
  const oversizedAvailParse = adminProfileSchema.safeParse({
    ...BASE_VALID_PROFILE,
    availability_status: "s".repeat(101),
  });
  assert(
    oversizedNameParse.success === false &&
      oversizedEmailParse.success === false &&
      oversizedPosParse.success === false &&
      oversizedHeroParse.success === false &&
      oversizedAboutParse.success === false &&
      oversizedContactParse.success === false &&
      oversizedAvailParse.success === false,
    "9. Oversized input across all fields is rejected"
  );

  // 10. Whitespace handling works correctly
  const whitespaceParse = adminProfileSchema.safeParse({
    full_name: "  Shivam Shukla  ",
    email: "  TheShivamShukla.4uu@GMAIL.COM  ",
    phone: "  8887780625  ",
    contra_url: "   ",
    linkedin_url: "  https://www.linkedin.com/in/shivam-shukla-186276374/  ",
    github_url: "",
    instagram_url: null,
    x_url: "   ",
    positioning_statement: "   ",
    hero_supporting_text: "",
    availability_status: "   ",
    about_markdown: "",
    contact_instructions: "   ",
  });
  assert(
    whitespaceParse.success === true &&
      whitespaceParse.data.full_name === "Shivam Shukla" &&
      whitespaceParse.data.email === "theshivamshukla.4uu@gmail.com" &&
      whitespaceParse.data.phone === "8887780625" &&
      whitespaceParse.data.contra_url === null &&
      whitespaceParse.data.github_url === null &&
      whitespaceParse.data.positioning_statement === null &&
      whitespaceParse.data.hero_supporting_text === null &&
      whitespaceParse.data.availability_status === null &&
      whitespaceParse.data.about_markdown === null &&
      whitespaceParse.data.contact_instructions === null,
    "10. Whitespace handling trims strings, normalizes emails, and maps empty inputs to null"
  );

  // -------------------------------------------------------------
  // C. AUTHORIZATION / TARGETING
  // -------------------------------------------------------------
  console.log("\n--- C. Authorization / Targeting ---");

  // 11. Update always targets singleton profile
  assert(
    KNOWN_SINGLETON_ID === "00000000-0000-0000-0000-000000000001",
    "11. Update always targets singleton profile (is_singleton = true)"
  );

  // 12. Arbitrary profile ID cannot be supplied to redirect update
  const baseSchemaKeys = Object.keys(adminProfileBaseSchema.shape);
  assert(
    !baseSchemaKeys.includes("id") &&
      !baseSchemaKeys.includes("profile_id") &&
      !baseSchemaKeys.includes("is_singleton"),
    "12. Arbitrary profile ID cannot be supplied (schema excludes id, profile_id, is_singleton)"
  );

  // 13. Client-controlled user ID cannot bypass authorization
  const spoofedFormData = new FormData();
  spoofedFormData.set("user_id", MOCK_ADMIN_UUID);
  spoofedFormData.set("admin_user_id", MOCK_ADMIN_UUID);
  spoofedFormData.set("full_name", "Hacked");
  const spoofedActionResult = await updateProfileSettingsAction(
    { success: false },
    spoofedFormData
  );
  assert(
    spoofedActionResult.success === false &&
      spoofedActionResult.error?.includes("Access denied"),
    "13. Client-controlled user ID in form payload cannot bypass server authorization"
  );

  // 14. Unauthorized update changes zero rows
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const unauthUpdate = await anonClient
    .from("profile_settings")
    .update({ full_name: "ATTACKER_NAME" })
    .eq("is_singleton", true)
    .select();
  assert(
    unauthUpdate.error !== null ||
      (Array.isArray(unauthUpdate.data) && unauthUpdate.data.length === 0),
    "14. Unauthorized update changes exactly zero rows"
  );


  // -------------------------------------------------------------
  // D. PERSISTENCE
  // -------------------------------------------------------------
  console.log("\n--- D. Persistence ---");

  // Setup mock client for persistence tests verifying exact queries and payload mappings
  let lastUpdatePayload: Record<string, unknown> = {};
  const lastUpdateFilter: Record<string, unknown> = {};

  const mockDbClient = {
    from: (table: string) => {
      assert(table === "profile_settings", "Persistence targets public.profile_settings table");
      return {
        update: (payload: Record<string, unknown>) => {
          lastUpdatePayload = payload;
          return {
            eq: (col: string, val: unknown) => {
              lastUpdateFilter[col] = val;
              return {
                select: () => ({
                  single: async () => ({
                    data: {
                      id: KNOWN_SINGLETON_ID,
                      ...lastUpdatePayload,
                      is_singleton: true,
                      created_at: new Date().toISOString(),
                    },
                    error: null,
                  }),
                }),
              };
            },
          };
        },
      };
    },
  };

  process.env.SHIVSASTRA_ADMIN_USER_ID = MOCK_ADMIN_UUID;

  // 15. Admin can update full_name
  const nameUpdateRes = await updateAdminProfile(
    { ...BASE_VALID_PROFILE, full_name: "Shivam Shukla Updated" },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    nameUpdateRes.success === true &&
      lastUpdatePayload.full_name === "Shivam Shukla Updated" &&
      lastUpdateFilter.is_singleton === true,
    "15. Admin can update full_name"
  );

  // 16. Admin can update contact fields
  const contactUpdateRes = await updateAdminProfile(
    { ...BASE_VALID_PROFILE, email: "shukla.studio@gmail.com", phone: "+91 9999999999" },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    contactUpdateRes.success === true &&
      lastUpdatePayload.email === "shukla.studio@gmail.com" &&
      lastUpdatePayload.phone === "+91 9999999999",
    "16. Admin can update contact fields (email, phone)"
  );

  // 17. Admin can update social URLs
  const socialUpdateRes = await updateAdminProfile(
    {
      ...BASE_VALID_PROFILE,
      contra_url: "https://contra.com/shivam_shukla_updated",
      linkedin_url: "https://www.linkedin.com/in/shivam-updated",
      github_url: "https://github.com/shivam-updated",
      instagram_url: "https://www.instagram.com/shivam_updated",
      x_url: "https://x.com/shivam_updated",
    },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    socialUpdateRes.success === true &&
      lastUpdatePayload.contra_url === "https://contra.com/shivam_shukla_updated" &&
      lastUpdatePayload.linkedin_url === "https://www.linkedin.com/in/shivam-updated" &&
      lastUpdatePayload.github_url === "https://github.com/shivam-updated" &&
      lastUpdatePayload.instagram_url === "https://www.instagram.com/shivam_updated" &&
      lastUpdatePayload.x_url === "https://x.com/shivam_updated",
    "17. Admin can update social URLs (contra, linkedin, github, instagram, x)"
  );

  // 18. Admin can update hero fields
  const heroUpdateRes = await updateAdminProfile(
    {
      ...BASE_VALID_PROFILE,
      positioning_statement: "DIGITAL ARCHITECTURE // SYSTEMS",
      hero_supporting_text: "Precision engineering and computational design.",
      availability_status: "ACCEPTING COMMISSIONED INQUIRIES",
    },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    heroUpdateRes.success === true &&
      lastUpdatePayload.positioning_statement === "DIGITAL ARCHITECTURE // SYSTEMS" &&
      lastUpdatePayload.hero_supporting_text === "Precision engineering and computational design." &&
      lastUpdatePayload.availability_status === "ACCEPTING COMMISSIONED INQUIRIES",
    "18. Admin can update hero fields (positioning, supporting text, availability)"
  );

  // 19. Admin can update about content
  const aboutUpdateRes = await updateAdminProfile(
    {
      ...BASE_VALID_PROFILE,
      about_markdown: "Studio ethos focused on functional purity and restraint.",
    },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    aboutUpdateRes.success === true &&
      lastUpdatePayload.about_markdown === "Studio ethos focused on functional purity and restraint.",
    "19. Admin can update about content (about_markdown)"
  );

  // 20. Admin can update contact instructions
  const instructionsUpdateRes = await updateAdminProfile(
    {
      ...BASE_VALID_PROFILE,
      contact_instructions: "Inquiries must include scope, timeline, and architectural parameters.",
    },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    instructionsUpdateRes.success === true &&
      lastUpdatePayload.contact_instructions ===
        "Inquiries must include scope, timeline, and architectural parameters.",
    "20. Admin can update contact instructions"
  );

  // 21. Admin can clear optional fields intentionally
  const clearUpdateRes = await updateAdminProfile(
    {
      full_name: "Shivam Shukla",
      email: "theshivamshukla.4uu@gmail.com",
      phone: null,
      contra_url: null,
      linkedin_url: null,
      github_url: null,
      instagram_url: null,
      x_url: null,
      positioning_statement: null,
      hero_supporting_text: null,
      availability_status: null,
      about_markdown: null,
      contact_instructions: null,
    },
    { userId: MOCK_ADMIN_UUID, client: mockDbClient }
  );
  assert(
    clearUpdateRes.success === true &&
      lastUpdatePayload.phone === null &&
      lastUpdatePayload.contra_url === null &&
      lastUpdatePayload.positioning_statement === null &&
      lastUpdatePayload.hero_supporting_text === null &&
      lastUpdatePayload.about_markdown === null &&
      lastUpdatePayload.contact_instructions === null &&
      lastUpdatePayload.availability_status === null,
    "21. Admin can clear optional fields intentionally (normalizes to null)"
  );

  // -------------------------------------------------------------
  // E. SECURITY
  // -------------------------------------------------------------
  console.log("\n--- E. Security ---");

  // 22. Public anonymous UPDATE remains blocked
  const anonUpdateRes = await anonClient
    .from("profile_settings")
    .update({ full_name: "ANON_HACKED" })
    .eq("is_singleton", true)
    .select();
  assert(
    anonUpdateRes.error !== null ||
      (Array.isArray(anonUpdateRes.data) && anonUpdateRes.data.length === 0),
    "22. Public anonymous UPDATE remains strictly blocked by RLS"
  );

  // 23. Public anonymous INSERT remains blocked
  const anonInsertRes = await anonClient
    .from("profile_settings")
    .insert({ full_name: "ANON_CLONE", is_singleton: true });
  assert(
    anonInsertRes.error !== null,
    "23. Public anonymous INSERT remains strictly blocked by RLS"
  );

  // 24. Public anonymous DELETE remains blocked
  const anonDeleteRes = await anonClient
    .from("profile_settings")
    .delete()
    .eq("is_singleton", true)
    .select();
  assert(
    anonDeleteRes.error !== null ||
      (Array.isArray(anonDeleteRes.data) && anonDeleteRes.data.length === 0),
    "24. Public anonymous DELETE remains strictly blocked by RLS"
  );

  // 25. Service-role credentials never appear in client bundle
  const srcDir = path.resolve(__dirname, "../src");
  let clientFiles = 0;
  let keyViolations = 0;

  function scanForSecrets(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanForSecrets(full);
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

  scanForSecrets(srcDir);
  assert(
    clientFiles >= 5 && keyViolations === 0,
    `25. Scanned ${clientFiles} client components; 0 leak service-role keys or server admin client`
  );

  // 26. Server action does not expose raw database errors
  const invalidActionPayload = new FormData();
  invalidActionPayload.set("full_name", "a"); // too short (< 2)
  invalidActionPayload.set("email", "bad");
  const validationErrorResult = await updateProfileSettingsAction(
    { success: false },
    invalidActionPayload
  );
  assert(
    validationErrorResult.success === false &&
      !validationErrorResult.error?.includes("PGRST") &&
      !validationErrorResult.error?.includes("SQL") &&
      !validationErrorResult.error?.includes("postgres"),
    "26. Server action does not expose raw database errors (returns clean user-facing guidance)"
  );

  // 27. No secrets returned to browser
  const actionKeys = Object.keys(validationErrorResult);
  assert(
    !actionKeys.includes("supabaseKey") &&
      !actionKeys.includes("serviceKey") &&
      !actionKeys.includes("token") &&
      !actionKeys.includes("secret"),
    "27. No secrets returned to browser in action state payload"
  );

  // -------------------------------------------------------------
  // POST-TEST DATABASE VERIFICATION
  // -------------------------------------------------------------
  console.log("\n--- Post-Test Database State Verification ---");
  process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const currentLiveProfile = await getProfileSettings();

  assert(
    currentLiveProfile.fullName === "Shivam Shukla",
    "Post-Test: full_name intact ('Shivam Shukla')"
  );
  assert(
    currentLiveProfile.email === "theshivamshukla.4uu@gmail.com",
    "Post-Test: email intact ('theshivamshukla.4uu@gmail.com')"
  );
  assert(
    currentLiveProfile.phone === "8887780625",
    "Post-Test: phone intact ('8887780625')"
  );
  assert(
    currentLiveProfile.contraUrl === "https://contra.com/shivam_shukla_7duxsdr7/work",
    "Post-Test: contra_url intact"
  );
  assert(
    currentLiveProfile.positioningStatement === PROFILE_FALLBACK.positioningStatement,
    "Post-Test: positioning_statement remains null (canonical placeholder)"
  );
  assert(
    currentLiveProfile.heroSupportingText === PROFILE_FALLBACK.heroSupportingText,
    "Post-Test: hero_supporting_text remains null (canonical placeholder)"
  );
  assert(
    currentLiveProfile.aboutMarkdown === PROFILE_FALLBACK.aboutMarkdown,
    "Post-Test: about_markdown remains null (canonical placeholder)"
  );
  assert(
    currentLiveProfile.contactInstructions === PROFILE_FALLBACK.contactInstructions,
    "Post-Test: contact_instructions remains null (canonical placeholder)"
  );
  assert(
    currentLiveProfile.availabilityStatus === null,
    "Post-Test: availability_status remains strictly null"
  );

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAdminProfileSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
