---
name: Citizen's Desk
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#3f4946'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#6f7976'
  outline-variant: '#bec9c5'
  surface-tint: '#21695f'
  primary: '#00433b'
  on-primary: '#ffffff'
  primary-container: '#0c5c52'
  on-primary-container: '#8dd2c5'
  inverse-primary: '#8fd3c6'
  secondary: '#59605d'
  on-secondary: '#ffffff'
  secondary-container: '#dee4e0'
  on-secondary-container: '#5f6663'
  tertiary: '#6f1f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#91330f'
  on-tertiary-container: '#ffb49b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaf0e2'
  primary-fixed-dim: '#8fd3c6'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#dee4e0'
  secondary-fixed-dim: '#c2c8c4'
  on-secondary-fixed: '#171d1b'
  on-secondary-fixed-variant: '#424846'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#822803'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
  canvas: '#FAF9F6'
  raised: '#FFFFFF'
  sunken: '#F2F0EC'
  ink-secondary: '#55605B'
  ink-muted: '#8A928D'
  hairline: '#E6E3DD'
  accent-hover: '#084B43'
  accent-tint: '#E7F0EE'
  signal-tint: '#FAEDE7'
  deadline: '#A8762A'
  deadline-tint: '#F7EFE0'
typography:
  display-lg:
    fontFamily: Instrument Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Instrument Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Instrument Serif
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  question-bold:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  label-mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  number-display:
    fontFamily: IBM Plex Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width-content: 720px
  header-height: 72px
---

## Brand & Style

The design system is modeled after a beautifully printed civic handbook—a digital interface that prioritizes clarity, restraint, and tactile warmth. The brand personality is authoritative yet approachable, designed to lower cognitive load for citizens during high-stress interactions.

The visual direction follows a **Minimalist/Editorial** style. It rejects typical digital artifice (heavy gradients, neon colors, complex shadows) in favor of heavy whitespace, high-contrast legibility, and a "low-ink" philosophy. The aesthetic evokes the quiet reliability of physical stationery, ensuring every element on the screen serves a functional purpose.

## Colors

The palette is rooted in a "paper and ink" metaphor. **Canvas** serves as the primary background to soften the screen's glow, while **Ink** provides the structural grounding for text and borders.

- **Primary (Accent):** Use sparingly for primary actions and active states. Do not exceed 8% of screen coverage.
- **Secondary (Ink):** Used for all critical text and structural hierarchy.
- **Tertiary (Signal):** Reserved strictly for urgency or critical errors. Apply as high-contrast accents or hairlines rather than large blocks of color.
- **Surface Hierarchy:** 
    - `Canvas`: Global background.
    - `Raised`: For high-priority cards and interactive containers.
    - `Sunken`: For nested informational wells or inactive secondary areas.

## Typography

The typographic system utilizes a three-way pairing to establish a clear editorial hierarchy:
- **Instrument Serif:** Used for display and section headings to convey authority and traditional trust.
- **Lexend:** Chosen for its extreme readability. Used for all body copy, user instructions, and form questions.
- **IBM Plex Mono:** Used for technical metadata, timers, reference hashes, and numeric data to provide a precise, "official" feel.

**Tone:** Copy must be direct and outcome-oriented, written at a Grade 6-8 reading level. Avoid jargon and address the user with active verbs.

## Layout & Spacing

This design system uses a **Fixed Grid** philosophy to maintain an editorial reading experience. The central content column is constrained to a maximum width of 720px to ensure optimal line lengths and focused attention.

- **The Editorial Margin:** Generous whitespace is a core functional element. Desktop layouts use 64px margins to isolate the content from visual noise.
- **Chrome:** The header is fixed at 72px with a fade-out hairline at the bottom. 
- **The "Quick Exit" Rule:** Always position the "Quick Exit" action in the top-right corner of the viewport, styled as an outline button for immediate visibility without being the primary focus.
- **Rhythm:** All component spacing and padding must align to a 4px baseline.

## Elevation & Depth

Visual hierarchy is conveyed through **Tonal Layers** and **Hairline Rules** rather than aggressive shadows. 

- **Surface tiers:** Depth is created by placing `Raised` (#FFFFFF) surfaces over the `Canvas` (#FAF9F6) background.
- **Separation:** Use 1px `Hairline` (#E6E3DD) rules to divide content sections. Boxes are generally avoided; rely on whitespace and horizontal rules to define blocks.
- **Shadow character:** When elevation must be explicit (e.g., a modal or floating action), use highly diffused, low-opacity shadows tinted with `Ink`: `0 12px 32px -12px rgba(27, 33, 31, 0.10)`.

## Shapes

The shape language is purposefully varied to categorize information types while maintaining a cohesive "soft-modern" look.

- **Cards:** 12px rounding for a welcoming, contained feel.
- **Inputs & Buttons:** 10px rounding to create a distinct interactive signature.
- **Chips & Tags:** 6px rounding for secondary information.
- **Strictures:** Avoid using boxes for everything; default to open-sided layouts with horizontal hairline dividers.

## Components

- **Primary Buttons:** Solid `Accent` (#0C5C52) fill with `Canvas` (#FAF9F6) text. Buttons are large (48px height) and direct (e.g., "Submit Report" instead of "Continue").
- **Secondary Buttons:** 1px `Ink Muted` border and text. Use for neutral actions.
- **Quick Exit:** Always an outline button in the top-right header, using `Signal` (#C0552F) for the label text.
- **Choice Rows:** Radio and checkbox options should be full-width containers separated by hairlines. Active states use `Accent Tint` background and a 2px vertical `Accent` rule on the far left.
- **Input Fields:** `Raised` surface fill with 1px `Hairline` border. Labels are `Lexend 600` and always positioned above the field.
- **Chips:** Small `Sunken` fill containers with `Ink Secondary` text for categories or status labels.
- **Reporting Stage Rail:** A 1px vertical hairline connecting 8px circular nodes to track progress. Active nodes are filled with `Accent`; completed nodes use a hairline stroke.