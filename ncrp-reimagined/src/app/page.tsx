"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Mic, ShieldCheck, Phone, Activity, Network, Volume2, Route, AlertCircle, TrendingDown, Search } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import HeroParticles from "@/components/HeroParticles";
import { PATTERNS } from "@/data/patterns";
import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";
import { HOME_COPY } from "@/data/homeCopy";
import { BrandMark, IconAlert, IconClock, IconEmergency, IconEvidence } from "@/components/icons";

const routeMeta = [
  { href: "/check?mode=emergency", Icon: AlertCircle },
  { href: "/check?mode=lost", Icon: TrendingDown },
  { href: "/check", Icon: Search },
] as const;

const journeyIcons = [Mic, ShieldCheck, Phone, Activity] as const;
const capabilityIcons = [Network, Volume2, Route] as const;
const principleIcons = [IconEvidence, IconClock, IconAlert] as const;

const STAGGER = ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5"] as const;

export default function HomePage() {
  const { language } = useRakshaLanguage();
  const copy = HOME_COPY[language] ?? HOME_COPY.en;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-scale").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-paper" data-raksha-i18n="react">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <section className="hero-aurora">
          <HeroParticles />
          <div className="public-shell hero-content relative z-[1] flex flex-col items-center justify-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/raksha-arch-emblem.svg" alt="" className="hero-emblem" aria-hidden="true" />

            <p className="hero-eyebrow mt-6">{copy.hero.ornament}</p>
            <h1 className="display hero-title-anim mt-5 max-w-[18ch] text-[2.5rem] sm:text-[3.5rem] lg:text-[4.2rem]">{copy.hero.title}</h1>
            <p className="hero-sub hero-sub-anim mt-5 max-w-[52ch] text-[15px] leading-7 sm:text-base sm:leading-8">{copy.hero.sub}</p>
            <div className="hero-ctas-anim mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/check?mode=lost" className="btn-night">{copy.hero.ctaStart} <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/shield" className="btn-daylight" lang="en">Call Shield</Link>
              <Link href="/track" className="hero-track-action">{copy.hero.ctaTrack}</Link>
            </div>
            <p className="hero-pill-anim hero-safety mt-8 flex items-center gap-2.5 text-[13px] font-semibold">
              <IconEmergency size={17} aria-hidden="true" />
              {copy.hero.rule}
            </p>
            <p className="hero-stat-anim hero-statline absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">{copy.hero.statline}</p>
          </div>
        </section>

        {/* Tricolor separator */}
        <div className="tricolor-bar" aria-hidden="true" />

        {/* Report categories */}
        <section className="section-glow bg-paper">
          <div className="public-shell py-14 sm:py-20">
            <div className="reveal max-w-2xl">
              <p className="kicker">{copy.routes.kicker}</p>
              <div className="divider-saffron mt-3" aria-hidden="true" />
              <h2 className="display mt-4 text-[1.8rem] text-ink sm:text-[2.4rem]">{copy.routes.title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-soft">{copy.routes.sub}</p>
            </div>
            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {copy.routes.items.slice(1).map((route, index) => {
                const { href, Icon } = routeMeta[index];
                return (
                  <Link key={route.label} href={href} className={`reveal ${STAGGER[index]} group glow-card flex flex-col p-5 transition-shadow`}>
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-line bg-paper transition-colors duration-200 group-hover:border-[var(--saffron)] group-hover:bg-service-soft">
                        <Icon size={20} className="text-ink-faint transition-colors duration-200 group-hover:text-[var(--saffron)]" aria-hidden="true" />
                      </span>
                      <ArrowRight size={16} className="mt-1.5 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-[var(--saffron)]" aria-hidden="true" />
                    </span>
                    <span className="mt-5 block text-[15px] font-bold leading-snug text-ink">{route.label}</span>
                    <span className="mt-2 block text-[13px] leading-6 text-ink-soft">{route.detail}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="aurora-band">
          <div className="public-shell grid gap-6 py-10 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12">
            <div className="reveal">
              <p className="mt-2 max-w-[28ch] text-sm font-semibold leading-6 text-[rgba(254,252,248,.7)]">{copy.stats.lead}</p>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-7">
              {copy.stats.items.map((item, index) => (
                <div key={item.label} className={`reveal ${STAGGER[index]} border-l border-[rgba(254,252,248,.15)] pl-4`}>
                  <p className="text-xl font-bold tracking-tight text-[#fefcf8] sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-[rgba(254,252,248,.5)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="overflow-hidden border-b border-line bg-surface">
          <div className="public-shell py-14 sm:py-20">
            <p className="kicker">{copy.journey.kicker}</p>
            <div className="divider-saffron mt-3" aria-hidden="true" />
            <div className="reveal mt-4 max-w-2xl">
              <h2 className="display text-[1.8rem] text-ink sm:text-[2.4rem]">{copy.journey.title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-ink-soft">{copy.journey.sub}</p>
            </div>

            {/* Timeline */}
            <div className="relative mt-14">
              <div
                className="pointer-events-none absolute top-9 hidden lg:block"
                style={{ left: "12.5%", right: "12.5%", height: "2px", background: "linear-gradient(to right, var(--saffron), var(--india-green))", opacity: 0.3 }}
              />

              <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
                {copy.journey.steps.map((step, index) => {
                  const StepIcon = journeyIcons[index];
                  return (
                    <div key={step.number} className={`reveal ${STAGGER[index]} group flex cursor-default flex-col items-center px-4 text-center`}>
                      <div className="relative z-10 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-2 border-[var(--navy)] bg-paper transition-all duration-300 group-hover:border-[var(--saffron)] group-hover:shadow-[0_0_24px_rgba(255,119,34,.15)]">
                        <StepIcon
                          className="h-7 w-7 text-[var(--navy)] transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--saffron)]"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>

                      <span className="mt-3 font-mono text-[10px] font-bold tracking-[0.16em] text-[var(--saffron)]">
                        {step.number}
                      </span>

                      <p className="mt-1.5 text-sm font-bold text-ink">{step.title}</p>

                      <div className="mt-2">
                        <p className="mt-2 text-xs leading-5 text-ink-soft">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="section-glow bg-paper">
          <div className="public-shell py-14 sm:py-20">
            <p className="kicker">{copy.capabilities.kicker}</p>
            <div className="divider-saffron mt-3" aria-hidden="true" />
            <div className="reveal mt-4 max-w-2xl">
              <h2 className="display text-[1.8rem] text-ink sm:text-[2.4rem]">{copy.capabilities.title}</h2>
              <p className="mt-4 text-[15px] leading-7 text-ink-soft">{copy.capabilities.sub}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {copy.capabilities.cards.map((card, index) => {
                const CapIcon = capabilityIcons[index];
                return (
                  <div key={card.title} className={`reveal ${STAGGER[index]} group glow-card flex items-start gap-4 p-5`}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-line bg-paper transition-colors duration-200 group-hover:border-[var(--saffron)] group-hover:bg-service-soft">
                      <CapIcon size={20} className="text-ink-faint transition-colors duration-200 group-hover:text-[var(--saffron)]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="text-[15px] font-bold tracking-[-0.01em] text-ink">{card.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-ink-soft">{card.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Threat bulletin */}
        <section className="bg-surface">
          <div className="public-shell py-14 sm:py-20">
            <div className="reveal flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="display mt-2 text-[1.8rem] text-ink sm:text-[2.2rem]">{copy.bulletin.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">{copy.bulletin.sub}</p>
              </div>
              <Link href="/atlas" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--navy)] hover:text-[var(--saffron)]">{copy.bulletin.openAll} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PATTERNS.map((pattern, index) => (
                <Link
                  key={pattern.slug}
                  href={`/atlas/${pattern.slug}`}
                  className={`reveal ${STAGGER[index]} group relative flex flex-col gap-4 rounded-[6px] border border-line bg-paper p-6 transition-all hover:border-[var(--saffron)] hover:shadow-[0_8px_24px_rgba(0,0,0,.06)]`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[3px] bg-danger-soft px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-danger">{copy.bulletin.active}</span>
                      <span className="text-xs text-ink-faint">{pattern.channels.slice(0, 3).join(" / ")}</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-ink-faint">0{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-ink group-hover:text-[var(--navy)]">{pattern.name}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{pattern.stages[0]?.signals[0]}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--navy)]">
                    {copy.bulletin.viewScript} <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="stamp-frame">
          <div className="public-shell grid gap-10 py-14 sm:grid-cols-[1fr_1.4fr] sm:items-start sm:py-20">
            <div className="reveal">
              <h2 className="display mt-3 text-[1.8rem] sm:text-[2.2rem]">{copy.principles.title}</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {copy.principles.notes.map((note, index) => {
                const Icon = principleIcons[index];
                return (
                  <div key={note.title} className={`reveal ${STAGGER[index]} border-t border-[rgba(254,252,248,.15)] pt-5`}>
                    <Icon size={21} className="text-[var(--saffron)]" aria-hidden="true" />
                    <h3 className="mt-4 text-sm font-bold text-[#fefcf8]">{note.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[rgba(254,252,248,.55)]">{note.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="aurora-cta">
          <div className="public-shell flex flex-col items-center gap-5 py-14 text-center sm:py-18">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/raksha-arch-emblem.svg" alt="" className="cta-emblem-anim h-12 w-auto opacity-75" aria-hidden="true" />
            <h2 className="reveal display max-w-[18ch] text-[1.8rem] text-ink sm:text-[2.8rem]">{copy.cta.title}</h2>
            <p className="reveal delay-1 max-w-[52ch] text-sm font-semibold leading-6 text-ink-soft sm:text-base">{copy.cta.sub}</p>
            <Link href="/check" className="reveal delay-2 btn-night">{copy.hero.ctaStart} <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      {/* Footer with tricolor top */}
      <div className="tricolor-bar-thin" aria-hidden="true" />
      <footer className="bg-[var(--navy-dark)]">
        <div className="public-shell py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-sm font-bold text-[#fefcf8]">
              <BrandMark size={18} aria-hidden="true" />
              {copy.footer.brand}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-[rgba(254,252,248,.6)]">
              <Link href="/check" className="hover:text-[#fefcf8] transition-colors">{copy.footer.links.start}</Link>
              <Link href="/track" className="hover:text-[#fefcf8] transition-colors">{copy.footer.links.track}</Link>
              <Link href="/atlas" className="hover:text-[#fefcf8] transition-colors">{copy.footer.links.bulletin}</Link>
            </div>
          </div>
          <p className="mt-5 border-t border-[rgba(254,252,248,.08)] pt-5 text-[11px] leading-5 text-[rgba(254,252,248,.4)]">
            {copy.footer.disclosure}
          </p>
        </div>
      </footer>
    </div>
  );
}
