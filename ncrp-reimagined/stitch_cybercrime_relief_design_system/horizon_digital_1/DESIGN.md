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
    fontWeight: '600'
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
---

# Horizon Digital Design System

## Brand & Style
Horizon Digital is a modern, professional, and reliable design system built for clarity and efficiency. The brand personality is rooted in "Corporate Modern" aesthetics—balancing the accessibility of Material Design with a cleaner, more refined execution. The target audience includes professional users who require a high degree of focus and data density without sacrificing visual appeal. The UI evokes a sense of stability and technological sophistication through a balanced color palette and the precision of the Inter typeface.

## Colors
The color palette has shifted from warm, earth-toned oranges to a professional, tech-forward blue spectrum. 

- **Primary (#1275e2):** A vibrant, trustworthy blue used for main actions, active states, and brand highlights.
- **Secondary (#5f78a3):** A muted slate blue that supports the primary color and handles lower-emphasis interactive elements.
- **Tertiary (#c55b00):** A deep amber used sparingly for accents, warnings, or contrasting call-to-outs.
- **Neutral (#74777f):** A balanced cool gray used for surfaces, borders, and secondary text to maintain a clean, objective environment.

## Typography
The system now utilizes **Inter** across all roles, replacing Public Sans. Inter is chosen for its exceptional legibility on digital screens and its neutral, modern character. Headlines use a semi-bold weight to establish clear hierarchy, while body text remains regular for maximum readability in data-heavy contexts. The scale is designed to be compact yet accessible, prioritizing information density and alignment.

## Layout & Spacing
The layout follows a fluid 8px grid system. Margins and gutters are set to 24px (lg) for desktop and 16px (md) for mobile devices. This consistent rhythmic spacing ensures that components feel organized and intentional. Elements are grouped using logical spacing units to create a clear visual hierarchy between related and unrelated content.

## Elevation & Depth
Elevation is conveyed through **tonal layers** and soft, ambient shadows. Instead of harsh borders, surfaces use varying shades of neutral and primary tints to indicate depth. Surfaces higher in the stack use subtle, diffused shadows with low-opacity blue-gray tints to maintain a soft, integrated feel within the interface.

## Shapes
The design has transitioned from a sharp-edged, zero-radius aesthetic to a **Rounded** (Level 2) shape language. This change introduces a more approachable and modern feel.
- Standard components (buttons, inputs): 0.5rem (8px) radius.
- Larger containers (cards, modals): 1rem (16px) radius.
- Oversized containers: 1.5rem (24px) radius.

## Components
- **Buttons:** Feature 8px corner radii and utilize the new primary blue (#1275e2). Text is set in Inter Medium.
- **Input Fields:** Utilize a subtle neutral border (#74777f) with an 8px radius, moving to a primary blue focus ring.
- **Cards:** Employ a 16px radius with low-intensity ambient shadows to distinguish them from the background.
- **Chips:** Highly rounded/pill-shaped components used for tags and filters, utilizing secondary slate-blue tones.