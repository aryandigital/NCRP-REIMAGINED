# PHASE1.md — Implementation Status & Phase Roadmap

> This file tracks what has been built, what is in progress, and what is deferred to subsequent phases.
> Update this file continuously as work progresses. It is the source of truth for handoff between sessions.

---

## Overall Architecture: 4 Phases

| Phase | Theme | Status |
|---|---|---|
| **Phase 1** | Foundation + Scam DNA (Check Stage) | 🔄 In Progress |
| **Phase 2** | Action Mode (Triage + Act Stage) | ⏳ Pending |
| **Phase 3** | Report + Recover (Legal Engine) | ⏳ Pending |
| **Phase 4** | Atlas + Track + Polish + Demo | ⏳ Pending |

---

## PHASE 1 — Foundation + Core Intelligence + Check Stage

### Goal
Get the most critical citizen journey working end-to-end: a citizen uploads/pastes evidence → gets a Scam DNA verdict → sees what to do next. This is the core differentiator that must work in every demo.

### Deliverables Checklist

#### 1. Project Infrastructure
- [x] `.env.example` — All required env variables documented
- [x] `PHASE1.md` — This file
- [x] `package.json` — All Phase 1 dependencies added (drizzle, neon, jose, zod, openai, lucide-react, recharts, date-fns, bcryptjs + TypeScript types)
- [x] `tsconfig.json` — TypeScript config
- [x] `drizzle.config.ts` — Drizzle Kit config
- [x] `src/lib/db/schema.ts` — Full Drizzle ORM schema (7 tables: users, incidents, actions, clocks, documents, complaints, hashes, indicators)
- [x] `src/lib/db/index.ts` — Neon serverless DB connection (lazy singleton, graceful without DATABASE_URL)
- [x] `src/lib/auth.ts` — jose cookie session helpers + 3 seeded judge accounts

#### 2. Core Intelligence Library
- [x] `src/lib/redact.ts` — PII redaction (Aadhaar, PAN, Card/Luhn, Phone, UPI, IFSC) + entity extraction
- [x] `src/lib/patterns.ts` — All 15 canonical scam behavioral patterns with full stage graphs, keyword signals, do-not warnings, safe verification
- [x] `src/lib/scam-dna.ts` — 8-step DNA pipeline: entity extraction, URLhaus + SafeBrowsing exact-match, in-memory behavioral matching, stage detection, next-move prediction, ScamVerdictContract output

#### 3. API Routes
- [x] `POST /api/ingest` — Multi-modal intake (GPT-4o Vision OCR / Whisper / text), PII redaction, entity extraction; graceful fallback without OPENAI_API_KEY
- [x] `POST /api/dna` — 8-step DNA pipeline → ScamVerdictContract; persists incident to DB if available
- [x] `GET /api/incident/[id]` — Fetch incident state
- [x] `PATCH /api/incident/[id]` — Update incident (triage answers, active tracks)
- [x] `POST /api/auth/login` — Demo judge authentication with seeded credentials

#### 4. Design System (Blue City Containment Theme)
- [x] `src/app/globals.css` — Full design token system: Blue City colors (light mode primary), typography (Lexend, Bricolage Grotesque, IBM Plex Mono), radius, shadows, badge variants, buttons, inputs, stage stepper, drop zone, Quick Exit, disclaimer footer, print CSS
- [x] `src/components/ui/Button.tsx` — Primary, secondary, alert, ghost variants with Material Symbol icons
- [x] `src/components/ui/Badge.tsx` — Status stamps (verified, processing, action-required, high/medium/unclear risk)
- [x] `src/components/ui/Card.tsx` — Journey cards with header, title, description, footer subcomponents
- [x] `src/components/ui/Input.tsx` — Text fields with labels, error states, hints
- [x] `src/components/ui/Header.tsx` — Sticky header with Quick Exit button
- [x] `src/components/ui/PageContainer.tsx` — Max-width container with responsive padding
- [x] `src/components/ui/Section.tsx` — Labeled sections with dividers
- [x] `src/components/ui/index.ts` — Barrel export for all UI components

