# React Development Standards - Armora Security Transport

## Mobile-First Component Architecture

### TypeScript Interfaces (Core Data Types)

#### User Management
```typescript
// User Types - Support for all authentication methods
interface User {
  id: string;
  userType: 'registered' | 'google' | 'guest';
  email?: string; // Optional for guest users
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  preferences: UserPreferences;
  rewards: RewardStatus;
  createdAt: Date;
  lastLoginAt: Date;
}

interface UserPreferences {
  servicePreference: 'standard' | 'executive' | 'shadow';
  paymentMethod: 'card' | 'cash' | 'corporate';
  specialRequirements: string[];
  accessibilityNeeds: string[];
  communicationPreference: 'sms' | 'email' | 'push' | 'minimal';
  privacyLevel: 'full' | 'partial' | 'minimal';
}

interface RewardStatus {
  eligibleFor50PercentOff: boolean;
  ridesCompleted: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsBalance: number;
}
```

#### Booking System
```typescript
interface BookingRequest {
  id: string;
  userId: string;
  serviceType: 'standard' | 'executive' | 'shadow';
  pickupLocation: Location;
  dropoffLocation: Location;
  scheduledTime: Date;
  passengers: number;
  specialRequests: string[];
  estimatedCost: number;
  paymentMethod: string;
  status: BookingStatus;
}

interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  locationType: 'home' | 'work' | 'airport' | 'hotel' | 'custom';
  accessInstructions?: string;
  contactPerson?: string;
}

type BookingStatus = 
  | 'draft' 
  | 'requested' 
  | 'confirmed' 
  | 'driver_assigned' 
  | 'en_route' 
  | 'arrived' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';
```

#### App State Management
```typescript
interface AppState {
  currentView: AppView;
  user: User | null;
  isAuthenticated: boolean;
  currentBooking: BookingRequest | null;
  networkStatus: 'online' | 'offline' | 'slow';
  deviceInfo: DeviceInfo;
}

type AppView = 
  | 'splash'
  | 'welcome' 
  | 'login' 
  | 'signup' 
  | 'guest-disclaimer' 
  | 'questionnaire' 
  | 'dashboard' 
  | 'booking';

interface DeviceInfo {
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isAndroid: boolean;
  isiOS: boolean;
  supportsTouch: boolean;
  connectionType: '4g' | '3g' | '2g' | 'wifi' | 'unknown';
}
```

### Component Patterns (Mobile-First)

#### Base Component Structure
```typescript
// Standard mobile component template
import React, { useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import './ComponentName.css';

interface ComponentNameProps {
  // Props always include mobile-specific handlers
  onBack?: () => void;
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  // Android-specific props
  supportsTouchFeedback?: boolean;
  optimizeForThumb?: boolean;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  onBack,
  onSubmit,
  isLoading = false,
  error = null,
  className = '',
  supportsTouchFeedback = true,
  optimizeForThumb = true
}) => {
  // Mobile state management
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  
  // Android back button support
  useEffect(() => {
    const handleAndroidBack = (e: PopStateEvent) => {
      e.preventDefault();
      onBack?.();
    };
    
    window.addEventListener('popstate', handleAndroidBack);
    return () => window.removeEventListener('popstate', handleAndroidBack);
  }, [onBack]);

  // Touch optimization for Android
  const handleTouchStart = (e: React.TouchEvent) => {
    if (supportsTouchFeedback) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  return (
    <div 
      className={`armora-component ${className}`}
      onTouchStart={handleTouchStart}
      data-testid="component-name"
    >
      {/* Mobile-first content structure */}
    </div>
  );
};

export default ComponentName;
```

#### Form Component Pattern (Android Optimized)
```typescript
interface FormComponentProps {
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Continue',
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Android keyboard handling
  useEffect(() => {
    const handleKeyboard = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        document.documentElement.style.setProperty(
          '--viewport-height', 
          `${viewportHeight}px`
        );
      }
    };

    window.visualViewport?.addEventListener('resize', handleKeyboard);
    return () => window.visualViewport?.removeEventListener('resize', handleKeyboard);
  }, []);

  return (
    <form 
      className="armora-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      {/* Form fields with Android input optimization */}
      <div className="form-actions">
        {onCancel && (
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
```

#### Loading State Component
```typescript
interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'shimmer';
  message?: string;
  progress?: number; // 0-100 for progress bar
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  progress,
  size = 'medium'
}) => {
  return (
    <div className={`loading-state loading-state--${type} loading-state--${size}`}>
      {type === 'spinner' && (
        <div className="armora-spinner">
          <div className="spinner-ring"></div>
        </div>
      )}
      
      {type === 'skeleton' && (
        <div className="skeleton-loader">
          <div className="skeleton-line skeleton-line--title"></div>
          <div className="skeleton-line skeleton-line--text"></div>
          <div className="skeleton-line skeleton-line--text skeleton-line--short"></div>
        </div>
      )}
      
      {progress !== undefined && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {message && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
};
```

