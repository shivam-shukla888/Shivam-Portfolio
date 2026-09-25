"use client";

import React, { useState } from "react";
import { YOJNA_SETU_DATA, YojnaSetuDemoScenario } from "@/data/projects/yojna-setu-data";

export function YojnaSetuSafeDemo() {
  const { demoScenarios } = YOJNA_SETU_DATA;
  const [selectedId, setSelectedId] = useState<string>(demoScenarios[0].id);
  const [activeStep, setActiveStep] = useState<"message" | "profile" | "eligibility" | "schemes">("schemes");

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
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] px-2.5 py-1 border border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)] font-medium">
              PORTFOLIO DEMO · CLIENT-SIDE SIMULATOR
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]">
              ZERO CREDENTIALS OR PII TRANSMITTED
            </span>
          </div>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          How Intake &amp; Eligibility Work in Practice
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Simulated portfolio experience — not a live government service. Select a sample persona below to walk through the 4 steps: from citizen message to extracted profile, rule checks, and matched schemes.
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
                setActiveStep("schemes");
              }}
              className={`p-4 border text-left transition-[border-color,background-color] duration-150 cursor-pointer ${
                isSelected
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] ring-1 ring-[var(--color-ink-primary)]"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] hover:border-[var(--color-ink-primary)]"
              }`}
            >
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] mb-1">
                {"PERSONA //"}
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
        {/* 4-Step Navigation Tabs */}
        <div className="p-2 border-b border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex flex-wrap gap-2">
          <button
            onClick={() => setActiveStep("message")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeStep === "message"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            STEP 1 · USER MESSAGE
          </button>
          <button
            onClick={() => setActiveStep("profile")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeStep === "profile"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            STEP 2 · PROFILE EXTRACTED
          </button>
          <button
            onClick={() => setActiveStep("eligibility")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeStep === "eligibility"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            STEP 3 · ELIGIBILITY CHECK
          </button>
          <button
            onClick={() => setActiveStep("schemes")}
            className={`px-3 py-1.5 font-mono text-xs cursor-pointer border ${
              activeStep === "schemes"
                ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white"
                : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            STEP 4 · MATCHING SCHEMES ({currentScenario.matchedSchemes.length})
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: User Message */}
          {activeStep === "message" && (
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                STEP 1 · CITIZEN INBOUND MESSAGE
              </span>
              <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                  Natural Language (Hindi / Hinglish / English):
                </span>
                <p className="font-serif italic text-lg text-[var(--color-ink-primary)] leading-relaxed">
                  &ldquo;{currentScenario.samplePrompt}&rdquo;
                </p>
              </div>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                The user does not need to fill out rigid dropdowns. They can describe their background in ordinary conversational phrasing. The Groq LLM parses this message in the next step.
              </p>
            </div>
          )}

          {/* STEP 2: Profile Extracted */}
          {activeStep === "profile" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  STEP 2 · PROFILE EXTRACTED BY AI
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  GROQ CLOUD (NON-AUTHORITATIVE)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)] block">AGE</span>
                  <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                    {currentScenario.demographics.age} years
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)] block">STATE</span>
                  <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                    {currentScenario.demographics.state}
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)] block">OCCUPATION</span>
                  <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                    {currentScenario.demographics.occupation}
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)] block">INCOME</span>
                  <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                    {currentScenario.demographics.annualIncome}
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)] block">GENDER</span>
                  <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                    {currentScenario.demographics.gender}
                  </span>
                </div>
                <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)] block">CATEGORY</span>
                  <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                    {currentScenario.demographics.caste}
                  </span>
                </div>
              </div>

              <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  <strong>Bounded Role:</strong> The AI extracts these structured profile parameters. It does not evaluate scheme rules or decide qualification.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Eligibility Check */}
          {activeStep === "eligibility" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  STEP 3 · DETERMINISTIC JAVA ELIGIBILITY RULES
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  JAVA 21 &amp; POSTGRESQL 17
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)]">AGE CHECK</span>
                    <span className="text-[var(--color-accent)] font-mono text-xs font-bold">✓ PASS</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-primary)]">
                    Age {currentScenario.demographics.age} satisfies min/max age rules for matched schemes.
                  </p>
                </div>

                <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)]">STATE RESIDENCY</span>
                    <span className="text-[var(--color-accent)] font-mono text-xs font-bold">✓ PASS</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-primary)]">
                    Matches schemes in {currentScenario.demographics.state} and nationwide central schemes.
                  </p>
                </div>

                <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)]">INCOME CEILING</span>
                    <span className="text-[var(--color-accent)] font-mono text-xs font-bold">✓ PASS</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-primary)]">
                    Income {currentScenario.demographics.annualIncome} is within statutory maximum limits.
                  </p>
                </div>

                <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[var(--color-ink-secondary)]">OCCUPATION &amp; CASTE</span>
                    <span className="text-[var(--color-accent)] font-mono text-xs font-bold">✓ PASS</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-primary)]">
                    Role ({currentScenario.demographics.occupation}) matches relational child table criteria.
                  </p>
                </div>
              </div>

              <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  <strong>Sole Authority:</strong> Qualification is calculated mathematically by the Java engine over relational database rows. AI cannot grant or deny benefits.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Matching Schemes */}
          {activeStep === "schemes" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  STEP 4 · MATCHING SCHEMES ({currentScenario.matchedSchemes.length} QUALIFIED)
                </span>
                <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  FILTERED FROM 82 NORMALIZED SCHEMES
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

                    <p className="font-sans text-xs sm:text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      <strong>Benefit:</strong> {scheme.benefit}
                    </p>

                    <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-1">
                      <span className="font-mono text-[10px] uppercase text-[var(--color-ink-primary)] font-semibold block">
                        WHY THIS CITIZEN QUALIFIES:
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
