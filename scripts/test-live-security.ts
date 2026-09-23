import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function getLocalSupabaseEnv(): { url?: string; anonKey?: string } {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }

  const content = fs.readFileSync(envPath, "utf8");
  const parsed: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      parsed[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
  }

  return {
    url: parsed.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export async function runLiveSecurityVerification() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // LIVE SUPABASE SECURITY & RLS VERIFICATION");
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

  const { url, anonKey } = getLocalSupabaseEnv();

  if (!url || !anonKey) {
    console.warn("⚠️ LIVE DATABASE VERIFICATION: PENDING (credentials not found)");
    return;
  }

  console.log(`Target Supabase Host: ${new URL(url).hostname}\n`);

  const anonClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // -------------------------------------------------------------
  // 1. INITIAL ROW COUNT AUDIT
  // -------------------------------------------------------------
  console.log("--- 1. Baseline Row Count Audit ---");
  const { data: profileRows, error: profileErr } = await anonClient
    .from("profile_settings")
    .select("id, full_name, is_singleton");

  assert(!profileErr && profileRows !== null, "1.1 profile_settings query succeeds");
  assert(profileRows?.length === 1, `1.2 profile_settings contains exactly 1 singleton row (found: ${profileRows?.length})`);

  const { data: projRows } = await anonClient.from("projects").select("id");
  assert(Array.isArray(projRows), "1.3 projects table exists and responds to anon query");

  const { data: servRows } = await anonClient.from("services").select("id");
  assert(Array.isArray(servRows), "1.4 services table exists and responds to anon query");

  const { data: prodRows } = await anonClient.from("public_products").select("id");
  assert(Array.isArray(prodRows), "1.5 public_products view exists and responds to anon query");

  const { data: labRows } = await anonClient.from("lab_entries").select("id");
  assert(Array.isArray(labRows), "1.6 lab_entries table exists and responds to anon query");

  // -------------------------------------------------------------
  // 2. NEGATIVE ACCESS: STORAGE ASSET PATH PROTECTION
  // -------------------------------------------------------------
  console.log("\n--- 2. Storage Asset Path Protection ---");
  const storagePathAttempt = await anonClient.from("products").select("storage_asset_path");
  assert(
    storagePathAttempt.error?.code === "42501" ||
    storagePathAttempt.error?.message?.includes("permission denied"),
    `2.1 Anon SELECT on products.storage_asset_path is strictly rejected with 42501 (received: ${storagePathAttempt.error?.code})`
  );

  const viewAttempt = await anonClient.from("public_products").select("storage_asset_path");
  assert(
    Boolean(viewAttempt.error),
    "2.2 public_products view strictly excludes storage_asset_path column"
  );

  // -------------------------------------------------------------
  // 3. NEGATIVE ACCESS: CONTACT SUBMISSIONS PRIVACY
  // -------------------------------------------------------------
  console.log("\n--- 3. Contact Submissions Privacy ---");
  const contactSelectAttempt = await anonClient.from("contact_submissions").select("*");
  assert(
    contactSelectAttempt.error?.code === "42501" || (Array.isArray(contactSelectAttempt.data) && contactSelectAttempt.data.length === 0),
    "3.1 Anon SELECT on contact_submissions returns zero rows or 42501 permission denied"
  );

  const contactInsertAttempt = await anonClient.from("contact_submissions").insert({
    name: "Synthetic Adversary",
    email: "adversary@unauthorized.test",
    brief: "Testing direct injection into contact_submissions",
    ip_hash: "0000000000000000",
  });
  assert(
    contactInsertAttempt.error?.code === "42501" ||
    contactInsertAttempt.error?.message?.includes("permission denied") ||
    contactInsertAttempt.error?.message?.includes("row-level security"),
    `3.2 Direct anon INSERT on contact_submissions strictly rejected (error code: ${contactInsertAttempt.error?.code})`
  );

  // -------------------------------------------------------------
  // 4. NEGATIVE ACCESS: PUBLIC MUTATION REJECTION (DEFENSE-IN-DEPTH)
  // -------------------------------------------------------------
  console.log("\n--- 4. Negative Public Mutation Rejection ---");

  const projectInsert = await anonClient.from("projects").insert({
    slug: "adversarial-project-probe",
    title: "Adversarial Probe",
  });
  assert(
    projectInsert.error?.code === "42501",
    `4.1 Anon INSERT on projects table rejected with 42501 (received: ${projectInsert.error?.code})`
  );

  const serviceInsert = await anonClient.from("services").insert({
    slug: "adversarial-service-probe",
    title: "Adversarial Probe",
  });
  assert(
    serviceInsert.error?.code === "42501",
    `4.2 Anon INSERT on services table rejected with 42501 (received: ${serviceInsert.error?.code})`
  );

  const productInsert = await anonClient.from("products").insert({
    slug: "adversarial-product-probe",
    title: "Adversarial Probe",
    price_in_cents: 1000,
    product_type: "monograph",
  });
  assert(
    productInsert.error?.code === "42501",
    `4.3 Anon INSERT on products table rejected with 42501 (received: ${productInsert.error?.code})`
  );

  const labInsert = await anonClient.from("lab_entries").insert({
    slug: "adversarial-lab-probe",
    category: "idea",
    title: "Adversarial Probe",
  });
  assert(
    labInsert.error?.code === "42501",
    `4.4 Anon INSERT on lab_entries table rejected with 42501 (received: ${labInsert.error?.code})`
  );

  const profileUpdate = await anonClient
    .from("profile_settings")
    .update({ full_name: "Defaced Name" })
    .eq("is_singleton", true);
  assert(
    profileUpdate.error?.code === "42501",
    `4.5 Anon UPDATE on profile_settings rejected with 42501 (received: ${profileUpdate.error?.code})`
  );

  const profileDelete = await anonClient
    .from("profile_settings")
    .delete()
    .eq("is_singleton", true);
  assert(
    profileDelete.error?.code === "42501",
    `4.6 Anon DELETE on profile_settings rejected with 42501 (received: ${profileDelete.error?.code})`
  );

  const projectDelete = await anonClient
    .from("projects")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  assert(
    projectDelete.error?.code === "42501",
    `4.7 Anon DELETE on projects rejected with 42501 (received: ${projectDelete.error?.code})`
  );

  const serviceDelete = await anonClient
    .from("services")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  assert(
    serviceDelete.error?.code === "42501",
    `4.8 Anon DELETE on services rejected with 42501 (received: ${serviceDelete.error?.code})`
  );

  const productDelete = await anonClient
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  assert(
    productDelete.error?.code === "42501",
    `4.9 Anon DELETE on products rejected with 42501 (received: ${productDelete.error?.code})`
  );

  const labDelete = await anonClient
    .from("lab_entries")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  assert(
    labDelete.error?.code === "42501",
    `4.10 Anon DELETE on lab_entries rejected with 42501 (received: ${labDelete.error?.code})`
  );

  // -------------------------------------------------------------
  // 5. POST-TEST INTEGRITY & RESIDUE AUDIT
  // -------------------------------------------------------------
  console.log("\n--- 5. Clean Residue & Row Count Verification ---");
  const { data: finalProfile } = await anonClient
    .from("profile_settings")
    .select("full_name")
    .eq("is_singleton", true)
    .single();

  assert(
    finalProfile?.full_name === "Shivam Shukla",
    `5.1 profile_settings singleton name unaltered (actual: "${finalProfile?.full_name}")`
  );

  const { data: finalProjects } = await anonClient.from("projects").select("id");
  assert(
    finalProjects?.length === (projRows?.length ?? 0),
    `5.2 projects row count clean (count: ${finalProjects?.length})`
  );

  const { data: finalServices } = await anonClient.from("services").select("id");
  assert(
    finalServices?.length === (servRows?.length ?? 0),
    `5.3 services row count clean (count: ${finalServices?.length})`
  );

  const { data: finalProducts } = await anonClient.from("public_products").select("id");
  assert(
    finalProducts?.length === (prodRows?.length ?? 0),
    `5.4 products row count clean (count: ${finalProducts?.length})`
  );

  const { data: finalLab } = await anonClient.from("lab_entries").select("id");
  assert(
    finalLab?.length === (labRows?.length ?? 0),
    `5.5 lab_entries row count clean (count: ${finalLab?.length})`
  );

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runLiveSecurityVerification().catch((err) => {
  console.error("Live verification execution failed:", err);
  process.exit(1);
});
