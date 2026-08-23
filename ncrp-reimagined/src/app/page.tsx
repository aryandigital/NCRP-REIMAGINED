import Link from 'next/link';

const STATS = [
  { value: '28.15L', label: 'Complaints in 2025' },
  { value: '₹22,495 Cr', label: 'Losses reported' },
  { value: '<2%', label: 'Became FIRs' },
  { value: '~0.4%', label: 'Money returned' },
];

const ATLAS_PREVIEW = [
  { slug: 'part-time-task-scam', name: 'Part-Time Task Scam', risk: 'HIGH' },
  { slug: 'digital-arrest', name: 'Digital Arrest', risk: 'HIGH' },
  { slug: 'sextortion-blackmail', name: 'Sextortion / Video Call', risk: 'HIGH' },
  { slug: 'fake-crypto-trading', name: 'Fake Crypto Trading', risk: 'HIGH' },
  { slug: 'bank-kyc-suspension', name: 'Bank KYC Suspension', risk: 'HIGH' },
  { slug: 'sim-swap', name: 'SIM Swap / eSIM Scam', risk: 'HIGH' },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-base) 100%)',
          padding: '4rem 1.25rem 3rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container-narrow">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--red-subtle)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '999px',
              padding: '0.25rem 0.875rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--red-light)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            ⚠️ 28.15 lakh complaints in 2025 · ₹22,495 crore in losses
          </div>

          <h1 style={{ marginBottom: '1rem' }}>
            Cybercrime is a loss-of-control problem.
            <br />
            <span style={{ color: 'var(--blue-light)' }}>We contain the escape first.</span>
          </h1>

          <p style={{ fontSize: '1.125rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
            Upload a screenshot or describe what happened. Get an instant scam diagnosis,
            containment steps, and pre-filled legal documents — without asking you the same thing twice.
          </p>

          {/* Universal check bar */}
          <form
            action="/check"
            method="GET"
            style={{ display: 'flex', gap: '0.625rem', maxWidth: '560px', margin: '0 auto' }}
          >
            <input
              name="q"
              type="text"
              placeholder="Paste a message, URL, phone number, or UPI ID…"
              className="input"
              style={{ flex: 1 }}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Check →
            </button>
          </form>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            No login required · Nothing stored until you decide to file
          </p>
        </div>
      </section>

      {/* ── 4 Doors ──────────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.25rem' }}>
        <div className="container-page">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            What is happening?
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Choose the door that matches your situation — no legal knowledge required.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Door 1 */}
            <Link href="/check" className="door-card" style={{ '--door-color': 'var(--blue-primary)' } as React.CSSProperties}>
              <div
                className="door-card-icon"
                style={{ background: 'var(--blue-subtle)', color: 'var(--blue-light)' }}
              >
                <span style={{ fontSize: '1.375rem' }}>🔍</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Check if something is a scam
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Got a suspicious message, link, or call? Upload it for an instant 30-second diagnosis.
                </p>
              </div>
              <div style={{ color: 'var(--blue-light)', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
                30 seconds · No login →
              </div>
            </Link>

            {/* Door 2 */}
            <Link href="/act/new?mode=live" className="door-card">
              <div
                className="door-card-icon"
                style={{ background: 'var(--red-subtle)', color: 'var(--red-light)' }}
              >
                <span style={{ fontSize: '1.375rem' }}>🚨</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Something is happening right now
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Active screen sharing, live extortion threat, or ongoing fraud call. Enter Immediate Action Mode.
                </p>
              </div>
              <div style={{ color: 'var(--red-light)', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
                ⚡ Immediate action →
              </div>
            </Link>

            {/* Door 3 */}
            <Link href="/check" className="door-card">
              <div
                className="door-card-icon"
                style={{ background: 'var(--amber-subtle)', color: 'var(--amber-light)' }}
              >
                <span style={{ fontSize: '1.375rem' }}>💸</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  I&apos;ve already lost money, access, or content
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Funds debited, account locked, images weaponized. Start containment and fast evidence intake.
                </p>
              </div>
              <div style={{ color: 'var(--amber-light)', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
                Start containment →
              </div>
            </Link>

            {/* Door 4 */}
            <Link href="/track" className="door-card">
              <div
                className="door-card-icon"
                style={{ background: 'var(--green-subtle)', color: 'var(--green-light)' }}
              >
                <span style={{ fontSize: '1.375rem' }}>📋</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Track a report I already filed
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Enter your 14-digit acknowledgement number for plain-language status and generated legal letters.
                </p>
              </div>
              <div style={{ color: 'var(--green-light)', fontSize: '0.875rem', fontWeight: 600, marginTop: 'auto' }}>
                14-digit lookup →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ticker ─────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.75rem 1.25rem',
        }}
      >
        <div
          className="container-page"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          {STATS.map(s => (
            <div key={s.label}>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '-0.03em',
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.25rem' }}>
        <div className="container-page">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            One journey. No repeat questions.
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Everything you tell us in Check flows into Act, Report, and Recover.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {[
              {
                num: '1',
                stage: 'Check',
                color: 'var(--blue-primary)',
                desc: 'Upload a screenshot, paste a message, or describe the call. Get a Scam DNA verdict in 30 seconds.',
              },
              {
                num: '2',
                stage: 'Act',
                color: 'var(--red-primary)',
                desc: 'Site chrome disappears. Distraction-free containment steps across Money, Content, Access, Identity, and Safety tracks.',
              },
              {
                num: '3',
                stage: 'Report',
                color: 'var(--amber-primary)',
                desc: 'Your complaint is pre-filled from what you already gave us. One question per screen. Nothing asked twice.',
              },
              {
                num: '4',
                stage: 'Recover',
                color: 'var(--green-primary)',
                desc: 'Live statutory countdown clocks. Pre-filled legal letters ready to send before deadlines expire.',
              },
            ].map(step => (
              <div key={step.stage} className="card" style={{ borderTop: `3px solid ${step.color}` }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: step.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '0.875rem',
                  }}
                >
                  {step.num}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {step.stage}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Atlas strip ──────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '2.5rem 1.25rem',
        }}
      >
        <div className="container-page">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <h3 style={{ margin: 0 }}>Global Scam Pattern Atlas</h3>
            <Link href="/atlas" style={{ fontSize: '0.875rem', color: 'var(--blue-light)' }}>
              View all 15 patterns →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.875rem',
            }}
          >
            {ATLAS_PREVIEW.map(p => (
              <Link
                key={p.slug}
                href={`/atlas/${p.slug}`}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {p.name}
                </span>
                <span className="badge-high" style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem' }}>
                  HIGH
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key differentiators ───────────────────────────────── */}
      <section style={{ padding: '3rem 1.25rem' }}>
        <div className="container-page">
          <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            What makes this different
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {[
              {
                icon: '🧬',
                title: 'Behavioral Matching, Not Blacklists',
                desc: 'Scammer phone numbers rotate hourly. The psychological script does not. We match the playbook, not the identifier.',
              },
              {
                icon: '🔒',
                title: 'Image Never Leaves Your Device',
                desc: 'For intimate image abuse, we compute a perceptual hash in your browser. Only the fingerprint is transmitted. Zero raw bytes.',
              },
              {
                icon: '⏱️',
                title: 'Statutory Deadlines Running Live',
                desc: '8 legal clocks (RBI 3-day zero-liability, IT Rules 24-hour takedown, GAC appeal) countdown from the moment you file.',
              },
              {
                icon: '📄',
                title: 'Pre-Filled Legal Letters',
                desc: 'Rule-based templates generate the exact bank, platform, and ombudsman notices you need before each clock expires.',
              },
            ].map(d => (
              <div key={d.title} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{d.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>{d.title}</div>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
