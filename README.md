<div align="center">

# राक्षा · Raksha

**A trauma-informed cybercrime crisis platform for India**

*When seconds matter and the system feels too slow*

---

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-00E5A0?style=for-the-badge&logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

---

## The Problem

India's official cybercrime portal was designed for bureaucrats, not victims. When someone has just lost money to a digital arrest scam or a fake UPI collect request — panicked, confused, potentially still mid-scam — they're faced with a long, opaque form that asks them to recall details they don't have yet.

**Raksha** reimagines that experience from the ground up.

---

## What Raksha Does

You don't file a complaint. You take action.

The platform walks a cybercrime victim through four clear stages:

```
CHECK → ACT → REPORT → RECOVER
```

| Stage | What Happens |
|---|---|
| **Check** | Paste a suspicious message, link, UPI ID, or upload a screenshot. Raksha's Scam DNA engine identifies the fraud type and risk level in seconds. |
| **Act** | Get an immediate, ordered containment checklist — block the attacker, call your bank, dial the national 1930 helpline. Ranked by what's still reversible. |
| **Report** | A pre-filled complaint form built entirely from what you've already provided. No asking the same question twice. |
| **Recover** | Statutory deadlines, an exportable evidence bundle, and a personalised recovery roadmap. |

Every step is designed for someone operating under stress. No jargon. No dead ends.

---

## Screenshots

> *Screenshots coming soon.*

---

## AI at the Core

Raksha uses two AI models, each chosen for a specific job.

### Scam DNA Engine — GPT-4o

The heart of the platform. When you submit suspicious content, it goes through a two-layer analysis:

1. **Local pattern matcher** — a curated corpus of known Indian scam scripts (task scam, digital arrest, pig-butchering, UPI collect fraud, sextortion, OTP theft). Zero latency, works offline, always available.
2. **GPT-4o multimodal analysis** — when an API key is present, the same content (text + screenshot image via base64) is sent to GPT-4o for deep classification. The model returns structured JSON: fraud type, stage, confidence score, behavioural signals, the single most important next move, and what *not* to do.

The local engine is the fallback — the platform is fully functional without any API key.

### Raksha Samvaad — Sarvam AI

A conversational safety agent on the home page powered by **Sarvam-M**, an Indian large language model built for Indian languages. It responds in six languages — English, Hindi, Tamil, Telugu, Bengali, and Marathi — supports voice input via the Web Speech API, and is hardcoded to never ask for personal information and always surface the 1930 helpline for money emergencies.

### PII Redaction Layer

Before any content reaches an external AI, a local redaction pass strips phone numbers, account numbers, Aadhaar-format identifiers, and other personal data. What the model sees is already sanitised.

---

## Key Features

- **Multilingual** — full UI copy in 6 Indian languages
- **Voice input** — speak your incident, don't type it
- **Image fingerprinting** — perceptual hash of uploaded evidence using `blockhash-core`
- **Statutory clock** — tracks time-sensitive legal deadlines that start the moment a fraud occurs
- **Threat Atlas** — a public, browsable library of all scam patterns with stage breakdowns and sourced advisories
- **Evidence bundle** — downloadable, redacted JSON export ready to hand to a bank or police station
- **Operator console** — analyst dashboard at `/operator` for case review
- **Incident tracking** — citizens can check their case status at any time

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, Class Variance Authority |
| AI — Analysis | OpenAI GPT-4o (multimodal), local pattern corpus |
| AI — Agent | Sarvam AI `sarvam-m` (Indian multilingual LLM) |
| State machine | XState v5 — the citizen journey is a formal finite state machine |
| Database | Neon serverless PostgreSQL via Drizzle ORM |
| Auth | JWT (`jose`) + bcrypt password hashing |
| Image hashing | `blockhash-core` (perceptual fingerprinting) |
| Validation | Zod |
| Charts | Recharts |
| Icons | Lucide React |

---

## Architecture Overview

The citizen journey is modelled as an XState finite state machine (`src/machines/journey.ts`). Each state — Check, Act, Report, Recover — has defined transitions, guards, and side effects. This means the app cannot skip steps, cannot show "Act" before "Check" is resolved, and handles error states explicitly.

The AI analysis route (`/api/analyze`) is the only server boundary the app crosses on the critical path. It receives sanitised content, runs the local pattern matcher first, optionally escalates to GPT-4o, and returns a typed `ScamAnalysis` object. Every downstream page — the playbook, the report form, the recovery guide — is derived from that single object.

```
User Input
    │
    ▼
PII Redaction (local)
    │
    ▼
Local Pattern Matcher ──── high confidence ──▶ ScamAnalysis
    │
    └── low confidence
          │
          ▼
       GPT-4o Multimodal
          │
          ▼
       ScamAnalysis
          │
    ┌─────┴──────┬──────────┬──────────┐
    ▼            ▼          ▼          ▼
 Playbook    Report     Clocks    Evidence
  (Act)      (Form)    (Recover)  (Bundle)
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Add OPENAI_API_KEY and/or SARVAM_API_KEY for AI features
# Add DATABASE_URL for Neon persistence
# The app works fully without any keys via the local pattern matcher

# Start dev server
npm run dev
```

The public demo works without credentials via the local pattern matcher and a built-in synthetic incident `DEMO0001`.

---

## Deploy to Vercel

1. Import this repository in Vercel and set the **Root Directory** to `ncrp-reimagined`.
2. In Production, Preview, and Development, add `DATABASE_URL` and a unique `SESSION_SECRET` of at least 32 random bytes. `OPENAI_API_KEY` and `SARVAM_API_KEY` are optional.
3. From a trusted machine with the production `DATABASE_URL` set, run `npm run db:push` and then `npm run db:seed` from `ncrp-reimagined` once.
4. Vercel will build with `npm ci` followed by `npm run build`. Run `npm run verify` locally before deploying.

Do not deploy without `DATABASE_URL`: serverless instances do not provide durable local storage for accounts and incidents.

---

## Test Accounts

| Email | Password |
|---|---|
| test@email.com | Password@123 |
| user2@email.com | Password2@123 |

---

## Prototype Boundary

No real complaint, bank request, police queue, or platform report is submitted by this application. Use synthetic information only. Raksha is not affiliated with any government body.

---

## Technical Details

<details>
<summary>API routes</summary>

| Route | Method | Purpose |
|---|---|---|
| `/api/analyze` | POST | Scam DNA analysis (local + GPT-4o) |
| `/api/agent` | POST | Raksha Samvaad multilingual chat |
| `/api/fingerprint` | POST | Perceptual image hashing |
| `/api/incidents` | GET / POST | Incident CRUD |
| `/api/incidents/[id]` | GET / PATCH | Single incident operations |
| `/api/auth/signin` | POST | JWT sign-in |
| `/api/auth/signup` | POST | Registration |
| `/api/auth/signout` | POST | Session teardown |
| `/api/auth/me` | GET | Current session |

</details>

<details>
<summary>Environment variables</summary>

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | Optional | GPT-4o scam analysis |
| `SARVAM_API_KEY` | Optional | Sarvam multilingual agent |
| `DATABASE_URL` | Optional | Neon PostgreSQL persistence |
| `SESSION_SECRET` | Required in deployment | Auth cookie signing |

</details>

<details>
<summary>Supported scam patterns</summary>

- Digital arrest / fake CBI/ED officer
- Task scam (YouTube likes, app reviews)
- Pig-butchering (fake investment / crypto)
- UPI collect fraud
- Sextortion / screen recording blackmail
- OTP theft / SIM swap
- Fake delivery / customs package

</details>
