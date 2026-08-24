---
name: The Citizen's Desk
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#3f4948'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#6f7979'
  outline-variant: '#bec9c8'
  surface-tint: '#0d6969'
  primary: '#005050'
  on-primary: '#ffffff'
  primary-container: '#0f6a6a'
  on-primary-container: '#9be7e6'
  inverse-primary: '#87d3d3'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#43484c'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b6063'
  on-tertiary-container: '#d6dade'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f0ef'
  primary-fixed-dim: '#87d3d3'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f50'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#dfe3e7'
  tertiary-fixed-dim: '#c3c7cb'
  on-tertiary-fixed: '#171c1f'
  on-tertiary-fixed-variant: '#43474b'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
  trust-teal: '#0F6A6A'
  postal-vermilion: '#C2410C'
  clock-amber: '#B45309'
  paper-background: '#EEF2F6'
  ink-black: '#0F172A'
  redaction-gray: '#334155'
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
  body-sm:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-technical:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-ack:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 14px
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
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is built on a "Paper and Ink" aesthetic, designed specifically for individuals navigating high-stress bureaucratic or legal environments. The personality is authoritative yet empathetic, evoking the physical reliability of official government documentation and civic signage.

The visual style is a functional hybrid of **Minimalism** and **Tactile** design. By utilizing a subtle grain texture and a flat, high-contrast palette, the UI mimics physical stationery. Every design decision prioritizes "signage-grade" legibility, ensuring that users in crisis can find critical information and the "Quick Exit" functions instantly. There are no gradients, 3D effects, or decorative flourishes; the focus is entirely on utility, clarity, and the psychological safety of the citizen.

## Colors
The palette is inspired by public sector heritage and high-visibility safety signage.

- **Primary (Trust Teal):** Used for primary actions, validated states, and core navigational headers. It represents stability and official assistance.
- **Secondary (Slate):** Used for supporting UI elements and secondary actions to maintain a professional, calm environment.
- **Background (Paper):** A soft, slightly blue-tinted white (#EEF2F6) with a subtle digital grain overlay to reduce screen glare and mimic physical documents.
- **Postal Vermilion:** Reserved exclusively for "Quick Exit" or "Danger" actions. This is a high-visibility, urgency-driven color.
- **Clock Amber:** Used for warnings, pending states, and technical alerts requiring immediate attention but not immediate exit.

## Typography
Typography is the primary tool for establishing hierarchy and trust in this design system.

- **Source Serif 4:** Used for legal titles, section headers, and formal declarations. Its literary roots provide a sense of officialdom and gravity.
- **Lexend:** Used for all UI controls, instructions, and body copy. Specifically chosen for its readability and wide character spacing, which aids users under cognitive load.
- **IBM Plex Mono:** Used for technical data, hash fingerprints, timestamps, and receipt acknowledgments (ACKs). The monospaced nature signals "system-generated" data and provides a distinct visual break from human-readable prose.

## Layout & Spacing
Following GOV.UK principles, the layout utilizes a **fixed grid** approach on desktop (max-width 1024px) to ensure line lengths remain readable for legal content. 

The system uses a strict 4px base unit. Vertical rhythm is prioritized to allow users to scan long forms easily. Content is stacked in a single column wherever possible to reduce "Z-pattern" eye fatigue. 

**Breakpoints:**
- **Mobile (< 640px):** 1-column, 16px margins, compact headers.
- **Tablet (640px - 1024px):** 1-column centered, 24px margins.
- **Desktop (> 1024px):** Fixed-width content container (960px), 48px margins.

## Elevation & Depth
This system rejects shadows and 3D effects in favor of **Tonal Layers** and **Bold Outlines**. 

Depth is communicated through "ink-on-paper" stacking:
- **Level 0 (Background):** The grained Paper (#EEF2F6) surface.
- **Level 1 (Containers):** White (#FFFFFF) cards with a 2px solid border in Trust Teal or Redaction Gray.
- **Interactive States:** Elements do not "lift"; they change fill color or gain a secondary high-contrast "focus" border (3px solid Clock Amber).
- **Redaction:** High-priority hidden data is covered by solid blocks of Redaction Gray, creating a physical sense of "removal" from the page.

## Shapes
The shape language is "Soft" (Level 1) with a consistent 4px (0.25rem) radius. This small radius provides enough "humanity" to feel approachable while maintaining the structural rigidity of a printed document or official form. Buttons, input fields, and Railway Clock Discs all adhere to this 4px standard to ensure a cohesive, architectural feel.

## Components
- **Railway Clock Discs:** Circular or slightly rounded containers for status indicators and timers. Use a heavy 2px border and IBM Plex Mono for time data.
- **Hash Fingerprint Badges:** Small, monospaced data blocks used for verification codes. Set on a light gray background with a 1px dotted border to indicate a "tear-off" or technical receipt.
- **Redaction Chips:** Solid Ink Black or Redaction Gray blocks used to mask sensitive info. They must be clearly distinct from buttons; they are non-interactive and static.
- **Quick Exit Button:** A prominent, persistent component styled in Postal Vermilion. It must be the most visible element on any page involving sensitive data.
- **Input Fields:** Rectangular with a 4px radius and a 2px solid Ink Black border. On focus, the border thickens and changes to Trust Teal.
- **Cards:** White surfaces with a 1px solid Slate border. No shadows. Used to group related legal clauses or form sections.
- **Signage Labels:** High-contrast labels using Lexend Bold and all-caps to denote section types (e.g., "URGENT", "ACTION REQUIRED").