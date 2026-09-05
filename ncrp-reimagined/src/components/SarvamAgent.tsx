"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Headphones, LoaderCircle, MessageCircle, Mic, Send, Sparkles, Square, Volume2, X } from "lucide-react";
import { AGENT_LANGUAGE_OPTIONS, LANGUAGE_LOCALES, type AgentLanguage } from "@/hooks/useRakshaLanguage";

type Message = { role: "user" | "assistant"; content: string };

const STARTERS: Record<AgentLanguage, string> = {
  en: "I got a suspicious WhatsApp message",
  hi: "मुझे WhatsApp पर संदिग्ध मैसेज आया है",
  ta: "எனக்கு சந்தேகமான WhatsApp செய்தி வந்தது",
  te: "నాకు అనుమానాస్పద WhatsApp సందేశం వచ్చింది",
  bn: "আমি WhatsApp-এ সন্দেহজনক বার্তা পেয়েছি",
  mr: "मला WhatsApp वर संशयास्पद संदेश आला आहे",
};

const WELCOME: Record<AgentLanguage, string> = {
  en: "Namaste. I am Raksha Samvaad, your cyber-safety guide. You can type or speak in your language. If money is moving now, call 1930 first.",
  hi: "नमस्ते। मैं रक्षा संवाद हूँ, आपका साइबर सुरक्षा मार्गदर्शक। अपनी भाषा में बोलें या लिखें। अगर अभी पैसा जा रहा है, तो पहले 1930 पर कॉल करें।",
  ta: "வணக்கம். நான் ரக்ஷா சம்வாத், உங்கள் இணைய பாதுகாப்பு வழிகாட்டி. உங்கள் மொழியில் பேசலாம் அல்லது எழுதலாம். இப்போது பணம் சென்றால் முதலில் 1930-ஐ அழைக்கவும்.",
  te: "నమస్తే. నేను రక్ష సంవాద్, మీ సైబర్ భద్రత మార్గదర్శిని. మీ భాషలో మాట్లాడండి లేదా టైప్ చేయండి. ఇప్పుడు డబ్బు వెళ్తుంటే ముందుగా 1930కి కాల్ చేయండి.",
  bn: "নমস্কার। আমি রক্ষা সংবাদ, আপনার সাইবার নিরাপত্তা সহায়ক। নিজের ভাষায় বলুন বা লিখুন। এখন টাকা গেলে আগে 1930-এ কল করুন।",
  mr: "नमस्कार. मी रक्षा संवाद, तुमचा सायबर सुरक्षा मार्गदर्शक आहे. तुमच्या भाषेत बोला किंवा लिहा. आत्ता पैसे जात असतील तर आधी 1930 वर कॉल करा.",
};

const BROWSER_LOCALES = LANGUAGE_LOCALES;

type BrowserRecognition = { continuous: boolean; interimResults: boolean; lang: string; onend: (() => void) | null; onerror: (() => void) | null; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null; start: () => void; stop: () => void };
type VoiceWindow = Window & { SpeechRecognition?: new () => BrowserRecognition; webkitSpeechRecognition?: new () => BrowserRecognition };

export default function SarvamAgent() {
  const pathname = usePathname();
  if (pathname === "/shield" || pathname.startsWith("/shield/")) return null;
  return <Agent key={pathname} />;
}

