# ShivSastra

Personal digital headquarters combining:
- Personal portfolio
- Business & advisory services
- Curated digital studio store
- Private admin platform
- Isolated personal lab at `/lab`

## Foundation & Technology Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom locked design tokens)
- **Typography:** Newsreader (Display Serif), Inter (Body Sans), JetBrains Mono (Metadata Monospace)
- **Design Principles:** 80%+ warm ivory light-first canvas (`#FAF9F6`), carbon ink typography (`#111112`), terracotta ember accent (`#D45A2A`), sharp 0px geometry.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Build & Quality Commands

```bash
npm run lint
npm run build
```

## Resend Email Pipeline Setup

The contact transmission pipeline integrates Resend with database-first persistence and security verification:

1. **Create Resend API Key:** Generate a production API key at [resend.com](https://resend.com).
2. **Configure `RESEND_API_KEY`:** Set your secret key as a server-only environment variable (never client-exposed).
3. **Configure `CONTACT_NOTIFICATION_EMAIL`:** Specify the owner inbox where inquiries should be delivered.
4. **Configure `CONTACT_FROM_EMAIL`:** Set the verified sender address (defaults to `onboarding@resend.dev` for testing).
5. **Configure `CONTACT_AUTO_REPLY_ENABLED`:** Set to `true` to send receipt confirmation to visitors, or `false` to disable.
6. **Deploy:** Configure these variables across Development, Preview, and Production on Vercel.
7. **Test Contact Form:** Submit an inquiry via the `/contact` form.
8. **Verify Delivery:** Check that the submission is persisted in Supabase and the notification email is delivered with the visitor's email set as `Reply-To`.

