import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileDown, FileSearch } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { getUserIncidents } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MyIncidentsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/my-incidents");
  const incidents = (await getUserIncidents(session.userId)).filter((incident) => !incident.syntheticOnly).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return <div className="min-h-[100dvh] bg-paper"><SiteHeader /><main id="main-content" className="public-shell py-8 sm:py-12"><div className="mx-auto max-w-3xl"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6"><div><p className="kicker">Your account</p><h1 className="display mt-3 text-[2rem] text-ink sm:text-[2.6rem]">My incidents</h1><p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft">Only cases linked to your account appear here.</p></div><Link href="/check" className="btn-ink">Start an incident <ArrowRight size={16} aria-hidden="true" /></Link></div>{incidents.length === 0 ? <div className="panel mt-8 grid justify-items-center gap-4 px-6 py-16 text-center"><FileSearch size={38} className="text-ink-faint" aria-hidden="true" /><div><p className="text-lg font-bold text-ink">No saved incidents yet</p><p className="mt-2 text-sm leading-6 text-ink-soft">Your signed-in case records will appear here.</p></div></div> : <div className="mt-6 grid gap-3">{incidents.map((incident) => <div key={incident.id} className="panel flex items-center justify-between gap-4 p-5"><Link href={`/recover/${incident.id}`} className="group min-w-0 flex-1"><span className="block text-sm font-bold text-ink group-hover:text-service">{incident.dna?.patternName ?? "Incident record"}</span><span className="mt-1 block font-mono text-xs text-ink-faint">{incident.ackNumber ?? incident.id}</span></Link><div className="flex shrink-0 items-center gap-4"><a href={`/api/incidents/${incident.id}/document`} download={`complaint-draft-${incident.id.toLowerCase()}.pdf`} className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-bold text-service hover:border-service hover:bg-service-soft" title={`Download complaint draft — ${incident.dna?.patternName ?? incident.id}`}><FileDown size={13} aria-hidden="true" />Complaint PDF</a><Link href={`/recover/${incident.id}`} className="group"><ArrowRight size={17} className="text-ink-faint group-hover:text-service" aria-hidden="true" /></Link></div></div>)}</div>}</div></main></div>;
}
