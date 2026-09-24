# ShivSastra AI — Security Architecture & Hardening Specification

## 1. Executive Summary & Security Posture
ShivSastra AI is a public, read-only editorial studio assistant designed to help visitors explore publicly published portfolio information, services, store items, and personal lab entries for Shivam Shukla.

> **CRITICAL SECURITY POSTURE:**
> Defense-in-depth controls are strictly implemented across every layer of the system. We explicitly acknowledge that no large language model is 100% immune to prompt injection at the semantic level; instead, our architecture ensures that **privilege escalation, unauthorized database mutations, private data disclosures, and credential leakage are made architecturally impossible** by keeping authority and secrets strictly outside the model context.

---

## 2. Trust Boundaries & Separation of Authority

| Domain | Boundary Classification | Authority & Capabilities |
| :--- | :--- | :--- |
| **Visitor Messages** | **Untrusted** | Treated as unverified data inside `<visitor_query>` delimiters. Cannot configure parameters, models, or tokens. |
| **Conversation History** | **Untrusted** | Validated client-side state. Roles restricted strictly to `user` and `assistant`. Total cumulative characters capped at 10,000. |
| **Public Archive Data** | **Passive Reference Data** | Retrieved server-side from public tables only and enclosed inside `<public_archive_data>`. Cannot issue commands. |
| **Model Inferences** | **Untrusted Output** | Subjected to post-generation schema validation, length bounds, and multi-tier regex sanitization before browser response. |
| **Application Logic** | **Trusted Server Authority** | Determines all access control, rate limiting, token bounds, timeout handling, and database queries. The LLM never makes authorization decisions. |

---

## 3. Data & Confidentiality Boundaries

### 3.1 Allowed Public Data
The assistant has access solely to data that any public visitor could view via the browser:
- `profile_settings`: Public name, positioning, about text, public email, phone, and verified social profiles.
- `projects`: Strictly published projects (`published_at IS NOT NULL`).
- `services`: Strictly active services (`is_active = true`).
- `public_products`: Available store items (`is_available = true`). Private `storage_asset_path` and order fulfillment data are excluded.
- `lab_entries`: Strictly public personal lab entries (`is_public = true` and `published_at IS NOT NULL`).

### 3.2 Strictly Forbidden Data
The following data domains are structurally excluded from the AI knowledge context:
- `contact_submissions` (Visitor messages and email leads)
- `orders` and payment fulfillment records
- Administrative records, authentication tokens, and user IDs
- Draft or unpublished projects/lab explorations
- Private storage paths (`storage_asset_path`) and digital download tokens
- IP addresses and client hashes (`ip_hash`)
- Environment variables (`GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_TOKEN`)

---

## 4. Rate Limiting & Abuse Resistance
- **Architecture**: Distributed atomic sliding-window rate limiting powered by Upstash Redis sorted sets (`ZSET`), with bounded in-memory sliding-window fallback (`MAX_ENTRIES = 1000`).
- **Policy**: 10 chat requests per 10-minute sliding window per client IP.
- **Privacy**: Raw client IP is never persisted; it is extracted via edge platform headers (`cf-connecting-ip` -> `x-vercel-forwarded-for` -> nearest proxy hop) and hashed using SHA-256 with a secret salt.
- **Isolation**: Separate Redis key namespace (`shivsastra:ratelimit:ai:<hash>`) distinct from contact form limiter (`shivsastra:ratelimit:contact:<hash>`).
- **Fail-Safe**: If Redis encounters network stalls, the system degrades to the local in-memory store; rate-limit failures fail closed (429 status code) without exposing internal Redis topology.

---

## 5. Resource Exhaustion & Denial-of-Service Defense
- **Request Body Limit**: Hard 64 KB ceiling enforced before parsing.
- **Message Length**: 2,000 characters maximum per message.
- **Conversation History**: Maximum 12 turns, with a cumulative cap of 10,000 characters.
- **Output Token Bound**: Fixed server-side limit of 1,024 tokens (`MAX_OUTPUT_TOKENS = 1024`). The client cannot request custom `max_tokens`.
- **Inference Timeout**: 15,000 ms timeout enforced via `AbortController`.
- **Concurrency & Re-renders**: Client UI maintains state locally in React without global listeners, WebGL, or animation loops.

