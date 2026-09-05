"use client";

import { MessageCircle, Mic } from "lucide-react";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";

const LABELS = {
  en: "Talk or type to Raksha",
  hi: "रक्षा से बोलिए या लिखिए",
  ta: "ரக்ஷாவிடம் பேசுங்கள் அல்லது எழுதுங்கள்",
  te: "రక్షతో మాట్లాడండి లేదా టైప్ చేయండి",
  bn: "রক্ষার সাথে বলুন বা লিখুন",
  mr: "रक्षाशी बोला किंवा लिहा",
} as const;

export default function OpenSamvaadButton({ emphasis = false }: { emphasis?: boolean }) {
  const { language } = useRakshaLanguage();
  return <button type="button" onClick={() => window.dispatchEvent(new Event("raksha:open-agent"))} className={emphasis ? "samvaad-open-button samvaad-open-button-emphasis" : "samvaad-open-button"}><MessageCircle size={18} aria-hidden="true" />{LABELS[language]} <Mic size={16} aria-hidden="true" /></button>;
}
