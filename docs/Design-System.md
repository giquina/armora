# Design System - Armora Security Transport

## Android-First Design Standards

### Color System (Cross-Device Optimized)

#### Primary Color Palette
```css
:root {
  /* Core Brand Colors - Optimized for OLED Android displays */
  --armora-dark: #1a1a2e;      /* Primary background - deep contrast */
  --armora-gold: #FFD700;       /* Premium accent - high visibility */
  --armora-light-gray: #e0e0e0; /* Primary text - optimal contrast ratio */
  --armora-medium-gray: #8e8e93; /* Secondary text - accessible */
  --armora-border: #2c2c54;     /* Subtle borders - visible on dark */
  
  /* Semantic Colors */
  --armora-success: #34C759;    /* Success states - Android green standard */
  --armora-warning: #FF9500;    /* Warning states - high visibility orange */
  --armora-error: #FF3B30;      /* Error states - critical red */
  --armora-info: #007AFF;       /* Info states - accessible blue */
  
  /* Surface Colors - Layered UI depth */
  --armora-surface-primary: #1a1a2e;
  --armora-surface-secondary: #16213e;
  --armora-surface-tertiary: #0f3460;
  --armora-surface-overlay: rgba(26, 26, 46, 0.95);
  
  /* Interactive States - Touch feedback optimized */
  --armora-hover: rgba(255, 215, 0, 0.1);
  --armora-active: rgba(255, 215, 0, 0.2);
  --armora-focus: rgba(255, 215, 0, 0.3);
  --armora-disabled: rgba(224, 224, 224, 0.3);
}

/* Android Dark Theme Support */
@media (prefers-color-scheme: dark) {
  :root {
    --armora-text-primary: #ffffff;
    --armora-text-secondary: #b3b3b3;
    --armora-surface-primary: #000000;
  }
}
```

#### Color Usage Guidelines
- **Primary Actions**: Always use `--armora-gold` for primary buttons and CTAs
- **Text Hierarchy**: Use `--armora-light-gray` for primary, `--armora-medium-gray` for secondary
- **Error States**: `--armora-error` for validation errors and critical alerts
- **Success States**: `--armora-success` for confirmations and completed actions
- **Android Compatibility**: All colors tested on Samsung OLED and standard LCD displays

### Typography System (Mobile-Optimized)

#### Font Stack
```css
/* Android-optimized font hierarchy */
:root {
  --font-primary: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-secondary: 'SF Pro Display', 'Roboto', system-ui, sans-serif;
  --font-monospace: 'SF Mono', 'Roboto Mono', 'Consolas', monospace;
}

/* Typography Scale - Optimized for 320px+ screens */
.text-display-large {
  font-size: clamp(2rem, 5vw, 3.5rem);     /* 32px-56px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-display-medium {
  font-size: clamp(1.75rem, 4vw, 2.875rem); /* 28px-46px */
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-headline-large {
  font-size: clamp(1.5rem, 3.5vw, 2rem);    /* 24px-32px */
  font-weight: 600;
  line-height: 1.25;
}

.text-headline-medium {
  font-size: clamp(1.25rem, 3vw, 1.5rem);   /* 20px-24px */
  font-weight: 500;
  line-height: 1.3;
}

.text-body-large {
  font-size: clamp(1rem, 2.5vw, 1.125rem);  /* 16px-18px */
  font-weight: 400;
  line-height: 1.5;
}

.text-body-medium {
  font-size: clamp(0.875rem, 2.25vw, 1rem); /* 14px-16px */
  font-weight: 400;
  line-height: 1.4;
}

.text-body-small {
  font-size: clamp(0.75rem, 2vw, 0.875rem); /* 12px-14px */
  font-weight: 400;
  line-height: 1.4;
}

.text-label-large {
  font-size: clamp(0.875rem, 2.25vw, 1rem); /* 14px-16px */
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.01em;
}

.text-label-medium {
  font-size: clamp(0.75rem, 2vw, 0.875rem); /* 12px-14px */
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.01em;
}
```

#### Typography Usage
- **Display Text**: Hero sections, splash screens (display-large)
- **Headlines**: Page titles, section headers (headline-large/medium)
- **Body Text**: Primary content, descriptions (body-large/medium)
- **Labels**: Form labels, button text (label-large/medium)
- **Captions**: Helper text, timestamps (body-small)

