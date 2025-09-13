# MOBILE DEVELOPMENT RULES - ARMORA SECURITY TRANSPORT

## CRITICAL LAYOUT RULES

### FOOTER VISIBILITY RULE
🚨 **NEVER DESIGN ANYTHING THAT CUTS OFF THE FOOTER**
- Footer "Government-Licensed & Certified Operations" MUST ALWAYS be visible
- Use `max-height: 100vh` and `overflow: hidden` on main containers
- Test on 568px height (iPhone SE) as minimum
- Use `justify-content: space-between` to distribute content properly

### VIEWPORT MANAGEMENT
- All content must fit in 100vh without scrolling
- Use compressed spacing when needed: `var(--space-1)` to `var(--space-3)`
- Mobile-first: 320px minimum width support
- NO horizontal scrolling ever

### TOUCH INTERACTION RULES
- Minimum 44px touch targets for all interactive elements
- Remove hover effects on non-clickable elements
- Use slide/fade animations instead of hover for visual interest
- Only use hover effects when element leads to another screen/action

### ANIMATION GUIDELINES
- Prefer slide, fade, or scale animations over hover effects
- Use staggered animations with 0.1-0.2s delays for lists
- Keep animation duration under 0.5s for responsiveness
- Always test animations on low-end devices

## SPACING HIERARCHY

### Standard Spacing Variables
- `var(--space-1)`: 4px - Tight spacing
- `var(--space-2)`: 8px - Small spacing
- `var(--space-3)`: 12px - Medium spacing
- `var(--space-4)`: 16px - Large spacing
- `var(--space-5)`: 24px - Extra large (use sparingly)

### Compressed Spacing (When Footer At Risk)
- Reduce all margins by 50%
- Use `clamp()` functions for responsive scaling
- Prioritize footer visibility over generous spacing

## TEXT OPTIMIZATION

### Single-Line Rules
- Use `white-space: nowrap` for critical text
- Implement `text-overflow: ellipsis` for overflow
- Constrain width with `max-width` to force single lines
- Test text at 320px width minimum

### Font Size Guidelines
- Titles: 0.8rem - 0.9rem maximum
- Descriptions: 0.7rem - 0.75rem maximum
- Footer links: 0.75rem - 0.8rem maximum

## LAYOUT PATTERNS

### Horizontal Icon + Text Layout
```css
.feature-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--space-3);
}
```

### Vertical Spacing Distribution
```css
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  max-height: 100vh;
}
```

## MANDATORY TESTING CHECKLIST

### Before Any Layout Change
- [ ] Footer visible on iPhone SE (568px height)
- [ ] No horizontal scrolling at 320px width
- [ ] All touch targets minimum 44px
- [ ] Animations under 0.5s duration
- [ ] Single-line text doesn't break layout

### Responsive Breakpoints (Test All)
- 320px x 568px (iPhone SE)
- 375px x 667px (iPhone 8)
- 414px x 896px (iPhone 11)
- 768px x 1024px (iPad)

## ANIMATION BEST PRACTICES

### Preferred Animation Types
1. **Slide In**: `translateX()` or `translateY()`
2. **Fade In**: `opacity` transitions
3. **Scale**: `scale()` for emphasis
4. **Stagger**: Delayed animations for lists

### Avoid These Effects
- ❌ Complex 3D transforms
- ❌ Multiple simultaneous animations
- ❌ Hover effects on non-interactive elements
- ❌ Long animation durations (>0.5s)

## EMERGENCY FIXES

### If Footer Gets Cut Off
1. Add `max-height: 100vh` to main container
2. Add `overflow: hidden` to prevent scrolling
3. Use `justify-content: space-between` for distribution
4. Compress spacing using smaller variables

### If Content Overflows Horizontally
1. Check all fixed widths and change to percentages
2. Add `max-width: 100%` to all content containers
3. Use `overflow-wrap: break-word` for long text
4. Test at 320px width minimum

---

*Last updated: 2025-09-13T21:40:17.292Z
*These rules are mandatory for all Armora mobile development*