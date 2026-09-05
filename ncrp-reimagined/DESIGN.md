# Raksha Design System

## Design read

Raksha is an independent public-service platform for people in a cyber-fraud crisis. The identity is original: an Indian pointed-arch (jharokha) grammar with arch windows, guard-dot rings, and concentric ripples. It uses deep indigo for focus, warm paper for working screens, and saffron for urgent action. The centered hero is a visible point of help at night. It should feel like a national service, never like an official government website.

## Dials

- Design variance: 4/10
- Motion intensity: 2/10
- Visual density: 5/10

## Foundations

- Primary type: Geist Sans with script-appropriate system fallbacks for readable UI in six Indian languages.
- Display type: Fraunces (Latin) + Tiro Devanagari Hindi (Devanagari) at high optical size for hero and section headlines.
- Reference type: Geist Mono for case IDs, step labels, and system status.
- Primary surfaces: navy `#1a237e`, warm paper `#fefcf8`, and soft paper `#f5f1ea`; ink `#1b1b1b`.
- Accent: saffron `#ff7722`, reserved for urgent actions, route emphasis, and sparse highlights. Indigo remains the dominant visual color.
- Icons: custom SVG set in `src/components/icons.tsx` — every icon is built from the same three primitives (pointed arch, circle, dotted ring). Never substitute stock icon sets in primary positions; lucide is allowed only for utility glyphs (arrows, close).
- The Raksha mark (`BrandMark`): pointed-arch shield ringed by twelve guard dots. Do not replace it with generated logos.
- Hero: a centered indigo aurora with restrained particles, a serif headline, the arch emblem, one primary action, one secondary action, and a quiet tracking link. The first primary action remains visible on a phone without scrolling.
- Generated artwork lives in `public/illustrations/`. Regenerate with `scripts/generate-assets.ps1` (`gpt-image-1-mini` works; `gpt-image-2`/`gpt-image-1` need a paid org).

## Layout language

- Hero: centered composition with a controlled vertical rhythm. Do not introduce a split hero.
- Sections alternate paper and deep-ink bands; process rails, bordered rows, and timelines stay more prominent than decorative card grids.
- Every route has a persistent emergency call strip and a stable masthead with the BrandMark. On small screens, navigation moves into an accessible Menu control.
- Language switcher sits at the right of the masthead and covers six languages site-wide (`?lang=` deep links honoured).

## Trust rules

- Never use a government emblem, official seal, or language that implies affiliation.
- The footer states plainly that the environment runs on sample data and transmits nothing to MHA, I4C, NCRP, banks, police, or platforms.
- Never say an uploaded screenshot stays on-device. Only the private-image fingerprint path is local.
- Pattern matches are advisory. They are not proof of identity, guilt, or safety.

## Interaction rules

- Minimum touch target: 44px.
- Visible labels remain visible on mobile.
- Loading, error, empty, uncertain, and completed states use the same layout as the successful state.
- Emergency actions appear before administrative actions.
- Raksha Samvaad (assistant) is docked bottom-right with a pulse ring and a one-time greeting bubble; accessibility tools dock bottom-left.
- Voice input is available at intake, in the assistant, and read-aloud is available from the accessibility panel.
- Reduced motion removes entrance animation and keeps state changes explicit.
