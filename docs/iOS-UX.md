# iOS UX Guidelines - Armora Security Transport

## iOS-First Development Standards

### Critical iOS Compatibility Requirements

#### iPhone Screen Size Support (iOS Priority)
- **320px minimum width** - iPhone SE (1st gen), older iPhones
- **375px** - iPhone 6/7/8, iPhone SE (2nd/3rd gen) baseline
- **390px** - iPhone 12 mini, iPhone 13 mini
- **393px** - iPhone 14/15 standard sizes
- **414px** - iPhone 6/7/8 Plus, iPhone XR/11
- **428px** - iPhone 12/13/14/15 Pro Max
- **768px+** - iPad screens
- **NO HORIZONTAL SCROLLING** at any width - critical for iOS users

#### iOS-Specific Touch Standards
- **44pt minimum** touch targets (iOS Human Interface Guidelines)
- **8pt spacing** between interactive elements
- **Safe Area respect** - iPhone X+ notch and Dynamic Island
- **iOS gestures** - swipe back, pull-to-refresh, 3D Touch/Haptic Touch
- **Scroll behavior** - iOS momentum scrolling and bounce

#### iOS Browser Compatibility
- **Safari Mobile** (primary) - Default iOS browser
- **Chrome iOS** - Popular alternative (WebKit engine)
- **Firefox iOS** - Privacy-focused (WebKit engine)
- **PWA support** - Add to Home Screen via Safari

### iOS Safe Area Handling

#### Safe Area Implementation
```css
/* iOS safe area optimization */
.ios-safe-area {
  /* Top safe area - handles notch and Dynamic Island */
  padding-top: max(20px, env(safe-area-inset-top));
  
  /* Bottom safe area - handles home indicator */
  padding-bottom: max(20px, env(safe-area-inset-bottom));
  
  /* Side safe areas - handles rounded corners */
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
}

/* iPhone X+ specific handling */
@supports (padding: max(0px)) {
  .ios-header {
    padding-top: max(44px, env(safe-area-inset-top));
  }
  
  .ios-footer {
    padding-bottom: max(34px, env(safe-area-inset-bottom));
  }
}

/* Dynamic Island avoidance */
@media (max-width: 430px) and (min-height: 800px) {
  .ios-top-content {
    margin-top: max(44px, env(safe-area-inset-top));
  }
}
```

#### iOS Device Categories

#### iPhone SE / Mini (320px - 375px)
- **Priority**: Essential features only, compact layout
- **Layout**: Single column, minimal content per screen
- **Navigation**: Tab bar (49pt height standard)
- **Typography**: 17pt minimum for iOS readability standards

#### Standard iPhones (375px - 393px)
- **Priority**: Primary target for iPhone users
- **Layout**: Comfortable single-column with some dual-column cards
- **Navigation**: Tab bar + navigation bar standard
- **Typography**: iOS text styles (Large Text accessibility support)

#### Plus/Pro iPhones (414px - 428px)
- **Priority**: Premium iPhone experience
- **Layout**: Enhanced content density, dual-column where appropriate  
- **Navigation**: Split view capabilities, enhanced navigation
- **Typography**: Full iOS type scale available

#### iPad (768px+)
- **Priority**: Enhanced tablet experience
- **Layout**: Multi-column, desktop-class features
- **Navigation**: Split view, slide over, multitasking support
- **Typography**: iPad-specific sizing and spacing

### iOS-Specific Interaction Patterns

#### iOS Navigation Patterns
```css
/* iOS navigation standards */
.ios-navigation {
  height: 44pt; /* iOS standard navigation height */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px); /* iOS frosted glass */
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
}

.ios-tab-bar {
  height: 49pt; /* iOS standard tab bar height */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-top: 0.5px solid rgba(0, 0, 0, 0.3);
  padding-bottom: env(safe-area-inset-bottom);
}

/* iOS back button */
.ios-back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--armora-gold);
  font-size: 17px;
  font-weight: 400;
}

.ios-back-button::before {
  content: '‹';
  font-size: 24px;
  font-weight: 300;
}
```

