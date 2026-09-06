"use client";

import { useEffect, useRef, useState } from "react";
import { Languages, Check, ChevronDown } from "lucide-react";
import { SITE_LANGUAGE_OPTIONS, useRakshaLanguage, type RakshaLanguage } from "@/hooks/useRakshaLanguage";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useRakshaLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = SITE_LANGUAGE_OPTIONS.find((o) => o.code === language);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className={`language-switcher-wrapper ${compact ? "language-switcher-compact" : ""}`} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose interface language"
        onClick={() => setOpen((v) => !v)}
        className="language-switcher-trigger"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 10px",
          borderRadius: "6px",
          background: open ? "rgba(254,252,248,.12)" : "rgba(254,252,248,.08)",
          border: "1px solid rgba(254,252,248,.15)",
          color: "#fefcf8",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          minHeight: "36px",
        }}
      >
        <Languages size={14} aria-hidden="true" />
        <span>{current?.native ?? current?.label}</span>
        <ChevronDown
          size={12}
          aria-hidden="true"
          style={{ opacity: 0.7, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Interface language"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: "140px",
            background: "#1a2540",
            border: "1px solid rgba(254,252,248,.15)",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,.45)",
            padding: "4px",
            margin: 0,
            listStyle: "none",
            zIndex: 999,
          }}
        >
          {SITE_LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.code === language;
            return (
              <li
                key={option.code}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLanguage(option.code as RakshaLanguage);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  padding: "7px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "var(--saffron, #f97316)" : "#fefcf8",
                  background: isActive ? "rgba(249,115,22,.1)" : "transparent",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLLIElement).style.background = "rgba(254,252,248,.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLLIElement).style.background = isActive ? "rgba(249,115,22,.1)" : "transparent";
                }}
              >
                <span>{option.native}</span>
                {isActive && <Check size={13} aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
