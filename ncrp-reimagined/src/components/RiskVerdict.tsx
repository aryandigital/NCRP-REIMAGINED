'use client';

import Link from 'next/link';
import type { ScamVerdictContract } from '@/lib/scam-dna';

interface Props {
  verdict: ScamVerdictContract;
  incidentId: string | null;
}

const RISK_CONFIG = {
  HIGH: {
    badgeClass: 'badge-high',
    label: 'HIGH RISK',
    icon: '⚠️',
    borderColor: 'var(--red-primary)',
    bgColor: 'var(--red-subtle)',
    headline: 'This matches a known scam pattern.',
  },
  MEDIUM: {
    badgeClass: 'badge-medium',
    label: 'MEDIUM RISK',
    icon: '⚡',
    borderColor: 'var(--amber-primary)',
    bgColor: 'var(--amber-subtle)',
    headline: 'Several warning signs detected.',
  },
  UNCLEAR: {
    badgeClass: 'badge-unclear',
    label: 'UNCLEAR PATTERN',
    icon: '🔍',
    borderColor: 'var(--slate-primary)',
    bgColor: 'var(--slate-subtle)',
    headline: 'Could not confirm a pattern — treat with caution.',
  },
};

export default function RiskVerdict({ verdict, incidentId }: Props) {
  const cfg = RISK_CONFIG[verdict.risk];
  const confidencePct = Math.round(verdict.confidence * 100);

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Risk header */}
      <div
        className="card"
        style={{
          borderLeft: `4px solid ${cfg.borderColor}`,
          background: cfg.bgColor,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <span className={cfg.badgeClass} style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'inline-flex' }}>
              {cfg.icon} {cfg.label}
            </span>
            <h2 style={{ margin: '0.5rem 0 0.25rem', color: 'var(--text-primary)' }}>
              {verdict.patternName}
            </h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{cfg.headline}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {confidencePct}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              pattern match
            </div>
            <div className="confidence-bar-track" style={{ width: '100px', marginLeft: 'auto' }}>
              <div className="confidence-bar-fill" style={{ width: `${confidencePct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stage detection */}
      <div className="card">
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          Current Stage Detected
        </div>
        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.0625rem' }}>
          {verdict.currentStageName}
        </div>
      </div>

      {/* Quoted signals */}
      <div className="card">
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
          3 Signals Found In Your Evidence
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {verdict.quotedSignals.map((sig, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                padding: '0.625rem 0.875rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            >
              {sig}
            </div>
          ))}
        </div>
      </div>

      {/* Predicted next move */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--amber-primary)',
          background: 'var(--amber-subtle)',
        }}
      >
        <div style={{ color: 'var(--amber-light)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          ⚡ Predicted Next Scammer Move
        </div>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 500 }}>
          {verdict.likelyNextMove}
        </p>
      </div>

      {/* Do NOT warnings */}
      <div className="card">
        <div style={{ color: 'var(--red-light)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.875rem' }}>
          ⛔ Do Not Do These Things
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {verdict.doNot.map((d, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: '0.625rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
              }}
            >
              <span style={{ color: 'var(--red-light)', flexShrink: 0 }}>✕</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      {/* Safe verification */}
      <div className="card" style={{ background: 'var(--green-subtle)', borderLeft: '4px solid var(--green-primary)' }}>
        <div style={{ color: 'var(--green-light)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          ✓ Safe Verification (without using their links)
        </div>
        <p style={{ margin: 0, color: 'var(--text-primary)' }}>
          {verdict.safeVerification}
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
        <Link
          href={incidentId ? `/triage/${incidentId}` : '/triage'}
          className="btn btn-danger btn-lg"
          style={{ flex: 1, minWidth: 220 }}
        >
          I already took action / paid — Help me contain
        </Link>
        <Link
          href={incidentId ? `/report/${incidentId}` : '/report'}
          className="btn btn-secondary"
          style={{ flex: 1, minWidth: 180 }}
        >
          File a complaint →
        </Link>
      </div>

      {incidentId && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
          Incident ID: <span className="mono">{incidentId}</span>
        </p>
      )}
    </div>
  );
}
