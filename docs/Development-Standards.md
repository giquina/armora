# Development Standards - Armora Security Transport

## Android-First Development Methodology

### Core Development Principles

#### Mobile-First Approach
1. **Start at 320px width** - Android Go devices and older smartphones
2. **Progressive Enhancement** - Build up from smallest screen
3. **Touch-First Interactions** - Designed for finger navigation
4. **Thumb-Friendly UX** - Primary actions within thumb reach
5. **No Horizontal Scrolling** - Critical requirement at all breakpoints

#### Performance Standards
- **First Contentful Paint**: < 1.5s on 3G
- **Largest Contentful Paint**: < 2.5s on 3G  
- **Time to Interactive**: < 3.0s on 3G
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

#### Android Compatibility Requirements
- **Minimum OS**: Android 6.0 (API 23) - 95%+ market coverage
- **Chrome Version**: Chrome 88+ (default Android browser)
- **PWA Support**: Full Progressive Web App features
- **Touch Targets**: 48dp minimum (Android accessibility standard)

## File and Folder Conventions

### Directory Structure
```
src/
├── components/              # Reusable UI components
│   ├── Auth/               # Authentication system
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomePage.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── GuestDisclaimer.tsx
│   ├── Questionnaire/      # Multi-step onboarding
│   │   ├── QuestionnaireFlow.tsx
│   │   ├── QuestionnaireStep.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── PersonalizationEngine.tsx
│   ├── Dashboard/          # Service selection interface
│   │   ├── Dashboard.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── RewardBanner.tsx
│   │   └── PersonalizedRecommendation.tsx
│   ├── Booking/            # Booking flow components
│   │   ├── BookingFlow.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── ServiceSelector.tsx
│   │   └── BookingConfirmation.tsx
│   ├── Layout/             # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Navigation.tsx
│   │   └── SafeArea.tsx
│   └── UI/                 # Base UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── LoadingState.tsx
├── contexts/               # React Context providers
│   ├── AppContext.tsx      # Global app state
│   ├── AuthContext.tsx     # Authentication state
│   └── BookingContext.tsx  # Booking state
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useBooking.ts
│   ├── useDeviceInfo.ts
│   └── useNetworkStatus.ts
├── services/              # API and external services
│   ├── api.ts
│   ├── auth.ts
│   ├── booking.ts
│   └── location.ts
├── utils/                 # Helper functions
│   ├── validation.ts
│   ├── formatting.ts
│   ├── storage.ts
│   └── recommendationEngine.ts
├── types/                 # TypeScript type definitions
│   ├── user.ts
│   ├── booking.ts
│   ├── location.ts
│   └── index.ts
├── styles/                # CSS and styling
│   ├── globals.css
│   ├── variables.css
│   └── components/
└── data/                  # Static data and configuration
    ├── questionnaireData.ts
    ├── servicesData.ts
    └── constants.ts
```

### Naming Conventions

#### Files and Directories
- **Components**: PascalCase (`SplashScreen.tsx`, `ServiceCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useDeviceInfo.ts`)
- **Utilities**: camelCase (`validation.ts`, `formatCurrency.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS`, `ERROR_MESSAGES`)
- **CSS Files**: kebab-case (`splash-screen.css`, `service-card.css`)

#### Variables and Functions
```typescript
// Variables: camelCase
const currentUser = getCurrentUser();
const isLoading = false;
const deviceInfo = getDeviceInfo();

// Functions: camelCase, descriptive verbs
const navigateToView = (view: AppView) => { /* ... */ };
const validateEmailAddress = (email: string) => { /* ... */ };
const formatPriceDisplay = (amount: number) => { /* ... */ };

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.armora.co.uk';
const MAX_LOGIN_ATTEMPTS = 3;
const TOUCH_TARGET_SIZE = 48;

// Types and Interfaces: PascalCase
interface User { /* ... */ }
type BookingStatus = 'pending' | 'confirmed' | 'completed';
enum ServiceType { Standard = 'standard', Executive = 'executive', Shadow = 'shadow' }
```

#### Component Props and State
```typescript
// Props interfaces: ComponentName + Props
interface SplashScreenProps {
  onComplete: () => void;
  isLoading?: boolean;
}

// State interfaces: ComponentName + State  
interface BookingFlowState {
  currentStep: number;
  selectedService: ServiceType | null;
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
}

// Event handlers: on + Action
const onBackPress = () => { /* ... */ };
const onServiceSelect = (service: ServiceType) => { /* ... */ };
const onLocationChange = (location: Location) => { /* ... */ };
```

## Code Quality Standards

