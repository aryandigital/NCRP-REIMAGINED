import type { Metadata } from 'next';
import './globals.css';
import QuickExit from '@/components/QuickExit';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NCRP Reimagined — Contain the Escape First',
  description:
    'A citizen-first redesign of India\'s National Cyber Crime Reporting Portal. Check if something is a scam, get immediate containment steps, and build your legal case — all in one journey.',
  keywords: ['cybercrime', 'scam', 'India', 'NCRP', 'cyber fraud', 'digital arrest'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QuickExit />

        {/* Blue City Header */}
        <header
          style={{
            background: 'var(--background)',
            borderBottom: '1px solid var(--rule-border)',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            className="container-page"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
          >
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'var(--trust-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                NCRP
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    color: 'var(--trust-teal)',
                  }}
                >
                  Reimagined
                </span>
                <span
                  className="label-mono"
                  style={{ fontSize: '9px', color: 'var(--ink-secondary)', letterSpacing: '0.03em' }}
                >
                  Independent prototype — not a government site
                </span>
              </div>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link
                href="/atlas"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--ink-secondary)',
                  textDecoration: 'none',
                }}
              >
                Scam playbooks
              </Link>
              <Link
                href="/track"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--ink-secondary)',
                  textDecoration: 'none',
                }}
              >
                Track a report
              </Link>
              <Link
                href="/help-someone"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--ink-secondary)',
                  textDecoration: 'none',
                }}
              >
                Help someone
              </Link>
              <Link
                href="/check"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--rule-border)',
                  color: 'var(--ink-text)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
              >
                Check a message
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main style={{ minHeight: 'calc(100vh - 120px)' }}>
          {children}
        </main>

        {/* Mandatory persistent disclaimer */}
        <footer className="disclaimer-footer">
          <div className="container-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink-text)' }}>
              © NCRP Reimagined. Citizen Crisis Line:{' '}
              <a href="tel:1930" style={{ color: 'var(--trust-teal)', fontWeight: 700 }}>1930</a>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: 'var(--ink-secondary)', fontSize: '0.75rem' }}>National Cyber Help</a>
              <a href="#" style={{ color: 'var(--ink-secondary)', fontSize: '0.75rem' }}>Legal Aid</a>
              <a href="#" style={{ color: 'var(--ink-secondary)', fontSize: '0.75rem' }}>Privacy Policy</a>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.6875rem', color: 'var(--outline)', maxWidth: '600px' }}>
              Independent hackathon prototype. Not affiliated with MHA, I4C, or the Government of India.
              All data is synthetic. No national emblem, no I4C logo, no implication of government endorsement.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
