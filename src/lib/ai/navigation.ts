/**
 * ShivSastra AI — Route Registry & Safe Navigation Allowlist
 * 
 * Centralized, server-controlled navigation map for the public ShivSastra website.
 * Enforces strict route-allowlisting, dynamic slug validation, URL normalization,
 * and rejects all admin (/admin*), API (/api*), protocol-relative (//*), and malformed paths.
 */

import { getPublishedProjects } from "@/lib/projects";
import { getPublishedServices } from "@/lib/services";
import { getPublishedStoreProducts } from "@/lib/products";
import { getPublishedLabEntries } from "@/lib/lab";

/**
 * 1. Verified Static Public Routes
 * The definitive allowlist of top-level and category public pages in the App Router.
 */
export const STATIC_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/services",
  "/store",
  "/store/design",
  "/store/ai-agents",
  "/store/digital-products",
  "/contact",
  "/lab",
  "/privacy",
] as const;

export type StaticPublicRoute = (typeof STATIC_PUBLIC_ROUTES)[number];

export interface NavigationDestination {
  label: string;
  href: StaticPublicRoute;
  description: string;
}

/**
 * Controlled Public Navigation Map
 */
export const PUBLIC_NAVIGATION: Record<string, NavigationDestination> = {
  home: {
    label: "Home",
    href: "/",
    description: "Overview, ethos, and focus areas (Backend Systems, Agentic AI, AI Security)",
  },
  about: {
    label: "About",
    href: "/about",
    description: "Background, design philosophy, and verified public profiles",
  },
  projects: {
    label: "Projects",
    href: "/projects",
    description: "Published client case studies, engineering builds, and open-source software",
  },
  services: {
    label: "Services",
    href: "/services",
    description: "High-impact consulting, systems architecture, and agentic AI advisory",
  },
  store: {
    label: "Store",
    href: "/store",
    description: "Curated digital releases, templates, monographs, and developer licenses",
  },
  storeDesign: {
    label: "Design Store",
    href: "/store/design",
    description: "Design systems and typography collections",
  },
  storeAiAgents: {
    label: "AI Agents Store",
    href: "/store/ai-agents",
    description: "Autonomous agents and operational workflows",
  },
  storeDigitalProducts: {
    label: "Digital Products Store",
    href: "/store/digital-products",
    description: "Developer toolkits and boilerplates",
  },
  contact: {
    label: "Contact",
    href: "/contact",
    description: "Inquiries, collaboration briefs, and advisory scheduling",
  },
  lab: {
    label: "Lab",
    href: "/lab",
    description: "Personal sandbox entries, research notes, and architectural experiments",
  },
  privacy: {
    label: "Privacy",
    href: "/privacy",
    description: "Public privacy policy and infrastructure memorandum",
  },
};

/**
 * 2. URL Cleaning & Normalization
 * Removes zero-width characters, trailing punctuation, trailing slashes,
 * and whitespace that can cause Next.js router 404s.
 */
export function normalizeHref(rawHref: string): string {
  if (!rawHref || typeof rawHref !== "string") return "";

  // Remove zero-width characters and control characters
  let href = rawHref.replace(/[\u200B-\u200D\uFEFF\x00-\x1F\x7F]/g, "").trim();

  // Decode URI if safe, handling malformed sequences gracefully
  try {
    if (!/%2f%2f/i.test(href) && !/%5c/i.test(href)) {
      href = decodeURI(href);
    }
  } catch {
    // Keep raw string if malformed URI sequence
  }

  // Remove surrounding quotes, backticks, brackets, parentheses, angle brackets
  href = href.replace(/^["'`(<[]+|["'`)(>\]]+$/g, "").trim();

  // Remove trailing punctuation (. , : ; ! ? ← ↗)
  href = href.replace(/[.,:;!?←↗]+$/g, "").trim();

  // Normalize duplicate slashes at the start and trailing slashes
  if (href.startsWith("/")) {
    href = href.replace(/^\/+/, "/");
    if (href.length > 1 && href.endsWith("/")) {
      href = href.slice(0, -1);
    }
  }

  return href;
}

/**
 * 3. Safe Internal Link Policy & Allowlist Validation
 * Returns true ONLY if the normalized path is a verified public route.
 */
export function isValidPublicRoute(
  rawHref: string,
  dynamicRoutes?: Iterable<string>
): boolean {
  if (!rawHref || typeof rawHref !== "string") return false;

  // Reject backslashes or raw protocol attempts
  if (rawHref.includes("\\")) {
    return false;
  }

  const normalized = normalizeHref(rawHref);
  const lower = normalized.toLowerCase();

  // Reject protocol indicators, pseudo-schemes, and protocol-relative URLs
  if (
    lower.startsWith("//") ||
    lower.includes("javascript:") ||
    lower.includes("data:") ||
    lower.includes("vbscript:") ||
    lower.includes("file:") ||
    lower.includes("mailto:") ||
    lower.includes("http:") ||
    lower.includes("https:")
  ) {
    return false;
  }

  // Reject URL-encoded bypasses
  if (
    /%2f%2f/i.test(lower) ||
    /%5c/i.test(lower) ||
    /%2e%2e/i.test(lower) ||
    /%00/i.test(lower)
  ) {
    return false;
  }

  // Must be a clean relative path starting with /
  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return false;
  }

  // Reject directory traversal segments
  const segments = normalized.split("/");
  if (segments.some((s) => s === ".." || s === ".")) {
    return false;
  }

  // Strictly reject private admin and internal API routes
  if (
    normalized === "/admin" ||
    normalized.startsWith("/admin/") ||
    normalized === "/api" ||
    normalized.startsWith("/api/") ||
    normalized.includes("/admin") ||
    normalized.includes("/api")
  ) {
    return false;
  }

  // Allowlist match: Static public routes
  if ((STATIC_PUBLIC_ROUTES as readonly string[]).includes(normalized)) {
    return true;
  }

  // Allowlist match: Verified dynamic public routes
  if (dynamicRoutes) {
    for (const route of dynamicRoutes) {
      if (normalizeHref(route) === normalized) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 4. Dynamic Route Retrieval
 * Fetches only published and active project, service, store product, and lab entry slugs.
 */
export async function getPublishedDynamicRoutes(): Promise<string[]> {
  try {
    const [projects, services, products, labEntries] = await Promise.all([
      getPublishedProjects(),
      getPublishedServices(),
      getPublishedStoreProducts(),
      getPublishedLabEntries(),
    ]);

    const routes: string[] = [];

    projects.forEach((p) => {
      if (p.slug && typeof p.slug === "string" && p.slug.trim().length > 0) {
        routes.push(`/projects/${p.slug.trim()}`);
      }
    });

    services.forEach((s) => {
      if (s.isActive && s.slug && typeof s.slug === "string" && s.slug.trim().length > 0) {
        routes.push(`/services/${s.slug.trim()}`);
      }
    });

    products.forEach((st) => {
      if (st.slug && typeof st.slug === "string" && st.slug.trim().length > 0) {
        routes.push(`/store/${st.slug.trim()}`);
      }
    });

    labEntries.forEach((l) => {
      if (l.slug && typeof l.slug === "string" && l.slug.trim().length > 0) {
        routes.push(`/lab/${l.slug.trim()}`);
      }
    });

    return routes;
  } catch (err) {
    console.error("[AI NAVIGATION] Error loading dynamic routes:", err);
    return [];
  }
}