#### 5. Core Components
- [x] `src/components/QuickExit.tsx` — Floating exit button (double-ESC + click), clears session storage, replaces history, navigates to Google
- [x] `src/components/StageTimeline.tsx` — Check → Act → Report → Recover stepper with completion states
- [x] `src/components/EvidenceDrop.tsx` — 5 ingestion modes: screenshot (drag/drop/clipboard), text/URL paste, identifier entry, voice recording, guided questionnaire
- [x] `src/components/RiskVerdict.tsx` — Full verdict card: risk badge, pattern name, confidence bar, stage detection, 3 quoted signals, predicted next move, do-not warnings, safe verification, CTAs

#### 6. Pages — Phase 1 Complete
- [x] `src/app/layout.tsx` — Root layout with QuickExit, top nav, persistent disclaimer footer
- [x] `src/app/page.tsx` — Homepage: 4 Doors, universal check bar, statistics ticker, "how it works" steps, Atlas preview strip, differentiators
- [x] `src/app/check/page.tsx` — Evidence Intake: 5-mode EvidenceDrop, privacy notice, post-submit explanation
- [x] `src/app/check/[id]/page.tsx` — Scam DNA Result: RiskVerdict with all 8 output fields, StageTimeline, graceful no-DB fallback
- [x] `src/app/login/page.tsx` — Judge auth: 3 quick-switch credential buttons + manual form
- [x] `src/app/atlas/page.tsx` — Atlas overview: all 15 patterns with badges (functional in Phase 1)
- [x] `src/app/atlas/[slug]/page.tsx` — Pattern deep dive: stage graph, do-not list, safe verification (functional in Phase 1)

#### 7. Stub Pages (Phase 2–4 Placeholder Routes)
- [x] `src/app/triage/[id]/page.tsx` — Phase 2 placeholder with track preview
- [x] `src/app/act/[id]/page.tsx` — Phase 2 placeholder with 5-track card preview  
- [x] `src/app/report/[id]/page.tsx` — Phase 3 placeholder
- [x] `src/app/recover/[caseId]/page.tsx` — Phase 3 placeholder with clock preview cards
- [x] `src/app/track/page.tsx` — Phase 4 placeholder with working ACK input UI
- [x] `src/app/help-someone/page.tsx` — Phase 4 placeholder

#### 8. Build Verification
- [x] `npm run build` — ✅ Clean build, 17 routes (7 static, 10 dynamic), zero TypeScript errors

---

### What Phase 1 Does NOT Include (deferred to Phase 2+)

| Item | Deferred to |
|---|---|
| `/triage/[id]` — Harm assessment branching | Phase 2 |
| `/act/[id]` — Immediate Action Mode (5 tracks) | Phase 2 |
| Client-side perceptual hashing (`blockhash-core`) | Phase 2 |
| `POST /api/hash` — Hash receive endpoint | Phase 2 |
| Containment playbooks for all 5 tracks | Phase 2 |
| `/report/[id]` — Report wizard (one-question-per-page) | Phase 3 |
| `/report/[id]/review` — Check Your Answers | Phase 3 |
| `/report/[id]/submitted` — 14-digit ACK generation | Phase 3 |
| `/recover/[caseId]` — Recovery Cockpit | Phase 3 |
| `POST /api/documents` — Legal document generation | Phase 3 |
| `GET /api/clocks` — Statutory countdown clocks | Phase 3 |
| `/documents/[docId]/print` — Print-CSS legal documents | Phase 3 |
| `src/lib/clocks.ts` — Statutory deadline calculator | Phase 3 |
| `src/lib/documents.ts` — Legal document generators | Phase 3 |
| `/atlas` — Global Scam Pattern Atlas | Phase 4 |
| `/atlas/[slug]` — Pattern deep dives | Phase 4 |
| `/track` — 14-digit ACK lookup | Phase 4 |
| `/help-someone` — Assisted reporting | Phase 4 |
| Hindi/English localization pass | Phase 4 |
| 6 synthetic test screenshots in `src/data/seed.ts` | Phase 4 |
| Mobile polish and responsive testing pass | Phase 4 |
| `POST /api/atlas` — Atlas search endpoint | Phase 4 |

