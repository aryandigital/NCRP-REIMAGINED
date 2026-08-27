# Raksha capability audit

Verified locally on August 27, 2026 after authentication, authorization, mobile-layout, and deployment-readiness fixes.

| Planned capability | Status | Verification / note |
| --- | --- | --- |
| Financial-fraud journey | Working | Intake → analysis → action board → report → recovery verified with `DEMO0001` and a fresh incident (`INC…`) created through `/api/analyze`. |
| Emergency 1930 escalation | Working | Visible in the global spectrum emergency bar and money-loss action flow; tel:1930 link. |
| English, Hindi, Hinglish text intake | Working | Intake accepts free-form text. |
| Six-language site interface | Working | English, Hindi, Tamil, Telugu, Bengali, Marathi. Homepage/header/emergency bar are React dictionaries (`src/data/homeCopy.ts`); operational routes are covered by the DOM translation layer (`SiteLanguageLayer`) which re-applies after client-side renders via MutationObserver. `?lang=xx` deep links work. Verified visually with `?lang=hi` and `?lang=ta`. |
| Six-language conversation assistance | Working | Raksha Samvaad supports all six languages for text/voice prompts; the assistant defaults to the visitor's chosen site language. |
| Voice path | Working, browser-dependent | Browser speech recognition fills an editable transcript at intake (all six locales selectable) and inside Samvaad. Typing remains available when unsupported. |
| Read-aloud / low-vision access | Working, browser-dependent | Persistent accessibility dock offers page read-aloud (locale-aware for all six languages), larger text, and higher contrast. |
| Assistant discoverability | Working | Persistent assistant control; the greeting bubble is suppressed on narrow screens so it cannot cover primary actions. |
| Screenshot input | Working | Screenshot upload accepted at intake (8 MB cap). |
| Screenshot extraction | Working with credentials | Vision analysis runs when `OPENAI_API_KEY` is set in `.env.local`; otherwise local pattern matching takes over. |
| Confirmable, editable fact graph | Working | Extracted facts expose source/confidence and may be edited before confirmation. |
| Missing-information capture | Working | Report preparation captures amount, bank/wallet, and an editable incident description. |
| Three recipient-specific packets | Working | NCRP, bank, and police packets are created from the incident record; statuses render as clean labels (acknowledged / submitted). |
| Routing and acknowledgements | Working | Stable reference (ack number), packet statuses, and events visible in recovery. |
| Pattern warning and next-move advice | Working | Local pattern matcher and advisory corpus drive warnings. |
| Operator console | Working | `/operator` shows provenance, packets, routing events, and linked cluster context. |
| Redacted case export | Working | Recovery produces a redacted JSON bundle (`/api/incidents/[id]?format=bundle`). |
| Sample-data boundary | Working | Public UI and packet flow state that this environment runs on sample data and transmits nothing to institutions. No "prototype/demo/mock" wording remains in user-visible copy. |
| Mobile responsive layout | Working | Checked at 375 × 812 with no horizontal overflow, including the operator table. |
| Real government/bank/platform integration | Intentionally not implemented | All adapters are environment-local. |
| Production environment | Requires deployment configuration | `SESSION_SECRET` and `DATABASE_URL` must be configured in Vercel. Provider keys are optional and belong only in environment variables. |

## Visual and accessibility additions

- Original identity: jharokha arch grammar, custom SVG icon set and BrandMark (`src/components/icons.tsx`), Night Durbar dark theme, hero artwork `public/illustrations/raksha-arch-hero.png` (gpt-image-1-mini).
- Typography: Fraunces (Latin) + Tiro Devanagari Hindi display pairing; Geist Sans/Mono for UI and reference text.
- Persistent Raksha Samvaad voice/text assistant with greeting bubble.
- Six-language site layer, verified interactively (dropdown and `?lang=` deep links) across homepage, /check, /atlas, /track in Hindi and Tamil.
- Keyboard skip link, visible focus states, screen-reader labels, read-aloud, large text, and high-contrast controls.
