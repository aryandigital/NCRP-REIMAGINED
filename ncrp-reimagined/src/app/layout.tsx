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
    <html lang="en">
      <body>
        {/* Quick Exit — present on every page */}
        <QuickExit />

        {/* Minimal top nav */}
        <header
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0.75rem 1.25rem',
          }}
        >
          <div
            className="container-page"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Link
              href="/"
              style={{
                fontWeight: 800,
                fontSize: '1.0625rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  background: 'var(--blue-primary)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '2px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                NCRP
              </span>
              Reimagined
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link href="/atlas" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Scam Atlas
              </Link>
              <Link href="/track" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Track Case
              </Link>
              <Link href="/help-someone" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Help Someone
              </Link>
              <Link
                href="/check"
                className="btn btn-primary btn-sm"
                style={{ paddingRight: '1rem', paddingLeft: '1rem' }}
              >
                Check a Scam
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
          <strong style={{ color: 'var(--text-secondary)' }}>Independent hackathon prototype.</strong>{' '}
          Not affiliated with MHA, I4C, or the Government of India. All data is synthetic.
          No national emblem, no I4C logo, no implication of government endorsement.{' '}
          <br />
          <span style={{ marginTop: '0.25rem', display: 'inline-block' }}>
            Crisis helpline:{' '}
            <a href="tel:1930" style={{ color: 'var(--blue-light)' }}>1930</a>{' '}
            · Mental health:{' '}
            <a href="tel:14416" style={{ color: 'var(--blue-light)' }}>Tele-MANAS 14416</a>
          </span>
        </footer>
      </body>
    </html>
  );
}
