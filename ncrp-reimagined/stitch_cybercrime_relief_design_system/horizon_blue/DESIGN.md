---
name: Horizon Blue
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
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
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
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
---

# Horizon Blue Design System

## Brand & Style
Horizon Blue is a corporate and modern design system built on principles of reliability, clarity, and professional competence. It moves away from the previous warm, high-energy palette towards a more stable and trustworthy visual language. 

The style is inspired by modern digital interfaces (Material 3 and HIG) characterized by balanced proportions, purposeful whitespace, and a focus on content over decoration. It targets a professional audience that values efficiency and logical organization. The emotional response should be one of calm confidence and structured clarity.

## Colors
The color palette shifts from an aggressive orange-centric theme to a professional blue-dominant scheme. 

- **Primary (#1275e2):** A vibrant, trustworthy blue used for core actions, active states, and brand recognition.
- **Secondary (#5f78a3):** A muted, desaturated blue-grey used for supporting UI elements and accents that require less visual weight.
- **Tertiary (#c55b00):** A sophisticated burnt orange used sparingly for highlighting specific features or providing a warm counterpoint to the dominant blues.
- **Neutral (#74777f):** A balanced cool grey for surfaces, borders, and secondary text, ensuring a clean and modern appearance.

The system uses a light color mode with a "fidelity" variant to ensure color accuracy and high contrast for accessibility.

## Typography
The system has transitioned from Public Sans to **Inter**, a typeface specifically designed for user interfaces. Inter provides superior legibility at small sizes and a clean, neutral character that fits the corporate aesthetic.

- **Headlines:** Use tighter tracking and heavier weights to create a strong hierarchy.
- **Body:** Optimized for readability with generous line heights.
- **Labels:** Set in medium weights to distinguish functional text from narrative content.
- **Scaling:** For mobile devices, large headlines (32px+) should scale down to a maximum of 28px to ensure they fit within standard viewport widths.

## Layout & Spacing
The layout follows a fluid 12-column grid system for desktop and a 4-column grid for mobile. 

- **Spacing Rhythm:** Based on an 8px (base 2 multiplier) scale. 
- **Gutters:** 16px fixed gutters between columns.
- **Margins:** 16px for mobile viewports, increasing to 24px or 32px on larger screens to allow the content to breathe.
- **Philosophy:** Components use consistent padding (e.g., 16px internal padding for cards) to maintain a logical and predictable flow.

## Elevation & Depth
Elevation is conveyed through **Tonal Layers** and subtle **Ambient Shadows**. Surfaces are tiered to create a sense of hierarchy:
- **Level 0 (Base):** The main background color.
- **Level 1 (Card/Surface):** A slight tonal shift or very soft, diffused shadow (0px 2px 4px rgba(0,0,0,0.05)).
- **Level 2 (Dropdowns/Modals):** More pronounced shadows to indicate they are floating above the main UI plane.

Avoid heavy black shadows; use tinted shadows that incorporate a hint of the neutral or primary blue color to keep the interface looking clean.

## Shapes
The design system has evolved from a sharp, 0px radius to a **Rounded (Level 2)** shape language. This change softens the professional aesthetic, making the interface feel more modern and approachable.

- **Standard Buttons & Inputs:** 0.5rem (8px) corner radius.
- **Cards & Large Containers:** 1rem (16px) corner radius.
- **Large Sections/Dialogs:** 1.5rem (24px) corner radius.

## Components
- **Buttons:** Primary buttons use the new Blue (#1275e2) with white text and 8px rounded corners.
- **Input Fields:** Use the neutral grey for borders with a 1px thickness, switching to primary blue for the active state.
- **Cards:** White or very light grey surfaces with 16px rounded corners and a Level 1 shadow.
- **Chips:** Highly rounded (pill-shaped) using the secondary blue-grey at low opacity for a subtle, professional look.
- **Checkboxes/Radios:** Use the primary blue for the selected state, ensuring a clear visual indicator of choice.