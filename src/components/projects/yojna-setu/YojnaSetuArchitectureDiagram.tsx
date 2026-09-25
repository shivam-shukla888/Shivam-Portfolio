import React from "react";

export function YojnaSetuArchitectureDiagram() {
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
          Decoupled AI Ingestion &amp; Deterministic Rules Authority
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          A core architectural principle in Yojna Setu V2 is the strict separation between probabilistic language interpretation and deterministic policy execution. The LLM is restricted to demographic extraction; it has zero authority to grant, deny, or evaluate scheme eligibility.
        </p>
      </div>

      {/* Visual Architectural Schematic */}
      <div className="p-6 sm:p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-8">
        {/* Tier 1: Client Ingress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
              {"TIER 1 // CLIENT INGRESS"}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-accent)]">
              MULTILINGUAL USER ENTRY
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
              <span className="font-mono text-xs text-[var(--color-accent)]">01. WHATSAPP CHANNEL</span>
              <p className="font-sans text-xs text-[var(--color-ink-primary)] font-medium">
                Twilio Webhook Endpoint
              </p>
              <p className="font-sans text-[11px] text-[var(--color-ink-secondary)]">
                Inbound text &amp; audio notes from citizens.
              </p>
            </div>
            <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
              <span className="font-mono text-xs text-[var(--color-accent)]">02. BROWSER DEMO CHANNEL</span>
              <p className="font-sans text-xs text-[var(--color-ink-primary)] font-medium">
                Provider-Neutral Web Adapter
              </p>
              <p className="font-sans text-[11px] text-[var(--color-ink-secondary)]">
                Isolated sandbox testing environment.
              </p>
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="w-px h-6 bg-[var(--color-hairline)] relative">
            <span className="absolute -bottom-1 -left-1 text-[10px] text-[var(--color-accent)] font-mono">↓</span>
          </div>
        </div>

        {/* Tier 2: Webhook Security Boundary */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
              {"TIER 2 // WEBHOOK SECURITY & INGESTION BOUNDARY"}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-accent)]">
              SPRING SECURITY FILTERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[var(--color-ink-primary)] font-medium">
                HMAC-SHA1 Verification
              </span>
              <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] leading-relaxed">
                Cryptographic signature validation rejecting spoofed or forged provider webhooks.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs text-[var(--color-ink-primary)] font-medium">
                Two-Tier Idempotency
              </span>
              <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] leading-relaxed">
                High-speed in-memory LRU cache backed by durable PostgreSQL <code className="font-mono text-[10px]">webhook_events</code> uniqueness constraints.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs text-[var(--color-ink-primary)] font-medium">
                SSRF-Guarded Media Pipeline
              </span>
              <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] leading-relaxed">
                Host allowlisting, IP/DNS resolution verification, private IP &amp; metadata blocking, and 5MB bounded streaming.
              </p>
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="w-px h-6 bg-[var(--color-hairline)] relative">
            <span className="absolute -bottom-1 -left-1 text-[10px] text-[var(--color-accent)] font-mono">↓</span>
          </div>
        </div>

        {/* Tier 3: AI Extraction Boundary */}
        <div className="p-6 border border-dashed border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold">
              {"TIER 3 // AI INTERPRETATION BOUNDARY (STRICTLY NON-AUTHORITATIVE)"}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]">
              PROBABILISTIC NLP ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <span className="font-mono text-xs text-[var(--color-ink-primary)] font-medium">
                Groq LLM (openai/gpt-oss-20b)
              </span>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                Parses unstructured natural language (Hindi, Hinglish, English) and extracts demographic slots: age, residency state, gender, income, caste, and occupation. Enforces strict XML delimiter defenses against prompt injection.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs text-[var(--color-ink-primary)] font-medium">
                Groq Whisper (whisper-large-v3-turbo)
              </span>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                Transcribes citizen voice notes safely. Audio streams are validated and downloaded through the SSRF-guarded media pipeline before transcription.
              </p>
            </div>
          </div>

          <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
            <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Output Contract: <code className="font-mono text-[11px] text-[var(--color-accent)]">DemographicProfileDTO (age, state, gender, caste, income, occupation)</code>. Zero decision logic.
            </span>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="w-px h-6 bg-[var(--color-hairline)] relative">
            <span className="absolute -bottom-1 -left-1 text-[10px] text-[var(--color-accent)] font-mono">↓</span>
          </div>
        </div>

        {/* Tier 4: Deterministic Rules Engine (The Authority) */}
        <div className="p-6 border-2 border-[var(--color-ink-primary)] bg-[var(--color-surface-dark)] text-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-dark-hairline)] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--color-accent)] inline-block" />
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                {"TIER 4 // DETERMINISTIC ELIGIBILITY ENGINE"}
              </span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)]">
              SOLE ELIGIBILITY AUTHORITY · 100% TEST COVERAGE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="font-mono text-xs text-white font-medium">
                Relational Predicates
              </span>
              <p className="font-sans text-xs text-[var(--color-dark-ink-secondary)] leading-relaxed">
                Evaluates exact mathematical conditions: age bounds (&gt;=, &lt;=), annual income ceilings, domicile matching, and enum-typed social criteria.
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs text-white font-medium">
                Zero String Collision Bugs
              </span>
              <p className="font-sans text-xs text-[var(--color-dark-ink-secondary)] leading-relaxed">
                Eliminates legacy substring bugs (<code className="font-mono text-[10px] text-white">contains(&quot;MALE&quot;)</code>) through strongly typed relational joins against 1NF child tables.
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs text-white font-medium">
                Explainable Audit Trail
              </span>
              <p className="font-sans text-xs text-[var(--color-dark-ink-secondary)] leading-relaxed">
                Every match produces an explicit justification matrix detailing exactly why a citizen qualifies or why criteria were not satisfied.
              </p>
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="w-px h-6 bg-[var(--color-hairline)] relative">
            <span className="absolute -bottom-1 -left-1 text-[10px] text-[var(--color-accent)] font-mono">↓</span>
          </div>
        </div>

        {/* Tier 5: Persistence Layer */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
              {"TIER 5 // SUPABASE POSTGRESQL 17 STORAGE"}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-accent)]">
              ISOLATED SCHEMA: yojna_setu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
              schemes (82 records)
            </div>
            <div className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
              scheme_castes / scheme_genders
            </div>
            <div className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
              conversation_sessions (FSM state)
            </div>
            <div className="p-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
              webhook_events (idempotency)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
