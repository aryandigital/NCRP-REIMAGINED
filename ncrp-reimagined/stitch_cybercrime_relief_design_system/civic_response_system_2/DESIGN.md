---
name: Civic Response System
colors:
  surface: '#f8f9fd'
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
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8a42'
  on-secondary-container: '#682c00'
  tertiary: '#003d21'
  on-tertiary: '#ffffff'
  tertiary-container: '#005731'
  on-tertiary-container: '#7acc97'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#a1f5bc'
  tertiary-fixed-dim: '#85d8a2'
  on-tertiary-fixed: '#00210f'
  on-tertiary-fixed-variant: '#00522e'
  background: '#f8f9fd'
  on-background: '#191c1f'
  surface-variant: '#e1e2e6'
typography:
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.3'
  emergency-call:
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
  mono-data:
    fontFamily: Noto Sans Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  hindi-body:
    fontFamily: Noto Sans Devanagari
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.7'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  spine-width: 4px
  gutter: 20px
  container-max: 600px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is engineered for high-stress wayfinding in the context of cybercrime reporting and recovery. The personality is that of a "civic instrument"—utilitarian, reliable, and invisible until needed. It draws heavily from Swiss transit signage and established government accessibility standards (like GOV.UK) to provide an interface that feels like a physical public service.

The visual style is strictly flat and functional. It prioritizes information hierarchy over aesthetic flourishes. By using 1px hairlines and a rigid grid, the system minimizes cognitive load for users who may be in a state of panic or financial distress. 

**Core Principles:**
- **Wayfinding:** The UI acts as a series of clear signposts.
- **Directional Clarity:** Every screen must answer "Where am I?" and "What do I do next?"
- **Stress Reduction:** Generous whitespace and large touch targets prevent accidental errors.
- **Bilingual Equality:** English and Hindi are treated with equal visual weight to ensure inclusivity across the Indian demographic.

## Colors

The palette is functional and semantic. Color is never used for decoration; it is used exclusively to signal status, urgency, or action. 

- **Primary:** Reserved for the main call-to-action and the current path in the workflow.
- **Signal:** Used for warnings and urgency that require immediate attention but are not yet terminal errors.
- **Confirmed:** Used only for successful completion of steps or verified information.
- **Danger:** Restricted to critical system errors or high-risk data validation.
- **Focus State:** To ensure high accessibility, focus states utilize a high-visibility 3px yellow ring with a 2px dark inner edge.

**Note:** This design system does not support a dark mode to maintain the "official paper/signage" aesthetic and ensure maximum legibility under various lighting conditions.

## Typography

Typography is the primary tool for authority. The system uses **Noto Sans** for its neutral, highly legible character across both Latin and Devanagari scripts.

**Rules for Implementation:**
- **Alignment:** Strictly left-aligned. Never justified, as justification creates "rivers" that impede readability for stressed users.
- **Hindi Adjustments:** Because Devanagari script is visually denser, all Hindi text must be rendered 1px larger with a +0.15 increase in line-height relative to the English equivalent.
- **Monospace Usage:** **Noto Sans Mono** is used for transaction IDs, phone numbers, and quoted scammer messages to differentiate user data from system guidance.
- **Styling Restrictions:** No italics. No all-caps for strings longer than 4 characters. Avoid bolding within body paragraphs; use hierarchy levels instead.

## Layout & Spacing

The layout is a single-column, centered flow designed to minimize eye travel and focus the user on one task at a time.

- **The Spine:** A 4px vertical rail on the left margin acts as a visual anchor. It color-codes the user's progress: Primary for the active section, Muted (30% opacity) for future steps, and Confirmed (Green) for completed steps.
- **Desktop:** Content is capped at 600px to maintain optimal line lengths for the 18px body type.
- **Mobile:** Full-width with a consistent 20px outer margin (gutter).
- **Rhythm:** Use a vertical stack of 24px (md) between sections and 48px (lg) between major logical blocks.

## Elevation & Depth

This design system is flat. It rejects the use of shadows, gradients, and blurs to maintain a "printed" feel that communicates honesty and directness.

- **Surface Tiers:** Depth is communicated through background color changes (White to Surface Grey) rather than shadows.
- **Hairlines:** 1px `hairline` (#D6DBDF) rules are used to separate list items and section headers.
- **Modals Exception:** Only in the case of critical system interruptions (modals) can a soft, neutral shadow be used to separate the dialogue from the background "spine" and content.
- **Borders:** Interactive elements use 1px or 2px borders. No soft-glow or neomorphic effects are permitted.

## Shapes

The shape language is disciplined and professional. 

- **Interactive Elements:** Buttons, input fields, and callout boxes use a 4px radius. This provides a slight "softness" that makes the UI approachable without losing its institutional authority.
- **Structural Elements:** Horizontal rules, the vertical "spine," and status bands must have a 0px radius (sharp corners) to maintain a rigid, structural grid.

## Components

### Buttons
- **Primary:** 48px height, Primary fill (#004B8D), white text. On mobile, these are always full-width. 
- **Secondary:** 48px height, 2px Primary border, transparent fill.
- **Hover States:** Use `Primary Hover` (#003569) with no motion other than a 150ms color transition.

### Callouts & Risk Bands
- **Risk Bands:** Full-width headers at the top of sections. Variants: "HIGH RISK" (Danger fill), "MEDIUM RISK" (Signal fill), "UNCLEAR" (Muted fill). Use bold, 16px Mono font for the label.
- **Alert Callouts:** Surface fill (Signal, Danger, or Confirmed) with a 4px solid left border of the corresponding semantic color. Must include a functional icon and text label.

### Form Elements
- **Input Fields:** 1px `Border Strong` outline, 4px radius. 
- **Checkboxes/Radios:** Large 24x24px hit areas to assist users with reduced motor control due to stress.
- **Language Toggle:** Simple text buttons ("English" / "हिन्दी") separated by a 1px vertical hairline.

### Content Blocks
- **Summary Box:** Used for reviewing information. Light grey `Surface` fill with a `Hairline` border.
- **Evidence Quote:** Used for displaying scammer messages or logs. Uses `Noto Sans Mono`, grey `Surface` fill, and a 4px `Ink Muted` left border.
- **Numbered Steps:** The numeral is 26px `Mono` in `Primary` color, positioned to the left of the text, with a horizontal `Hairline` rule above the row to define the step.

### Icons
- Icons must be filled, high-contrast, and strictly paired with a text label. 
- **Prohibited:** No "hacker" imagery, no padlocks (unless specifically referring to browser security), and no decorative emojis.