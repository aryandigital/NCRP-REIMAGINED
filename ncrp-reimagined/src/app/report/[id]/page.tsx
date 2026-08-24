import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { getIncident } from "@/lib/store";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import ReportForm from "@/components/ReportForm";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = await getIncident(id);
  if (!incident) notFound();
  return <div className="min-h-[100dvh] bg-paper"><SiteHeader /><main id="main-content" className="public-shell py-8 sm:py-12"><div className="mx-auto max-w-3xl"><Link href={`/act/${id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-soft hover:text-service"><ArrowLeft size={16} aria-hidden="true" /> Back to action board</Link><div className="mt-7 border-b border-line pb-6"><p className="kicker">Packet preparation</p><h1 className="mt-3 text-3xl font-bold tracking-[-.04em] text-ink sm:text-4xl">Review the incident before routing.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">The confirmed incident record creates recipient-specific packets for the NCRP, bank, and police response paths.</p></div><div className="panel mt-7 border-success/30 bg-success-soft p-5"><div className="flex gap-3"><CheckCircle2 size={21} className="mt-0.5 shrink-0 text-success" aria-hidden="true" /><div><p className="text-sm font-bold text-success">Facts carried forward</p><p className="mt-2 text-xs leading-5 text-ink-soft">{incident.extractedFacts.length} extracted facts, {incident.missingFacts.length} open fields, and the original redacted narrative are ready for review.</p></div></div></div><div className="panel mt-4 p-5 sm:p-6"><div className="flex gap-3"><FileText size={21} className="mt-0.5 shrink-0 text-service" aria-hidden="true" /><div><p className="kicker">Packet preview</p><h2 className="mt-2 text-lg font-bold text-ink">What will be created</h2></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["NCRP / 1930", "Incident summary, indicators, evidence index"], ["Bank nodal desk", "Amount, time, beneficiary, requested freeze"], ["Police queue", "Chronology, narrative, and evidence manifest"]].map(([title, detail]) => <div key={title} className="panel-tight bg-paper p-4"><p className="text-sm font-bold text-ink">{title}</p><p className="mt-2 text-xs leading-5 text-ink-soft">{detail}</p></div>)}</div></div><ReportForm incident={incident} /><div className="mt-5 flex gap-3 border-t border-line pt-5 text-xs leading-5 text-ink-faint"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-success" aria-hidden="true" /><p>Service information: this screen prepares records but does not transmit a complaint, bank request, police request, or payment action.</p></div></div></main></div>;
}
