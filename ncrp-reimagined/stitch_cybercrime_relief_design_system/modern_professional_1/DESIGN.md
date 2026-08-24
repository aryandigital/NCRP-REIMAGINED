---
name: Modern Professional
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#005db8'
  primary: '#005ab4'
  on-primary: '#ffffff'
  primary-container: '#0a73e0'
  on-primary-container: '#fefcff'
  inverse-primary: '#aac7ff'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#3945e3'
  on-tertiary: '#ffffff'
  tertiary-container: '#5461fc'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bec2ff'
  on-tertiary-fixed: '#00046a'
  on-tertiary-fixed-variant: '#1c28ce'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Design System: Modern Professional

## Brand & Style
The brand identity has shifted from a warm, high-energy aesthetic to a cool, dependable, and professional tone. The style is **Corporate / Modern**, emphasizing reliability and balance. It utilizes a refined blue-centric palette to evoke trust and clarity, suitable for enterprise-grade applications or focused utility tools. The visual language is clean, structured, and prioritizes legibility and functional efficiency.

## Colors
The color palette is anchored by a vibrant Primary Blue (#1275e2), conveying intelligence and stability. The Secondary palette uses a muted, desaturated blue-grey (#5f78a3) to provide professional support without competing for attention. A Tertiary Indigo (#000ec4) acts as a sophisticated, high-contrast accent for specific call-to-actions or status indicators that require visibility. The Neutral tones are grounded in a cool grey (#74777f) to maintain a cohesive, modern feel across surfaces and borders.

## Typography
The system now utilizes **Inter** across all roles—headlines, body text, and labels. Inter provides a highly legible, neutral, and technical appearance that scales perfectly from small captions to large display text. Headlines use heavier weights (Semi-bold/Bold) to establish a clear hierarchy, while body text maintains a standard weight for long-form readability.

## Layout & Spacing
The layout follows a fluid grid system with a base unit of 8px. This 8px rhythm ensures consistency across padding, margins, and component heights. Gutters are set to 16px to maintain a breathable but compact density. On mobile devices, side margins are 16px, expanding to 24px on desktop to accommodate larger screen real estate.

## Elevation & Depth
The system uses **Tonal Layers** supplemented by soft, ambient shadows. Depth is primarily communicated through subtle shifts in background color (surface-container tiers) to keep the interface looking flat and modern. Where physical elevation is required (e.g., modals or floating buttons), a low-opacity, diffused shadow is used to lift the element without creating visual clutter.

## Shapes
The shape language has moved from sharp corners to a **Rounded** profile. Standard components feature a 0.5rem (8px) corner radius, while larger containers like cards use 1rem (16px). This subtle rounding softens the professional aesthetic, making the interface feel more approachable and modern.

## Components
- **Buttons:** Use the Primary Blue for main actions with 8px rounded corners. Text is set in Inter Medium.
- **Cards:** Defined by a 1px neutral-variant border and a 16px (rounded-lg) corner radius.
- **Input Fields:** Utilize a subtle neutral-grey outline that shifts to Primary Blue on focus.
- **Chips/Labels:** Small 8px radius or pill-shapes for categorizations, using the Secondary or Tertiary palettes for semantic differentiation.