# CLAUDE.md — Developer Guide & Project Tenets

## Project Overview: NCRP Reimagined
**NCRP Reimagined** is a ground-up redesign of India's National Cyber Crime Reporting Portal (`cybercrime.gov.in`), built around the citizen experience.

### The One-Line Thesis
> **Cybercrime is not a money problem. It is a loss-of-control problem.** Something of yours is escaping: money, images, account access, identity, or safety. The portal's job is to **contain the escape first**, and **build the case second**.

---

## Core Non-Negotiables & Guiding Rules

1. **Governing Rule (No Repetition)**:
   - One incident carried across all 4 stages: **Check → Act → Report → Recover**.
   - **Nothing is ever asked twice.** Everything captured during Check flows into Act, Report, and Recover without re-entry.

2. **The Verdict Contract (Never Say "Safe")**:
   - A checker that says "safe" because an identifier is absent from a database is dangerous.
   - Verdicts can only be: **High Risk**, **Medium Risk**, or **Unclear**. Never output "Safe".

3. **The Content Track (Image Never Uploads)**:
   - For intimate image abuse / non-consensual content, **the image never leaves the user's device**.
   - Perceptual hashing (`blockhash-core` / canvas) is computed client-side in the browser.
   - Only the cryptographic/perceptual hash is transmitted to the server and platforms.
   - The database has **NO media column**.

4. **Containment First (Freeze Before Filing)**:
   - If triage shows active ongoing harm, site chrome disappears and switches immediately to **Immediate Action Mode**.
   - Containment is sequenced by track before formal reporting paperwork.

5. **Statutory Deadline Engine**:
   - Every legal right has a live countdown clock (RBI 3-day zero liability, IT Rules 24-hour takedown, 30-day GAC appeal, etc.).
   - Every clock generates the exact legal document/letter/notice required before expiration.
   - Every legal citation is rule-based and rendered explicitly with source citations.

6. **Honesty & Mock Disclosures**:
   - Every mocked integration (e.g. 1930 backend, StopNCII API, GAC portal, Bank direct freeze) is **visibly labeled as synthetic/mocked in the UI**.
   - No generic chatbots, no unsourced fake heatmaps, no fake AI miracles.

7. **Dignity & Trauma-Informed UX**:
   - Quick Exit button on all pages (clears browser state, escapes to Google/Weather).
   - Anonymous reporting by default on content, safety, and minor tracks.
   - Under-18 routes directly to POCSO framing, Take It Down, and Childline 1098.
   - Direct Tele-MANAS (14416) mental health helpline surfacing.
   - No minimum character counts, no restrictive regex that blocks traumatized citizens.

8. **Mandatory Persistent Disclaimer**:
   - Footer on every page: *"Independent hackathon prototype. Not affiliated with MHA or I4C. All data synthetic. No national emblem, no I4C logo, no implication of endorsement."*

---

## Tech Stack Overview

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript / JavaScript
- **Styling**: Tailwind CSS + Custom CSS Design System (clean, accessible, high contrast)
- **State Management**: State machines (`xstate` / `@xstate/react`) or robust React state workflows for stage transitions
- **Database / ORM**: Serverless Postgres (Neon / Supabase) with Drizzle ORM
- **Client Hashing**: `blockhash-core` (pure JS canvas-based perceptual hashing)
- **AI & Extraction**: AI SDK / OpenAI API (Vision ingest, Whisper audio transcription, structured JSON schema extraction)
- **PII Redaction**: Custom TypeScript regex & Luhn validator (`redact.ts` for Aadhaar, PAN, UPI, Card numbers, Phones, IFSC)
- **Auth**: Signed cookie sessions (`jose`) with seeded judge accounts
- **Charts & Icons**: `recharts`, `lucide-react`, `date-fns`

---

## Key Project Reference Documents

| Document | Purpose |
|---|---|
| [DESIGN.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/DESIGN.md) | UX philosophy, 4 doors, 4-stage journey, design system, component specs, trauma-informed guidelines |
| [ARCHITECTURE.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/ARCHITECTURE.md) | 6-layer architecture, route map, API endpoints, AI pipeline, data flow |
| [PLAN.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/PLAN.md) | Build schedule, Dev-A/Dev-B division, cut lines, demo storyboard, submission requirements |
| [SCHEMA.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/SCHEMA.md) | PostgreSQL / Drizzle schema, entity relations, JSONB data contracts, seed data |
| [LEGAL_CLOCKS.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/LEGAL_CLOCKS.md) | 8 statutory clocks, RBI/IT Act citations, legal notice templates, Print-CSS output |
| [SCAM_DNA.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/SCAM_DNA.md) | 15 scam behavioral scripts, stage graphs, next-move prediction rules, PII redaction |
| [CODEX.md](file:///c:/Users/imkk8/OneDrive/Desktop/Projects/NCRP-REIMAGINED/ncrp-reimagined/CODEX.md) | AI assistance changelog and provenance tracking |

---

## Development Workflow & Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run linting checks
npm run lint

# Build production bundle
npm run build
```

---

## Architecture Boundaries & Rules

1. **Client vs Server Boundary**:
   - Hashing of intimate media must happen **strictly in client components** before any network request.
   - PII redaction (`redact.ts`) must run before any payload is sent to third-party LLMs or persistent storage.
2. **Deterministic Documents**:
   - Document generators must be rule-based templates that substitute validated incident fields; the LLM formats language only and **never invents statutory deadlines**.
3. **Seed Data & Testing**:
   - Keep seeded judge credentials ready on `/login`.
   - Provide 6 synthetic test screenshots and sample scam scripts in `src/data/seed.ts` for 60-second judge demonstrations.
