import assert from "node:assert/strict";
import { test } from "node:test";
import { startSpeechCapture, speechIssue, type CaptureIssue, type CaptureState, type SpeechRecognitionInstance, type SpeechResultEvent } from "../src/lib/speechCapture";

class Recognition implements SpeechRecognitionInstance {
  static last: Recognition;
  continuous = false;
  interimResults = false;
  lang = "";
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  onresult: ((event: SpeechResultEvent) => void) | null = null;
  starts = 0;
  stopped = false;
  constructor() { Recognition.last = this; }
  start() { this.starts++; }
  stop() { this.stopped = true; this.onend?.(); }
  result(text: string, isFinal = true) { this.onresult?.({ results: [{ isFinal, 0: { transcript: text } }] }); }
}

function capture(options: Partial<Parameters<typeof startSpeechCapture>[0]> = {}) {
  const states: CaptureState[] = [];
  const issues: CaptureIssue[] = [];
  const transcripts: string[][] = [];
  const controller = startSpeechCapture({
    Recognition, language: "en-IN", restartDelayMs: 1,
    onState: (s) => states.push(s), onIssue: (i) => issues.push(i), onTranscript: (t) => transcripts.push(t), ...options,
  });
  return { controller, recognition: Recognition.last, states, issues, transcripts };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

test("does not claim to listen until recognition actually starts", () => {
  const c = capture();
  try {
    assert.deepEqual(c.states, ["connecting"]);
    c.recognition.onstart?.();
    assert.equal(c.states.at(-1), "listening");
    assert.equal(c.recognition.lang, "en-IN");
  } finally { c.controller.stop(); }
});

test("silence restarts capture instead of declaring the microphone unavailable", async () => {
  const c = capture();
  try {
    c.recognition.onstart?.();
    c.recognition.onerror?.({ error: "no-speech" });
    c.recognition.onend?.();
    await tick();
    assert.deepEqual(c.issues, []);
    assert.equal(c.recognition.starts, 2);
    assert.equal(c.states.at(-1), "reconnecting");
  } finally { c.controller.stop(); }
});

test("repeated silence is bounded and has an actionable message", async () => {
  const c = capture();
  try {
    for (let i = 0; i < 3; i++) {
      c.recognition.onstart?.();
      c.recognition.onerror?.({ error: "no-speech" });
      c.recognition.onend?.();
      await tick();
    }
    assert.equal(c.recognition.starts, 3);
    assert.equal(c.issues[0].title, "No speech picked up yet");
    assert.equal(c.recognition.onend, null);
  } finally { c.controller.stop(); }
});

test("retains final and interim words across speech sessions without duplication", async () => {
  const c = capture({ initialLines: ["Earlier typed words."] });
  try {
    c.recognition.onstart?.();
    c.recognition.result("You are under digital arrest.", false);
    c.recognition.result("You are under digital arrest.");
    c.recognition.onend?.();
    await tick();
    c.recognition.onstart?.();
    c.recognition.result("Transfer money to a safe account.");
    assert.deepEqual(c.transcripts.at(-1), ["Earlier typed words.", "You are under digital arrest.", "Transfer money to a safe account."]);
  } finally { c.controller.stop(); }
});

test("network failure is reported as a speech service issue and preserves transcript", () => {
  const c = capture();
  c.recognition.onstart?.();
  c.recognition.result("A fictional caller's words.");
  c.recognition.onerror?.({ error: "network" });
  assert.equal(c.issues[0].title, "Speech service could not connect");
  assert.deepEqual(c.transcripts.at(-1), ["A fictional caller's words."]);
  assert.equal(c.states.at(-1), "unavailable");
  assert.equal(c.recognition.stopped, true);
});

test("permission, hardware, service and language errors have distinct recovery", () => {
  for (const code of ["not-allowed", "audio-capture", "service-not-allowed", "language-not-supported"]) {
    const c = capture();
    c.recognition.onerror?.({ error: code });
    assert.deepEqual(c.issues, [speechIssue(code)]);
    assert.equal(c.recognition.onend, null);
  }
  assert.equal(new Set(["not-allowed", "audio-capture", "service-not-allowed", "language-not-supported"].map((code) => speechIssue(code).title)).size, 4);
});

test("a stalled startup times out without an endless listening screen", async () => {
  const c = capture({ startupTimeoutMs: 3 });
  await tick();
  assert.equal(c.issues[0].title, "Speech capture did not start");
  assert.equal(c.recognition.stopped, true);
});

test("stopping during a restart cancels timers and ignores stale callbacks", async () => {
  const c = capture();
  const staleResult = c.recognition.onresult;
  const staleError = c.recognition.onerror;
  c.recognition.onend?.();
  c.controller.stop();
  staleResult?.({ results: [{ isFinal: true, 0: { transcript: "Must not appear" } }] });
  staleError?.({ error: "aborted" });
  await tick();
  assert.equal(c.recognition.starts, 1);
  assert.deepEqual(c.issues, []);
  assert.deepEqual(c.transcripts, []);
});

test("a throwing constructor becomes an unsupported-browser recovery", () => {
  const c = capture({ Recognition: class extends Recognition { constructor() { super(); throw new Error("Speech unavailable"); } } });
  assert.equal(c.issues[0].title, "Live speech is unavailable in this browser");
});