---

## PHASE 2 — Triage + Immediate Action Mode

### Goal
After getting the DNA verdict, the citizen can indicate "something is happening NOW" or "I already acted" and enter the distraction-free Immediate Action Mode that sequences containment steps across all active harm tracks.

### Deliverables Plan

#### Infrastructure
- [ ] `blockhash-core` npm package installed
- [ ] `src/lib/containment.ts` — Containment playbook generator for all 5 tracks

#### API Routes
- [ ] `POST /api/hash` — Receive client-side perceptual hash, store in DB, start 24h clock
- [ ] `PATCH /api/incident/[id]` — Update incident with triage answers and active tracks

#### Components
- [ ] `src/components/ActionStep.tsx` — Checklist item with urgency badge and direct action trigger
- [ ] `src/components/TrackBadge.tsx` — Colored badge for Money / Content / Access / Identity / Safety

#### Pages
- [ ] `src/app/triage/[id]/page.tsx` — **Harm Assessment**: "What have you already done?" branching questionnaire
- [ ] `src/app/act/[id]/page.tsx` — **Immediate Action Mode**: fullscreen, 5 parallel track checklists, content hashing UI, Quick Exit

---

## PHASE 3 — Report + Recover (Legal Engine)

### Goal
After containment, the citizen files a pre-filled complaint (nothing asked twice), gets a 14-digit ACK, and enters the Recovery Cockpit with live statutory countdown clocks and generated legal letters.

### Deliverables Plan

#### Core Library
- [ ] `src/lib/clocks.ts` — Statutory clock calculator (8 clocks, IST business day aware)
- [ ] `src/lib/documents.ts` — Deterministic legal document generators (5 document types)

#### API Routes
- [ ] `POST /api/documents` — Hydrate legal template with incident entities
- [ ] `GET /api/clocks` — Fetch active clocks for an incident
- [ ] `POST /api/complaint` — Formal submission, generate 14-digit ACK

#### Components
- [ ] `src/components/ClockCard.tsx` — Live countdown, statutory source, 1-click letter download
- [ ] `src/components/DocumentPreview.tsx` — Legal document preview before print

#### Pages
- [ ] `src/app/report/[id]/page.tsx` — **Report Wizard** (one question per page, prefilled)
- [ ] `src/app/report/[id]/review/page.tsx` — **Check Your Answers**
- [ ] `src/app/report/[id]/submitted/page.tsx` — **Acknowledgement** (14-digit ACK)
- [ ] `src/app/recover/[caseId]/page.tsx` — **Recovery Cockpit** (clocks, documents, milestones)
- [ ] `src/app/documents/[docId]/print/page.tsx` — **Legal Print View** (Print-CSS)

---

## PHASE 4 — Atlas + Track + Polish + Demo Prep

### Goal
Complete remaining pages, polish mobile UX, add all seed data, and prepare for judge evaluation.

### Deliverables Plan

#### Data & Content
- [ ] `src/data/seed.ts` — 6 synthetic test screenshots + 15 full pattern corpus with stage graphs
- [ ] All 15 `/atlas/[slug]` pattern pages fully populated

#### API Routes
- [ ] `GET /api/atlas` — Atlas search (pattern library, full-text search)

#### Pages
- [ ] `src/app/atlas/page.tsx` — **Global Scam Pattern Atlas** (searchable library)
- [ ] `src/app/atlas/[slug]/page.tsx` — **Pattern Deep Dive** (stage diagram, sample transcripts)
- [ ] `src/app/track/page.tsx` — **Case Tracker** (14-digit ACK lookup, no login)
- [ ] `src/app/help-someone/page.tsx` — **Assisted Reporting** (elderly, minor, family)

#### Polish
- [ ] Hindi/English localization pass on all pages
- [ ] Mobile responsive testing (360px–430px viewports)
- [ ] All `[SIMULATED ENCLAVE]` mock badges verified across UI
- [ ] Judge credential quick-switch on `/login` tested clean-browser
- [ ] 2-minute demo storyboard rehearsal
- [ ] `CODEX.md` final update