#### iOS Gesture Support
```css
/* iOS momentum scrolling */
.ios-scroll-container {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
}

/* iOS pull-to-refresh */
.ios-pull-refresh {
  transform: translateY(var(--pull-distance, 0px));
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* iOS swipe-back gesture */
.ios-swipe-back {
  touch-action: pan-x;
  user-select: none;
}
```

### iOS Human Interface Guidelines Integration

#### iOS Typography System
```css
/* iOS text styles integration */
:root {
  /* iOS system font stack */
  --font-ios-primary: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  --font-ios-secondary: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  --font-ios-monospace: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

/* iOS text style hierarchy */
.ios-large-title {
  font-size: clamp(28px, 8vw, 34px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.ios-title-1 {
  font-size: clamp(24px, 6vw, 28px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.ios-title-2 {
  font-size: clamp(20px, 5vw, 22px);
  font-weight: 700;
  line-height: 1.2;
}

.ios-title-3 {
  font-size: clamp(18px, 4.5vw, 20px);
  font-weight: 600;
  line-height: 1.25;
}

.ios-headline {
  font-size: clamp(15px, 4vw, 17px);
  font-weight: 600;
  line-height: 1.3;
}

.ios-body {
  font-size: clamp(15px, 4vw, 17px);
  font-weight: 400;
  line-height: 1.4;
}

.ios-callout {
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 400;
  line-height: 1.35;
}

.ios-subhead {
  font-size: clamp(13px, 3.25vw, 15px);
  font-weight: 400;
  line-height: 1.35;
}

.ios-footnote {
  font-size: clamp(12px, 3vw, 13px);
  font-weight: 400;
  line-height: 1.35;
}

.ios-caption-1 {
  font-size: clamp(11px, 2.75vw, 12px);
  font-weight: 400;
  line-height: 1.35;
}

.ios-caption-2 {
  font-size: clamp(10px, 2.5vw, 11px);
  font-weight: 400;
  line-height: 1.35;
}
```

#### iOS Color Integration
```css
/* iOS semantic colors adaptation */
:root {
  /* iOS system colors integration */
  --ios-system-blue: #007AFF;
  --ios-system-green: #34C759;
  --ios-system-red: #FF3B30;
  --ios-system-orange: #FF9500;
  --ios-system-yellow: #FFCC00;
  
  /* Dark mode support */
  --ios-label: #000000;
  --ios-secondary-label: rgba(60, 60, 67, 0.6);
  --ios-tertiary-label: rgba(60, 60, 67, 0.3);
  --ios-separator: rgba(60, 60, 67, 0.29);
  --ios-background: #FFFFFF;
  --ios-secondary-background: #F2F2F7;
  --ios-tertiary-background: #FFFFFF;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ios-label: #FFFFFF;
    --ios-secondary-label: rgba(235, 235, 245, 0.6);
    --ios-tertiary-label: rgba(235, 235, 245, 0.3);
    --ios-separator: rgba(84, 84, 88, 0.65);
    --ios-background: #000000;
    --ios-secondary-background: #1C1C1E;
    --ios-tertiary-background: #2C2C2E;
  }
}

/* Armora colors adapted for iOS */
.ios-theme {
  --primary-ios: var(--armora-dark);
  --accent-ios: var(--armora-gold);
  --background-ios: var(--ios-background);
  --surface-ios: var(--ios-secondary-background);
  --text-primary-ios: var(--ios-label);
  --text-secondary-ios: var(--ios-secondary-label);
}
```

### iOS Component Adaptations

