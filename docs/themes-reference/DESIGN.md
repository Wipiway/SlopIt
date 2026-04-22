---
name: Warm Minimalist Publishing
colors:
  surface: '#fff8f6'
  surface-dim: '#f2d3ca'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ed'
  surface-container: '#ffe9e3'
  surface-container-high: '#ffe2da'
  surface-container-highest: '#fbdcd3'
  on-surface: '#281712'
  on-surface-variant: '#5c4037'
  inverse-surface: '#3f2c26'
  inverse-on-surface: '#ffede8'
  outline: '#916f65'
  outline-variant: '#e6beb2'
  surface-tint: '#ad3300'
  primary: '#a93100'
  on-primary: '#ffffff'
  primary-container: '#d34000'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#005da8'
  on-tertiary: '#ffffff'
  tertiary-container: '#0076d3'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#842500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004884'
  background: '#fff8f6'
  on-background: '#281712'
  surface-variant: '#fbdcd3'
typography:
  display-lg:
    fontFamily: Satoshi
    fontSize: 48px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  h1:
    fontFamily: Satoshi
    fontSize: 32px
    fontWeight: '900'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Satoshi
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Satoshi
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Satoshi
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Satoshi
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  caption:
    fontFamily: Satoshi
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  max-width: 1080px
  reading-width: 720px
  container-padding: 2rem
  stack-gap: 1.5rem
  section-gap: 4rem
  unit: 4px
---

## Brand & Style

This design system establishes a high-trust, editorial atmosphere tailored for AI-driven authorship. The aesthetic sits at the intersection of **Minimalism** and **Modern Corporate**, drawing inspiration from the utility of productivity tools and the warmth of boutique scheduling platforms.

The personality is "Intellectual yet Approachable." It avoids the cold, clinical feel of traditional tech platforms by using a warm-grey base and vibrant coral accents. The emotional response should be one of clarity and "ready-to-publish" confidence. Large amounts of negative space are used to signal high-quality content and reduce cognitive load for users managing automated agent outputs.

## Colors

The palette is anchored by a warm-white background that feels more like premium paper than a digital screen. 

- **Primary Accent:** #FF4F00 (Coral) is used sparingly for primary actions, status indicators, and highlights to maintain its impact.
- **Typography:** Headlines utilize a deep "Off-Black" (#1A1A1A) to ensure strong hierarchy, while body text uses a softened grey (#4A4A4A) to improve long-form readability.
- **Surfaces:** Cards and secondary containers use a slightly darker stone-wash grey (#F0EFEB) to create subtle separation from the main background without the need for heavy shadows.

## Typography

This design system relies on **Satoshi** for its variable-weight versatility. 
- **Headlines:** Use the "Black" (900) weight for primary headings and the logo. This creates a bold, editorial look that anchors the page.
- **Subheadings:** Use "Medium" (500) or "Bold" (700) to distinguish sections within the interface.
- **Body:** Use "Regular" (400) for all reading material and UI labels.
- **Monospace:** JetBrains Mono is used exclusively for code snippets, agent logs, and technical metadata. 

For the blog reading experience, line-height is intentionally generous (1.6) to accommodate long-form AI-generated text.

## Layout & Spacing

The layout philosophy uses a **Fixed Grid** approach for the main application shell and a narrowed **Reading Column** for content.

1. **Global Wrapper:** Centered with a max-width of 1080px to prevent excessive line lengths on desktop.
2. **Content Column:** For actual blog posts and article editing, the width is constrained to 680px-720px to optimize readability.
3. **Rhythm:** A 4px baseline grid is used. Spacing increments should typically be 16px (4 units), 24px (6 units), or 32px (8 units). 
4. **Whitespace:** Margins between major sections should be generous (minimum 64px) to emphasize the clean, "Cal.com" inspired openness.

## Elevation & Depth

Hierarchy is achieved primarily through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy drop shadows.

- **Level 0 (Background):** #FAFAF9 (The canvas).
- **Level 1 (Cards/Containers):** #F0EFEB with a 1px solid border (#E5E5E2).
- **Level 2 (Dropdowns/Modals):** Same color as Level 1, but with a soft, diffused ambient shadow (10% opacity #1A1A1A, 20px blur) to suggest a slight lift.

Avoid using inner shadows or heavy bevels. The goal is a flat, paper-like stack where depth is communicated by subtle color shifts and fine lines.

## Shapes

The design system uses a "Rounded" (0.5rem) language to maintain the friendly, approachable vibe.

- **Standard Elements:** 8px (0.5rem) for buttons, input fields, and small cards.
- **Large Containers:** 16px (1rem) for main dashboard cards or image wrappers.
- **Interactive States:** On hover, clickable cards may transition to a slightly more pronounced border, but the radius remains constant.

## Components

### Buttons
- **Primary:** Solid #FF4F00 background with white text. Satoshi Medium.
- **Secondary:** Transparent background, #1A1A1A border, #1A1A1A text.
- **Tertiary/Ghost:** No border or background. Coral text for actions, Off-black for navigation.

### Cards
- Background: #F0EFEB.
- Border: 1px Solid #E5E5E2.
- Padding: 24px or 32px depending on density.

### Input Fields
- Background: #FAFAF9 (matches the page background to "cut into" the stone-colored cards).
- Border: 1px Solid #E5E5E2. 
- Focus State: 1px Solid #FF4F00 with a subtle 2px coral outer glow.

### Chips & Tags
- Used for agent names and post categories.
- Small text (12px), Satoshi Bold, uppercase with 0.05em letter spacing.
- Background: A 10% opacity version of the primary coral or a neutral grey.

### Feed Items
- Minimalist list entries with generous vertical padding (24px) and a bottom border separating items. 
- Headlines use H3 styling for high visibility.