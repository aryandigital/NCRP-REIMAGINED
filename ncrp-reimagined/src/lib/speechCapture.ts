/** Browser speech capture lifecycle. A missing speech service is not a broken microphone. */
export type SpeechResultEvent = {
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

export type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

export type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
export type CaptureState = "idle" | "connecting" | "listening" | "reconnecting" | "unavailable";
export type CaptureIssue = { title: string; detail: string; retryable: boolean };

export function speechIssue(code: string): CaptureIssue {
  switch (code) {
    case "not-allowed":
      return { title: "Microphone access is blocked", detail: "Allow microphone access in this site's browser settings, then retry. You can also type the caller's words below.", retryable: true };
    case "audio-capture":
      return { title: "No microphone input found", detail: "Connect a microphone and check your device's input settings. Close other apps using it, then retry.", retryable: true };
    case "network":
      return { title: "Speech service could not connect", detail: "Check your connection, or open this page in Chrome or Edge. Some browsers expose speech controls without a working speech service.", retryable: true };
    case "service-not-allowed":
    case "unsupported":
      return { title: "Live speech is unavailable in this browser", detail: "Try Chrome or Edge for live speech. The guided demo and typed screening work here without microphone access.", retryable: false };
    case "language-not-supported":
      return { title: "This speech language is unavailable", detail: "Try another speech language or type the caller's words. Your browser's speech service controls language availability.", retryable: false };
    case "no-speech":
      return { title: "No speech picked up yet", detail: "Check your input volume and speak close to the microphone, then retry. You can also type what you heard.", retryable: true };
    case "timeout":
      return { title: "Speech capture did not start", detail: "Check for a microphone permission prompt. If there isn't one, try Chrome or Edge, or continue by typing.", retryable: true };
    default:
      return { title: "Speech capture was interrupted", detail: "Retry microphone capture, or continue by typing the caller's words.", retryable: true };
  }
}

export function startSpeechCapture(options: {
  Recognition: SpeechRecognitionCtor;
  language: string;
  initialLines?: string[];
  onState: (state: CaptureState) => void;
  onTranscript: (lines: string[]) => void;
  onIssue: (issue: CaptureIssue) => void;
  startupTimeoutMs?: number;
  restartDelayMs?: number;
}) {
  let recognition: SpeechRecognitionInstance | undefined;
  let active = true;
  let previous = [...(options.initialLines ?? [])];
  let current: string[] = [];
  let emptyEnds = 0;
  let startupTimer: ReturnType<typeof setTimeout> | undefined;
  let restartTimer: ReturnType<typeof setTimeout> | undefined;

  function release() {
    clearTimeout(startupTimer);
    clearTimeout(restartTimer);
    if (!recognition) return;
    recognition.onstart = recognition.onend = recognition.onerror = recognition.onresult = null;
    try { if (recognition.abort) recognition.abort(); else recognition.stop(); } catch { /* already stopped */ }
  }

  function fail(code: string) {
    if (!active) return;
    active = false;
    release();
    options.onState("unavailable");
    options.onIssue(speechIssue(code));
  }

  function start(restarting = false) {
    if (!active || !recognition) return;
    options.onState(restarting ? "reconnecting" : "connecting");
    startupTimer = setTimeout(() => fail("timeout"), options.startupTimeoutMs ?? 12000);
    try { recognition.start(); } catch (error) {
      fail(error instanceof Error && error.name === "NotAllowedError" ? "not-allowed" : "interrupted");
    }
  }

  try {
    recognition = new options.Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = options.language;
    recognition.onstart = () => {
      if (!active) return;
      clearTimeout(startupTimer);
      options.onState("listening");
    };
    recognition.onresult = (event) => {
      if (!active) return;
      current = Array.from(event.results, (result) => result[0].transcript.trim()).filter(Boolean);
      if (current.length) emptyEnds = 0;
      options.onTranscript([...previous, ...current]);
    };
    recognition.onerror = (event) => {
      if (!active) return;
      // Silence is expected between sentences. onend restarts with bounded retries.
      if (event.error === "no-speech") return;
      fail(event.error);
    };
    recognition.onend = () => {
      if (!active) return;
      clearTimeout(startupTimer);
      emptyEnds = current.length ? 0 : emptyEnds + 1;
      previous = [...previous, ...current];
      current = [];
      if (emptyEnds >= 3) { fail("no-speech"); return; }
      options.onState("reconnecting");
      restartTimer = setTimeout(() => start(true), options.restartDelayMs ?? 350);
    };
    start();
  } catch {
    fail("unsupported");
  }

  return {
    stop() {
      active = false;
      release();
    },
  };
}
