import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import {
  getPublishedStoreProducts,
  getStoreCategoryCounts,
} from "@/lib/products";
import { StoreCatalogView } from "@/components/store/StoreCatalogView";

export const revalidate = 60;

export const metadata = {
  title: "AI Agents — Store",
  description:
    "Agent starter code, tool pipelines, and evaluation workflows by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/store/ai-agents",
  },
  openGraph: {
    title: "AI Agents — Store",
    description:
      "Agent starter code, tool pipelines, and evaluation workflows by Shivam Shukla.",
    url: "https://shivsastra.vercel.app/store/ai-agents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents — Store",
    description:
      "Agent starter code, tool pipelines, and evaluation workflows by Shivam Shukla.",
  },
};

export default async function AIAgentsStorePage() {
  const [products, categoryCounts] = await Promise.all([
    getPublishedStoreProducts({ category: "ai_agents" }),
    getStoreCategoryCounts(),
  ]);

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/store-ai-agents.webp"
        opacity={0.24}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-12">
          {/* Header Metadata Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link href="/store" className="hover:text-[var(--color-ink-primary)]">
                  Store
                </Link>
                <span>/</span>
                <span className="text-[var(--color-accent)] font-medium">AI Agents</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    AI Agents
                  </h1>
                  <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                    Agent starter code, tool-calling pipelines, and workflow setups.
                  </p>
                </div>
                <div className="font-mono text-xs text-[var(--color-ink-secondary)] shrink-0">
                  <span className="text-[var(--color-accent)] font-semibold">
                    {categoryCounts.ai_agents}
                  </span>{" "}
                  {categoryCounts.ai_agents === 1 ? "product available" : "products available"}
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Catalog View */}
          <InnerPageEntrance delayIndex={1}>
            <StoreCatalogView
              initialProducts={products}
              categoryCounts={categoryCounts}
              activeCategory="ai_agents"
              showCategoryTabs={false}
            />
          </InnerPageEntrance>

          {/* Navigation Links */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-6 border-t border-[var(--color-hairline)] flex items-center justify-between">
              <Link
                href="/store"
                className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
              >
                <span>← All Products</span>
              </Link>
              <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-ink-secondary)]">
                <Link href="/store/design" className="hover:text-[var(--color-ink-primary)]">
                  ← Design & Templates
                </Link>
                <Link href="/store/digital-products" className="hover:text-[var(--color-ink-primary)]">
                  Digital Products →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
