import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { ContactForm } from "@/components/contact/ContactForm";
import { getProfileSettings } from "@/lib/profile";

export const revalidate = 60;

export const metadata = {
  title: "Contact",
  description: "Initiate a collaboration or direct engagement with Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.com/contact",
  },
  openGraph: {
    title: "Contact — Shivam Shukla",
    description: "Initiate a collaboration or direct engagement with Shivam Shukla.",
    url: "https://shivsastra.com/contact",
    type: "website",
  },
};

export default async function ContactPage() {
  const profile = await getProfileSettings();

  const socialLinks = [
    { label: "Contra", url: profile.contraUrl },
    { label: "LinkedIn", url: profile.linkedinUrl },
    { label: "GitHub", url: profile.githubUrl },
    { label: "Instagram", url: profile.instagramUrl },
    { label: "X", url: profile.xUrl },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/contact.webp"
        opacity={0.24}
        position="top"
      />
      <SectionContainer>
        <div className="max-w-5xl space-y-12">
          {/* Header Block */}
          <div className="space-y-3 max-w-2xl">
            <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
              Initiate an Engagement
            </h1>
            <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
              Direct inquiries for {profile.fullName}
            </p>
            <p className="font-sans text-base text-[var(--color-ink-secondary)] pt-2 leading-relaxed whitespace-pre-wrap">
              {profile.contactInstructions}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Direct Channels & Profiles */}
            <div className="lg:col-span-5 space-y-8">
              {/* Direct Channels */}
              <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-5">
                {/* Identity with Portrait */}
                <div className="flex items-center gap-4 pb-4 border-b border-[var(--color-hairline)]">
                  <div className="relative w-14 h-14 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] overflow-hidden shrink-0">
                    <Image
                      src="/images/shivam-shukla.jpg"
                      alt={profile.fullName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="font-display text-lg font-normal text-[var(--color-ink-primary)]">
                      {profile.fullName}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {profile.email && (
                    <div className="space-y-1">
                      <span className="font-sans text-xs uppercase tracking-[0.06em] text-[var(--color-ink-secondary)] block font-medium">
                        Email Address
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        aria-label={`Send email to ${profile.fullName} at ${profile.email}`}
                        className="font-mono text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="space-y-1 pt-2 border-t border-[var(--color-hairline)]">
                      <span className="font-sans text-xs uppercase tracking-[0.06em] text-[var(--color-ink-secondary)] block font-medium">
                        Direct Phone
                      </span>
                      <a
                        href={`tel:${profile.phone}`}
                        aria-label={`Call ${profile.fullName} at ${profile.phone}`}
                        className="font-mono text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Profiles */}
              {socialLinks.length > 0 && (
                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
                  <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] block font-medium">
                    Profiles
                  </span>

                  <ul className="space-y-2.5">
                    {socialLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${link.label} profile of ${profile.fullName}`}
                          className="flex items-center justify-between font-sans text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors py-1.5 border-b border-[var(--color-hairline)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                        >
                          <span>{link.label}</span>
                          <span className="text-[11px] text-[var(--color-ink-secondary)]">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 md:p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                <ContactForm
                  variant="light"
                  labels={{
                    name: "Name / Organization",
                    email: "Email Address",
                    brief: "Inquiry Brief",
                    submit: "Send Message →",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Return */}
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>← Back to Home</span>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