#### iOS-Style Buttons
```css
/* iOS button system */
.ios-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44pt;
  padding: 12px 20px;
  border-radius: 10px;
  font-family: var(--font-ios-primary);
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* iOS tap highlight */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* iOS primary button */
.ios-button-primary {
  background: linear-gradient(135deg, var(--armora-gold) 0%, #ffed4a 100%);
  color: var(--armora-dark);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.ios-button-primary:active {
  transform: scale(0.98);
  opacity: 0.8;
}

/* iOS secondary button */
.ios-button-secondary {
  background: var(--ios-tertiary-background);
  color: var(--armora-gold);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

/* iOS destructive button */
.ios-button-destructive {
  background: var(--ios-system-red);
  color: white;
}

/* iOS plain button */
.ios-button-plain {
  background: transparent;
  color: var(--armora-gold);
  font-weight: 400;
  min-height: 44pt;
}

/* iOS segmented control */
.ios-segmented-control {
  display: flex;
  background: var(--ios-tertiary-background);
  border-radius: 8px;
  padding: 2px;
  margin: 16px 0;
}

.ios-segment {
  flex: 1;
  padding: 8px 16px;
  text-align: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 15px;
  font-weight: 400;
}

.ios-segment.selected {
  background: white;
  color: var(--ios-label);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

#### iOS Form Elements
```css
/* iOS form styling */
.ios-input {
  width: 100%;
  min-height: 44pt;
  padding: 12px 16px;
  background: var(--ios-tertiary-background);
  border: 1px solid var(--ios-separator);
  border-radius: 10px;
  color: var(--ios-label);
  font-family: var(--font-ios-secondary);
  font-size: 17px;
  transition: all 0.2s ease;
  
  /* iOS appearance */
  -webkit-appearance: none;
  appearance: none;
}

