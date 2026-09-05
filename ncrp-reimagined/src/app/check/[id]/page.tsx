import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, FileSearch, ShieldAlert } from "lucide-react";
import { getIncident } from "@/lib/store";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import FactReview from "@/components/FactReview";

export const dynamic = "force-dynamic";

const RISK_CONFIG = {
  high: { label: "High risk pattern", tone: "border-danger/40 bg-danger-soft text-danger" },
  medium: { label: "Needs caution", tone: "border-warning/40 bg-warning-soft text-warning" },
  unclear: { label: "No confirmed match", tone: "border-line-strong bg-surface text-ink-soft" },
};

export default async function CheckResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident || !incident.dna) notFound();
  const dna = incident.dna;
  const risk = RISK_CONFIG[dna.risk];
  const facts = incident.extractedFacts.length > 0 ? incident.extractedFacts : [
    ...(dna.patternName ? [{ field: "Scam type", value: dna.patternName, source: "model" as const, confidence: dna.confidence, confirmationStatus: "unconfirmed" as const }] : []),
    ...dna.exactMatches.map((match) => ({ field: match.type, value: match.value, source: "user" as const, confidence: .9, confirmationStatus: "unconfirmed" as const })),
  ];

  return <div className="min-h-[100dvh] bg-paper"><SiteHeader current="check" /><main id="main-content" className="public-shell py-8 sm:py-12"><div className="stage-rail bg-surface" aria-label="Incident stages">{["Triage", "Tell the story", "Confirm facts", "Act and track"].map((label, index) => <div key={label} className={index === 2 ? "is-active" : index < 2 ? "" : "opacity-60"}><span className="block font-mono text-[10px] font-bold">0{index + 1}</span><span className="mt-1 block text-xs font-bold">{label}</span></div>)}</div><div className="mx-auto mt-8 max-w-3xl"><Link href="/check" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> New incident</Link><div className="mt-7 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="kicker">Step 03 / analysis and confirmation</p><h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink">This is what the evidence suggests.</h1><p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">Confirm the facts you recognise. A pattern match is advisory, not proof of identity or guilt.</p></div><span className="mono-ref text-xs font-bold text-ink-faint">{id}</span></div>

<section className={`panel mt-7 border p-5 sm:p-6 ${risk.tone}`}><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><ShieldAlert size={24} className="mt-0.5 shrink-0" aria-hidden="true" /><div><p className="font-mono text-[11px] font-bold uppercase tracking-[.12em]">{risk.label}</p><h2 className="mt-2 text-xl font-bold text-ink">{dna.patternName ?? "Unknown cyber incident"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-ink-soft">{dna.noDatabaseMatch ? "We could not confirm this script in the pattern corpus. That does not mean it is safe." : `The pattern match is ${Math.round(dna.confidence * 100)}% confident.`}</p></div></div><div className="flex items-center gap-2 text-xs font-bold text-ink-soft"><CircleAlert size={15} aria-hidden="true" /> Advisory result</div></div></section>

{dna.nextMove && <section className="panel mt-4 border-warning/40 bg-warning-soft p-5 sm:p-6"><div className="flex gap-3"><ArrowRight size={20} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" /><div><p className="kicker text-warning">Likely next move</p><p className="mt-3 text-base font-bold leading-7 text-ink">{dna.nextMove}</p><p className="mt-3 text-xs leading-5 text-ink-soft">If this is already happening, do not pay or share another verification code.</p></div></div></section>}

<section className="panel mt-4 p-5 sm:p-6"><div className="flex items-start gap-3"><FileSearch size={20} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /><div><p className="kicker">Evidence signals</p><h2 className="mt-2 text-lg font-bold text-ink">Why the pattern was flagged</h2><ul className="mt-4 space-y-3">{dna.signals.map((signal) => <li key={signal} className="flex gap-3 text-sm leading-6 text-ink-soft"><CheckCircle2 size={17} className="mt-1 shrink-0 text-danger" aria-hidden="true" />{signal}</li>)}</ul></div></div></section>

<section className="panel mt-4 p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="kicker">Incident graph</p><h2 className="mt-2 text-lg font-bold text-ink">Confirm extracted facts</h2><p className="mt-2 text-sm leading-6 text-ink-soft">Only confirmed facts are included in recipient-specific response packets.</p></div><span className="rounded-[6px] bg-service-soft px-2 py-1 font-mono text-[10px] font-bold text-service">{facts.length} facts</span></div><div className="mt-5"><FactReview incidentId={id} initialFacts={facts} /></div></section>

<section className="panel mt-4 border-warning/30 bg-warning-soft p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="kicker text-warning">Case readiness</p><h2 className="mt-2 text-lg font-bold text-ink">{facts.filter((fact) => fact.confirmationStatus === "confirmed").length} of {facts.length + incident.missingFacts.length} useful facts confirmed.</h2><p className="mt-2 text-sm leading-6 text-ink-soft">The remaining fields improve the bank and police packets. They are questions, not an AI score.</p></div><Link href={`/report/${id}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-warning px-4 text-sm font-bold text-white hover:bg-command">Fill missing details <ArrowRight size={15} aria-hidden="true" /></Link></div><div className="mt-4 flex flex-wrap gap-2">{incident.missingFacts.map((missing) => <span key={missing} className="rounded-[6px] border border-warning/30 bg-surface/60 px-2 py-1 text-xs font-semibold text-warning">{missing}</span>)}</div></section>

<section className="panel mt-4 border-danger/30 bg-danger-soft p-5 sm:p-6"><p className="kicker text-danger">Do not do this</p><ul className="mt-3 space-y-2">{dna.doNot.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-ink"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" aria-hidden="true" />{item}</li>)}</ul></section>

<section className="panel mt-4 p-5 sm:p-6"><div className="flex items-start gap-3"><CircleAlert size={19} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" /><div><h2 className="text-lg font-bold text-ink">What has already happened?</h2><p className="mt-2 text-sm leading-6 text-ink-soft">Choose the closest answer so the next screen orders containment before paperwork.</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{[{ id: "paid", label: "Money was transferred" }, { id: "otp", label: "OTP or PIN was shared" }, { id: "app", label: "An app was installed" }, { id: "screen", label: "Screen access was shared" }, { id: "images", label: "Private images are involved" }, { id: "id", label: "Aadhaar or PAN was shared" }].map((item) => <Link key={item.id} href={`/act/${id}?trigger=${item.id}`} className="flex min-h-12 items-center justify-between rounded-[8px] border border-line bg-paper px-4 text-sm font-bold text-ink hover:border-service hover:bg-service-soft"><span>{item.label}</span><ArrowRight size={16} className="text-service" aria-hidden="true" /></Link>)}</div><Link href={`/act/${id}?trigger=none`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-service hover:text-ink">Nothing has happened yet <ArrowRight size={16} aria-hidden="true" /></Link></section>
</div></main></div>;
}
