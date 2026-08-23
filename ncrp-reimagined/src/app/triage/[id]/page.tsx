import Link from 'next/link';
import StageTimeline from '@/components/StageTimeline';

interface Props { params: Promise<{ id: string }> }

export default async function TriagePage({ params }: Props) {
  const { id } = await params;
  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <StageTimeline current="act" incidentId={id} />
        <div className="card" style={{ marginTop: '2rem', borderLeft: '4px solid var(--amber-primary)', background: 'var(--amber-subtle)' }}>
          <span className="badge-sim">PHASE 2 — Coming Next</span>
          <h2 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>Harm Assessment</h2>
          <p>
            The triage step will ask "What have you already done?" and branch into 5 parallel harm tracks
            (Money, Content, Access, Identity, Safety) to sequence the correct containment actions.
          </p>
          <p>This page is built in <strong>Phase 2</strong>. For now, proceed directly to the action steps.</p>
          <Link href={`/act/${id}`} className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Go to Immediate Action Mode →
          </Link>
        </div>
      </div>
    </div>
  );
}