---

## Key File Locations (Quick Reference)

```
src/
  app/
    layout.tsx                    ← Root layout (QuickExit + footer)
    page.tsx                      ← Homepage 4 Doors
    globals.css                   ← Design tokens
    check/page.tsx                ← Evidence intake
    check/[id]/page.tsx           ← DNA result (Phase 1)
    triage/[id]/page.tsx          ← Harm assessment (Phase 2)
    act/[id]/page.tsx             ← Immediate action (Phase 2)
    report/[id]/page.tsx          ← Report wizard (Phase 3)
    report/[id]/review/page.tsx   ← Review (Phase 3)
    report/[id]/submitted/        ← ACK (Phase 3)
    recover/[caseId]/page.tsx     ← Recovery cockpit (Phase 3)
    documents/[docId]/print/      ← Legal print (Phase 3)
    atlas/page.tsx                ← Atlas (Phase 4)
    atlas/[slug]/page.tsx         ← Pattern deep dive (Phase 4)
    track/page.tsx                ← Case tracker (Phase 4)
    help-someone/page.tsx         ← Assisted reporting (Phase 4)
    login/page.tsx                ← Judge auth
    api/ingest/route.ts           ← Vision/OCR/Whisper ingest
    api/dna/route.ts              ← DNA pipeline
    api/hash/route.ts             ← Client-side hash receiver (Phase 2)
    api/documents/route.ts        ← Document gen (Phase 3)
    api/clocks/route.ts           ← Clocks (Phase 3)
    api/incident/[id]/route.ts    ← Incident CRUD
  lib/
    db/schema.ts                  ← Drizzle schema
    db/index.ts                   ← Neon connection
    redact.ts                     ← PII redaction
    patterns.ts                   ← 15 scam patterns
    scam-dna.ts                   ← DNA pipeline engine
    clocks.ts                     ← Statutory clocks (Phase 3)
    documents.ts                  ← Legal doc generators (Phase 3)
    auth.ts                       ← jose session helpers
  components/
    QuickExit.tsx
    StageTimeline.tsx
    EvidenceDrop.tsx
    RiskVerdict.tsx
    ActionStep.tsx                ← (Phase 2)
    ClockCard.tsx                 ← (Phase 3)
  data/
    seed.ts                       ← Synthetic test data (Phase 4)
```

---

## Non-Negotiable Invariants (Never Relax These)

1. **Never output `risk: "SAFE"`** — only `HIGH`, `MEDIUM`, `UNCLEAR`
2. **Image never leaves the device** — `blockhash-core` runs client-side; zero bytes of raw image hit the server
3. **PII redacted before LLM** — `redact.ts` runs in memory before any OpenAI call
4. **One incident, no re-entry** — entities extracted in Check flow into Act → Report → Recover
5. **Legal citations are rule-based** — templates substitute fields; the LLM never invents deadlines
6. **Mock disclosures** — every simulated API labeled `[SIMULATED ENCLAVE]` in the UI
7. **Disclaimer footer on every page** — "Independent hackathon prototype. Not affiliated with MHA or I4C."
8. **Quick Exit on every page** — clears state, navigates to google.com

---

---

## Design Integration (Phase 1 Polish — In Progress)

See `DESIGN_INTEGRATION.md` for the full plan to integrate Blue City Containment theme mockups. This document tracks visual design work separate from tech deliverables.

**Status**: 
- ✅ Reusable component library (`src/components/ui/`) built
- ✅ Blue City color tokens added to `globals.css`
- ✅ Font imports (Bricolage Grotesque, IBM Plex Mono, Lexend)
- ⏳ Homepage visual update (next priority)
- ⏳ Check/Evidence Intake styling (next priority)
- ⏳ Scam DNA Verdict styling (next priority)

*Last updated: Phase 1 tech COMPLETE + UI integration framework in place. Build: ✅ clean (17 routes). Ready for design polish and Phase 2 work.*