### TypeScript Configuration
```typescript
// tsconfig.json settings
{
  "compilerOptions": {
    "strict": true,                    // Enable all strict type checking
    "noImplicitAny": true,            // Error on implicit any types
    "noImplicitReturns": true,        // Error on missing return statements
    "noUnusedLocals": true,           // Error on unused variables
    "noUnusedParameters": true,       // Error on unused parameters
    "exactOptionalPropertyTypes": true // Strict optional property checking
  }
}

// Component typing standards
interface Props {
  children?: React.ReactNode;         // Optional children
  className?: string;                 // Optional styling
  'data-testid'?: string;            // Testing identifier
}

// Event handler typing
type EventHandler<T = void> = (event: React.MouseEvent) => T;
type ChangeHandler<T> = (value: T) => void;
```

### Component Structure Standards
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import './ComponentName.css';

// 1. Type definitions
interface ComponentNameProps {
  title: string;
  onAction?: () => void;
  isLoading?: boolean;
  className?: string;
}

// 2. Component definition
const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction,
  isLoading = false,
  className = ''
}) => {
  // 3. Hooks (Context, State, Effects)
  const { state, dispatch } = useApp();
  const [localState, setLocalState] = useState<string>('');
  
  // 4. Effect hooks
  useEffect(() => {
    // Component lifecycle effects
  }, []);

  // 5. Event handlers
  const handleAction = useCallback(() => {
    onAction?.();
  }, [onAction]);

  // 6. Conditional early returns
  if (isLoading) {
    return <LoadingState />;
  }

  // 7. Main render
  return (
    <div className={`component-name ${className}`} data-testid="component-name">
      <h2>{title}</h2>
      <button onClick={handleAction}>Action</button>
    </div>
  );
};

// 8. Export
export default ComponentName;
```

### CSS/Styling Standards

#### CSS Organization
```css
/* Component CSS structure */
/* 1. Component root styles */
.component-name {
  /* Layout properties */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
  
  /* Visual properties */
  background: var(--bg-card);
  border-radius: var(--radius-md);
  
  /* Typography */
  color: var(--text-primary);
  font-size: var(--font-base);
  
  /* Interactions */
  transition: var(--transition-base);
}

/* 2. State modifiers */
.component-name--loading {
  opacity: 0.6;
  pointer-events: none;
}

.component-name--error {
  border-left: 4px solid var(--error);
}

