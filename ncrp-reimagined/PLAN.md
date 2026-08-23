# PLAN.md — Build Schedule, Workstreams, Cut Lines & Demo Plan

## 1. Six-Day Execution Schedule

```
+--------------------------------------------------------------------------------------------------------------------+
| DAY       | DEV-A WORKSTREAM (Full Stack, UI, DB & Deploy)        | DEV-B WORKSTREAM (Intelligence, Logic & Content)|
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Sat 22    | • Neon Postgres & Drizzle ORM setup                   | • AI Pipeline: Vision OCR & Ingest endpoint     |
| (Tonight) | • Core Schema & initial migrations                    | • redact.ts PII redaction module (with Luhn)    |
|           | • jose cookie auth & seed mock accounts               | • Structured JSON extraction schema (Zod)       |
|           | • Deploy hello-world to Vercel (Green build)          |                                                 |
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Sun 23    | • Check UI (upload, paste, identifier, voice)         | • DNA Pipeline end-to-end                       |
|           | • Scam DNA result page UI                             | • Exact match checkers (SafeBrowsing/URLhaus)   |
|           | • XState / State machine journey wiring               | • In-memory embedding & cosine matcher          |
|           |                                                       | • Stage detection & next-move predictor         |
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Mon 24    | • Triage "What have you already done?" branching      | • Containment playbooks for all 5 tracks        |
|           | • Immediate Action Mode UI (Emergency mode)           | • Statutory clock calculation logic (clocks.ts) |
|           | • ClockCard & ActionStep interactive components       | • Legal citation verification engine            |
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Tue 25    | • Report wizard (One question per page)               | • Legal document generators (documents.ts)      |
|           | • Check-Your-Answers review screen                    | • Print-CSS layout for Bank Letter, Takedown,   |
|           | • Acknowledgement page (14-digit generator)           |   GAC Appeal, MRM Data Sheet, Ombudsman         |
|           | • Recovery Cockpit UI dashboard                       |                                                 |
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Wed 26    | • Global Scam Pattern Atlas pages                     | • In-browser perceptual hashing (blockhash-core)|
|           | • Hindi/English localization pass                     | • StopNCII & Take It Down handoff integration   |
|           | • Mobile polish & responsive testing                  | • 15 canonical scam patterns corpus             |
|           | • Feature freeze at end of day                        | • 6 synthetic test screenshots for judges       |
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Thu 27    | • Full-team bug bash on real mobile devices           | • Clean-browser judge credentials test          |
|           | • Rehearsal runs & screen recording (2-min hard cap)  | • Final summary copy & CODEX.md log updates     |
|           | • Submit by 6:00 PM IST                               |                                                 |
+-----------+-------------------------------------------------------+-------------------------------------------------+
| Fri 28    | • Buffer day only (Hard submission deadline: 8:00 PM IST)                                               |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Cut Lines in Strict Order of Priority

If development falls behind schedule, features must be trimmed according to this predefined priority order:

1. **Cut Line 1 — Interactive India Map on Atlas**: Replace district/state GeoJSON map with clean Recharts bar/trend charts.
2. **Cut Line 2 — Live Voice Input**: Rely on screenshot upload and text paste (which carry 100% of the demo weight).
3. **Cut Line 3 — Hinglish Parsing**: Restrict natural language parsing to standard English and Hindi.
4. **Cut Line 4 — Deep Workflows for Identity & Safety Tracks**: Route to them cleanly, show 1 working action each, and transparently label as "Partial / Prototype Handoff".

> [!CRITICAL]
> **DO NOT CUT CLIENT-SIDE CONTENT HASHING.**
> The browser perceptual hashing demonstration is the key differentiator that sets this project apart from standard AI chatbot wrappers.

---

## 3. Demo Storyboard (2-Minute Hard Cap)

| Time Window | Screen / Action | Voiceover / Narrative |
|---|---|---|
| **0:00 – 0:08** | **The Crisis Numbers**<br>Split screen showing 2025 portal statistics. | *"In 2025, India filed 28.15 lakh cybercrime complaints. Under 2% became FIRs, and roughly 0.4% of money returned. Victims are forced to categorize their own crimes in confusing forms while their money and privacy escape."* |
| **0:08 – 0:45** | **Citizen Journey: Check → Act → Report → Recover**<br>Drag & drop synthetic WhatsApp task scam screenshot. | *"We rebuilt NCRP around the citizen. The user uploads a screenshot. The Scam DNA engine redacts PII, identifies the pattern (94% Task Scam), and predicts the scammer's exact next demand. The user clicks 'I already paid' — site chrome vanishes into Immediate Action Mode. Containment happens first. The complaint is pre-assembled without asking anything twice. The recovery plan launches with the bank freeze letter already generated."* |
| **0:45 – 0:56** | **Content Track (Intimate Image Abuse)**<br>Select synthetic landscape image. Show hash badge. | *"For intimate image abuse, the image is fingerprinted directly in the browser using perceptual hashing. The raw image never leaves the device. The 24-hour statutory takedown clock begins immediately."* |
| **0:56 – 1:00** | **Global Scam Atlas**<br>Rapid scroll through pattern intelligence. | *"Citizens can explore the Global Scam Atlas to verify known manipulation playbooks."* |
| **1:00 – 1:32** | **Technical & Architectural Highlights**<br>Show XState diagram, TypeScript PII redactor, and Next.js layers. | *"Key technical decisions: Behavioral pattern matching instead of fragile blacklist lookups; single incident state carried across all 4 stages; client-side hashing; deterministic rule-based legal documents."* |
| **1:32 – 1:52** | **Real vs Mocked Disclosures**<br>Show UI badges and persistent footer disclaimer. | *"Honesty is front and center: External bank rails and 1930 endpoints are clearly labeled as mocked simulations; PII redaction, hashing, and deadline engines are genuinely functional."* |
| **1:52 – 2:00** | **Closing Summary** | *"NCRP Reimagined: Containing harm first, protecting citizen dignity, and building enforceable legal cases."* |

---

## 4. 250-Word Official Submission Summary

> India's National Cyber Crime Reporting Portal asks a person in crisis to classify their own crime, then fill a form with a 200-character minimum and no special characters. In 2025 it received 28.15 lakh complaints covering ₹22,495 crore in losses. Fewer than 2% became FIRs. Roughly 0.4% of the money came back.
>
> We rebuilt it as a four-stage citizen journey: **Check, Act, Report, Recover**.
>
> You show us what you received — a screenshot, a message, a voice note. A behavioural matching engine identifies the scam's script rather than looking up an identifier, because numbers and UPI IDs rotate hourly while the script does not. It tells you what the scammer will ask for next. It never says "safe" when it simply has no match.
>
> Then it asks what you have already done, and orders your containment accordingly: freeze before filing, secure the email before the bank, preserve evidence before deleting anything. Your complaint is assembled from what you already gave us. Nothing is asked twice.
>
> Afterwards you get a recovery plan, not a status page: eight statutory clocks running live, each generating the pre-filled letter, notice or appeal that must go out before it expires.
>
> For intimate image abuse, the image is fingerprinted in your browser. Only the hash is transmitted. Today, reporting this crime requires uploading the images to a government web form.
>
> Independent prototype. Synthetic data. Every mocked integration labelled in the interface.

---

## 5. Pre-Submission Checklist

- [ ] **Live Public URL**: Tested in clean incognito browser window without login barriers.
- [ ] **Working Judge Credentials**: Quick-switch buttons enabled on `/login`.
- [ ] **2-Minute Video**: Under 120 seconds, MP4/WebM, clear audio, covers citizen journey + tech stack.
- [ ] **Synthetic Test Data**: 6 preloaded realistic screenshot files in repository for evaluator testing.
- [ ] **Zero Unlabeled Mocks**: Every simulated API clearly flagged in UI with badge `[SIMULATED ENCLAVE]`.
- [ ] **Persistent Disclaimer**: Visible in footer across all 15 routes.
- [ ] **`CODEX.md` Maintained**: Log of AI-generated vs manually modified modules up to date.
