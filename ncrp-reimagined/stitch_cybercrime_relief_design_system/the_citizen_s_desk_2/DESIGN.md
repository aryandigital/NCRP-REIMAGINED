---
name: The Citizen’s Desk
colors:
  surface: '#f7faf9'
  surface-dim: '#d8dbda'
  surface-bright: '#f7faf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f3'
  surface-container: '#eceeee'
  surface-container-high: '#e6e9e8'
  surface-container-highest: '#e0e3e2'
  on-surface: '#181c1c'
  on-surface-variant: '#3f4948'
  inverse-surface: '#2d3131'
  inverse-on-surface: '#eef1f0'
  outline: '#6f7979'
  outline-variant: '#bec9c8'
  surface-tint: '#0d6969'
  primary: '#005050'
  on-primary: '#ffffff'
  primary-container: '#0f6a6a'
  on-primary-container: '#9be7e6'
  inverse-primary: '#87d3d3'
  secondary: '#5d5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e5'
  on-secondary-container: '#636467'
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
  secondary-fixed: '#e2e2e5'
  secondary-fixed-dim: '#c6c6c9'
  on-secondary-fixed: '#1a1c1e'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb694'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#6f381c'
  background: '#f7faf9'
  on-background: '#181c1c'
  surface-variant: '#e0e3e2'
  canvas-surface: '#F7F9FC'
  signal-vermilion: '#C2410C'
  ink-muted: rgba(93, 94, 97, 0.4)
  paper-white: '#FFFFFF'
typography:
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
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
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-technical:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  mono-data:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  content-max-width: 1120px
---

## Brand & Style
The design system is centered on the narrative of a **"Well-Lit Government Desk."** It transforms the high-stress experience of bureaucratic or sensitive reporting into a process that feels calm, competent, and structurally sound. The aesthetic is a sophisticated blend of **Institutional Minimalism** and **Tactile Paper-and-Ink**, moving away from digital abstractions toward the reliability of physical documentation.

"Air is the point"—the system utilizes generous whitespace to reduce cognitive load, ensuring a clear hierarchy that guides the user through complex workflows without friction. It avoids "tech-startup" tropes in favor of an authority that is accessible, serious, and deeply trustworthy.

**Key Principles:**
- **Clarity over Cleverness:** Information is presented with zero ambiguity and zero decorative fluff.
- **The Ink Metaphor:** Text and borders are treated as ink applications—precise, permanent, and legible.
- **Structural Integrity:** Heavy reliance on 1px rules and monochromatic grids to organize information.

## Colors
The palette is strictly functional, inspired by official correspondence and public service uniforms. 

- **Primary (Trust Teal):** Used for primary actions, affirmative states, and active focus. It signals a safe, professional harbor.
- **Ink (Neutral/Secondary):** A deep, near-black used for primary text to maintain high legibility and a sophisticated, "printed" quality.
- **Signal (Postal Vermilion):** Reserved for urgent alerts, critical deadlines, or safety features. It provides a sharp, high-contrast warning that demands immediate attention.
- **Ink Muted:** Used for disabled states, secondary labels, or future-dated information.

The background uses **Canvas/Surface (#F7F9FC)** to provide a paper-like softness, while **Paper (#FFFFFF)** is used for interactive components like cards and inputs to create a "layered document" effect without using shadows.

## Typography
This design system utilizes a three-tier typographic scale to distinguish between authority, instruction, and data.

- **Authority (Source Serif 4):** Used for headlines and body copy. Its serif nature provides a "printed" quality that feels official and permanent.
- **Technical/Label (Lexend):** Set at weight 600 for labels, chips, and navigational elements. It provides a clean, modern counterpoint to the serif body text.
- **Metadata (IBM Plex Mono):** Used for case numbers, timestamps, and technical inputs. This monospaced font evokes ledger entries and bureaucratic precision.

All typography should be left-aligned to maintain a strong vertical "spine" mimicking a physical form.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to mimic the proportions of a standard A4 paper document centered on a desk.

- **The Document Well:** Content is centered in a primary well with a max-width of 1120px. 
- **Rhythm:** All spacing is a multiple of the 8px unit. Consistent padding within cards and sections (24px or 32px) is essential to maintain the "Air" principle.
- **Alignment:** Strictly left-aligned form fields and buttons reinforce the "filing" mental model.
- **Mobile Adaptation:** On mobile, margins shrink to 16px and the layout collapses to a single column. Information density remains high, but spacing between distinct sections is increased to ensure clarity on smaller screens.

## Elevation & Depth
This design system **expressly avoids traditional shadows**. Depth is communicated through structural rules and tonal stacking to maintain the "flat paper" metaphor.

- **Tonal Layers:** High-contrast backgrounds (Canvas vs. Paper) indicate different functional areas.
- **Hairline Separation:** 1px rules in `ink-muted` are used to divide rows and list items, reminiscent of a ledger.
- **Active Focus:** Focus states are indicated by a 2px weight increase of the border in `Trust Teal` or a left-side accent rule, rather than an element "lifting" off the surface.
- **Sunken Effects:** Elements like the Redaction Chip use a slightly darker fill to appear "stamped" or "recessed" into the paper surface.

## Shapes
The shape language is disciplined and professional. While a **roundedness of 2 (0.5rem / 8px-10px)** is the standard for primary components to ensure they feel approachable, specific elements use geometry to signal their nature:

- **Primary Components:** 10px radius for buttons and input fields.
- **Structural Items:** 0px (sharp) corners for notes or status rules that sit flush against the grid.
- **The Fingerprint:** A 5x5 grid of 6px squares serves as a recurring motif for identity and security sections, emphasizing the digital/technical intersection.

## Components
- **Primary Button:** 52px tall, filled with `Trust Teal`, using `Paper-White` text. 10px corner radius. Text is centered and set in `Lexend` 600.
- **Choice Row:** 64px tall items with a 1px `ink-muted` hairline separator. When selected, a 4px `Trust Teal` rule appears on the far left edge of the row.
- **Note/Callout:** A container with a 2px left-side rule. The rule color changes based on context: `Trust Teal` (Info), `Signal Vermilion` (Alert), or `Ink` (Standard).
- **Clock:** A specialized status component featuring a 72px ring arc with a hairline hand; the time is displayed inside using `IBM Plex Mono`.
- **Redaction Chip:** A "sunken" appearance with a darker grey fill and a 1px horizontal strike line through the monospaced text.
- **Input Fields:** 1px `ink-muted` border, 10px radius. On focus, the border becomes 2px `Trust Teal`. Labels are always placed above the field in `Lexend` 600.
- **Cards:** No shadows. Defined by a 1px `ink-muted` border or a simple shift to the `Paper-White` background against the `Canvas` surface.