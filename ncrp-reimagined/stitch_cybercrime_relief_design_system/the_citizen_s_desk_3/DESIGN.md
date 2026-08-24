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
  secondary: '#b02e10'
  on-secondary: '#ffffff'
  secondary-container: '#fd6442'
  on-secondary-container: '#5f0e00'
  tertiary: '#301900'
  on-tertiary: '#ffffff'
  tertiary-container: '#4e2c00'
  on-tertiary-container: '#da8b27'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beecdf'
  primary-fixed-dim: '#a3d0c3'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#234e44'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8b1900'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86b'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#f3fcf5'
  on-background: '#151d19'
  surface-variant: '#dce5de'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Fraunces
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
  serial-number:
    fontFamily: IBM Plex Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 16px
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
  sheet-padding: 32px
---

## Brand & Style
The design system is a high-fidelity digital translation of Indian civic bureaucracy, moving away from corporate abstraction toward the tactile, authoritative weight of physical stamp paper and official ledgers. It evokes the feeling of a permanent record: reliable, historical, and distinctly public.

The aesthetic follows a **Tactile / Minimalist** hybrid. It utilizes flat, layered surfaces that mimic stacked paper and folders. Visual interest is generated through "Govt-spec" details: perforation lines, rubber-stamp overlays, and red serial numbering. There are no gradients or soft shadows; depth is achieved through physical metaphors like paper edges and "wells" (cutouts) in the canvas.

## Colors
The palette is rooted in the "Standard Issue" materials of civic life.
- **Primary (Ink-Bottle Green):** Used for headers, primary actions, and authoritative elements. 
- **Secondary (Post Vermilion):** Reserved for urgent alerts, serial numbers, and "Speed Post" accents.
- **Tertiary (Marigold):** Used for status highlights, celebratory markers, or secondary notifications.
- **Ink (Text):** A near-black green-tinted neutral for all primary legibility.
- **Backgrounds:** The `canvas` (Stamp-paper cream) serves as the page backdrop, while `surface` is used for interactive "sheets" of paper. The `well` provides a recessed area for inputs or secondary groupings.

## Typography
The system employs **extreme typographic contrast** to differentiate between narrative, data, and metadata.

- **Fraunces:** Used for high-level headings and titles. It provides a literary, authoritative character. Use "Soft" or "Wonky" optical sizes where available to enhance the tactile feel.
- **Lexend:** The workhorse for UI and body copy. Chosen for its high legibility and "signage-grade" clarity.
- **IBM Plex Mono:** Strictly for numbers, codes, serial IDs, and data tables. It should always feel like it was produced by a typewriter or a dot-matrix printer.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop, mimicking a standard A4 or Legal paper width centered on the canvas. 

- **The Ledger System:** On desktop, content is constrained to a 1024px maximum width to maintain readability. 
- **Margins:** Generous "margin-padding" is used inside containers to mimic the white space of official forms.
- **Dividers:** Use 1px solid lines in `Ink` or `Well` color. For thematic breaks, use a **perforated line** (dashed border with 4px gaps).
- **Speed-Post Accents:** Use diagonal chevron stripes (Vermilion/Canvas) as a 4px tall border-top for high-priority containers or "Express" notifications.

## Elevation & Depth
This design system rejects digital shadows in favor of **Tonal Stacking**. 

- **Level 0 (Canvas):** The #F7F3EA base layer.
- **Level 1 (Surface):** Raised sheets of #FDFBF5. These have 1px solid borders in #1C2420 (Ink) at low opacity (15%) to define edges without "glow."
- **Level -1 (Well):** Recessed areas using #EFE8D8. These are used for input fields or grouping content within a sheet.
- **Hard Rules:** Instead of shadows, use a 2px offset "flat shadow" in the `Ink` color for primary buttons to give a stamped, physical look.

## Shapes
Shapes are primarily **Sharp** or slightly **Soft**. There are absolutely no "pill" shapes or high-radius circles. 

- **Standard Radius:** 4px (Soft) for cards and buttons to prevent an overly aggressive "brutalist" feel while remaining professional.
- **Inputs:** Square corners to mimic the boxes on physical forms.
- **Postmarks:** Circular elements are only permitted for decorative "Rubber Stamp" badges, which should be rotated at a slight angle (e.g., 5 degrees) to mimic manual application.

## Components
- **Buttons:** Rectangular with a 1px solid border. The primary button has a `Post Vermilion` fill with white `Lexend` text. The hover state adds a 2px flat-black offset shadow.
- **Inputs:** Rectangular boxes with the `Well` color as background. Labels must use `IBM Plex Mono` in all-caps above the field.
- **Serial Tags:** Small rectangular labels using `IBM Plex Mono` in `Post Vermilion` text, often prefixed with "NO." or "REF:".
- **Cards (Sheets):** Use the `Surface` color with a 1px border. The top-right corner can feature a "perforation" effect (a series of small circles cut out from the edge).
- **Checkboxes:** Sharp 0px radius squares. When checked, they should show a bold "X" rather than a tick mark, mimicking a hand-filled form.
- **Postmarks:** Use for status (e.g., "APPROVED", "PENDING"). These are outlined circles or rectangles with thick borders and 50% opacity, placed at an angle over content.