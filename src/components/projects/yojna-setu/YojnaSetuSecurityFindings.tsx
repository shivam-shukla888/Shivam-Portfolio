import React from "react";

export function YojnaSetuSecurityFindings() {
  const securityControls = [
    {
      domain: "WEBHOOK & INGESTION SECURITY",
      controls: [
        { name: "HMAC-SHA1 Signature Validation", desc: "Every inbound Twilio webhook request is validated against the provider auth token; forged or unsigned payloads are dropped immediately." },
        { name: "Two-Tier Idempotency", desc: "Prevents duplicate outbound messages during network retries using an in-memory cache backed by unique constraints on webhook_events." },
        { name: "Process-Local Rate Limiting", desc: "Bucket4j token bucket limits inbound interactions to 20 RPM per sender to prevent denial-of-wallet and LLM API exhaustion." },
      ],
    },
    {
      domain: "REMOTE MEDIA & SSRF DEFENSE",
      controls: [
        { name: "HTTPS-Only Enforcement", desc: "Disallows unencrypted HTTP media links across all inbound voice and image attachments." },
        { name: "Strict Host Allowlisting", desc: "Only permits media downloads originating from verified Twilio hostnames (api.twilio.com, mcs.us1.twilio.com)." },
        { name: "DNS Resolution Pre-Flight", desc: "Resolves hostnames to IP addresses prior to connecting, validating against private IPv4/IPv6 address blocks." },
        { name: "Private & Cloud Metadata Blocking", desc: "Explicitly rejects loopback (127.0.0.1), RFC1918 private ranges, and cloud metadata endpoints (169.254.169.254)." },
        { name: "Bounded Stream Reading", desc: "Hard limit of 5MB enforced at the stream reader level; streams exceeding 5MB are terminated before memory exhaustion." },
        { name: "Redirect Re-Validation", desc: "HTTP 3xx redirects are caught and re-evaluated through the complete SSRF validator pipeline before following." },
      ],
    },
    {
      domain: "DATA PRIVACY & PII SAFEGUARDS",
      controls: [
        { name: "SHA-256 Blind Phone Indexing", desc: "Citizen mobile numbers are hashed with a server-side cryptographic salt before storage, preventing plaintext reverse lookups." },
        { name: "Logback PII Masking Converter", desc: "Custom log converter (PiiMaskingConverter) intercepts all log events and redacts 10-digit mobile numbers and demographic strings." },
        { name: "Schema Isolation", desc: "All application tables reside within the dedicated yojna_setu PostgreSQL schema on Supabase, isolating data from public schema objects." },
        { name: "Session & State Reset Workflow", desc: "Sending 'reset' in any conversational turn clears active conversation session state and in-flight demographic parameters." },
      ],
    },
  ];

  return (
    <section className="space-y-8" aria-labelledby="security-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="security-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          06 — SECURITY ENGINEERING
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          Security as an Engineering Requirement
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Rather than relying on marketing claims like &ldquo;unhackable&rdquo; or &ldquo;military-grade,&rdquo; security in Yojna Setu V2 is implemented as a set of verifiable, testable software controls with strict boundary defenses.
        </p>
      </div>

      <div className="space-y-8">
        {securityControls.map((group, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                {group.domain}
              </span>
              <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                VERIFIED V2 CONTROLS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.controls.map((ctrl, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2"
                >
                  <span className="block font-mono text-xs text-[var(--color-ink-primary)] font-semibold">
                    {ctrl.name}
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    {ctrl.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
