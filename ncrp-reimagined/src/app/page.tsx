import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.25rem 2.5rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '0.75rem' }}>
            Something arrived that does not feel right.
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            Show us the message. We will tell you what to do, then help you stop the damage.
          </p>

          {/* Check input card */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--rule-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '0.75rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <label
              className="label-mono"
              style={{ display: 'block', color: 'var(--ink-text)', marginBottom: '0.5rem' }}
            >
              Paste a message, link, phone, or UPI ID
            </label>
            <form
              action="/check"
              method="GET"
              style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
            >
              <input
                name="q"
                type="text"
                placeholder="Pay Rs 1500 to unlock your merchant task…"
                className="input"
                style={{ flex: 1, minWidth: '200px' }}
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flexShrink: 0 }}
              >
                Check this message
              </button>
            </form>
          </div>

          <p
            className="label-mono"
            style={{
              fontSize: '0.6875rem',
              color: 'var(--ink-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--trust-teal)' }}>lock</span>
            No login. We hide Aadhaar, PAN, and account numbers before anyone reads this.
          </p>
        </div>
      </section>

      {/* ── Situation Doors ──────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--rule-border)', padding: '3rem 1.25rem' }}>
        <div className="container-page">
          <h2 style={{ marginBottom: '2rem' }}>What is happening?</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>

            {/* Door 1 — URGENT (full width, vermilion top border) */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--rule-border)',
                borderTop: '4px solid var(--postal-vermilion)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'row',
                gap: '2rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--postal-vermilion)',
                    opacity: 0.5,
                    flexShrink: 0,
                  }}
                >
                  1
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--postal-vermilion)',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span
                      className="label-mono"
                      style={{ color: 'var(--postal-vermilion)', fontWeight: 700 }}
                    >
                      This is happening right now
                    </span>
                  </div>
                  <p style={{ margin: '0 0 1rem', color: 'var(--ink-text)' }}>
                    They are on the call. They can see your screen. They are asking you not to hang up.
                  </p>
                  <Link
                    href="/act/new?mode=live"
                    className="btn btn-danger"
                  >
                    Hang up and get steps
                  </Link>
                </div>
              </div>

              {/* 1930 helpline card */}
              <div
                style={{
                  background: 'var(--surface-container-lowest)',
                  border: '1px solid var(--rule-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  minWidth: '200px',
                }}
              >
                <p className="label-mono" style={{ margin: '0 0 0.25rem', fontSize: '0.625rem', color: 'var(--ink-secondary)' }}>
                  Call 1930 — national cybercrime helpline
                </p>
                <a
                  href="tel:1930"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--ink-text)',
                    textDecoration: 'none',
                  }}
                >
                  1930
                </a>
              </div>
            </div>

            {/* Doors 2 & 3 side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

              {/* Door 2 — Not sure */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--rule-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--ink-secondary)',
                    opacity: 0.3,
                    flexShrink: 0,
                  }}
                >
                  2
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.375rem' }}>
                    I am not sure if this is a scam
                  </h3>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', flex: 1 }}>
                    A message, a job offer, a KYC link, a video call. 30 seconds. No login.
                  </p>
                  <Link
                    href="/check"
                    className="btn btn-ghost btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Check it
                  </Link>
                </div>
              </div>

              {/* Door 3 — Already lost */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--rule-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--ink-secondary)',
                    opacity: 0.3,
                    flexShrink: 0,
                  }}
                >
                  3
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: '0.375rem' }}>
                    Money, an account, or a photo is already gone
                  </h3>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', flex: 1 }}>
                    A debit you did not make. A locked Gmail. Photos they say they will send.
                  </p>
                  <Link
                    href="/check"
                    className="btn btn-ghost btn-sm"
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Start containment
                  </Link>
                </div>
              </div>
            </div>

            {/* Door 4 — Track strip */}
            <div
              style={{
                background: 'var(--surface-container-lowest)',
                border: '1px solid var(--rule-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink-text)', whiteSpace: 'nowrap' }}>
                Already filed? Track with your 14-digit number
              </p>
              <form
                action="/track"
                method="GET"
                style={{ display: 'flex', flex: 1, minWidth: '200px' }}
              >
                <input
                  name="id"
                  type="text"
                  placeholder="e.g. 12345678901234"
                  style={{
                    flex: 1,
                    background: 'var(--surface)',
                    border: '1px solid var(--rule-border)',
                    borderRight: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    color: 'var(--ink-text)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--rule-border)',
                    padding: '0.5rem 1rem',
                    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--ink-text)',
                    cursor: 'pointer',
                  }}
                >
                  Track
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
