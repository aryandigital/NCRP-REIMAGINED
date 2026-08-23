'use client';

import Link from 'next/link';

const STAGES = [
  { num: 1, label: 'Check', key: 'check' },
  { num: 2, label: 'Act', key: 'act' },
  { num: 3, label: 'Report', key: 'report' },
  { num: 4, label: 'Recover', key: 'recover' },
] as const;

type StageKey = typeof STAGES[number]['key'];

interface Props {
  current: StageKey;
  incidentId?: string;
}

export default function StageTimeline({ current, incidentId }: Props) {
  const currentIdx = STAGES.findIndex(s => s.key === current);

  return (
    <nav aria-label="Journey progress" className="stage-stepper">
      {STAGES.map((stage, idx) => {
        const status = idx < currentIdx ? 'completed' : idx === currentIdx ? 'active' : 'pending';
        const href = incidentId && idx < currentIdx
          ? `/${stage.key}/${incidentId}`
          : undefined;

        const inner = (
          <span className={`stage-step ${status}`}>
            <span className="stage-step-dot">
              {status === 'completed' ? '✓' : stage.num}
            </span>
            <span>{stage.label}</span>
          </span>
        );

        return (
          <span key={stage.key} style={{ display: 'flex', alignItems: 'center' }}>
            {href ? (
              <Link href={href} style={{ textDecoration: 'none' }}>{inner}</Link>
            ) : (
              inner
            )}
            {idx < STAGES.length - 1 && <span className="stage-connector" aria-hidden />}
          </span>
        );
      })}
    </nav>
  );
}
