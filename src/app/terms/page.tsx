import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms of Service — Shivam Shukla",
  description: "Terms of service, digital licensing, and usage conditions for SHIVSASTRA by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.com/terms",
  },
  openGraph: {
    title: "Terms of Service — Shivam Shukla",
    description: "Terms of service, digital licensing, and usage conditions for SHIVSASTRA by Shivam Shukla.",
    url: "https://shivsastra.com/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — Shivam Shukla",
    description: "Terms of service, digital licensing, and usage conditions for SHIVSASTRA by Shivam Shukla.",
  },
};

export default function TermsPage() {
  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <PageBackground
        src="/images/backgrounds/privacy.webp"
        opacity={0.16}
        position="top"
      />
      <SectionContainer>
        <div className="max-w-3xl space-y-12">
          {/* Header */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-accent)] inline-block shrink-0" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Terms & Conditions
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Terms of Service
              </h1>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                Last updated: September 2026 · Operator: Shivam Shukla / SHIVSASTRA
              </p>
            </div>
          </InnerPageEntrance>

          {/* Body Sections */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-10 font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              {/* 1. Agreement to Terms */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  1. Scope and Agreement
                </h2>
                <p>
                  These Terms of Service govern your access to and use of SHIVSASTRA (
                  <span className="font-mono text-xs text-[var(--color-ink-primary)]">
                    https://shivsastra.com
                  </span>
                  ), including all associated digital products, software templates, services, and content operated by Shivam Shukla.
                </p>
                <p>
                  By browsing the site, submitting inquiries, or purchasing digital goods, you acknowledge and agree to these terms. If you do not agree with any part of these terms, please discontinue use of the site.
                </p>
              </section>

              {/* 2. Digital Products & Licensing */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  2. Digital Products and Licenses
                </h2>
                <p>
                  Digital products sold through the SHIVSASTRA Store (including code repositories, agent templates, UI component kits, and monographs) are distributed under non-exclusive software licenses:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Personal / Standard License:</strong> Grants you permission to use, customize, and integrate the code into your personal or internal business projects.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Commercial Projects:</strong> You may build and deploy commercial applications that incorporate the code or design templates.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Redistribution Prohibition:</strong> You may not re-license, sublicense, sell, resell, or distribute the raw product files, source templates, or digital assets as standalone assets or competing products.
                  </li>
                </ul>
              </section>

              {/* 3. Orders & Digital Delivery */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  3. Orders and Delivery
                </h2>
                <p>
                  Digital purchases are fulfilled electronically. Upon confirmed cryptographic verification of payment via our payment processor:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>
                    An instant download authorization token and link are issued in your browser.
                  </li>
                  <li>
                    A confirmation receipt containing your order reference and backup download link is emailed to the address provided during checkout.
                  </li>
                  <li>
                    Download links are time-limited for security and may be refreshed using your verified order reference by contacting support.
                  </li>
                </ul>
              </section>

              {/* 4. Payments and Pricing */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  4. Payments and Processing
                </h2>
                <p>
                  Payments on this website are processed securely through certified payment gateways (such as Razorpay). We do not collect, process, or store complete credit card numbers or sensitive banking credentials on our servers. All transactions are billed in the currency specified on the product page (INR or USD).
                </p>
              </section>

              {/* 5. Custom Services and Consulting */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  5. Consulting and Custom Engagements
                </h2>
                <p>
                  Custom engineering, AI workflow design, and advisory services are provided on mutually agreed scopes. Timelines, deliverables, payment milestones, and intellectual property terms for custom client engagements are specified in individual written proposals or statements of work.
                </p>
              </section>

              {/* 6. Disclaimers and Limitation of Liability */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  6. Warranty Disclaimer and Liability
                </h2>
                <p>
                  Digital templates, software repositories, and website content are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis without warranties of any kind, whether express or implied.
                </p>
                <p>
                  To the maximum extent permitted by applicable law, Shivam Shukla shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of or inability to use the digital products, services, or website.
                </p>
              </section>

              {/* 7. Governing Law & Contact */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  7. Inquiries and Contact Information
                </h2>
                <p>
                  For any questions regarding these Terms of Service or your orders, please contact Shivam Shukla directly:
                </p>
                <p>
                  <strong className="text-[var(--color-ink-primary)]">Email:</strong>{" "}
                  <a
                    href="mailto:theshivamshukla.4uu@gmail.com"
                    className="font-mono text-xs text-[var(--color-accent)] underline hover:text-[var(--color-ink-primary)] transition-colors"
                  >
                    theshivamshukla.4uu@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </InnerPageEntrance>

          {/* Navigation Return */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                ← Back to Home
              </Link>
              <Link
                href="/refunds"
                className="text-[var(--color-accent)] hover:underline"
              >
                Refund Policy →
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
