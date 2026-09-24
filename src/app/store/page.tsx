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
  title: "Store — Shivam Shukla",
  description:
    "Digital products, templates, and tools made and sold by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.com/store",
  },
};

export default async function StorePage() {
  const [products, categoryCounts] = await Promise.all([
    getPublishedStoreProducts(),
    getStoreCategoryCounts(),
  ]);

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/store.webp"
        opacity={0.24}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-16">
          {/* Header Metadata Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link href="/" className="hover:text-[var(--color-ink-primary)]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[var(--color-accent)] font-medium">Store</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Store
                  </h1>
                  <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                    Digital products I make and sell. Browse templates, tools, and downloadable work.
                  </p>
                </div>
                <div className="font-mono text-xs text-[var(--color-ink-secondary)] shrink-0">
                  <span className="text-[var(--color-accent)] font-semibold">
                    {categoryCounts.total}
                  </span>{" "}
                  {categoryCounts.total === 1 ? "product available" : "products available"}
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* 3 Category Spotlight Cards */}
          <InnerPageEntrance delayIndex={1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Design & Templates */}
              <Link
                href="/store/design"
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
                    <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                      Templates
                    </span>
                    <span>
                      {categoryCounts.design}{" "}
                      {categoryCounts.design === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Design & Templates
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Interaction kits, typography systems, and web templates.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Browse Design</span>
                  <span>→</span>
                </div>
              </Link>

              {/* 2. AI Agents */}
              <Link
                href="/store/ai-agents"
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
                    <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                      Agent Tools
                    </span>
                    <span>
                      {categoryCounts.ai_agents}{" "}
                      {categoryCounts.ai_agents === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    AI Agents
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Agent starter code, tool pipelines, and evaluation workflows.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Browse AI Agents</span>
                  <span>→</span>
                </div>
              </Link>

              {/* 3. Digital Products */}
              <Link
                href="/store/digital-products"
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
                    <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                      Downloads
                    </span>
                    <span>
                      {categoryCounts.digital_products}{" "}
                      {categoryCounts.digital_products === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Digital Products
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Code starter repos, developer templates, and technical downloads.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Browse Products</span>
                  <span>→</span>
                </div>
              </Link>
            </div>
          </InnerPageEntrance>

          {/* Full Interactive Catalog View */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-8 pt-6">
              <div className="space-y-1">
                <h2 className="font-display text-3xl font-normal text-[var(--color-ink-primary)]">
                  All Products
                </h2>
              </div>

              <StoreCatalogView
                initialProducts={products}
                categoryCounts={categoryCounts}
                activeCategory="all"
                showCategoryTabs={true}
              />
            </div>
          </InnerPageEntrance>

          {/* Back Link */}
          <InnerPageEntrance delayIndex={3}>
            <div className="pt-6 border-t border-[var(--color-hairline)]">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>← Back to Home</span>
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
