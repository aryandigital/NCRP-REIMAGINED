import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { NextRequest } from "next/server";
import { assessLocal, assessWithAI, shieldTranscriptWindow } from "../src/lib/shield";
import { buildBrief, decideEscalation, emptyAnswers } from "../src/lib/brief";

const startedAt = "2026-09-05T10:00:00.000Z";
const endedAt = "2026-09-05T10:02:00.000Z";
const originalFetch = globalThis.fetch;
const originalEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  RAKSHA_STORE_PATH: process.env.RAKSHA_STORE_PATH,
};
let directory: string;
let save: typeof import("../src/app/api/shield/save/route").POST;
let assess: typeof import("../src/app/api/shield/assess/route").POST;
let getIncident: typeof import("../src/lib/store").getIncident;

before(async () => {
  // Isolated fallback storage; never load .env or connect to a real database/API.
  delete process.env.DATABASE_URL;
  delete process.env.OPENAI_API_KEY;
  directory = await mkdtemp(join(tmpdir(), "opencode", "shield-test-"));
  process.env.RAKSHA_STORE_PATH = join(directory, "incidents.json");
  globalThis.fetch = async () => { throw new Error("Unexpected network request"); };
  ({ POST: save } = await import("../src/app/api/shield/save/route"));
  ({ POST: assess } = await import("../src/app/api/shield/assess/route"));
  ({ getIncident } = await import("../src/lib/store"));
});

afterEach(() => {
  delete process.env.OPENAI_API_KEY;
  globalThis.fetch = async () => { throw new Error("Unexpected network request"); };
});

