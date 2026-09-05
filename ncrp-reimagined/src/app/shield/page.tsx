"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Keyboard, Mic, PhoneCall, Play, RotateCcw, Save, ShieldAlert, Square, Volume2, VolumeX,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { IconReport, IconRadar, IconVoice } from "@/components/icons";
import { DEMO_CALL_LINES } from "@/data/demoCall";
import { assessLocal, type ShieldAssessment } from "@/lib/shield";
import { decideEscalation, emptyAnswers, type VictimAnswers } from "@/lib/brief";
import { speechIssue, startSpeechCapture, type CaptureIssue, type CaptureState, type SpeechRecognitionCtor } from "@/lib/speechCapture";

// ── Speech API types (mirrors check/page.tsx) ──────────────────────────────
type VoiceWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

// ── Constants ───────────────────────────────────────────────────────────────
type Phase  = "idle" | "listening" | "confirm" | "saving";
type Source = "mic" | "simulation" | "text";

const IDLE_ASSESSMENT: ShieldAssessment = {
  verdict: "listening", patternSlug: null, patternName: null, stageId: null,
  confidence: 0, method: "keyword", markers: [],
  coach: { headline: "Listening…", sayThis: "", doNot: [] },
  language: "en",
};

/** Fixed blip positions on the radar (percentages), revealed as markers land. */
const BLIP_POS: Array<[number, number]> = [
  [62, 22], [78, 44], [30, 30], [55, 68], [72, 66], [24, 58], [44, 18], [66, 80],
];

const SAVING_LINES = [
  "Filtering recognised identifiers and labelled credentials…",
  "Checking transcript evidence on the server…",
  "Preparing your draft brief. Nothing is sent to authorities.",
];

function rank(a: ShieldAssessment) {
  return a.verdict === "scam" ? 2 : a.verdict === "suspicious" ? 1 : 0;
}

