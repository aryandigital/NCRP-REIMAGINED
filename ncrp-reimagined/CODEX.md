# CODEX.md — AI Scaffolding & Code Provenance Log

> **Submission Requirement**: This document maintains a transparent running record of AI-assisted scaffolding, architectural decisions, code generation, and manual developer refinements throughout the NCRP Reimagined build window.

---

## 1. Provenance Summary Table

| Date | Target Modules / Files | Generation Type | Description & Developer Interventions |
|---|---|---|---|
| **2026-08-23** | `CLAUDE.md`, `DESIGN.md`, `ARCHITECTURE.md`, `PLAN.md`, `SCHEMA.md`, `LEGAL_CLOCKS.md`, `SCAM_DNA.md` | Scaffolding & Architecture Docs | Synthesized complete 26-page NCRP Reimagined Build Plan into executable specifications. Established 4-Stage Journey, 5 Harm Tracks, Zero-Upload Hashing, and 8 Statutory Clocks. |
| *Pending* | `src/lib/redact.ts`, `src/lib/clocks.ts`, `src/lib/dna.ts` | Code Scaffolding | Custom TypeScript PII redaction (with Luhn validator) and deterministic deadline calculator. |
| *Pending* | `src/data/patterns.ts`, `src/data/seed.ts` | Data & Corpus | 15 canonical behavioral scam patterns, stage progression graphs, and 6 synthetic demo screenshot fixtures. |
| *Pending* | `src/app/` Route Pages & Components | Full Stack UI | Four-Door home, Scam DNA Result, Immediate Action Mode emergency view, Recovery Cockpit, and Print-CSS legal notices. |

---

## 2. Core Architectural Decisions Log

### Log Entry 01: Client-Side Perceptual Hashing
- **Prompt / Intent**: Implement non-consensual intimate image abuse reporting without exposing user imagery to servers.
- **Decision**: Use `blockhash-core` inside HTML5 canvas client-side. Transmit only the 64-bit hexadecimal hash.
- **Safety**: Verified that the database schema contains zero media storage columns.

### Log Entry 02: Deterministic Legal Clocks & Notice Templates
- **Prompt / Intent**: Provide enforceable legal notices to banks, intermediaries, and regulatory bodies.
- **Decision**: Avoid generative hallucinations for statutory timelines. Clocks are derived strictly from published RBI master circulars and IT Rules 2021. AI model formats user-provided values only.

### Log Entry 03: PII Redaction Before Model Invocation
- **Prompt / Intent**: Protect citizen sensitive credentials (Aadhaar, PAN, UPI, Card numbers).
- **Decision**: Created lightweight client/server pure TypeScript regex & Luhn validator (`redact.ts`) to redact PII prior to calling external multimodal models (GPT-4o / Whisper).
