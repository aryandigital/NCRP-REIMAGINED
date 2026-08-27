"use client";

import { MessageCircle, Mic } from "lucide-react";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";

const LABELS = {
  en: "Not sure what to do? Get step-by-step help",
  hi: "समझ नहीं आ रहा? कदम-दर-कदम मदद पाएँ",
  ta: "என்ன செய்வது என தெரியவில்லையா? படிப்படியான உதவி பெறுங்கள்",
  te: "ఏం చేయాలో తెలియదా? దశలవారీగా సహాయం పొందండి",
  bn: "কী করবেন বুঝতে পারছেন না? ধাপে ধাপে সাহায্য নিন",
  mr: "काय करावे समजत नाही? टप्प्याटप्प्याने मदत मिळवा",
} as const;

export default function OpenSamvaadButton({ emphasis = false }: { emphasis?: boolean }) {
  const { language } = useRakshaLanguage();
  return <button type="button" onClick={() => window.dispatchEvent(new Event("raksha:open-agent"))} className={emphasis ? "samvaad-open-button samvaad-open-button-emphasis" : "samvaad-open-button"}><MessageCircle size={18} aria-hidden="true" />{LABELS[language]} <Mic size={16} aria-hidden="true" /></button>;
}