function fmtClock(totalSec: number) {
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ── Highlight marker quotes inside a transcript string ─────────────────────
function highlight(text: string, markers: ShieldAssessment["markers"]) {
  if (!markers.length) return text;
  const lower = text.toLowerCase();
  const ranges: Array<[number, number]> = [];
  for (const m of markers) {
    const at = lower.indexOf(m.quote.toLowerCase());
    if (at >= 0) ranges.push([at, at + m.quote.length]);
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const out: React.ReactNode[] = [];
  let cursor = 0;
  for (const [s, e] of ranges) {
    if (s < cursor) continue;
    out.push(text.slice(cursor, s));
    out.push(<mark key={s}>{text.slice(s, e)}</mark>);
    cursor = e;
  }
  out.push(text.slice(cursor));
  return out;
}

// ── YesNo button pair ────────────────────────────────────────────────────────
function YesNo({
  value, onChange, yesLabel = "Yes", noLabel = "No",
}: { value: boolean | null; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={value === true}
        onClick={() => onChange(true)}
        className={`inline-flex min-h-12 items-center rounded-full border px-6 text-sm font-bold transition-colors ${value === true ? "border-danger bg-danger text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        aria-pressed={value === false}
        onClick={() => onChange(false)}
        className={`inline-flex min-h-12 items-center rounded-full border px-6 text-sm font-bold transition-colors ${value === false ? "border-success bg-success text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}
      >
        {noLabel}
      </button>
    </div>
  );
}

// ── Question card shell ──────────────────────────────────────────────────────
function Question({
  n, title, hint, answered, children,
}: { n: number; title: React.ReactNode; hint?: string; answered: boolean; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`question-${n}`} className={`panel p-5 transition-colors sm:p-6 ${answered ? "border-service/40" : ""}`}>
      <div className="flex items-start gap-3">
        <span className={`mono-ref mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-[11px] font-bold ${answered ? "bg-service text-white" : "bg-command text-ink-soft"}`}>
          {answered ? <CheckCircle2 size={15} aria-hidden="true" /> : `Q${n}`}
        </span>
        <div className="min-w-0 flex-1">
          <p id={`question-${n}`} className="text-sm font-bold leading-6 text-ink">{title}</p>
          {hint && <p className="mt-1 text-xs leading-5 text-ink-soft">{hint}</p>}
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

const fieldCls =
  "mt-1 w-full rounded-[10px] border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-service";

// ── Main page ────────────────────────────────────────────────────────────────
export default function ShieldPage() {
  const router = useRouter();

  // Phase
  const [phase, setPhase]           = useState<Phase>("idle");
  const [source, setSource]         = useState<Source>("mic");
  const [lang, setLang]             = useState<"hi-IN" | "en-IN">("hi-IN");

  // Detection
  const [bubbles, setBubbles]       = useState<string[]>([]);
  const [assessment, setAssessment] = useState<ShieldAssessment>(IDLE_ASSESSMENT);
  const [elapsed, setElapsed]       = useState(0);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [micState, setMicState] = useState<CaptureState>("idle");
  const [micIssue, setMicIssue] = useState<CaptureIssue | null>(null);
  const [showMicSetup, setShowMicSetup] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);

  // Confirm form state
  const [answers, setAnswers]       = useState<VictimAnswers>(emptyAnswers());
  const ans = (patch: Partial<VictimAnswers>) => setAnswers((prev) => ({ ...prev, ...patch }));

  const [error, setError]           = useState("");

  // Refs
  const startedAtRef    = useRef("");
  const endedAtRef      = useRef("");
  const startMsRef      = useRef(0);
  const transcriptRef   = useRef("");
  const captureRef = useRef<ReturnType<typeof startSpeechCapture> | null>(null);
  const audioRef        = useRef<HTMLAudioElement | null>(null);
  const simTimerRef     = useRef<number | null>(null);
  const simWatchdogRef = useRef<number | null>(null);
  const advanceDemoRef = useRef<(() => void) | null>(null);
  const mutedRef = useRef(false);
  const lastAssessedRef = useRef("");
  const inFlightRef     = useRef(false);
  const listeningRef    = useRef(false);
  const sessionRef      = useRef(0);
  const assessmentRequestRef = useRef<AbortController | null>(null);
  const savingRef = useRef(false);
  const mainRef = useRef<HTMLElement | null>(null);

  function updateTranscript(lines: string[]) {
    const text = lines.join(" ").trim().slice(-12000);
    transcriptRef.current = text;
    setBubbles(lines);
    const local = assessLocal(text);
    setAssessment((prev) => (rank(local) > rank(prev) || prev.method === "keyword" ? local : prev));
  }

  useEffect(() => {
    if (phase === "idle") return;
    mainRef.current?.focus({ preventScroll: true });
    mainRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [phase]);

  // ── AI assessment on a steady 4 s cadence (reads ref, never stale) ───────
  useEffect(() => {
    if (phase !== "listening") return;
    const id = window.setInterval(async () => {
      const session = sessionRef.current;
      const t = transcriptRef.current;
      if (inFlightRef.current || t.length < 20 || t === lastAssessedRef.current) return;
      inFlightRef.current = true;
      lastAssessedRef.current = t;
      const controller = new AbortController();
      assessmentRequestRef.current = controller;
      try {
        const res = await fetch("/api/shield/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: t }),
          signal: controller.signal,
        });
        if (res.ok) {
          const { assessment: a } = (await res.json()) as { assessment: ShieldAssessment };
          if (!controller.signal.aborted && listeningRef.current && session === sessionRef.current) {
            setAssessment((prev) => (rank(a) >= rank(prev) ? a : prev));
          }
        }
      } catch { /* keep local */ }
      finally { if (session === sessionRef.current) inFlightRef.current = false; }
    }, 4000);
    return () => { window.clearInterval(id); assessmentRequestRef.current?.abort(); };
  }, [phase]);

  // ── Elapsed clock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "listening") return;
    const id = window.setInterval(() => {
      if (!endedAtRef.current) setElapsed(Math.max(0, Math.floor((Date.now() - startMsRef.current) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // ── Live mic ─────────────────────────────────────────────────────────────
  function startMic() {
    if (listeningRef.current && source !== "text") return;
    const initialLines = listeningRef.current ? [...bubbles] : [];
    if (!listeningRef.current) begin("mic");
    else setSource("mic");
    setMicIssue(null);
    captureRef.current?.stop();
    const Ctor = (window as VoiceWindow).SpeechRecognition
      ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Ctor || !window.isSecureContext) {
      setMicState("unavailable");
      setMicIssue(speechIssue("unsupported"));
      setSource("text");
      return;
    }
    const session = sessionRef.current;
    const current = () => listeningRef.current && session === sessionRef.current;
    captureRef.current = startSpeechCapture({
      Recognition: Ctor, language: lang, initialLines,
      onState: (state) => { if (current()) setMicState(state); },
      onTranscript: (lines) => { if (current()) updateTranscript(lines); },
      onIssue: (issue) => {
        if (!current()) return;
        setMicIssue(issue);
        setSource("text");
      },
    });
  }

  // ── Simulation ───────────────────────────────────────────────────────────
  function startSimulation() {
    if (listeningRef.current) {
      if (source !== "simulation" && transcriptRef.current) return;
      listeningRef.current = false;
      captureRef.current?.stop();
      audioRef.current?.pause();
      if (simTimerRef.current) window.clearTimeout(simTimerRef.current);
      if (simWatchdogRef.current) window.clearTimeout(simWatchdogRef.current);
      assessmentRequestRef.current?.abort();
    }
    begin("simulation");
    const session = sessionRef.current;
    const lines: string[] = [];
    let i = 0;
    const playNext = () => {
      if (!listeningRef.current || session !== sessionRef.current) return;
      if (simTimerRef.current) window.clearTimeout(simTimerRef.current);
      if (simWatchdogRef.current) window.clearTimeout(simWatchdogRef.current);
      if (audioRef.current) {
        audioRef.current.onended = audioRef.current.onerror = null;
        audioRef.current.pause();
      }
      if (i >= DEMO_CALL_LINES.length) {
        endedAtRef.current = new Date().toISOString();
        setPlaybackComplete(true);
        advanceDemoRef.current = null;
        return;
      }
      const line = DEMO_CALL_LINES[i++];
      setDemoStep(i);
      lines.push(line.text);
      updateTranscript([...lines]);
      const audio = new Audio(line.audio);
      audio.muted = mutedRef.current;
      audioRef.current = audio;
      let scheduled = false;
      const advance = (delay: number, unavailable = false) => {
        if (scheduled || !listeningRef.current || session !== sessionRef.current) return;
        scheduled = true;
        if (simWatchdogRef.current) window.clearTimeout(simWatchdogRef.current);
        if (unavailable) setAudioUnavailable(true);
        simTimerRef.current = window.setTimeout(playNext, delay);
      };
      advanceDemoRef.current = () => { scheduled = true; playNext(); };
      audio.onended = () => advance(600);
      audio.onerror = () => advance(5000, true);
      simWatchdogRef.current = window.setTimeout(() => advance(0, true), 20000);
      audio.play().catch(() => advance(5000, true));
    };
    playNext();
  }

  function begin(s: Source) {
    if (listeningRef.current) return;
    sessionRef.current += 1;
    setError("");
    setMicIssue(null);
    setMicState("idle");
    setDemoStep(0);
    setAudioUnavailable(false);
    setBubbles([]);
    transcriptRef.current = "";
    setAssessment(IDLE_ASSESSMENT);
    setElapsed(0);
    setPlaybackComplete(false);
    setTypedText("");
    endedAtRef.current = "";
    inFlightRef.current = false;
    lastAssessedRef.current = "";
    startedAtRef.current    = new Date().toISOString();
    startMsRef.current      = Date.now();
    listeningRef.current    = true;
    setSource(s);
    setPhase("listening");
  }

  function stop() {
    endedAtRef.current ||= new Date().toISOString();
    listeningRef.current = false;
    sessionRef.current += 1;
    assessmentRequestRef.current?.abort();
    captureRef.current?.stop();
    captureRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (simTimerRef.current) window.clearTimeout(simTimerRef.current);
    if (simWatchdogRef.current) window.clearTimeout(simWatchdogRef.current);
    advanceDemoRef.current = null;
    setMicIssue(null);
    setPhase("confirm");
  }

  useEffect(() => () => {
    listeningRef.current = false;
    sessionRef.current += 1;
    assessmentRequestRef.current?.abort();
    captureRef.current?.stop();
    audioRef.current?.pause();
    if (simTimerRef.current) window.clearTimeout(simTimerRef.current);
    if (simWatchdogRef.current) window.clearTimeout(simWatchdogRef.current);
  }, []);

  // ── Save ─────────────────────────────────────────────────────────────────
  async function saveAndContinue() {
    if (savingRef.current) return;
    if (!transcriptRef.current.trim()) {
      setError("No transcript was captured. Add a fictional transcript below before saving, or use the official help links without saving.");
      return;
    }
    savingRef.current = true;
    setPhase("saving");
    setError("");
    try {
      const res = await fetch("/api/shield/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptRef.current,
          source,
          answers,
          startedAt: startedAtRef.current,
          endedAt: endedAtRef.current || new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Could not save. Please try again.");
      }
      const { id } = (await res.json()) as { id: string };
      router.push(`/act/${id}?trigger=call`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Please try again.");
      setPhase("confirm");
    } finally {
      savingRef.current = false;
    }
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const escalationPreview = decideEscalation(answers);

  const answeredCount = [
    answers.immediateDanger !== null,
    !!(answers.victimName || answers.callbackNumber),
    !!answers.location,
    answers.moneyMoved !== null,
    answers.sharedCredentials !== null,
    !!(answers.callerNumber || answers.callerClaims),
  ].filter(Boolean).length;

  const blipCount = Math.min(assessment.markers.length, BLIP_POS.length);
  const isScam = assessment.verdict === "scam";
  const captureLabel = micState === "connecting" ? "Connecting microphone" : micState === "reconnecting" ? "Resuming speech capture" : "Microphone active";
  const signalLabel = isScam ? "Strong warning signs" : assessment.verdict === "suspicious" ? "Something isn't right" : source === "text" ? "Ready for your words" : source === "simulation" ? "Following the call" : captureLabel;

  const routeStamp =
    escalationPreview.escalation === "112"            ? { text: "ROUTE → 112", cls: "text-danger" }
    : escalationPreview.escalation === "1930"         ? { text: "ROUTE → 1930", cls: "text-danger" }
    : escalationPreview.escalation === "report-suspect" ? { text: "REPORT → NCRP", cls: "text-warning" }
    : { text: "DRAFT · CHECK FACTS", cls: "text-ink-soft" };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="shield-page min-h-[100dvh] bg-paper" data-raksha-i18n="react">
      <SiteHeader />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="shield-main public-shell py-8 pb-40 sm:py-12 sm:pb-40">

        {/* ══════════════════════ IDLE — mission briefing ══════════════════ */}
        {phase === "idle" && (
          <div className="shield-intro mx-auto max-w-5xl">
            <Link href="/" className="shield-back"><ArrowLeft size={15} aria-hidden="true" /> Home</Link>
            <header className="shield-intro-heading">
              <p className="kicker">Raksha Call Shield</p>
              <h1 className="display">Know when to <em>end the call.</em></h1>
              <p>Hear a suspicious call unfold. See the warning signs.<br className="hidden sm:block" /> Leave with the words and next steps to take back control.</p>
            </header>

            <section className="shield-stage" aria-labelledby="demo-title">
              <div className="shield-stage-topline">
                <span className="mono-ref">INTERACTIVE DEMO</span>
                <span><span className="shield-ready-dot" /> No microphone needed</span>
              </div>
              <div className="shield-stage-launch">
                <h2 id="demo-title">One call. Six moments to spot the scam.</h2>
                <button type="button" onClick={startSimulation} className="shield-launch-button">
                  <Play size={18} fill="currentColor" aria-hidden="true" /> Start guided demo <ArrowRight size={18} aria-hidden="true" />
                </button>
                <p>Synthetic voice · Hindi / Hinglish · Captions included</p>
              </div>
              <div className="shield-preview" aria-label="Example of what the demo reveals">
                <div className="shield-preview-radar" aria-hidden="true">
                  <div className="radar" data-state="idle">
                    <span className="radar-rings" /><span className="radar-sweep" />
                    <span className="radar-core"><IconRadar size={44} /></span>
                    <span className="shield-preview-pin" />
                  </div>
                  <span className="mono-ref">LISTEN → SPOT → RESPOND</span>
                </div>
                <div className="shield-preview-evidence">
                  <span className="shield-example-label">A moment from the fictional call</span>
                  <blockquote>“This is a <mark>digital arrest</mark>.<br /> <mark>Don’t tell your family.</mark>”</blockquote>
                  <div className="shield-preview-tags"><span>Authority pressure</span><span>Isolation tactic</span></div>
                  <p>See exactly which words triggered a warning, and why.</p>
                </div>
              </div>
              <div className="shield-stage-footer"><IconReport size={17} /> Finish with a reviewable brief and clear next steps.</div>
            </section>

            <div className="shield-input-options">
              <button type="button" aria-expanded={showMicSetup} aria-controls="mic-setup" onClick={() => setShowMicSetup(!showMicSetup)}>
                <IconVoice size={25} /><span><strong>Use your microphone</strong><small>Rehearse aloud or use a second device</small></span><ChevronRight size={18} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => begin("text")}>
                <Keyboard size={24} aria-hidden="true" /><span><strong>Type what you heard</strong><small>Paste a fictional call excerpt</small></span><ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
            {showMicSetup && (
              <section id="mic-setup" className="shield-mic-setup">
                <div><h2>Choose the caller’s language</h2><p>Raksha cannot join a phone call. Use speaker audio from a separate device, or rehearse aloud.</p></div>
                <div className="shield-mic-controls">
                  <label htmlFor="speech-language" className="sr-only">Caller’s language</label>
                  <select id="speech-language" value={lang} onChange={(event) => setLang(event.target.value as "hi-IN" | "en-IN")}>
                    <option value="hi-IN">हिन्दी / Hinglish</option><option value="en-IN">English</option>
                  </select>
                  <button type="button" onClick={startMic} className="btn-ink"><Mic size={17} aria-hidden="true" /> Start microphone</button>
                </div>
                <p className="shield-privacy-note">Your browser’s speech provider may receive audio. Recognised identifiers are filtered before text analysis; this is not anonymisation. Use fictional details.</p>
              </section>
            )}
            <p className="shield-intro-note">Practice safely with fictional details. Pattern matches are advisory, not proof of a scam. The demo supplies its script directly; it does not transcribe the recording.</p>
          </div>
        )}

        {/* ══════════════════════ LISTENING — the radar ═══════════════════ */}
        {phase === "listening" && (
          <div className="shield-session mx-auto max-w-6xl">
            <header className="shield-session-heading">
              <div><p className="kicker">Raksha Call Shield</p><h1 className="display">{source === "simulation" ? "A call, decoded." : "Let's look at the call."}</h1></div>
              <span className="shield-session-label">{source === "simulation" ? "Guided demo" : "Advisory screening"}</span>
            </header>
            {/* Status strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-4">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-danger">
                <span className={!playbackComplete && (source === "simulation" || (source === "mic" && micState === "listening")) ? "live-dot" : ""} aria-hidden="true" />
                {playbackComplete ? "Demo complete" : source === "mic" ? captureLabel : source === "text" ? "Text screening" : "Scripted demo"}
              </span>
              <span className="mono-ref text-xs font-bold text-ink-soft">{fmtClock(elapsed)}</span>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-faint">
                {source === "mic" ? (lang === "hi-IN" ? "Hindi / Hinglish speech" : "English speech") : "Advisory screening"}
              </span>
              {source === "simulation" && (
                <span className="rounded-full border border-warning/50 bg-warning-soft px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                  Synthetic call · not a real recording
                </span>
              )}
              <span className="ml-auto text-[11px] text-ink-faint">
                {assessment.method === "model" ? "AI-assisted pattern review" : "Local pattern review"}
              </span>
            </div>

            <div className="shield-actionbar flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3">
              <button type="button" onClick={stop} className="btn-ink flex-1">
                {playbackComplete ? <ArrowRight size={16} aria-hidden="true" /> : <Square size={16} aria-hidden="true" />} {playbackComplete ? "Review & get help" : "Stop screening & get help"}
              </button>
              <p className="text-xs text-ink-soft">{source === "simulation" ? "Explore at your pace. You can stop at any point." : "End the phone call yourself. Raksha cannot hang up for you."}</p>
            </div>

            {source === "simulation" && (
              <section className="shield-playback" aria-label="Demo playback">
                <div className="shield-playback-top"><span className="mono-ref">{playbackComplete ? "CALL COMPLETE" : `MOMENT ${demoStep} OF ${DEMO_CALL_LINES.length}`}</span><strong>{["", "The introduction", "The accusation", "The pressure", "The isolation", "The money demand", "The threat"][demoStep]}</strong></div>
                <div className="shield-demo-progress" role="progressbar" aria-label="Demo progress" aria-valuemin={0} aria-valuemax={DEMO_CALL_LINES.length} aria-valuenow={playbackComplete ? DEMO_CALL_LINES.length : demoStep - 1}>
                  {DEMO_CALL_LINES.map((line, index) => <span key={line.id} data-progress={playbackComplete || index < demoStep - 1 ? "done" : index === demoStep - 1 ? "current" : "next"} />)}
                </div>
                <div className="shield-playback-controls">
                  <button type="button" aria-pressed={muted} onClick={() => { mutedRef.current = !muted; setMuted(!muted); if (audioRef.current) audioRef.current.muted = !muted; }}>
                    {muted ? <VolumeX size={17} /> : <Volume2 size={17} />} {muted ? "Unmute demo" : "Mute demo"}
                  </button>
                  <span>{audioUnavailable ? "Audio unavailable · captions continue" : "Synthetic voice · captions supplied by script"}</span>
                  {playbackComplete ? <button type="button" onClick={startSimulation}><RotateCcw size={16} /> Replay demo</button> : <button type="button" onClick={() => advanceDemoRef.current?.()}>Next moment <ChevronRight size={16} /></button>}
                </div>
              </section>
            )}

            {micIssue && (
              <section className="shield-capture-notice" aria-label="Speech capture status">
                <div role="status"><h2>{micIssue.title}</h2><p>{micIssue.detail}</p>{bubbles.length > 0 && <p className="shield-transcript-kept"><CheckCircle2 size={15} /> Your transcript is kept. Continue below or retry.</p>}</div>
                <div className="shield-notice-actions">
                  {micIssue.retryable && <button type="button" onClick={startMic} className="btn-ghost"><RotateCcw size={16} /> Retry microphone</button>}
                  {bubbles.length === 0 && <button type="button" onClick={startSimulation} className="btn-ink"><Play size={16} /> Start guided demo</button>}
                </div>
              </section>
            )}

            {source === "text" && (
              <form className="shield-text-form panel mt-4 p-4" onSubmit={(event) => {
                event.preventDefault();
                if (!typedText.trim()) return;
                updateTranscript([...bubbles, typedText.trim()]);
                setTypedText("");
              }}>
                <label htmlFor="heard-text" className="text-sm font-bold">What did you hear? Use fictional details, never actual credentials.</label>
                <textarea id="heard-text" value={typedText} maxLength={3000} onChange={(event) => setTypedText(event.target.value)} placeholder="For example: They said I was under digital arrest and must transfer money to a safe account…" className={fieldCls} rows={3} />
                <button type="submit" disabled={!typedText.trim()} className="btn-ghost mt-2">Add to screening</button>
              </form>
            )}
            {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

            <div className="shield-workspace mt-6 grid gap-5 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
              {/* ── Left: radar + verdict ─────────────────────────────── */}
              <section
                aria-label="Pattern assessment"
                className={`shield-signal-panel panel p-6 ${isScam ? "is-warning" : assessment.verdict === "suspicious" ? "is-caution" : ""}`}
              >
                <p className="shield-signal-eyebrow mono-ref">CALL SIGNAL</p>
                <div className="radar" data-state={isScam ? "danger" : assessment.verdict !== "listening" ? "suspicious" : (source === "mic" && micState === "listening") || (source === "simulation" && !playbackComplete) ? "listening" : "idle"}>
                  <div className="radar-rings" aria-hidden="true" />
                  <div className="radar-sweep" aria-hidden="true" />
                  {Array.from({ length: blipCount }).map((_, i) => (
                    <span
                      key={i}
                      className="radar-blip"
                      style={{ left: `${BLIP_POS[i][0]}%`, top: `${BLIP_POS[i][1]}%` }}
                      aria-hidden="true"
                    />
                  ))}
                  <div className="radar-core">
                    <div>
                      {isScam ? <ShieldAlert size={30} aria-hidden="true" /> : <IconRadar size={34} />}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h2 className="shield-signal-title" aria-live="polite" aria-atomic="true">{signalLabel}</h2>
                  {assessment.patternName && (
                    <p className="mt-2 text-sm font-bold text-ink">{assessment.patternName}</p>
                  )}
                  <p className="shield-evidence-count">{assessment.markers.length ? `${assessment.markers.length} warning ${assessment.markers.length === 1 ? "sign" : "signs"} found in the words` : "No warning signs identified yet"}</p>
                  <p className="mt-4 text-sm leading-6 text-ink-soft">{assessment.verdict !== "listening" ? assessment.coach.headline : source === "text" ? "Add the caller's words to start the review." : source === "simulation" ? "Follow the captions. Pressure tactics will be highlighted as they appear." : micState === "listening" ? "Speak clearly. The caller's words will appear beside the signal." : "Waiting for your browser to start speech capture. You can stop at any time."}</p>
                  <p className="mt-3 text-xs text-ink-faint">Pattern matches are advisory. A missing warning does not mean the call is safe.</p>
                </div>
              </section>

              {/* ── Right: coach + transcript ─────────────────────────── */}
              <div className="flex min-w-0 flex-col gap-4">
                {/* SAY THIS NOW — the glanceable coach */}
                {assessment.verdict !== "listening" && assessment.coach.sayThis && (
                  <section className="say-now p-5 sm:p-6">
                    <p className="kicker text-danger">Say this now — then hang up</p>
                    <p className="display mt-3 text-2xl leading-snug text-ink sm:text-[1.9rem]">
                      &ldquo;{assessment.coach.sayThis}&rdquo;
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">Ruko · do not</p>
                        <ul className="mt-1.5 space-y-1">
                          {assessment.coach.doNot.map((d) => (
                            <li key={d} className="flex gap-2 text-[13px] leading-5 text-ink-soft">
                              <span className="text-danger" aria-hidden="true">✕</span>{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-end gap-2">
                        {isScam && (
                          <button
                            type="button"
                            onClick={stop}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-danger px-4 text-sm font-bold text-white hover:brightness-110"
                          >
                            <Square size={16} aria-hidden="true" />
                            Choose the right help
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* Live transcript — caller bubbles */}
                <section className="panel min-w-0 flex-1 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                      {source === "simulation" ? "Fictional script" : "Screening transcript (speaker not verified)"}
                    </p>
                    <p className="mono-ref text-[11px] text-ink-faint">
                      {bubbles.length} line{bubbles.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto break-words">
                    {bubbles.length === 0 && (
                      <p className="text-sm text-ink-faint">
                        {source === "simulation" ? "Starting the fictional script…" : source === "text" ? "Add a fictional transcript above." : "Waiting for speech…"}
                      </p>
                    )}
                    {bubbles.map((b, i) => (
                      <p key={i} className="caller-bubble text-sm leading-6 text-ink">
                        {highlight(b, assessment.markers)}
                      </p>
                    ))}
                  </div>
                  {assessment.markers.length > 0 && (
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                        Why these are red flags
                      </p>
                      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                        {assessment.markers.map((m, i) => (
                          <li key={`${m.quote}-${i}`} className="rounded-[10px] border border-danger/25 bg-danger-soft p-3 text-[13px]">
                            <span className="font-semibold text-ink">&ldquo;{m.quote}&rdquo;</span>
                            <span className="mt-0.5 block text-ink-soft">{m.why}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {/* Exit actions */}
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <button
                    type="button"
                    onClick={stop}
                    className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-bold text-white ${isScam ? "bg-danger hover:brightness-110" : "bg-service hover:bg-command"}`}
                  >
                    <PhoneCall size={18} aria-hidden="true" />
                     Continue to help
                  </button>
                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Stop listening"
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-bold text-ink hover:border-line-strong"
                  >
                    <Square size={15} aria-hidden="true" /> Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════ CONFIRM — the dispatch desk ═════════════ */}
        {phase === "confirm" && (
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-success/40 bg-success-soft p-5">
              <p className="flex items-start gap-3 text-sm font-bold leading-6 text-ink">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                Screening stopped. If the call is still connected, end it yourself.
                These questions are optional; unanswered facts stay unknown. Use fictional details only.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="progress-cells flex-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className={i < answeredCount ? "is-done" : ""} />
                  ))}
                </div>
                <span className="mono-ref text-xs font-bold text-ink-soft">{answeredCount}/6</span>
              </div>
            </div>
            <div className="shield-actionbar flex flex-wrap items-center gap-3 rounded-xl border border-line bg-paper p-3 shadow-lg">
              <button type="button" onClick={saveAndContinue} className="btn-ink flex-1"><Save size={16} aria-hidden="true" /> Prepare draft brief</button>
              {(escalationPreview.escalation === "112" || escalationPreview.escalation === "1930") && (
                <a href={`tel:${escalationPreview.escalation}`} className="btn-ghost">Call {escalationPreview.escalation} yourself</a>
              )}
              <p className="w-full text-xs text-ink-soft">In a real emergency, call now. These questions can wait. Never call emergency services to test the demo.</p>
              {!transcriptRef.current.trim() && <button type="button" className="btn-ghost" onClick={() => begin("text")}>Add a fictional transcript</button>}
            </div>
            {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
              {/* ── Questions ─────────────────────────────────────────── */}
              <div className="flex min-w-0 flex-col gap-4">
                <Question
                  n={1}
                  answered={answers.immediateDanger !== null}
                  title="Are you in immediate physical danger right now, or being stopped from leaving or hanging up?"
                >
                  <YesNo
                    value={answers.immediateDanger}
                    onChange={(v) => ans({ immediateDanger: v })}
                    yesLabel="Yes — I am in danger"
                    noLabel="No — I am safe"
                  />
                  {answers.immediateDanger === true && (
                    <div className="q-reveal mt-4">
                      <a
                        href="tel:112"
                        className="flex min-h-14 items-center justify-center gap-2 rounded-[12px] bg-danger px-5 text-base font-bold text-white hover:brightness-110"
                      >
                        <PhoneCall size={20} aria-hidden="true" />
                        Call 112 now (India unified emergency)
                        <span className="rounded-full border border-white/40 px-2 py-0.5 text-[11px]">
                          Opens your dialler
                        </span>
                      </a>
                      <p className="mt-2 text-xs text-ink-soft">
                        In a real emergency, call now; the questions can wait. Do not call 112 to test this demo.
                      </p>
                    </div>
                  )}
                </Question>

                <Question
                  n={2}
                  answered={!!(answers.victimName || answers.callbackNumber)}
                  title="Fictional contact details (optional)"
                  hint="These appear in the draft you review. Nothing is sent to authorities. Do not enter a real victim's details."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="victim-name" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Your name</label>
                      <input
                        id="victim-name"
                        maxLength={300}
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={answers.victimName ?? ""}
                        onChange={(e) => ans({ victimName: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="callback-number" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Callback number</label>
                      <input
                        id="callback-number"
                        maxLength={300}
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={answers.callbackNumber ?? ""}
                        onChange={(e) => ans({ callbackNumber: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                  </div>
                </Question>

                <Question
                  n={3}
                  answered={!!answers.location}
                  title="Your city / state"
                  hint="Adds location context to the draft. Raksha does not route or file complaints."
                >
                  <input
                    aria-label="Your city / state"
                    maxLength={300}
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={answers.location ?? ""}
                    onChange={(e) => ans({ location: e.target.value || null })}
                    className={fieldCls}
                  />
                </Question>

                <Question
                  n={4}
                  answered={answers.moneyMoved !== null}
                  title="Has any money moved?"
                >
                  <YesNo
                    value={answers.moneyMoved}
                    onChange={(v) => ans(v ? { moneyMoved: true } : { moneyMoved: false, amountInr: null, bankOrWallet: null, paidAt: null, utr: null })}
                    yesLabel="Yes, money moved"
                    noLabel="No"
                  />
                  {answers.moneyMoved === true && (
                    <div className="q-reveal mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="amount" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Amount (INR)</label>
                        <input
                          id="amount"
                          type="number"
                          min={0}
                          placeholder="24999"
                          value={answers.amountInr ?? ""}
                          onChange={(e) => ans({ amountInr: e.target.value ? Number(e.target.value) : null })}
                          className={fieldCls}
                        />
                      </div>
                      <div>
                        <label htmlFor="bank-wallet" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Bank or wallet</label>
                        <input
                          id="bank-wallet"
                          maxLength={300}
                          type="text"
                          placeholder="HDFC Bank / PhonePe"
                          value={answers.bankOrWallet ?? ""}
                          onChange={(e) => ans({ bankOrWallet: e.target.value || null })}
                          className={fieldCls}
                        />
                      </div>
                      <div>
                        <p className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Approximate transfer time (optional)</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(["Just now", "~10 min ago", "~1 hour ago"] as const).map((chip) => {
                            const offsets: Record<string, number> = { "Just now": 0, "~10 min ago": 10, "~1 hour ago": 60 };
                            const iso = new Date(Date.now() - offsets[chip] * 60_000).toISOString();
                            const active = answers.paidAt && Math.abs(new Date(answers.paidAt).getTime() - new Date(iso).getTime()) < 120_000;
                            return (
                              <button
                                key={chip}
                                type="button"
                                aria-pressed={!!active}
                                onClick={() => ans({ paidAt: iso })}
                                className={`inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-semibold transition-colors ${active ? "border-service bg-service text-white" : "border-line bg-surface text-ink hover:border-line-strong"}`}
                              >
                                {chip}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="utr" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">UTR / RRN (if you have it)</label>
                        <input
                          id="utr"
                          maxLength={300}
                          type="text"
                          placeholder="418722339012"
                          value={answers.utr ?? ""}
                          onChange={(e) => ans({ utr: e.target.value || null })}
                          className={fieldCls}
                        />
                      </div>
                    </div>
                  )}
                </Question>

                <Question
                  n={5}
                  answered={answers.sharedCredentials !== null}
                  title="Did you share an OTP, PIN or CVV, install an app, or give screen access?"
                  hint="Just yes or no. Never type the OTP or PIN itself here."
                >
                  <YesNo value={answers.sharedCredentials} onChange={(v) => ans({ sharedCredentials: v })} />
                </Question>

                <Question
                  n={6}
                  answered={!!(answers.callerNumber || answers.callerClaims)}
                  title="About the caller"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="caller-number" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Caller&apos;s number</label>
                      <input
                        id="caller-number"
                        maxLength={300}
                        type="tel"
                        placeholder="+91 70000 12345"
                        value={answers.callerNumber ?? ""}
                        onChange={(e) => ans({ callerNumber: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="caller-claims" className="block text-[11px] font-bold uppercase tracking-wider text-ink-faint">Claimed to be</label>
                      <input
                        id="caller-claims"
                        maxLength={300}
                        type="text"
                        placeholder="CBI officer / SBI customer care"
                        value={answers.callerClaims ?? ""}
                        onChange={(e) => ans({ callerClaims: e.target.value || null })}
                        className={fieldCls}
                      />
                    </div>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={answers.reportingForSomeoneElse}
                      onChange={(e) => ans({ reportingForSomeoneElse: e.target.checked })}
                      className="h-4 w-4 rounded border-line"
                    />
                    I am filling this in on behalf of someone else (parent, family member)
                  </label>
                </Question>
              </div>

              {/* ── Live dispatch ticket ───────────────────────────────── */}
              <aside className="ticket p-5 lg:sticky lg:top-24" aria-live="polite">
                <div className="flex items-center justify-between gap-3">
                  <p className="mono-ref text-[11px] font-bold uppercase tracking-[.16em] text-ink-faint">
                    Raksha dispatch · draft
                  </p>
                  <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-faint">
                    not sent
                  </span>
                </div>
                <div className="mt-4 font-mono text-[13px] leading-6">
                  {(
                    [
                      ["VICTIM", answers.victimName],
                      ["CALLBACK", answers.callbackNumber],
                      ["LOCATION", answers.location],
                      ["DANGER", answers.immediateDanger === null ? null : answers.immediateDanger ? "YES — immediate" : "no"],
                      ["MONEY", answers.moneyMoved === null ? null : answers.moneyMoved ? `${answers.amountInr ? `₹${answers.amountInr.toLocaleString("en-IN")}` : "moved"}${answers.bankOrWallet ? ` · ${answers.bankOrWallet}` : ""}${answers.utr ? ` · UTR ${answers.utr}` : ""}` : "no loss"],
                      ["ACCESS", answers.sharedCredentials === null ? null : answers.sharedCredentials ? "compromised" : "not shared"],
                      ["SUSPECT", answers.callerNumber ?? answers.callerClaims],
                    ] as Array<[string, string | null]>
                  ).map(([k, v]) => (
                    <div key={k} className="ticket-row">
                      <span className="text-ink-faint">{k}</span>
                      <span className={`min-w-0 break-words text-right ${v ? "text-ink" : "text-ink-faint/50"}`}>{v ?? "Unknown"}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-dashed border-line pt-4 text-center">
                  <span className={`ticket-stamp ${routeStamp.cls}`}>{routeStamp.text}</span>
                  <p className="mt-3 text-[11px] leading-5 text-ink-faint">{escalationPreview.reason}</p>
                </div>
                <div className="mt-5 grid gap-2">
                  <button
                    type="button"
                    onClick={saveAndContinue}
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-service px-6 text-sm font-bold text-white hover:bg-command"
                  >
                    <Save size={17} aria-hidden="true" />
                    Prepare draft brief
                  </button>
                  <button
                    type="button"
                    onClick={saveAndContinue}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-6 text-sm font-bold text-ink hover:border-line-strong"
                  >
                    Skip remaining questions
                  </button>
                  <p className="text-center text-[11px] text-ink-faint">
                    Nothing is sent to any authority. You choose what happens next.
                  </p>
                </div>
                {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
              </aside>
            </div>
          </div>
        )}

        {/* ══════════════════════ SAVING ══════════════════════════════════ */}
        {phase === "saving" && (
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="radar radar-idle mx-auto" data-state="listening" style={{ width: 140 }}>
              <div className="radar-rings" aria-hidden="true" />
              <div className="radar-sweep" aria-hidden="true" />
              <div className="radar-core">
                <div style={{ height: 48, width: 48 }}><Save size={20} aria-hidden="true" /></div>
              </div>
            </div>
            <p className="mt-6 text-base font-bold text-ink">Preparing your brief</p>
            <ul className="mt-4 space-y-2">
              {SAVING_LINES.map((line, i) => (
                <li key={line} className="q-reveal mono-ref text-xs text-ink-soft" style={{ animationDelay: `${i * 600}ms` }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
