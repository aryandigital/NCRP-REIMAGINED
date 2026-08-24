'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StageTimeline from '@/components/StageTimeline';
import RiskVerdict from '@/components/RiskVerdict';
import type { ScamVerdictContract } from '@/lib/scam-dna';

function readPendingVerdict(): ScamVerdictContract | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem('dna-pending');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ScamVerdictContract;
  } catch {
    return null;
  }
}

export default function CheckResultPage() {
  const router = useRouter();
  const verdict = readPendingVerdict();

  useEffect(() => {
    if (!verdict) router.replace('/check');
  }, [verdict, router]);

  if (!verdict) {
    return (
      <div style={{ padding: '2rem 1.25rem' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
            Loading result…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.25rem' }}>
      <div className="container-narrow">
        <StageTimeline current="check" />
        <div style={{ marginTop: '2rem' }}>
          <RiskVerdict verdict={verdict} incidentId={null} />
        </div>
      </div>
    </div>
  );
}
