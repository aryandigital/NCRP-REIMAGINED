'use client';

import { useState } from 'react';

export default function TrackPage() {
  const [ackNumber, setAckNumber] = useState('');

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <h1 style={{ marginBottom: '0.5rem' }}>Track Your Complaint</h1>
        <p style={{ marginBottom: '2rem' }}>
          Enter your 14-digit national acknowledgement number to see plain-language status updates
          and download generated legal letters. No login required.
        </p>

        <div className="card">
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Acknowledgement Number
          </label>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <input
              type="text"
              className="input mono"
              placeholder="20260823XXXXXX"
              value={ackNumber}
              onChange={e => setAckNumber(e.target.value.replace(/\D/g, '').slice(0, 14))}
              maxLength={14}
              style={{ letterSpacing: '0.1em' }}
            />
            <button className="btn btn-primary" disabled={ackNumber.length !== 14}>
              Track →
            </button>
          </div>
          <p style={{ marginTop: '0.625rem', marginBottom: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Format: 14 digits · Example: 20260823019842
          </p>
        </div>

        <div className="card" style={{ marginTop: '1.5rem', borderLeft: '4px solid var(--amber-primary)', background: 'var(--amber-subtle)' }}>
          <span className="badge-sim">PHASE 4 — Planned</span>
          <p style={{ margin: '0.5rem 0 0' }}>
            Full case tracking with live status, statutory clock monitoring, and document downloads is built in Phase 4.
          </p>
        </div>
      </div>
    </div>
  );
}
