---
name: The Citizen's Desk
colors:
  surface: '#f3fcf5'
  surface-dim: '#d3dcd6'
  surface-bright: '#f3fcf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf6ef'
  surface-container: '#e7f0e9'
  surface-container-high: '#e2eae4'
  surface-container-highest: '#dce5de'
  on-surface: '#151d19'
  on-surface-variant: '#404846'
  inverse-surface: '#2a322e'
  inverse-on-surface: '#eaf3ec'
  outline: '#717976'
  outline-variant: '#c0c8c4'
  surface-tint: '#3c665c'
  primary: '#00241d'
  on-primary: '#ffffff'
  primary-container: '#0d3b32'
  on-primary-container: '#7aa599'
  inverse-primary: '#a3d0c3'
  secondary: '#4b57aa'
  on-secondary: '#ffffff'
  secondary-container: '#99a5fe'
  on-secondary-container: '#2b3789'
  tertiary: '#440700'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a1100'
  on-tertiary-container: '#ff7151'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beecdf'
  primary-fixed-dim: '#a3d0c3'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#234e44'
  secondary-fixed: '#dfe0ff'
  secondary-fixed-dim: '#bcc3ff'
  on-secondary-fixed: '#000d60'
  on-secondary-fixed-variant: '#333f91'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a3'
  on-tertiary-fixed: '#3d0600'
  on-tertiary-fixed-variant: '#8b1900'
  background: '#f3fcf5'
  on-background: '#151d19'
  surface-variant: '#dce5de'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-sm:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '500'
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
  serial-number:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
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
  margin-desktop: 64px
  ledger-line: 32px
---

## Brand & Style
The design system adopts "The Citizen's Desk" aesthetic—a reimagining of Indian civic infrastructure through the lens of tactile, disciplined, and authoritative paper-based systems. It moves away from the sterile "SaaS" or "Government Template" look, instead drawing inspiration from the material qualities of speed-post envelopes, railway ledgers, and stamp paper.

The personality is **editorial, quiet, and disciplined**. It evokes the feeling of a well-organized physical desk where every document has its place. The user experience should feel like filling out a high-quality physical form: deliberate, secure, and officially recognized. The visual language utilizes heavy whitespace (canvas), sharp hairline rules, and signature civic markers like serial numbers and rubber stamps to provide a sense of authenticity and urgency without inducing panic.

## Colors
The palette is rooted in the "Canvas" (#F7F3EA), a warm stamp-paper cream that reduces eye strain and provides a historic, tactile foundation.

- **Primary (Ink-Bottle Green):** Used for high-priority actions and structural bands. It represents the weight of official ink.
- **Post Vermilion:** Reserved for serial numbers, "Quick Exit" functions, and urgent rules. It mimics the ink of a registrar’s pen.
- **Carbon Indigo:** Used for secondary interactive elements and verification states, inspired by carbon-copy sheets.
- **Marigold:** Dedicated strictly to deadlines and warnings, paired with a darker tint for legibility.
- **Hairline:** A subtle structural color used for ledger rules and table borders, ensuring the layout remains disciplined without becoming heavy.

## Typography
The typographic system creates a hierarchy of "The Document."

- **Fraunces** is the editorial voice. Use it for page titles and section headers. Soft italics are encouraged for sub-captions or emphasis to mimic handwritten marginalia.
- **Lexend** provides modern, hyper-readable clarity for all body copy and user inputs, ensuring accessibility for all citizens.
- **IBM Plex Mono** is the "data" voice. Use it for serial numbers, IDs, timestamps, and labels. This font should be used whenever tabular data or official filing codes are displayed to reinforce the ledger aesthetic.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, centered on the screen like a folder placed on a desk.

- **The Ledger System:** Vertical spacing should follow a rhythmic 32px baseline (or multiples thereof) to simulate the ruled lines of a ledger book.
- **Margins:** Generous outer margins (64px on desktop) focus the eye on the central "form."
- **Rules:** Use double-hairline rules (#E2DAC6) to separate major sections, mimicking the top of a formal register.
- **Mobile Adaptivity:** On mobile, the margins compress to 16px, but the "paper" background should always be visible as a slight border to maintain the object-like feel of the UI.

## Elevation & Depth
This design system avoids modern shadows in favor of **Tonal Layering and Physicality**.

- **Surface Tiers:** The `background_canvas` is the desk. The `surface_raised` is the sheet of paper currently being interacted with.
- **The "Stacked Paper" Effect:** Instead of shadows, use subtle 1px borders in `hairline_border` to define edges. To show depth, stack elements with a slight 2px offset to reveal the "sheet" underneath.
- **In-set Wells:** For input fields and data blocks, use the `well_sand` color to create a "pressed" effect into the paper, rather than an inner shadow.
- **Rubber Stamps:** These are the only elements that "float" or overlap, often rotated by 2-5 degrees to break the grid and signify a manual, human verification step.

## Shapes
Shapes are primarily **sharp or slightly softened**, mimicking cut paper rather than molded plastic.

- **Containers:** Standard corners use a 4px (Soft) radius to prevent a harsh digital feel while maintaining a disciplined architectural look.
- **Perforations:** Used as dividers. A dashed line (#E2DAC6) terminated by small circular "punches" on either end to simulate a tear-off slip.
- **Speed-post Edges:** Decorative containers (like the header or footer) can utilize a diagonal chevron pattern in Vermilion/Indigo to signify transit and priority.

## Components

- **Primary Buttons:** High-contrast `Brand Dark` rectangles. Sharp corners. Label in white Lexend. No gradients; pure ink.
- **Input Fields:** Styled as "Lines on a Page." A bottom border only (`hairline_border`), with a `well_sand` background that appears on focus. Labels sit above in `label-mono`.
- **Serial Numbers:** Every report or section must have a unique ID in `IBM Plex Mono` rendered in `Post Vermilion`.
- **Status Chips:** Styled as "Stamps." A border-box with a slight tilt (3 degrees). Success is `Sage Tint`, Urgent is `Marigold`, and Processed is `Carbon Indigo`. Text is always monospaced.
- **Cards:** Use `surface_raised` with a single hairline border. No shadow. If the card represents a "filed" document, include a perforation line at the bottom.
- **Station Clock:** For deadlines or time-remaining, use a simplified analog clock face (circle with two needles) rather than a digital countdown, emphasizing the "Civic Handbook" tone.
- **Lists:** Bullet points are replaced by small horizontal ink-dashes.