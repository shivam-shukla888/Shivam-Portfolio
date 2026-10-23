import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedServices } from "@/lib/services";
import { getPublishedStoreProducts } from "@/lib/products";
import { getPublishedLabEntries } from "@/lib/lab";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // 1 hour revalidation

// Authoritative baseline update dates reflecting meaningful content revisions (prevents fake new dates on every build)
const SITE_CONTENT_BASELINE = new Date("2026-03-01T00:00:00Z");
const LEGAL_CONTENT_BASELINE = new Date("2026-02-15T00:00:00Z");
const RESUME_CONTENT_BASELINE = new Date("2026-02-20T00:00:00Z");

function safeDate(val: string | null | undefined): Date | undefined {
  if (!val) return undefined;
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: RESUME_CONTENT_BASELINE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: SITE_CONTENT_BASELINE,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: LEGAL_CONTENT_BASELINE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: LEGAL_CONTENT_BASELINE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: LEGAL_CONTENT_BASELINE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const [projects, services, products, lab] = await Promise.all([
      getPublishedProjects().catch(() => []),
      getPublishedServices().catch(() => []),
      getPublishedStoreProducts().catch(() => []),
      getPublishedLabEntries().catch(() => []),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...projects.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: safeDate(p.publishedAt) || SITE_CONTENT_BASELINE,
        changeFrequency: "monthly" as const,
        priority: p.slug === "yojna-setu" ? 0.9 : 0.8,
      })),
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: safeDate(s.updatedAt || s.createdAt) || SITE_CONTENT_BASELINE,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...products
        .filter((pr) => pr.isAvailable)
        .map((pr) => ({
          url: `${baseUrl}/store/${pr.slug}`,
          lastModified: safeDate(pr.updatedAt || pr.createdAt) || SITE_CONTENT_BASELINE,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
      ...lab.map((l) => ({
        url: `${baseUrl}/lab/${l.slug}`,
        lastModified: safeDate(l.updatedAt || l.createdAt) || SITE_CONTENT_BASELINE,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    // Ensure yojna-setu is present even if dynamic fetch had an unexpected edge case
    if (!dynamicRoutes.some((r) => r.url === `${baseUrl}/projects/yojna-setu`)) {
      dynamicRoutes.unshift({
        url: `${baseUrl}/projects/yojna-setu`,
        lastModified: SITE_CONTENT_BASELINE,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      });
    }

    const latestProductTimestamp = products
      .filter((pr) => pr.isAvailable)
      .map((pr) => safeDate(pr.updatedAt || pr.createdAt))
      .filter((d): d is Date => Boolean(d))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const calibratedStaticRoutes: MetadataRoute.Sitemap = staticRoutes.map((r) => {
      if (r.url === `${baseUrl}/store` && latestProductTimestamp) {
        return {
          ...r,
          lastModified: latestProductTimestamp,
        };
      }
      return r;
    });

    return [...calibratedStaticRoutes, ...dynamicRoutes];
  } catch {
    return [
      ...staticRoutes,
      {
        url: `${baseUrl}/projects/yojna-setu`,
        lastModified: SITE_CONTENT_BASELINE,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
    ];
  }
}