---

## 6. Input Sanitization & Trojan Source Neutralization
All incoming text passes through `normalizeChatInput()`:
- **Zero-width characters stripped**: `\u200B`, `\u200C`, `\u200D`, `\uFEFF`, `\u200E`, `\u200F`, `\u2028`, `\u2029`.
- **Bidirectional override markers stripped**: `\u202A` through `\u202E`, `\u2066` through `\u2069` (mitigating Trojan Source visual spoofing attacks).
- **Non-printable ASCII control characters stripped**: `\x00` through `\x1F` (except valid formatting: `\n`, `\r`, `\t`).
- **Unicode normalized**: Composed canonical form (NFC).
- **Strict schema**: Zod `.strict()` rejects unexpected keys (e.g. `model`, `system`, `temperature`).

---

## 7. Output Sanitization & Safe Rendering
- **Safe Markdown**: `SafeMarkdown.tsx` utilizes native React components with zero `dangerouslySetInnerHTML`.
- **URL Sanitization**: Links only allowed if strictly relative (`/...`, rejecting protocol-relative `//`) or secure `https://`. Malicious protocols (`javascript:`, `data:`, `vbscript:`) are rejected and rendered as inert text.
- **Leakage Defense**: `validateAndSanitizeAssistantOutput()` screens responses against forbidden regex patterns (API keys, JWT tokens, private keys, database table names, internal delimiter tags) and replaces offending responses with safe boundary disclaimers.

---

## 8. Residual Risks & Operational Limitations
1. **Model Hallucination**: While constrained by zero-invention instructions and low temperature (`0.2`), LLMs may occasionally rephrase or omit subtle nuances.
2. **Semantic Evasion**: Novel adversarial jailbreaks may produce minor off-topic philosophical responses, but cannot access private data or execute server actions.
3. **Upstream Availability**: Uptime depends on Groq API service availability; fallback produces clean 503/500 notices without exposing provider diagnostics.

---

## 9. Public Navigation Safety

### 9.1 Controlled Route Allowlist
The AI Assistant is restricted to a server-controlled route registry (`PUBLIC_NAVIGATION` and `STATIC_PUBLIC_ROUTES` in `src/lib/ai/navigation.ts`):
- Top-level verified routes: `/`, `/about`, `/projects`, `/services`, `/store`, `/contact`, `/lab`, `/privacy`.
- Verified category routes: `/store/design`, `/store/ai-agents`, `/store/digital-products`.
- All other arbitrary, private, or invented paths are blocked from becoming clickable links.

### 9.2 Dynamic Route Validation
For dynamic routes (`/projects/[slug]`, `/services/[slug]`, `/store/[slug]`, `/lab/[slug]`), links are permitted **only if the exact published slug exists in the active database/knowledge snapshot**.
- Unpublished, draft, or hallucinated slugs are stripped and rendered solely as inert plain text.

### 9.3 Administrative & API Route Exclusion
Private and internal endpoints are categorically excluded:
- `/admin` and `/admin/*`
- `/api/*` (including `/api/assistant`)
- Directory traversal sequences (`..`, `/.`) and backslash tricks (`\`)
- Protocol-relative URLs (`//evil.com`) and pseudo-schemes (`javascript:`, `data:`, `vbscript:`)

### 9.4 Internal Link Normalization & Sanitization
Both server-side (`validateAndSanitizeAssistantOutput`) and client-side (`SafeMarkdown.tsx`):
- Normalize trailing punctuation (periods, commas, parens, brackets, trailing slashes) that otherwise trigger router 404s.
- Support both canonical Markdown links (`[Label](/path)`) and plain-text navigational declarations (`- Label: /path`), converting verified targets into accessible Next.js `<Link>` elements.
- Strip unauthorized or untrusted external domains, restricting external anchors strictly to allowlisted public profiles (Contra, GitHub, LinkedIn, X).

### 9.5 Automated Regression Suites
- `scripts/test-ai-routes.ts`: 125 test assertions verifying filesystem route existence, allowlist evaluation, malformed link neutralization, and user bug reproduction.
- `scripts/verify-routes-browser.ts`: Live end-to-end HTTP click-through verification confirming zero 404s across all public routes, mobile user-agents, and live assistant inference responses.

