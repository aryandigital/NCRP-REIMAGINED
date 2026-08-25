"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { BrandMark } from "@/components/icons";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";

export default function SiteHeader({ current }: { current?: "check" | "track" | "atlas" | "operator" }) {
  const { language } = useRakshaLanguage();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      headerRef.current?.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const copy = {
    en: { bulletin: "Threat bulletin", track: "Track case", operator: "Operator view", start: "Start incident", sub: "National cyber response platform" },
    hi: { bulletin: "खतरा बुलेटिन", track: "केस ट्रैक करें", operator: "ऑपरेटर व्यू", start: "शिकायत शुरू करें", sub: "राष्ट्रीय साइबर प्रतिक्रिया मंच" },
    ta: { bulletin: "அச்சுறுத்தல் அறிவிப்பு", track: "வழக்கை கண்காணி", operator: "ஆபரேட்டர் பார்வை", start: "பதிவை தொடங்கு", sub: "தேசிய சைபர் பதில் தளம்" },
    te: { bulletin: "ముప్పు బులెటిన్", track: "కేసును ట్రాక్ చేయండి", operator: "ఆపరేటర్ వీక్షణ", start: "రికార్డ్ ప్రారంభించండి", sub: "జాతీయ సైబర్ ప్రతిస్పందన వేదిక" },
    bn: { bulletin: "হুমকি বুলেটিন", track: "কেস ট্র্যাক করুন", operator: "অপারেটর ভিউ", start: "রেকর্ড শুরু করুন", sub: "জাতীয় সাইবার প্রতিক্রিয়া প্ল্যাটফর্ম" },
    mr: { bulletin: "धोका बुलेटिन", track: "केस ट्रॅक करा", operator: "ऑपरेटर दृश्य", start: "नोंद सुरू करा", sub: "राष्ट्रीय सायबर प्रतिसाद व्यासपीठ" },
  }[language];

  return (
    <header ref={headerRef} className="site-header" data-raksha-i18n="react">
      <div className="public-shell flex min-h-[78px] items-center justify-between gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Raksha home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
            <BrandMark size={38} />
          </span>
          <span className="min-w-0">
            <span className="wordmark block truncate text-[17px] lowercase text-ink">raksha</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.12em] text-ink-faint sm:block">{copy.sub}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            <Link href="/atlas" aria-current={current === "atlas" ? "page" : undefined} className={`hidden min-h-11 items-center px-3 text-sm font-semibold sm:flex ${current === "atlas" ? "text-service" : "text-ink-soft hover:text-ink"}`}>{copy.bulletin}</Link>
            <Link href="/track" aria-current={current === "track" ? "page" : undefined} className={`flex min-h-11 items-center px-2 text-sm font-semibold sm:px-3 ${current === "track" ? "text-service" : "text-ink-soft hover:text-ink"}`}>{copy.track}</Link>
            <Link href="/operator" aria-current={current === "operator" ? "page" : undefined} className={`hidden min-h-11 items-center px-3 text-sm font-semibold xl:flex ${current === "operator" ? "text-service" : "text-ink-soft hover:text-ink"}`}>{copy.operator}</Link>
            <Link href="/check" aria-current={current === "check" ? "page" : undefined} className="hidden min-h-11 items-center rounded-full bg-service px-4 text-sm font-bold text-white hover:bg-command sm:flex">{copy.start}</Link>
          </nav>
          <LanguageSwitcher compact />
        </div>
      </div>
      <div className="hero-rule" aria-hidden="true" />
    </header>
  );
}
