"use client";

import { Languages } from "lucide-react";
import { SITE_LANGUAGE_OPTIONS, useRakshaLanguage, type RakshaLanguage } from "@/hooks/useRakshaLanguage";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useRakshaLanguage();

  return <label className={`language-switcher ${compact ? "language-switcher-compact" : ""}`}>
    <Languages size={15} aria-hidden="true" />
    <span className="sr-only">Choose interface language</span>
    <select value={language} onChange={(event) => setLanguage(event.target.value as RakshaLanguage)} aria-label="Choose interface language">
      {SITE_LANGUAGE_OPTIONS.map((option) => <option key={option.code} value={option.code}>{option.native}</option>)}
    </select>
  </label>;
}
