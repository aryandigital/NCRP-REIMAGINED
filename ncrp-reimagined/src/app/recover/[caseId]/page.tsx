import Link from 'next/link';
import StageTimeline from '@/components/StageTimeline';

interface Props { params: Promise<{ caseId: string }> }

const CLOCK_EXAMPLES = [
  { name: 'RBI Zero-Liability Window', duration: '3 Working Days', track: 'Money', basis: 'RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18', doc: 'Bank Nodal Officer Letter' },
  { name: 'Platform Content Takedown', duration: '24 Hours', track: 'Content', basis: 'IT Rules 2021, Rule 3(2)(b)', doc: 'Platform Takedown Notice' },
  { name: 'GAC Appeal Window', duration: '30 Days', track: 'Content', basis: 'IT Rules 2021, Rule 3A', doc: 'GAC Appeal Petition' },
  { name: 'Bank Shadow Reversal', duration: '10 Working Days', track: 'Money', basis: 'RBI Circular Para 9', doc: 'Shadow Reversal Follow-Up' },
];

export default async function RecoverPage({ params }: Props) {
  const { caseId } = await params;
  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-page">
        <StageTimeline current="recover" incidentId={caseId} />

        <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          <span className="badge-sim">PHASE 3 — Planned</span>
          <h2 style={{ marginTop: '0.75rem' }}>Recovery Cockpit</h2>
          <p>Live statutory countdown clocks · Generated legal documents · Plain-language case status</p>
        </div>

        {/* Clock preview cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {CLOCK_EXAMPLES.map((c, i) => (
            <div
              key={c.name}
              className="card"
              style={{ borderTop: '3px solid var(--amber-primary)', opacity: i === 0 ? 1 : 0.65 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--amber-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {c.track} Track
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: i === 0 ? 'var(--amber-light)' : 'var(--text-muted)',
                  }}
                >
                  {c.duration}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                {c.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {c.basis}
              </div>
              <button
                className="btn btn-secondary btn-sm"
                disabled
                style={{ opacity: 0.5 }}
              >
                Download {c.doc} ↓
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: 'var(--amber-subtle)', borderLeft: '4px solid var(--amber-primary)' }}>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Phase 3 will activate these clocks in real time</strong> from the moment you submit your complaint.
            Each card will show a live countdown and generate the exact legal letter before the deadline expires.
          </p>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" className="btn btn-secondary">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
