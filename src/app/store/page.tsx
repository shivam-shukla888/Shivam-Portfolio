import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import {
  getPublishedStoreProducts,
  getStoreCategoryCounts,
} from "@/lib/products";
import { StoreCatalogView } from "@/components/store/StoreCatalogView";

export const revalidate = 60;

export const metadata = {
  title: "Store — Studio Catalog & Digital Systems",
  description:
    "Curated digital tools, autonomous agents, and architectural design systems by Shivam Shukla.",
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
                  Studio Store
                </h1>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Curated digital tools, autonomous agents, and architectural design systems crafted by Shivam Shukla. Built for engineers, founders, and creative directors.
                </p>
              </div>
              <div className="font-mono text-xs text-[var(--color-ink-secondary)] shrink-0">
                <span className="text-[var(--color-accent)] font-semibold">
                  {categoryCounts.total}
                </span>{" "}
                {categoryCounts.total === 1 ? "release available" : "releases available"}
              </div>
            </div>
          </div>

          {/* 3 Category Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Design Studio */}
            <Link
              href="/store/design"
              className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
                  <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    Category 01
                  </span>
                  <span>
                    {categoryCounts.design}{" "}
                    {categoryCounts.design === 1 ? "edition" : "editions"}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  Design Studio
                </h2>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  Interaction guidelines, editorial typography systems, UI kit frameworks, and precision aesthetic design libraries.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                <span>Explore Design Editions</span>
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
                    Category 02
                  </span>
                  <span>
                    {categoryCounts.ai_agents}{" "}
                    {categoryCounts.ai_agents === 1 ? "edition" : "editions"}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  AI Agents
                </h2>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  Autonomous cognitive agents, prompt engineering evaluation harnesses, multi-agent orchestrations, and tool interfaces.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                <span>Explore AI Agents</span>
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
                    Category 03
                  </span>
                  <span>
                    {categoryCounts.digital_products}{" "}
                    {categoryCounts.digital_products === 1 ? "edition" : "editions"}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  Digital Products
                </h2>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  Technical monographs, full-stack boilerplates, architectural templates, and production developer licenses.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                <span>Explore Digital Products</span>
                <span>→</span>
              </div>
            </Link>
          </div>

          {/* Full Interactive Catalog View */}
          <div className="space-y-8 pt-6">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                CATALOG
              </span>
              <h2 className="font-display text-3xl font-normal text-[var(--color-ink-primary)]">
                All Studio Editions
              </h2>
            </div>

            <StoreCatalogView
              initialProducts={products}
              categoryCounts={categoryCounts}
              activeCategory="all"
              showCategoryTabs={true}
            />
          </div>

          {/* Back Link */}
          <div className="pt-6 border-t border-[var(--color-hairline)]">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>← Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
