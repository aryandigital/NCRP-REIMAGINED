import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Exercise the real handlers without adding a DOM/test-renderer dependency.
const intake = readFileSync(new URL("../src/app/check/page.tsx", import.meta.url), "utf8");
const language = readFileSync(new URL("../src/components/SiteLanguageLayer.tsx", import.meta.url), "utf8");
function declaration(source: string, name: string): string {
  const file = ts.createSourceFile("source.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let result = "";
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) result = node.getText(file);
    else ts.forEachChild(node, visit);
  }
  visit(file);
  assert.ok(result, `Missing function ${name}`);
  return result.replace("export default ", "");
}

function evaluate(source: string, context: Record<string, unknown>) {
  return vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
  }).outputText, context);
}

function harness(mode = "paste") {
  const requests: FormData[] = [];
  const session = new Map<string, string>();
  const local = new Map<string, string>();
  const timers = new Map<number, () => void>();
  let timerId = 0;
  const context: Record<string, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
    mode, text: "", identifier: "", file: null,
    loading: false, hashing: false, draftReady: true, emergency: false,
    error: "", localFingerprint: "", voiceLanguage: "en-IN", recording: false,
    fileVersionRef: { current: 0 }, fileInputRef: { current: { value: "selected.png" } },
    recognitionRef: { current: null }, FormData,
    window: {
      sessionStorage: { getItem: (key: string) => session.get(key), setItem: (key: string, value: string) => session.set(key, value), removeItem: (key: string) => session.delete(key) },
      localStorage: { removeItem: (key: string) => local.delete(key) },
      setTimeout: (fn: () => void) => { timers.set(++timerId, fn); return timerId; },
      clearTimeout: (id: number) => timers.delete(id),
    },
    fetch: async (_url: string, options: { body: FormData }) => {
      requests.push(options.body);
      return { ok: true, json: async () => ({ id: "TEST0001" }) };
    },
    router: { push: (path: string) => { context.destination = path; } },
    createLocalImageFingerprint: async () => "local-hash",
  };
  for (const key of ["mode", "text", "identifier", "file", "localFingerprint", "hashing", "dragging", "error", "loading", "recording", "draftReady", "voiceLanguage"]) {
    context[`set${key[0].toUpperCase()}${key.slice(1)}`] = (value: unknown) => { context[key] = value; };
  }
  evaluate(["clearFile", "changeMode", "clearDraft", "handleSubmit"].map((name) => declaration(intake, name)).join("\n"), context);
  return { context, requests, session, local, timers, flush: () => { for (const [id, fn] of timers) { timers.delete(id); fn(); } } };
}

const submit = { preventDefault() { } };
const image = () => new File(["synthetic test image"], "private.png", { type: "image/png" });

test("private hashing never posts and changing to every other mode clears the file", async () => {
  for (const next of ["paste", "voice", "identifier", "upload"]) {
    const { context: c, requests } = harness("private");
    c.file = image();
    await c.handleSubmit(submit);
    assert.equal(c.localFingerprint, "local-hash");
    assert.equal(requests.length, 0);
    c.changeMode(next);
    assert.equal(c.file, null);
    assert.equal(c.fileInputRef.current.value, "");
    assert.equal(c.localFingerprint, "");
    c.text = "A synthetic suspicious message";
    c.identifier = "example.test";
    await c.handleSubmit(submit);
    if (next === "upload") assert.equal(requests.length, 0);
    else assert.equal(requests[0].has("image"), false);
  }
});

test("text modes never upload even a stale file", async () => {
  for (const mode of ["paste", "voice", "identifier"]) {
    const { context: c, requests } = harness(mode);
    c.file = image();
    c.text = "Test narrative"; c.identifier = "example.test";
    await c.handleSubmit(submit);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].has("image"), false);
  }
});