### State Management Patterns

#### App Context Provider
```typescript
import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience methods
  setCurrentView: (view: AppView) => void;
  setUser: (user: User | null) => void;
  createBooking: (booking: BookingRequest) => void;
  updateDeviceInfo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

type AppAction = 
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_BOOKING'; payload: BookingRequest | null }
  | { type: 'UPDATE_DEVICE_INFO'; payload: DeviceInfo }
  | { type: 'SET_NETWORK_STATUS'; payload: 'online' | 'offline' | 'slow' };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    case 'SET_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'UPDATE_DEVICE_INFO':
      return { ...state, deviceInfo: action.payload };
    case 'SET_NETWORK_STATUS':
      return { ...state, networkStatus: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // Device detection for Android optimization
  const updateDeviceInfo = () => {
    const deviceInfo: DeviceInfo = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      deviceType: window.innerWidth >= 768 ? 'tablet' : 'mobile',
      isAndroid: /Android/i.test(navigator.userAgent),
      isiOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
      supportsTouch: 'ontouchstart' in window,
      connectionType: (navigator as any)?.connection?.effectiveType || 'unknown'
    };
    
    dispatch({ type: 'UPDATE_DEVICE_INFO', payload: deviceInfo });
  };

  // Initialize device info and listen for changes
  useEffect(() => {
    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_NETWORK_STATUS', payload: 'online' });
    const handleOffline = () => dispatch({ type: 'SET_NETWORK_STATUS', payload: 'offline' });
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    setCurrentView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    createBooking: (booking) => dispatch({ type: 'SET_BOOKING', payload: booking }),
    updateDeviceInfo
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```

### Event Handler Conventions

#### Standard Event Handlers
```typescript
// Naming convention for event handlers
interface EventHandlers {
  // Navigation
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onCancel: () => void;
  
  // Form interactions
  onSubmit: (data: any) => void;
  onChange: (field: string, value: any) => void;
  onFocus: (field: string) => void;
  onBlur: (field: string) => void;
  
  // Touch interactions (Android specific)
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  
  // Booking specific
  onLocationSelect: (location: Location) => void;
  onServiceSelect: (service: string) => void;
  onTimeSelect: (time: Date) => void;
}
```

### Error Handling Patterns

#### Error Boundary Component
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log to analytics service
    console.error('Armora Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ? (
        <this.props.fallback />
      ) : (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Performance Optimization

#### Lazy Loading Pattern
```typescript
import { lazy, Suspense } from 'react';
import LoadingState from './LoadingState';

// Lazy load heavy components
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const BookingFlow = lazy(() => import('./Booking/BookingFlow'));
const Questionnaire = lazy(() => import('./Questionnaire/QuestionnaireFlow'));

const LazyRoute: React.FC<{ component: React.LazyExoticComponent<any> }> = ({ 
  component: Component 
}) => (
  <Suspense fallback={<LoadingState type="skeleton" message="Loading..." />}>
    <Component />
  </Suspense>
);
```

### Import/Export Standards

#### Component Export Pattern
```typescript
// ComponentName.tsx
import React from 'react';
import './ComponentName.css';

// Named export for the component
export const ComponentName: React.FC<Props> = (props) => {
  // Component implementation
};

// Default export
export default ComponentName;

// Type exports
export type { ComponentNameProps } from './types';

// Re-exports for related components
export { ComponentSubItem } from './ComponentSubItem';
```

#### Index File Pattern
```typescript
// components/index.ts
export { default as SplashScreen } from './Auth/SplashScreen';
export { default as WelcomePage } from './Auth/WelcomePage';
export { default as LoginForm } from './Auth/LoginForm';
export { default as Dashboard } from './Dashboard/Dashboard';
export { default as BookingFlow } from './Booking/BookingFlow';

// Type re-exports
export type { 
  User, 
  BookingRequest, 
  Location, 
  AppState 
} from './types';
```

### Testing Patterns

#### Component Testing Template
```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import ComponentName from './ComponentName';

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('ComponentName', () => {
  const defaultProps = {
    onBack: jest.fn(),
    onSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithContext(<ComponentName {...defaultProps} />);
    expect(screen.getByTestId('component-name')).toBeInTheDocument();
  });

  it('handles Android back button', async () => {
    renderWithContext(<ComponentName {...defaultProps} />);
    
    // Simulate Android back button
    window.history.back();
    
    await waitFor(() => {
      expect(defaultProps.onBack).toHaveBeenCalled();
    });
  });

  it('supports touch interactions', () => {
    renderWithContext(<ComponentName {...defaultProps} />);
    
    const component = screen.getByTestId('component-name');
    fireEvent.touchStart(component, {
      touches: [{ clientY: 100 }]
    });
    
    expect(component).toHaveClass('touch-active');
  });
});
```

---

**Key Principles:**
1. **Mobile-First**: Every component designed for 320px+ screens
2. **Android Optimization**: Touch targets, gestures, PWA features
3. **Type Safety**: Comprehensive TypeScript interfaces
4. **Performance**: Lazy loading, efficient state management
5. **Accessibility**: Screen reader support, keyboard navigation
6. **Error Handling**: Graceful degradation and user feedback

### Authentication Component Patterns

#### Form Component with Validation
```typescript
interface AuthFormProps {
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  error?: string | null;
  title: string;
  submitLabel: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
  title,
  submitLabel
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form className="auth-form" onSubmit={(e) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
      }
    }}>
      <h1 className="auth-title">{title}</h1>
      
      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={errors.email ? 'error' : ''}
          autoComplete="email"
          required
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password || ''}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className={errors.password ? 'error' : ''}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && <span className="field-error">{errors.password}</span>}
      </div>
      
      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
```

#### Password Strength Indicator
```typescript
interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const usePasswordStrength = (password: string): PasswordStrength => {
  return useMemo(() => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strengthLevels = [
      { label: 'Very Weak', color: '#ff4444' },
      { label: 'Weak', color: '#ff8800' },
      { label: 'Fair', color: '#ffaa00' },
      { label: 'Good', color: '#88cc00' },
      { label: 'Strong', color: '#00aa00' }
    ];
    
    const level = strengthLevels[Math.min(score, 4)];
    return { score, ...level };
  }, [password]);
};

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const strength = usePasswordStrength(password);
  
  if (!password) return null;
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div
          className="strength-fill"
          style={{
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor: strength.color
          }}
        />
      </div>
      <span className="strength-label" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
};
```

#### Reusable Logo Component
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOrbital?: boolean;
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showOrbital = true,
  animated = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 48, height: 48, fontSize: '1.5rem' },
    md: { width: 64, height: 64, fontSize: '2rem' },
    lg: { width: 96, height: 96, fontSize: '2.5rem' },
    xl: { width: 128, height: 128, fontSize: '3rem' }
  };
  
  const { width, height, fontSize } = sizeMap[size];
  
  return (
    <div className={`logo ${className} ${animated ? 'animated' : ''}`}>
      <div
        className="logo-container"
        style={{ width, height }}
      >
        <div className="logo-core" style={{ fontSize }}>
          A
        </div>
        {showOrbital && (
          <div className={`orbital-ring ${animated ? 'rotating' : ''}`} />
        )}
      </div>
    </div>
  );
};
```

#### Guest User Flow Pattern
```typescript
interface GuestFlowProps {
  onContinueAsGuest: () => void;
  onCreateAccount: () => void;
  onBack: () => void;
  isProcessing?: boolean;
}

