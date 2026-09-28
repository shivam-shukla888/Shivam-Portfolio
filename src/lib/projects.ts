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
    "Privacy-Aware Government Scheme Discovery & Eligibility Platform. Multilingual natural language intake coupled with a deterministic, testable rules engine over 82 normalized welfare schemes.",
  caseStudyMarkdown: null,
  coverImageUrl: "/images/projects/yojna-setu/cover.svg",
  category: "Backend Systems · AI Security",
  techStack: [
    "Java 21",
    "Spring Boot",
    "PostgreSQL",
    "Supabase",
    "Groq",
    "Twilio Boundary",
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
    "WhatsApp real estate assistant for buyer lead qualification, RERA registry verification, fraud-detection checks, dynamic EMI loan profiling, and site-visit scheduling.",
  caseStudyMarkdown: `### Overview
RealGuard is a WhatsApp assistant that helps real estate brokers qualify buyer leads, verify RERA registration data, schedule site visits, and answer property inquiries through conversational messaging.

### Architecture & Conversational Flow
1. **WhatsApp Webhook Intake**: Prospective buyers initiate inquiries via WhatsApp messages received through Twilio API webhooks.
2. **Spring Boot Backend**: Validates incoming webhook signatures, manages user conversation sessions, and routes requests to appropriate service handlers.
3. **Groq LLM Extraction**: Extracts user budget, preferred locations, property types, and timeline from conversational text into structured parameters.
4. **RERA Verification & Fraud Detection**: Executes lookup queries against project and agent registry records to flag unverified or suspicious listings.
5. **Dynamic EMI Calculation**: Computes mortgage estimates, interest amortization, and monthly EMI figures directly within the conversation loop using application math.
6. **Data & Notification Layer**: Persists client records and interaction history in MySQL via Hibernate ORM and sends instant notification summaries to brokers.

### Key Engineering Highlights
- **Conversational Buyer Qualification**: Converts unstructured user messages into structured buyer profiles with score ratings.
- **RERA Compliance Checks**: Queries registered project IDs to help verify developer claims and protect prospective buyers.
- **In-Chat Mortgage Estimation**: Calculates principal, interest rate, tenure, and monthly EMI breakdown directly inside chat.
- **Broker Notifications & Scheduling**: Automates site-visit booking and dispatches alert messages to assigned sales agents.

### Implementation & Deployment
Built with Java 17 and Spring Boot following clean MVC architecture. Data persistence is managed with MySQL and Hibernate ORM. Conversational extraction is powered by the Groq API using structured prompt templates.`,
  coverImageUrl: "/images/projects/realguard/realguard.png",
  category: "Backend Systems · AI Automation",
  techStack: [
    "Java",
    "Spring Boot",
    "Groq LLM",
    "Twilio WhatsApp API",
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
    "Full-stack food ordering platform featuring Spring Boot 3 REST APIs, Spring Security JWT rotation, server-side price tampering protection, WebSocket order tracking, and Groq Llama 3 assistance.",
  caseStudyMarkdown: `### Overview
QuickEats is a full-stack food ordering and delivery system engineered with Spring Boot 3, React 18, and Groq Llama 3. The platform addresses core food delivery challenges: server-side price validation to prevent client-side price manipulation, WebSocket rider tracking, and AI-assisted menu recommendations.

### Architecture & Flow
1. **Frontend Client**: Built with React 18, Vite, and Tailwind CSS. Features an intuitive food ordering flow, cart management, and silent background JWT token refreshes.
2. **Backend REST APIs**: Powered by Spring Boot 3.2.3 and Java 17, providing modular controllers for authentication, menu catalogs, orders, and customer support.
3. **Database & ORM**: PostgreSQL, MySQL 8, and H2 support with Hibernate ORM for relational mapping and entity relationships.
4. **Security & Authentication**: Spring Security 6 with JJWT. Implements short-lived access tokens, database-backed refresh token rotation, IDOR protections, and role-based access control.
5. **Real-Time WebSockets**: Spring WebSocket with STOMP and SockJS broadcasts order status progression (PENDING ➔ PREPARING ➔ OUT_FOR_DELIVERY ➔ DELIVERED).
6. **AI Recommendations & Support**: Groq API (Llama 3) provides dynamic menu suggestions and a contextually grounded order support chatbot.

### Key Engineering Highlights
- **Server-Side Price Tampering Prevention**: The order service ignores client-supplied item prices, performing authoritative database price lookups to calculate total amounts.
- **Privilege Escalation & IDOR Defense**: Strict ownership checks enforce that customers can only view, modify, or cancel their own orders and profile data.
- **Real-Time Order Tracking**: Bi-directional WebSocket channels broadcast status updates and simulated courier coordinates.
- **Groq Llama 3 AI Chatbot & Upsells**: Context-aware customer assistance and menu recommendations based on user order history.
- **Automated Test Coverage**: 71 executable @Test methods across 23 backend test classes covering order security, IDOR validation, server-side price recalculation, and database fallbacks.

### Implementation & Deployment
Engineered as a multi-tier Java application with automated test suites, Docker configuration, and CI pipeline automation.`,
  coverImageUrl: "/images/projects/quickeats/preview.svg",
  category: "Full-Stack · Backend & AI",
  techStack: [
    "Java 17",
    "Spring Boot 3",
    "Spring Security",
    "PostgreSQL",
    "MySQL",
    "Hibernate ORM",
    "WebSockets",
    "Groq API",
    "React 18",
  ],
  projectYear: 2025,
  liveUrl: null,
  githubUrl: "https://github.com/shivam-shukla888/QuickEats-Ordering-System",
  isFeatured: true,
  sortOrder: 3,
  publishedAt: "2025-10-20T12:00:00Z",
};

export const CANONICAL_PROJECTS: Project[] = [
  YOJNA_SETU_PROJECT,
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
