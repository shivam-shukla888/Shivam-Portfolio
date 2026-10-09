import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedServices } from "@/lib/services";
import { getPublishedStoreProducts } from "@/lib/products";
import { getPublishedLabEntries } from "@/lib/lab";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // 1 hour revalidation

// Fixed baseline deployment date for static portfolio routes (no fabrication)
const BASELINE_STATIC_DATE = new Date("2026-09-26T00:00:00.000Z");

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
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store/design`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store/ai-agents`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store/digital-products`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: BASELINE_STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: BASELINE_STATIC_DATE,
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
        lastModified: safeDate(p.publishedAt) || BASELINE_STATIC_DATE,
        changeFrequency: "monthly" as const,
        priority: p.slug === "yojna-setu" ? 0.9 : 0.8,
      })),
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: safeDate(s.updatedAt || s.createdAt) || BASELINE_STATIC_DATE,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...products
        .filter((pr) => pr.isAvailable)
        .map((pr) => ({
          url: `${baseUrl}/store/${pr.slug}`,
          lastModified: safeDate(pr.updatedAt || pr.createdAt) || BASELINE_STATIC_DATE,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
      ...lab.map((l) => ({
        url: `${baseUrl}/lab/${l.slug}`,
        lastModified: safeDate(l.updatedAt || l.createdAt) || BASELINE_STATIC_DATE,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    // Ensure yojna-setu is present even if dynamic fetch had an unexpected edge case
    if (!dynamicRoutes.some((r) => r.url === `${baseUrl}/projects/yojna-setu`)) {
      dynamicRoutes.unshift({
        url: `${baseUrl}/projects/yojna-setu`,
        lastModified: BASELINE_STATIC_DATE,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      });
    }

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return [
      ...staticRoutes,
      {
        url: `${baseUrl}/projects/yojna-setu`,
        lastModified: BASELINE_STATIC_DATE,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
    ];
  }
}
