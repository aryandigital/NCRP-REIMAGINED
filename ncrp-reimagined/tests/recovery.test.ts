import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import * as clocks from "../src/lib/clocks";
import { PATTERN_BY_SLUG } from "../src/data/patterns";
import type { Incident } from "../src/lib/store";

const id = "INC" + "A".repeat(32);
const incident: Incident = {
  id, createdAt: "2026-09-05T10:00:00.000Z", occurredAt: null,
  origin: "intake", language: "en", rawText: null, imageDataUrl: null, dna: null,
  answers: {}, tracks: ["money", "content"], ackNumber: "NCRP-OLD-REFERENCE",
  completedActions: [], extractedFacts: [], missingFacts: [], packets: [],
  routingEvents: [], syntheticOnly: false, shield: null,
};

// Execute the page source with an isolated read-only store, without providers or real records.
function loadPage(path: string, record: Incident | null = incident) {
  const source = readFileSync(new URL(`../src/app/${path}`, import.meta.url), "utf8");
  const exports: { default?: (props: Record<string, unknown>) => React.ReactElement | Promise<React.ReactElement> } = {};
  const reads: string[] = [];
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, {
    exports,
    require: (name: string) => {
      if (name === "react/jsx-runtime") return jsxRuntime;
      if (name === "react") return React;
      if (name === "next/link") return { default: "a" };
      if (name === "lucide-react") return new Proxy({}, { get: () => () => null });
      if (name === "@/lib/clocks") return clocks;
      if (name === "@/data/patterns") return { PATTERN_BY_SLUG };
      if (name === "@/lib/store") return {
        getIncident: async (value: string) => { reads.push(value); return record; },
        isIncidentId: (value: string) => /^(?:INC(?:[A-F0-9]{10}|[A-F0-9]{32})|DEMO0001)$/.test(value),
      };
      if (name === "next/navigation") return {
        notFound() { throw new Error("NOT_FOUND"); },
        useRouter: () => ({ push() {} }),
      };
      if (name.startsWith("@/components/")) return {
        default: () => jsxRuntime.jsx("span", { "data-component": name }),
      };
      throw new Error(`Unexpected module: ${name}`);
    },
  });
  return { Page: exports.default!, reads };
}

function tracking(value: unknown, respond: () => Promise<Response> = async () => Response.json({ incident: { id } })) {
  const source = readFileSync(new URL("../src/app/track/page.tsx", import.meta.url), "utf8");
  const file = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let declaration = "";
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === "handleSubmit") declaration = node.getText(file);
    else ts.forEachChild(node, visit);
  }
  visit(file);
  assert.ok(declaration, "Exercise the actual form handler");
  const state = { caseId: "", loading: false, error: "", destination: "", pending: { current: false } };
  const requests: Array<{ url: string; init: RequestInit }> = [];
  const encoded: string[] = [];
  const run = vm.runInNewContext(ts.transpileModule(declaration, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText + "\nhandleSubmit;", {
    FormData: class { get(name: string) { assert.equal(name, "caseId"); return value; } },
    AbortSignal,
    pending: state.pending,
    setCaseId: (value: string) => { state.caseId = value; },
    setLoading: (value: boolean) => { state.loading = value; },
    setError: (value: string) => { state.error = value; },
    encodeURIComponent: (value: string) => { encoded.push(value); return encodeURIComponent(value); },
    fetch: async (url: string, init: RequestInit) => { requests.push({ url, init }); return respond(); },
    router: { push: (destination: string) => { state.destination = destination; } },
  }) as (event: { preventDefault(): void; currentTarget: object }) => Promise<void>;
  return { state, requests, encoded, submit: () => run({ preventDefault() {}, currentTarget: {} }) };
}