.ios-input:focus {
  outline: none;
  border-color: var(--armora-gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.ios-input::placeholder {
  color: var(--ios-tertiary-label);
}

/* iOS form sections */
.ios-form-section {
  background: var(--ios-secondary-background);
  border-radius: 10px;
  margin: 16px 0;
  overflow: hidden;
}

.ios-form-row {
  padding: 12px 16px;
  border-bottom: 1px solid var(--ios-separator);
  display: flex;
  align-items: center;
  min-height: 44pt;
}

.ios-form-row:last-child {
  border-bottom: none;
}

.ios-form-label {
  font-size: 17px;
  color: var(--ios-label);
  margin-right: 16px;
  min-width: 100px;
}

.ios-form-value {
  flex: 1;
  text-align: right;
  color: var(--ios-secondary-label);
  font-size: 17px;
}
```

#### iOS List/Table Views
```css
/* iOS table view styling */
.ios-table-view {
  background: var(--ios-background);
  border-radius: 10px;
  overflow: hidden;
  margin: 16px 0;
}

.ios-table-row {
  background: var(--ios-secondary-background);
  border-bottom: 1px solid var(--ios-separator);
  padding: 12px 16px;
  min-height: 44pt;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.ios-table-row:last-child {
  border-bottom: none;
}

.ios-table-row:active {
  background: var(--ios-tertiary-background);
}

.ios-table-cell-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.ios-table-cell-title {
  font-size: 17px;
  color: var(--ios-label);
  font-weight: 400;
}

.ios-table-cell-subtitle {
  font-size: 15px;
  color: var(--ios-secondary-label);
  margin-top: 2px;
}

.ios-table-cell-detail {
  color: var(--ios-secondary-label);
  font-size: 17px;
  margin-left: auto;
}

.ios-table-cell-accessory {
  margin-left: 8px;
  color: var(--ios-tertiary-label);
  font-size: 14px;
}

.ios-table-cell-accessory::after {
  content: '›';
}
```

### iOS Accessibility Standards

#### VoiceOver Support
```css
/* VoiceOver optimization */
.ios-voiceover-focus {
  outline: 3px solid var(--ios-system-blue);
  outline-offset: 2px;
  border-radius: 6px;
}

/* Screen reader specific content */
.ios-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### iOS Accessibility Implementation
```typescript
// iOS accessibility attributes
interface iOSAccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  role?: 'button' | 'link' | 'heading' | 'banner' | 'main' | 'navigation';
  tabIndex?: number;
}

// iOS VoiceOver announcements
const announceToVoiceOver = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'ios-sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
```

### iOS Performance Optimization

#### iOS-Specific Optimizations
```css
/* iOS performance optimization */
.ios-performance-optimized {
  /* Use transform and opacity for animations */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  
  /* Optimize for iOS Safari */
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000px;
}

/* iOS smooth scrolling */
.ios-smooth-scroll {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* iOS 60fps animations */
@keyframes ios-slide-in {
  from {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.ios-slide-animation {
  animation: ios-slide-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

#### iOS Memory Management
```typescript
// iOS-specific performance considerations
const iOSPerformanceOptimization = {
  // Optimize for iOS Safari memory constraints
  cleanupEventListeners: () => {
    // Remove event listeners when components unmount
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('resize', handleResize);
  },
  
  // Optimize images for iOS
  optimizeImagesForIOS: () => {
    // Use appropriate image formats
    // WebP with JPEG fallback for older iOS versions
  },
  
  // Handle iOS Safari viewport quirks
  handleiOSViewport: () => {
    // Fix iOS Safari 100vh issues
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
};
```

### PWA Integration for iOS

#### iOS PWA Manifest
```json
{
  "name": "Armora Security Transport",
  "short_name": "Armora",
  "description": "Premium VIP security transport service",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "orientation": "portrait-primary",
  "apple-mobile-web-app-capable": "yes",
  "apple-mobile-web-app-status-bar-style": "black-translucent",
  "apple-mobile-web-app-title": "Armora",
  "categories": ["travel", "business"],
  "icons": [
    {
      "src": "apple-touch-icon-57x57.png",
      "sizes": "57x57",
      "type": "image/png"
    },
    {
      "src": "apple-touch-icon-114x114.png",
      "sizes": "114x114",
      "type": "image/png"
    },
    {
      "src": "apple-touch-icon-180x180.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ]
}
```

#### iOS Safari PWA Features
```html
<!-- iOS PWA meta tags -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Armora">

<!-- iOS splash screens -->
<link rel="apple-touch-startup-image" 
      href="splash-iphone-se.png" 
      media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" 
      href="splash-iphone-6-7-8.png" 
      media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
<link rel="apple-touch-startup-image" 
      href="splash-iphone-x-11-12.png" 
      media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">
```

### iOS Testing Requirements

#### iOS Device Testing Matrix
1. **iPhone SE (3rd gen)** - iOS 15+ (320px/375px)
2. **iPhone 13 mini** - iOS 15+ (375px/390px) 
3. **iPhone 13/14** - iOS 16+ (375px/390px)
4. **iPhone 13/14 Pro** - iOS 16+ (390px/393px)
5. **iPhone 13/14 Pro Max** - iOS 16+ (414px/428px)
6. **iPad Air** - iOS 15+ (768px+)
7. **iPad Pro** - iOS 15+ (1024px+)

#### iOS Testing Checklist
- [ ] Safari Mobile compatibility
- [ ] PWA installation via "Add to Home Screen"
- [ ] Safe area handling (notch, Dynamic Island, home indicator)
- [ ] iOS gesture navigation compatibility
- [ ] VoiceOver screen reader functionality
- [ ] Dark mode and light mode support
- [ ] iOS text size accessibility (Dynamic Type)
- [ ] Performance on older iOS devices

---

**Key iOS Principles:**
1. **iOS-Native Feel**: Human Interface Guidelines compliance
2. **Safe Area Respect**: Proper handling of notch and Dynamic Island
3. **iOS Typography**: SF Pro font integration and iOS text styles
4. **Accessibility**: VoiceOver and iOS accessibility features
5. **Performance**: Optimized for iOS Safari engine limitations
6. **PWA Integration**: Full iOS Progressive Web App support

**Last Updated**: 2025-09-08
**Compatibility**: iOS 13+, Safari 13+, PWA-ready for iOS home screen

---

Last updated: 2025-09-20T16:50:52.155Z
