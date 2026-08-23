'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const JUDGE_ACCOUNTS = [
  {
    email: 'judge1@ncrp-demo.in',
    displayName: 'Judge Priya Sharma',
    role: 'Judge / Evaluator',
    password: 'Judge@1234',
    avatar: '👩‍⚖️',
  },
  {
    email: 'judge2@ncrp-demo.in',
    displayName: 'Judge Arjun Mehta',
    role: 'Judge / Evaluator',
    password: 'Judge@5678',
    avatar: '👨‍⚖️',
  },
  {
    email: 'investigator@ncrp-demo.in',
    displayName: 'Insp. R. K. Verma',
    role: 'Investigating Officer (Mock)',
    password: 'Investigate@99',
    avatar: '🕵️',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        router.push('/');
      } else {
        setError(data.error ?? 'Login failed.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  }

  function quickLogin(account: typeof JUDGE_ACCOUNTS[number]) {
    setEmail(account.email);
    setPassword(account.password);
  }

  return (
    <div style={{ padding: '3rem 1.25rem', minHeight: '80vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'var(--amber-subtle)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '999px',
              padding: '0.25rem 0.875rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--amber-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            Demo / Judge Access
          </div>
          <h1 style={{ marginBottom: '0.5rem' }}>Evaluator Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            For hackathon judges and demo reviewers. Use the quick-login buttons below.
          </p>
        </div>

        {/* Quick login switchers */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
            Quick-login (judge credentials)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {JUDGE_ACCOUNTS.map(a => (
              <button
                key={a.email}
                onClick={() => quickLogin(a)}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', gap: '0.875rem' }}
              >
                <span style={{ fontSize: '1.375rem' }}>{a.avatar}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{a.displayName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual login form */}
        <div className="card">
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="judge@ncrp-demo.in"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div style={{ background: 'var(--red-subtle)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem', color: 'var(--red-light)', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          These are demo credentials for evaluation purposes only. No real personal data is stored.
        </p>
      </div>
    </div>
  );
}
