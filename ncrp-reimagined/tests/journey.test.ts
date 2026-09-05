import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { CONTENT_PLAYBOOK } from "../src/lib/playbooks";
import * as playbooks from "../src/lib/playbooks";
import * as briefs from "../src/lib/brief";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest } from "next/server";
import type { ExtractedFact, Incident } from "../src/lib/store";

// Follow the intake suite: execute real handlers with local doubles, never providers.
function handler(component: string, name: string, values: Record<string, unknown> = {}) {
  const source = readFileSync(new URL(`../src/components/${component}.tsx`, import.meta.url), "utf8");
  const file = ts.createSourceFile("component.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const declarations: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) declarations.push(node.getText(file));
    else ts.forEachChild(node, visit);
  }
  visit(file);
  assert.equal(declarations.length, 1);
  for (const node of file.statements) {
    if (ts.isVariableStatement(node)) declarations.unshift(node.getText(file));
  }
  const requests: { url: string; init?: RequestInit }[] = [];
  const context: Record<string, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
    AbortSignal,
    pending: { current: false }, requestKeys: { current: new Map() },
    state: "idle", consent: true, to: "+12025550123", incidentId: "INC" + "A".repeat(32),
    submitting: false, busy: false, saving: false, amount: "", bank: "", description: "Local test",
    incident: { id: "INC" + "A".repeat(32), extractedFacts: [] },
    crypto: { randomUUID: () => `journey-key-${requests.length}` },
    router: { push: (path: string) => { context.destination = path; }, refresh() {} },
    fetch: async (url: string, init?: RequestInit) => {
      requests.push({ url, init });
      return Response.json(context.result);
    },
    ...values,
  };
  for (const key of ["state", "message", "submitting", "busy", "error", "failed", "saving", "saved", "callState", "callMsg", "audioState", "audioSrc", "audioMsg", "sarvamState", "sarvamSrc", "sarvamMsg", "speechState"]) {
    context[`set${key[0].toUpperCase()}${key.slice(1)}`] = (value: unknown) => { context[key] = value; };
  }
  vm.runInNewContext(ts.transpileModule(declarations.join("\n"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return { context, requests, run: (...args: unknown[]) => context[name](...args) };
}

test("every content step supplies typed links and only HTTPS destinations", () => {
  for (const step of CONTENT_PLAYBOOK.steps) {
    assert.ok(Array.isArray(step.links));
    for (const link of step.links) {
      assert.equal(new URL(link.href).protocol, "https:");
      assert.ok(link.label);
    }
  }
});

test("alert requires consent, sends header idempotency and reuses it after failure", async () => {
  const { context, requests, run } = handler("DemoAlertButton", "fireCall", { consent: false, result: {}, callPending: { current: false }, callState: "idle" });
  await run();
  assert.equal(requests.length, 0);
  context.consent = true;
  await run();
  assert.equal(context.callState, "error");
  context.result = { ok: true, status: "requested" };
  await run();
  context.state = "idle";
  assert.equal(context.callState, "done");
  assert.equal(JSON.parse(String(requests[0].init?.body)).consent, true);
  assert.equal(new Headers(requests[0].init?.headers).get("Idempotency-Key"), new Headers(requests[1].init?.headers).get("Idempotency-Key"));
  await run();
  assert.equal(requests.length, 2);
});

test("report checks the local preparation contract and canonicalises legacy financial fields", async () => {
  const id = "INC" + "B".repeat(32);
  const { context, requests, run } = handler("ReportForm", "submit", {
    incident: { id, extractedFacts: [{ field: "transaction_amount", value: 12 }, { field: "bank", value: "Old" }] },
    amount: "0", bank: "Test bank", result: { incident: { id }, status: "prepared_locally", sent: true },
  });
  await run({ preventDefault() {} });
  assert.equal(context.destination, undefined);
  assert.ok(context.error);
  context.result.sent = false;
  await run({ preventDefault() {} });
  assert.equal(context.destination, `/recover/${id}`);
  const body = JSON.parse(String(requests[1].init?.body));
  assert.equal(body.submitMock, true);
  assert.deepEqual(body.extractedFacts.map((fact: { field: string }) => fact.field), ["Financial amount", "Bank or wallet"]);
  assert.equal(body.extractedFacts[0].value, 0);
});

test("golden demo mutation handlers do not make requests", async () => {
  for (const [component, name] of [["ReportForm", "submit"], ["FactReview", "confirmFacts"], ["ActionChecklist", "toggle"], ["DemoAlertButton", "fireCall"], ["DemoAlertButton", "playDemoAudio"]]) {
    const { requests, run } = handler(component, name, { incidentId: "DEMO0001", incident: { id: "DEMO0001" }, audioState: "idle", audioPending: { current: false }, callPending: { current: false }, callState: "idle", sarvamState: "idle", sarvamPending: { current: false }, speechState: "idle" });
    await run({ preventDefault() {} });
    assert.equal(requests.length, 0);
  }
});

test("demo copy explicitly POSTs once and navigates only to a validated copy", async () => {
  const id = "INC" + "C".repeat(32);
  const { context, requests, run } = handler("DemoCopyButton", "createCopy", { nextPage: "report", result: { id, syntheticOnly: true } });
  await run();
  await run();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "/api/demo");
  assert.equal(requests[0].init?.method, "POST");
  assert.equal(context.destination, `/report/${id}`);
  const invalid = handler("DemoCopyButton", "createCopy", { result: { id: "DEMO0001", syntheticOnly: true } });
  await invalid.run();
  assert.equal(invalid.context.destination, undefined);
  assert.ok(invalid.context.error);
});

test("bundle download uses the personal-details filename and reports failures", async () => {
  const anchor = { href: "", download: "", click() {}, remove() {} };
  const { context, run } = handler("DownloadBundle", "download", {
    result: {}, document: { createElement: () => anchor, body: { appendChild() {} } },
    URL: { createObjectURL: () => "blob:local", revokeObjectURL() {} }, setTimeout() {},
  });
  await run();
  assert.match(anchor.download, /-personal-details\.json$/);
  context.fetch = async () => { throw new Error("Offline"); };
  await run();
  assert.equal(context.failed, true);
  assert.equal(context.busy, false);
});

async function actionPage(incident: Incident) {
  const source = readFileSync(new URL("../src/app/act/[id]/page.tsx", import.meta.url), "utf8");
  const exports: { default?: (props: unknown) => Promise<React.ReactElement> } = {};
  const displayed: briefs.IncidentBrief[] = [];
  const copied: string[] = [];
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, {
    exports,
    require: (name: string) => {
      if (name === "react/jsx-runtime") return jsxRuntime;
      if (name === "next/link") return { default: "a" };
      if (name === "lucide-react") return new Proxy({}, { get: () => () => null });
      if (name === "@/lib/store") return { getIncident: async () => incident };
      if (name === "@/lib/brief") return { ...briefs, buildBrief: (input: Parameters<typeof briefs.buildBrief>[0]) => {
        const brief = briefs.buildBrief(input); displayed.push(brief); return brief;
      } };
      if (name === "@/lib/playbooks") return playbooks;
      if (name === "next/navigation") return { notFound() { throw new Error("Unexpected missing incident"); } };
      if (name === "@/components/CopyBrief") return { default: ({ text }: { text: string }) => { copied.push(text); return null; } };
      if (name.startsWith("@/components/")) return { default: () => null };
      throw new Error(`Unexpected module: ${name}`);
    },
  });
  const html = renderToStaticMarkup(await exports.default!({ params: Promise.resolve({ id: incident.id }), searchParams: Promise.resolve({}) }));
  assert.equal(displayed.length, 1, "Action page must use the canonical builder");
  assert.equal(copied[0], displayed[0].emailBody);
  const attributes = html.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
  assert.ok(attributes.includes(encodeURIComponent(displayed[0].emailBody)), "Email must share the canonical brief");
  assert.ok(attributes.includes(encodeURIComponent(`${displayed[0].emailSubject}\n\n${displayed[0].readAloud}`)), "WhatsApp must share the canonical script");
  return { html, brief: displayed[0] };
}

