---
name: The Citizen's Desk
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
  tertiary: '#842600'
  on-tertiary: '#ffffff'
  tertiary-container: '#ad3500'
  on-tertiary-container: '#ffcfc0'
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
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
  paper: '#EEF2F6'
  surface-inset: '#E6ECF3'
  ink-primary: '#0F2744'
  ink-secondary: '#3D5166'
  trust-teal: '#0F6A6A'
  postal-vermilion: '#C2410C'
  clock-amber: '#B45309'
typography:
  display-doc:
    fontFamily: Source Serif 4
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Lexend
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
  data-mono:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
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
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  form-gap: 32px
---

## Brand & Style
The design system follows a **"Paper and Ink"** philosophy, moving away from sterile digital interfaces toward a UI that feels like a calm, competent government desk. It is built for a civic hackathon prototype, focusing on outcomes rather than processes. The goal is to evoke the feeling of a well-organized office: helpful, authoritative, and human-centric.

The aesthetic is a hybrid of **Modern Minimalism** and **Tactile Utility**. It rejects common tech tropes like gradients or neon in favor of signage-grade legibility and civic wayfinding. The interface acts as a physical workspace where information is "laid out" clearly for the citizen to review and act upon.

**Design Principles:**
- **Outcome-Based Guidance:** Navigation and actions focus on what the user achieves (e.g., "Stop the money leaving") rather than technical steps (e.g., "Submit").
- **Wayfinding:** High-contrast rules and clear typography guide users through complex civic procedures.
- **Physicality:** Use of grain noise, borders, and monochromatic layering to simulate high-quality document stock.

## Colors
The palette is inspired by civic stationary and urban signage. 

- **Paper & Ink:** The primary relationship is high-contrast. The background (`#EEF2F6`) should be treated with a subtle 2% grain noise texture to prevent digital glare. All primary text uses **Ink Primary**, ensuring maximum legibility.
- **Trust Teal:** Used for primary actions, success states, and indicating safe, verified paths.
- **Postal Vermilion:** Reserved strictly for the "Quick Exit" feature and critical, high-consequence errors.
- **Clock Amber:** Used for warnings, deadlines, and time-sensitive information.
- **Surface Tiers:** Use **Surface** for cards and **Surface Inset** for form backgrounds or grouped content areas to create depth without shadows.

## Typography
The system prioritizes accessibility and "signage-grade" readability.

- **Lexend:** The primary workhorse for headings and body. It provides a friendly yet structured feel that aids reading speed.
- **Source Serif 4:** Used exclusively for "Document Titles" (e.g., specific Laws, Acts, or formal Certificates) to provide a sense of official permanence and historical weight.
- **IBM Plex Mono:** Used for all "Data/Identifiers" including reference numbers, case IDs, and tabular figures.
- **Atkinson Hyperlegible:** Used for fallback and secondary labels to ensure the interface remains accessible under all conditions.

Language should be targeted at a **Grade 6-8 reading level**. Focus on "You" centered phrasing to keep the citizen at the heart of the outcome.

## Layout & Spacing
The layout uses a **Fixed Grid** philosophy on desktop (max-width 1120px) to mimic a document centered on a desk.

- **Desktop:** 12-column grid with 24px gutters. Use large margins (48px+) to allow the "Paper" background to frame the content.
- **Mobile:** 4-column grid with 16px margins. Content should be stacked vertically with clear, ruled dividers.
- **Structure:** Content is organized into "Door Panels"—large, indexed sections that represent high-level routing. These should have generous internal padding (40px) to prevent the feeling of bureaucratic clutter.

## Elevation & Depth
This design system avoids all drop shadows to maintain the "Paper" aesthetic. Depth is created through **Flat Structural Layering** and **Line Work**.

- **Rules:** Use 1px `#C5D0DC` borders to define cards, inputs, and section breaks.
- **Stacking:** To show elevation, an element simply moves from the **Paper** background to a **Surface** card with a 1px border. 
- **Inset Depth:** Use **Surface Inset** for areas that should feel "carved out" of the desk, such as code snippets, PII redactions, or data logs.
- **Focus States:** High-contrast 2px teal outlines should be used for keyboard focus, maintaining the signage feel.

## Shapes
Shapes are functional and rigid to suggest reliability.

- **Standard Radius:** 4px for all buttons, cards, and input fields.
- **Hash Fingerprint:** A symmetric 5x5 grid used for photo privacy avatars.
- **Redaction Chips:** Rectangular tokens with sharp corners, mimicking physical tape used to strike through sensitive information.
- **Analog Discs:** Perfect circles are used for the "Railway Clock" deadlines to distinguish time-based elements from structural ones.

## Components

### Buttons & Navigation
- **Primary Action:** Trust Teal background, 4px radius, white Lexend bold text. Labelled by outcome (e.g., "Get my refund").
- **Quick Exit:** A fixed Postal Vermilion button positioned in the top-right. It should be highly visible at all times for citizen safety.

### Specialized Civic Components
- **Railway Clock Disc:** An analog station-clock style visualization for deadlines. Use a simple 2D representation with Clock Amber for the hands to indicate "Time Remaining."
- **Redaction Chips:** Use a monospaced font on a Surface Inset background with a strikethrough for PII (Personally Identifiable Information).
- **Door Panels:** Large, indexed cards used for the landing page. They should feature a large numeral or icon in the top-left to facilitate "Civic Wayfinding."

### Form Elements
- **Input Fields:** 1px border `#C5D0DC`. On focus, the border thickens to 2px Trust Teal.
- **Labels:** Always positioned above the input in Lexend Bold, following Grade 6 reading levels.

### Hash Fingerprint Badge
A unique 5x5 grid component that generates a symmetric geometric pattern based on a user's ID. This replaces stock photos or personal avatars to prioritize privacy while maintaining a "verified" aesthetic.