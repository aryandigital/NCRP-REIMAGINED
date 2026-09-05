# Raksha

Independent cyber-safety hackathon prototype: suspicious call or message -> explainable warning -> optional factual confirmation -> draft brief -> user-chosen official help.

**Fictional data only.** Not a government service. No complaint, bank hold, police alert, platform report, or takedown is submitted. Never call 112 or 1930 to test the demo.

## Run

Requires Node.js 22+ and the existing dependencies. Configure optional credentials in `.env.local`, never in chat or source control.

```sh
npm run dev
npm test
npm run check:setup
npm run lint
npm run build
```

`npm run dev` explicitly prefers `.env.local` over inherited environment variables. This prevents a stale system-level OpenAI key from silently overriding the local key. Production keeps deployment-managed environment settings. An empty `OPENAI_MODEL` falls back to `gpt-4o-mini`.

Windows PowerShell with script execution disabled:

```powershell
& "C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev
```

## Judge Walkthrough

1. Open `/shield` and select **Simulate a scam call**. Synthetic audio plays alongside directly supplied fictional transcript text. This demonstrates screening, not speech-recognition accuracy.
2. Watch the warning and quoted evidence appear. Keyword fallback works without provider keys. Optional OpenAI assessment uses bounded, validated responses and a six-second fallback.
3. Select **Stop screening & get help**. Answer only what is known; skipped answers stay unknown. Demo identity and contact fields must remain fictional.
4. Prepare the draft. Confirm danger takes priority over financial loss, and that quotes are separate from interpretation. Copy or download the brief; nothing is sent automatically.
5. Open report preparation, edit facts, and return to the action board. Corrections carry into the brief. Track using the **Raksha case ID**, not an official acknowledgement number.
6. Optionally open the read-only `DEMO0001` example and create your own editable synthetic copy. Judges do not overwrite the shared fixture.

The UI also supports text screening when microphone access fails. Browser speech recognition requires browser support and may send audio to the browser's speech provider. Raksha cannot join or end an existing telephone call; speaker-based rehearsal requires a separate device.

## Capability Boundaries

- Text analysis, synthetic-call playback, factual review, draft exports, conditional recovery guidance, and local private-image fingerprinting are implemented.
- Screenshot analysis is intentionally unavailable: raw images cannot be safely credential-filtered by this prototype. Type the relevant fictional text instead. Private images never enter the analysis upload path.
- Scores are heuristic indicators, not calibrated probabilities. Absence of a match never proves safety. Regex filtering is not anonymisation.
- Exports contain personal details if entered. Review before sharing. Browser drafts are session-only and can be cleared.
- Recovery guidance is conditional, not an authoritative legal deadline calculator or a guarantee of reimbursement.
- The corpus covers six pattern families. The homepage has six language variants; operational flows are not represented as fully translated. Hindi/Hinglish/English screening support is heuristic and needs broader evaluation.

## Optional Demo Call

Set `DEMO_MODE=true`, `VAPI_PRIVATE_KEY`, `VAPI_ASSISTANT_ID`, `VAPI_PHONE_NUMBER_ID`, and comma-separated E.164 `ALERT_ALLOWLIST` destinations. A synthetic case and explicit consent are required. The provider and the person answering may receive the fictional brief. This places a real call to the allowlisted recipient, **not** to police, banks, 112, or 1930.

Success means **call request accepted**, not delivered, answered, or acted upon. Timeouts and retry guards reduce duplicate calls; no delivery webhook or multi-instance exactly-once guarantee is implemented. Missing configuration gives a fallback to manual sharing.

## Verification

`npm test` runs isolated regression tests for detection, tri-state routing, credential filtering, intake privacy, provider failures, storage concurrency, simulation boundaries, and report/brief consistency. Provider calls are mocked; tests do not place calls or require credentials.

Browser smoke checks are in `scripts/qa-browser.mjs` (requires the existing sibling `docs/node_modules/puppeteer-core` and installed Edge, not an application dependency). Run after the production build; it starts an isolated local instance with provider keys disabled and stores screenshots in the approved temporary directory.

See [HACKATHON_READINESS.md](HACKATHON_READINESS.md) for the audit, verification evidence, and release blockers.

## Before Public Use

Authentication and per-case ownership are not implemented. Random case IDs are not authorization. Do not collect real victim data or expose paid integrations publicly. Add ownership checks, durable database transactions, distributed rate limits, retention/deletion, and consent review before a real pilot. Temporary file storage is local-demo storage, not reliable serverless persistence.

Rotate any credential previously disclosed in chat. A successful build does not verify provider configuration, deployment persistence, or real-world detection accuracy.
