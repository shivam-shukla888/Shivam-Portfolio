import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getProfileSettings } from "@/lib/profile";

export const revalidate = 60;

export const metadata = {
  title: "About Shivam Shukla",
  description: "About Shivam Shukla — Personal Digital Headquarters & Studio.",
  alternates: {
    canonical: "https://shivsastra.com/about",
  },
  openGraph: {
    title: "About Shivam Shukla",
    description: "About Shivam Shukla — Personal Digital Headquarters & Studio.",
    url: "https://shivsastra.com/about",
    type: "profile",
  },
};

export default async function AboutPage() {
  const profile = await getProfileSettings();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/about.webp"
        opacity={0.25}
        position="top"
      />
      <SectionContainer>
        <div className="max-w-4xl space-y-12">
          {/* Header Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                About {profile.fullName}
              </h1>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Personal Profile & Studio Discipline
              </p>
            </div>
          </InnerPageEntrance>

          {/* Main Content: Portrait & Narrative */}
          <InnerPageEntrance delayIndex={1}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              {/* Portrait */}
              <div className="md:col-span-5 space-y-3">
                <div className="relative aspect-[4/5] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt={`${profile.fullName} — Portrait`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 360px"
                    priority
                  />
                </div>
              </div>

              {/* Narrative Content */}
              <div className="md:col-span-7 space-y-6">
                <div className="p-8 md:p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                  <p className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] leading-relaxed italic whitespace-pre-wrap">
                    {profile.aboutMarkdown}
                  </p>
                </div>

                <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  Biographical narrative, background history, and studio principles will be authored strictly by {profile.fullName}.
                </p>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Navigation Action */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-4 border-t border-[var(--color-hairline)]">
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
