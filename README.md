# ShivSastra

Personal digital headquarters for **Shivam Shukla** — backend systems, agentic AI, and AI security.

> Portfolio · Services · Digital Store · AI Assistant · Admin Platform · Lab

## Overview

ShivSastra is a full-stack platform that combines a personal portfolio, a digital product store with Razorpay-powered checkout, an AI-powered site assistant, a CMS-backed admin dashboard, and an isolated personal lab — all running on a single Next.js 16 deployment.

### Core Sections

| Route | Purpose |
|---|---|
| `/` | Hero landing with work highlights, featured projects, and store showcase |
| `/about` | Background, philosophy, and professional profile |
| `/projects` | Portfolio of engineering work (dynamic pages per project) |
| `/services` | Advisory and consulting offerings (backend, AI agents, AI security) |
| `/store` | Digital product storefront with categories, reviews, and Razorpay checkout |
| `/contact` | Inquiry form with Turnstile verification, rate-limiting, and email pipeline |
| `/lab` | Isolated personal experimentation space |
| `/admin` | Protected dashboard — manage projects, services, store catalog, orders, contacts, lab, and profile |

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 (custom locked design tokens) |
| **Database** | Supabase (PostgreSQL + Row-Level Security) |
| **Auth** | Supabase Auth (single-admin model) |
| **Payments** | Razorpay (checkout, webhook verification, digital delivery) |
| **AI** | Groq SDK — site-aware conversational assistant |
| **Email** | Resend (transactional notifications + auto-reply) |
| **Rate Limiting** | Upstash Redis (distributed sliding-window) |
| **Bot Protection** | Cloudflare Turnstile (managed mode) |
| **Animations** | Motion (Framer Motion) |
| **Validation** | Zod |
| **Deployment** | Vercel |

### Typography & Design

- **Display Serif:** Newsreader
- **Body Sans:** Inter
- **Metadata Mono:** JetBrains Mono
- **Palette:** 80%+ warm ivory canvas (`#FAF9F6`), carbon ink (`#111112`), terracotta ember accent (`#D45A2A`), sharp 0px geometry

## Architecture

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── assistant/    # AI chat endpoint (Groq)
│   │   ├── store/        # Checkout, payment verification, downloads
│   │   └── webhooks/     # Razorpay webhook handler
│   ├── admin/            # Protected admin dashboard
│   ├── store/            # Storefront (catalog, categories, product pages)
│   ├── lab/              # Isolated personal lab
│   └── ...               # Public pages (about, projects, services, contact, legal)
├── components/
│   ├── admin/            # Admin UI components
│   ├── ai/               # AI assistant widget + safe markdown renderer
│   ├── contact/          # Contact form components
│   ├── home/             # Landing page sections
│   ├── layout/           # Navbar, Footer, SectionContainer
│   ├── motion/           # Animation provider + motion primitives
│   ├── store/            # Store UI (cards, checkout, reviews)
│   └── ui/               # Shared design system components
├── lib/
│   ├── admin/            # Admin data access
│   ├── ai/               # AI system prompt & context
│   ├── email/            # Resend email templates
│   ├── payments/         # Razorpay integration
│   ├── supabase/         # Client & server Supabase clients
│   ├── validations/      # Zod schemas
│   ├── auth.ts           # Auth helpers
│   ├── orders.ts         # Order lifecycle management
│   ├── products.ts       # Product catalog queries
│   ├── rate-limit.ts     # Redis sliding-window rate limiter
│   ├── redis.ts          # Upstash Redis client
│   ├── reviews.ts        # Product review queries
│   ├── turnstile.ts      # Cloudflare Turnstile verification
│   └── ...
└── proxy.ts              # Middleware proxy utilities

supabase/
└── migrations/           # PostgreSQL migration files (RLS-hardened)
```

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- [Upstash Redis](https://upstash.com) instance
- [Razorpay](https://razorpay.com) account (for store payments)
- [Resend](https://resend.com) API key (for contact emails)
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) site (for bot protection)
- [Groq](https://console.groq.com) API key (for AI assistant)

### Setup

1. **Clone & install:**
   ```bash
   git clone https://github.com/shivam-shukla888/Shivam-Portfolio.git
   cd Shivam-Portfolio
   npm install
   ```

2. **Configure environment:** Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Run database migrations:** Apply the Supabase migrations in `supabase/migrations/` to your project.

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase service role key |
| `SHIVSASTRA_ADMIN_USER_ID` | Server | Single admin user UUID |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Server | Cloudflare Turnstile secret |
| `UPSTASH_REDIS_REST_URL` | Server | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Server | Upstash Redis auth token |
| `RESEND_API_KEY` | Server | Resend email API key |
| `CONTACT_NOTIFICATION_EMAIL` | Server | Owner inbox for contact submissions |
| `CONTACT_FROM_EMAIL` | Server | Verified sender address |
| `CONTACT_AUTO_REPLY_ENABLED` | Server | Enable visitor auto-reply (`true`/`false`) |
| `GROQ_API_KEY` | Server | Groq AI API key |
| `GROQ_MODEL` | Server | Groq model identifier |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | Razorpay key ID (client) |
| `RAZORPAY_KEY_ID` | Server | Razorpay key ID (server) |
| `RAZORPAY_KEY_SECRET` | Server | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Server | Razorpay webhook signature secret |

## Build & Quality

```bash
npm run lint      # ESLint
npm run build     # Production build
```

## Key Features

- **AI Site Assistant** — Groq-powered conversational widget embedded across all pages, with site-aware context and safe markdown rendering
- **Digital Store** — Full e-commerce with product catalog, category browsing (AI Agents, Design, Digital Products), customer reviews, Razorpay checkout, webhook-verified payments, and secure digital download delivery
- **Contact Pipeline** — Turnstile-protected form → Supabase persistence → Resend email notification (with optional auto-reply) → distributed rate limiting via Upstash Redis
- **Admin Dashboard** — Single-admin protected CMS for managing projects, services, store products, orders, contacts, lab entries, and profile
- **SEO & Performance** — Dynamic OG images, sitemap generation, robots.txt, semantic HTML, canonical URLs, ISR with revalidation
- **Motion Design** — Page transitions, scroll-triggered reveals, and micro-interactions via Motion (Framer Motion)
- **Security** — Row-Level Security on all Supabase tables, Turnstile bot protection, server-only secrets, Razorpay webhook signature verification, hardened role privileges

## Documentation

- [`docs/AI_SECURITY.md`](docs/AI_SECURITY.md) — AI assistant security model and prompt injection defenses
- [`docs/STORE_PAYMENTS.md`](docs/STORE_PAYMENTS.md) — Razorpay integration, order lifecycle, and digital delivery flow

## License

Private. All rights reserved.
