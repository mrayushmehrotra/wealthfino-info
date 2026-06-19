---
name: WealthFino Capital
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#404942'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#707971'
  outline-variant: '#c0c9c0'
  surface-tint: '#2d6a48'
  primary: '#003820'
  on-primary: '#ffffff'
  primary-container: '#0f5132'
  on-primary-container: '#84c39b'
  inverse-primary: '#95d4ac'
  secondary: '#785900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc003'
  on-secondary-container: '#6c5000'
  tertiary: '#303030'
  on-tertiary: '#ffffff'
  tertiary-container: '#474646'
  on-tertiary-container: '#b6b4b3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f1c7'
  primary-fixed-dim: '#95d4ac'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#0f5132'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#fabd00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
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
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for a high-trust, retail-inspired fintech experience. It bridges the gap between the reliability of traditional banking and the high-energy engagement of e-commerce. The brand personality is authoritative yet accessible, using a "Content-First" philosophy to demystify complex financial products through visual storytelling.

The aesthetic follows a **Modern Corporate** style with **Tactile/Retail** influences. It prioritizes information density without sacrificing clarity, utilizing high-contrast elements and purposeful white space to guide the user through investment opportunities and financial data. The emotional response should be one of confidence, growth, and ease of use.

## Colors

The palette is anchored by a deep **Primary Dark Green**, signaling stability and financial growth. The **Secondary Accent Yellow** is used sparingly as a high-visibility trigger for call-to-actions, promotions, and critical alerts, mirroring the urgency found in retail environments.

- **Primary (#0F5132):** Used for headers, primary buttons, and brand iconography.
- **Secondary (#FFC107):** Used for promotional badges, "Invest Now" triggers, and highlighting active states.
- **Surface/Neutral:** A clean white background ensures readability for content-heavy screens, supported by a light gray (#F8F9FA) for section nesting.
- **Text:** Deep Black (#1A1A1A) is used for maximum legibility in body copy and data tables.

## Typography

The design system utilizes **Plus Jakarta Sans** for its modern, clean, and highly legible characteristics. Given the content-heavy nature of the app, the hierarchy is intentionally steep.

- **Display & Headlines:** Use tighter letter-spacing and heavier weights to create impact for portfolio balances and promotional headers.
- **Body:** Standardized at 16px for comfort, with 14px used for secondary metadata or fine print in financial disclosures.
- **Labels:** Semi-bold weights are used for navigation items and button text to ensure they stand out against rich content.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for high-density retail layouts. 

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile.
- **Margins:** A standard 16px margin on mobile ensures content doesn't feel cramped, while desktop margins expand to 48px to maintain a premium feel.
- **Rhythm:** An 8px base unit (soft-grid) governs all padding and margins. 
- **Horizontal Reels:** For product discovery, elements should bleed off the screen edge to indicate horizontal scrollability, specifically for mutual fund cards or news updates.

## Elevation & Depth

To create a premium feel, the design system avoids heavy shadows in favor of **Ambient Shadows** and **Tonal Layers**.

- **Level 1 (Cards):** Soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) to lift content off the background.
- **Level 2 (Active/Hover):** Slightly deeper shadow (0px 8px 30px rgba(0, 0, 0, 0.08)) to indicate interactivity.
- **Floating Elements:** Search bars and bottom navigation use a subtle border (1px solid #EEEEEE) combined with a low-opacity shadow to ensure they remain anchored yet distinct.
- **Promotional Banners:** These use saturated background colors (Primary Green) with no shadow, relying on color contrast for depth.

## Shapes

The shape language is consistently **Rounded (Level 2)** to maintain an approachable, retail-friendly aesthetic.

- **Standard Cards:** 16px (1rem) corner radius.
- **Buttons:** 12px (0.75rem) corner radius for a "squircle" feel that balances professional and friendly.
- **Search Bars:** Fully rounded (pill-shaped) to distinguish them as high-level utility tools.
- **Badges/Chips:** 8px (0.5rem) radius for compact categorization.

## Components

### Buttons
- **Primary:** Primary Green background, white text. Bold weight.
- **Secondary:** White background, Primary Green border, Primary Green text.
- **Promotional:** Secondary Yellow background, Deep Black text. Used only for "Limited Time" or "High Impact" actions.

### Cards
- **Product Cards:** Feature a 1:1 or 4:3 aspect ratio image area at the top, followed by a headline and a clear call-to-action.
- **Data Cards:** Use a white surface with a 1px #F0F0F0 border. Highlight key metrics (e.g., Returns %) in Primary Green.

### Input Fields & Search
- **Search Bar:** Prominent, pill-shaped, with a subtle #F8F9FA fill and a search icon.
- **Form Inputs:** Floating labels with 16px padding. Active state uses a 2px Primary Green border.

### Reels & Banners
- **Horizontal Reels:** Standardized card width (280px on desktop, 80% screen width on mobile) to ensure the next item is visible.
- **Promo Banners:** Full-width or inset with high-contrast gradients and "Plus Jakarta Sans" display typography.

### Selection Controls
- **Checkboxes/Radios:** Primary Green fill when selected.
- **Chips:** Light gray background (#F0F0F0) with black text, switching to Primary Green with white text when active.