test("guidance has checkable sources and distinct required events, with no deadline calculator", () => {
  assert.equal("computeDueAt" in clocks, false);
  assert.equal("humanRemaining" in clocks, false);
  for (const guidance of Object.values(clocks.CLOCKS)) {
    assert.equal("duration" in guidance, false);
    assert.equal(new URL(guidance.sourceUrl).protocol, "https:");
    assert.ok(guidance.basis);
    assert.ok(guidance.triggerEvent);
    assert.doesNotMatch(guidance.triggerEvent, /createdAt|occurredAt|record creation|transaction timestamp/i);
    assert.doesNotMatch(guidance.why, /you are not liable|must reverse|must credit|only within \d/i);
  }
  assert.match(clocks.CLOCKS.RBI_ZERO_LIABILITY.triggerEvent, /transaction communication/);
  assert.match(clocks.CLOCKS.BANK_SHADOW_REVERSAL.triggerEvent, /bank's receipt/i);
  assert.match(clocks.CLOCKS.PLATFORM_TAKEDOWN.triggerEvent, /platform's receipt/i);
  assert.match(clocks.CLOCKS.GAC_APPEAL.triggerEvent, /decision/);
  assert.match(clocks.CLOCKS.MRM_APPLICATION.triggerEvent, /confirmation of frozen funds/);
});

test("recovery never derives legal trigger dates from creation, transaction or local event dates", async () => {
  for (const occurredAt of [null, "invalid", "2025-01-02T03:04:00.000Z", "2030-01-02T03:04:00.000Z"]) {
    const { Page } = loadPage("recover/[caseId]/page.tsx", {
      ...incident, occurredAt,
      routingEvents: [{ type: "bank_notified", status: "complete", message: "Bank notified; funds reversed", occurredAt: "2025-01-03T01:00:00.000Z" }],
    });
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ caseId: id }) }));
    assert.equal((html.match(/Required trigger event: not yet recorded/g) ?? []).length, 8);
    assert.match(html, /No legal deadline is calculated/);
    assert.match(html, /not guaranteed/);
    assert.match(html, /Record created/);
    assert.match(html, /Transaction timestamp \(user-provided\)/);
    assert.match(html, /5 September 2026/);
    if (occurredAt?.startsWith("2025")) assert.match(html, /2 January 2025/);
    if (!occurredAt || occurredAt === "invalid") assert.match(html, /Not recorded/);
    assert.doesNotMatch(html, /Invalid Date|Reported |overdue by|\d+ (hours?|days?) left|Bank notified; funds reversed/);
  }
});

test("recovery exposes the exact Raksha ID and never replays legacy official states", async () => {
  const legacy = {
    ...incident,
    packets: [{ recipient: "ncrp", status: "acknowledged", payload: { status: "submitted" } }],
    routingEvents: [{ type: "ncrp_acknowledged", status: "complete", message: "Official complaint delivered", occurredAt: incident.createdAt }],
  } as unknown as Incident;
  for (const path of ["recover/[caseId]/page.tsx", "operator/page.tsx"]) {
    const { Page, reads } = loadPage(path, legacy);
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ caseId: id }), searchParams: Promise.resolve({ caseId: id }) }));
    assert.deepEqual(reads, [id]);
    assert.match(html, /Raksha case ID/);
    assert.ok(html.includes(id));
    assert.match(html, /Prepared locally\. Not sent\./);
    assert.doesNotMatch(html, /NCRP-OLD-REFERENCE|Official complaint delivered|ncrp_acknowledged|acknowledged|submitted/);
    if (path.startsWith("recover")) assert.ok(html.includes(`/operator?caseId=${id}`));
  }
});

test("empty recovery records do not invent preparation events or unrelated track guidance", async () => {
  const { Page } = loadPage("recover/[caseId]/page.tsx", { ...incident, tracks: ["content"] });
  const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ caseId: id }) }));
  assert.match(html, /No packets have been prepared/);
  assert.match(html, /No local preparation events recorded/);
  assert.equal((html.match(/Required trigger event: not yet recorded/g) ?? []).length, 4);
  assert.doesNotMatch(html, /Ask your bank about provisional credit|Local entry timestamp:/);
});

test("tracking normalizes and checks the exact ID before navigation, with encoded paths", async () => {
  let resolve!: (response: Response) => void;
  const response = new Promise<Response>((done) => { resolve = done; });
  const lookup = tracking(`  ${id.toLowerCase()}  `, () => response);
  const pending = lookup.submit();
  assert.equal(lookup.state.caseId, id);
  assert.equal(lookup.state.loading, true);
  assert.equal(lookup.state.destination, "");
  await lookup.submit();
  assert.equal(lookup.requests.length, 1, "Double submit does not send another lookup");
  resolve(Response.json({ incident: { id } }));
  await pending;
  assert.equal(lookup.requests[0].url, `/api/incidents/${id}`);
  assert.equal(lookup.requests[0].init.method, "GET");
  assert.equal(lookup.requests[0].init.cache, "no-store");
  assert.ok(lookup.requests[0].init.signal);
  assert.deepEqual(lookup.encoded, [id, id]);
  assert.equal(lookup.state.destination, `/recover/${id}`);
  assert.equal(lookup.state.error, "");
});

test("tracking accepts persisted IDs and read-only fixture IDs, not official references or partial IDs", async () => {
  for (const exact of ["INC012345ABCD", "DEMO0001"]) {
    const lookup = tracking(exact.toLowerCase(), async () => Response.json({ incident: { id: exact } }));
    await lookup.submit();
    assert.equal(lookup.state.destination, `/recover/${exact}`);
  }
  for (const invalid of [null, "", "   ", "12345678901234", "NCRPDEMO0001", "RAKSHA-SIM-DEMO0001", "INCABC", "DEMO0002", `${id}/other`, `${id}?x=1`, `%44EMO0001`, "javascript:alert(1)", "INC" + "G".repeat(32)]) {
    const lookup = tracking(invalid);
    await lookup.submit();
    assert.equal(lookup.requests.length, 0);
    assert.equal(lookup.state.destination, "");
    assert.equal(lookup.state.loading, false);
    assert.match(lookup.state.error, /complete Raksha case ID/);
  }
});

