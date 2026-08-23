import { notFound } from 'next/navigation';
import StageTimeline from '@/components/StageTimeline';
import RiskVerdict from '@/components/RiskVerdict';
import type { ScamVerdictContract } from '@/lib/scam-dna';

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchIncident(id: string): Promise<(ScamVerdictContract & { id: string }) | null> {
  // Try DB first; fall back gracefully when DATABASE_URL is not configured
  try {
    const { db, incidents } = await import('@/lib/db');
    const { eq } = await import('drizzle-orm');

    const [row] = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, id))
      .limit(1);

    if (!row) return null;

    const verdict = row.dnaVerdict as unknown as ScamVerdictContract | null;
    if (!verdict) return null;

    return { ...verdict, id: row.id };
  } catch {
    return null;
  }
}

export default async function CheckResultPage({ params }: Props) {
  const { id } = await params;

  const incident = await fetchIncident(id);

  if (!incident) {
    // If DB is unavailable (no DATABASE_URL) show a graceful error
    return (
      <div style={{ padding: '2rem 1.25rem' }}>
        <div className="container-narrow">
          <StageTimeline current="check" incidentId={id} />
          <div style={{ marginTop: '2rem' }} className="card">
            <h2 style={{ marginBottom: '0.75rem' }}>Analysis result not found</h2>
            <p>
              The analysis result for this incident could not be retrieved.
              This can happen if the database is not configured or the session expired.
            </p>
            <a href="/check" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              ← Run a new check
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <StageTimeline current="check" incidentId={id} />

        <div style={{ marginTop: '2rem' }}>
          <RiskVerdict verdict={incident} incidentId={id} />
        </div>
      </div>
    </div>
  );
}
