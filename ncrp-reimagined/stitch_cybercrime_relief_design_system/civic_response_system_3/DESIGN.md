---
name: Civic Response System
colors:
  surface: '#F4F6F7'
  surface-dim: '#d8dade'
  surface-bright: '#f8f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f8'
  surface-container: '#eceef2'
  surface-container-high: '#e7e8ec'
  surface-container-highest: '#e1e2e6'
  on-surface: '#191c1f'
  on-surface-variant: '#424750'
  inverse-surface: '#2e3134'
  inverse-on-surface: '#eff1f5'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#265fa2'
  primary: '#003465'
  on-primary: '#ffffff'
  primary-container: '#004b8d'
  on-primary-container: '#91bdff'
  inverse-primary: '#a6c8ff'
  secondary: '#575f65'
  on-secondary: '#ffffff'
  secondary-container: '#d9e1e7'
  on-secondary-container: '#5c6469'
  tertiary: '#2e3439'
  on-tertiary: '#ffffff'
  tertiary-container: '#454b50'
  on-tertiary-container: '#b5bbc1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#dce3ea'
  secondary-fixed-dim: '#c0c8ce'
  on-secondary-fixed: '#151d21'
  on-secondary-fixed-variant: '#40484d'
  tertiary-fixed: '#dee3e9'
  tertiary-fixed-dim: '#c1c7cd'
  on-tertiary-fixed: '#161c21'
  on-tertiary-fixed-variant: '#41474c'
  background: '#f8f9fd'
  on-background: '#191c1f'
  surface-variant: '#e1e2e6'
  page-bg: '#FFFFFF'
  hairline: '#D6DBDF'
  signal: '#B45309'
  signal-surface: '#FFF7E6'
  danger: '#B3261E'
  danger-surface: '#FDECEA'
  confirmed: '#0F6B3F'
  confirmed-surface: '#E9F5EE'
typography:
  h1-desktop:
    fontFamily: Noto Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  h1-mobile:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1.3'
  h3:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.35'
  emergency-phone:
    fontFamily: Noto Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: '1.1'
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.55'
  body-sm:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  hindi-body-lg:
    fontFamily: Noto Sans Devanagari
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.7'
  hindi-body-sm:
    fontFamily: Noto Sans Devanagari
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.65'
  evidence-mono:
    fontFamily: Noto Sans Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  spine-rail: 4px
  gutter-mobile: 20px
  container-max: 600px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is a "civic instrument"—a utilitarian, reliable, and high-legibility interface designed for emergency wayfinding and crisis management. It draws inspiration from Swiss transit signage, hospital wayfinding, and the functional clarity of GOV.UK. The aesthetic is strictly flat, rejecting gradients, shadows, and decorative flourishes to ensure the UI feels like a physical public service.

**Core Principles:**
- **Signage-Grade Legibility:** Information is presented with the authority of official signage to reduce cognitive load during high-stress scenarios.
- **Directional Clarity:** Every screen uses a rigid vertical anchor (the "Spine") to orient the user within a workflow.
- **Functional Flatness:** No color-only meaning; no skeuomorphism. Depth is conveyed through structural hairlines and surface shifts.
- **Bilingual Equality:** Latin and Devanagari scripts are balanced to ensure equal visual weight and accessibility for all citizens.

**Banned Elements:** Hero images, stock photos, dark mode, gradients, carousels, popups, and decorative government emblems.

## Colors

The palette is strictly semantic and functional. Color must never be used as the sole indicator of meaning; it must always be accompanied by text or structural cues.

- **Primary:** Reserved for critical actions and active navigation states.
- **Ink & Ink Muted:** Used for high-contrast typography and secondary instructional text.
- **Signal:** Used for warnings requiring immediate attention.
- **Danger:** Restricted to critical errors or high-risk data.
- **Confirmed:** Used for successful completion and verified steps.
- **Hairline:** Used for 1px structural dividers.

Dark mode is explicitly unsupported to maintain the "official paper" aesthetic and ensure maximum contrast for wayfinding.

## Typography

Typography is the most critical asset for authority. **Noto Sans** is used for its neutrality and international support. 

- **Alignment:** Strictly left-aligned. Never justified.
- **Hindi Content:** Because Devanagari is visually denser, Hindi text must always be rendered 1px larger with a +0.15 relative increase in line-height compared to English counterparts.
- **Monospace:** **Noto Sans Mono** is reserved for transaction codes, evidence quotes, and raw data to distinguish user-provided content from system guidance.
- **Emergency Numbers:** Displayed at a massive scale (34px) for immediate recognition.

## Layout & Spacing

The layout uses a single-column focused flow to guide users through a linear process without distraction.

- **The Spine:** A 4px vertical rail is pinned to the far-left edge of the content area. This acts as a visual anchor and progress indicator.
- **Desktop Grid:** Content is capped at a 600px max-width to ensure optimal line lengths for the 18px body type.
- **Mobile Grid:** Fluid width with a fixed 20px gutter on the left and right edges.
- **Vertical Rhythm:** Use 24px (stack-md) for standard spacing between elements and 48px (stack-lg) to separate major logical sections.

## Elevation & Depth

This design system is flat. It rejects shadows and gradients in favor of structural tiers and high-contrast lines.

- **Tonal Layers:** Use `#F4F6F7` (Surface) for containers, cards, and input backgrounds to distinguish them from the `#FFFFFF` (Page) background.
- **Hairlines:** 1px solid lines in `#D6DBDF` are used to define boundaries and separate list items.
- **The Spine:** The vertical rail uses Primary, Signal, or Danger colors to denote the status of the current section.
- **Borders:** Interactive elements use 1px or 2px solid borders. No soft-glow or neomorphic effects.

## Shapes

The shape language is disciplined and geometric.

- **Interactive Elements:** Buttons and input fields use a 4px radius (Soft). This provides a minor visual hint of "interactability" without compromising the formal signage aesthetic.
- **Structural Elements:** The Vertical Rail, horizontal dividers, and risk bands must have **0px radius** (Sharp) to emphasize the rigid, institutional grid.

## Components

### Buttons
- **Primary:** 48px minimum height. Solid `#004B8D` fill with white text. Full-width on mobile.
- **Secondary:** 48px height. 2px Primary border with transparent fill.
- **Quick Exit:** A high-visibility button, usually positioned at the top right, for users needing to hide the page immediately.

### Callouts & Risk Bands
- **Risk Band Header:** A 0px radius, full-width colored bar (`Danger`, `Signal`, or `Muted`) at the top of sections with bold Mono labels.
- **Alert Callouts:** Surface-colored boxes (`Danger-Surface`, etc.) with a 4px solid left border of the matching semantic color.

### Forms
- **Text Inputs:** 1px `Border Strong` (#8E969C) with 4px radius. Labels must be positioned above the input, never as placeholder text.
- **Checkboxes/Radios:** Large 24x24px hit areas for accessibility under stress.

### Content Specialized
- **Evidence Quote:** Uses `Noto Sans Mono`, `#F4F6F7` background, and a 4px `Ink Muted` left border.
- **Numbered Step Rows:** Numerals are 26px Noto Sans Bold in Primary color, separated by 1px Hairlines.
- **Language Toggle:** Simple text links separated by a 1px vertical hairline for immediate switching between English and Hindi.
- **Text Size Control:** A standard utility to increase/decrease baseline font size.