test("unavailable screenshot mode rejects all submissions, including stale file and narrative state", async () => {
  const { context: c, requests } = harness("upload");
  c.file = image(); c.text = "Hidden private narrative";
  await c.handleSubmit(submit);
  assert.equal(requests.length, 0);
  assert.match(c.error, /Screenshot analysis is unavailable/);
  c.file = null;
  await c.handleSubmit(submit);
  assert.equal(requests.length, 0);
  assert.equal(c.loading, false);
  assert.doesNotMatch(declaration(intake, "handleSubmit"), /append\("image"/);
  c.changeMode("paste");
  c.text = "Fictional visible message";
  await c.handleSubmit(submit);
  assert.equal(requests.length, 1);
  assert.deepEqual([...requests[0].keys()], ["text"]);
});

test("screenshot renders explanation only; file selection and submission remain available for local hashing", () => {
  for (const mode of ["upload", "private"]) {
    const nodes: Array<{ type: unknown; props: Record<string, unknown> }> = [];
    let stateIndex = 0;
    const context: Record<string, unknown> = {
      React: { createElement: (type: unknown, props: Record<string, unknown> | null) => { nodes.push({ type, props: props ?? {} }); return null; } },
      useState: (initial: unknown) => [stateIndex++ === 0 ? mode : initial, () => {}],
      useRef: (initial: unknown) => ({ current: initial }),
      useCallback: (callback: unknown) => callback,
      useEffect: () => {},
      useRouter: () => ({}),
      useSearchParams: () => new URLSearchParams(),
    };
    const parsed = ts.createSourceFile("page.tsx", intake, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const statement of parsed.statements) {
      if (!ts.isImportDeclaration(statement)) continue;
      const clause = statement.importClause;
      if (clause?.name) context[clause.name.text] = clause.name.text;
      if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const specifier of clause.namedBindings.elements) context[specifier.name.text] ??= specifier.name.text;
      }
    }
    evaluate(declaration(intake, "CheckForm") + "\nCheckForm();", context);
    assert.equal(nodes.filter((node) => node.type === "input" && node.props.type === "file").length, mode === "private" ? 1 : 0);
    assert.equal(nodes.filter((node) => node.type === "button" && node.props.type === "submit").length, mode === "private" ? 1 : 0);
    assert.equal(nodes.filter((node) => node.props.type === "checkbox").length, 0);
    assert.equal(nodes.some((node) => node.props.id === "screenshot-unavailable"), mode === "upload");
  }
});

test("global banner restricts the prototype to fictional data without repeating the warning in navigation", () => {
  const source = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  assert.match(source, /Fictional data only/);
  assert.match(source, /Production authentication and security are not verified/);
  assert.match(source, /Do not enter real victim data/);
  const header = readFileSync(new URL("../src/components/SiteHeader.tsx", import.meta.url), "utf8");
  assert.match(header, /Prototype \/ fictional data only/);
});

test("late hash completion cannot repopulate a cleared image", async () => {
  const { context: c } = harness("private");
  let finish!: (value: string) => void;
  c.createLocalImageFingerprint = () => new Promise<string>((resolve) => { finish = resolve; });
  c.file = image();
  const pending = c.handleSubmit(submit);
  c.clearDraft();
  finish("stale fingerprint");
  await pending;
  assert.equal(c.localFingerprint, "");
  assert.equal(c.hashing, false);
});

