"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

export default function TrackPage() {
  const router = useRouter();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("caseId");
    if (typeof value === "string" && value.trim()) router.push(`/recover/${value.trim()}`);
  }

  return <div className="min-h-[100dvh] bg-paper"><SiteHeader current="track" /><main id="main-content" className="public-shell py-8 sm:py-12"><div className="mx-auto max-w-xl"><Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> Back to response desk</Link><div className="mt-8"><p className="kicker">Case tracking</p><h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Find your recovery plan.</h1><p className="mt-4 text-base leading-7 text-ink-soft">Enter the acknowledgement number from your case record. An example case is available without an account.</p></div><form onSubmit={handleSubmit} className="panel mt-7 p-5 sm:p-6"><label htmlFor="caseId" className="block text-sm font-bold text-ink">Acknowledgement number</label><div className="relative mt-3"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" /><input id="caseId" name="caseId" placeholder="Example: DEMO0001" className="min-h-12 w-full rounded-[8px] border border-line bg-paper pl-10 pr-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-service focus:bg-surface focus:outline-none" /></div><button type="submit" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-service px-5 text-sm font-bold text-white hover:bg-command">Open case <ArrowRight size={17} aria-hidden="true" /></button></form><div className="panel mt-4 border-service/30 bg-service-soft p-5"><div className="flex gap-3"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /><div><p className="text-sm font-bold text-ink">Open an example case</p><p className="mt-2 text-xs leading-5 text-ink-soft">See clocks, packet statuses, routing events, and the recovery warning in the complete journey.</p><Link href="/recover/DEMO0001" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service">Open DEMO0001 <ArrowRight size={15} aria-hidden="true" /></Link></div></div></div><p className="mt-7 text-center text-xs leading-5 text-ink-faint">Service information: this deployment does not retrieve live status from government, bank, police, or platform systems.</p></div></main></div>;
}
