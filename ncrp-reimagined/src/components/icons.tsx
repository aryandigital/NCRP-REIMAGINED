"use client";

import { useId } from "react";

/**
 * Raksha icon system.
 * Grammar: Indian pointed-arch (jharokha) silhouettes, concentric circles,
 * and dotted rings. Stroke-led, 24px grid, round caps. Every icon is drawn
 * from the same three primitives so the set reads as one family.
 */

type IconProps = {
  size?: number;
  className?: string;
  spectrum?: boolean;
  title?: string;
};

function useSpectrum(spectrum: boolean | undefined) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return { gradientId: `rk-${id}`, stroke: spectrum ? `url(#rk-${id})` : "currentColor", spectrum: Boolean(spectrum) };
}

function SpectrumDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2b46ce" />
        <stop offset=".55" stopColor="#8f7ee8" />
        <stop offset="1" stopColor="#ff8a3d" />
      </linearGradient>
    </defs>
  );
}

function Base({ size = 24, className, title, gradientId, stroke, spectrum, children }: IconProps & { gradientId: string; stroke: string; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} role={title ? "img" : "presentation"} aria-hidden={title ? undefined : true}>
      {spectrum ? <SpectrumDefs id={gradientId} /> : null}
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} role="img" aria-label="Raksha">
      <path d="M12 2.4c2.7 3.1 6.6 4.7 6.6 8.8v5.1c0 2.6-2.2 4.4-6.6 5.8-4.4-1.4-6.6-3.2-6.6-5.8v-5.1c0-4.1 3.9-5.7 6.6-8.8Z"/>
      <path d="M8.2 16.3v-4.4c0-1.8 1.6-3.4 3.8-4.7 2.2 1.3 3.8 2.9 3.8 4.7v4.4"/>
      <path d="M8.2 16.3h7.6"/>
      <path d="m10.1 13.8 1.5 1.5 2.7-3"/>
      <circle cx="12" cy="10.1" r=".65" fill="currentColor" stroke="none"/>
    </svg>
  );
}

/** Emergency call: handset with rising signal arcs. */
export function IconEmergency(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <path d="M7.2 4.5 H9.8 L11.2 8.2 L9.3 9.6 A 12.5 12.5 0 0 0 14.4 14.7 L15.8 12.8 L19.5 14.2 V16.8 A 1.9 1.9 0 0 1 17.6 18.7 A 14.6 14.6 0 0 1 5.3 6.4 A 1.9 1.9 0 0 1 7.2 4.5 Z" />
      <path d="M14.5 3.6 A 6.8 6.8 0 0 1 20.4 9.5" strokeDasharray="0.1 2.6" />
      <path d="M14.8 6.4 A 3.9 3.9 0 0 1 17.6 9.2" />
    </Base>
  );
}

/** Report document: arch-top sheet with a seal. */
export function IconReport(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <path d="M7 21 V7.6 C 7 5.2 9.2 4.4 12 3.2 C 14.8 4.4 17 5.2 17 7.6 V21" />
      <path d="M7 21 H17" />
      <path d="M9.6 9.4 H14.4" />
      <path d="M9.6 12 H14.4" />
      <circle cx="12" cy="16.4" r="1.9" />
    </Base>
  );
}

/** Voice: capsule ringed by sound arcs. */
export function IconVoice(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <rect x="10" y="3" width="4" height="8.5" rx="2" />
      <path d="M6.8 10.8 A 5.2 5.2 0 0 0 17.2 10.8" />
      <path d="M12 16 V 19.4" />
      <path d="M9.2 19.4 H14.8" />
      <path d="M4.4 9.2 A 8.4 8.4 0 0 0 19.6 9.2" strokeDasharray="0.1 3" />
    </Base>
  );
}

/** Evidence frame: four corner arcs and a center seal. */
export function IconEvidence(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <path d="M4 8.6 V4 H8.6" />
      <path d="M15.4 4 H20 V8.6" />
      <path d="M20 15.4 V20 H15.4" />
      <path d="M8.6 20 H4 V15.4" />
      <circle cx="12" cy="12" r="3.1" />
      <circle cx="12" cy="12" r="0.4" fill={g.stroke} />
    </Base>
  );
}

/** Identification radar: ringed circle with a single arch petal. */
export function IconRadar(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.6" strokeDasharray="0.1 2.8" />
      <path d="M12 12 L17.4 7.2" />
      <path d="M12 3.8 C 12.9 4.7 13.4 5.3 13.4 6.1 C 13.4 6.9 12.8 7.4 12 7.4 C 11.2 7.4 10.6 6.9 10.6 6.1 C 10.6 5.3 11.1 4.7 12 3.8 Z" fill={g.stroke} stroke="none" />
    </Base>
  );
}

/** Recovery: three ascending arches meeting a sun. */
export function IconRecover(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <path d="M3.5 20.5 V17.8 A 2.3 2.3 0 0 1 8.1 17.8 V20.5" />
      <path d="M9.9 20.5 V15.4 A 2.3 2.3 0 0 1 14.5 15.4 V20.5" />
      <path d="M16.3 20.5 V12.6 A 2.3 2.3 0 0 1 20.9 12.6 V20.5" />
      <path d="M2.6 20.5 H21.4" />
      <circle cx="18.6" cy="5.6" r="1.7" />
    </Base>
  );
}

/** Case clock: ring with a single arch hand. */
export function IconClock(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.2 V12 L15.2 14" />
      <circle cx="12" cy="12" r="0.5" fill={g.stroke} />
    </Base>
  );
}

/** Alert: arch outline with a pulse line. */
export function IconAlert(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <path d="M12 3.4 C 15.6 5.6 18.6 6.9 18.6 10.2 V14.6 C 18.6 18.2 15.6 20.2 12 21.4 C 8.4 20.2 5.4 18.2 5.4 14.6 V10.2 C 5.4 6.9 8.4 5.6 12 3.4 Z" />
      <path d="M12 8.6 V12.8" />
      <circle cx="12" cy="15.9" r="0.6" fill={g.stroke} />
    </Base>
  );
}

/** Languages: circle held by four petal arcs. */
export function IconLanguages(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <circle cx="12" cy="12" r="8.2" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.2" />
      <path d="M3.8 12 H20.2" />
      <path d="M5.4 7.6 C 8 9 16 9 18.6 7.6" />
      <path d="M5.4 16.4 C 8 15 16 15 18.6 16.4" />
    </Base>
  );
}

/** Guidance: an arch lamp with rising dots. */
export function IconGuide(props: IconProps) {
  const g = useSpectrum(props.spectrum);
  return (
    <Base {...props} {...g}>
      <path d="M12 3.6 C 14.6 5.4 16.4 6.4 16.4 9 V15.6 H7.6 V9 C 7.6 6.4 9.4 5.4 12 3.6 Z" />
      <path d="M9.4 18.6 H14.6" />
      <path d="M10.8 21 H13.2" />
      <circle cx="12" cy="10.6" r="1.6" />
    </Base>
  );
}
