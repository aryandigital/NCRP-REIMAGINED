import Link from 'next/link';
import { PATTERNS } from '@/lib/patterns';

export default function AtlasPage() {
  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-page">
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge-sim">PHASE 4 — Partial Preview</span>
          <h1 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>Global Scam Pattern Atlas</h1>
          <p>
            A public library of active scam playbooks. Each pattern includes a stage-by-stage behavioral graph,
            red flags, do-not warnings, and safe verification steps. No login required.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.125rem',
          }}
        >
          {PATTERNS.map(p => (
            <Link
              key={p.slug}
              href={`/atlas/${p.slug}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                transition: 'border-color 0.15s, transform 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.35 }}>
                  {p.name}
                </div>
                <span className={`badge-${p.baseRisk.toLowerCase() as 'high' | 'medium' | 'unclear'}`} style={{ fontSize: '0.625rem', padding: '0.1rem 0.5rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                  {p.baseRisk}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {p.primaryTrigger}
              </div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                {p.tracks.map(t => (
                  <span
                    key={t}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '999px',
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.6875rem',
                      color: 'var(--text-muted)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t}
                  </span>
                ))}
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginLeft: 'auto',
                    alignSelf: 'center',
                  }}
                >
                  {p.stages.length} stages
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
