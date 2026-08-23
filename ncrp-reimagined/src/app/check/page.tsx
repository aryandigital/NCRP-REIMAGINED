import StageTimeline from '@/components/StageTimeline';
import EvidenceDrop from '@/components/EvidenceDrop';

interface Props {
  searchParams: Promise<{ q?: string; track?: string }>;
}

export default async function CheckPage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <StageTimeline current="check" />

        <div style={{ marginTop: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Check if something is a scam</h1>
          <p style={{ marginBottom: '2rem' }}>
            Upload a screenshot, paste a message, or describe what happened.
            The Scam DNA engine will identify the pattern, predict the next move, and tell you exactly what not to do.
          </p>

          {/* Privacy notice */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ flexShrink: 0 }}>🔒</span>
            <span>
              <strong style={{ color: 'var(--text-secondary)' }}>Privacy: </strong>
              All personally identifiable information (Aadhaar, PAN, phone numbers, bank accounts)
              is redacted from your input before any analysis or storage. For intimate images,
              only a perceptual hash computed in your browser is transmitted — the image never leaves your device.
            </span>
          </div>

          <EvidenceDrop initialText={q ?? ''} />
        </div>

        {/* What happens after */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>What happens after you submit?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { icon: '🧬', text: 'Your input is matched against 15 canonical scam behavioral patterns.' },
              { icon: '📍', text: 'The exact stage in the scam lifecycle is identified (e.g. "Withdrawal Blocked").' },
              { icon: '⚡', text: 'The scammer\'s likely next demand is predicted.' },
              { icon: '⛔', text: 'Critical "Do Not" warnings prevent you from making the situation worse.' },
              { icon: '➡️', text: 'You proceed to Immediate Action Mode if harm is confirmed — without re-entering any information.' },
            ].map(step => (
              <div key={step.icon} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.125rem', flexShrink: 0 }}>{step.icon}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
