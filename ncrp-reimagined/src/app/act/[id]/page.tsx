import Link from 'next/link';
import StageTimeline from '@/components/StageTimeline';

interface Props { params: Promise<{ id: string }> }

export default async function ActPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === 'new';

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        {!isNew && <StageTimeline current="act" incidentId={id} />}
        <div style={{ marginTop: '2rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--red-primary)', background: 'var(--red-subtle)', marginBottom: '1.5rem' }}>
            <span className="badge-sim">PHASE 2 — Coming Next</span>
            <h2 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>⚡ Immediate Action Mode</h2>
            <p>
              In Phase 2, the site chrome will disappear entirely and this will become a distraction-free
              fullscreen emergency interface with 5 parallel harm tracks:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
            {[
              { icon: '💸', track: 'Money', desc: 'Direct bank freeze hotline, 1930 speed dial, transaction lock', color: 'var(--red-primary)' },
              { icon: '🔒', track: 'Content', desc: 'On-device perceptual hashing, 24-hour statutory takedown notices', color: 'var(--blue-primary)' },
              { icon: '🔑', track: 'Access', desc: 'Session revocation, email recovery, SIM swap audit (TAFCOP)', color: 'var(--amber-primary)' },
              { icon: '🪪', track: 'Identity', desc: 'Aadhaar biometric lock, credit report alert', color: 'var(--green-primary)' },
              { icon: '🛡️', track: 'Safety', desc: 'Anonymous mode, Tele-MANAS 14416 crisis line', color: 'var(--slate-primary)' },
            ].map(t => (
              <div key={t.track} className="card" style={{ borderTop: `3px solid ${t.color}` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.375rem', color: 'var(--text-primary)' }}>{t.track} Track</div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{t.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
            {!isNew && (
              <Link href={`/report/${id}`} className="btn btn-primary">
                Skip to Report →
              </Link>
            )}
            <Link href="/" className="btn btn-secondary">← Back to home</Link>
          </div>

          <div
            style={{
              marginTop: '2rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}
          >
            <strong style={{ color: 'var(--text-secondary)' }}>Emergency helplines:</strong>{' '}
            Cyber Crime: <a href="tel:1930" style={{ color: 'var(--blue-light)' }}>1930</a> ·{' '}
            Mental Health: <a href="tel:14416" style={{ color: 'var(--blue-light)' }}>Tele-MANAS 14416</a> ·{' '}
            Childline: <a href="tel:1098" style={{ color: 'var(--blue-light)' }}>1098</a>
          </div>
        </div>
      </div>
    </div>
  );
}