function intakeEffects() {
  const file = ts.createSourceFile("form.tsx", declaration(intake, "CheckForm"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fn = file.statements[0] as ts.FunctionDeclaration;
  return fn.body!.statements.filter(ts.isExpressionStatement)
    .map((statement) => statement.expression)
    .filter((expression): expression is ts.CallExpression => ts.isCallExpression(expression) && expression.expression.getText(file) === "useEffect")
    .map((expression) => expression.arguments[0].getText(file));
}

test("session drafts restore, purge legacy storage, and clear without recreation", () => {
  const { context: c, session, local, flush } = harness();
  local.set("raksha-intake-draft", "legacy raw text");
  session.set("raksha-intake-draft", JSON.stringify({ text: "session text", mode: "identifier" }));
  const effects = intakeEffects();
  evaluate(`(${effects[0]})()`, c); flush();
  assert.equal(c.text, "session text");
  assert.equal(c.mode, "identifier");
  assert.equal(local.size, 0);
  c.clearDraft();
  evaluate(`(${effects[1]})()`, c); flush();
  assert.equal(session.size, 0);
  assert.equal(local.size, 0);
});

test("blocked storage does not prevent intake or draft clearing", () => {
  const { context: c, flush } = harness();
  c.window.sessionStorage = c.window.localStorage = new Proxy({}, { get() { throw new Error("blocked"); } });
  for (const effect of intakeEffects().slice(0, 2)) { evaluate(`(${effect})()`, c); flush(); }
  assert.equal(c.draftReady, true);
  assert.doesNotThrow(() => c.clearDraft());
});

test("submission suspends draft writes so success cannot recreate a cleared draft", () => {
  const { context: c, session, flush } = harness();
  c.loading = true;
  c.text = "submitted narrative";
  evaluate(`(${intakeEffects()[1]})()`, c); flush();
  assert.equal(session.size, 0);
});

test("emergency restores text but defaults to message, and no effect submits GET narratives", () => {
  const { context: c, session, requests, flush } = harness();
  c.emergency = true;
  session.set("raksha-intake-draft", JSON.stringify({ text: "draft", mode: "identifier" }));
  evaluate(`(${intakeEffects()[0]})()`, c); flush();
  assert.equal(c.mode, "paste");
  assert.equal(requests.length, 0);
  assert.doesNotMatch(intakeEffects().join("\n"), /fetch\(/);
  assert.doesNotMatch(intake, /searchParams\.get\("q"\)/);
});

test("translation preserves newer React text and restores only the current translation", () => {
  const c = { node: { data: "Message" }, dictionary: { Message: "Translated message", Updated: "Translated update" } };
  evaluate(`const originals = new WeakMap(); ${declaration(language, "translateText")}
    translateText(node, dictionary); node.data = 'Updated'; translateText(node, dictionary); translateText(node, null);`, c);
  assert.equal(c.node.data, "Updated");
});

test("operational routes and homepage never create a DOM translation observer", () => {
  for (const selectedLanguage of ["en", "hi"]) {
    for (const pathname of ["/", "/check", "/check/DEMO0001", "/shield", "/shield/test", "/track", "/report/test", "/act/test", "/recover/test", "/operator", "/new-operational-route"]) {
      evaluate(declaration(language, "SiteLanguageLayer") + "\nSiteLanguageLayer();", {
        useRakshaLanguage: () => ({ language: selectedLanguage }), usePathname: () => pathname,
        useEffect: (effect: () => void) => effect(),
        document: { querySelector() { assert.fail(`DOM translator touched ${pathname}`); } },
        MutationObserver: class { constructor() { assert.fail("Observer created"); } },
      });
    }
  }
});

test("English atlas makes one restoration pass without observing React", () => {
  let passes = 0;
  evaluate(declaration(language, "SiteLanguageLayer") + "\nSiteLanguageLayer();", {
    useRakshaLanguage: () => ({ language: "en" }), usePathname: () => "/atlas",
    useEffect: (effect: () => void) => effect(),
    document: { querySelector: () => ({ isConnected: true }) },
    window: { location: { pathname: "/atlas" } },
    translateTree: () => { passes++; },
    MutationObserver: class { disconnect() { } observe() { assert.fail("English observer started"); } },
  });
  assert.equal(passes, 1);
});

test("atlas observer cleanup cancels delayed work before an operational navigation", () => {
  let passes = 0;
  let schedule!: () => void;
  let cleanup!: () => void;
  let pending: (() => void) | undefined;
  const location = { pathname: "/atlas" };
  evaluate(declaration(language, "SiteLanguageLayer") + "\nSiteLanguageLayer();", {
    DICTIONARIES: { hi: {} },
    useRakshaLanguage: () => ({ language: "hi" }), usePathname: () => "/atlas",
    useEffect: (effect: () => () => void) => { cleanup = effect(); },
    document: { querySelector: () => ({ isConnected: true }) },
    window: { location, setTimeout: (fn: () => void) => { pending = fn; return 1; }, clearTimeout: () => { pending = undefined; } },
    translateTree: () => { passes++; },
    MutationObserver: class { constructor(fn: () => void) { schedule = fn; } disconnect() { } observe() { } },
  });
  schedule();
  const staleCallback = pending!;
  location.pathname = "/check";
  cleanup();
  assert.equal(pending, undefined);
  staleCallback();
  assert.equal(passes, 1);
});

test("bright action palette with dark ink exceeds 4.5:1 contrast", () => {
  function luminance(hex: string) {
    const rgb = hex.match(/[a-f\d]{2}/gi)!.map((pair) => parseInt(pair, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  }
  for (const fill of ["ff6f61", "6f86f5", "56cf92", "f2a950"]) assert.ok((luminance(fill) + 0.05) / (luminance("080b16") + 0.05) > 4.5);
});
