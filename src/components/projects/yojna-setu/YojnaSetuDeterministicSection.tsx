import React from "react";

export function YojnaSetuDeterministicSection() {
  return (
    <section className="space-y-8" aria-labelledby="philosophy-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="philosophy-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          05 — CORE DESIGN PRINCIPLE
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          AI Understands. Rules Decide.
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Even if AI extraction is imperfect, it cannot directly decide eligibility. The final decision is made by deterministic Java rules evaluated against verified government scheme criteria.
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Where AI is used */}
        <div className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-accent)] inline-block" />
            <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Where AI Is Used
            </h3>
          </div>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            Language models are great at parsing messy, conversational inputs. In Yojna Setu, Groq Cloud (GPT-OSS-20B and Whisper Large V3 Turbo) is used strictly for:
          </p>
          <ul className="space-y-3 text-xs font-sans text-[var(--color-ink-primary)]">
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-[var(--color-accent)] font-semibold shrink-0">01.</span>
              <span><strong>Understanding Natural Language:</strong> Handling informal messages in Hindi, Hinglish, and English without requiring rigid menus.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-[var(--color-accent)] font-semibold shrink-0">02.</span>
              <span><strong>Profile Extraction:</strong> Pulling key details like age, state, annual income, caste, and occupation into structured fields.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-[var(--color-accent)] font-semibold shrink-0">03.</span>
              <span><strong>Voice-to-Text:</strong> Transcribing WhatsApp audio voice notes into clean text for downstream extraction.</span>
            </li>
          </ul>
        </div>

        {/* Where AI is NOT used */}
        <div className="p-6 sm:p-8 border border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-ink-primary)] inline-block" />
            <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Where AI Is NOT Used
            </h3>
          </div>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            The AI has zero authority over scheme eligibility decisions. All qualification is handled by the Java rules engine because:
          </p>
          <ul className="space-y-3 text-xs font-sans text-[var(--color-ink-primary)]">
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-[var(--color-accent)] font-semibold shrink-0">01.</span>
              <span><strong>Bounded AI Impact:</strong> The AI only extracts structured profile information. It does not decide whether a user qualifies for a scheme.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-[var(--color-accent)] font-semibold shrink-0">02.</span>
              <span><strong>Clear Audit Trail:</strong> Every matched scheme returns the exact mathematical reason (e.g., age &le; 25, income &le; ₹2.5L, state = UP).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-mono text-[var(--color-accent)] font-semibold shrink-0">03.</span>
              <span><strong>Reliable Testing:</strong> Rules can be tested with unit tests and database queries rather than hoping prompts don&apos;t drift.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
          <strong className="text-[var(--color-ink-primary)]">Interview Summary:</strong> If the user enters a typo or ambiguous input, the AI might misinterpret a demographic slot, but the Java engine will only evaluate what is structured. The AI cannot fabricate an entitlement or bypass statutory income limits.
        </p>
      </div>
    </section>
  );
}
