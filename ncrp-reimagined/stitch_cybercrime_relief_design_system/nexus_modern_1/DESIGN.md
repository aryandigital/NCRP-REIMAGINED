---
name: Nexus Modern
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
  margin: 24px
---

# Design System: Nexus Modern

## Brand & Style
The brand identity has shifted from a warm, energetic orange palette to a cool, professional, and trustworthy blue aesthetic. The style is **Corporate / Modern**, emphasizing reliability, clarity, and precision. It draws inspiration from modern interface guidelines, balancing a clean professional look with high functional density. The emotional response should be one of stability and technological sophistication.

## Colors
The color palette is anchored by a vibrant **Primary Blue (#1275e2)**, providing a sense of modern efficiency. The **Secondary Blue-Grey (#5f78a3)** offers a professional supporting tone for sub-elements and navigation. A **Tertiary Burnt Orange (#c55b00)** is used sparingly for strategic accents and calls to action that require contrast without breaking the professional harmony. The **Neutral Grey (#74777f)** ensures legible interfaces and balanced surfaces.

## Typography
The system has transitioned to **Inter** for all typographic roles. Inter provides superior legibility on digital screens and a neutral, high-tech character that aligns with the new brand direction. Headlines use tighter tracking and heavier weights, while body text maintains generous line heights to ensure readability in data-heavy views.

- **Headlines:** Inter (Bold/Semi-bold)
- **Body:** Inter (Regular)
- **Labels:** Inter (Medium)

## Layout & Spacing
The layout follows a **Fluid Grid** model with a base-8 rhythm. This ensures consistency across all components and page structures. On desktop, a 12-column grid is used with 16px gutters. On mobile, the system collapses to a single-column layout with 24px side margins to ensure content remains the primary focus while providing comfortable touch targets.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and subtle **Ambient Shadows**. Surfaces at higher elevations use slightly lighter background values and diffused, low-opacity shadows tinted with the neutral grey to maintain a clean, modern appearance without looking dated or heavy.

## Shapes
The design has evolved from sharp corners to a **Rounded** shape language. This softens the professional aesthetic, making the interface feel more approachable and modern. Standard components use a 0.5rem (8px) corner radius, while larger containers like cards utilize 1rem (16px) for a distinct visual hierarchy.

## Components
- **Buttons:** Feature 8px (0.5rem) rounded corners, utilizing the Primary Blue for main actions and the Secondary Blue-Grey for ghost/outline buttons.
- **Input Fields:** Use the Inter font for labels and values, with a subtle 1px border in the neutral palette.
- **Cards:** Defined by 1rem (16px) roundedness and a soft ambient shadow to separate content from the background.
- **Chips:** Highly rounded (pill-shaped) to distinguish them from actionable buttons, utilizing the secondary color palette.