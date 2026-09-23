import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { isAuthorizedAdminUser } from "../src/lib/auth";
import { adminProfileSchema } from "../src/lib/validations/admin-profile";
import { adminProjectSchema } from "../src/lib/validations/admin-project";
import { adminServiceSchema } from "../src/lib/validations/admin-service";
import { adminProductSchema } from "../src/lib/validations/admin-product";
import { adminLabSchema } from "../src/lib/validations/admin-lab";
import { getProfileSettings, PROFILE_FALLBACK } from "../src/lib/profile";
import { getPublishedProjects, getPublishedProjectBySlug } from "../src/lib/projects";
import { getPublishedServices, getPublishedServiceBySlug } from "../src/lib/services";
import { getPublishedStoreProducts, getPublishedStoreProductBySlug } from "../src/lib/products";
import { getPublishedLabEntries, getPublishedLabEntryBySlug } from "../src/lib/lab";
import { generateMetadata as generateProjectMeta } from "../src/app/projects/[slug]/page";
import { generateMetadata as generateServiceMeta } from "../src/app/services/[slug]/page";
import { generateMetadata as generateProductMeta } from "../src/app/store/[slug]/page";
import { generateMetadata as generateLabMeta } from "../src/app/lab/[slug]/page";

function getLocalSupabaseEnv(): { url: string; anonKey: string } {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local not found");
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

  const url = parsed.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  if (anonKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;

  if (!url || !anonKey) {
    throw new Error("Supabase credentials missing in .env.local");
  }

  return { url, anonKey };
}

const { url, anonKey } = getLocalSupabaseEnv();
const anonClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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

const step = process.argv[2] || "all";

async function main() {
  console.log(`\n=======================================================`);
  console.log(`PHASE 23 E2E CMS PIPELINE VERIFICATION [STEP: ${step}]`);
  console.log(`Target: ${new URL(url).hostname}`);
  console.log(`=======================================================\n`);

  if (step === "baseline" || step === "all") {
    console.log("--- Baseline Verification ---");
    assert(!isAuthorizedAdminUser(""), "Empty user ID fails closed in isAuthorizedAdminUser");
    assert(!isAuthorizedAdminUser(null), "Null user ID fails closed in isAuthorizedAdminUser");
    const profile = await getProfileSettings();
    assert(profile.fullName === "Shivam Shukla", "Baseline profile fullName is 'Shivam Shukla'");
    assert(profile.email === "theshivamshukla.4uu@gmail.com", "Baseline profile email is verified");
    assert(profile.phone === "8887780625", "Baseline profile phone is verified");
    assert(profile.contraUrl === "https://contra.com/shivam_shukla_7duxsdr7/work", "Baseline profile Contra URL verified");

    const projects = await getPublishedProjects();
    assert(projects.length === 0, `Baseline published projects count is 0 (found ${projects.length})`);

    const services = await getPublishedServices();
    assert(services.length === 0, `Baseline published services count is 0 (found ${services.length})`);

    const products = await getPublishedStoreProducts();
    assert(products.length === 0, `Baseline published products count is 0 (found ${products.length})`);

    const labEntries = await getPublishedLabEntries();
    assert(labEntries.length === 0, `Baseline published lab entries count is 0 (found ${labEntries.length})`);
  }

  if (step === "profile-mutate") {
    console.log("--- Profile Mutation Verification ---");
    const valid = adminProfileSchema.safeParse({
      full_name: "Shivam Shukla",
      positioning_statement: "TEST — SHIVSASTRA PROFILE PIPELINE",
      email: "theshivamshukla.4uu@gmail.com",
    });
    assert(valid.success, "Profile mutation schema validation passed");

    const profile = await getProfileSettings();
    assert(
      profile.positioningStatement === "TEST — SHIVSASTRA PROFILE PIPELINE",
      `Profile public data layer reflects updated positioning statement (found: "${profile.positioningStatement}")`
    );
  }

  if (step === "profile-restore") {
    console.log("--- Profile Restore Verification ---");
    const profile = await getProfileSettings();
    assert(
      profile.positioningStatement === PROFILE_FALLBACK.positioningStatement,
      `Profile positioning statement reverted to canonical placeholder (found: "${profile.positioningStatement}")`
    );
    assert(profile.fullName === "Shivam Shukla", "Profile full_name remains 'Shivam Shukla'");
    assert(profile.email === "theshivamshukla.4uu@gmail.com", "Profile email remains intact");
  }

  if (step === "project-draft") {
    console.log("--- Project Draft & RLS Isolation Verification ---");
    const valid = adminProjectSchema.safeParse({
      slug: "test-shivsastra-project-pipeline",
      title: "TEST — ShivSastra Project Pipeline",
      summary: "Synthetic QA record for end-to-end CMS verification.",
      case_study_markdown: "Synthetic QA content. Not real portfolio content.",
      published_at: null,
      sort_order: 1,
      is_featured: false,
    });
    assert(valid.success, "Project draft schema validation passed");

    const { data: anonRows } = await anonClient
      .from("projects")
      .select("id")
      .eq("slug", "test-shivsastra-project-pipeline");
    assert(
      anonRows?.length === 0,
      `Draft project RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const publicList = await getPublishedProjects();
    const foundInList = publicList.some((p) => p.slug === "test-shivsastra-project-pipeline");
    assert(!foundInList, "Draft project is strictly absent from getPublishedProjects()");

    const single = await getPublishedProjectBySlug("test-shivsastra-project-pipeline");
    assert(single === null, "Draft project slug fetch getPublishedProjectBySlug returns null");

    const meta = await generateProjectMeta({
      params: Promise.resolve({ slug: "test-shivsastra-project-pipeline" }),
    });
    assert(meta.title === "Project Not Found", "Draft project metadata resolves to 'Project Not Found'");
  }

  if (step === "project-published") {
    console.log("--- Project Published & Public Rendering Verification ---");
    const { data: anonRows } = await anonClient
      .from("projects")
      .select("id, slug, title, published_at")
      .eq("slug", "test-shivsastra-project-pipeline");
    assert(
      anonRows?.length === 1,
      `Published project RLS: anon SELECT returns exactly 1 row (found ${anonRows?.length})`
    );

    const publicList = await getPublishedProjects();
    const foundInList = publicList.find((p) => p.slug === "test-shivsastra-project-pipeline");
    assert(Boolean(foundInList), "Published project is returned by getPublishedProjects()");

    const single = await getPublishedProjectBySlug("test-shivsastra-project-pipeline");
    assert(single !== null, "getPublishedProjectBySlug resolves published project");
    assert(
      single?.title === "TEST — ShivSastra Project Pipeline",
      `Published project title matches (found: "${single?.title}")`
    );

    const meta = await generateProjectMeta({
      params: Promise.resolve({ slug: "test-shivsastra-project-pipeline" }),
    });
    assert(
      meta.title === "TEST — ShivSastra Project Pipeline",
      `SEO metadata title matches project title (found: "${meta.title}")`
    );
    assert(
      meta.description === "Synthetic QA record for end-to-end CMS verification.",
      "SEO metadata description matches project summary"
    );
  }

  if (step === "project-unpublished") {
    console.log("--- Project Unpublished & Removal Verification ---");
    const { data: anonRows } = await anonClient
      .from("projects")
      .select("id")
      .eq("slug", "test-shivsastra-project-pipeline");
    assert(
      anonRows?.length === 0,
      `Unpublished project RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const single = await getPublishedProjectBySlug("test-shivsastra-project-pipeline");
    assert(single === null, "Unpublished project getPublishedProjectBySlug returns null");
  }

  if (step === "project-deleted") {
    console.log("--- Project Deletion Verification ---");
    const { data: anonRows } = await anonClient.from("projects").select("id");
    assert(anonRows?.length === 0, `Projects table returned to 0 rows (found ${anonRows?.length})`);
  }

  if (step === "service-inactive") {
    console.log("--- Service Inactive & RLS Isolation Verification ---");
    const valid = adminServiceSchema.safeParse({
      slug: "test-shivsastra-service-pipeline",
      title: "TEST — ShivSastra Service Pipeline",
      summary: "Synthetic QA record for end-to-end CMS verification.",
      description_markdown: "Synthetic QA content. Not a real service offering.",
      is_active: false,
      sort_order: 1,
    });
    assert(valid.success, "Service inactive schema validation passed");

    const { data: anonRows } = await anonClient
      .from("services")
      .select("id")
      .eq("slug", "test-shivsastra-service-pipeline");
    assert(
      anonRows?.length === 0,
      `Inactive service RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const publicList = await getPublishedServices();
    const found = publicList.some((s) => s.slug === "test-shivsastra-service-pipeline");
    assert(!found, "Inactive service is absent from getPublishedServices()");

    const single = await getPublishedServiceBySlug("test-shivsastra-service-pipeline");
    assert(single === null, "Inactive service getPublishedServiceBySlug returns null");

    const meta = await generateServiceMeta({
      params: Promise.resolve({ slug: "test-shivsastra-service-pipeline" }),
    });
    assert(meta.title === "Service Not Found", "Inactive service metadata resolves to 'Service Not Found'");
  }

  if (step === "service-active") {
    console.log("--- Service Active & Public Rendering Verification ---");
    const { data: anonRows } = await anonClient
      .from("services")
      .select("id, slug, title")
      .eq("slug", "test-shivsastra-service-pipeline");
    assert(
      anonRows?.length === 1,
      `Active service RLS: anon SELECT returns exactly 1 row (found ${anonRows?.length})`
    );

    const publicList = await getPublishedServices();
    const found = publicList.find((s) => s.slug === "test-shivsastra-service-pipeline");
    assert(Boolean(found), "Active service is present in getPublishedServices()");

    const single = await getPublishedServiceBySlug("test-shivsastra-service-pipeline");
    assert(single !== null, "getPublishedServiceBySlug resolves active service");
    assert(
      single?.title === "TEST — ShivSastra Service Pipeline",
      `Active service title matches (found: "${single?.title}")`
    );

    const meta = await generateServiceMeta({
      params: Promise.resolve({ slug: "test-shivsastra-service-pipeline" }),
    });
    assert(
      meta.title === "TEST — ShivSastra Service Pipeline",
      `SEO metadata title matches service title (found: "${meta.title}")`
    );
    assert(
      meta.description === "Synthetic QA record for end-to-end CMS verification.",
      "SEO metadata description matches service summary"
    );
  }

  if (step === "service-deactivated") {
    console.log("--- Service Deactivated Verification ---");
    const { data: anonRows } = await anonClient
      .from("services")
      .select("id")
      .eq("slug", "test-shivsastra-service-pipeline");
    assert(
      anonRows?.length === 0,
      `Deactivated service RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const single = await getPublishedServiceBySlug("test-shivsastra-service-pipeline");
    assert(single === null, "Deactivated service getPublishedServiceBySlug returns null");
  }

  if (step === "service-deleted") {
    console.log("--- Service Deletion Verification ---");
    const { data: anonRows } = await anonClient.from("services").select("id");
    assert(anonRows?.length === 0, `Services table returned to 0 rows (found ${anonRows?.length})`);
  }

  if (step === "store-available") {
    console.log("--- Store Available & Storage Security Verification ---");
    const valid = adminProductSchema.safeParse({
      slug: "test-shivsastra-product-pipeline",
      title: "TEST — ShivSastra Product Pipeline",
      description: "Synthetic QA record. Not a real product.",
      price_in_cents: 1000,
      currency: "INR",
      product_type: "monograph",
      is_available: true,
      sort_order: 1,
    });
    assert(valid.success, "Product schema validation passed");

    // Negative storage_asset_path check on this record
    const storagePathAttempt = await anonClient
      .from("products")
      .select("storage_asset_path")
      .eq("slug", "test-shivsastra-product-pipeline");
    assert(
      storagePathAttempt.error?.code === "42501" ||
      storagePathAttempt.error?.message?.includes("permission denied"),
      `Anon SELECT on products.storage_asset_path rejected with 42501 (received: ${storagePathAttempt.error?.code})`
    );

    const publicList = await getPublishedStoreProducts();
    const found = publicList.find((p) => p.slug === "test-shivsastra-product-pipeline");
    assert(Boolean(found), "Available product is present in getPublishedStoreProducts()");
    assert(!("storage_asset_path" in (found || {})), "storage_asset_path is strictly omitted from product object");
    assert(!("storageAssetPath" in (found || {})), "storageAssetPath is strictly omitted from product object");

    const single = await getPublishedStoreProductBySlug("test-shivsastra-product-pipeline");
    assert(single !== null, "getPublishedStoreProductBySlug resolves available product");
    assert(single?.formattedPrice === "₹10.00", `Formatted price calculated accurately as ₹10.00 (got: "${single?.formattedPrice}")`);

    const meta = await generateProductMeta({
      params: Promise.resolve({ slug: "test-shivsastra-product-pipeline" }),
    });
    assert(
      meta.title === "TEST — ShivSastra Product Pipeline",
      `Product SEO title matches product title (found: "${meta.title}")`
    );
  }

  if (step === "store-unavailable") {
    console.log("--- Store Unavailable Verification ---");
    const { data: anonRows } = await anonClient
      .from("products")
      .select("id")
      .eq("slug", "test-shivsastra-product-pipeline");
    assert(
      anonRows?.length === 0,
      `Unavailable product RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const single = await getPublishedStoreProductBySlug("test-shivsastra-product-pipeline");
    assert(single === null, "Unavailable product getPublishedStoreProductBySlug returns null");
  }

  if (step === "store-deleted") {
    console.log("--- Store Deletion Verification ---");
    const { data: anonRows } = await anonClient.from("public_products").select("id");
    assert(anonRows?.length === 0, `Products catalog returned to 0 rows (found ${anonRows?.length})`);
  }

  if (step === "lab-draft") {
    console.log("--- Lab Draft & Private Isolation Verification ---");
    const valid = adminLabSchema.safeParse({
      slug: "test-shivsastra-lab-pipeline",
      title: "TEST — ShivSastra Lab Pipeline",
      content_markdown: "Synthetic QA content. Not a real personal thought.",
      category: "idea",
      status: "draft",
      is_public: false,
    });
    assert(valid.success, "Lab draft schema validation passed");

    const { data: anonRows } = await anonClient
      .from("lab_entries")
      .select("id")
      .eq("slug", "test-shivsastra-lab-pipeline");
    assert(
      anonRows?.length === 0,
      `Draft private lab entry RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const single = await getPublishedLabEntryBySlug("test-shivsastra-lab-pipeline");
    assert(single === null, "Draft lab entry getPublishedLabEntryBySlug returns null");
  }

  if (step === "lab-status-published-alone") {
    console.log("--- Lab Status 'published' Alone (Without is_public/published_at) Verification ---");
    const { data: anonRows } = await anonClient
      .from("lab_entries")
      .select("id")
      .eq("slug", "test-shivsastra-lab-pipeline");
    assert(
      anonRows?.length === 0,
      `status='published' alone: anon SELECT returns 0 rows (RLS requires is_public AND published_at)`
    );

    const single = await getPublishedLabEntryBySlug("test-shivsastra-lab-pipeline");
    assert(single === null, "status='published' alone getPublishedLabEntryBySlug returns null");
  }

  if (step === "lab-published") {
    console.log("--- Lab Published Verification ---");
    const { data: anonRows } = await anonClient
      .from("lab_entries")
      .select("id, slug, title")
      .eq("slug", "test-shivsastra-lab-pipeline");
    assert(
      anonRows?.length === 1,
      `Published lab entry RLS: anon SELECT returns exactly 1 row (found ${anonRows?.length})`
    );

    const publicList = await getPublishedLabEntries();
    const found = publicList.find((e) => e.slug === "test-shivsastra-lab-pipeline");
    assert(Boolean(found), "Published lab entry present in getPublishedLabEntries()");

    const single = await getPublishedLabEntryBySlug("test-shivsastra-lab-pipeline");
    assert(single !== null, "getPublishedLabEntryBySlug resolves published lab entry");
    assert(single?.category === "idea", `Category is 'idea' (got: "${single?.category}")`);

    const meta = await generateLabMeta({
      params: Promise.resolve({ slug: "test-shivsastra-lab-pipeline" }),
    });
    assert(
      meta.title?.toString().includes("TEST — ShivSastra Lab Pipeline"),
      `Lab SEO metadata title includes entry title (found: "${meta.title}")`
    );
  }

  if (step === "lab-experimental-visible") {
    console.log("--- Lab Experimental + Public Visibility Verification ---");
    const single = await getPublishedLabEntryBySlug("test-shivsastra-lab-pipeline");
    assert(single !== null, "Experimental + public lab entry is visible");
    assert(single?.status === "experimental", `Status correctly reported as 'experimental' (got: "${single?.status}")`);
  }

  if (step === "lab-unpublished") {
    console.log("--- Lab Unpublished Verification ---");
    const { data: anonRows } = await anonClient
      .from("lab_entries")
      .select("id")
      .eq("slug", "test-shivsastra-lab-pipeline");
    assert(
      anonRows?.length === 0,
      `Unpublished lab entry RLS: anon SELECT returns 0 rows (found ${anonRows?.length})`
    );

    const single = await getPublishedLabEntryBySlug("test-shivsastra-lab-pipeline");
    assert(single === null, "Unpublished lab entry getPublishedLabEntryBySlug returns null");
  }

  if (step === "lab-deleted") {
    console.log("--- Lab Deletion Verification ---");
    const { data: anonRows } = await anonClient.from("lab_entries").select("id");
    assert(anonRows?.length === 0, `Lab entries table returned to 0 rows (found ${anonRows?.length})`);
  }

  if (step === "final-audit" || step === "all") {
    console.log("--- Final Database & Content Safety Audit ---");
    const { data: profileRows } = await anonClient.from("profile_settings").select("*");
    assert(profileRows?.length === 1, `profile_settings has exactly 1 singleton row (found ${profileRows?.length})`);
    assert(profileRows?.[0].full_name === "Shivam Shukla", "profile_settings full_name is 'Shivam Shukla'");
    assert(profileRows?.[0].email === "theshivamshukla.4uu@gmail.com", "profile_settings email is intact");
    assert(profileRows?.[0].phone === "8887780625", "profile_settings phone is intact");
    assert(profileRows?.[0].positioning_statement === null, "profile_settings positioning_statement is null");

    const { data: projRows } = await anonClient.from("projects").select("id");
    assert(projRows?.length === 0, `projects has 0 rows (found ${projRows?.length})`);

    const { data: servRows } = await anonClient.from("services").select("id");
    assert(servRows?.length === 0, `services has 0 rows (found ${servRows?.length})`);

    const { data: prodRows } = await anonClient.from("public_products").select("id");
    assert(prodRows?.length === 0, `products has 0 rows (found ${prodRows?.length})`);

    const { data: labRows } = await anonClient.from("lab_entries").select("id");
    assert(labRows?.length === 0, `lab_entries has 0 rows (found ${labRows?.length})`);

    // Scan public data outputs for synthetic markers
    const allProjects = await getPublishedProjects();
    const allServices = await getPublishedServices();
    const allProducts = await getPublishedStoreProducts();
    const allLab = await getPublishedLabEntries();
    const profileData = await getProfileSettings();

    const dump = JSON.stringify({ allProjects, allServices, allProducts, allLab, profileData });
    assert(!dump.includes("TEST —"), "Zero occurrences of 'TEST —' in public data layer");
    assert(!dump.includes("Synthetic QA"), "Zero occurrences of 'Synthetic QA' in public data layer");
    assert(!dump.includes("test-shivsastra"), "Zero occurrences of 'test-shivsastra' in public data layer");
  }

  console.log(`\nStep Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Verification execution failed:", err);
  process.exit(1);
});