/* 3. Child elements */
.component-name__title {
  font-size: var(--font-lg);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.component-name__content {
  flex: 1;
  color: var(--text-secondary);
}

/* 4. Responsive behavior */
@media (min-width: 768px) {
  .component-name {
    flex-direction: row;
    align-items: center;
  }
}

/* 5. Touch interactions */
@media (hover: hover) {
  .component-name:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}
```

#### CSS Naming Convention (BEM Methodology)
- **Block**: Component name (`.service-card`)
- **Element**: Component part (`.service-card__title`)
- **Modifier**: State/variant (`.service-card--selected`)

## Git Workflow Standards

### Branch Naming
```bash
# Feature branches
feature/splash-screen-animation
feature/questionnaire-flow  
feature/booking-confirmation

# Bug fixes
fix/android-keyboard-overlap
fix/touch-target-size
fix/horizontal-scroll-issue

# Hotfixes
hotfix/critical-login-error
hotfix/payment-processing-bug

# Release branches
release/v1.0.0
release/v1.1.0-beta
```

### Commit Message Format
```bash
# Format: <type>(<scope>): <description>
# 
# <optional body>
# 
# 🤖 Generated with [Claude Code](https://claude.ai/code)
# Co-Authored-By: Claude <noreply@anthropic.com>

# Examples:
feat(auth): add Google OAuth integration

- Implement Google Sign-In for Android users
- Add OAuth token management
- Update authentication flow
- Test on multiple Android devices

fix(mobile): resolve horizontal scrolling on 320px screens

- Adjust container max-widths
- Fix overflowing elements in service cards
- Test on Android Go devices
- Ensure no horizontal scroll at any breakpoint

docs(android): update compatibility guidelines

- Add Android 13 considerations
- Update PWA installation steps
- Include foldable device support
- Document accessibility requirements

🤖 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types
- **feat**: New feature implementation
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting changes
- **refactor**: Code refactoring (no behavior change)
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## Testing Standards

### Component Testing Strategy
```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import ComponentName from './ComponentName';

// Test utilities
const renderWithContext = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

// Mock functions
const mockOnAction = jest.fn();

describe('ComponentName', () => {
  const defaultProps = {
    title: 'Test Title',
    onAction: mockOnAction
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Rendering tests
  it('renders with required props', () => {
    renderWithContext(<ComponentName {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  // 2. Interaction tests
  it('calls onAction when action button is clicked', () => {
    renderWithContext(<ComponentName {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  // 3. State tests
  it('shows loading state when isLoading is true', () => {
    renderWithContext(<ComponentName {...defaultProps} isLoading />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  // 4. Android-specific tests
  it('handles touch interactions correctly', () => {
    renderWithContext(<ComponentName {...defaultProps} />);
    const component = screen.getByTestId('component-name');
    
    fireEvent.touchStart(component);
    fireEvent.touchEnd(component);
    
    expect(component).toHaveClass('touch-active');
  });

  // 5. Responsive tests
  it('adapts to mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });
    
    renderWithContext(<ComponentName {...defaultProps} />);
    expect(screen.getByTestId('component-name')).toHaveClass('mobile-layout');
  });
});
```

### Testing Checklist
- [ ] **Unit Tests**: All components and utilities tested
- [ ] **Integration Tests**: Context interactions tested
- [ ] **Touch Tests**: Touch interactions verified
- [ ] **Responsive Tests**: Mobile breakpoints tested
- [ ] **Accessibility Tests**: Screen reader compatibility
- [ ] **Performance Tests**: Render performance validated

## Security Standards

### Data Protection (GDPR Compliance)
```typescript
// Secure data handling
interface UserData {
  id: string;
  email: string;
  // Never store sensitive data in plain text
  encryptedPersonalInfo?: string;
  consentGiven: boolean;
  dataRetentionExpiry: Date;
}

// Secure storage utilities
const secureStorage = {
  set: (key: string, value: any, encrypt = true) => {
    const data = encrypt ? encryptData(value) : value;
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  get: (key: string, decrypt = true) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    const data = JSON.parse(item);
    return decrypt ? decryptData(data) : data;
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};
```

### API Security
- **HTTPS Only**: All API communications encrypted
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent API abuse
- **Error Handling**: No sensitive data in error messages

### Mobile Security Considerations
- **Biometric Authentication**: Support Android fingerprint/face unlock
- **App Sandboxing**: Secure data storage within app container
- **Certificate Pinning**: Prevent man-in-the-middle attacks
- **Root Detection**: Optional security enhancement
- **Data Encryption**: All local storage encrypted

## Performance Optimization

### Bundle Size Management
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Code splitting strategies
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Tree shaking optimization
import { specificFunction } from 'utility-library';
// NOT: import * as utils from 'utility-library';
```

### Android Performance Optimization
- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Progressive content loading
- **Service Workers**: Aggressive caching strategy
- **Code Splitting**: Route-based component loading
- **Virtual Scrolling**: Efficient list rendering

### Memory Management
```typescript
// Proper cleanup patterns
useEffect(() => {
  const subscription = eventEmitter.subscribe(handler);
  const timer = setTimeout(callback, 1000);
  
  return () => {
    subscription.unsubscribe();
    clearTimeout(timer);
  };
}, []);

// Efficient state updates
const [state, setState] = useState(initialState);

const updateState = useCallback((updates: Partial<State>) => {
  setState(current => ({ ...current, ...updates }));
}, []);
```

## Deployment Standards

### Build Configuration
```typescript
// Production build optimization
"scripts": {
  "build": "react-scripts build && npm run optimize",
  "optimize": "npm run compress && npm run minify",
  "compress": "gzip -k build/static/**/*.{js,css}",
  "minify": "imagemin 'build/static/media/**' --out-dir=build/static/media"
}
```

### PWA Configuration
```json
// public/manifest.json
{
  "name": "Armora Security Transport",
  "short_name": "Armora",
  "description": "Professional VIP security transport service",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "orientation": "portrait-primary",
  "categories": ["travel", "business"],
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Android Deployment Checklist
- [ ] **Manifest Complete**: All PWA manifest fields configured
- [ ] **Icons Generated**: All required icon sizes created
- [ ] **Service Worker**: Caching strategy implemented
- [ ] **HTTPS Certificate**: SSL/TLS encryption enabled
- [ ] **Performance Audit**: Lighthouse score 90+
- [ ] **Accessibility Audit**: WCAG 2.1 AA compliance
- [ ] **Device Testing**: Tested on multiple Android devices

---

**Development Standards Summary:**
- **Mobile-First**: Start at 320px, progressively enhance
- **Type Safety**: Comprehensive TypeScript implementation
- **Component Architecture**: Consistent, reusable component patterns
- **Performance**: Optimized for Android devices and networks
- **Security**: GDPR compliant, secure data handling
- **Testing**: Comprehensive test coverage with Android-specific tests
- **Deployment**: PWA-ready with Android optimization

**Last Updated**: 2025-09-08
**Compliance**: Android PWA standards, GDPR, accessibility guidelines