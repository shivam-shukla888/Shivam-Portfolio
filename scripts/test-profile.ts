import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { getProfileSettings } from "../src/lib/profile";
import { resetSupabaseServerClient } from "../src/lib/supabase/server";

// Automated Suite for Real Profile Data Integration Verification (Phase 14.1)
async function runProfileIntegrationSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // REAL PROFILE DATA INTEGRATION SUITE (14.1)");
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

  const SUPABASE_URL = "https://vahalxnimswrhmoyzbse.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhaGFseG5pbXN3cmhtb3l6YnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzUwNTksImV4cCI6MjEwNTY1MTA1OX0.7RzKO58zXuZ_zfulPypETCnwVACba3Iy9uw_7rC1LDk";

  // -------------------------------------------------------------
  // TEST A: UNCONFIGURED / OFFLINE FALLBACK INTEGRITY
  // -------------------------------------------------------------
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const offlineData = await getProfileSettings();

  assert(
    offlineData.fullName === "Shivam Shukla",
    "A.1 Offline fallback returns verified name 'Shivam Shukla'"
  );
  assert(
    offlineData.email === "theshivamshukla.4uu@gmail.com",
    "A.2 Offline fallback returns verified email"
  );
  assert(
    offlineData.phone === "8887780625",
    "A.3 Offline fallback returns verified phone"
  );
  assert(
    offlineData.contraUrl === "https://contra.com/shivam_shukla_7duxsdr7/work",
    "A.4 Offline fallback returns verified clean Contra URL"
  );
  assert(
    offlineData.linkedinUrl === "https://www.linkedin.com/in/shivam-shukla-186276374/",
    "A.5 Offline fallback returns verified LinkedIn URL"
  );
  assert(
    offlineData.githubUrl === "https://github.com/shivam-shukla888",
    "A.6 Offline fallback returns verified GitHub URL"
  );
  assert(
    offlineData.instagramUrl === "https://www.instagram.com/shastra2003",
    "A.7 Offline fallback returns verified Instagram URL"
  );
  assert(
    offlineData.xUrl === "https://x.com/shastra2003",
    "A.8 Offline fallback returns verified X URL"
  );
  assert(
    offlineData.positioningStatement === "[PERSONAL POSITIONING PENDING]",
    "A.9 Offline unsupplied positioning remains canonical placeholder"
  );
  assert(
    offlineData.heroSupportingText === "[SHORT SUPPORTING CONTENT PENDING]",
    "A.10 Offline unsupplied hero text remains canonical placeholder"
  );
  assert(
    offlineData.aboutMarkdown === "[ABOUT CONTENT PENDING]",
    "A.11 Offline unsupplied about copy remains canonical placeholder"
  );
  assert(
    offlineData.contactInstructions === "[CONTACT DETAILS PENDING]",
    "A.12 Offline unsupplied contact instructions remain canonical placeholder"
  );
  assert(
    offlineData.availabilityStatus === null,
    "A.13 Offline availability status remains null without inventing values"
  );

  // -------------------------------------------------------------
  // TEST B: LIVE DATABASE PROFILE INTEGRITY
  // -------------------------------------------------------------
  process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  resetSupabaseServerClient();

  const liveData = await getProfileSettings();

  assert(
    liveData.fullName === "Shivam Shukla",
    "B.1 Live database returns real name 'Shivam Shukla'"
  );
  assert(
    liveData.email === "theshivamshukla.4uu@gmail.com",
    "B.2 Live database returns real email 'theshivamshukla.4uu@gmail.com'"
  );
  assert(
    liveData.phone === "8887780625",
    "B.3 Live database returns real phone '8887780625'"
  );
  assert(
    liveData.contraUrl === "https://contra.com/shivam_shukla_7duxsdr7/work",
    "B.4 Live database returns real Contra URL without tracking parameters"
  );
  assert(
    liveData.linkedinUrl === "https://www.linkedin.com/in/shivam-shukla-186276374/",
    "B.5 Live database returns real LinkedIn URL"
  );
  assert(
    liveData.githubUrl === "https://github.com/shivam-shukla888",
    "B.6 Live database returns real GitHub URL"
  );
  assert(
    liveData.instagramUrl === "https://www.instagram.com/shastra2003",
    "B.7 Live database returns real Instagram URL"
  );
  assert(
    liveData.xUrl === "https://x.com/shastra2003",
    "B.8 Live database returns real X URL"
  );
  assert(
    liveData.positioningStatement === "[PERSONAL POSITIONING PENDING]",
    "B.9 Live NULL positioning_statement cleanly resolves to [PERSONAL POSITIONING PENDING]"
  );
  assert(
    liveData.heroSupportingText === "[SHORT SUPPORTING CONTENT PENDING]",
    "B.10 Live NULL hero_supporting_text cleanly resolves to [SHORT SUPPORTING CONTENT PENDING]"
  );
  assert(
    liveData.aboutMarkdown === "[ABOUT CONTENT PENDING]",
    "B.11 Live NULL about_markdown cleanly resolves to [ABOUT CONTENT PENDING]"
  );
  assert(
    liveData.contactInstructions === "[CONTACT DETAILS PENDING]",
    "B.12 Live NULL contact_instructions cleanly resolves to [CONTACT DETAILS PENDING]"
  );
  assert(
    liveData.availabilityStatus === null,
    "B.13 Live NULL availability_status remains strictly null"
  );

  // -------------------------------------------------------------
  // TEST C: DATABASE ROW COUNT & SINGLETON INTEGRITY
  // -------------------------------------------------------------
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: rows, error: countErr } = await anonClient
    .from("profile_settings")
    .select("id, is_singleton");

  assert(
    countErr === null && Array.isArray(rows) && rows.length === 1,
    "C.1 Exactly one singleton profile row exists in the database"
  );
  assert(
    rows?.[0]?.is_singleton === true,
    "C.2 The single record has is_singleton = true"
  );

  // -------------------------------------------------------------
  // TEST D: PUBLIC WRITE PROTECTION ENFORCEMENT
  // -------------------------------------------------------------
  const anonUpdate = await anonClient
    .from("profile_settings")
    .update({ full_name: "Hacked Name" })
    .eq("is_singleton", true)
    .select();
  assert(
    anonUpdate.error !== null ||
      (Array.isArray(anonUpdate.data) && anonUpdate.data.length === 0),
    "D.1 Public anon UPDATE affects 0 rows due to strict RLS"
  );

  const anonInsert = await anonClient
    .from("profile_settings")
    .insert({ full_name: "Attacker Second Singleton", is_singleton: true });
  assert(
    anonInsert.error !== null && (anonInsert.error.code === "42501" || anonInsert.error.message.includes("row-level security")),
    "D.2 Public anon INSERT is blocked with RLS violation"
  );

  // -------------------------------------------------------------
  // TEST E: ZERO SERVICE ROLE LEAKAGE IN CLIENT COMPONENTS
  // -------------------------------------------------------------
  const srcDir = path.resolve(__dirname, "../src");
  let clientFiles = 0;
  let leaks = 0;

  function scanDir(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        scanDir(full);
      } else if (/\.(tsx|jsx|ts|js)$/.test(ent.name)) {
        const text = fs.readFileSync(full, "utf8");
        if (text.includes('"use client"') || text.includes("'use client'")) {
          clientFiles++;
          if (
            text.includes("SUPABASE_SERVICE_ROLE_KEY") ||
            text.includes("getSupabaseServerClient")
          ) {
            console.error(`Security leak in client component: ${full}`);
            leaks++;
          }
        }
      }
    }
  }

  scanDir(srcDir);
  assert(
    clientFiles >= 4 && leaks === 0,
    `E.1 Scanned ${clientFiles} client components; zero leaks of service-role keys`
  );

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

runProfileIntegrationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
