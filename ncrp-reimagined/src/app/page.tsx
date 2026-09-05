"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { PATTERNS } from "@/data/patterns";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";
import { HOME_COPY } from "@/data/homeCopy";
import { BrandMark, IconAlert, IconClock, IconEmergency, IconEvidence } from "@/components/icons";

const routeMeta = [
  { href: "/shield", icon: "/illustrations/icons/icon-speak.png" },
  { href: "/check?mode=emergency", icon: "/illustrations/icons/icon-emergency.png" },
  { href: "/check?mode=lost", icon: "/illustrations/icons/icon-lost.png" },
  { href: "/check", icon: "/illustrations/icons/icon-check.png" },
] as const;

const journeyIcons = [
  "/illustrations/icons/icon-speak.png",
  "/illustrations/icons/icon-check.png",
  "/illustrations/icons/icon-emergency.png",
  "/illustrations/icons/icon-path.png",
] as const;

const capabilityIcons = [
  "/illustrations/icons/icon-route.png",
  "/illustrations/icons/icon-speak.png",
  "/illustrations/icons/icon-path.png",
] as const;

const principleIcons = [IconEvidence, IconClock, IconAlert] as const;

export default function HomePage() {
  const { language } = useRakshaLanguage();
  const copy = HOME_COPY[language] ?? HOME_COPY.en;

  return (
    <div className="min-h-[100dvh] bg-paper" data-raksha-i18n="react">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {/* Hero: full-bleed aurora gradient, centered, melting into the night */}
        <section className="hero-aurora">
          <div className="public-shell relative z-[1] flex min-h-[70dvh] flex-col items-center justify-center py-14 pb-24 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illustrations/raksha-arch-emblem.png" alt="" className="hero-emblem" aria-hidden="true" />
            <p className="hero-eyebrow mt-7">{copy.hero.ornament}</p>
            <h1 className="display mt-5 max-w-[16ch] text-[2.9rem] sm:text-6xl lg:text-[4.6rem]">{copy.hero.title}</h1>
            <p className="hero-sub mt-6 max-w-[56ch] text-base leading-8 sm:text-lg">{copy.hero.sub}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/shield" className="btn-night">{copy.routes.items[0].label} <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/check?mode=lost" className="btn-daylight">{copy.hero.ctaStart}</Link>
              <Link href="/track" className="btn-daylight">{copy.hero.ctaTrack}</Link>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#171a30]" lang="en">
              Judge walkthrough: open Call Shield, play the fictional call, confirm what happened,
              then review the evidence and suggested next step. No microphone or API key needed for the scripted demo.
            </p>
            <p className="hero-safety mt-9 flex items-center gap-2.5 text-[13px] font-semibold">
              <IconEmergency size={17} aria-hidden="true" />
              {copy.hero.rule}
            </p>
            <p className="hero-statline absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">{copy.hero.statline}</p>
          </div>
        </section>

        {/* Triage deck */}
        <section className="section-glow bg-paper">
          <div className="public-shell py-14 sm:py-20">
            <div className="max-w-2xl">
              <p className="kicker">{copy.routes.kicker}</p>
              <h2 className="display mt-3 text-3xl text-ink sm:text-[2.6rem]">{copy.routes.title}</h2>
              <p className="mt-3 text-base leading-7 text-ink-soft">{copy.routes.sub}</p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {copy.routes.items.map((route, index) => {
                const { href, icon } = routeMeta[index];
                return (
                  <Link key={route.label} href={href} className="group glow-card flex items-start gap-4 rounded-2xl p-5 transition-shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon} alt="" className="icon-art h-14 w-14 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-[15px] font-bold text-ink">{route.label}</span>
                        <ArrowRight size={16} className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
                      </span>
                      <span className="mt-1.5 block text-[13px] leading-6 text-ink-soft">{route.detail}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats band: the aurora echoes mid-page */}
        <section className="aurora-band">
          <div className="public-shell grid gap-6 py-10 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12">
            <div>
              <p className="kicker">{copy.stats.kicker}</p>
              <p className="mt-2 max-w-[28ch] text-sm font-semibold leading-6 text-[#3a3f66]">{copy.stats.lead}</p>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-7">
              {copy.stats.items.map((item) => (
                <div key={item.label} className="border-l border-[#171a30]/20 pl-4">
                  <p className="text-xl font-bold tracking-tight text-[#171a30] sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[#171a30]/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="border-b border-line bg-surface">
          <div className="public-shell py-14 sm:py-20">
            <div className="max-w-2xl">
              <p className="kicker">{copy.journey.kicker}</p>
              <h2 className="display mt-3 text-3xl text-ink sm:text-[2.6rem]">{copy.journey.title}</h2>
              <p className="mt-4 text-base leading-7 text-ink-soft">{copy.journey.sub}</p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {copy.journey.steps.map((step, index) => (
                <div key={step.number} className="bg-surface p-6">
                  <div className="flex items-start justify-between">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={journeyIcons[index]} alt="" className="icon-art h-12 w-12" aria-hidden="true" />
                    <span className="font-mono text-[11px] font-bold text-ink-faint">{step.number}</span>
                  </div>
                  <span className="mt-5 block text-sm font-bold text-ink">{step.title}</span>
                  <span className="mt-1.5 block text-xs leading-5 text-ink-soft">{step.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities: custom contextual icon artwork leads each panel */}
        <section className="section-glow bg-paper">
          <div className="public-shell py-14 sm:py-20">
            <div className="max-w-2xl">
              <p className="kicker">{copy.capabilities.kicker}</p>
              <h2 className="display mt-3 text-3xl text-ink sm:text-[2.6rem]">{copy.capabilities.title}</h2>
              <p className="mt-4 text-base leading-7 text-ink-soft">{copy.capabilities.sub}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {copy.capabilities.cards.map((card, index) => (
                <div key={card.title} className="glow-card flex flex-col rounded-2xl p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={capabilityIcons[index]} alt="" className="icon-art h-20 w-20" aria-hidden="true" />
                  <p className="kicker mt-6">{card.label}</p>
                  <h3 className="mt-2 text-lg font-bold tracking-[-0.01em] text-ink">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Threat bulletin */}
        <section className="bg-surface">
          <div className="public-shell py-14 sm:py-20">
            <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="kicker">{copy.bulletin.kicker}</p>
                <h2 className="display mt-2 text-3xl text-ink sm:text-4xl">{copy.bulletin.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">{copy.bulletin.sub}</p>
              </div>
              <Link href="/atlas" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service hover:text-ink">{copy.bulletin.openAll} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="mt-6 overflow-hidden border-y border-line">
              {PATTERNS.map((pattern, index) => (
                <Link key={pattern.slug} href={`/atlas/${pattern.slug}`} className="group grid gap-3 border-b border-line px-1 py-5 last:border-b-0 sm:grid-cols-[70px_1fr_auto] sm:items-center sm:gap-6">
                  <span className="font-mono text-xs font-bold text-ink-faint">0{index + 1}</span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[5px] bg-danger-soft px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-danger">{copy.bulletin.active}</span>
                      <span className="text-xs text-ink-faint">{pattern.channels.slice(0, 3).join(" / ")}</span>
                    </span>
                    <span className="mt-2 block text-base font-bold text-ink group-hover:text-service">{pattern.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-ink-soft">{pattern.stages[0]?.signals[0]}</span>
                  </span>
                  <span className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service sm:justify-self-end">{copy.bulletin.viewScript} <ArrowRight size={16} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="bg-command text-white">
          <div className="public-shell grid gap-10 py-14 sm:grid-cols-[1fr_1.4fr] sm:items-start sm:py-20">
            <div>
              <p className="kicker text-white/60">{copy.principles.kicker}</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">{copy.principles.title}</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {copy.principles.notes.map((note, index) => {
                const Icon = principleIcons[index];
                return (
                  <div key={note.title} className="border-t border-white/20 pt-5">
                    <Icon size={21} className="text-white/80" aria-hidden="true" />
                    <h3 className="mt-4 text-sm font-bold">{note.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{note.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Closing aurora call to action */}
        <section className="aurora-cta">
          <div className="public-shell flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illustrations/raksha-arch-emblem.png" alt="" className="h-16 w-auto opacity-90" aria-hidden="true" />
            <h2 className="display max-w-[18ch] text-3xl text-[#171a30] sm:text-5xl">{copy.cta.title}</h2>
            <p className="max-w-[52ch] text-sm font-semibold leading-6 text-[#3a3f66] sm:text-base">{copy.cta.sub}</p>
            <Link href="/check" className="btn-night">{copy.hero.ctaStart} <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="public-shell flex flex-col gap-6 py-10 text-xs text-ink-faint sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2.5 font-bold text-ink"><BrandMark size={22} />{copy.footer.brand}</p>
            <p className="mt-3 max-w-[62ch] leading-5">{copy.footer.disclosure}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-semibold">
            <Link href="/check" className="hover:text-service">{copy.footer.links.start}</Link>
            <Link href="/track" className="hover:text-service">{copy.footer.links.track}</Link>
            <Link href="/atlas" className="hover:text-service">{copy.footer.links.bulletin}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
