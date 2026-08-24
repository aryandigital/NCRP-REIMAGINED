---
name: Civic Instrument
colors:
  surface: '#f8fafb'
  surface-dim: '#d8dadb'
  surface-bright: '#f8fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f5'
  surface-container: '#eceeef'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#424750'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#eff1f2'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#265fa2'
  primary: '#003465'
  on-primary: '#ffffff'
  primary-container: '#004b8d'
  on-primary-container: '#91bdff'
  inverse-primary: '#a6c8ff'
  secondary: '#5c5f62'
  on-secondary: '#ffffff'
  secondary-container: '#dee0e4'
  on-secondary-container: '#606366'
  tertiary: '#582500'
  on-tertiary: '#ffffff'
  tertiary-container: '#7b3700'
  on-tertiary-container: '#ffa56f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#e1e2e6'
  secondary-fixed-dim: '#c5c6ca'
  on-secondary-fixed: '#191c1f'
  on-secondary-fixed-variant: '#44474a'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#753400'
  background: '#f8fafb'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  ink-muted: '#4C5257'
  hairline: '#D6DBDF'
  border-strong: '#8E969C'
  signal-surface: '#FFF7E6'
  signal-text: '#B45309'
  danger-surface: '#FDECEA'
  danger-text: '#B3261E'
  confirmed-surface: '#E9F5EE'
  confirmed-text: '#0F6B3F'
  focus-outer: '#FFCC00'
typography:
  headline-xl:
    fontFamily: Noto Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  spine-width: 4px
---

## Brand & Style
The design system is engineered as a high-utility civic instrument for victims of cybercrime. It moves away from the "hacker" aesthetic often associated with cybersecurity, instead adopting a philosophy of **emergency wayfinding and signage-grade clarity**. 

The brand personality is authoritative yet calm, prioritizing functional trust over decorative appeal. It follows a **Modern Minimalism** style with heavy structural influences from public sector design systems. The primary goal is to lower the cognitive load of a user in a state of high stress. 

**Core Principles:**
- **Clarity over Cleverness:** Information is structured for rapid scanning and immediate action.
- **Structural Integrity:** Elements are aligned to a strict grid, using "The Spine" (a vertical rail) to anchor content.
- **Instrumental Aesthetics:** Every visual element serves a communicative purpose; if it doesn't aid understanding, it is removed.
- **Anti-Cliché:** Explicitly bans dark mode, neon accents, matrix-style data streams, and stock photography.

## Colors
The palette is rooted in high-contrast legibility. It uses a "Traffic Light" functional logic for semantic feedback, paired with a deep navy primary for institutional authority.

- **Primary & Ink:** Used for core branding and high-importance text. 
- **Functional Surfaces:** Warning, Danger, and Success states use muted background tints with saturated text/icon colors to ensure accessibility without overwhelming the user.
- **Focus State:** Employs a high-visibility yellow (#FFCC00) 3px ring with a 2px inner "Ink" edge to ensure the focus indicator is visible against any background, meeting rigorous accessibility standards.
- **Negative Space:** Pure white (#FFFFFF) is used for the page background to maximize contrast, while #F4F6F7 defines interactive surfaces like input fields or card containers.

## Typography
The typography system uses **Noto Sans** to ensure perfect rendering across Latin and Devanagari scripts, maintaining a consistent visual weight for a diverse Indian user base.

- **Scale:** Headlines are bold and distinctive. Desktop screens utilize `headline-xl` (40px) for primary landing states, while mobile devices default to `headline-lg` (32px).
- **The Body:** Set at a generous 18px to ensure readability for users who may be viewing the site under duress or on low-quality screens.
- **Technical Mono:** **JetBrains Mono** (representing Noto Sans Mono) is reserved for displaying "Scammer Text" (suspicious links, phone numbers, or code snippets), visually cordoning off untrusted data from the system's authoritative guidance.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is centered on desktop with a maximum readable width (approx. 1024px), but the internal structure is strictly governed by a 4px baseline grid.

- **The Spine:** A signature 4px vertical rail (Primary #004B8D) sits at the left edge of the main content column. This acts as a visual anchor for the user's eye as they scan down the page.
- **Grid:** A 12-column grid is used for desktop, collapsing to a single column on mobile. 
- **Visual Hierarchy:** Use generous vertical spacing between sections (48px+) to prevent the interface from feeling crowded. Action groups (buttons) should be separated from text by 32px.

## Elevation & Depth
This design system is strictly **Flat**. It rejects the use of drop shadows, gradients, and inner glows to maintain its identity as a functional tool rather than a consumer app.

- **Z-Axis Hierarchy:** Depth is communicated through color blocks and outlines. A "Surface" (#F4F6F7) sits on the "Page" (#FFFFFF).
- **Modals:** The only exception to the "no shadow" rule is modal overlays. Modals use a heavy 40% opacity black backdrop and a subtle, high-diffusion shadow to ensure they are perceived as being on a separate layer for immediate focus.
- **Dividers:** Horizontal rules are 1px and use "Hairline" (#D6DBDF). They must have 0px corner radius and span the full width of their container.

## Shapes
The shape language is "Soft-Square." It avoids the playfulness of pill-shaped buttons in favor of a more serious, structured appearance.

- **Interactive Elements:** Buttons and Input fields use a 4px radius.
- **Structural Elements:** Dividers, the "Spine" rail, and structural containers for large color blocks use a 0px radius (sharp corners) to maintain a sense of architectural stability.

## Components
Consistent component behavior ensures the user never has to "learn" how to use the service.

- **Buttons:**
    - **Primary:** Solid Primary (#004B8D) with White text. 4px radius. No gradient.
    - **Secondary:** White background with 2px "Border Strong" (#8E969C) outline.
- **Inputs:** 2px solid border (#8E969C) with a 4px radius. On focus, use the "Focus State" token (Yellow/Ink double-ring). Labels must always be visible above the input, never as placeholder text.
- **Action Cards:** Use a light "Surface" background (#F4F6F7) with a left-border defined by "The Spine."
- **Alerts/Banners:** Full-width containers using semantic surface colors (Signal, Danger, Confirmed). Include a bold icon and a clear headline.
- **Motion:** Transitions for hover states or layout shifts must be between 150ms and 250ms using a standard ease-in-out curve. Never use looping animations or high-stress elements like countdown timers.