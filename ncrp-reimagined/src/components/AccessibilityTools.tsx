"use client";

import { useEffect, useState } from "react";
import { Accessibility, Contrast, Type, Volume2, X } from "lucide-react";
import { LANGUAGE_LOCALES, useRakshaLanguage } from "@/hooks/useRakshaLanguage";

export default function AccessibilityTools() {
  const { language } = useRakshaLanguage();
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextLarge = window.localStorage.getItem("raksha-large-text") === "true";
      const nextContrast = window.localStorage.getItem("raksha-high-contrast") === "true";
      setLarge(nextLarge); setContrast(nextContrast);
      document.documentElement.dataset.rakshaSize = nextLarge ? "large" : "default";
      document.documentElement.dataset.rakshaContrast = nextContrast ? "high" : "default";
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  function toggle(kind: "large" | "contrast") {
    const next = kind === "large" ? !large : !contrast;
    if (kind === "large") { setLarge(next); window.localStorage.setItem("raksha-large-text", String(next)); document.documentElement.dataset.rakshaSize = next ? "large" : "default"; }
    else { setContrast(next); window.localStorage.setItem("raksha-high-contrast", String(next)); document.documentElement.dataset.rakshaContrast = next ? "high" : "default"; }
  }

  function readPage() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const main = document.querySelector("main")?.textContent?.replace(/\s+/g, " ").trim();
    if (!main) return;
    const utterance = new SpeechSynthesisUtterance(main.slice(0, 3600));
    utterance.lang = LANGUAGE_LOCALES[language];
    window.speechSynthesis.speak(utterance);
  }

  return <div className="access-tools" data-raksha-i18n="react"><button type="button" onClick={() => setOpen((value) => !value)} className="access-launch" aria-label={open ? "Close accessibility tools" : "Open accessibility tools"} aria-expanded={open}>{open ? <X size={18} aria-hidden="true" /> : <Accessibility size={18} aria-hidden="true" />}<span>Access</span></button>{open && <section className="access-panel" aria-label="Accessibility settings"><p className="kicker">Accessible response desk</p><button type="button" onClick={readPage}><Volume2 size={16} aria-hidden="true" />Read this page aloud</button><button type="button" onClick={() => toggle("large")} aria-pressed={large}><Type size={16} aria-hidden="true" />{large ? "Use standard text" : "Use larger text"}</button><button type="button" onClick={() => toggle("contrast")} aria-pressed={contrast}><Contrast size={16} aria-hidden="true" />{contrast ? "Use standard contrast" : "Use high contrast"}</button><p>Use your screen reader, keyboard, voice, or this audio guide. No visual-only step is required.</p></section>}</div>;
}
