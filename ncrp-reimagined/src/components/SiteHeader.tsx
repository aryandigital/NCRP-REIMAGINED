"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { BrandMark } from "@/components/icons";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";
import UserMenu from "@/components/UserMenu";

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
    en: { check: "Check Suspect", track: "Track Complaint", alerts: "Cyber Alerts", start: "Report Crime", sub: "National Cyber Crime Reporting Portal", gov: "Ministry of Home Affairs | Govt. of India" },
    hi: { check: "संदिग्ध जांचें", track: "शिकायत ट्रैक करें", alerts: "साइबर चेतावनी", start: "अपराध दर्ज करें", sub: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल", gov: "गृह मंत्रालय | भारत सरकार" },
    ta: { check: "சந்தேகத்தை சரிபார்", track: "புகார் கண்காணி", alerts: "சைபர் எச்சரிக்கை", start: "குற்றம் பதிவு", sub: "தேசிய சைபர் குற்ற புகார் போர்டல்", gov: "உள்துறை அமைச்சகம் | இந்திய அரசு" },
    te: { check: "అనుమానితుడిని తనిఖీ", track: "ఫిర్యాదు ట్రాక్", alerts: "సైబర్ హెచ్చరిక", start: "నేరం నమోదు", sub: "జాతీయ సైబర్ నేర నివేదిక పోర్టల్", gov: "హోం వ్యవహారాల మంత్రిత్వ శాఖ | భారత ప్రభుత్వం" },
    bn: { check: "সন্দেহভাজন যাচাই", track: "অভিযোগ ট্র্যাক", alerts: "সাইবার সতর্কতা", start: "অপরাধ নথিভুক্ত", sub: "জাতীয় সাইবার অপরাধ রিপোর্টিং পোর্টাল", gov: "স্বরাষ্ট্র মন্ত্রক | ভারত সরকার" },
    mr: { check: "संशयित तपासा", track: "तक्रार ट्रॅक", alerts: "सायबर सतर्कता", start: "गुन्हा नोंदवा", sub: "राष्ट्रीय सायबर गुन्हे तक्रार पोर्टल", gov: "गृह मंत्रालय | भारत सरकार" },
  }[language];

  return (
    <>
      {/* Indian Tricolor bar at very top */}
      <div className="tricolor-bar" aria-hidden="true" />
      <header ref={headerRef} className="site-header" data-raksha-i18n="react">
        <div className="public-shell flex min-h-[64px] items-center justify-between gap-3 py-3 sm:gap-5">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Raksha home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[#fefcf8]">
              <BrandMark size={34} />
            </span>
            <span className="min-w-0">
              <span className="wordmark block truncate text-[17px] text-[#fefcf8]">raksha</span>
              <span className="hidden text-[9px] font-semibold uppercase tracking-[.08em] text-[rgba(254,252,248,.5)] sm:block">{copy.sub}</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <nav aria-label="Primary navigation" className="flex items-center gap-0.5 sm:gap-1">
              <Link
                href="/check"
                aria-current={current === "check" ? "page" : undefined}
                className={`flex min-h-9 items-center px-2 text-[13px] font-semibold sm:px-3 sm:text-sm ${current === "check" ? "text-[var(--saffron)]" : "text-[rgba(254,252,248,.7)] hover:text-[#fefcf8]"}`}
              >
                {copy.check}
              </Link>
              <Link
                href="/track"
                aria-current={current === "track" ? "page" : undefined}
                className={`flex min-h-9 items-center px-2 text-[13px] font-semibold sm:px-3 sm:text-sm ${current === "track" ? "text-[var(--saffron)]" : "text-[rgba(254,252,248,.7)] hover:text-[#fefcf8]"}`}
              >
                {copy.track}
              </Link>
              <Link
                href="/atlas"
                aria-current={current === "atlas" ? "page" : undefined}
                className={`hidden min-h-9 items-center px-2 text-[13px] font-semibold sm:flex sm:px-3 sm:text-sm ${current === "atlas" ? "text-[var(--saffron)]" : "text-[rgba(254,252,248,.7)] hover:text-[#fefcf8]"}`}
              >
                {copy.alerts}
              </Link>
              <Link
                href="/check?mode=emergency"
                className="ml-1 hidden min-h-9 items-center rounded-[4px] bg-[var(--saffron)] px-3.5 text-[13px] font-bold text-white hover:bg-[var(--saffron-deep)] sm:flex sm:px-4 sm:text-sm"
              >
                {copy.start}
              </Link>
            </nav>
            <LanguageSwitcher compact />
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
