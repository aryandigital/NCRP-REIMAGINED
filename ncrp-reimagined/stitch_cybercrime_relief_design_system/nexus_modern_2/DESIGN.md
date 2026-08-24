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
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
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
The brand identity has shifted from a warm, energetic orange palette to a professional, trustworthy, and tech-forward aesthetic. The personality is "Corporate Modern"—reliable, balanced, and professional. It draws inspiration from high-end SaaS platforms, prioritizing clarity and functional elegance. The goal is to evoke a sense of stability and intelligence through the use of deep blues and a neutral, systematic interface.

## Colors
The color palette is anchored by a vibrant **Primary Blue (#1275e2)**, signaling technology and trust. The **Secondary palette (#5f78a3)** uses a muted, desaturated blue-grey to provide professional balance without competing for attention. **Tertiary accents (#c55b00)** are used sparingly for critical call-outs or highlights to maintain high functional contrast. The neutral scale is a **cool grey (#74777f)**, ensuring the interface feels grounded and modern.

## Typography
The system utilizes **Inter** across all levels to ensure maximum readability and a clean, geometric feel. 
- **Headlines**: Set in Inter, Bold (700). Large headlines are 32px with 40px line height.
- **Body**: Set in Inter, Regular (400). Standard body is 16px with 24px line height.
- **Labels**: Set in Inter, Medium (500). Standard labels are 14px for UI metadata.

The transition to Inter provides a neutral, "interface-first" look that scales perfectly from small labels to large display type.

## Layout & Spacing
The layout follows a fluid 12-column grid system with 16px gutters. Spacing is based on a strict 8px (unit 2) rhythm, ensuring vertical and horizontal alignment across all components. 
- **Margins**: 24px on desktop, 16px on mobile.
- **Gutter**: 16px.
- **Rhythm**: All padding and margins should be increments of 8px.

## Elevation & Depth
Visual hierarchy is conveyed through tonal layers and ambient shadows. We use subtle, low-opacity shadows with a slight blue tint to lift elements off the background. Background surfaces use light grey tints to create "containers" that distinguish content areas without the need for heavy borders.

## Shapes
The design uses a **Rounded** shape language.
- **Standard (Base)**: 0.5rem (8px) corner radius for buttons and small components.
- **Large (Lg)**: 1rem (16px) for cards and sections.
- **Extra Large (Xl)**: 1.5rem (24px) for modals and major overlays.

This creates a friendly, approachable aesthetic that still feels structured and precise.

## Components
- **Buttons**: Feature 8px rounded corners and use the Primary Blue for main actions.
- **Inputs**: Use a 1px border in the neutral-variant color, shifting to a 2px Primary Blue border on focus.
- **Cards**: Utilize a subtle ambient shadow and a 16px corner radius to group related content.
- **Chips**: Pill-shaped with a Secondary color background and dark-on-light text for categorization.