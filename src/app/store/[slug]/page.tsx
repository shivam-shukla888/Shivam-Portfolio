import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonStyles } from "@/components/ui/Button";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import {
  getPublishedStoreProductBySlug,
  getPublishedStoreProducts,
  getPublishedProductReviews,
  StoreCategory,
} from "@/lib/products";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CATEGORY_NAMES: Record<StoreCategory, string> = {
  design: "Design Studio",
  ai_agents: "AI Agents",
  digital_products: "Digital Products",
};

const CATEGORY_HREFS: Record<StoreCategory, string> = {
  design: "/store/design",
  ai_agents: "/store/ai-agents",
  digital_products: "/store/digital-products",
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedStoreProductBySlug(slug);

  if (!product) {
    return {
      title: "Edition Not Found — SHIVSASTRA Store",
    };
  }

  return {
    title: `${product.title} — SHIVSASTRA Store`,
    description:
      product.shortDescription ||
      product.description ||
      "Studio release crafted by Shivam Shukla.",
    alternates: {
      canonical: `https://shivsastra.com/store/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublishedStoreProductBySlug(slug);

  if (!product || !product.isAvailable) {
    notFound();
  }

  const categoryName = CATEGORY_NAMES[product.category] || "Studio Release";
  const categoryHref = CATEGORY_HREFS[product.category] || "/store";

  const [reviews, relatedProducts] = await Promise.all([
    getPublishedProductReviews(product.id),
    getPublishedStoreProducts({ category: product.category, limit: 4 }),
  ]);

  const filteredRelated = relatedProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <SectionContainer>
        <div className="space-y-16 max-w-4xl mx-auto">
          {/* Header Metadata Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-6">
              {/* Breadcrumb Navigation */}
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-xs font-mono text-[var(--color-ink-secondary)]"
              >
                <Link
                  href="/store"
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  Store
                </Link>
                <span className="text-[var(--color-hairline)] select-none">/</span>
                <Link
                  href={categoryHref}
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  {categoryName}
                </Link>
                <span className="text-[var(--color-hairline)] select-none">/</span>
                <span className="text-[var(--color-accent)] font-medium truncate max-w-[240px]">
                  {product.title}
                </span>
              </nav>

              <div className="space-y-6 pb-10 border-b border-[var(--color-hairline)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]">
                      {categoryName}
                    </span>
                    {product.releaseCode && (
                      <span className="font-mono text-xs text-[var(--color-accent)] font-medium">
                        {product.releaseCode}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-[var(--color-ink-secondary)] uppercase tracking-wider">
                    {product.productType.replace("_", " ")}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
                    {product.title}
                  </h1>
                  <div className="font-mono text-2xl md:text-3xl text-[var(--color-accent)] font-medium shrink-0">
                    {product.formattedPrice}
                  </div>
                </div>

                {product.shortDescription && (
                  <p className="font-sans text-lg md:text-xl text-[var(--color-ink-primary)] leading-relaxed max-w-3xl">
                    {product.shortDescription}
                  </p>
                )}

                {/* Commercial Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(
                      `Edition Acquisition Inquiry: ${product.title}`
                    )}`}
                    className={buttonStyles({
                      variant: "primary",
                      size: "lg",
                      className: "font-mono text-xs uppercase tracking-wider",
                    })}
                  >
                    Inquire to Acquire Edition →
                  </Link>
                  <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Instant digital fulfillment & commercial license upon release.
                  </span>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Main Content: Visuals, Specs, Architecture & Reviews */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-16">
              {/* Visual Frame */}
              {product.previewImageUrl && (
                <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden relative">
              <Image
                src={product.previewImageUrl}
                alt={product.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          {/* Overview & Description */}
          {product.description && (
            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Overview & Architecture
              </h2>
              <div className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed space-y-4 whitespace-pre-line">
                {product.description}
              </div>
            </section>
          )}

          {/* What is Included (Features) */}
          {product.features && product.features.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  SPECIFICATION
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  What is Included
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-start gap-3"
                  >
                    <span className="text-[var(--color-accent)] font-mono text-sm leading-none mt-0.5">
                      ✓
                    </span>
                    <span className="font-sans text-sm text-[var(--color-ink-primary)] leading-normal">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* System Requirements */}
          {product.requirements && (
            <section className="space-y-4 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  PREREQUISITES
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  System Requirements
                </h2>
              </div>
              <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] font-mono text-xs text-[var(--color-ink-secondary)] whitespace-pre-line leading-relaxed">
                {product.requirements}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {product.faq && product.faq.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  QUESTIONS & CLARIFICATIONS
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {product.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-2"
                  >
                    <h3 className="font-sans text-base font-semibold text-[var(--color-ink-primary)]">
                      {item.question}
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Attestations & Product Reviews */}
          <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                FEEDBACK & REVIEWS
              </span>
              <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                Customer Attestations
              </h2>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[var(--color-ink-primary)] font-semibold">
                          {rev.authorName}
                        </span>
                        {rev.authorTitle && (
                          <span className="text-[var(--color-ink-secondary)] ml-2">
                            — {rev.authorTitle}
                          </span>
                        )}
                      </div>
                      <span className="text-[var(--color-accent)]">
                        {"★".repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      &ldquo;{rev.content}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-2">
                <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                  No public attestations have been published yet for this edition.
                </p>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  Client evaluations and verified purchase feedback are curated post-release.
                </p>
              </div>
            )}
          </section>
            </div>
          </InnerPageEntrance>

          {/* Related Category Products & Navigation Footer */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-16">
              {/* Related Category Products */}
              {filteredRelated.length > 0 && (
                <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        RELATED EDITIONS
                      </span>
                      <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                        More from {categoryName}
                      </h2>
                    </div>
                    <Link
                      href={categoryHref}
                      className="font-mono text-xs text-[var(--color-accent)] hover:underline underline-offset-4"
                    >
                      View all in {categoryName} →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredRelated.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/store/${rel.slug}`}
                        className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-3 hover:border-[var(--color-ink-primary)] transition-colors group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-ink-secondary)]">
                            <span>{rel.releaseCode || "EDITION"}</span>
                            <span className="text-[var(--color-accent)] font-semibold">
                              {rel.formattedPrice}
                            </span>
                          </div>
                          <h3 className="font-display text-lg text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            {rel.title}
                          </h3>
                          <p className="font-sans text-xs text-[var(--color-ink-secondary)] line-clamp-2 leading-relaxed">
                            {rel.shortDescription || rel.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-primary)]">
                          View Edition →
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Navigation Footer */}
              <div className="pt-8 border-t border-[var(--color-hairline)] flex justify-between items-center">
                <Link
                  href={categoryHref}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  <span>← Back to {categoryName}</span>
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  <span>All Store Editions</span>
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </article>
  );
}
