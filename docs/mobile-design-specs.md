# 📱 Armora Mobile Design Specifications

## Design System Overview

Armora's design system is built for premium security service delivery on mobile devices, emphasizing trust, professionalism, and ease of use.

## Core Design Principles

1. **Mobile-First**: Every design decision starts at 320px width
2. **Touch-Optimized**: All interactions designed for thumb reach
3. **Premium Feel**: Dark theme with golden accents conveys luxury
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Lightweight, fast-loading components

## Color Palette

### Primary Colors
- **Navy Background**: #1a1a2e (main background)
- **Gold Accent**: #FFD700 (CTAs, highlights)
- **White Text**: #FFFFFF (primary text)
- **Light Gray**: #e0e0e0 (secondary text)

### Semantic Colors
- **Success**: #4CAF50
- **Error**: #F44336
- **Warning**: #FF9800
- **Info**: #2196F3

### Gradients
- **Premium Gradient**: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)
- **Gold Gradient**: linear-gradient(135deg, #FFD700 0%, #FFA500 100%)

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
```

### Type Scale (Mobile)
- **Hero**: 2.5rem (40px)
- **H1**: 2rem (32px)
- **H2**: 1.75rem (28px)
- **H3**: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

### Line Heights
- **Headings**: 1.2
- **Body**: 1.5
- **Compact**: 1.3

## Spacing System

8px grid with consistent spacing tokens:

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

## Layout Grid

### Mobile (320px - 768px)
- **Columns**: 4
- **Gutter**: 16px
- **Margin**: 16px

### Tablet (768px - 1024px)
- **Columns**: 8
- **Gutter**: 24px
- **Margin**: 24px

### Desktop (1024px+)
- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 32px
- **Max Width**: 1280px

## Component Specifications

### Buttons
- **Min Height**: 48px (mobile), 44px (desktop)
- **Min Width**: 120px
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Font Size**: 1rem (16px)
- **Font Weight**: 600

### Input Fields
- **Height**: 48px
- **Padding**: 12px 16px
- **Border**: 2px solid
- **Border Radius**: 8px
- **Font Size**: 1rem (16px)

### Cards
- **Padding**: 16px
- **Border Radius**: 12px
- **Shadow**: 0 4px 6px rgba(0,0,0,0.1)
- **Border**: 2px solid rgba(255,215,0,0.2)

### Navigation
- **Header Height**: 64px
- **Tab Bar Height**: 56px
- **Drawer Width**: 280px

## Touch Targets

Minimum touch target sizes:
- **Primary Actions**: 48x48px
- **Secondary Actions**: 44x44px
- **Icons**: 24x24px with 44x44px tap area
- **Links**: 44px minimum height

## Animation & Motion

### Timing Functions
- **Ease Out**: cubic-bezier(0.0, 0, 0.2, 1)
- **Ease In Out**: cubic-bezier(0.4, 0, 0.2, 1)
- **Sharp**: cubic-bezier(0.4, 0, 0.6, 1)

### Duration
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (transitions)
- **Slow**: 500ms (complex animations)

### Common Animations
- **Fade In**: opacity 0 to 1, 300ms
- **Slide Up**: translateY(20px) to 0, 300ms
- **Scale**: scale(0.95) to 1, 150ms

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 480px) { /* Large phones */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

## Accessibility Guidelines

1. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus Indicators**: Visible focus states on all interactive elements
3. **Touch Targets**: Minimum 44x44px
4. **Text Size**: User scalable, minimum 16px
5. **ARIA Labels**: All interactive elements properly labeled
6. **Keyboard Navigation**: Full keyboard support

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB gzipped

## Platform-Specific Considerations

### iOS
- Respect safe areas (notch, home indicator)
- Use native-style components where appropriate
- Support dark mode
- Haptic feedback for important actions

### Android
- Material Design influences
- Support for system-wide dark theme
- Back button handling
- Edge-to-edge display support

## Logo & Branding

### Armora Logo Variations
- **Hero**: 200x200px (splash screen)
- **Large**: 120x120px (welcome page)
- **Medium**: 80x80px (headers)
- **Small**: 40x40px (compact views)

### Logo Usage Rules
- Always maintain aspect ratio
- Minimum clear space: 0.5x logo height
- Use on dark backgrounds only
- Include 4D animation effects on hero/large sizes

---

Last updated: 2025-09-25T20:57:51.353Z
