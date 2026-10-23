export interface ServicePackage {
  id: string;
  code: string;
  title: string;
  category: string;
  startingPrice: string;
  pricingNote: string;
  idealFor: string;
  turnaround: string;
  revisions: string;
  summary: string;
  deliverables: string[];
  exclusions: string[];
  proofProject?: {
    title: string;
    slug: string;
    description: string;
  };
  contactSubject: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface TechnicalCapability {
  id: string;
  category: string;
  verificationBadge: "Built & Verified in Production" | "Implemented & Verified in Staging" | "Architecture Prototype";
  technologies: string[];
  summary: string;
  capabilities: string[];
  evidence: {
    title: string;
    slug?: string;
    description: string;
  };
}

export interface WebsiteEngineeringArea {
  id: string;
  title: string;
  badge: string;
  summary: string;
  highlights: string[];
  transparencyNote: string;
}

export const TECHNICAL_CAPABILITIES: TechnicalCapability[] = [
  {
    id: "web-development",
    category: "Web & Frontend Engineering",
    verificationBadge: "Built & Verified in Production",
    technologies: ["React 19", "Next.js 16 (App Router)", "TypeScript", "Tailwind CSS"],
    summary:
      "Modern, responsive web applications and landing pages engineered for speed, clean typography, and zero layout shift.",
    capabilities: [
      "Responsive, mobile-first user interfaces tested across viewports",
      "High-performance landing pages with clear content hierarchy and conversion paths",
      "Strict TypeScript type-safety across components, server actions, and validation schemas",
      "Frontend debugging, broken layout triage, cross-browser fixes, and UI improvements",
      "Semantic HTML5 structure and accessible ARIA attributes with visible keyboard focus rings",
    ],
    evidence: {
      title: "ShivSastra Platform",
      slug: "shivsastra",
      description: "Production Next.js 16 App Router application with sub-second load times and zero layout shift.",
    },
  },
  {
    id: "backend-engineering",
    category: "Backend & API Engineering",
    verificationBadge: "Built & Verified in Production",
    technologies: ["Java 21", "Spring Boot 3", "Python", "PostgreSQL", "Supabase", "REST APIs"],
    summary:
      "Stateless RESTful APIs, database integrations, and webhook handlers designed with strict server-side validation.",
    capabilities: [
      "Stateless RESTful API endpoint development following clean MVC architecture",
      "Server-side payload validation with Zod / Hibernate Validator (zero reliance on client inputs)",
      "Server-authoritative business logic where prices and asset paths are derived strictly on the server",
      "Database schema modeling with PostgreSQL and Supabase Row Level Security (RLS) policies",
      "Webhook listeners with timing-safe HMAC-SHA256 signature verification and idempotency guards",
    ],
    evidence: {
      title: "QuickEats & Store Backend",
      slug: "quickeats",
      description: "Server-side price recalculation, STOMP WebSockets, and 25-point automated store security audit.",
    },
  },
  {
    id: "ai-automation",
    category: "AI Integration & Automation",
    verificationBadge: "Architecture Prototype",
    technologies: ["Groq SDK (Llama 3.3)", "OpenAI API", "Anthropic", "Python", "Twilio Webhooks"],
    summary:
      "Conversational assistants and automated workflows that extract structured data from natural language while keeping actions in deterministic code.",
    capabilities: [
      "Conversational FAQ bots and structured lead-intake workflows",
      "Prompt orchestration with strict JSON schema outputs and fallback parsing",
      "Decoupled AI architecture: language models interpret intent while deterministic application code executes actions",
      "Multilingual natural language extraction for localized users (Hindi, English)",
      "Transparent external LLM token estimation and operational costing",
    ],
    evidence: {
      title: "Yojna Setu Platform",
      slug: "yojna-setu",
      description: "Bilingual natural-language profile extraction coupled with a deterministic Java eligibility engine.",
    },
  },
  {
    id: "security-reliability",
    category: "Security, SEO & Site Reliability",
    verificationBadge: "Built & Verified in Production",
    technologies: ["Content Security Policy", "Cloudflare Turnstile", "HMAC-SHA256", "XML Sitemaps", "JSON-LD"],
    summary:
      "Defensive web hygiene covering security headers, anti-spam protections, technical SEO discovery, and automated security test suites.",
    capabilities: [
      "Review of HTTP security headers (CSP, HSTS, X-Frame-Options, MIME sniffing defense)",
      "Technical SEO hygiene (dynamic XML sitemap, canonical URLs, robots.txt, llms.txt discovery manifest)",
      "Structured data / JSON-LD schema implementation (WebPage, Service, CollectionPage, FAQPage)",
      "Contact form anti-spam protection combining Cloudflare Turnstile and hidden honeypots",
      "Automated test suites (25 automated checkout and access control test cases in test-store-security.ts)",
    ],
    evidence: {
      title: "RealGuard & ShivSastra Security",
      slug: "realguard",
      description: "Zero-trust input boundaries, strict CSP, and 25-point automated store security suite.",
    },
  },
];

export const WEBSITE_ENGINEERING_SHOWCASE: WebsiteEngineeringArea[] = [
  {
    id: "technical-seo",
    title: "SEO & Search Engine Discoverability",
    badge: "Verified in Code",
    summary:
      "This website implements production-grade technical SEO to ensure clean crawlability and structured discovery by search engines and LLMs.",
    highlights: [
      "Dynamic XML Sitemap: Auto-generated at /sitemap.xml with accurate change frequencies and priorities",
      "Search Engine Directives: Configured robots.txt with explicit sitemap declarations and crawler rules",
      "Canonical URL Integrity: Absolute self-referencing canonical URLs on every public route",
      "Social Sharing Metadata: Dynamic Open Graph 1200x630 cards and Twitter Summary Large Cards",
      "Structured Data / JSON-LD: Schema.org graphs for WebPage, Service packages, and FAQPage",
      "AI Discoverability: Curated /llms.txt manifest providing clear context for modern AI search assistants",
    ],
    transparencyNote:
      "Note: Sitemap accessibility and metadata correctness provide discovery pathways, but do not guarantee immediate search indexing or top rankings.",
  },
  {
    id: "security-hygiene",
    title: "Application Security & Data Boundaries",
    badge: "Verified in Test Suite",
    summary:
      "Security is engineered defensively at the architectural level: zero client trust for sensitive operations, server-side validation, and automated test coverage.",
    highlights: [
      "HTTP Security Headers: Content Security Policy, strict X-Frame-Options, and nosniff MIME protection",
      "Server-Authoritative Pricing: Client amounts, currencies, and asset paths are completely stripped by server validation schemas",
      "Payment Verification: Timing-safe HMAC-SHA256 signature verification on Razorpay payment callbacks",
      "Anti-Spam Form Controls: Server actions protected with Cloudflare Turnstile cryptographic challenges and hidden honeypot fields",
      "Automated Security Suite: 25-point automated test suite (scripts/test-store-security.ts) verifying tamper rejection and download guards",
    ],
    transparencyNote:
      "Note: These measures represent defensive engineering best practices, not a certified penetration test or warranty against security incidents.",
  },
  {
    id: "performance-accessibility",
    title: "Performance, Layout Stability & Accessibility",
    badge: "Verified in Build",
    summary:
      "A fast, responsive user experience built with semantic HTML, native browser capabilities, and lightweight styling.",
    highlights: [
      "Responsive Layout: Fluid layouts tested across 320px to 1440px+ viewports with zero horizontal overflow",
      "Layout Stability: Zero Cumulative Layout Shift (CLS) through explicit dimensions and font display strategies",
      "Accessible Interactions: Semantic HTML5 landmarks, descriptive alt text on all images, and visible keyboard focus rings",
      "Static Pre-rendering: Next.js 16 App Router with Turbopack generating static HTML with Incremental Static Regeneration",
    ],
    transparencyNote:
      "Note: Performance observations are based on local Next.js production builds and clean code architecture.",
  },
];

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "website-bug-fixing",
    code: "PKG-01",
    title: "Website Bug Fixing & Basic Audit",
    category: "Maintenance & Diagnostics",
    startingPrice: "Starting at ₹999 – ₹1,999",
    pricingNote: "Introductory price for small, clearly scoped issues. Final quote confirmed after initial inspection.",
    idealFor: "Websites with mobile layout glitches, broken CSS/styling, dead links, or console errors.",
    turnaround: "1–2 business days",
    revisions: "1 round of verification on resolved issues",
    summary:
      "Rapid triage and resolution for layout breaks, mobile responsiveness errors, broken links, and front-end quirks.",
    deliverables: [
      "Small, clearly scoped UI and layout fixes",
      "Mobile responsiveness and viewport corrections",
      "Basic broken-link and functionality checks",
      "Basic performance observations and console error remediation",
    ],
    exclusions: [
      "Large-scale codebase refactoring or full-site redesigns",
      "Backend database schema overhauls or migrations",
    ],
    proofProject: {
      title: "ShivSastra Digital HQ",
      slug: "shivsastra",
      description: "Rigorous responsive layout audit, zero layout shift, and clean cross-browser styling.",
    },
    contactSubject: "Website Bug Fixing & Basic Audit Quote",
  },
  {
    id: "nextjs-landing-pages",
    code: "PKG-02",
    title: "Next.js / React Landing Pages",
    category: "Web Development",
    startingPrice: "Starting at ₹2,999 – ₹5,999",
    pricingNote: "Introductory price for single-page conversion marketing or business landing pages.",
    idealFor: "Founders, creators, freelancers, and businesses launching a new service, product, or portfolio.",
    turnaround: "3–5 business days",
    revisions: "2 rounds of layout and copy adjustments",
    summary:
      "Fast, responsive, and conversion-focused landing pages built with modern Next.js App Router, Tailwind CSS, and clean typography.",
    deliverables: [
      "High-performance responsive landing page built with React & Next.js",
      "Clear business narrative sections, value propositions, and contact CTA",
      "Core technical SEO (meta tags, Open Graph social cards, and semantic HTML)",
      "Clean integration of client-supplied brand assets, images, and content copy",
    ],
    exclusions: [
      "Custom multi-page CMS dashboards or multi-tenant authentication (quoted separately)",
      "Copywriting from scratch (requires client-provided copy and assets)",
    ],
    proofProject: {
      title: "ShivSastra Platform",
      slug: "shivsastra",
      description: "High-contrast editorial typography, sub-second load times, and structured SEO signals.",
    },
    contactSubject: "Next.js / React Landing Page Quote",
  },
  {
    id: "api-backend-development",
    code: "PKG-03",
    title: "API Integration & Backend Development",
    category: "Backend & Systems",
    startingPrice: "Starting at ₹3,000+",
    pricingNote: "Final price confirmed after scope review based on endpoint complexity and integration requirements.",
    idealFor: "Teams connecting apps to third-party services (payment gateways, messaging, CRM) or building custom REST APIs.",
    turnaround: "3–7 business days",
    revisions: "2 rounds of integration test reviews",
    summary:
      "Reliable backend endpoint development, webhook listeners, third-party API integrations, and safe data synchronization.",
    deliverables: [
      "Integration with a suitable third-party API (payment, messaging, CRM, email, or database)",
      "Custom backend endpoint development or webhook handler implementation",
      "Defensive error handling, payload schema validation, and basic automated testing",
      "Clear technical documentation of endpoints and configuration environment variables",
    ],
    exclusions: [
      "Third-party API subscription costs (paid directly to Twilio, Stripe, Resend, etc.)",
      "Legacy mainframe or unverified undocumented proprietary protocol integrations",
    ],
    proofProject: {
      title: "QuickEats Backend Engineering",
      slug: "quickeats",
      description: "Server-side price recalculation, JWT token rotation, STOMP WebSockets, and defensive error handling.",
    },
    contactSubject: "API Integration & Backend Development Quote",
  },
  {
    id: "ai-chatbots-automation",
    code: "PKG-04",
    title: "AI Chatbots & Workflow Automation",
    category: "AI & Workflow Engineering",
    startingPrice: "Starting at ₹3,000 – ₹7,000+",
    pricingNote: "Priced after scope review depending on workflow triggers, tools, and message volume.",
    idealFor: "Businesses wanting automated customer FAQ responder bots, WhatsApp lead intake, or webhook workflows.",
    turnaround: "4–8 business days",
    revisions: "2 rounds of prompt and workflow tuning",
    summary:
      "Practical AI workflows and conversational bots that extract structured data, answer FAQs, and automate repetitive tasks reliably.",
    deliverables: [
      "Basic FAQ conversational chatbot or AI API integration (Groq, OpenAI, or Anthropic)",
      "Simple workflow automation (e.g. conversational lead capture to database or email notifications)",
      "Validation testing scenarios and reproducible setup documentation",
      "Transparent disclosure and estimation of external LLM token and hosting costs",
    ],
    exclusions: [
      "Unbounded multi-agent autonomous actions with live financial authority",
      "Third-party LLM token fees (billed directly by Groq, OpenAI, or Anthropic)",
    ],
    proofProject: {
      title: "Yojna Setu Welfare Discovery",
      slug: "yojna-setu",
      description: "Multilingual natural-language profile extraction coupled with deterministic Java eligibility rules.",
    },
    contactSubject: "AI Chatbots & Workflow Automation Quote",
  },
  {
    id: "security-seo-performance-review",
    code: "PKG-05",
    title: "Basic Security, SEO & Performance Review",
    category: "Audits & Hygiene",
    startingPrice: "Quote after scope review",
    pricingNote: "Custom scope tailored to your application's architecture and public footprint.",
    idealFor: "Founders and developers wanting an independent baseline check on security headers, SEO setup, and performance bottlenecks.",
    turnaround: "2–4 business days",
    revisions: "1 follow-up verification review after fixes",
    summary:
      "A systematic inspection of HTTP security headers, technical SEO hygiene (sitemaps, canonicals, JSON-LD), and Core Web Vitals performance bottlenecks.",
    deliverables: [
      "Review of HTTP security headers (CSP, HSTS, X-Frame-Options) and basic configuration",
      "Technical SEO inspection (sitemap.xml, robots.txt, canonical URLs, metadata & JSON-LD)",
      "Inspection of client-versus-server data boundaries and public exposure risks",
      "PageSpeed & Core Web Vitals observations with prioritized remediation notes",
      "Written summary report detailing observations and prioritized action items",
    ],
    exclusions: [
      "Does NOT constitute a certified penetration test, guaranteed exploit immunity, or enterprise compliance audit",
      "Does NOT guarantee search engine rankings or specific search placement (which depends on search engine algorithms and domain authority)",
    ],
    proofProject: {
      title: "RealGuard Architecture",
      slug: "realguard",
      description: "Strict input validation boundaries, deterministic calculations, and zero-trust data separation.",
    },
    contactSubject: "Basic Security, SEO & Performance Review Quote",
  },
];

