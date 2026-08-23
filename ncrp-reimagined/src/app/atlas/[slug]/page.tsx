import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PATTERN_MAP } from '@/lib/patterns';

interface Props { params: Promise<{ slug: string }> }

export default async function PatternDeepDivePage({ params }: Props) {
  const { slug } = await params;
  const pattern = PATTERN_MAP.get(slug);
  if (!pattern) notFound();

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <Link href="/atlas" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
          ← Scam Atlas
        </Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center', marginBottom: '1rem' }}>
          <span className={`badge-${pattern.baseRisk.toLowerCase() as 'high' | 'medium' | 'unclear'}`}>
            {pattern.baseRisk} RISK
          </span>
          {pattern.tracks.map(t => (
            <span
              key={t}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                padding: '0.125rem 0.625rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <h1 style={{ marginBottom: '0.5rem' }}>{pattern.name}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Trigger: {pattern.primaryTrigger}
        </p>

        {/* Stage progression */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Stage Progression ({pattern.stages.length} stages)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {pattern.stages.map((stage, idx) => (
              <div key={stage.id} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--blue-primary)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {idx + 1}
                  </div>
                  {idx < pattern.stages.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ paddingBottom: idx < pattern.stages.length - 1 ? '1.25rem' : 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {stage.name}
                  </div>
                  <p style={{ margin: '0 0 0.375rem', fontSize: '0.875rem' }}>{stage.description}</p>
                  <div
                    style={{
                      background: 'var(--amber-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8125rem',
                      color: 'var(--amber-light)',
                    }}
                  >
                    ⚡ Next: {stage.nextMove}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Do Not */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--red-light)', marginBottom: '0.875rem' }}>⛔ Do Not</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pattern.doNot.map((d, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                <span style={{ color: 'var(--red-light)', flexShrink: 0 }}>✕</span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Safe verification */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'var(--green-subtle)', borderLeft: '4px solid var(--green-primary)' }}>
          <h3 style={{ color: 'var(--green-light)', marginBottom: '0.625rem' }}>✓ Safe Verification</h3>
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>{pattern.safeVerification}</p>
        </div>

        <Link href="/check" className="btn btn-primary">
          Check if you&apos;ve been targeted →
        </Link>
      </div>
    </div>
  );
}