test("missing, unavailable, malformed and mismatched lookups stay inline and permit retry", async () => {
  for (const respond of [
    async () => Response.json({ error: "private-storage-detail" }, { status: 404 }),
    async () => Response.json({ error: "private-storage-detail" }, { status: 503 }),
    async () => Response.json({ incident: { id: "DEMO0001" } }),
    async () => Response.json({ incident: { id: id.toLowerCase() } }),
    async () => Response.json(null),
    async () => new Response("not JSON"),
    async () => { throw new Error("private-storage-detail"); },
  ]) {
    let retry = false;
    const lookup = tracking(id, () => retry ? Promise.resolve(Response.json({ incident: { id } })) : respond());
    await lookup.submit();
    assert.equal(lookup.state.destination, "");
    assert.equal(lookup.state.loading, false);
    assert.equal(lookup.state.pending.current, false);
    assert.ok(lookup.state.error);
    assert.doesNotMatch(lookup.state.error, /private-storage-detail/);
    retry = true;
    await lookup.submit();
    assert.equal(lookup.state.destination, `/recover/${id}`);
  }
});

test("track form uses a Raksha label and offers a read-only fixture plus explicit copy action", () => {
  const { Page } = loadPage("track/page.tsx");
  const html = renderToStaticMarkup(jsxRuntime.jsx(Page, {}));
  assert.match(html, /<label[^>]*>Raksha case ID<\/label>/);
  assert.match(html, /View read-only example/);
  assert.match(html, /data-component="@\/components\/DemoCopyButton"/);
  assert.match(html, /role="status"/);
});

test("operator keeps the selected case, reports review counts without readiness ratios, and isolates synthetic clusters", async () => {
  const { Page, reads } = loadPage("operator/page.tsx", {
    ...incident,
    extractedFacts: ["confirmed", "corrected", "unconfirmed", "missing"].map((status) => ({
      field: status, value: status === "missing" ? null : "Fictional value", source: "user", confidence: 1,
      confirmationStatus: status as Incident["extractedFacts"][number]["confirmationStatus"],
    })),
    missingFacts: ["bank"],
  });
  const html = renderToStaticMarkup(await Page({ searchParams: Promise.resolve({ caseId: id }) }));
  assert.deepEqual(reads, [id]);
  assert.ok(html.includes(`/recover/${id}`));
  assert.match(html, /2 confirmed or corrected entries; 1 unconfirmed entries; 1 open questions/);
  assert.doesNotMatch(html, /\d+\/\d+|SYN-UP-041|DEMO0001|linked neighbours/);

  const fixture = loadPage("operator/page.tsx", { ...incident, id: "DEMO0001", origin: "demo", syntheticOnly: true });
  const fixtureHtml = renderToStaticMarkup(await fixture.Page({ searchParams: Promise.resolve({}) }));
  assert.deepEqual(fixture.reads, ["DEMO0001"]);
  assert.match(fixtureHtml, /Synthetic read-only example/);
  assert.match(fixtureHtml, /not verified links/);
});

test("unknown or invalid case routes use not-found rather than resetting to the demo", async () => {
  for (const path of ["recover/[caseId]/page.tsx", "operator/page.tsx"]) {
    const missing = loadPage(path, null);
    await assert.rejects(async () => missing.Page({ params: Promise.resolve({ caseId: id }), searchParams: Promise.resolve({ caseId: id }) }), /NOT_FOUND/);
    assert.deepEqual(missing.reads, [id]);
    const invalid = loadPage(path);
    await assert.rejects(async () => invalid.Page({ params: Promise.resolve({ caseId: "bad/id" }), searchParams: Promise.resolve({ caseId: [id, id] }) }), /NOT_FOUND/);
    assert.deepEqual(invalid.reads, []);
  }
});

test("friendly not-found and error pages offer recovery without exposing exceptions", async () => {
  for (const path of ["not-found.tsx", "error.tsx"]) {
    const { Page } = loadPage(path);
    const html = renderToStaticMarkup(await Page({ error: Object.assign(new Error("private-storage-detail"), { digest: "private-digest" }), retry() {} }));
    assert.match(html, /href="\/track"/);
    assert.match(html, /Raksha case ID/);
    assert.doesNotMatch(html, /private-storage-detail|private-digest|stack trace/);
    if (path === "error.tsx") assert.match(html, /Try again/);
    else assert.match(html, /read-only synthetic example/);
  }
});