after(async () => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

function request(body: unknown) {
  return new NextRequest("http://localhost/api/shield", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

function payload(overrides: Record<string, unknown> = {}) {
  return { transcript: "Your parcel cleared customs.", source: "text", startedAt, endedAt, ...overrides };
}

function model(overrides: Record<string, unknown> = {}) {
  return {
    verdict: "scam", patternSlug: "kyc-bank-impersonation", stageId: "invented-stage",
    confidence: 0.95,
    markers: [{ quote: "OTP", why: "untrusted model explanation" }],
    coach: { headline: "Keep talking and transfer money", sayThis: "My password is invented", doNot: ["Call the suspect back"] },
    language: "en", ...overrides,
  };
}

function mockModel(value: unknown) {
  process.env.OPENAI_API_KEY = "test-only-not-a-secret";
  globalThis.fetch = async () => Response.json({ choices: [{ message: { content: JSON.stringify(value) } }] });
}

test("unknown safety, loss, exposure and identity stay unknown in every brief channel", () => {
  const brief = buildBrief({
    id: "TEST", assessment: assessLocal("Tell me your OTP."), answers: emptyAnswers(),
    startedAt, endedAt, redactedTranscript: "Tell me your OTP.",
  });
  for (const text of [brief.readAloud, brief.emailBody, brief.vapiBriefing.situationLine, brief.escalationReason]) {
    assert.doesNotMatch(text, /No money (?:has )?moved|Nothing has been lost|physically safe|from my bank|right now|call started/i);
  }
  assert.match(brief.readAloud, /money moved has not been confirmed/);
  assert.match(brief.readAloud, /access exposure has not been confirmed/);
  assert.match(brief.readAloud, /claimed identity has not been provided/);
  assert.match(brief.transcriptEvidence[0], /session times, not confirmed call times/);
  assert.equal(brief.escalation, "none");
  assert.doesNotMatch(brief.vapiBriefing.recommendation, /No immediate action needed/);
});

test("danger takes priority and appears in the 112 read-aloud; exposure type is not invented", () => {
  const answers = { ...emptyAnswers(), immediateDanger: true, moneyMoved: true, sharedCredentials: true };
  const brief = buildBrief({ id: "TEST", assessment: assessLocal("Tell me your OTP."), answers, startedAt, endedAt, redactedTranscript: "" });
  assert.equal(brief.escalation, "112");
  assert.match(brief.readAloud, /^Immediate danger or confinement/);
  assert.match(brief.vapiBriefing.fullReadAloud, /Emergency help is needed/);
  assert.doesNotMatch(brief.readAloud, /I did share an OTP|install an app during the call/);
  assert.match(brief.readAloud, /specific type has not been confirmed/);
  assert.equal(decideEscalation({ ...answers, immediateDanger: false }).escalation, "1930");
});

test("explicit negatives remain negatives and reporting for someone else invents no relationship", () => {
  const answers = { ...emptyAnswers(), immediateDanger: false, moneyMoved: false, sharedCredentials: false, reportingForSomeoneElse: true };
  const brief = buildBrief({ id: "TEST", assessment: assessLocal("Hello there"), answers, startedAt, endedAt, source: "text", redactedTranscript: "Hello there" });
  assert.match(brief.readAloud, /No money has moved/);
  assert.match(brief.readAloud, /No credential or device access exposure/);
  assert.match(brief.readAloud, /Text screening/);
  assert.doesNotMatch(brief.emailBody, /family member|receiving.*right now|Probable scam/);
  assert.doesNotMatch(decideEscalation({ ...emptyAnswers(), callerNumber: "9876543210" }).reason, /\bsafe\b|No money moved/);
});

test("brief separates quotes from interpretation and labels filtering and heuristic strength honestly", () => {
  const assessment = assessLocal("Tell me your OTP.");
  const brief = buildBrief({ id: "TEST", assessment, answers: emptyAnswers(), startedAt, endedAt, redactedTranscript: "Tell me your OTP." });
  assert.deepEqual(brief.transcriptEvidence.slice(1), assessment.markers.map((m) => `Transcript contains: "${m.quote}"`));
  for (const marker of assessment.markers) {
    assert.ok(!brief.transcriptEvidence.join("\n").includes(marker.why));
    assert.ok(brief.aiAssessment.join("\n").includes(marker.why));
  }
  assert.match(brief.aiAssessment.join("\n"), /heuristic strength 25\/100, not a calibrated probability/);
  assert.match(brief.emailBody, /Recognised identifiers\/labelled credentials filtered, not anonymised/);
  assert.doesNotMatch(brief.emailBody, /victim PII redacted|suspect identifiers retained|confidence \d+%/);
});

test("brief duration uses actual seconds, including zero and subsecond sessions", () => {
  for (const seconds of [0, 0.25, 15, 120]) {
    const brief = buildBrief({
      id: "TEST", assessment: assessLocal("Hello there"), answers: emptyAnswers(), startedAt,
      endedAt: new Date(Date.parse(startedAt) + seconds * 1000).toISOString(), redactedTranscript: "Hello there",
    });
    assert.ok(brief.transcriptEvidence[0].includes(`(${seconds} seconds)`));
    assert.doesNotMatch(brief.transcriptEvidence[0], /~|\d+ min/);
  }
});

test("neutral topics, credential safety advice and substring collisions are not scams", () => {
  for (const transcript of [
    "Never share OTP or CVV", "Do not share your OTP or PIN.", "Don't install AnyDesk.", "Don't tell anyone your OTP.",
    "Your parcel cleared customs.", "The courier delivered the parcel.", "We have a KYC appointment.",
    "Please send the shipping information.", "अपना ओटीपी या पिन किसी को मत बताएं।",
    "ओटीपी साझा न करें।", "OTP share mat karo.",
  ]) {
    const a = assessLocal(transcript);
    assert.equal(a.verdict, "listening", transcript);
    assert.equal(a.patternSlug, null);
    assert.equal(a.markers.length, 0);
  }
});

test("English, Hinglish and Hindi coercive requests retain grounded markers", () => {
  for (const transcript of [
    "Tell me your OTP. Install AnyDesk now.",
    "You are under digital arrest. Transfer your money to a safe account.",
    "Aap digital arrest mein hai. Kisi ko mat batana.",
    "आपको डिजिटल अरेस्ट किया गया है। किसी को मत बताना।",
    "अपना ओटीपी बताइए। खाता बंद हो जाएगा।",
  ]) {
    const a = assessLocal(transcript);
    assert.equal(a.verdict, "scam", transcript);
    assert.ok(a.confidence <= 0.7);
    assert.ok(a.markers.every((m) => transcript.includes(m.quote)));
    assert.ok(!a.coach.sayThis.includes("Give me your name"));
  }
  const hi = assessLocal("अपना ओटीपी बताइए।");
  assert.equal(hi.language, "hi");
  assert.match(hi.coach.headline, /[\u0900-\u097f]/);
  assert.equal(assessLocal("Never share OTP. But tell me your OTP now.").verdict, "suspicious");
});

test("model duplicate and overlapping markers cannot inflate a single signal to scam", async () => {
  const transcript = "Please tell me your OTP now.";
  mockModel(model({ markers: [
    { quote: "OTP", why: "one" }, { quote: "OTP", why: "duplicate" },
    { quote: "tell me your OTP", why: "overlap" }, { quote: "not in transcript", why: "invented" },
  ] }));
  const a = await assessWithAI(transcript);
  assert.equal(a.verdict, "suspicious");
  assert.equal(a.markers.length, 1);
  assert.equal(a.stageId, null);
  assert.doesNotMatch(JSON.stringify(a), /invented|transfer money|Keep talking|untrusted/);
  assert.match(a.coach.sayThis, /ending/);
  mockModel(model({ markers: [{ quote: "share OTP", why: "one" }, { quote: "OTP and CVV", why: "overlap" }] }));
  const overlapping = await assessWithAI("Please share OTP and CVV now.");
  assert.equal(overlapping.verdict, "suspicious");
  assert.equal(overlapping.markers.length, 1);
});

test("model cannot turn safety advice or normal customs updates into a scam", async () => {
  for (const [transcript, patternSlug, quotes] of [
    ["Never share your OTP or CVV with anyone.", "kyc-bank-impersonation", ["OTP", "CVV"]],
    ["Your parcel cleared customs today.", "digital-arrest", ["parcel", "customs"]],
    ["Never share your OTP or CVV with anyone.", "kyc-bank-impersonation", ["Never share your OTP or CVV with anyone."]],
    ["Your parcel cleared customs today.", "digital-arrest", ["Your parcel cleared customs today."]],
  ] as const) {
    mockModel(model({ patternSlug, markers: quotes.map((quote) => ({ quote, why: "alleged risk" })) }));
    const a = await assessWithAI(transcript);
    assert.equal(a.verdict, "listening");
    assert.equal(a.patternSlug, null);
    assert.equal(a.confidence, 0);
    assert.doesNotMatch(a.coach.headline, /End|Keep talking/);
  }
});

test("two grounded model signals work; model language, stage and coaching are not trusted", async () => {
  const transcript = "Tell me your OTP. Install AnyDesk now.";
  mockModel(model({ language: "hi", markers: [
    { quote: "OTP", why: "fabricated identity" }, { quote: "AnyDesk", why: "fabricated identity" },
  ] }));
  const a = await assessWithAI(transcript);
  assert.equal(a.verdict, "scam");
  assert.equal(a.method, "model");
  assert.equal(a.markers.length, 2);
  assert.equal(a.language, "en");
  assert.equal(a.stageId, null);
  assert.doesNotMatch(JSON.stringify(a), /fabricated identity|Keep talking|My password/);
});

test("malformed model responses and transport failures fall back with status-only diagnostics", async () => {
  const errors: unknown[][] = [];
  const originalError = console.error;
  console.error = (...args) => { errors.push(args); };
  try {
    const transcript = "Tell me your OTP. Install AnyDesk now.";
    for (const response of [model({ confidence: "high" }), model({ markers: null }), model({ patternSlug: "unknown-pattern" })]) {
      mockModel(response);
      assert.deepEqual(await assessWithAI(transcript), assessLocal(transcript));
    }
    globalThis.fetch = async () => new Response("DO_NOT_LOG_RESPONSE_BODY", { status: 429 });
    assert.deepEqual(await assessWithAI(transcript), assessLocal(transcript));
    globalThis.fetch = async () => { throw new Error("DO_NOT_LOG_EXCEPTION_FRAGMENT"); };
    assert.deepEqual(await assessWithAI(transcript), assessLocal(transcript));
    assert.doesNotMatch(JSON.stringify(errors), /DO_NOT_LOG/);
    assert.ok(errors.some((args) => args.includes(429)));
  } finally { console.error = originalError; }
});

test("both endpoints reject invalid JSON shapes, blank transcripts and oversized bodies", async () => {
  for (const route of [save, assess]) {
    for (const body of [null, [], "text", {}, { transcript: 123 }, payload({ transcript: " " }), payload({ transcript: "x".repeat(24_001) }), payload({ extra: "x".repeat(128_001) })]) {
      assert.equal((await route(request(body))).status, 400);
    }
    const invalidJson = new NextRequest("http://localhost/api/shield", { method: "POST", body: "{" });
    assert.equal((await route(invalidJson)).status, 400);
  }
  assert.equal((await assess(request({ transcript: "Hello there", mode: "unknown" }))).status, 400);
});

test("save validates source, booleans, bounded fields and real ordered dates without coercion", async () => {
  for (const overrides of [
    { source: undefined }, { source: "uploaded" }, { startedAt: "yesterday" }, { endedAt: "2026-02-30T10:00:00Z" },
    { endedAt: "2026-09-05T09:00:00Z" }, { answers: null }, { answers: [] },
    { answers: { moneyMoved: "false" } }, { answers: { immediateDanger: 1 } },
    { answers: { sharedCredentials: "true" } }, { answers: { reportingForSomeoneElse: "false" } },
    { answers: { amountInr: "123" } }, { answers: { amountInr: -1 } }, { answers: { amountInr: 1e15 } },
    { answers: { paidAt: "2026-02-30T10:00:00Z" } }, { answers: { callerClaims: "x".repeat(301) } },
  ]) assert.equal((await save(request(payload(overrides)))).status, 400, JSON.stringify(overrides));
});

test("save ignores forged assessments, strips unknown fields and preserves null vs false", async () => {
  const res = await save(request(payload({
    assessment: model({ patternSlug: "digital-arrest", markers: [{ quote: "FORGED", why: "FORGED" }] }),
    arbitrary: "DROP_ME", answers: { moneyMoved: false, extra: "DROP_ME", otpValue: "DROP_ME" },
  })));
  assert.equal(res.status, 200);
  const { id } = await res.json();
  const incident = await getIncident(id);
  assert.ok(incident?.shield);
  assert.equal(incident.shield.assessment.verdict, "listening");
  assert.equal(incident.shield.answers?.immediateDanger, null);
  assert.equal(incident.shield.answers?.moneyMoved, false);
  assert.deepEqual(incident.answers, { paid: false });
  assert.equal(incident.occurredAt, null);
  assert.doesNotMatch(JSON.stringify(incident), /FORGED|DROP_ME|call_started_at|first_contact_channel/);
  assert.ok(incident.missingFacts.includes("immediate danger"));
});

test("save reassesses semantic evidence on the server even when the local scorer misses it", async () => {
  const quotes = [
    "For this enquiry, move your balance into the holding ledger we nominate.",
    "Keep this conversation strictly between us until the review is complete.",
  ];
  const transcript = quotes.join(" ");
  assert.equal(assessLocal(transcript).verdict, "listening");
  mockModel(model({ patternSlug: "digital-arrest", markers: quotes.map((quote) => ({ quote, why: "UNTRUSTED_MODEL_PROSE" })) }));
  const fetchModel = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (url, init) => {
    requests.push(String(init?.body));
    return fetchModel(url, init);
  };
  const liveRes = await assess(request({ transcript }));
  assert.equal(liveRes.status, 200);
  const live = await liveRes.json();
  assert.equal(live.assessment.verdict, "scam");
  assert.equal(live.assessment.method, "model");
  const savedRes = await save(request(payload({ transcript, assessment: { verdict: "listening", patternName: "FORGED_CLIENT_PATTERN" } })));
  assert.equal(savedRes.status, 200);
  const incident = await getIncident((await savedRes.json()).id);
  assert.ok(incident?.shield?.brief);
  assert.deepEqual(incident.shield.assessment, live.assessment);
  assert.deepEqual(incident.shield.assessment.markers.map((m) => m.quote), quotes);
  assert.equal(incident.dna?.risk, "high");
  assert.match(incident.shield.brief.readAloud, /possible Digital arrest pattern/);
  assert.match(incident.shield.brief.aiAssessment.join("\n"), /AI \(structured output\)/);
  assert.equal(requests.length, 2);
  assert.ok(requests.every((body) => body.includes(transcript)));
  assert.doesNotMatch(JSON.stringify(incident), /FORGED_CLIENT_PATTERN|UNTRUSTED_MODEL_PROSE/);
  assert.doesNotMatch(requests.join("\n"), /FORGED_CLIENT_PATTERN/);
});

test("save falls back locally if the server model request fails", async () => {
  const transcript = "Tell me your OTP. Install AnyDesk now.";
  process.env.OPENAI_API_KEY = "test-only-not-a-secret";
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response("DO_NOT_LOG_PROVIDER_BODY", { status: 503 });
  };
  const originalError = console.error;
  const errors: unknown[][] = [];
  console.error = (...args) => { errors.push(args); };
  try {
    const res = await save(request(payload({ transcript })));
    assert.equal(res.status, 200);
    const incident = await getIncident((await res.json()).id);
    assert.deepEqual(incident?.shield?.assessment, assessLocal(transcript));
    assert.equal(calls, 1);
    assert.doesNotMatch(JSON.stringify(errors), /DO_NOT_LOG_PROVIDER_BODY/);
  } finally { console.error = originalError; }
});

test("save enforces the model's six-second abort deadline and keeps the local fallback", async (t) => {
  const transcript = "Tell me your OTP. Install AnyDesk now.";
  process.env.OPENAI_API_KEY = "test-only-not-a-secret";
  const nativeTimeout = globalThis.setTimeout;
  const deadlines: number[] = [];
  t.mock.method(globalThis, "setTimeout", (callback: () => void, delay: number) => {
    deadlines.push(delay);
    return nativeTimeout(callback, 5);
  });
  t.mock.method(console, "error", () => {});
  globalThis.fetch = async (_url, init) => new Promise<Response>((_resolve, reject) => {
    const signal = init?.signal;
    assert.ok(signal);
    if (signal.aborted) reject(signal.reason);
    else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
  });
  const res = await save(request(payload({ transcript })));
  assert.equal(res.status, 200);
  const incident = await getIncident((await res.json()).id);
  assert.deepEqual(incident?.shield?.assessment, assessLocal(transcript));
  assert.deepEqual(deadlines, [6000]);
});

test("all three sources persist with correct origin and syntheticOnly", async () => {
  for (const source of ["mic", "simulation", "text"] as const) {
    const res = await save(request(payload({ source })));
    assert.equal(res.status, 200);
    const { id } = await res.json();
    const incident = await getIncident(id);
    assert.ok(incident?.shield?.brief);
    assert.equal((incident.shield as typeof incident.shield & { source: string }).source, source);
    assert.equal(incident.origin, source === "simulation" ? "demo" : "call-shield");
    assert.equal(incident.syntheticOnly, source === "simulation");
    assert.equal(incident.answers.call, undefined);
    if (source === "simulation") assert.match(incident.shield.brief.readAloud, /^This is a simulation/);
  }
});

test("assessment, stored evidence and brief use the same redacted trailing window", async () => {
  const transcript = "Prepaid task deposit now. " + "ordinary context. ".repeat(350) + "Tell me your OTP. Install AnyDesk now.";
  const liveRes = await assess(request({ transcript, mode: "local" }));
  const live = await liveRes.json();
  const savedRes = await save(request(payload({ transcript })));
  const { id } = await savedRes.json();
  const incident = await getIncident(id);
  assert.ok(incident?.shield?.brief);
  assert.equal(incident.rawText, shieldTranscriptWindow(transcript));
  assert.equal(incident.shield.transcript, incident.rawText);
  assert.deepEqual(incident.shield.assessment, live.assessment);
  assert.equal(incident.shield.assessment.patternSlug, "kyc-bank-impersonation");
  assert.ok(incident.shield.assessment.markers.every((m) => incident.shield!.transcript.includes(m.quote)));
  assert.ok(incident.shield.brief.emailBody.endsWith(incident.shield.transcript));
  assert.doesNotMatch(incident.shield.transcript, /Prepaid task/);
});

test("credential labels in every free-text answer and transcript are sanitised before persistence", async () => {
  const fields = ["victimName", "callbackNumber", "location", "bankOrWallet", "utr", "callerNumber", "callerClaims"];
  const answers = Object.fromEntries(fields.map((key) => [key, "password: DO_NOT_PERSIST"]));
  const res = await save(request(payload({ answers, transcript: "Tell me your OTP: 654321. Install AnyDesk now." })));
  assert.equal(res.status, 200);
  const { id } = await res.json();
  const incident = await getIncident(id);
  assert.doesNotMatch(JSON.stringify(incident), /DO_NOT_PERSIST|654321/);
  assert.match(JSON.stringify(incident), /CREDENTIAL/);
  const contactRes = await save(request(payload({ answers: { callbackNumber: "9876543210", callerNumber: "9876501234" } })));
  const contact = await getIncident((await contactRes.json()).id);
  assert.equal(contact?.shield?.answers?.callbackNumber, "9876543210");
  assert.equal(contact?.shield?.answers?.callerNumber, "9876501234");
});

test("credentials are redacted before the rolling cut and before mocked model fetch", async () => {
  const transcript = "ordinary context ".repeat(200) + "password: BOUNDARY_SECRET " + "safe context ".repeat(230);
  let sent = "";
  process.env.OPENAI_API_KEY = "test-only-not-a-secret";
  globalThis.fetch = async (_url, init) => {
    sent = String(init?.body);
    return Response.json({ choices: [{ message: { content: JSON.stringify(model({ verdict: "listening", patternSlug: null, markers: [] })) } }] });
  };
  const res = await assess(request({ transcript }));
  assert.equal(res.status, 200);
  assert.ok(sent);
  assert.doesNotMatch(sent, /BOUNDARY_SECRET/);
  assert.doesNotMatch(shieldTranscriptWindow(transcript), /BOUNDARY_SECRET/);
});