test("canonical journey stays aligned from report edits through action, export and mocked alert", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "opencode", "journey-test-"));
  const originalFetch = globalThis.fetch;
  const keys = ["DATABASE_URL", "RAKSHA_STORE_PATH", "OPENAI_API_KEY", "DEMO_MODE", "ALERT_ALLOWLIST", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"];
  const env = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  keys.forEach((key) => delete process.env[key]);
  process.env.RAKSHA_STORE_PATH = join(directory, "incidents.json");
  globalThis.fetch = async () => { throw new Error("Unexpected network request"); };
  try {
    const { POST: save } = await import("../src/app/api/shield/save/route");
    const { PATCH, GET } = await import("../src/app/api/incidents/[id]/route");
    const { POST: alert } = await import("../src/app/api/shield/alert/route");
    const { getIncident } = await import("../src/lib/store");
    const request = (url: string, body: unknown, method = "PATCH") => new NextRequest(`http://localhost${url}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const fact = (field: string, value: ExtractedFact["value"], confirmationStatus: ExtractedFact["confirmationStatus"] = "corrected"): ExtractedFact => ({ field, value, source: "user", confidence: 1, confirmationStatus });
    const start = "2026-09-05T10:00:00.000Z";
    const paidAt = "2026-09-05T09:30:00.000Z";
    const saved = await save(request("/api/shield/save", {
      transcript: "A fictional screening for journey verification.", source: "simulation", startedAt: start, endedAt: start,
      answers: { victimName: "Original Example", callerNumber: "+12025550120", moneyMoved: true, amountInr: 125, bankOrWallet: "Original Bank", paidAt, immediateDanger: false, sharedCredentials: false },
    }, "POST"));
    assert.equal(saved.status, 200);
    const { id } = await saved.json();
    const context = { params: Promise.resolve({ id }) };
    const patch = (body: unknown) => PATCH(request(`/api/incidents/${id}`, body), context);
    let incident = (await getIncident(id))!;
    const originalShield = incident.shield!;

    await t.test("report corrections reach canonical answers, every brief channel, export and alert", async () => {
      const correctedFacts = incident.extractedFacts.filter((item) => !["victim_name", "caller_number"].includes(item.field));
      correctedFacts.push(fact("victim_name", "Updated Example"), fact("suspect number", "+12025550121"), fact("paidAt", "2026-09-05T09:45:00.000Z"), fact("callerClaims", "Fictional caller"));
      const report = handler("ReportForm", "submit", {
        incident: { ...incident, extractedFacts: correctedFacts }, amount: "2,750", bank: "Updated Bank", description: "Edited fictional notes.",
        fetch: async (_url: string, init: RequestInit) => patch(JSON.parse(String(init.body))),
      });
      await report.run({ preventDefault() {} });
      assert.equal(report.context.destination, `/recover/${id}`);
      incident = (await getIncident(id))!;
      assert.equal(incident.shield!.answers!.amountInr, 2750);
      assert.equal(incident.shield!.answers!.bankOrWallet, "Updated Bank");
      assert.equal(incident.shield!.answers!.victimName, "Updated Example");
      assert.equal(incident.shield!.answers!.callerNumber, "+12025550121");
      assert.equal(incident.occurredAt, "2026-09-05T09:45:00.000Z");
      assert.equal(incident.syntheticOnly, true);
      assert.equal(incident.shield!.source, "simulation");
      assert.ok(incident.extractedFacts.some((item) => item.field === "Simulation edits"));
      assert.deepEqual(incident.shield!.assessment, originalShield.assessment);
      assert.equal(incident.shield!.transcript, originalShield.transcript);
      assert.equal(incident.shield!.startedAt, originalShield.startedAt);
      assert.equal(incident.shield!.endedAt, originalShield.endedAt);
      assert.ok(!incident.missingFacts.includes("victim name"));
      assert.ok(incident.missingFacts.includes("callback number"));
      assert.ok(incident.missingFacts.includes("utr"));
      const stored = incident.shield!.brief!;
      const page = await actionPage(incident);
      for (const output of [stored.confirmed.join(" "), stored.readAloud, stored.emailBody, stored.vapiBriefing.keyFacts, stored.vapiBriefing.situationLine, stored.vapiBriefing.fullReadAloud]) {
        assert.match(output, /2,750/);
        assert.match(output, /Updated Bank/);
        assert.doesNotMatch(output, /Original Bank|Original Example/);
      }
      assert.match(stored.emailSubject, /^SIMULATION:/);
      assert.match(stored.readAloud, /^This is a simulation/);
      assert.equal(page.brief.emailBody, stored.emailBody);
      assert.deepEqual(page.brief.vapiBriefing, stored.vapiBriefing);
      const bundle = await (await GET(new NextRequest(`http://localhost/api/incidents/${id}?format=bundle`), context)).json();
      assert.deepEqual(bundle.incident.shield.brief, stored);
      assert.equal(bundle.sent, false);
      process.env.DEMO_MODE = "true";
      process.env.ALERT_ALLOWLIST = "+12025550129";
      process.env.TWILIO_ACCOUNT_SID = "AC" + "0".repeat(32);
      process.env.TWILIO_AUTH_TOKEN = "test-auth-token";
      process.env.TWILIO_PHONE_NUMBER = "+15551234567";
      let calls = 0;
      globalThis.fetch = async (url, init) => {
        calls++;
        assert.match(String(url), /twilio\.com/);
        const params = new URLSearchParams(String(init?.body));
        assert.equal(params.get("To"), "+12025550129");
        assert.ok(params.get("Twiml")?.includes("Polly.Kajal-Neural"), "TwiML must use Kajal-Neural voice");
        assert.ok(params.get("Twiml")?.includes("demonstration"), "TwiML must contain disclaimer");
        assert.ok(params.get("Twiml")?.includes(stored.readAloud.slice(0, 40)), "TwiML must contain brief readAloud");
        return new Response(null, { status: 201 });
      };
      assert.equal((await alert(request("/api/shield/alert", { incidentId: id, to: "+12025550129", consent: true }, "POST"))).status, 200);
      assert.equal(calls, 1);
      globalThis.fetch = async () => { throw new Error("Unexpected network request"); };
    });

    await t.test("danger overrides money without a competing 1930 primary", async () => {
      assert.equal((await patch({ answers: { danger: true } })).status, 200);
      incident = (await getIncident(id))!;
      const page = await actionPage(incident);
      assert.equal(page.brief.escalation, "112");
      assert.match(page.brief.readAloud, /^This is a simulation[^.]*\. Immediate danger/);
      assert.match(page.brief.vapiBriefing.recommendation, /112/);
      assert.match(page.html, /href="tel:112"/);
      assert.doesNotMatch(page.html, /href="tel:1930"|Call 1930 now/);
      assert.match(page.html, /After emergency help \/ bank containment/);
      assert.equal(incident.answers.danger, true);
      assert.equal(incident.shield!.brief!.emailBody, page.brief.emailBody);
    });

    await t.test("explicit negatives preserve report-suspect and clearing facts restores unknowns", async () => {
      assert.equal((await patch({ answers: { immediateDanger: false, paid: false, sharedCredentials: false } })).status, 200);
      incident = (await getIncident(id))!;
      assert.equal(incident.occurredAt, null);
      assert.equal(incident.answers.danger, false);
      const page = await actionPage(incident);
      assert.equal(page.brief.escalation, "report-suspect");
      assert.match(page.brief.emailBody, /NCRP Report Suspect/);
      assert.doesNotMatch(page.html, /Call 1930 now/);
      assert.equal((await patch({ extractedFacts: [fact("caller_number", null), fact("immediate danger", null), fact("money moved", null), fact("credential or access exposure", null), fact("bank", null)] })).status, 200);
      incident = (await getIncident(id))!;
      const unknown = await actionPage(incident);
      assert.equal(unknown.brief.escalation, "none");
      assert.match(unknown.brief.readAloud, /Physical safety has not been confirmed/);
      assert.equal(incident.shield!.answers!.bankOrWallet, null);
      assert.equal(incident.answers.paid, undefined);
      assert.equal(incident.answers.danger, undefined);
      assert.ok(incident.missingFacts.includes("caller number"));
      assert.ok(incident.missingFacts.includes("money moved"));
    });

    await t.test("invalid reviewed values reject atomically; unconfirmed amounts never become answers", async () => {
      const before = (await getIncident(id))!;
      for (const item of [fact("amountInr", -1), fact("financial amount", "not a number"), fact("paid_at", "not a date"), fact("immediate danger", "maybe"), fact("victim name", "x".repeat(301))]) {
        assert.equal((await patch({ extractedFacts: [item] })).status, 400);
        assert.deepEqual(await getIncident(id), before);
      }
      assert.equal((await patch({ extractedFacts: [fact("financial amount", 9999, "unconfirmed")] })).status, 200);
      assert.equal((await getIncident(id))!.shield!.answers!.amountInr, before.shield!.answers!.amountInr);
    });

    await t.test("clearing one access flag does not erase a different reported exposure", async () => {
      assert.equal((await patch({ answers: { app: true } })).status, 200);
      assert.equal((await patch({ answers: { screen: false } })).status, 200);
      assert.equal((await getIncident(id))!.shield!.answers!.sharedCredentials, true);
      assert.equal((await patch({ completedActions: ["Saved evidence"] })).status, 200);
      assert.equal((await patch({ answers: { app: false } })).status, 200);
      assert.equal((await getIncident(id))!.shield!.answers!.sharedCredentials, false);
      assert.equal((await patch({ answers: { otp: true } })).status, 200);
      assert.equal((await patch({ answers: { sharedCredentials: false } })).status, 200);
      assert.equal((await getIncident(id))!.shield!.answers!.sharedCredentials, false);
    });

    await t.test("provenance is not editable and an annotated full fact list remains saveable", async () => {
      assert.equal((await patch({ extractedFacts: [fact("screening_source", "text"), fact("screening_started_at", "wrong"), fact("constructor", "unmapped field")] })).status, 200);
      const corrected = (await getIncident(id))!;
      assert.equal(corrected.extractedFacts.find((item) => item.field === "screening_source")!.value, "simulation");
      assert.equal(corrected.extractedFacts.find((item) => item.field === "screening_started_at")!.value, start);
      assert.equal((await patch({ extractedFacts: Array.from({ length: 64 }, (_, index) => fact(`other field ${index}`, "example")) })).status, 200);
      const full = (await getIncident(id))!;
      assert.equal(full.extractedFacts.length, 65);
      assert.equal((await patch({ extractedFacts: full.extractedFacts, answers: { danger: false } })).status, 200);
    });

    await t.test("ordinary non-synthetic edits never grant outbound demo eligibility", async () => {
      const response = await save(request("/api/shield/save", { transcript: "A text screening example.", source: "text", startedAt: start, endedAt: start }, "POST"));
      const realId = (await response.json()).id;
      const result = await PATCH(request(`/api/incidents/${realId}`, { extractedFacts: [fact("name", "Edited text example")] }), { params: Promise.resolve({ id: realId }) });
      assert.equal(result.status, 200);
      const edited = (await result.json()).incident;
      assert.equal(edited.syntheticOnly, false);
      assert.equal(edited.shield.source, "text");
      assert.doesNotMatch(edited.shield.brief.emailSubject, /^SIMULATION:/);
      process.env.ALERT_ALLOWLIST = "+12025550128";
      assert.equal((await alert(request("/api/shield/alert", { incidentId: realId, to: "+12025550128", consent: true }, "POST"))).status, 403);
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
