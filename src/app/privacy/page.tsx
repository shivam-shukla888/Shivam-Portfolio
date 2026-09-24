import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";

export const metadata: Metadata = {
  title: "Privacy Policy — Shivam Shukla",
  description: "Privacy policy and security practices for SHIVSASTRA, operated by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Shivam Shukla",
    description: "Privacy policy and security practices for SHIVSASTRA, operated by Shivam Shukla.",
    url: "https://shivsastra.vercel.app/privacy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <PageBackground
        src="/images/backgrounds/privacy.webp"
        opacity={0.18}
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
                  LEGAL & SECURITY MEMORANDUM
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Privacy Policy
              </h1>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                Last updated: September 24, 2026 · Operator: Shivam Shukla / SHIVSASTRA
              </p>
            </div>
          </InnerPageEntrance>

          {/* Sections */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-10 font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              {/* 1. Scope & Operator */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  1. Scope and Operator Identity
                </h2>
                <p>
                  SHIVSASTRA is the personal portfolio, services, and digital product website operated by Shivam Shukla.
                </p>
                <p>
                  The website is currently deployed and accessible at{" "}
                  <a
                    href="https://shivsastra.vercel.app"
                    className="font-mono text-xs text-[var(--color-accent)] underline hover:text-[var(--color-ink-primary)] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://shivsastra.vercel.app
                  </a>
                  , with canonical production domain configuration established for{" "}
                  <a
                    href="https://shivsastra.vercel.app"
                    className="font-mono text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    https://shivsastra.vercel.app
                  </a>
                  . This Privacy Policy applies to personal information collected through both addresses and related subpaths.
                </p>
                <p>
                  For any privacy questions or requests regarding your data, contact Shivam Shukla directly at:{" "}
                  <a
                    href="mailto:theshivamshukla.4uu@gmail.com"
                    className="font-mono text-xs text-[var(--color-accent)] underline hover:text-[var(--color-ink-primary)] transition-colors"
                  >
                    theshivamshukla.4uu@gmail.com
                  </a>
                  .
                </p>
              </section>

              {/* 2. Information Collected via Contact Form */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  2. Information Submitted via Contact Form
                </h2>
                <p>
                  When you initiate an inquiry or engagement through the public contact form, the following details are collected:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Name / Organization:</strong> To identify who is contacting the studio.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Direct Email:</strong> To respond to your inquiry directly.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Inquiry Brief:</strong> The project details, requirements, or message you provide.
                  </li>
                </ul>
                <p>
                  This information is stored in a private, managed Supabase database instance with Row Level Security (RLS) enabled. Public anonymous read access is completely revoked; submissions are accessible solely by authenticated administrative server routines with service-role credentials.
                </p>
              </section>

              {/* 3. Security, Abuse Prevention & Rate Limiting */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  3. Security & Abuse Prevention
                </h2>
                <p>
                  We implement reasonable technical and architectural safeguards to protect the website and server infrastructure from distributed denial-of-service (DDoS) and automated spam attacks, including:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">HTTPS / TLS Encryption:</strong> All data transmitted between your browser and the website is encrypted in transit using industry-standard TLS protocols.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Anonymized Rate Limiting:</strong> Incoming requests extract the client IP address server-side from proxy headers. The IP address is immediately converted into a salted SHA-256 cryptographic hash. This anonymized hash is used as an ephemeral counter in Upstash Redis to enforce rate limits (5 submissions per 10-minute window). Raw IP addresses are never logged or persisted in database tables.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Cloudflare Turnstile:</strong> We use Cloudflare Turnstile to verify human interaction without intrusive puzzle CAPTCHAs. Verification tokens are checked server-side via Cloudflare Siteverify and are single-use; tokens are never permanently stored.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Honeypot Validation:</strong> Form fields include invisible honeypot elements to silently trap automated bot submissions.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Database Security Policies:</strong> Database access is guarded by strict Row Level Security (RLS) policies and least-privilege service credentials.
                  </li>
                </ul>
                <p className="text-xs text-[var(--color-ink-secondary)]/80 italic">
                  Please note that while reasonable technical safeguards are deployed, no method of transmission over the Internet or electronic storage can be guaranteed as entirely immune to risk.
                </p>
              </section>

              {/* 4. Infrastructure & Service Providers */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  4. Infrastructure & Hosting
                </h2>
                <p>The deployed website utilizes the following infrastructure providers:</p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Vercel:</strong> Application hosting, edge proxy, and production deployment with automated HTTPS/TLS encryption.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Supabase:</strong> Managed database storage for inquiries and published content.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Upstash Redis:</strong> Ephemeral in-memory sliding-window counter storage for rate limiting.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Cloudflare:</strong> Turnstile bot verification service.
                  </li>
                </ul>
              </section>

              {/* 5. Cookies & Analytics */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  5. Cookies & Analytics
                </h2>
                <p>
                  The public website does not use marketing cookies, tracking pixels, third-party advertising networks, or invasive analytics services. Essential cookies are utilized solely for authenticated administrative sessions in the private studio dashboard.
                </p>
              </section>

              {/* 6. Digital Product Orders & Payment Processing */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  6. Digital Product Orders & Payment Processing
                </h2>
                <p>
                  When you purchase a digital product from the SHIVSASTRA Store, we collect your direct email address to generate your order record, issue a purchase receipt, and deliver your secure download token.
                </p>
                <p>
                  Payments are processed directly by our payment gateway partner, Razorpay. Sensitive card numbers, CVVs, and banking credentials are handled exclusively by Razorpay under industry payment standards; SHIVSASTRA servers never receive, store, or process raw payment instruments.
                </p>
                <p>
                  Digital delivery links are protected by single-use signed tokens and download attempt limits stored securely in our database.
                </p>
              </section>

              {/* 7. Data Retention & User Rights */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  7. Data Retention & User Rights
                </h2>
                <p>
                  Information is retained only for as long as reasonably necessary for the purpose for which it was collected, subject to applicable legal or operational requirements. Ephemeral rate-limiting counters in Redis automatically expire after 10 minutes.
                </p>
                <p>
                  Depending on applicable law, you may have rights regarding access, correction, deletion, or restriction of your personal information. You may contact Shivam Shukla using the contact information provided on this website at{" "}
                  <a
                    href="mailto:theshivamshukla.4uu@gmail.com"
                    className="font-mono text-xs text-[var(--color-accent)] underline hover:text-[var(--color-ink-primary)] transition-colors"
                  >
                    theshivamshukla.4uu@gmail.com
                  </a>
                  .
                </p>
              </section>

              {/* 8. Children's Privacy */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  8. Children&apos;s Privacy
                </h2>
                <p>
                  This website is intended for professional and general audiences and does not knowingly collect personal information from children under 13 (or applicable local age limit). If you believe such information was submitted, please contact us for prompt removal.
                </p>
              </section>

              {/* 9. Policy Updates */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  9. Policy Updates
                </h2>
                <p>
                  This Privacy Policy may be updated periodically to reflect changes in technical infrastructure, operational practices, or applicable legal requirements. The updated date at the top of this memorandum indicates the effective revision.
                </p>
              </section>
            </div>
          </InnerPageEntrance>

          {/* Footer Back Link */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                ← Back to Home
              </Link>
              <Link
                href="/contact"
                className="text-[var(--color-accent)] hover:underline"
              >
                Get in touch →
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
