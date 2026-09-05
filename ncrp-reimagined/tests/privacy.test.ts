import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, writeFile, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest } from "next/server";

test("privacy and prototype safety boundaries (no live providers)", { timeout: 30000 }, async (t) => {
  const directory = await mkdtemp(join(tmpdir(), ...(process.platform === "win32" ? ["opencode"] : []), "raksha-privacy-"));
  const originalFetch = globalThis.fetch;
  const keys = ["DATABASE_URL", "RAKSHA_STORE_PATH", "OPENAI_API_KEY", "SARVAM_API_KEY", "DEMO_MODE", "ALERT_ALLOWLIST", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"];
  const environment = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  keys.forEach((key) => delete process.env[key]);
  process.env.RAKSHA_STORE_PATH = join(directory, "incidents.json");
  // Fail closed even if the developer has real provider credentials configured.
  globalThis.fetch = async () => { throw new Error("Unexpected network request in privacy test"); };
  try {
    await writeFile(process.env.RAKSHA_STORE_PATH, JSON.stringify({ DEMO0001: { id: "DEMO0001", createdAt: "2000-01-01", rawText: "poisoned fixture" } }));
    const { redact, evidenceIdentifiers, sanitizeCredentials, readBoundedBody } = await import("../src/lib/redact");
    const store = await import("../src/lib/store");
    const agent = await import("../src/app/api/agent/route");
    const analyze = await import("../src/app/api/analyze/route");
    const incidents = await import("../src/app/api/incidents/[id]/route");
    const demo = await import("../src/app/api/demo/route");
    const alert = await import("../src/app/api/shield/alert/route");
    const dna = await import("../src/lib/dna");
    const { emptyAnswers, buildBrief } = await import("../src/lib/brief");
    const { assessLocal } = await import("../src/lib/shield");
    const context = (id: string) => ({ params: Promise.resolve({ id }) });
    const request = (path: string, body: unknown, method = "POST", headers: Record<string, string> = {}) => new NextRequest(`http://localhost${path}`, { method, headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
    const reply = (value: unknown) => new Response(JSON.stringify({ choices: [{ message: { content: typeof value === "string" ? value : JSON.stringify(value) } }] }), { headers: { "Content-Type": "application/json" } });

    await t.test("labelled credentials never appear in text, entities, or evidence", () => {
      for (const [input, secret] of [
        ["OTP: 654321", "654321"], ["otp is 123456", "123456"], ["OTP is: 123456", "123456"], ["UPI PIN 4321", "4321"],
        ["CVV: 789", "789"], ["CVC=987", "987"], ["password: S3cret!value", "S3cret!value"],
        ["password: 123abc", "abc"], ["password: 123!wow", "!wow"], ["OTP '123456'", "123456"],
        ["password - hyphen-secret", "hyphen-secret"], ["OTP ABC123", "ABC123"], ["password 'two word secret'", "two word secret"],
        ["password is 'two word secret'", "two word secret"], ["passcode=abc789", "abc789"],
        ["OTP: 1 2 3 4 5 6", "1 2 3 4 5 6"], ["ओटीपी: १२३४५६", "१२३४५६"],
        ["https://user:secret@example.test/a?password=query-secret#fragment-secret", "query-secret"],
      ]) {
        const result = redact(input);
        assert.ok(!JSON.stringify(result).includes(secret), input);
        assert.ok(!JSON.stringify(evidenceIdentifiers(result.entities)).includes(secret), input);
      }
      const url = JSON.stringify(redact("https://user:secret@example.test/a?token=hidden#private"));
      assert.ok(!/user:|secret|hidden|private/.test(url));
      const structured = sanitizeCredentials({ password: "hidden-password", nested: [{ field: "OTP", value: 654321 }, { type: "otp", value: 654321 }, { cvv: "789" }], sharedCredentials: true });
      assert.ok(!/hidden-password|654321|789/.test(JSON.stringify(structured)));
      assert.equal(structured.sharedCredentials, true);
      assert.ok(redact("Please never share an OTP or UPI PIN.").redacted.includes("never share"));
      for (const prose of ["My password was not shared.", "OTP is not required.", "The password has never been shared.", "Never share a password or OTP."]) assert.equal(redact(prose).redacted, prose);
    });

    await t.test("legacy persisted acknowledgements and synthetic defaults are not replayed", async () => {
      const fixture = (await store.getIncident("DEMO0001"))!;
      const id = "INC0123456789";
      await writeFile(process.env.RAKSHA_STORE_PATH!, JSON.stringify({
        DEMO0001: { id: "DEMO0001", rawText: "poisoned fixture", createdAt: "2000-01-01" },
        [id]: { ...fixture, id, origin: "intake", rawText: "OTP: 918273", ackNumber: "NCRP987654", packets: [{ recipient: "ncrp", status: "acknowledged", payload: { submittedAt: "2000-01-01" } }], routingEvents: [{ type: "ncrp_acknowledged", message: "NCRP accepted the report", occurredAt: "2000-01-01", status: "complete" }] },
      }));
      const legacy = (await store.getIncident(id))!;
      assert.equal(legacy.syntheticOnly, false);
      assert.equal(legacy.ackNumber, `RAKSHA-SIM-${id}`);
      assert.equal(legacy.packets[0].status, "prepared_locally");
      assert.equal(legacy.routingEvents[0].type, "prepared_locally");
      assert.ok(!/918273|NCRP987654|submittedAt|NCRP accepted/.test(JSON.stringify(legacy)));
    });

    await t.test("golden demo ignores stale storage, is fresh, detached, and read-only centrally", async () => {
      const start = Date.now();
      const fixture = (await store.getIncident("DEMO0001"))!;
      assert.ok(Date.parse(fixture.createdAt) >= start);
      assert.notEqual(fixture.rawText, "poisoned fixture");
      assert.equal(fixture.ackNumber, "RAKSHA-SIM-DEMO0001");
      fixture.answers.poisoned = true;
      assert.equal(await store.updateIncident("DEMO0001", { rawText: "overwrite" }), null);
      assert.equal((await store.getIncident("DEMO0001"))!.answers.poisoned, undefined);
      assert.equal((await incidents.PATCH(request("/api/incidents/DEMO0001", { submitMock: true }, "PATCH"), context("DEMO0001"))).status, 409);
      const response = await demo.POST();
      assert.equal(response.status, 201);
      const copy = await response.json();
      assert.match(copy.id, /^INC[A-F0-9]{32}$/);
      assert.equal(copy.syntheticOnly, true);
      assert.equal((await store.getIncident(copy.id))!.ackNumber, null);
    });

    await t.test("storage sanitises deep fields, defaults real inputs to non-synthetic, and detaches reads", async () => {
      const incident = await store.createIncident({ rawText: "password: private-pass OTP: 222333", extractedFacts: [{ field: "CVV", value: "987", source: "user", confidence: 1, confirmationStatus: "confirmed" }] });
      assert.equal(incident.syntheticOnly, false);
      assert.match(incident.id, /^INC[A-F0-9]{32}$/);
      assert.ok(!/private-pass|222333|987/.test(JSON.stringify(incident)));
      incident.answers.mutated = true;
      assert.equal((await store.getIncident(incident.id))!.answers.mutated, undefined);
      const updated = await store.updateIncident(incident.id, { id: "DEMO0001", createdAt: "2000-01-01", ackNumber: "NCRP123456" });
      assert.equal(updated!.id, incident.id);
      assert.equal(updated!.createdAt, incident.createdAt);
      assert.ok(updated!.ackNumber!.startsWith("RAKSHA-SIM-"));
    });

    await t.test("concurrent fallback transactions preserve creates and functional updates atomically", async () => {
      const created = await Promise.all(Array.from({ length: 20 }, (_, index) => store.createIncident({ rawText: `Case ${index}` })));
      assert.equal(new Set(created.map((incident) => incident.id)).size, 20);
      await Promise.all(Array.from({ length: 20 }, (_, index) => store.updateIncident(created[0].id, (current) => ({ answers: { ...current.answers, [`answer${index}`]: true } }))));
      assert.equal(Object.keys((await store.getIncident(created[0].id))!.answers).length, 20);
      const disk = JSON.parse(await readFile(process.env.RAKSHA_STORE_PATH!, "utf8"));
      for (const incident of created) assert.ok(disk[incident.id]);
      assert.equal(disk.DEMO0001, undefined);
    });

    await t.test("failed fallback writes do not change memory or poison the transaction queue", async () => {
      const incident = await store.createIncident({ rawText: "Original" });
      await rename(directory, `${directory}.offline`);
      try {
        await assert.rejects(store.updateIncident(incident.id, { rawText: "Not committed" }));
        assert.equal((await store.getIncident(incident.id))!.rawText, "Original");
      } finally { await rename(`${directory}.offline`, directory); }
      assert.equal((await store.updateIncident(incident.id, { rawText: "Committed" }))!.rawText, "Committed");
    });

    await t.test("body byte limits apply without Content-Length and cancel oversize streams", async () => {
      let cancelled = false;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) { controller.enqueue(new Uint8Array(32)); },
        cancel() { cancelled = true; },
      });
      const streamed = new Request("http://localhost", { method: "POST", body: stream, duplex: "half" } as RequestInit);
      await assert.rejects(readBoundedBody(streamed, 16), RangeError);
      assert.equal(cancelled, true);
      const oversized = new NextRequest("http://localhost/api/agent", { method: "POST", body: "x".repeat(320001) });
      assert.equal((await agent.POST(oversized)).status, 413);
      const analyzeOversize = new NextRequest("http://localhost/api/analyze", { method: "POST", body: "x".repeat(32769) });
      assert.equal((await analyze.POST(analyzeOversize)).status, 413);
    });

    await t.test("PATCH rejects malformed, unknown, and oversized shapes without touching the case", async () => {
      const incident = await store.createIncident();
      for (const body of [null, [], {}, { submitMock: "true" }, { owner: "attacker" }, { rawText: {} }, { answers: { paid: "yes" } }, { extractedFacts: [{ value: "secret" }] }, { completedActions: [{}] }, { rawText: "a".repeat(6001) }]) {
        assert.equal((await incidents.PATCH(request(`/api/incidents/${incident.id}`, body, "PATCH"), context(incident.id))).status, 400, JSON.stringify(body).slice(0, 100));
      }
      const malformed = new NextRequest("http://localhost/api/incidents/x", { method: "PATCH", body: "{" });
      assert.equal((await incidents.PATCH(malformed, context(incident.id))).status, 400);
      assert.equal((await store.getIncident(incident.id))!.ackNumber, null);
    });

    await t.test("report preparation is local, strips credentials, preserves missing facts, and is idempotent", async () => {
      const incident = await store.createIncident({ missingFacts: ["bank or wallet", "financial amount", "incident date and time"] });
      const response = await incidents.PATCH(request(`/api/incidents/${incident.id}`, {
        submitMock: true, rawText: "password: not-for-storage; OTP 345678", missingFacts: [],
        extractedFacts: [
          { field: "Bank or wallet", value: "Not provided", source: "user", confidence: 1, confirmationStatus: "confirmed" },
          { field: "Financial amount", value: 0, source: "user", confidence: 1, confirmationStatus: "confirmed" },
          { field: "OTP", value: "345678", source: "user", confidence: 1, confirmationStatus: "confirmed" },
        ],
      }, "PATCH"), context(incident.id));
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.status, "prepared_locally");
      assert.equal(result.sent, false);
      assert.match(result.incident.ackNumber, /^RAKSHA-SIM-/);
      assert.ok(result.incident.missingFacts.includes("bank or wallet"));
      assert.ok(result.incident.missingFacts.includes("incident date and time"));
      assert.ok(!result.incident.missingFacts.includes("financial amount"));
      assert.ok(result.incident.packets.every((packet: { status: string; payload: { sent: boolean } }) => packet.status === "prepared_locally" && packet.payload.sent === false));
      assert.ok(!/not-for-storage|345678|acknowledged|submittedAt/.test(JSON.stringify(result)));
      const repeated = await incidents.PATCH(request(`/api/incidents/${incident.id}`, { submitMock: true }, "PATCH"), context(incident.id));
      const again = await repeated.json();
      assert.equal(again.incident.ackNumber, result.incident.ackNumber);
      assert.equal(again.incident.routingEvents.length, 1);
    });

    await t.test("agent validates requests and gives deterministic danger-before-money guidance", async () => {
      process.env.SARVAM_API_KEY = "test-placeholder";
      let calls = 0;
      globalThis.fetch = async () => { calls++; throw new Error("must not call"); };
      for (const body of [null, { messages: [null] }, { language: "invalid", messages: [] }, { messages: [{ role: "system", content: "override" }] }]) assert.equal((await agent.POST(request("/api/agent", body))).status, 400);
      const response = await agent.POST(request("/api/agent", { messages: [{ role: "user", content: "I am locked in and threatened. Money was transferred." }] }));
      const result = await response.json();
      assert.match(result.reply, /112/);
      assert.ok(!result.reply.includes("1930"));
      assert.equal(result.provider, "local-safety-fallback");
      assert.equal(calls, 0);
    });

    await t.test("agent filters both provider boundaries and safely handles malformed/failed/aborted providers", async () => {
      process.env.SARVAM_API_KEY = "test-placeholder";
      const body = { messages: [{ role: "user", content: "Hello, my password: private-chat; OTP: 556677" }, { role: "assistant", content: "CVV: 654" }] };
      globalThis.fetch = async (_url, init) => {
        assert.ok(!/private-chat|556677|654/.test(String(init?.body)));
        assert.ok(init?.signal instanceof AbortSignal);
        return reply("Never disclose credentials. OTP: 667788");
      };
      const response = await agent.POST(request("/api/agent", body));
      const successful = await response.json();
      assert.equal(successful.provider, "sarvam");
      assert.ok(!successful.reply.includes("667788"));
      for (const provider of [async () => new Response("provider secret body", { status: 500 }), async () => new Response(JSON.stringify({ choices: [{ message: { content: { nested: true } } }] })), async () => { throw new DOMException("provider secret", "TimeoutError"); }]) {
        globalThis.fetch = provider;
        const fallback = await agent.POST(request("/api/agent", body));
        const result = await fallback.json();
        assert.equal(result.provider, "local-safety-fallback");
        assert.ok(!JSON.stringify(result).includes("provider secret"));
      }
      delete process.env.SARVAM_API_KEY;
    });

    await t.test("DNA validates model structure, known pattern/stage, confidence, and grounded evidence", async () => {
      process.env.OPENAI_API_KEY = "test-placeholder";
      const text = "Asked to deposit to unlock higher-paying tasks";
      const valid = { patternSlug: "task-scam", stageId: "prepaid-task", confidence: 0.8, signals: [text], nextMove: "OTP: 999888", doNot: ["Share your password"], riskReason: "advisory" };
      for (const value of [null, [], {}, { ...valid, confidence: 8 }, { ...valid, confidence: "high" }, { ...valid, patternSlug: "made-up" }, { ...valid, stageId: "not-a-stage" }, { ...valid, signals: "wrong" }, { ...valid, signals: ["fabricated quote"] }]) {
        globalThis.fetch = async () => reply(value);
        assert.deepEqual(await dna.analyzeWithAI(text), dna.analyzeLocal(text));
      }
      globalThis.fetch = async (_url, init) => {
        assert.ok(init?.signal instanceof AbortSignal);
        assert.ok(!String(init?.body).includes("123789"));
        return reply(valid);
      };
      const result = await dna.analyzeWithAI(`${text}. OTP: 123789`);
      assert.equal(result.patternSlug, "task-scam");
      assert.equal(result.currentStage, "prepaid-task");
      assert.equal(result.confidence, 0.8);
      assert.equal(result.noDatabaseMatch, true);
      assert.ok(!JSON.stringify(result).includes("999888"));
      assert.ok(!result.doNot.includes("Share your password"));
      globalThis.fetch = async () => { throw new DOMException("private provider error", "TimeoutError"); };
      assert.deepEqual(await dna.analyzeWithAI(text), dna.analyzeLocal(text));
      delete process.env.OPENAI_API_KEY;
    });

    await t.test("analysis accepts text only, sanitises persisted input, and has no GET handler", async () => {
      assert.equal("GET" in analyze, false);
      assert.equal((await analyze.POST(request("/api/analyze", { text: "x" }))).status, 400);
      const fd = new FormData();
      fd.set("text", "They asked for OTP: 778899 and password: text-secret");
      const response = await analyze.POST(new NextRequest("http://localhost/api/analyze", { method: "POST", body: fd }));
      assert.equal(response.status, 200);
      const incident = await store.getIncident((await response.json()).id);
      assert.equal(incident!.syntheticOnly, false);
      assert.ok(!/778899|text-secret/.test(JSON.stringify(incident)));
      fd.set("image", new File(["unfiltered bytes"], "private.png", { type: "image/png" }));
      assert.equal((await analyze.POST(new NextRequest("http://localhost/api/analyze", { method: "POST", body: fd }))).status, 415);
      const empty = new FormData();
      assert.equal((await analyze.POST(new NextRequest("http://localhost/api/analyze", { method: "POST", body: empty }))).status, 400);
    });

    const shieldIncident = async (syntheticOnly = true) => {
      const assessment = assessLocal("An unknown caller asked me to send money.");
      const at = new Date().toISOString();
      const answers = { ...emptyAnswers(), victimName: "Synthetic Example", callerClaims: "password: shield-secret; OTP: 112233" };
      const brief = buildBrief({ id: "fixture", assessment, answers, startedAt: at, endedAt: at, redactedTranscript: "CVV: 543" });
      return store.createIncident({ syntheticOnly, shield: { source: "simulation", transcript: "OTP: 112233", assessment, startedAt: at, endedAt: at, answers, brief, alerts: [] } });
    };

    await t.test("download bundle contains Shield context and an honest personal-details label", async () => {
      const incident = await shieldIncident();
      const response = await incidents.GET(new NextRequest(`http://localhost/api/incidents/${incident.id}?format=bundle`), context(incident.id));
      assert.match(response.headers.get("content-disposition")!, /personal-details\.json/);
      assert.match(response.headers.get("cache-control")!, /no-store/);
      const bundle = await response.json();
      assert.match(bundle.label, /containing personal details/);
      assert.equal(bundle.sent, false);
      assert.ok(bundle.incident.shield.brief);
      assert.ok(bundle.incident.shield.answers);
      assert.ok(!/shield-secret|112233|543/.test(JSON.stringify(bundle)));
    });

    await t.test("alerts reject malformed, golden, unlisted, and non-synthetic incidents without calls", async () => {
      let calls = 0;
      globalThis.fetch = async () => { calls++; throw new Error("not allowed"); };
      assert.equal((await alert.POST(request("/api/shield/alert", null))).status, 403);
      process.env.DEMO_MODE = "true";
      process.env.ALERT_ALLOWLIST = "+12025550123,+12025550124,+12025550125";
      process.env.TWILIO_ACCOUNT_SID = "AC" + "0".repeat(32);
      process.env.TWILIO_AUTH_TOKEN = "test-auth-token";
      process.env.TWILIO_PHONE_NUMBER = "+15551234567";
      assert.equal((await alert.POST(request("/api/shield/alert", null))).status, 400);
      for (const consent of [undefined, false, "true"]) {
        assert.equal((await alert.POST(request("/api/shield/alert", { incidentId: "DEMO0001", to: "+12025550123", consent }))).status, 400);
      }
      assert.equal((await alert.POST(request("/api/shield/alert", { incidentId: "DEMO0001", to: "+12025550123", consent: true }))).status, 409);
      const incident = await shieldIncident(false);
      assert.equal((await alert.POST(request("/api/shield/alert", { incidentId: incident.id, to: "+12025550199", consent: true }))).status, 403);
      assert.equal((await alert.POST(request("/api/shield/alert", { incidentId: incident.id, to: "+12025550123", consent: true }))).status, 403);
      assert.equal(calls, 0);
    });

    await t.test("alert concurrency, replay, and case/destination cooldowns prevent duplicate outbound calls", async () => {
      const incident = await shieldIncident();
      const other = await shieldIncident();
      let calls = 0;
      let release!: () => void;
      let entered!: () => void;
      const providerEntered = new Promise<void>((resolve) => { entered = resolve; });
      const blocked = new Promise<void>((resolve) => { release = resolve; });
      globalThis.fetch = async (_url, init) => {
        calls++;
        assert.ok(init?.signal instanceof AbortSignal);
        assert.ok(!/shield-secret|112233|543/.test(String(init?.body)));
        entered();
        await blocked;
        return new Response("provider-internal-detail", { status: 201 });
      };
      const body = { incidentId: incident.id, to: "+12025550123", consent: true };
      const send = (value = body, key = "privacy-request-1") => alert.POST(request("/api/shield/alert", value, "POST", { "Idempotency-Key": key }));
      const pending = send();
      await providerEntered;
      assert.equal((await send()).status, 409);
      assert.equal((await send({ ...body, incidentId: other.id })).status, 409);
      release();
      const result = await (await pending).json();
      assert.equal(result.status, "requested");
      assert.ok(!result.message.includes("delivered"));
      assert.equal((await (await send()).json()).replayed, true);
      assert.equal((await send(body, "privacy-request-2")).status, 429);
      assert.equal((await send({ ...body, to: "+12025550124" })).status, 429);
      assert.equal((await send({ ...body, incidentId: other.id })).status, 429);
      assert.equal(calls, 1);
      assert.equal((await store.getIncident(incident.id))!.shield!.alerts[0].status, "requested");
    });

    await t.test("alert provider rejection and timeout are safe, persisted, and not retried on replay", async () => {
      for (const [index, mode] of ["rejected", "timeout"].entries()) {
        const incident = await shieldIncident();
        let calls = 0;
        globalThis.fetch = async () => {
          calls++;
          if (mode === "timeout") throw new DOMException("secret-provider-stack", "TimeoutError");
          return new Response("secret-provider-body", { status: 400 });
        };
        const body = { incidentId: incident.id, to: index === 0 ? "+12025550124" : "+12025550125", consent: true };
        const first = await alert.POST(request("/api/shield/alert", body));
        assert.equal(first.status, 502);
        assert.ok(!(await first.text()).includes("secret-provider"));
        const second = await alert.POST(request("/api/shield/alert", body));
        assert.equal(second.status, 502);
        assert.equal(calls, 1);
        const stored = (await store.getIncident(incident.id))!;
        assert.equal(stored.shield!.alerts[0].status, "failed");
        assert.ok(!JSON.stringify(stored).includes("secret-provider"));
      }
    });

    await t.test("all provider requests enforce an eight-second abort deadline", async (st) => {
      const nativeTimeout = AbortSignal.timeout.bind(AbortSignal);
      const deadlines: number[] = [];
      st.mock.method(AbortSignal, "timeout", (milliseconds: number) => {
        deadlines.push(milliseconds);
        return nativeTimeout(5);
      });
      globalThis.fetch = async (_url, init) => new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (!signal) return reject(new Error("Missing deadline"));
        if (signal.aborted) reject(signal.reason);
        else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      });
      // Native timeout signals are unref'ed; keep this isolated mock alive.
      const keepAlive = setTimeout(() => undefined, 1000);
      try {
        process.env.OPENAI_API_KEY = "test-placeholder";
        assert.deepEqual(await dna.analyzeWithAI("Hello"), dna.analyzeLocal("Hello"));
        delete process.env.OPENAI_API_KEY;
        process.env.SARVAM_API_KEY = "test-placeholder";
        assert.equal((await (await agent.POST(request("/api/agent", { messages: [{ role: "user", content: "Hello" }] }))).json()).provider, "local-safety-fallback");
        delete process.env.SARVAM_API_KEY;
        process.env.ALERT_ALLOWLIST += ",+12025550126";
        const incident = await shieldIncident();
        assert.equal((await alert.POST(request("/api/shield/alert", { incidentId: incident.id, to: "+12025550126", consent: true }))).status, 502);
        assert.deepEqual(deadlines, [8000, 8000, 8000]);
      } finally { clearTimeout(keepAlive); }
    });

    await t.test("security header configuration disables referrers, framing and sniffing", async () => {
      const { default: config } = await import("../next.config");
      const rules = await config.headers!();
      const all = Object.fromEntries(rules.find((rule) => rule.source === "/:path*")!.headers.map((header) => [header.key, header.value]));
      assert.equal(all["Referrer-Policy"], "no-referrer");
      assert.equal(all["X-Frame-Options"], "DENY");
      assert.equal(all["X-Content-Type-Options"], "nosniff");
      assert.match(all["Content-Security-Policy"], /frame-ancestors 'none'/);
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(environment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
