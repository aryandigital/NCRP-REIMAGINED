---
name: Horizon Digital
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7dae3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fc'
  surface-container: '#ebedf7'
  surface-container-high: '#e6e8f1'
  surface-container-highest: '#e0e2eb'
  on-surface: '#181c22'
  on-surface-variant: '#414753'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eef0fa'
  outline: '#717785'
  outline-variant: '#c1c6d5'
  surface-tint: '#005db8'
  primary: '#005ab4'
  on-primary: '#ffffff'
  primary-container: '#0a73e0'
  on-primary-container: '#fefcff'
  inverse-primary: '#aac7ff'
  secondary: '#465f88'
  on-secondary: '#ffffff'
  secondary-container: '#b6d0ff'
  on-secondary-container: '#3f5881'
  tertiary: '#964400'
  on-tertiary: '#ffffff'
  tertiary-container: '#bd5700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aec7f7'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#2d476f'
  tertiary-fixed: '#ffdbc9'
  tertiary-fixed-dim: '#ffb68c'
  on-tertiary-fixed: '#321200'
  on-tertiary-fixed-variant: '#763400'
  background: '#f9f9ff'
  on-background: '#181c22'
  surface-variant: '#e0e2eb'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

# Horizon Digital Design System

## Brand & Style
Horizon Digital is a professional, reliable, and modern design system. It shifts away from the previous warm, earth-toned palette toward a crisp, tech-forward aesthetic. The brand evokes a sense of trust, precision, and clarity. The style is **Corporate / Modern**, leaning into clean interfaces, balanced white space, and a refined professional appearance suitable for enterprise and high-end consumer applications.

## Colors
The color palette is centered around a vibrant, trustworthy blue. 

*   **Primary (#1275e2):** A bright, digital blue used for main actions, active states, and brand recognition.
*   **Secondary (#5f78a3):** A muted, cool blue-grey used for supporting UI elements and secondary actions.
*   **Tertiary (#c55b00):** A burnt orange used sparingly for accents, highlights, or to draw attention to specific functional areas.
*   **Neutral (#74777f):** A balanced cool grey used for surfaces, borders, and text to ensure high legibility and a stable visual foundation.

The system is optimized for a **Light Mode** experience, emphasizing clarity and high contrast against white or light-grey backgrounds.

## Typography
The system uses **Inter** for all typographic layers. Inter is chosen for its exceptional legibility on digital screens and its neutral, modern tone. 

*   **Headlines:** Use heavier weights (600-700) to create a clear hierarchy. Large headlines are capped at 32px for mobile accessibility.
*   **Body:** Maintains a standard weight (400) for readability in paragraphs and long-form content.
*   **Labels:** Utilize a medium weight and slight letter spacing to ensure clarity at small sizes.

## Layout & Spacing
The layout follows a **fluid grid** philosophy based on a 4px baseline shift. 

*   **Grid:** A 12-column system for desktop, transitioning to a 4-column system for mobile.
*   **Gutters:** Fixed at 16px to maintain a compact but breathable information density.
*   **Margins:** Standardized at 24px for page edges.
*   **Rhythm:** Spacing between major sections should utilize larger spacing tokens (24px or 32px) to prevent visual clutter.

## Elevation & Depth
Depth is communicated through **tonal layers** and subtle **ambient shadows**. Rather than heavy black shadows, the system uses low-opacity tints of the neutral color to create soft lifts. Backgrounds use slight shifts in the neutral scale to differentiate between the base canvas and container surfaces, creating a structured, organized feel without relying on heavy borders.

## Shapes
The design language uses a **Rounded** approach (Level 2). This provides an approachable yet professional feel that complements the Inter typeface.

*   **Standard components:** (Buttons, Inputs) have a 0.5rem (8px) radius.
*   **Large containers:** (Cards, Modals) have a 1rem (16px) radius.
*   **Extra-large elements:** Have a 1.5rem (24px) radius.

## Components
*   **Buttons:** Primary buttons use the `#1275e2` background with white text. They feature 8px rounded corners and subtle hover states.
*   **Inputs:** Use a soft neutral border. On focus, the border shifts to the Primary blue with a subtle glow.
*   **Cards:** Elevated slightly with tonal shifts; they utilize the 16px corner radius to distinguish them from smaller UI elements.
*   **Chips:** Highly rounded (pill-shaped) using the Secondary color at low opacity for a subtle, tag-like appearance.