### Spacing System (Touch-Optimized)

#### Base Spacing Units
```css
:root {
  /* 4px base unit - Android Material Design standard */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px - minimum touch spacing */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px - standard margin */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px - comfortable spacing */
  --space-8: 2rem;     /* 32px - section spacing */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px - minimum touch target */
  --space-16: 4rem;    /* 64px - large spacing */
  --space-20: 5rem;    /* 80px - hero spacing */
}

/* Component-specific spacing */
.spacing-touch-target {
  min-height: var(--space-12); /* 48px minimum for Android */
  min-width: var(--space-12);
  padding: var(--space-2) var(--space-4);
}

.spacing-form-field {
  margin-bottom: var(--space-6);
}

.spacing-section {
  padding: var(--space-8) var(--space-4);
}

.spacing-page {
  padding: var(--space-4);
}

/* Safe area support for Android notch/gesture areas */
.spacing-safe-area {
  padding-top: max(var(--space-4), env(safe-area-inset-top));
  padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
  padding-left: max(var(--space-4), env(safe-area-inset-left));
  padding-right: max(var(--space-4), env(safe-area-inset-right));
}
```

### Component System

#### Button Variants (Touch-Optimized)
```css
/* Base button - Android Material Design inspired */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px; /* Android accessibility standard */
  padding: 12px 24px;
  border: none;
  border-radius: 24px; /* Pill shape for modern feel */
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  /* Touch feedback */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* Primary button - Main actions */
.btn-primary {
  background: linear-gradient(135deg, var(--armora-gold) 0%, #ffed4a 100%);
  color: var(--armora-dark);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.btn-primary:hover,
.btn-primary:focus {
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

/* Secondary button - Secondary actions */
.btn-secondary {
  background: transparent;
  color: var(--armora-light-gray);
  border: 2px solid var(--armora-border);
}

.btn-secondary:hover,
.btn-secondary:focus {
  border-color: var(--armora-gold);
  color: var(--armora-gold);
}

/* Ghost button - Subtle actions */
.btn-ghost {
  background: transparent;
  color: var(--armora-medium-gray);
  border: none;
  padding: 8px 16px;
  min-height: 40px;
}

.btn-ghost:hover,
.btn-ghost:focus {
  color: var(--armora-light-gray);
  background: var(--armora-hover);
}

/* Danger button - Destructive actions */
.btn-danger {
  background: var(--armora-error);
  color: white;
}

.btn-danger:hover,
.btn-danger:focus {
  background: #d70015;
}

/* Button sizes */
.btn-small {
  min-height: 40px;
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn-large {
  min-height: 56px;
  padding: 16px 32px;
  font-size: 1.125rem;
}

/* Full-width button for mobile */
.btn-full-width {
  width: 100%;
  justify-content: center;
}

/* Loading state */
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
```

#### Form Input Components
```css
/* Input field - Mobile-optimized */
.input {
  width: 100%;
  min-height: 48px; /* Android touch target */
  padding: 12px 16px;
  background: var(--armora-surface-secondary);
  border: 2px solid var(--armora-border);
  border-radius: 8px;
  color: var(--armora-light-gray);
  font-family: var(--font-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
  
  /* Android keyboard optimization */
  -webkit-appearance: none;
  appearance: none;
}

.input:focus {
  outline: none;
  border-color: var(--armora-gold);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.input::placeholder {
  color: var(--armora-medium-gray);
}

.input-error {
  border-color: var(--armora-error);
}

.input-error:focus {
  border-color: var(--armora-error);
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
}

/* Select dropdown */
.select {
  position: relative;
  width: 100%;
}

.select select {
  width: 100%;
  min-height: 48px;
  padding: 12px 40px 12px 16px;
  background: var(--armora-surface-secondary);
  border: 2px solid var(--armora-border);
  border-radius: 8px;
  color: var(--armora-light-gray);
  font-family: var(--font-primary);
  font-size: 1rem;
  cursor: pointer;
  
  /* Remove default styling */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select::after {
  content: '▼';
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: var(--armora-medium-gray);
  pointer-events: none;
  font-size: 0.75rem;
}
```

