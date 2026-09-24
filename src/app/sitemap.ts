import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedServices } from "@/lib/services";
import { getPublishedStoreProducts } from "@/lib/products";
import { getPublishedLabEntries } from "@/lib/lab";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shivsastra.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/store/design`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store/ai-agents`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store/digital-products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date(),
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
        lastModified: new Date(p.publishedAt || Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: new Date(s.updatedAt || s.createdAt || Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...products
        .filter((pr) => pr.isAvailable)
        .map((pr) => ({
          url: `${baseUrl}/store/${pr.slug}`,
          lastModified: new Date(pr.updatedAt || pr.createdAt || Date.now()),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
      ...lab.map((l) => ({
        url: `${baseUrl}/lab/${l.slug}`,
        lastModified: new Date(l.updatedAt || l.createdAt || Date.now()),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
