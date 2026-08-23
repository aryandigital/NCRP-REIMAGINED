import Link from 'next/link';

export default function HelpSomeonePage() {
  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <h1 style={{ marginBottom: '0.5rem' }}>Help Someone File a Report</h1>
        <p style={{ marginBottom: '2rem' }}>
          Filing on behalf of an elderly parent, a minor, or a family member who cannot do it themselves.
        </p>

        <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid var(--amber-primary)', background: 'var(--amber-subtle)' }}>
          <span className="badge-sim">PHASE 4 — Planned</span>
          <p style={{ margin: '0.5rem 0 0' }}>
            The assisted reporting workflow will include age-specific routing (POCSO for minors, NCMEC Take It Down),
            relationship identification, and simplified language for proxy filing.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
          {[
            { icon: '👴', label: 'Elderly parent or relative', desc: 'Simplified guided flow with larger text and phone-first steps' },
            { icon: '👶', label: 'Child under 18 (POCSO)', desc: 'Routes to POCSO framing, NCMEC Take It Down, and Childline 1098' },
            { icon: '👨‍👩‍👦', label: 'Family member or friend', desc: 'Standard assisted filing with relationship documentation' },
          ].map(o => (
            <div key={o.label} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.7 }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{o.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{o.label}</div>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{o.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          For now, use the standard Check flow. The person does not need to be present.
        </p>
        <Link href="/check" className="btn btn-primary">Start a Check →</Link>
      </div>
    </div>
  );
}
