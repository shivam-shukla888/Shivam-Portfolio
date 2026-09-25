import React from "react";

export function YojnaSetuArchitectureDiagram() {
  const pipelineSteps = [
    {
      num: "01",
      title: "User Ingress",
      channel: "WhatsApp & Browser Demo",
      description: "Users send conversational messages in Hindi, Hinglish, or English, or spoken voice notes.",
      detail: "Inbound requests enter through the Twilio webhook adapter or the local portfolio demo adapter.",
    },
    {
      num: "02",
      title: "Webhook Security",
      channel: "Spring Security Layer",
      description: "Checks webhook signatures, verifies idempotency, and filters external media downloads.",
      detail: "Rejects forged payloads and validates media URLs before anything is processed.",
    },
    {
      num: "03",
      title: "AI Profile Extraction",
      channel: "Groq Cloud (LLM + Whisper)",
      description: "Parses conversational text and voice into structured profile fields (age, state, income, caste).",
      detail: "Bounded role: The AI only extracts demographic parameters. It has zero authority over scheme eligibility.",
    },
    {
      num: "04",
      title: "Java Eligibility Rules",
      channel: "Deterministic Engine",
      description: "Evaluates exact statutory rules: age limits, income ceilings, caste, and state residency criteria.",
      detail: "The sole authority for qualification decisions. Replaces probabilistic text matching with deterministic relational rules.",
    },
    {
      num: "05",
      title: "PostgreSQL Database",
      channel: "Supabase (yojna_setu Schema)",
      description: "Stores 82 normalized schemes, criteria tables, conversation state, and webhook deduplication records.",
      detail: "Indexed relational queries resolve matching schemes in <1 ms direct execution.",
    },
  ];

  return (
    <section className="space-y-8" aria-labelledby="architecture-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="architecture-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          04 — SYSTEM ARCHITECTURE
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          How the System Works
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          The main design principle is simple: <strong>AI extracts information. Java rules decide eligibility.</strong> The language model handles informal, multilingual chat, while the deterministic Java backend enforces statutory rules.
        </p>
      </div>

      {/* Visual Pipeline Sequence */}
      <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 sm:p-8 space-y-6">
        {/* Step-by-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-5 border flex flex-col justify-between space-y-4 ${
                idx === 3
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-surface-dark)] text-white"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)]"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      idx === 3 ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
                    }`}
                  >
                    STEP {step.num}
                  </span>
                  {idx === 3 && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)] font-medium">
                      DECISION MAKER
                    </span>
                  )}
                </div>
                <h3
                  className={`font-display text-lg font-normal ${
                    idx === 3 ? "text-white" : "text-[var(--color-ink-primary)]"
                  }`}
                >
                  {step.title}
                </h3>
                <span
                  className={`block font-mono text-[10px] uppercase tracking-wider ${
                    idx === 3 ? "text-neutral-400" : "text-[var(--color-ink-secondary)]"
                  }`}
                >
                  {step.channel}
                </span>
                <p
                  className={`font-sans text-xs leading-relaxed ${
                    idx === 3 ? "text-neutral-300" : "text-[var(--color-ink-secondary)]"
                  }`}
                >
                  {step.description}
                </p>
              </div>

              <div
                className={`pt-3 border-t text-[11px] font-sans ${
                  idx === 3
                    ? "border-[var(--color-dark-hairline)] text-neutral-400"
                    : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)]"
                }`}
              >
                {step.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Linear Flow Summary */}
        <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2 text-[var(--color-ink-primary)]">
            <span className="font-semibold">Pipeline Flow:</span>
            <span>User</span>
            <span className="text-[var(--color-accent)]">→</span>
            <span>WhatsApp</span>
            <span className="text-[var(--color-accent)]">→</span>
            <span>AI extracts profile details</span>
            <span className="text-[var(--color-accent)]">→</span>
            <span className="font-semibold text-[var(--color-accent)]">Java eligibility rules</span>
            <span className="text-[var(--color-accent)]">→</span>
            <span>PostgreSQL</span>
            <span className="text-[var(--color-accent)]">→</span>
            <span>Scheme results</span>
          </div>
          <span className="text-[var(--color-ink-secondary)]">
            5 Stages · Complete Boundary Separation
          </span>
        </div>
      </div>
    </section>
  );
}
