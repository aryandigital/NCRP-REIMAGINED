# Codex build log

## August 24, 2026

### Design and UI

- Replaced the generic marketing/card-grid homepage with a civic-response command-center layout.
- Added a shared service masthead, emergency strip, stage rail, threat bulletin, response triage, and prototype boundary copy.
- Reworked intake, analysis, action, packet preparation, recovery, tracking, and atlas screens around the same system.
- Added mobile-visible intake labels, 44px controls, keyboard focus states, reduced-motion CSS, and local image fingerprinting UI.
- Reframed the public experience with an India-first civic-tech visual direction: a multilingual language switcher, a custom "signal loom" illustration, warm civic gradients, and an expanded Raksha Samvaad agent surface.
- Removed the Quick Exit control at the product owner's request.
- Rebuilt the visual system around a continuous blue-to-orange spectrum, frosted rounded portal surfaces, and an original repeated-circle mandala asset at `public/illustrations/raksha-mandala-hero-v1.png`.
- Added persistent accessibility tools: keyboard skip link, read-aloud, larger text, and high-contrast mode.

### Product flow

- Added confirmable extracted facts with source and confidence metadata.
- Added editable fact values, browser voice transcription with English/Hindi language selection, and local intake draft autosave.
- Added persistent completed-action updates.
- Added stable acknowledgement numbers.
- Added mock NCRP, bank, and police packet creation with routing events.
- Added a redacted JSON case-bundle download and a synthetic operator console for provenance, packet minimisation, routing, and cluster review.
- Added an incident API route for loading and updating the demo record.
- Added `/api/agent` with a safe local multilingual fallback and configurable Sarvam API integration through `SARVAM_API_KEY` only.
- Made Raksha Samvaad persistent across the site, with text, browser voice input, read-aloud, and six Indian conversation-language choices.

### Persistence

- Replaced the single in-memory incident implementation with Drizzle/Neon persistence when `DATABASE_URL` is configured.
- Kept a memory fallback so the demo works without credentials.
- Added `drizzle.config.ts`, `src/lib/db/schema.ts`, and `.env.example`.

### Verification

- `npm run lint` passes.
- `npm run build` passes.
- Browser QA passes for the homepage, intake, analysis, action, report, recovery, tracking, atlas, and operator routes.
- Verified 390px mobile layout with no horizontal overflow and 44px minimum intake controls.
- Verified stable `NCRPDEMO0001`, three mock packets, zero missing facts after submission, redacted bundle download, and clean browser console on repeated submission.
- Verified language selection, multilingual emergency copy, agent interaction fallback, Quick Exit removal, and mobile no-overflow on the updated homepage.
- Verified all application routes return `200`, English/Hindi public-route coverage, assistant controls, accessibility controls, generated hero asset rendering, and no console errors.
- `npm audit --omit=dev` previously reported zero vulnerabilities.

### Known limitations

- The OpenAI key must be revoked and replaced by the user before configuring `.env.local` or Vercel.
- Any Sarvam key pasted in chat must also be revoked and replaced before being added only to `.env.local`.
- Neon migrations still need to be applied in the deployment environment.
- The private-image fingerprint is a prototype perceptual hash and is not a StopNCII-compatible submission format.
- Real institutional integrations remain mocked and clearly labelled.
