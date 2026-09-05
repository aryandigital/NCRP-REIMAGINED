import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileDown, FileSearch, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { getUserIncidents, type Incident } from "@/lib/store";

export const dynamic = "force-dynamic";

const RISK_CONFIG = {
  high: {
    label: "High risk",
    icon: ShieldAlert,
    chipClass: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
    dotClass: "bg-[var(--color-danger)]",
  },
  medium: {
    label: "Needs caution",
    icon: ShieldQuestion,
    chipClass: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    dotClass: "bg-[var(--color-warning)]",
  },
  unclear: {
    label: "No match",
    icon: ShieldCheck,
    chipClass: "bg-surface text-ink-faint",
    dotClass: "bg-ink-faint",
  },
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function MyIncidentsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/my-incidents");

  const incidents = await getUserIncidents(session.userId);
  // Newest first, exclude synthetic demo
  const userIncidents = incidents
    .filter((i) => !i.syntheticOnly && i.userId === session.userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader />
      <main id="main-content" className="public-shell py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker">Your account</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-4xl">
                My incidents
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
                All cybercrime reports linked to your account, accessible from any device.
              </p>
            </div>
            <Link
              href="/check"
              className="inline-flex shrink-0 min-h-12 items-center gap-2 rounded-[6px] bg-[var(--color-service)] px-5 text-sm font-bold text-white hover:bg-[var(--saffron-deep)]"
            >
              Report new incident <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Empty state */}
          {userIncidents.length === 0 && (
            <div className="panel mt-8 flex flex-col items-center gap-4 py-16 text-center">
              <FileSearch size={40} className="text-ink-faint" aria-hidden="true" />
              <div>
                <p className="text-lg font-bold text-ink">No incidents yet</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">
                  When you report a cybercrime, it will appear here so you can track its status from any device.
                </p>
              </div>
              <Link
                href="/check"
                className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-[6px] bg-[var(--color-command)] px-6 text-sm font-bold text-white hover:bg-[var(--color-command-2)]"
              >
                Report your first incident <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Incident list */}
          {userIncidents.length > 0 && (
            <div className="mt-6 space-y-3">
              {userIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}

          {userIncidents.length > 0 && (
            <p className="mt-6 text-center text-xs text-ink-faint">
              {userIncidents.length} incident{userIncidents.length !== 1 ? "s" : ""} on record
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const risk = incident.dna?.risk ?? "unclear";
  const cfg = RISK_CONFIG[risk];
  const Icon = cfg.icon;
  const patternName = incident.dna?.patternName ?? "Unclassified incident";
  const ackOrId = incident.ackNumber ?? incident.id;
  const confirmed = incident.extractedFacts.filter((f) => f.confirmationStatus === "confirmed").length;
  const total = incident.extractedFacts.length + incident.missingFacts.length;

  return (
    <div className="group panel relative flex items-start gap-4 p-5 transition hover:border-[var(--color-service)] hover:bg-[var(--color-service-soft)] sm:p-6">
      {/* Cover link makes the whole card clickable */}
      <Link
        href={`/recover/${incident.id}`}
        className="absolute inset-0 z-0 rounded-[inherit]"
        aria-label={`View incident: ${patternName}`}
      />

      <div className={`relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.chipClass}`}>
        <Icon size={18} aria-hidden="true" />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex flex-wrap items-start gap-2">
          <p className="text-[15px] font-bold text-ink">{patternName}</p>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.chipClass}`}>
            {cfg.label}
          </span>
        </div>

        <p className="mt-1 text-xs text-ink-faint">{formatDate(incident.createdAt)}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-soft">
          <span className="mono-ref font-bold text-ink-faint">{ackOrId}</span>
          {total > 0 && (
            <span>{confirmed}/{total} facts confirmed</span>
          )}
          {incident.ackNumber && (
            <span className="font-semibold text-[var(--color-success)]">Submitted</span>
          )}
        </div>

        <a
          href={`/api/incidents/${incident.id}/document`}
          download={`complaint-draft-${incident.id}.pdf`}
          className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-[4px] border border-line bg-paper px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-[var(--color-service)] hover:text-[var(--color-service)]"
        >
          <FileDown size={12} aria-hidden="true" />
          Download complaint draft
        </a>
      </div>

      <ArrowRight
        size={17}
        className="relative z-10 mt-1 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-service)]"
        aria-hidden="true"
      />
    </div>
  );
}
