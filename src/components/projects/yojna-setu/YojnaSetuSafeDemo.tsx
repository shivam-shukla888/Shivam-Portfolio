"use client";

import React, { useState } from "react";
import { YOJNA_SETU_DATA, YojnaSetuDemoScenario } from "@/data/projects/yojna-setu-data";

export function YojnaSetuSafeDemo() {
  const { demoScenarios } = YOJNA_SETU_DATA;
  const [selectedId, setSelectedId] = useState<string>(demoScenarios[0].id);
  const [activeTab, setActiveTab] = useState<"input" | "ai_extraction" | "rules_engine" | "results">("results");

  const currentScenario: YojnaSetuDemoScenario =
    demoScenarios.find((s) => s.id === selectedId) || demoScenarios[0];

  return (
    <section id="interactive-demo" className="space-y-8" aria-labelledby="demo-heading">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            id="demo-heading"
            className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
          >
            09 — INTERACTIVE PORTFOLIO DEMO
          </span>
          <span className="font-mono text-[10px] px-2.5 py-1 border border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)] font-medium">
            PORTFOLIO DEMO · CLIENT-SIDE SIMULATOR
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          Deterministic Rules &amp; Slot-Filling Simulator
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Simulating deterministic rule matching and AI-boundary extraction based on verified scheme criteria. Zero credentials or PII transmitted. Simulated portfolio experience — not a live government service. Select a demographic profile below to observe how unstructured citizen language is parsed into structured parameters and resolved against the scheme dataset.
        </p>
      </div>

      {/* Persona Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {demoScenarios.map((scenario) => {
          const isSelected = scenario.id === selectedId;
          return (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedId(scenario.id);
                setActiveTab("results");
              }}
              className={`p-4 border text-left transition-[border-color,background-color] duration-150 cursor-pointer ${
                isSelected
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] ring-1 ring-[var(--color-ink-primary)]"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] hover:border-[var(--color-ink-primary)]"
              }`}
            >
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] mb-1">
                {"SCENARIO //"}
              </span>
              <span className="block font-display text-lg text-[var(--color-ink-primary)] font-normal leading-tight">
                {scenario.title}
              </span>
              <span className="block font-sans text-xs text-[var(--color-ink-secondary)] mt-1 line-clamp-2">
                {scenario.persona}
              </span>
            </button>
          );
        })}
      </div>

      {/* Simulator Workspace */}
      <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        {/* Navigation Step Tabs */}
        <div className="p-2 border-b border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("input")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeTab === "input"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            1. INBOUND MESSAGE
          </button>
          <button
            onClick={() => setActiveTab("ai_extraction")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeTab === "ai_extraction"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            2. AI SLOT EXTRACTION (JSON)
          </button>
          <button
            onClick={() => setActiveTab("rules_engine")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeTab === "rules_engine"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            3. RELATIONAL RULES ENGINE
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeTab === "results"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            4. MATCHED SCHEMES ({currentScenario.matchedSchemes.length})
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-8">
          {activeTab === "input" && (
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                {"STEP 1 // NATURAL LANGUAGE INTAKE"}
              </span>
              <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  Citizen Inbound Message (Hinglish/Natural Language):
                </span>
                <p className="font-serif italic text-base md:text-lg text-[var(--color-ink-primary)] leading-relaxed">
                  &ldquo;{currentScenario.samplePrompt}&rdquo;
                </p>
              </div>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                Notice that the message contains unstructured parameters (age, state, occupation, income) mixed with conversational greetings. The Groq LLM boundary is invoked to isolate these tokens.
              </p>
            </div>
          )}

          {activeTab === "ai_extraction" && (
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                {"STEP 2 // GROQ EXTRACTION CONTRACT (NON-AUTHORITATIVE)"}
              </span>
              <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-surface-dark)] text-green-400 font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(currentScenario.extractedSlots, null, 2)}</pre>
              </div>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                The language model outputs strictly validated JSON according to the schema contract. Zero business logic or eligibility filtering is executed in this layer.
              </p>
            </div>
          )}

          {activeTab === "rules_engine" && (
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                {"STEP 3 // DETERMINISTIC JOIN PREDICATES (JAVA & POSTGRESQL)"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                  <span className="text-[var(--color-ink-secondary)] block">AGE PREDICATE</span>
                  <span className="text-[var(--color-ink-primary)] font-semibold">
                    min_age &lt;= {currentScenario.demographics.age} &amp;&amp; max_age &gt;= {currentScenario.demographics.age}
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                  <span className="text-[var(--color-ink-secondary)] block">STATE RESIDENCY</span>
                  <span className="text-[var(--color-ink-primary)] font-semibold">
                    state IN (&apos;ALL&apos;, &apos;{currentScenario.demographics.state}&apos;)
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                  <span className="text-[var(--color-ink-secondary)] block">INCOME CEILING</span>
                  <span className="text-[var(--color-ink-primary)] font-semibold">
                    max_income &gt;= {currentScenario.demographics.annualIncome}
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                  <span className="text-[var(--color-ink-secondary)] block">GENDER JOIN</span>
                  <span className="text-[var(--color-ink-primary)] font-semibold">
                    scheme_genders.gender = &apos;{currentScenario.demographics.gender.toUpperCase()}&apos;
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                  <span className="text-[var(--color-ink-secondary)] block">CASTE JOIN</span>
                  <span className="text-[var(--color-ink-primary)] font-semibold">
                    scheme_castes.caste = &apos;{currentScenario.demographics.caste.toUpperCase()}&apos;
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                  <span className="text-[var(--color-ink-secondary)] block">OCCUPATION JOIN</span>
                  <span className="text-[var(--color-ink-primary)] font-semibold">
                    scheme_occupations.occ = &apos;{currentScenario.demographics.occupation.toUpperCase()}&apos;
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  {`STEP 4 // DETERMINISTIC SCHEME RECOMMENDATIONS (${currentScenario.matchedSchemes.length} MATCHES)`}
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  FROM 82 NORMALIZED SCHEMES
                </span>
              </div>

              <div className="space-y-4">
                {currentScenario.matchedSchemes.map((scheme, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-lg sm:text-xl text-[var(--color-ink-primary)] font-normal">
                        {scheme.name}
                      </h4>
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-accent)] font-medium">
                        {scheme.category} Welfare
                      </span>
                    </div>

                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      <strong>Benefit:</strong> {scheme.benefit}
                    </p>

                    <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-ink-primary)] font-semibold block">
                        DETERMINISTIC QUALIFICATION REASON:
                      </span>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                        {scheme.eligibilityReason}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)]">
                        Required Documents:
                      </span>
                      {scheme.documentsRequired.map((doc, dIdx) => (
                        <span
                          key={dIdx}
                          className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)]"
                        >
                          {doc}
                        </span>
                      ))}
                      {scheme.deadline && (
                        <span className="font-mono text-[10px] text-[var(--color-accent)] border-l border-[var(--color-hairline)] pl-2">
                          Deadline: {scheme.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