function Agent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [language, setLanguage] = useState<AgentLanguage>("en");
  const recognition = useRef<BrowserRecognition | null>(null);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const launcher = useRef<HTMLButtonElement | null>(null);
  const visibleMessages = useMemo(() => messages.length ? messages : [{ role: "assistant" as const, content: WELCOME[language] }], [language, messages]);

  useEffect(() => {
    const openAgent = () => setOpen(true);
    window.addEventListener("raksha:open-agent", openAgent);
    return () => window.removeEventListener("raksha:open-agent", openAgent);
  }, []);

  // Default the conversation language to the site language the visitor chose.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("raksha-language");
        if (stored && AGENT_LANGUAGE_OPTIONS.some((option) => option.code === stored)) setLanguage(stored as AgentLanguage);
      } catch { /* storage blocked */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) textarea.current?.focus();
    return () => {
      if (recognition.current) {
        recognition.current.onresult = null;
        recognition.current.onend = null;
        recognition.current.onerror = null;
        recognition.current.stop();
      }
      window.speechSynthesis?.cancel();
    };
  }, [open]);

  function close() {
    setOpen(false);
    setRecording(false);
    window.setTimeout(() => launcher.current?.focus(), 0);
  }

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, messages: nextMessages }) });
      const data = await response.json() as { reply?: string };
      setMessages((current) => [...current, { role: "assistant", content: data.reply ?? WELCOME[language] }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: WELCOME[language] }]);
    } finally {
      setLoading(false);
    }
  }

  function toggleVoice() {
    if (recording) { recognition.current?.stop(); return; }
    const Recognition = (window as VoiceWindow).SpeechRecognition ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Recognition) { setInput("Voice input is not available in this browser. You can type your message here."); return; }
    const instance = new Recognition();
    instance.continuous = false;
    instance.interimResults = true;
    instance.lang = BROWSER_LOCALES[language];
    instance.onresult = (event) => setInput(Array.from(event.results).map((result) => result[0].transcript).join(" ").trim());
    instance.onerror = () => setRecording(false);
    instance.onend = () => setRecording(false);
    recognition.current = instance;
    setRecording(true);
    try { instance.start(); } catch { setRecording(false); }
  }

  function speakLatest() {
    const latest = visibleMessages.at(-1)?.content;
    if (!latest || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(latest);
    utterance.lang = BROWSER_LOCALES[language];
    window.speechSynthesis.speak(utterance);
  }

  return <aside className={`samvaad-dock ${open ? "samvaad-dock-open" : ""}`} lang="en" data-raksha-i18n="react" aria-label="Raksha Samvaad cyber safety assistant">
    {!open && <button ref={launcher} type="button" className="samvaad-fab" onClick={() => setOpen(true)} aria-label="Open Raksha Samvaad, talk or type for cyber safety help"><span className="samvaad-fab-mark"><MessageCircle size={22} aria-hidden="true" /></span><span><strong>Talk to Raksha</strong><small>Optional voice or text</small></span><Mic size={18} aria-hidden="true" /></button>}
    {open && <section className="samvaad-panel" role="dialog" aria-modal="false" aria-label="Raksha Samvaad assistant" onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close(); } }}>
      <div className="samvaad-spectrum" aria-hidden="true" />
      <div className="samvaad-top">
        <div className="flex min-w-0 items-center gap-3">
          <span className="samvaad-orbit">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="kicker">Raksha Samvaad / रक्षा संवाद</p>
            <h2>Talk, type, or listen</h2>
          </div>
        </div>
        <button type="button" className="samvaad-close" onClick={close} aria-label="Close Raksha Samvaad">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="samvaad-info">
        <Headphones size={15} aria-hidden="true" />Optional speech recognition and playback depend on your browser and language. Audio may be processed by its speech provider, not on-device. Sent messages may go to an AI provider. Avoid sensitive details.</div>
      <div className="samvaad-language">
        <label htmlFor="agent-language">Conversation language</label>
        <div>
          <select id="agent-language" value={language} onChange={(event) => { setLanguage(event.target.value as AgentLanguage); setMessages([]); }}>
            <option value="en">English</option>{AGENT_LANGUAGE_OPTIONS.filter((option) => option.code !== "en").map((option) => <option key={option.code} value={option.code}>{option.native}</option>)}</select>
          <ChevronDown size={14} aria-hidden="true" />
        </div>
      </div>
      <div className="samvaad-thread" lang={language} aria-live="polite">{visibleMessages.map((message, index) => <div key={`${message.role}-${index}-${message.content.slice(0, 16)}`} className={`samvaad-message samvaad-${message.role}`}>{message.content}</div>)}{loading && <div className="samvaad-message samvaad-assistant flex items-center gap-2">
        <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />Finding the next safe step…</div>}</div>
      <div className="samvaad-actions">
        <button type="button" onClick={() => setInput(STARTERS[language])}>{STARTERS[language]}</button>
        <button type="button" onClick={speakLatest}>
          <Volume2 size={14} aria-hidden="true" />Listen</button>
      </div>
      <form onSubmit={send} className="samvaad-compose">
        <textarea ref={textarea} aria-label="Message to Raksha" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Speak or type what happened…" rows={2} />
        <button type="button" onClick={toggleVoice} className={recording ? "samvaad-mic samvaad-recording" : "samvaad-mic"} aria-label={recording ? "Stop voice input" : "Start voice input"}>{recording ? <Square size={15} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}</button>
        <button type="submit" className="samvaad-send" disabled={!input.trim() || loading} aria-label="Send to Raksha Samvaad">
          <Send size={17} aria-hidden="true" />
        </button>
      </form>
      <p className="samvaad-note">Safety guidance only. No OTP, PIN, password, or real account detail is needed.</p>
    </section>}
  </aside>;
}
