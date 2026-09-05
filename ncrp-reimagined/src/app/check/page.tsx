"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileImage, Fingerprint, Link2, MessageSquareText, Mic, PhoneCall, Search, ShieldCheck, Square, Upload } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { createLocalImageFingerprint } from "@/lib/hash";

type Mode = "paste" | "voice" | "upload" | "identifier" | "private";

type SpeechResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type VoiceWindow = Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; };

function CheckForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hashing, setHashing] = useState(false);
  const [localFingerprint, setLocalFingerprint] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("en-IN");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const fileVersionRef = useRef(0);
  const emergency = requestedMode === "emergency";
  const recovery = requestedMode === "lost";

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (emergency) {
        setMode("paste");
        setFile(null);
        setLocalFingerprint("");
        fileVersionRef.current += 1;
        setHashing(false);
      }
      // Remove drafts left by earlier versions; never migrate sensitive text.
      try { window.localStorage.removeItem("raksha-intake-draft"); } catch { /* storage blocked */ }
      try {
        const saved = window.sessionStorage.getItem("raksha-intake-draft");
        if (saved) {
          const draft = JSON.parse(saved) as { mode?: Mode; text?: string; identifier?: string; voiceLanguage?: string };
          if (!emergency && draft.mode && ["paste", "voice", "upload", "identifier", "private"].includes(draft.mode)) setMode(draft.mode);
          if (typeof draft.text === "string") setText(draft.text);
          if (typeof draft.identifier === "string") setIdentifier(draft.identifier);
          if (typeof draft.voiceLanguage === "string") setVoiceLanguage(draft.voiceLanguage);
        }
      } catch {
        // A blocked or malformed local draft should never stop intake.
      } finally {
        setDraftReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [emergency]);

  useEffect(() => {
    if (!draftReady || loading) return;
    const timeout = window.setTimeout(() => {
      try {
        if (text || identifier) window.sessionStorage.setItem("raksha-intake-draft", JSON.stringify({ mode, text, identifier, voiceLanguage }));
        else window.sessionStorage.removeItem("raksha-intake-draft");
      } catch { /* Intake still works when storage is blocked or full. */ }
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [draftReady, identifier, loading, mode, text, voiceLanguage]);

  useEffect(() => () => {
    fileVersionRef.current += 1;
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.stop();
    }
  }, []);

  function clearFile() {
    fileVersionRef.current += 1;
    setFile(null);
    setLocalFingerprint("");
    setHashing(false);
    setDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function changeMode(next: Mode) {
    if (next === mode) return;
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
    }
    setRecording(false);
    clearFile();
    setMode(next);
    setError("");
  }

  function clearDraft() {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.stop();
    }
    setRecording(false);
    setText("");
    setIdentifier("");
    clearFile();
    setError("");
    try { window.sessionStorage.removeItem("raksha-intake-draft"); } catch { /* storage blocked */ }
    try { window.localStorage.removeItem("raksha-intake-draft"); } catch { /* storage blocked */ }
  }

  const selectFile = useCallback((selected: File | undefined) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, WEBP, or HEIC image.");
      return;
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError("Keep the image under 8 MB.");
      return;
    }
    setError("");
    fileVersionRef.current += 1;
    setHashing(false);
    setLocalFingerprint("");
    setFile(selected);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }, [selectFile]);

  function toggleVoiceCapture() {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = (window as VoiceWindow).SpeechRecognition ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice capture is not supported in this browser. Use the text box instead.");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceLanguage;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = 0; index < event.results.length; index += 1) transcript += event.results[index][0].transcript;
      setText(transcript.trim());
    };
    recognition.onerror = () => {
      setRecording(false);
      setError("Voice capture stopped. Check microphone access or continue by typing the transcript.");
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    setError("");
    setRecording(true);
    try { recognition.start(); } catch {
      setRecording(false);
      setError("Voice capture could not start. Continue by typing instead.");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (loading || hashing || !draftReady) return;
    setError("");

    if (mode === "upload") {
      setError("Screenshot analysis is unavailable in this prototype. Use Message to type or paste fictional visible message text instead.");
      return;
    }

    if (mode === "private") {
      if (!file) {
        setError("Choose the image you want to fingerprint on this device.");
        return;
      }
      setHashing(true);
      const version = fileVersionRef.current;
      try {
        const fingerprint = await createLocalImageFingerprint(file);
        if (fileVersionRef.current === version) setLocalFingerprint(fingerprint);
      } catch {
        if (fileVersionRef.current === version) setError("This image could not be fingerprinted in the browser.");
      } finally {
        if (fileVersionRef.current === version) setHashing(false);
      }
      return;
    }

    const body = (mode === "identifier" ? identifier : text).trim();
    if (!body) {
      setError("Enter fictional message text or an example identifier to check.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("text", body);
      const response = await fetch("/api/analyze", { method: "POST", body: form });
      if (!response.ok) throw new Error("Analysis failed");
      const { id } = await response.json() as { id: string };
      if (!id || typeof id !== "string") throw new Error("Missing incident ID");
      try { window.sessionStorage.removeItem("raksha-intake-draft"); } catch { /* storage blocked */ }
      router.push(`/check/${id}`);
    } catch {
      setError("Analysis is unavailable right now. Use the example case or try again.");
      setLoading(false);
    }
  }

  const tabs: Array<{ id: Mode; label: string; icon: typeof MessageSquareText }> = [
    { id: "paste", label: "Message", icon: MessageSquareText },
    { id: "voice", label: "Voice", icon: Mic },
    { id: "upload", label: "Screenshot (unavailable)", icon: FileImage },
    { id: "identifier", label: "Number or link", icon: Link2 },
    { id: "private", label: "Private image hash", icon: Fingerprint },
  ];

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader current="check" />
      <main id="main-content" lang="en" className="public-shell py-8 sm:py-12">
        <section aria-label="Immediate help" className="panel mb-6 border-danger/40 bg-danger-soft p-4">
          <p className="text-sm font-bold text-ink">You do not need to finish this form to get help.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a href="tel:112" className="inline-flex min-h-11 items-center rounded-[8px] bg-danger px-4 text-sm font-bold text-white">Call 112: immediate danger</a>
            <a href="tel:1930" className="inline-flex min-h-11 items-center rounded-[8px] bg-danger px-4 text-sm font-bold text-white">Call 1930: financial cyber fraud</a>
          </div>
        </section>
        <div className="stage-rail bg-surface" aria-label="Incident stages">
          {["Triage", "Tell the story", "Confirm facts", "Act and track"].map((label, index) => <div key={label} className={index === 0 ? "is-active" : "opacity-60"}><span className="block font-mono text-[10px] font-bold">0{index + 1}</span><span className="mt-1 block text-xs font-bold">{label}</span></div>)}
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> Back to response desk</Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
            <div>
              <p className="kicker">Step 01 / incident intake</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Show us what happened.</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">Use fictional data only to explore possible scam patterns and suggested next steps. This prototype is not ready for real victim data. Guidance can be wrong; this is not an official report.</p>

              {(emergency || recovery) && <div className={`mt-6 panel p-4 ${emergency ? "border-danger/40 bg-danger-soft" : "border-warning/40 bg-warning-soft"}`}><p className={`text-sm font-bold ${emergency ? "text-danger" : "text-warning"}`}>{emergency ? "If money is leaving now, call 1930 before you finish this form." : "Start with the incident record. We will keep the recovery actions in view."}</p><p className="mt-2 text-xs leading-5 text-ink-soft">This environment does not transmit reports to authorities.</p></div>}

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
                  <p>Fictional text drafts are kept in this tab&apos;s session. Session storage is not a privacy guarantee; do not enter real victim data.</p>
                  <button type="button" onClick={clearDraft} disabled={!draftReady || loading} className="min-h-11 font-bold text-service underline underline-offset-4">Clear draft and image</button>
                </div>
                <div className="panel p-2">
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3" role="group" aria-label="Choose intake method">
                    {tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} type="button" aria-pressed={mode === tab.id} disabled={loading || !draftReady} onClick={() => changeMode(tab.id)} className={`flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-2 text-xs font-bold sm:px-3 ${mode === tab.id ? "bg-command text-white" : "text-ink-soft hover:bg-paper hover:text-ink"}`}><Icon size={15} aria-hidden="true" /><span>{tab.label}</span></button>; })}
                  </div>
                </div>

                {mode === "paste" && <div className="panel p-5"><label htmlFor="incident-message" className="block text-sm font-bold text-ink">Paste the message or conversation</label><textarea id="incident-message" value={text} onChange={(event) => setText(event.target.value)} placeholder={'Example: Your SBI account will be blocked. Share the OTP to verify.'} className="mt-3 min-h-[190px] w-full resize-y rounded-[8px] border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" /><p className="mt-3 text-xs leading-5 text-ink-faint">English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.</p></div>}

                {mode === "voice" && <div className="panel p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="block text-sm font-bold text-ink">Tell the story in your own words</p>
                      <p className="mt-2 text-xs leading-5 text-ink-soft">Optional browser speech recognition may send audio to your browser&apos;s speech provider. On-device processing is not guaranteed. Language availability and accuracy vary.</p>
                    </div>
                    <label className="block sm:w-40">
                      <span className="block text-[10px] font-bold uppercase tracking-[.1em] text-ink-faint">Voice language</span>
                      <select id="voice-language" value={voiceLanguage} onChange={(event) => setVoiceLanguage(event.target.value)} className="mt-2 min-h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-xs font-semibold text-ink focus:border-service focus:bg-surface focus:outline-none">
                        <option value="en-IN">English / India</option>
                        <option value="hi-IN">हिन्दी</option>
                        <option value="ta-IN">தமிழ்</option>
                        <option value="te-IN">తెలుగు</option>
                        <option value="bn-IN">বাংলা</option>
                        <option value="mr-IN">मराठी</option>
                      </select>
                    </label>
                  </div>
                  <button type="button" onClick={toggleVoiceCapture} className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-bold ${recording ? "bg-danger text-white" : "bg-command text-white"}`} aria-pressed={recording}>{recording ? <Square size={15} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}{recording ? "Stop recording" : "Start recording"}</button>
                  <label htmlFor="voice-transcript" className="mt-5 block text-sm font-bold text-ink">Transcript</label>
                  <textarea id="voice-transcript" value={text} onChange={(event) => setText(event.target.value)} placeholder="Your words will appear here. You can edit them before analysis." className="mt-3 min-h-[170px] w-full resize-y rounded-[8px] border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" />
                  <p className="mt-3 text-xs leading-5 text-ink-soft">Review the transcript before analysis. Starting recording may send audio to the speech provider; Raksha receives the transcript only when you submit it.</p>
                </div>}

                {mode === "upload" && <section className="panel border-warning/40 bg-warning-soft p-5" aria-labelledby="screenshot-unavailable">
                  <h2 id="screenshot-unavailable" className="text-sm font-bold text-ink">Screenshot analysis is unavailable in this prototype.</h2>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">Image uploads are disabled because sensitive details in images cannot be reliably filtered. To try the demo, type or paste the visible message in Message using fictional names, numbers, and other details. Do not upload or transcribe real victim data.</p>
                  <button type="button" onClick={() => changeMode("paste")} className="mt-4 inline-flex min-h-11 items-center rounded-[8px] bg-command px-4 text-sm font-bold text-white">Type or paste a fictional message</button>
                  <p className="mt-3 text-xs leading-5 text-ink-soft">Private image hash remains a separate local-only demo. It does not analyse screenshot text or upload the image.</p>
                </section>}

                {mode === "private" && <div>
                  <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} className={`panel border-2 border-dashed p-6 text-center ${dragging ? "border-service bg-service-soft" : file ? "border-success bg-success-soft" : "hover:border-service hover:bg-service-soft/40"}`}>
                    <input ref={fileInputRef} type="file" accept="image/*" aria-label="Choose a fictional test image for local hashing" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mb-3 inline-flex min-h-11 items-center rounded-[8px] bg-command px-4 text-sm font-bold text-white">{file ? "Choose another image" : "Choose image"}</button>
                    {file ? <>
                      <Check size={28} className="mx-auto text-success" aria-hidden="true" />
                      <p className="mt-3 break-all text-sm font-bold text-ink">{file.name}</p>
                      <p className="mt-1 text-xs text-ink-soft">{(file.size / 1024 / 1024).toFixed(1)} MB selected</p>
                      <button type="button" onClick={clearFile} className="mt-3 min-h-11 px-3 text-xs font-bold text-danger underline underline-offset-2">Remove image</button>
                    </> : <>
                      <Upload size={26} className="mx-auto text-service" aria-hidden="true" />
                      <p className="mt-3 text-sm font-bold text-ink">Or drop an image here</p>
                      <p className="mt-1 text-xs text-ink-soft">PNG, JPG, WEBP, and HEIC up to 8 MB</p>
                    </>}</div>
                  <div className="mt-4 panel-tight border-service/30 bg-service-soft p-4">
                    <div className="flex gap-3">
                      <Fingerprint size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-bold text-ink">Local fingerprinting</p>
                        <p className="mt-1 text-xs leading-5 text-ink-soft">Use a fictional test image only. This operation creates a perceptual fingerprint in your browser without uploading the image. It does not register protection or remove content. For real intimate-image protection, use the official StopNCII process.</p>{localFingerprint && <p className="mono-ref mt-3 break-all text-[11px] font-bold text-service">Fingerprint: {localFingerprint}</p>}</div>
                    </div>
                  </div></div>}

                {mode === "identifier" && <div className="panel p-5"><label htmlFor="incident-identifier" className="block text-sm font-bold text-ink">Enter a phone number, UPI ID, or link</label><div className="relative mt-3"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" /><input id="incident-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Example: seller@ybl or https://example.com" className="min-h-12 w-full rounded-[8px] border border-line bg-paper pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" /></div><p className="mt-3 text-xs leading-5 text-ink-faint">Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.</p></div>}

                {error && <div role="alert" className="panel border-danger/40 bg-danger-soft p-4 text-sm font-semibold text-danger">{error}</div>}

                {mode !== "upload" && <button type="submit" disabled={!draftReady || loading || hashing} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-service px-5 text-sm font-bold text-white hover:bg-command disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Analysing the incident..." : hashing ? "Creating local fingerprint..." : mode === "private" ? "Create local fingerprint" : "Analyse this incident"}{!loading && !hashing && <ArrowRight size={17} aria-hidden="true" />}</button>}
              </form>

              <div className="mt-6 text-center"><p className="text-xs text-ink-faint">Want to see the complete response path?</p><Link href="/check/DEMO0001" className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service hover:text-ink">Open the example task-scam case <ArrowRight size={15} aria-hidden="true" /></Link></div>
            </div>

            <aside className="space-y-4 lg:pt-8">
              <div className="panel border-danger/35 bg-danger-soft p-5"><PhoneCall size={20} className="text-danger" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-danger">Money moving now?</p><p className="mt-2 text-xs leading-5 text-ink-soft">Call 1930 immediately. This intake can wait.</p></div>
              <div className="panel p-5"><ShieldCheck size={20} className="text-ink-soft" aria-hidden="true" /><p className="mt-3 text-sm font-bold text-ink">Prototype limits</p><p className="mt-2 text-xs leading-5 text-ink-soft">Fictional data only. Production authentication and security are not verified. Submitted text leaves your device, and automated redaction can miss details. Screenshot uploads are disabled. Local hashing is not a guarantee of privacy for real victims.</p></div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckPage() {
  return <Suspense fallback={<div className="min-h-[100dvh] bg-paper" />}><CheckForm /></Suspense>;
}
