---
name: Modern Professional
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
  gutter: 16px
  margin: 24px
---

# Design System: Modern Professional

## Brand & Style
The brand identity has shifted from a warm, energetic orange palette to a cool, dependable, and professional blue aesthetic. The style is **Corporate / Modern**, emphasizing reliability, clarity, and precision. It draws inspiration from modern interface guidelines to create an environment that feels trustworthy and high-performing. The transition from Public Sans to Inter reinforces a more technical and crisp visual language suitable for data-rich applications.

## Colors
The color palette is anchored by a vibrant Primary Blue (#1275e2), signaling action and competence. This is supported by a muted, desaturated Secondary Blue-Grey (#5f78a3) for auxiliary interface elements. A Tertiary Burnt Orange (#c55b00) provides a high-contrast accent for notifications or specific call-outs, while the Neutral Grey (#74777f) ensures balanced surfaces and text contrast. The system operates primarily in a light color mode.

## Typography
We have unified the type system under **Inter**, a typeface designed for screens. The use of Inter across headlines, body, and labels ensures maximum legibility and a cohesive, modern feel. Headlines utilize a semi-bold weight to establish clear hierarchy, while body text remains optimized for readability with generous line heights. 

- **Headlines:** Inter (Semi-bold)
- **Body:** Inter (Regular)
- **Labels:** Inter (Medium)

## Layout & Spacing
The system utilizes a 12-column fluid grid for desktop, transitioning to a 4-column layout for mobile. A base unit of 8px governs all spatial relationships. 

- **Gutters:** 16px
- **Margins:** 24px
- **Grid:** Fluid 12-column

## Elevation & Depth
Depth is communicated through **Tonal Layers** and subtle shadows. Surface containers use slight variations in neutral tones to indicate hierarchy. Primary actions may use a soft ambient shadow to appear "lifted," but the overall aesthetic remains relatively flat and clean to align with the modern corporate style.

## Shapes
The design features a **Rounded** aesthetic. Standard UI elements like buttons and input fields feature a 0.5rem (8px) corner radius. This choice balances the professional tone with a contemporary, user-friendly feel.

- **Standard Radius:** 8px (0.5rem)
- **Large Radius:** 16px (1rem)
- **Extra Large Radius:** 24px (1.5rem)

## Components
- **Buttons:** Feature 8px rounded corners, utilizing the Primary Blue for main actions and the Secondary Blue-Grey for ghost or secondary actions.
- **Cards:** Defined by a 16px radius and a subtle low-opacity neutral border or light ambient shadow.
- **Inputs:** Use the Neutral Grey for borders with an Inter 14px font size; they transition to a Primary Blue border on focus.
- **Chips:** Highly rounded (pill-shaped) to distinguish them from buttons, utilizing the Tertiary color for status-specific indicators.