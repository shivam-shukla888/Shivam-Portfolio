import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import {
  getPublishedStoreProductBySlug,
  getPublishedStoreProducts,
  getPublishedProductReviews,
  StoreCategory,
} from "@/lib/products";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { ProductFaqAccordion } from "@/components/store/ProductFaqAccordion";
import { ProductCheckoutAction } from "@/components/store/ProductCheckoutAction";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CATEGORY_NAMES: Record<StoreCategory, string> = {
  design: "Design & Templates",
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
      title: "Product Not Found — Store",
    };
  }

  return {
    title: `${product.title} — Store`,
    description:
      product.shortDescription ||
      product.description ||
      "Digital product by Shivam Shukla.",
    alternates: {
      canonical: `https://shivsastra.com/store/${slug}`,
    },
    openGraph: {
      title: `${product.title} — Store`,
      description:
        product.shortDescription ||
        product.description ||
        "Digital product by Shivam Shukla.",
      url: `https://shivsastra.com/store/${slug}`,
      type: "website",
      images: product.previewImageUrl ? [{ url: product.previewImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — Store`,
      description:
        product.shortDescription ||
        product.description ||
        "Digital product by Shivam Shukla.",
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

  const updatedDate = product.updatedAt
    ? new Date(product.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const productJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription || product.description || undefined,
    image: product.previewImageUrl || undefined,
    category: categoryName,
    offers: {
      "@type": "Offer",
      price: product.priceInCents !== null ? (product.priceInCents / 100).toFixed(2) : undefined,
      priceCurrency: product.currency || "INR",
      availability: product.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `https://shivsastra.com/store/${slug}`,
    },
  };

  if (reviews.length > 0) {
    productJsonLd.review = reviews.map((rev) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.rating,
      },
      author: {
        "@type": "Person",
        name: rev.authorName,
      },
      reviewBody: rev.content,
    }));
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://shivsastra.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Store",
        item: "https://shivsastra.com/store",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `https://shivsastra.com${categoryHref}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title,
        item: `https://shivsastra.com/store/${product.slug}`,
      },
    ],
  };

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ScrollProgress />
      <BackToTop />
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
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--color-ink-secondary)] uppercase tracking-wider">
                      {product.productType.replace("_", " ")}
                    </span>
                    {updatedDate && (
                      <span className="font-mono text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
                        Updated: {updatedDate}
                      </span>
                    )}
                  </div>
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
                <ProductCheckoutAction
                  productId={product.id}
                  productSlug={product.slug}
                  productTitle={product.title}
                  productType={product.productType}
                  formattedPrice={product.formattedPrice}
                  isAvailable={product.isAvailable}
                  priceInCents={product.priceInCents}
                />
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
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Overview
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  Overview
                </h2>
              </div>
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
                  Features
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
                  Requirements
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

          {/* Expandable FAQ Section */}
          <ProductFaqAccordion faq={product.faq} />

          {/* Attestations & Product Reviews */}
          <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                Feedback
              </span>
              <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                Reviews
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
                  No reviews yet for this product.
                </p>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  Feedback from verified buyers will appear here as reviews are submitted.
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
                        Related Products
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
                            <span>{rel.releaseCode || "PRODUCT"}</span>
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
                          View Product →
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
                  <span>All Products</span>
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </article>
  );
}