#### Card Component
```css
.card {
  background: var(--armora-surface-secondary);
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  /* Android Material Design elevation */
  position: relative;
  overflow: hidden;
}

.card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--armora-border);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--armora-light-gray);
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: var(--armora-medium-gray);
  margin: 0;
  margin-top: var(--space-1);
}

.card-body {
  color: var(--armora-light-gray);
  line-height: 1.5;
}

.card-footer {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--armora-border);
}

/* Interactive card for touch */
.card-interactive {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.card-interactive:active {
  transform: scale(0.98);
}
```

### Animation System (60fps Optimized)

#### Core Animations
```css
/* Smooth transitions - GPU optimized */
:root {
  --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  
  --duration-short: 150ms;
  --duration-medium: 250ms;
  --duration-long: 400ms;
}

/* Page transitions */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Premium micro-interactions */
.animate-in {
  animation: fadeIn var(--duration-medium) var(--easing-standard);
}

.animate-pulse {
  animation: pulse 2s var(--easing-standard) infinite;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    var(--armora-surface-secondary) 0px,
    var(--armora-surface-tertiary) 40px,
    var(--armora-surface-secondary) 80px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s linear infinite;
}
```

### Layout System (Responsive Grid)

#### Container and Grid
```css
/* Container with safe margins */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Responsive breakpoints */
@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-8);
  }
}

/* Flexible grid system */
.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Stack layout for mobile */
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.stack-2 {
  gap: var(--space-2);
}

.stack-6 {
  gap: var(--space-6);
}

.stack-8 {
  gap: var(--space-8);
}

/* Flex utilities */
.flex {
  display: flex;
  gap: var(--space-4);
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}
```

### Android-Specific Optimizations

#### Touch Feedback
```css
/* Ripple effect for Android feel */
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 0.8;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.touch-ripple {
  position: relative;
  overflow: hidden;
}

.touch-ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--armora-gold);
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}

.touch-ripple:active::before {
  width: 200%;
  height: 200%;
  animation: ripple 0.3s ease-out;
}
```

#### Keyboard Optimization
```css
/* Android keyboard handling */
@supports (height: 100dvh) {
  .full-height {
    height: 100dvh;
  }
}

/* Viewport units for Android Chrome */
.keyboard-aware {
  height: calc(100vh - env(keyboard-inset-height, 0px));
  transition: height 0.3s ease;
}

/* Input focus optimization */
.input-focused {
  position: relative;
  z-index: 10;
  transform: translateY(-10px);
  transition: transform 0.2s ease;
}
```

### Accessibility Standards

#### Color Contrast
- **AA Standard**: 4.5:1 for normal text, 3:1 for large text
- **AAA Standard**: 7:1 for normal text, 4.5:1 for large text
- All Armora colors meet AA standards minimum

#### Focus Management
```css
/* Visible focus indicators */
.focus-visible {
  outline: 3px solid var(--armora-gold);
  outline-offset: 2px;
}

/* Skip links for screen readers */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--armora-gold);
  color: var(--armora-dark);
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}
```

---

**Implementation Guidelines:**
1. **Mobile-First**: All components start at 320px width
2. **Touch-Optimized**: 48px minimum touch targets
3. **Performance**: Use transform/opacity for animations
4. **Accessibility**: Proper contrast ratios and focus management
5. **Android PWA**: Optimized for Chrome Mobile and home screen installation

### Authentication Form Styling

#### Authentication Page Layout
```css
/* Full-screen authentication container */
.auth-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: linear-gradient(
    135deg,
    var(--armora-dark) 0%,
    var(--armora-surface-secondary) 50%,
    var(--armora-dark) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2rem);
  padding-top: clamp(2rem, 6vw, 3rem);
}

.auth-container {
  width: 100%;
  max-width: 420px;
  background: rgba(42, 42, 74, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: var(--radius-lg);
  padding: clamp(1.5rem, 6vw, 2.5rem);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 215, 0, 0.1);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
  margin-bottom: clamp(2rem, 6vw, 3rem);
}

.auth-container.visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### Form Input Styling
```css
/* Authentication form inputs */
.auth-form .form-group {
  margin-bottom: clamp(1rem, 4vw, 1.5rem);
}

.auth-form label {
  display: block;
  margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
  font-size: clamp(0.875rem, 3vw, 0.9375rem);
  font-weight: 600;
  color: var(--armora-gold);
  line-height: 1.3;
}

