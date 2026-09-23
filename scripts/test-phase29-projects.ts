import fs from "fs";
import path from "path";
import { getPublishedProjects, getPublishedProjectBySlug } from "../src/lib/projects";
import { createClient } from "@supabase/supabase-js";

function getLocalSupabaseEnv(): { url: string; anonKey: string; serviceRoleKey?: string } {
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
  const serviceRoleKey = parsed.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  if (anonKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = anonKey;
  if (serviceRoleKey) process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;

  if (!url || !anonKey) {
    throw new Error("Supabase credentials missing in .env.local");
  }

  return { url, anonKey, serviceRoleKey };
}

const env = getLocalSupabaseEnv();

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

async function runPhase29TestSuite() {
  console.log("\n=======================================================");
  console.log("SHIVSASTRA // PHASE 29 PROJECTS ARCHITECTURE SUITE");
  console.log("=======================================================\n");

  // 1. LIVE DATABASE INVARIANTS
  console.log("--- 1. Live Database Invariants ---");
  const supabase = createClient(env.url, env.serviceRoleKey || env.anonKey);
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  assert(!error, "1.1 Supabase projects query succeeds without error");
  assert(count === 0, `1.2 Live database 'projects' table count is strictly 0 (found: ${count})`);

  // 2. PUBLIC ARCHIVE & EDITORIAL EMPTY STATE
  console.log("\n--- 2. Public Projects Archive & Editorial Empty State ---");
  const publishedProjects = await getPublishedProjects();
  assert(
    Array.isArray(publishedProjects) && publishedProjects.length === 0,
    "2.1 getPublishedProjects() returns empty array (zero live projects)"
  );

  const projectsPagePath = path.resolve(__dirname, "../src/app/projects/page.tsx");
  const projectsPageContent = fs.readFileSync(projectsPagePath, "utf8");

  assert(
    !projectsPageContent.includes("[1, 2, 3].map"),
    "2.2 Legacy [1, 2, 3] fake pending cards eliminated from /projects"
  );
  assert(
    projectsPageContent.includes("ARCHIVE NOTICE") &&
    projectsPageContent.includes("Selected projects and monographs will appear here once published"),
    "2.3 High-end editorial empty state is present in /projects"
  );
  assert(
    projectsPageContent.includes("Backend Systems, Agentic AI, and AI Security"),
    "2.4 Disciplinary context explicitly present in empty state"
  );
  assert(
    projectsPageContent.includes("canonical: \"/projects\""),
    "2.5 Canonical URL tag configured for /projects"
  );
  assert(
    projectsPageContent.includes("Explore The Store →") &&
    projectsPageContent.includes("Initiate an Engagement →"),
    "2.6 Actionable non-dead-end navigation paths provided"
  );

  // 3. PROJECT DETAIL PAGE INVARIANTS
  console.log("\n--- 3. Public Project Detail Page Invariants ---");
  const nonExistent = await getPublishedProjectBySlug("non-existent-project");
  assert(nonExistent === null, "3.1 Non-existent project slug returns null from query");

  const projectDetailPath = path.resolve(__dirname, "../src/app/projects/[slug]/page.tsx");
  const projectDetailContent = fs.readFileSync(projectDetailPath, "utf8");

  assert(
    projectDetailContent.includes("notFound()") &&
    projectDetailContent.includes("if (!project)"),
    "3.2 Inactive or missing project strictly triggers notFound() (404)"
  );
  assert(
    projectDetailContent.includes("alternates: {\n      canonical: `/projects/${project.slug}`"),
    "3.3 Dynamic canonical URL tag configured on /projects/[slug]"
  );
  assert(
    projectDetailContent.includes("Case Study & Architecture"),
    "3.4 Technical case study section header properly styled"
  );

  // 4. SCHEMA & FIELD COMPLETENESS (All 14 Required Fields)
  console.log("\n--- 4. Schema & Field Completeness (14/14 Fields) ---");
  const schemaPath = path.resolve(__dirname, "../src/lib/validations/admin-project.ts");
  const schemaContent = fs.readFileSync(schemaPath, "utf8");

  const requiredFields = [
    "title",
    "slug",
    "edition_code",
    "summary",
    "case_study_markdown",
    "cover_image_url",
    "category",
    "tech_stack",
    "project_year",
    "live_url",
    "github_url",
    "is_featured",
    "sort_order",
    "published_at",
  ];

  for (const field of requiredFields) {
    assert(
      schemaContent.includes(`${field}:`),
      `4. Field '${field}' supported in adminProjectBaseSchema`
    );
  }

  // 5. ADMIN FORM CASE STUDY GUIDANCE
  console.log("\n--- 5. Admin Form Guidance & Integrity ---");
  const formPath = path.resolve(__dirname, "../src/components/admin/ProjectForm.tsx");
  const formContent = fs.readFileSync(formPath, "utf8");

  assert(
    formContent.includes("Problem → Approach → Architecture → Engineering Decisions → Security Considerations → Verified Outcomes"),
    "5.1 Admin form provides technical case study structure guidance"
  );
  assert(
    formContent.includes("never invent performance metrics or enterprise certifications"),
    "5.2 Admin form contains anti-hallucination warning for case study"
  );
  assert(
    formContent.includes("Never expose private API keys, credentials, or internal endpoints"),
    "5.3 Admin form warns against exposing secrets in projects"
  );

  // 6. ROUTE FILES PRESENCE
  console.log("\n--- 6. Route Files Presence ---");
  const routesToCheck = [
    "src/app/projects/page.tsx",
    "src/app/projects/[slug]/page.tsx",
    "src/app/admin/projects/page.tsx",
    "src/app/admin/projects/new/page.tsx",
    "src/app/admin/projects/[id]/edit/page.tsx",
    "src/app/actions/admin-projects.ts",
    "src/lib/projects.ts",
    "src/lib/admin/projects.ts",
    "src/lib/validations/admin-project.ts",
  ];

  for (const r of routesToCheck) {
    const full = path.resolve(__dirname, "..", r);
    assert(fs.existsSync(full), `6. File exists: ${r}`);
  }

  // 7. POST-TEST DATABASE COUNT
  console.log("\n--- 7. Post-Test DB Row Count Invariant ---");
  const { count: finalCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });
  assert(finalCount === 0, `7.1 Live database 'projects' table count remains 0 after all checks (count: ${finalCount})`);

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runPhase29TestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
