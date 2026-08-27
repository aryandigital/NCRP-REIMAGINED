# Raksha

Raksha is an independent cyber-fraud response prototype. It turns a synthetic incident story into an explainable action plan, mock response packets, and a recovery timeline.

## Setup

Copy `.env.example` to `.env.local`. `SESSION_SECRET` is required for authentication. `DATABASE_URL` is required for persistent accounts and incidents; without it, local development supports the documented demo accounts and temporary incident storage only. Never use an API key previously pasted into chat.

Run the development server:

```bash
npm run dev
```

The public demo works without credentials through the local pattern matcher and the `DEMO0001` synthetic incident.

The complete demo path is: intake by message, voice, screenshot, identifier, or private local fingerprint; editable fact confirmation; ordered containment actions; recipient-specific mock packets; recovery tracking; redacted JSON export; and the synthetic operator console at `/operator`.

See [CAPABILITY_AUDIT.md](CAPABILITY_AUDIT.md) for the locally verified capability status and credential-gated items.

## Test accounts
| Name | Email | Password |
|------|-------|----------|
| User One | user1@email.com | Password1@123 |
| User Two | user2@email.com | Password2@123 |

## Multilingual Raksha Samvaad agent

Raksha now includes a multilingual safety agent on the home page, with a language selector for English, Hindi, Tamil, Telugu, Bengali, and Marathi. It works in a local safety-guidance mode without credentials. To enable Sarvam-backed replies, create `.env.local` from `.env.example` and set a newly issued `SARVAM_API_KEY`; never paste a provider key into chat or commit it to the repository.

Useful checks:

```bash
npm run lint
npm test
npm run build
```

## Deploy to Vercel

1. Import the `Open-Ai-Hakathon` repository and set the Vercel Root Directory to `ncrp-reimagined`.
2. Add `SESSION_SECRET` and `DATABASE_URL` to Production, Preview, and Development environments. Generate `SESSION_SECRET` with at least 32 random bytes.
3. Optionally add `OPENAI_API_KEY` and `SARVAM_API_KEY`. The app keeps its local analysis and safety-guidance fallbacks when these are absent.
4. From a trusted shell with the production `DATABASE_URL` exported, run `npm run db:push` and then `npm run db:seed` once.
5. Deploy with the default Next.js preset (`npm ci`, then `npm run build`). Run `npm run verify` before pushing deployment changes.

Do not deploy without `DATABASE_URL`: serverless instances do not provide durable local storage, so account signup and incident persistence require Neon or another compatible PostgreSQL database.

## Prototype boundary

No real complaint, bank request, police queue, payment, or platform report is submitted. Use synthetic information only. The project is not affiliated with any government body.
