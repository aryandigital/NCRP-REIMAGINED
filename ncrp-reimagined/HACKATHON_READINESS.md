# Hackathon Readiness

Audit date: 5 September 2026. Status: **verified local fictional-data demo, with release concerns**. A ranking cannot be guaranteed.

## Product Decision

Lead with one coherent story: call screening -> grounded warning -> factual confirmation -> draft brief -> user-controlled next step. The distinguishing feature is the separation of observed text, reported facts, and advisory interpretation, not a claim of automatic police integration.

Do not add more integrations before rehearsing this journey. Avoid an artificial login screen that implies security the backend does not enforce.

## Fixed Blind Spots

| Area | Change |
| --- | --- |
| Brief truthfulness | Unknown answers remain unknown. Danger leads the emergency script. No invented caller identity. |
| Evidence integrity | Server re-assesses instead of trusting client conclusions. Grounded quotes are separate from explanations. |
| Detection | Added benign/negated counterexamples, Hindi indicators, duplicate-marker checks, validated model output and safe fallback. |
| Capture lifecycle | Preserve text across recognition restarts; reject late callbacks; stop timers/audio; freeze screening end before confirmation; text fallback on microphone failure. |
| Mobile | Fixed bottom action bar with reserved space, associated inputs, selected button states, limited transcript height, no obstructing chat on Shield. |
| Translation | DOM translation no longer overwrites live operational state. Partial language coverage is disclosed. |
| Intake privacy | Private images cannot cross into an upload. Screenshot analysis is explicitly unavailable. Session-only drafts and clear control replace indefinite local storage. |
| Credential handling | Filter labelled credentials across text/provider/storage boundaries; bound bodies and fields; sanitize provider errors. Filtering is not anonymisation. |
| Continuity | Stored facts drive the action board; reviewed corrections rebuild the canonical brief and exports. |
| Tracking | Looks up the exact Raksha case ID, with normalized input and inline errors. No implied official tracking. |
| Simulation | Fresh editable copies; immutable golden fixture; simulated preparation explicitly not submitted or acknowledged by institutions. |
| Recovery | Conditional source-linked guidance replaces fabricated legal countdowns and reimbursement guarantees. |
| Content guidance | Removed unsupported blocking, takedown, appeal and hash-handoff claims; links to official specialist services. |
| Demo calling | Consent, synthetic-case requirement, exact allowlist, timeouts, process-local cooldown/idempotency, and request-accepted wording rather than delivered. |
| Storage | Full-entropy case IDs, in-process serialized updates, atomic local file replacement. These are not authorization or multi-instance transactions. |
| Development | Local launcher handles inherited-key shadowing. Configuration check prints presence only, never credentials. |

## Verification Evidence

- `npm test`: **81 passing regression tests**. Tests use isolated temporary storage and mocked providers; this is not an accuracy benchmark.
- `npm run lint`: passed.
- `npm run build`: passed, including TypeScript and route generation.
- `node scripts/qa-browser.mjs`: passed against an isolated production server with paid providers disabled.
- Ten routes loaded at both 375px and 1440px without horizontal overflow: home, intake, atlas, tracking, operator, Shield, example analysis, action, report and recovery.
- Browser interactions verified recognition restart continuity, optional-answer preservation, screening end time, report/back navigation, simulation completion, danger routing, and microphone-error text fallback.
- All six MP3 assets returned successfully. Playback lifecycle was mocked; audio intelligibility and real browser speech recognition were not established by this smoke test.
- No browser runtime errors during the scripted checks. No real telephone or emergency calls were placed.
- Screenshots from the successful run: `C:\Users\dev\AppData\Local\Temp\opencode\raksha-browser-G5Lm8V`.

The browser checks found a real overlapping sticky-control issue and verified its fixed-bottom-bar replacement. They also exposed test-runner assumptions about cached responses and uppercase text; those harness checks were corrected rather than treated as product failures.

## Remaining Gates

Local configuration presence check: OpenAI key and both Vapi resource IDs are configured; `VAPI_PRIVATE_KEY`, `ALERT_ALLOWLIST`, `DATABASE_URL`, and `SARVAM_API_KEY` are missing. `DEMO_MODE` is enabled. Presence does not establish credential validity or correct resource ownership. The inherited OpenAI key still differs from the local key; the development launcher handles that precedence explicitly.

1. **Credential rotation:** replace any credentials previously exposed in chat. Repository changes cannot revoke provider keys.
2. **Vapi setup:** provide the private key and permitted recipient list, verify assistant/phone resource IDs, configure the dashboard assistant, and test one consenting recipient. An accepted call request is not delivery evidence.
3. **Hosted rehearsal:** verify HTTPS, provider configuration, persistent database storage and a fresh browser/session on the actual submitted URL. This audit did not deploy anything.
4. **Real-data security:** implement authentication/session ownership on every case page/API/export/alert, rate limits across instances, retention/deletion and a reviewed consent flow. Current IDs are not access control. Until then, fictional data only and no publicly exposed paid calling endpoint.
5. **Storage reliability:** local locks/cooldowns are process-local. Durable multi-instance transactions, retries, save idempotency and the two-step incident/brief write still need work before a pilot.
6. **Evaluation:** create a separately labelled holdout corpus with benign calls, scams, accents and languages. Report measured false positives/negatives and latency, not test-count-as-accuracy or model confidence as probability.
7. **Presentation:** record the actual hosted flow and retain a backup video. Demonstrate one scam, one benign safety message, and one provider-offline fallback. Do not claim the scripted simulation measures speech recognition.

## Rehearsal Script

1. State the victim problem: coercive calls make it difficult to decide what to do and recount facts under stress.
2. Open Call Shield from the homepage and play the fictional call. Show a quoted warning and a short exit phrase.
3. Stop screening. Leave a field unanswered and show that the brief preserves uncertainty.
4. Demonstrate danger taking priority over financial loss. Point to the official channel link without dialing it.
5. Correct a reported detail and show the same correction in the brief and export.
6. Close with the boundary: Raksha prepares the next step; it does not impersonate authorities or pretend a report was submitted.

Check all statistics against their primary source. The old plan's figures imply about 0.32% for 167 / 52,969, not 2%; about 2.18% uses 7,647 as the denominator. Do not reuse that claim without verifying the figures and denominator.

## Correction To Prior Conversation

The earlier statement that everything worked was too broad: it established selected happy-path HTTP responses and a build, not full platform safety or browser behavior. Empty `OPENAI_MODEL` and an invalid inherited API key were separate issues; an invalid key produced the observed 401. This audit supplies regression and browser evidence, and explicitly retains the unverified release gates above.
