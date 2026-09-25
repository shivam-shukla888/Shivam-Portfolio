import React from "react";

export function YojnaSetuDeterministicSection() {
  return (
    <section className="space-y-8" aria-labelledby="philosophy-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="philosophy-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          05 — CORE DESIGN PHILOSOPHY
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          AI Understands. Rules Decide.
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          A fundamental engineering tenet of Yojna Setu is that LLMs must never be permitted to make authoritative decisions regarding citizen benefits. Models are probabilistic; welfare eligibility is deterministic statutory law.
        </p>
      </div>

      {/* Narrative Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-accent)] inline-block" />
            <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Where AI Participates
            </h3>
          </div>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            Large language models excel at processing ambiguous, informal human communication. In Yojna Setu, Groq Cloud (GPT-OSS-20B) is utilized exclusively for:
          </p>
          <ul className="space-y-2 text-xs font-sans text-[var(--color-ink-primary)]">
            <li className="flex items-start gap-2">
              <span className="font-mono text-[var(--color-accent)]">01.</span>
              <span><strong>Multilingual Comprehension:</strong> Parsing citizen inquiries in Hindi, Hinglish, and English without requiring rigid keywords.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[var(--color-accent)]">02.</span>
              <span><strong>Fuzzy Demographic Extraction:</strong> Populating structured demographic slots (age, annual income, domicile, category) from conversational sentences.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[var(--color-accent)]">03.</span>
              <span><strong>Acoustic Transcription:</strong> Converting spoken voice notes into clean text via Whisper Large V3 Turbo.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 border border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--color-ink-primary)] inline-block" />
            <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Where AI Is Deliberately Constrained
            </h3>
          </div>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            AI is completely excluded from the decision loop. The deterministic Java eligibility engine governs all evaluations because:
          </p>
          <ul className="space-y-2 text-xs font-sans text-[var(--color-ink-primary)]">
            <li className="flex items-start gap-2">
              <span className="font-mono text-[var(--color-accent)]">01.</span>
              <span><strong>Zero Hallucinations:</strong> An LLM cannot fabricate a non-existent entitlement, invent a qualifying exception, or alter statutory income thresholds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[var(--color-accent)]">02.</span>
              <span><strong>Explainable Audit Trail:</strong> Every eligibility result produces an inspectable set of database join predicates explaining the exact match reason.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[var(--color-accent)]">03.</span>
              <span><strong>Regression Testability:</strong> Rule changes are validated against automated JUnit test suites rather than unpredictable prompt tuning.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Flow Comparison Strip */}
      <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
            THE DETERMINISTIC BOUNDARY PIPELINE
          </span>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--color-ink-primary)]">
            <span className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
              Citizen Natural Language
            </span>
            <span>→</span>
            <span className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
              AI Slot Extraction (Groq)
            </span>
            <span>→</span>
            <span className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
              Structured DTO
            </span>
            <span>→</span>
            <span className="p-2 border border-[var(--color-ink-primary)] bg-[var(--color-surface-dark)] text-white">
              Deterministic Rules Engine (Java)
            </span>
            <span>→</span>
            <span className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-accent)] font-bold">
              Eligible Schemes &amp; Documentation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
