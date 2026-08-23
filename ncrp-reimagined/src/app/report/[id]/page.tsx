import Link from 'next/link';
import StageTimeline from '@/components/StageTimeline';

interface Props { params: Promise<{ id: string }> }

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <StageTimeline current="report" incidentId={id} />
        <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--amber-primary)', background: 'var(--amber-subtle)' }}>
          <span className="badge-sim">PHASE 3 — Planned</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>File Your Complaint</h2>
          <p>
            In Phase 3, this will be a one-question-per-page reporting wizard pre-filled from your Check evidence.
            Nothing will be asked twice. A 14-digit acknowledgement number will be generated on submission.
          </p>
          <Link href={`/recover/${id}`} className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Preview Recovery Cockpit →
          </Link>
        </div>
      </div>
    </div>
  );
}
