import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  edition_code: string | null;
  summary: string | null;
  case_study_markdown: string | null;
  cover_image_url: string | null;
  category: string | null;
  tech_stack: string[] | null;
  project_year: number | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  editionCode: string | null;
  summary: string | null;
  caseStudyMarkdown: string | null;
  coverImageUrl: string | null;
  category: string | null;
  techStack: string[];
  projectYear: number | null;
  liveUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  publishedAt: string;
}

/**
 * Maps raw database project row to camelCase public Project representation.
 */
function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    editionCode: row.edition_code,
    summary: row.summary,
    caseStudyMarkdown: row.case_study_markdown,
    coverImageUrl: row.cover_image_url,
    category: row.category,
    techStack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    projectYear: row.project_year,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    publishedAt: row.published_at || "",
  };
}

/**
 * Returns a server-side Supabase client for reading published projects.
 * Adheres strictly to the server-only boundary without leaking credentials.
 */
function getProjectsQueryClient(): SupabaseClient | null {
  const serverClient = getSupabaseServerClient();
  if (serverClient) {
    return serverClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && anonKey) {
    return createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return null;
}

export const YOJNA_SETU_PROJECT: Project = {
  id: "yojna-setu-v2",
  slug: "yojna-setu",
  title: "Yojna Setu",
  editionCode: "YS-V2",
  summary:
    "AI + deterministic systems architecture. Natural-language intake → structured criteria → deterministic Java rules → PostgreSQL. AI handles language; application logic handles decisions. Tested over 82 welfare schemes with 42/42 verified tests.",
  caseStudyMarkdown: null,
  coverImageUrl: "/images/projects/yojna-setu/cover.svg",
  category: "AI + Deterministic Systems",
  techStack: [
    "Groq API",
    "Rules Engine",
    "Java 21",
    "Spring Boot",
    "PostgreSQL",
    "AWS EC2",
  ],
  projectYear: 2026,
  liveUrl: null,
  githubUrl: "https://github.com/shivam-shukla888/Yojna-Setu",
  isFeatured: true,
  sortOrder: 1,
  publishedAt: "2026-09-25T12:00:00Z",
};

export const REALGUARD_PROJECT: Project = {
  id: "realguard",
  slug: "realguard",
  title: "RealGuard",
  editionCode: "RG-AI",
  summary:
    "AI automation and conversational workflows for real estate. WhatsApp conversational input → Groq parameter extraction → Java business logic → RERA lookup → in-app EMI calculation → CRM persistence → broker workflow. The LLM extracts parameters while application logic handles authoritative calculations.",
  caseStudyMarkdown: `### Overview
RealGuard is an AI automation and conversational workflow assistant that connects WhatsApp messaging to verified business logic for real estate brokers.

### Architecture & Conversational Flow
The system enforces strict separation between conversational interpretation and authoritative domain calculations:

1. **WhatsApp Webhook Intake**: Prospective buyers message through WhatsApp via Twilio webhooks.
2. **Conversational Parameter Extraction**: Groq API (Llama 3) parses unstructured chat to extract budget, preferred locality, BHK requirements, and timeframe into structured JSON parameters.
3. **Java Business Logic Routing**: Spring Boot services validate incoming parameters against application boundaries and route to specific sub-modules.
4. **RERA Registry Lookup**: Queries registered project records to cross-reference developer legitimacy against official regulatory records.
5. **Deterministic EMI Calculation**: Computes loan interest, tenure amortization, and monthly EMI figures strictly within deterministic application code — the LLM never performs financial calculations.
6. **CRM Persistence & Broker Notification**: Stores buyer records and interaction history in MySQL via Hibernate ORM and dispatches structured lead summaries to real estate brokers.

### Key Engineering Lessons
- **AI for Extraction, Code for Math**: Language models interpret conversational nuance, but authoritative financial calculations and compliance rules belong strictly in verified application code.
- **Webhook Integrity**: Spring Boot verifies Twilio webhook signatures before processing messages to prevent forged broker dispatch events.
- **Structured Lead Qualification**: Normalizes free-form text conversations into standardized relational CRM records without requiring rigid UI forms.

### Implementation Stack
Engineered with Java 17, Spring Boot, MySQL, Hibernate ORM, Twilio WhatsApp API, and Groq API.`,
  coverImageUrl: "/images/projects/realguard/realguard.png",
  category: "AI Automation · Conversational Workflows",
  techStack: [
    "AI Automation",
    "Twilio WhatsApp API",
    "Groq LLM",
    "Spring Boot",
    "MySQL",
    "Hibernate ORM",
  ],
  projectYear: 2025,
  liveUrl: null,
  githubUrl: "https://github.com/shivam-shukla888/RealGuard",
  isFeatured: true,
  sortOrder: 2,
  publishedAt: "2025-11-15T12:00:00Z",
};

export const QUICKEATS_PROJECT: Project = {
  id: "quickeats",
  slug: "quickeats",
  title: "QuickEats",
  editionCode: "QE-AI",
  summary:
    "AI-assisted product engineering and application security system. Highlights include server-side price recalculation, ownership validation, JWT refresh-token rotation, real-time STOMP order updates, and conversational AI assistance. Verified with 71 executable @Test methods across 23 backend test classes.",
  caseStudyMarkdown: `### Overview
QuickEats is an ordering and delivery system engineered to solve critical application security and real-time state synchronization challenges in food delivery.

### Key Engineering Lessons & Security Mechanisms
- **Server-Side Price Recalculation**: The order service strictly ignores client-supplied item prices. Total amounts are calculated exclusively on the server by looking up authoritative database prices, preventing cart tampering attacks.
- **Ownership & IDOR Validation**: Strict entity-level ownership validation guarantees that customers can only view, modify, or track orders tied to their authenticated account.
- **JWT Authentication & Refresh Token Rotation**: Implements stateless short-lived JWT access tokens paired with database-backed refresh token rotation and revocation.
- **Real-Time Order Updates**: Bi-directional STOMP WebSockets over SockJS broadcast order lifecycle progression (PENDING ➔ PREPARING ➔ OUT_FOR_DELIVERY ➔ DELIVERED) and live simulated delivery coordinates.
- **Conversational AI Assistance**: Groq API (Llama 3) powers conversational food recommendations and customer support grounded in verified order context.
- **Verified Automated Test Suite**: Backed by 71 executable @Test methods across 23 backend test classes covering security controls, price recalculation logic, IDOR protections, and database transactions.

### Architecture
- **Backend**: Spring Boot 3.2.3, Java 17, Spring Security 6, JJWT
- **Persistence**: PostgreSQL, MySQL 8, and Hibernate ORM
- **Real-Time**: Spring WebSocket with STOMP and SockJS
- **AI Integration**: Groq API (Llama 3) for contextual menu assistance`,
  coverImageUrl: "/images/projects/quickeats/preview.svg",
  category: "Product Engineering · Application Security",
  techStack: [
    "Product Engineering",
    "Application Security",
    "Spring Boot 3",
    "WebSockets",
    "Groq Llama 3",
    "PostgreSQL",
  ],
  projectYear: 2025,
  liveUrl: null,
  githubUrl: "https://github.com/shivam-shukla888/QuickEats-Ordering-System",
  isFeatured: true,
  sortOrder: 4,
  publishedAt: "2025-10-20T12:00:00Z",
};

export const SHIVSASTRA_PROJECT: Project = {
  id: "shivsastra",
  slug: "shivsastra",
  title: "ShivSastra — Digital HQ",
  editionCode: "SHIV-HQ",
  summary:
    "Full-stack digital platform and engineering HQ featuring portfolio, dynamic project CMS, authenticated admin system, digital store with Razorpay checkout, contact workflow, and contextual AI assistant. Engineered with PostgreSQL RLS, secure authentication, API validation, rate limiting, and server-side payment verification architecture.",
  caseStudyMarkdown: `### Overview
ShivSastra is a full-stack digital platform and personal engineering HQ featuring portfolio showcases, a dynamic project CMS, an authenticated admin management system, an integrated digital store with Razorpay checkout, an automated contact workflow, and a contextual AI assistant.

### Architecture & Security Highlights
- **Full-Stack Next.js Architecture**: Server-side rendering (SSR), static optimization, and modular component hierarchy with responsive, high-performance typography.
- **Authenticated Admin CMS**: Secure credentials-based authentication with session management, role verification, and full CRUD control for projects, services, store items, and lab explorations.
- **PostgreSQL & Row-Level Security (RLS)**: Fine-grained security policies on Supabase PostgreSQL protecting customer orders, inquiries, and private storage assets.
- **Server-Side Payment Verification**: Integrated Razorpay checkout with HMAC-SHA256 signature verification, server-side price recalculation, and idempotent webhook handling to eliminate payment spoofing.
- **Contextual AI Assistant**: Groq API integration bounded by strict system instructions, prompt injection defenses, deterministic input sanitization, and read-only public knowledge context.
- **Production Defenses**: Distributed IP rate limiting, strict Zod schema validation on all API endpoints, and zero-trust parameter boundaries.

### Implementation Stack
- **Framework**: Next.js (App Router), TypeScript, React, Tailwind CSS
- **Database & Auth**: Supabase, PostgreSQL, Row-Level Security (RLS)
- **Payment & Orders**: Razorpay API, HMAC webhook verification
- **AI Integration**: Groq API (Llama 3), custom safety & validation layers`,
  coverImageUrl: "/images/hero-visual.webp",
  category: "Full-Stack · Systems Architecture",
  techStack: [
    "Next.js",
    "TypeScript",
    "Supabase",
    "PostgreSQL",
    "Razorpay",
    "Groq API",
  ],
  projectYear: 2026,
  liveUrl: "https://jiosi.online",
  githubUrl: "https://github.com/shivam-shukla888/Shivam-Portfolio",
  isFeatured: true,
  sortOrder: 2,
  publishedAt: "2026-02-15T12:00:00Z",
};

export const CANONICAL_PROJECTS: Project[] = [
  YOJNA_SETU_PROJECT,
  SHIVSASTRA_PROJECT,
  REALGUARD_PROJECT,
  QUICKEATS_PROJECT,
];

const PUBLIC_PROJECT_COLUMNS =
  "id, slug, title, edition_code, summary, case_study_markdown, cover_image_url, category, tech_stack, project_year, live_url, github_url, is_featured, sort_order, published_at";

/**
 * Fetches all published projects ordered deterministically by sort_order ASC, then created_at DESC.
 * Integrates canonical featured projects (Yojna Setu, RealGuard, QuickEats) with database storage.
 */
export async function getPublishedProjects(options?: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Project[]> {
  let projects: Project[] = [];

  try {
    const client = getProjectsQueryClient();
    if (client) {
      let query = client
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .not("published_at", "is", null)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (options?.featuredOnly) {
        query = query.eq("is_featured", true);
      }

      const { data, error } = await query;
      if (!error && data && Array.isArray(data)) {
        projects = (data as unknown as ProjectRow[]).map(mapProject);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROJECTS EXCEPTION] ${message}`);
  }

  // Ensure canonical projects (Yojna Setu, RealGuard, QuickEats) are present
  for (const canonical of CANONICAL_PROJECTS) {
    const exists = projects.some((p) => p.slug === canonical.slug);
    if (!exists) {
      if (!options?.featuredOnly || canonical.isFeatured) {
        projects.push(canonical);
      }
    }
  }

  // Deterministic sort by sortOrder ASC
  projects.sort((a, b) => a.sortOrder - b.sortOrder);

  if (options?.limit && options.limit > 0) {
    projects = projects.slice(0, options.limit);
  }

  return projects;
}

/**
 * Resolves a single published project by its slug.
 * Excludes unpublished projects strictly (returns null).
 * Guarantees resolution for canonical projects (yojna-setu, realguard, quickeats).
 */
export async function getPublishedProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!slug || typeof slug !== "string") {
    return null;
  }

  const normalizedSlug = slug.trim().toLowerCase();

  try {
    const client = getProjectsQueryClient();
    if (client) {
      const { data, error } = await client
        .from("projects")
        .select(PUBLIC_PROJECT_COLUMNS)
        .eq("slug", normalizedSlug)
        .not("published_at", "is", null)
        .maybeSingle();

      if (!error && data) {
        return mapProject(data as unknown as ProjectRow);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[PROJECTS EXCEPTION] ${message}`);
  }

  // Canonical fallback matching
  const canonical = CANONICAL_PROJECTS.find(
    (p) => p.slug === normalizedSlug
  );
  if (canonical) {
    return canonical;
  }

  return null;
}
