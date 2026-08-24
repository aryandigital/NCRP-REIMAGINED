# Raksha Design System

## Design read

Raksha is an independent public-service platform for people in a cyber-fraud crisis. The identity is original: an Indian pointed-arch (jharokha) grammar — arch windows, guard-dot rings, concentric ripples — set in a **Night Durbar** dark theme: deep indigo night, warm off-white ink, the spectrum used as glow. The hero artwork is a lit jharokha window in the dark — help, visible at night. It borrows the confidence of modern Indian design (Sarvam-class spectrum discipline) without copying any brand's marks. It should feel like a national service, never like an official government website.

## Dials

- Design variance: 4/10
- Motion intensity: 2/10
- Visual density: 5/10

## Foundations

- Primary type: Geist Sans for readable UI in six Indian languages.
- Display type: Fraunces (Latin) + Tiro Devanagari Hindi (Devanagari) at high optical size for hero and section headlines.
- Reference type: Geist Mono for case IDs, step labels, and system status.
- Primary surface: night indigo paper (`#080b16`) with `#101529` working panels; warm off-white ink (`#edece1`).
- Spectrum: indigo `#6f86f5` → periwinkle `#8ea0ff` → lilac `#c79ae0` → saffron `#ff9d5c` (brightened for dark). Used as glow: emergency bar, FAB, section rules, icon wells, primary CTA gradient.
- Icons: custom SVG set in `src/components/icons.tsx` — every icon is built from the same three primitives (pointed arch, circle, dotted ring). Never substitute stock icon sets in primary positions; lucide is allowed only for utility glyphs (arrows, close).
- The Raksha mark (`BrandMark`): pointed-arch shield ringed by twelve guard dots. Do not replace it with generated logos.
- Hero: full-bleed aurora gradient (saffron → lilac → indigo) melting into the night theme; centered serif headline in dark ink; the white-line arch emblem (`public/illustrations/raksha-arch-emblem.png`) above the headline; dark pill + white pill CTAs; mono statline at the base. One artwork per viewport, never busy pattern fills.
- Generated artwork lives in `public/illustrations/`. Regenerate with `scripts/generate-assets.ps1` (`gpt-image-1-mini` works; `gpt-image-2`/`gpt-image-1` need a paid org).

## Layout language

- Hero: asymmetric split — copy left, arch-window artwork right; eyebrow pill, pill CTAs, one quiet safety line. No full-bleed artwork.
- Sections alternate paper / white / deep-ink bands; process rails, bordered rows, and timelines over decorative card grids.
- Every route has a persistent emergency call strip and a stable floating-pill masthead with the BrandMark.
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
