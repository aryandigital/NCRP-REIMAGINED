"use client";

import { useEffect, useState } from "react";

export type RakshaLanguage = "en" | "hi" | "ta" | "te" | "bn" | "mr";
export type AgentLanguage = RakshaLanguage;

export const SITE_LANGUAGE_OPTIONS: Array<{ code: RakshaLanguage; label: string; native: string }> = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export const AGENT_LANGUAGE_OPTIONS = SITE_LANGUAGE_OPTIONS;

export const LANGUAGE_LOCALES: Record<RakshaLanguage, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  bn: "bn-IN",
  mr: "mr-IN",
};

const LANGUAGE_EVENT = "raksha:languagechange";
const STORAGE_KEY = "raksha-language";

function isRakshaLanguage(value: string | null): value is RakshaLanguage {
  return SITE_LANGUAGE_OPTIONS.some((option) => option.code === value);
}

export function setRakshaLanguage(language: RakshaLanguage) {
  window.localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = LANGUAGE_LOCALES[language];
  document.documentElement.dataset.rakshaLanguage = language;
  window.dispatchEvent(new CustomEvent<RakshaLanguage>(LANGUAGE_EVENT, { detail: language }));
}

function getStoredLanguage(): RakshaLanguage {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isRakshaLanguage(stored) ? stored : "en";
}

export function useRakshaLanguage() {
  const [language, setLanguage] = useState<RakshaLanguage>("en");

  useEffect(() => {
    // Honour ?lang=hi style links so any page can be shared in any language.
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (isRakshaLanguage(requested) && requested !== getStoredLanguage()) {
      setRakshaLanguage(requested);
    }
    const update = (next?: RakshaLanguage) => setLanguage(next ?? getStoredLanguage());
    update();
    const listener = (event: Event) => update((event as CustomEvent<RakshaLanguage>).detail);
    window.addEventListener(LANGUAGE_EVENT, listener);
    return () => window.removeEventListener(LANGUAGE_EVENT, listener);
  }, []);

  return { language, setLanguage: setRakshaLanguage };
}
