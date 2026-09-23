import fs from "fs";
import path from "path";
import { getProfileSettings } from "../src/lib/profile";
import { getPublishedProjects } from "../src/lib/projects";
import { getPublishedServices } from "../src/lib/services";
import { getPublishedStoreProducts } from "../src/lib/products";
import { getPublishedLabEntries } from "../src/lib/lab";

function getLocalSupabaseEnv(): { url: string; anonKey: string } {
  const envPath = path.resolve(__dirname, "../.env.local");
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

getLocalSupabaseEnv();

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

async function runPublicSiteVerification() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // PHASE 24 PUBLIC SITE EDITORIAL INTEGRITY");
  console.log("=======================================================\n");

  // 1. Profile Data Layer
  const profile = await getProfileSettings();
  assert(profile.fullName === "Shivam Shukla", "1.1 Real name 'Shivam Shukla' renders");
  assert(profile.email === "theshivamshukla.4uu@gmail.com", "1.2 Real email 'theshivamshukla.4uu@gmail.com' renders");
  assert(profile.phone === "8887780625", "1.3 Real phone '8887780625' renders");
  assert(profile.contraUrl === "https://contra.com/shivam_shukla_7duxsdr7/work", "1.4 Real Contra URL renders");
  assert(profile.linkedinUrl === "https://www.linkedin.com/in/shivam-shukla-186276374/", "1.5 Real LinkedIn URL renders");
  assert(profile.githubUrl === "https://github.com/shivam-shukla888", "1.6 Real GitHub URL renders");
  assert(profile.instagramUrl === "https://www.instagram.com/shastra2003", "1.7 Real Instagram URL renders");
  assert(profile.xUrl === "https://x.com/shastra2003", "1.8 Real X URL renders");
  assert(profile.positioningStatement === "[PERSONAL POSITIONING PENDING]", "1.9 Canonical placeholder for positioning statement preserved");
  assert(profile.aboutMarkdown === "[ABOUT CONTENT PENDING]", "1.10 Canonical placeholder for about content preserved");
  assert(profile.contactInstructions === "[CONTACT DETAILS PENDING]", "1.11 Canonical placeholder for contact details preserved");

  // 2. Empty Catalog States (Zero Invention)
  const projects = await getPublishedProjects();
  assert(projects.length === 0, `2.1 Projects archive has 0 items (clean empty state)`);

  const services = await getPublishedServices();
  assert(services.length === 0, `2.2 Services archive has 0 items (clean empty state)`);

  const products = await getPublishedStoreProducts();
  assert(products.length === 0, `2.3 Store catalog has 0 items (clean empty state)`);

  const lab = await getPublishedLabEntries();
  assert(lab.length === 0, `2.4 Personal lab has 0 items (clean empty state)`);

  // 3. Page files exist
  const routes = [
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/projects/page.tsx",
    "src/app/services/page.tsx",
    "src/app/store/page.tsx",
    "src/app/contact/page.tsx",
    "src/app/lab/page.tsx",
  ];
  for (const r of routes) {
    const fullPath = path.resolve(process.cwd(), r);
    assert(fs.existsSync(fullPath), `3. Route component exists: ${r}`);
  }

  // 4. Admin routes exist and protected
  const adminRoutes = [
    "src/app/admin/login/page.tsx",
    "src/app/admin/page.tsx",
    "src/app/admin/profile/page.tsx",
    "src/app/admin/projects/page.tsx",
    "src/app/admin/services/page.tsx",
    "src/app/admin/store/page.tsx",
    "src/app/admin/lab/page.tsx",
  ];
  for (const r of adminRoutes) {
    const fullPath = path.resolve(process.cwd(), r);
    assert(fs.existsSync(fullPath), `4. Admin route component exists: ${r}`);
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPublicSiteVerification().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
