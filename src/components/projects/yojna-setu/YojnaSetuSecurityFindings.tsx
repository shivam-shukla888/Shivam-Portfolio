import React from "react";

export function YojnaSetuSecurityFindings() {
  const securityControls = [
    {
      num: "01",
      name: "Webhook Verification",
      summary: "Twilio webhook signatures are checked before processing requests.",
      detail: "Inbound requests without valid HMAC signatures are immediately dropped, preventing forged or spoofed messages.",
    },
    {
      num: "02",
      name: "SSRF Protection",
      summary: "External media URLs are validated before the server downloads them.",
      detail: "Restricts media downloads to verified Twilio hosts, blocks private IP ranges and cloud metadata endpoints, and enforces 5MB stream limits.",
    },
    {
      num: "03",
      name: "PII-Safe Logging",
      summary: "Sensitive phone numbers and demographic data are masked in logs.",
      detail: "Phone numbers are stored as salted SHA-256 hashes, and a custom Logback converter masks mobile numbers in application logs.",
    },
    {
      num: "04",
      name: "Webhook Idempotency",
      summary: "Repeated webhook deliveries do not create duplicate processing.",
      detail: "Unique database constraints on webhook event IDs prevent re-processing retried requests or sending duplicate replies.",
    },
    {
      num: "05",
      name: "Persistent Conversation State",
      summary: "Conversation state is stored so multi-step conversations survive restarts.",
      detail: "Multi-turn demographic collection is backed by PostgreSQL sessions rather than volatile in-memory maps.",
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
          Security Controls
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Key security controls implemented in V2. Instead of generic marketing claims, these represent concrete software defenses built into the backend.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityControls.map((ctrl) => (
          <div
            key={ctrl.num}
            className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <span className="font-mono text-xs text-[var(--color-accent)] font-semibold block">
                CONTROL {ctrl.num}
              </span>
              <h3 className="font-display text-xl text-[var(--color-ink-primary)] font-normal">
                {ctrl.name}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[var(--color-ink-primary)] font-medium leading-relaxed">
                {ctrl.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-hairline)]">
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {ctrl.detail}
              </p>
            </div>
          </div>
        ))}

        {/* Security Audit Badge Card */}
        <div className="p-6 border border-[var(--color-ink-primary)] bg-[var(--color-surface-dark)] text-white space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)] font-semibold block">
              RELEASE GATE STATUS
            </span>
            <h3 className="font-display text-xl text-white font-normal">
              0 Critical / High Findings
            </h3>
            <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Verified in the final independent security audit before release.
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--color-dark-hairline)]">
            <p className="font-mono text-[11px] text-neutral-400">
              Backend test suites verify webhook HMAC, SSRF revalidation, and session isolation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