const GuestDisclaimer: React.FC<GuestFlowProps> = ({
  onContinueAsGuest,
  onCreateAccount,
  onBack,
  isProcessing = false
}) => {
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  const guestCapabilities = [
    'Complete 9-step security assessment questionnaire',
    'Browse all service levels (Standard, Executive, Shadow)',
    'Use quote calculator for route pricing estimates',
    'Access direct contact information for bookings',
    'Preview the booking interface and app features'
  ];
  
  const accountBenefits = [
    {
      title: 'Direct In-App Booking',
      description: 'Book rides instantly without phone calls or waiting'
    },
    {
      title: 'Secure Payment Storage',
      description: 'Save payment methods for quick, secure transactions'
    },
    {
      title: 'Ride History & Profiles',
      description: 'Access all previous trips and saved destination profiles'
    },
    {
      title: '50% Off First Ride Reward',
      description: 'Unlock exclusive savings on your first premium journey'
    }
  ];
  
  return (
    <div className="guest-disclaimer-page">
      <div className={`disclaimer-container ${showContent ? 'visible' : ''}`}>
        <header className="disclaimer-header">
          <Logo size="md" showOrbital={false} animated={true} />
          <h1>Guest Access</h1>
          <p>Experience Armora with limited access or create an account for full features</p>
        </header>
        
        <div className="disclaimer-content">
          <section>
            <h2>What You Can Do as a Guest</h2>
            <ul>
              {guestCapabilities.map((capability, index) => (
                <li key={index}>{capability}</li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2>Premium Account Benefits</h2>
            <div className="benefits-list">
              {accountBenefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <footer className="disclaimer-actions">
          <button
            className="btn-primary"
            onClick={onCreateAccount}
            disabled={isProcessing}
          >
            Create Account for Full Access
          </button>
          
          <button
            className="btn-outline"
            onClick={onContinueAsGuest}
            disabled={isProcessing}
          >
            {isProcessing ? 'Setting up guest access...' : 'Continue as Guest'}
          </button>
          
          <button
            className="btn-text"
            onClick={onBack}
            disabled={isProcessing}
          >
            ← Back to Welcome
          </button>
        </footer>
      </div>
    </div>
  );
};
```

**Last Updated**: 2025-09-08 - Added authentication component patterns

---

Last updated: 2025-09-19T03:56:20.665Z
