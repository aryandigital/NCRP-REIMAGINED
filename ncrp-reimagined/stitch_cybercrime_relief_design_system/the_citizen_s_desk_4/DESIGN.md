---
name: The Citizen’s Desk
colors:
  surface: '#F7F9FC'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e5e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#3f4948'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#6f7979'
  outline-variant: '#bec9c8'
  surface-tint: '#0d6969'
  primary: '#005050'
  on-primary: '#ffffff'
  primary-container: '#0f6a6a'
  on-primary-container: '#9be7e6'
  inverse-primary: '#87d3d3'
  secondary: '#4a5f7f'
  on-secondary: '#ffffff'
  secondary-container: '#c2d8fe'
  on-secondary-container: '#495e7e'
  tertiary: '#6f381c'
  on-tertiary: '#ffffff'
  tertiary-container: '#8c4f31'
  on-tertiary-container: '#ffcfbb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f0ef'
  primary-fixed-dim: '#87d3d3'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f50'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#b2c8ed'
  on-secondary-fixed: '#021c39'
  on-secondary-fixed-variant: '#324866'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb694'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#6f381c'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
  paper-bg: '#EEF2F6'
  ink-text: '#0F2744'
  ink-secondary: '#3D5166'
  rule-border: '#C5D0DC'
  trust-teal: '#0F6A6A'
  postal-vermilion: '#C2410C'
  clock-amber: '#B45309'
typography:
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  label-mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  button:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1120px
---

## Brand & Style
The design system is built on the narrative of a **"Well-Lit Government Desk."** It aims to transform the high-stress experience of reporting cyber-crimes into a process that feels calm, competent, and structurally sound. The aesthetic is "Paper-and-Ink," moving away from digital abstractions toward the tactile reliability of official physical documentation.

The style is a refined **Minimalism** with **High-Contrast** functional elements. It avoids the "tech-startup" look in favor of an institutional authority that is accessible but serious. There are no blurs, shadows, or rounded "pill" shapes; instead, the system uses sharp 1px rules and subtle tonal shifts to organize information.

**Key Principles:**
- **Clarity over Cleverness:** Information is presented with zero ambiguity.
- **Paper-First:** Use the off-white paper background to reduce eye strain and provide a "physical" canvas.
- **The Ink Metaphor:** Text and borders are treated as ink applications—precise, permanent, and legible.

## Colors
The palette is strictly functional, inspired by official correspondence and public service uniforms. 

- **Primary (Trust Teal):** Used for primary actions and affirmative states. It signals a safe harbor.
- **Ink (Text/Secondary):** Deep navy tones replace pure black to maintain a sophisticated, academic feel while ensuring high legibility.
- **Warning/Exit (Postal Vermilion):** Used for urgent alerts or the "Quick Exit" safety feature—a nod to the urgency of traditional post-haste communications.
- **Deadline (Clock Amber):** Specifically for time-sensitive status updates or filing windows.

The background uses **Paper (#EEF2F6)**, which provides a softer contrast than pure white, while **Surface (#F7F9FC)** is used for nested containers or form areas to create subtle visual grouping without relying on shadows.

## Typography
This design system utilizes a three-tier typographic scale to distinguish between legal authority, functional interface, and technical data.

- **Legal/Titles (Source Serif 4):** Reserved for page headers, legal sections, and official declarations. Its serif nature provides an authoritative, "printed" quality.
- **UI/Body (Lexend):** Used for all instructional text, inputs, and general reading. Set at a generous 18px base for high accessibility and clarity.
- **Identifiers/Technical (IBM Plex Mono):** Used for case numbers, timestamps, input masks, and metadata. The monospaced nature evokes ledger entries and bureaucratic precision.

All typography should be left-aligned to maintain a strong vertical "spine" for the document-style layout.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to mimic the proportions of a standard A4 or Legal paper document centered on a desk.

- **Grid:** A standard 12-column grid is used for desktop, but the primary content well is constrained to a readable width (max-width 1120px).
- **Rhythm:** All spacing is a multiple of 8px. 
- **Alignment:** Primary buttons and form labels are strictly left-aligned. This reinforces the "filing" mental model.
- **Mobile Adaptation:** On mobile, margins shrink to 16px. Grids collapse to a single column. Information density remains high but legible, avoiding unnecessary decorative padding.

## Elevation & Depth
In keeping with the "Paper-and-Ink" aesthetic, this design system **expressly forbids shadows**. 

Depth is achieved through:
- **Tonal Layering:** Using the `Surface` color against the `Paper` background to indicate nested sections.
- **Ink Rules:** 1px solid borders in `Rule/border` (#C5D0DC) define the perimeter of all interactive elements and sections.
- **Active States:** Subtle 1px or 2px "Ink" borders increase in weight or shift to `Trust Teal` when an element is focused or active, rather than lifting the element off the page.

## Shapes
The shape language is disciplined and professional. All containers, buttons, and input fields use a **4px corner radius**. 

This "Soft" approach is just enough to prevent the UI from feeling aggressive (Brutalist), while remaining firm enough to feel structured and "official." Large radius "pill" buttons or circular elements are prohibited as they lean too far into casual "app" aesthetics.

## Components
- **Buttons:** Rectangular with a 4px radius. Primary buttons use `Trust Teal` background with white text. Secondary buttons use a 1px `Rule` border with `Ink` text. All primary actions are left-aligned.
- **Input Fields:** 1px `Rule` border. Focused state uses a 2px `Trust Teal` border. Labels use `Lexend` (Semi-bold), and placeholder/input text uses `IBM Plex Mono` for a technical feel.
- **Chips/Status:** Small, rectangular badges with 4px radius. Use `Clock Amber` for "Pending" and `Trust Teal` for "Verified."
- **Cards:** No shadows. Defined by a 1px `Rule` border and a white or `Surface` background. 
- **Icons:** 1.5px stroke weight. Use only monochromatic line icons (Ink or Trust Teal). Avoid rounded or filled icon styles.
- **Lists:** Use horizontal 1px rules to separate items, reminiscent of a lined ledger.
- **Quick Exit:** A persistent, high-visibility button in `Postal Vermilion` at the top right for victims of cyber-harassment to quickly close the site.