export const SERVICE_PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Discuss Scope",
    description:
      "Share your website, bug description, or feature requirements via our form or email. We review the scope and clarify technical expectations.",
    deliverable: "Clear requirements outline",
  },
  {
    step: "02",
    title: "Confirm Quote",
    description:
      "You receive a transparent proposal with a defined deliverables checklist, fixed turnaround timeline, and exact starting price before work begins.",
    deliverable: "Written scope & pricing agreement",
  },
  {
    step: "03",
    title: "Build & Implement",
    description:
      "Development proceeds directly using modern, maintainable code (Next.js, TypeScript, Tailwind, Python, or Java) with regular progress check-ins.",
    deliverable: "Working implementation branch or staging link",
  },
  {
    step: "04",
    title: "Review & Revise",
    description:
      "We test the implementation together across mobile and desktop. Included revision rounds ensure styling, responsiveness, and functionality match expectations.",
    deliverable: "Fine-tuned, verified build",
  },
  {
    step: "05",
    title: "Deliver & Handoff",
    description:
      "Final code delivery, clean merge to your repository, deployment to your hosting, and concise documentation for environment setup and ongoing maintenance.",
    deliverable: "Production code + documentation",
  },
];

export const SERVICE_FAQS: ServiceFaq[] = [
  {
    question: "How does pricing work? Are these prices fixed?",
    answer:
      "The listed rates are proposed introductory starting prices for clearly defined, small scopes. Because every codebase and integration has unique factors, we review your requirements first and provide a transparent, fixed quote before any work starts. You will never encounter unexpected fees.",
  },
  {
    question: "What are typical delivery timelines?",
    answer:
      "Website bug fixes and basic audits are typically delivered within 1–2 business days. Next.js landing pages take 3–5 business days. API integrations and AI workflow bots typically take 4–8 business days depending on API complexity.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Each package includes 1 to 2 rounds of revisions on the agreed deliverables. During review, we test the build together and adjust styling, copy placement, or functionality so you receive exactly what was promised.",
  },
  {
    question: "Who pays for hosting, domains, and third-party API fees?",
    answer:
      "You retain full ownership of your accounts. Hosting (such as Vercel or Supabase), custom domains, and external APIs (such as Twilio, Groq, or OpenAI) are billed directly to you by the providers. We guide you through setup and help ensure you choose cost-effective tiers.",
  },
  {
    question: "What is the difference between your Services and the Store?",
    answer:
      "The Store offers ready-to-use digital products, starter templates, and architecture boilerplates available for instant download. Services are bespoke, hands-on client development and consulting engagements tailored specifically to your project requirements.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "Modern web and backend stacks: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Python, Java 21, Spring Boot 3, PostgreSQL, Supabase, Groq SDK, REST APIs, and webhook architectures.",
  },
  {
    question: "How do we get started?",
    answer:
      "Use the Request a Quote form below, email directly at theshivamshukla.4uu@gmail.com, or connect via Contra or LinkedIn. We typically review enquiries and reply within 24 hours.",
  },
];
