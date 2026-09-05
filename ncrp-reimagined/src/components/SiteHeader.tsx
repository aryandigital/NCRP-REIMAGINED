"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { BrandMark } from "@/components/icons";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";

export default function SiteHeader({ current }: { current?: "check" | "track" | "atlas" | "operator" | "shield" }) {
  const { language } = useRakshaLanguage();
  const pathname = usePathname();
  const copy = {
    en: { bulletin: "Threat bulletin", track: "Track case", operator: "Operator view", start: "Start incident" },
    hi: { bulletin: "खतरा बुलेटिन", track: "केस ट्रैक करें", operator: "ऑपरेटर व्यू", start: "शिकायत शुरू करें" },
    ta: { bulletin: "அச்சுறுத்தல் அறிவிப்பு", track: "வழக்கை கண்காணி", operator: "ஆபரேட்டர் பார்வை", start: "பதிவை தொடங்கு" },
    te: { bulletin: "ముప్పు బులెటిన్", track: "కేసును ట్రాక్ చేయండి", operator: "ఆపరేటర్ వీక్షణ", start: "రికార్డ్ ప్రారంభించండి" },
    bn: { bulletin: "হুমকি বুলেটিন", track: "কেস ট্র্যাক করুন", operator: "অপারেটর ভিউ", start: "রেকর্ড শুরু করুন" },
    mr: { bulletin: "धोका बुलेटिन", track: "केस ट्रॅक करा", operator: "ऑपरेटर दृश्य", start: "नोंद सुरू करा" },
  }[language];

  return (
    <header className="site-header border-b border-line" data-raksha-i18n="react" lang={language}>
      <div className="public-shell flex min-h-[78px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Raksha home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center">
            <BrandMark size={38} />
          </span>
          <span className="min-w-0">
            <span className="wordmark block truncate text-[17px] lowercase text-ink">raksha</span>
            <span lang="en" className="hidden text-[10px] font-semibold uppercase tracking-[.12em] text-ink-soft sm:block">Prototype / fictional data only</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-1">
            <Link href="/shield" lang="en" aria-current={pathname === "/shield" ? "page" : undefined} className="flex min-h-11 items-center px-2 text-sm font-bold text-service sm:px-3">Call Shield</Link>
            <Link href="/atlas" aria-current={current === "atlas" ? "page" : undefined} className={`hidden min-h-11 items-center px-3 text-sm font-semibold lg:flex ${current === "atlas" ? "text-service" : "text-ink-soft hover:text-ink"}`}>{copy.bulletin}</Link>
            <Link href="/track" aria-current={current === "track" ? "page" : undefined} className={`flex min-h-11 items-center px-2 text-sm font-semibold sm:px-3 ${current === "track" ? "text-service" : "text-ink-soft hover:text-ink"}`}>{copy.track}</Link>
            <Link href="/operator" aria-current={current === "operator" ? "page" : undefined} className={`hidden min-h-11 items-center px-3 text-sm font-semibold lg:flex ${current === "operator" ? "text-service" : "text-ink-soft hover:text-ink"}`}>{copy.operator}</Link>
            <Link href="/check" aria-current={current === "check" ? "page" : undefined} className="hidden min-h-11 items-center rounded-full bg-service px-4 text-sm font-bold text-white hover:bg-command lg:flex">{copy.start}</Link>
          </nav>
          <LanguageSwitcher compact />
        </div>
        <nav aria-label="More navigation" className="flex w-full flex-wrap items-center justify-center gap-x-4 border-t border-line pt-2 lg:hidden">
          <Link href="/atlas" aria-current={current === "atlas" ? "page" : undefined} className="inline-flex min-h-11 items-center text-sm font-semibold text-ink-soft">{copy.bulletin}</Link>
          <Link href="/operator" aria-current={current === "operator" ? "page" : undefined} className="inline-flex min-h-11 items-center text-sm font-semibold text-ink-soft">{copy.operator}</Link>
          <Link href="/check" aria-current={current === "check" ? "page" : undefined} className="inline-flex min-h-11 items-center text-sm font-semibold text-service">{copy.start}</Link>
        </nav>
        {language !== "en" && <p lang="en" className="w-full text-center text-xs leading-5 text-ink-soft">Language support is partial: home and selected atlas text. Operational forms remain in English.</p>}
      </div>
      <div className="hero-rule" aria-hidden="true" />
    </header>
  );
}
