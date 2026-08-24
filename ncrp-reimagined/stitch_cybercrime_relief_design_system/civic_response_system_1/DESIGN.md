---
name: Civic Response System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d9dae0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f9'
  surface-container: '#ededf4'
  surface-container-high: '#e7e8ee'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#424750'
  inverse-surface: '#2e3035'
  inverse-on-surface: '#f0f0f7'
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
  background: '#f9f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
typography:
  emergency-phone:
    fontFamily: Noto Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  mono-numeral:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 24px
  mono-quote:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  spine-width: 4px
  mobile-margin: 16px
  desktop-max-width: 600px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is a civic instrument designed for high-stress emergency wayfinding in the context of cybercrime reporting and assistance. The aesthetic is strictly utilitarian, drawing from hospital emergency department signage and Swiss transit systems. It prioritizes clarity, speed of comprehension, and authority without being intimidating.

The style is **Institutional Minimalism**. It rejects all decorative trends—no gradients, no glassmorphism, and no shadows. It utilizes a "spine" architecture: a 4px vertical rail that grounds the content and indicates progress. The visual language conveys that this is a reliable, public-interest utility, not a commercial product or a generic "hacker-themed" security app.

## Colors
The palette is functional and signal-based. 
- **Primary (#004B8D)** is reserved for actionable elements like buttons and active navigation states. 
- **Signal (#B45309)** denotes caution or high-priority instructions. 
- **Danger (#B3261E)** is strictly for errors, stop actions, or immediate threats. 
- **Confirmed (#0F6B3F)** validates successful completion or safe states.
- **Focus State:** Interactive elements must use a 3px #FFCC00 outer ring with a 2px #16191C inner edge for high-visibility accessibility.

## Typography
Typography follows a strict hierarchical scale optimized for readability under stress.
- **Alignment:** All text must be left-aligned. Never center or justify.
- **Multilingual:** Use Noto Sans for Latin and Noto Sans Devanagari for Hindi. For Hindi text, increase the font size by 1px relative to the Latin token to maintain optical balance.
- **Numerals:** Use JetBrains Mono for evidence, reference numbers, and step indicators to ensure character distinctness (e.g., distinguishing 0 from O).
- **Emergency Phone:** Reserved exclusively for immediate helpline numbers at the top or bottom of the viewport.

## Layout & Spacing
The layout uses a **Spine Rail** system. A 4px vertical rail sits at the left edge of the content, acting as a visual anchor.
- **Mobile First:** The design is optimized for a 360px width.
- **Desktop:** On larger screens, the content is capped at a 600px max-width to maintain short line lengths and focus.
- **The Spine:** The spine changes color based on the current section's state (Active: Primary, Future: 30% Ink Muted, Completed: Confirmed).
- **Rhythm:** Vertical spacing should follow a strict 8px grid. Use `stack-lg` (32px) to separate major sections.

## Elevation & Depth
This system uses a **Flat Layering** approach. Hierarchy is established through color blocks and borders rather than depth effects.
- **Flat Surfaces:** Use `Surface Muted` (#F4F6F7) to group related information within a white page.
- **Borders:** Use `Hairline` (#D6DBDF) for structural separation and `Border Strong` (#8E969C) for interactive inputs.
- **Modals:** Only in the case of critical modal interruptions may a 40% Ink overlay be used to dim the background. No drop shadows are allowed on the modal itself; use a 2px `Ink` border instead.

## Shapes
The shape language is rigid and architectural.
- **Interactive Elements:** Buttons, input fields, and tags use a 4px radius (`Soft`) to indicate "touchability."
- **Structural Elements:** Dividers, the spine rail, and color blocks must have 0px radius (Sharp) to maintain the "civic instrument" feel.

## Components
### Buttons & Links
- **Primary Button:** Solid #004B8D fill, white label, 48px minimum height. Square corners on the left if it meets the spine, otherwise 4px radius.
- **Secondary Button:** 2px Primary border, #004B8D label, no background fill.
- **Emergency Button:** Solid #B3261E fill, white label, bold weight.
- **Links:** #004B8D, always underlined with a 2px offset.

### Callouts & Risk Bands
- **Callouts:** Use a background fill (Signal Surface or Danger Surface) with a 4px solid left border in the corresponding signal color.
- **Risk Band Header:** A full-width bar for HIGH, MEDIUM, or UNCLEAR risk levels. Use all-caps label-caps typography.

### Input Fields
- **Text Input:** 2px `Border Strong` container. Label is placed above the field in bold; hint text is placed below the label but above the field in `Ink Muted`.
- **Focus State:** 3px #FFCC00 ring on focus.

### Content Blocks
- **Evidence Quote:** Used for copying digital evidence. JetBrains Mono font, `Surface Muted` background, 4px `Border Strong` left border.
- **Numbered Step Row:** A JetBrains Mono numeral on the left, a hairline divider above the row, and the body text to the right.
- **Summary Box:** `Surface Muted` fill with a 1px `Hairline` border. Used for reviewing data before submission.