.auth-form input {
  width: 100%;
  min-height: var(--touch-target);
  padding: clamp(0.75rem, 3vw, 1rem);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: clamp(0.9375rem, 3.5vw, 1rem);
  font-family: var(--font-primary);
  transition: all var(--transition-base);
  -webkit-appearance: none;
  appearance: none;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--armora-gold);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.auth-form input.error {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

.auth-form input.error:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}
```

#### Password Input with Toggle
```css
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-container input {
  padding-right: clamp(3rem, 12vw, 4rem);
}

.password-toggle {
  position: absolute;
  right: clamp(0.75rem, 3vw, 1rem);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: clamp(0.25rem, 1vw, 0.5rem);
  font-size: clamp(1rem, 4vw, 1.25rem);
  transition: color var(--transition-base);
  min-height: var(--touch-target);
  min-width: var(--touch-target);
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover,
.password-toggle:focus {
  color: var(--armora-gold);
  outline: none;
}
```

#### Password Strength Indicator
```css
.password-strength {
  margin-top: clamp(0.5rem, 2vw, 0.75rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.25rem, 1vw, 0.5rem);
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-label {
  font-size: clamp(0.75rem, 2.5vw, 0.8125rem);
  font-weight: 500;
  transition: color 0.3s ease;
}

/* Strength level colors */
.strength-very-weak { background-color: #ff4444; }
.strength-weak { background-color: #ff8800; }
.strength-fair { background-color: #ffaa00; }
.strength-good { background-color: #88cc00; }
.strength-strong { background-color: #00aa00; }
```

#### Form Error Display
```css
.auth-error {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: var(--radius-md);
  padding: clamp(0.75rem, 3vw, 1rem);
  margin-bottom: clamp(1rem, 4vw, 1.5rem);
  color: #ff6b6b;
  font-size: clamp(0.8125rem, 3vw, 0.875rem);
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
}

.field-error {
  display: block;
  margin-top: clamp(0.25rem, 1vw, 0.5rem);
  color: #ff6b6b;
  font-size: clamp(0.75rem, 2.5vw, 0.8125rem);
  font-weight: 500;
  line-height: 1.3;
}
```

#### Form Action Buttons
```css
.form-actions {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 4vw, 1.5rem);
  margin-top: clamp(1.5rem, 6vw, 2rem);
}

.auth-form .btn-primary {
  background: var(--armora-gold) !important;
  color: var(--armora-dark) !important;
  border: none !important;
  position: relative;
  overflow: hidden;
}

.auth-form .btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.auth-form .btn-primary:hover::before {
  left: 100%;
}

.auth-form .btn-primary:hover {
  background: var(--hover-gold) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3) !important;
}

.auth-form .btn-secondary {
  border: 2px solid rgba(255, 215, 0, 0.3) !important;
  background: rgba(255, 215, 0, 0.05) !important;
  color: var(--armora-gold) !important;
}

.auth-form .btn-secondary:hover {
  background: rgba(255, 215, 0, 0.1) !important;
  border-color: var(--armora-gold) !important;
  transform: translateY(-1px);
}
```

#### Remember Me & Additional Options
```css
.form-options {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 3vw, 1rem);
  margin: clamp(1rem, 4vw, 1.5rem) 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  cursor: pointer;
}

.checkbox-container input[type="checkbox"] {
  width: auto;
  min-height: auto;
  margin: 0;
  transform: scale(1.2);
  accent-color: var(--armora-gold);
}

.checkbox-container label {
  margin: 0;
  color: var(--text-secondary);
  font-size: clamp(0.8125rem, 3vw, 0.875rem);
  line-height: 1.4;
  cursor: pointer;
}

.form-link {
  color: var(--armora-gold);
  text-decoration: none;
  font-size: clamp(0.8125rem, 3vw, 0.875rem);
  font-weight: 500;
  text-align: center;
  transition: color var(--transition-base);
}

.form-link:hover,
.form-link:focus {
  color: var(--hover-gold);
  text-decoration: underline;
}
```

**Last Updated**: 2025-09-08 - Added authentication form styling patterns
**Compatibility**: Android 6.0+, Chrome 88+, Modern browsers

---

Last updated: 2025-09-19T15:26:32.456Z
