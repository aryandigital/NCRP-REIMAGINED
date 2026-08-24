---
name: Blue City Containment
colors:
  surface: '#fbf8ff'
  surface-dim: '#d2d8ff'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ececff'
  surface-container-high: '#e4e7ff'
  surface-container-highest: '#dde1ff'
  on-surface: '#111939'
  on-surface-variant: '#55433a'
  inverse-surface: '#272e4f'
  inverse-on-surface: '#efefff'
  outline: '#887368'
  outline-variant: '#dbc1b5'
  surface-tint: '#974810'
  primary: '#94460d'
  on-primary: '#ffffff'
  primary-container: '#b35e25'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb68d'
  secondary: '#415d99'
  on-secondary: '#ffffff'
  secondary-container: '#9fbbfd'
  on-secondary-container: '#2c4984'
  tertiary: '#0056c3'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f70e1'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#afc6ff'
  on-secondary-fixed: '#001944'
  on-secondary-fixed-variant: '#274580'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#afc6ff'
  on-tertiary-fixed: '#001944'
  on-tertiary-fixed-variant: '#004299'
  background: '#fbf8ff'
  on-background: '#111939'
  surface-variant: '#dde1ff'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-main:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
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
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is a "Citizen-First Cyber Response" framework. It rejects the bureaucratic sterility of traditional government portals and the dark, paranoid tropes of "hacker" aesthetics. Instead, it draws inspiration from a well-lit control room in Jodhpur at dusk: competent, vivid, and forward-moving.

The aesthetic blends **Modern Indian Editorial** with **Industrial Precision**. It uses flat planes of color reminiscent of vintage Indian travel posters but applies them to a modern, high-stakes utility context. The goal is to make the user feel "contained" within a safe, expert environment where they can Check, Act, Report, and Recover with absolute clarity.

**Design Movements:**
- **Modern Corporate / Editorial:** Using high-character typography and deliberate whitespace to convey authority.
- **Tactile Precision:** Using "stamps" and "tracks" to visualize progress through the cyber-recovery journey.
- **Illustrative Clarity:** 2px indigo line art and flat color planes provide a human, non-threatening touch to technical reporting.

## Colors
The palette is functional and narrative-driven, organized into "tracks" to guide the citizen's psychological state.

- **Plaster (#F2F5FB):** The base layer. A soft, architectural white that reduces eye strain and provides a clean canvas.
- **The Jodhpur Duo:** **Deep Jodhpur** (#14356F) handles identity and structure, while **Electric Jodhpur** (#2E6FE0) creates a vibrant access track for secondary actions and high-visibility focus states.
- **The Copper Path (#C46B32):** This is the primary journey color. It is used exclusively for "Money Track" actions—where the user is taking definitive steps to recover or report.
- **Functional Accents:** **Marigold** is used for "Safety Stamps" and success markers; **Vermilion** is for "Live Threats" and the urgent "Quick Exit" feature; **River Teal** provides a calming backdrop for privacy settings and photo-heavy sections.

## Typography
The typography system uses a high-contrast pairing to balance urgent character with extreme readability.

- **Headlines:** Bricolage Grotesque provides a "compressed" and urgent feel. It should be used with tight tracking to mimic mid-century editorial layouts.
- **Body:** Lexend is chosen for its superior readability and generous character widths, essential for citizens who may be in a state of stress or panic.
- **Metadata:** IBM Plex Mono is used for all technical data, reference numbers, and timestamps to provide a sense of "receipt" and official logging.

All text should default to **Indigo Dye** (#121A3A) to ensure high contrast against the Plaster background, exceeding WCAG AA standards.

## Layout & Spacing
The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

The layout philosophy is "Containment." Content should be grouped into distinct, heavy-padded sections that feel like separate rooms in a control center. 
- Use **Night Wash** (#0E1C3A) for full-bleed section fields to signal a change in context (e.g., from "Learning" to "Reporting").
- Spacing follows a strict 8px rhythmic scale.
- Vertical rhythm is prioritized; use generous 120px padding between major section containers on desktop to maintain the "Well-lit" and airy feel.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** and **Copper Shadows** rather than standard grey blurs.

- **Flat Planes:** Surfaces do not typically float. They sit firmly on the Plaster background with 2px Indigo Dye outlines for structural definition.
- **The Copper Glow:** Primary cards and "Actionable" journey steps use a soft, copper-tinted shadow (`0 12px 40px rgba(196,107,50,0.12)`). This suggests importance and warmth, drawing the eye toward the solution.
- **State Changes:** On hover, cards should not lift higher; instead, they should undergo a subtle color shift or line-weight reinforcement to signal interactivity.

## Shapes
The shape language is intentional and varied to signal different types of information:

- **Cards (16px):** Large radius to feel approachable and safe.
- **Buttons (12px):** Slightly more rigid than cards to suggest a "control" or "toggle" feel.
- **Stamps (4px):** Used for status tags, reference numbers, and progress indicators. The sharper corners mimic a physical rubber stamp, suggesting finality and official verification.
- **Lines:** 2px stroke weight is the standard for all UI borders and line art, using Indigo Dye.

## Components

### Buttons & Targets
- **Primary CTA:** Copper background, White text, 12px radius. Active state shifts to Copper Deep.
- **Secondary:** Electric Jodhpur ghost buttons with a 2px stroke.
- **Accessibility:** All touch targets are a minimum of 48px. Focus states use a 3px Electric Jodhpur ring with a 2px offset.

### The "Journey Track"
A unique vertical or horizontal stepper component where the line "fills" with Copper as the citizen completes steps. Completed steps are marked with a **Marigold Stamp**.

### Cards
Cards use the Plaster background with a 2px Indigo Dye border. For "Primary Journey" cards, apply the soft Copper Shadow. Headlines inside cards should be H3 (Bricolage).

### Input Fields
Inputs are structured with IBM Plex Mono labels. The active field border switches from Indigo Dye to Electric Jodhpur. Error states use Vermilion text and a 2px Vermilion bottom border.

### Status Stamps
Small, 4px-radius badges. 
- **Success:** Marigold background with Indigo text.
- **Pending:** Electric Jodhpur background with White text.
- **Alert:** Vermilion background with White text.

### Interactive Illustrations
Line art (2px Indigo) should be used within cards. On hover of a "Help" or "Report" card, the illustration should have a subtle motion—for example, a "Door" icon shifting slightly to reveal a "Poster" inside, signaling entry into a new phase of the service.