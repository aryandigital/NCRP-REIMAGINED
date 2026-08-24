---
name: Nexus Blue
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

# Nexus Blue Design System

## Brand & Style
The brand identity has transitioned from a warm, energetic orange palette to a cool, professional, and trustworthy blue aesthetic. The personality is "Corporate Modern"—focused on reliability, clarity, and precision. It draws inspiration from modern productivity platforms, emphasizing high legibility and a balanced visual hierarchy. The style utilizes clean lines, ample white space, and a refined professional tone that evokes a sense of technological stability and competence.

## Colors
The color palette is anchored by a vibrant Primary Blue (#1275e2), serving as the main driver for action and identity. The Secondary color is a muted, desaturated Steel Blue (#5f78a3), used for supportive UI elements and less prominent callouts. A Tertiary Burnt Orange (#c55b00) provides a high-contrast accent for notifications or specific highlights, maintaining a functional link to the brand's heritage while remaining subordinate to the new blue core. The Neutral palette consists of cool grays (#74777f) to maintain a cohesive, professional environment.

## Typography
The system uses "Inter" across all levels to ensure maximum readability and a clean, modern digital feel. Headlines utilize a heavier weight for clear information architecture. Body text is optimized for long-form reading with generous line heights. Labels use medium weights to remain legible at smaller sizes.

*   **Headlines:** Inter, Bold (700), used for page titles and section headers.
*   **Body:** Inter, Regular (400), used for all primary content.
*   **Labels:** Inter, Medium (500), used for buttons, tags, and form headers.

## Layout & Spacing
The layout follows a fluid 12-column grid system with a baseline unit of 8px. Gutters are set to 16px to provide clear separation between content blocks, while outer margins are 24px to provide breathing room on desktop. On mobile devices, margins scale down to 16px to maximize screen real estate.

## Elevation & Depth
Depth is communicated through tonal layering and soft, ambient shadows. Backgrounds use the lightest neutral tones, while containers and cards use pure white with subtle, low-opacity shadows (10-15% opacity) to suggest elevation without creating visual clutter. Hover states are indicated by a slight increase in shadow spread and a subtle shift in primary color saturation.

## Shapes
The design has moved away from sharp edges to a more approachable "Rounded" style. Standard UI elements like buttons and input fields use a 0.5rem (8px) corner radius. Larger components like cards or modal containers utilize a "rounded-lg" (16px) or "rounded-xl" (24px) radius to create a soft, friendly, yet professional appearance.

## Components
- **Buttons:** Feature 8px rounded corners and use the Primary Blue (#1275e2) for high-priority actions. Secondary actions use the Steel Blue (#5f78a3) or outlined variants.
- **Inputs:** Clean borders using the neutral palette (#74777f) with a focus state highlighted by a 2px Primary Blue stroke.
- **Cards:** White backgrounds with a 16px border radius and soft ambient shadows to denote elevation.
- **Chips:** Highly rounded (pill-shaped) using light tints of the secondary or tertiary colors for categorization and tagging.