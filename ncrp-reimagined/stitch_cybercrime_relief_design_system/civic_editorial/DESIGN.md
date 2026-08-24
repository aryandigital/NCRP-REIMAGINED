---
name: Civic Editorial
colors:
  surface: '#FFFFFF'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#434846'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#747876'
  outline-variant: '#c3c7c5'
  surface-tint: '#59605d'
  primary: '#040907'
  on-primary: '#ffffff'
  primary-container: '#1b211f'
  on-primary-container: '#828986'
  inverse-primary: '#c2c8c4'
  secondary: '#21695f'
  on-secondary: '#ffffff'
  secondary-container: '#aaf0e2'
  on-secondary-container: '#286f65'
  tertiary: '#160200'
  on-tertiary: '#ffffff'
  tertiary-container: '#400e00'
  on-tertiary-container: '#d7663e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee4e0'
  primary-fixed-dim: '#c2c8c4'
  on-primary-fixed: '#171d1b'
  on-primary-fixed-variant: '#424846'
  secondary-fixed: '#aaf0e2'
  secondary-fixed-dim: '#8fd3c6'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#822803'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
  canvas: '#FAF9F6'
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
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Source Serif 4
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
  touch-target: 48px
  max-width: 720px
---

## Brand & Style
The design system is built on the narrative of a "Citizen’s Handbook"—a digital interface that feels as reliable, tactile, and legible as a beautifully printed civic manual. It prioritizes clarity and restraint over digital artifice. 

The aesthetic is **Minimalist and Editorial**, utilizing heavy whitespace, structured typography, and a "low-ink" philosophy. The goal is to lower the cognitive load for citizens in high-stress situations (cyber-crime reporting) by providing a calm, authoritative, and warm environment. Visual noise is eliminated in favor of high-contrast legibility and functional elegance.

## Colors
The palette is inspired by physical stationary and archival ink. Use **Canvas (#FAF9F6)** as the global background to reduce screen glare. **Ink (#1B211F)** serves as the primary color for all critical text and structural elements.

**Color Budgeting Rules:**
- **Accent (#0C5C52):** Limit usage to less than 8% of the screen area. Use for primary actions and active states.
- **Signal (#C0552F):** Reserved for urgency. Never use as a solid block fill; apply only to 2px rules, status dots, or critical text.
- **Surface Hierarchy:** Use `Surface` for raised cards and `Sunken` for nested wells or secondary informational blocks.

## Typography
The typographic system uses a three-way pairing to establish a clear information hierarchy:
- **Serif (Source Serif 4):** Used for headlines and editorial narrative. It conveys authority and traditional trust.
- **Sans (Lexend):** Designed for maximum readability. Used for all body copy, form questions, and instructions.
- **Mono (IBM Plex Mono):** Used for technical data, reference numbers, hashes, and timestamps to provide a precise, "official" feel.

**Voice and Tone Note:** Content should be written at a Grade 6-8 reading level. Use short, punchy sentences and address the user directly ("You", "Your money").

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for content readability. The central content column is constrained to a maximum width of 720px to ensure optimal line lengths for reading.

- **Rhythm:** All spacing is based on a 4px baseline grid.
- **Margins:** Use 16px margins on mobile and scale to 64px on desktop to provide ample "breathing room" (the "Editorial Margin").
- **Interactive zones:** All buttons and touchable elements must maintain a minimum 48px height/width to meet WCAG 2.2 AA standards.

## Elevation & Depth
This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Hairline Rules**. 

- **Elevation:** Depth is created by placing `Surface (#FFFFFF)` cards on top of the `Canvas (#FAF9F6)`. 
- **Shadows:** Use a very subtle "Paper Shadow" for raised elements: `0 1px 2px rgba(27,33,31,0.04)` for micro-depth, and `0 12px 32px -12px rgba(27,33,31,0.10)` for larger modal-like cards.
- **Separation:** Use 1px `Hairline (#E6E3DD)` rules to divide content sections, mimicking the layout of a printed form.

## Shapes
The shape language is "Soft-Modern." While the brand is serious, the slight rounding of corners makes the interface feel more approachable and less "bureaucratic."

- **Standard Cards:** 12px radius.
- **Inputs & Buttons:** 10px radius for a focused, contained look.
- **Chips & Tags:** 6px radius.
- **Selected States:** Elements like "Choice Rows" use a 2px vertical rule on the left edge rather than rounded corners to indicate selection.

## Components
- **C1 Primary Button:** Solid `Accent` fill with `Canvas` text. No gradients. High-contrast and purposeful.
- **C2 Secondary Button:** Transparent background with `Ink Muted` 1px border and text.
- **C4 Input Field:** `White` surface fill with a `Hairline` border. Labels are always positioned above the input in `Lexend 600`.
- **C5 Choice Row:** Used for radio/checkbox options. Full-width containers with hairline separators. When selected, apply `Accent Tint` background and a 2px `Accent` left rule.
- **C7/C8 Notes & Quotes:** Use a 2px `Accent` left rule with 16px horizontal padding. Quotes should use the `Sunken` well background with the right corners rounded.
- **C9 Clock Ring:** A 72px diameter ring with a 2px stroke. Use an arc to visualize remaining time and `IBM Plex Mono` for the digital time display inside.
- **C11 Stage Rail:** A vertical or horizontal hairline connecting 8px dots (nodes) to indicate progress through the reporting stages.
- **C14 Redaction Chip:** `Sunken` fill with a 1px horizontal strike-through line, used for obfuscated sensitive data.