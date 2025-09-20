# 🧩 Armora Component Library

## Component Architecture Overview

Armora's component library follows atomic design principles with a focus on reusability, accessibility, and performance.

## Component Categories

### 🎨 Foundation Components

#### Layout Components
- **Container**: Responsive wrapper with max-width constraints
- **Grid**: Flexible grid system with responsive columns
- **Stack**: Vertical spacing utility component
- **Flex**: Flexbox wrapper with common patterns
- **Spacer**: Dynamic spacing component

#### Typography Components
- **Heading**: H1-H6 with consistent styling
- **Text**: Body text with size variants
- **Label**: Form labels and small text
- **Caption**: Image captions and hints

### 🔧 Atomic Components

#### Button Components
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick: () => void;
}
```

#### Input Components
- **TextField**: Text input with validation
- **TextArea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Single checkbox with label
- **RadioGroup**: Radio button group
- **Switch**: Toggle switch
- **DatePicker**: Date selection
- **TimePicker**: Time selection

#### Feedback Components
- **Alert**: Info/warning/error messages
- **Toast**: Temporary notifications
- **ProgressBar**: Linear progress indicator
- **Spinner**: Loading spinner
- **Skeleton**: Content placeholder

### 🏗️ Molecular Components

#### Card Components
```typescript
interface CardProps {
  variant: 'default' | 'outlined' | 'elevated';
  padding: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  onClick?: () => void;
}
```

#### Modal Components
- **Modal**: Base modal wrapper
- **Dialog**: Confirmation dialogs
- **Drawer**: Side panel drawer
- **BottomSheet**: Mobile bottom sheet

#### Navigation Components
- **Header**: App header with navigation
- **TabBar**: Tab navigation
- **Breadcrumb**: Breadcrumb navigation
- **Pagination**: Page navigation
- **Stepper**: Multi-step process indicator

### 🎯 Organism Components

#### Form Components
- **Form**: Form wrapper with validation
- **FormField**: Field wrapper with label/error
- **FormSection**: Grouped form fields
- **FormActions**: Form button group

#### List Components
- **List**: Base list container
- **ListItem**: Individual list item
- **VirtualList**: Virtualized long lists
- **DataTable**: Sortable data table

### 📱 Screen Components

#### Authentication Screens
- **SplashScreen**: 3-second branded intro
- **WelcomePage**: Landing with auth options
- **LoginForm**: Email/password login
- **SignupForm**: Registration flow
- **GuestDisclaimer**: Guest mode warning

#### Questionnaire Screens
- **QuestionnaireFlow**: 9-step questionnaire
- **QuestionStep**: Individual question
- **PrivacyStep**: Privacy preferences
- **ProgressIndicator**: Step progress

#### Dashboard Screens
- **Dashboard**: Main service selection
- **ServiceCard**: Service level display
- **QuickActions**: Fast access buttons
- **UserStats**: Usage statistics

#### Booking Screens
- **VehicleSelection**: Vehicle chooser
- **LocationPicker**: Map-based location
- **TimeSelector**: Schedule picker
- **BookingReview**: Booking summary
- **PaymentForm**: Payment input
- **BookingConfirmation**: Success screen

### 🎭 Specialized Components

#### Armora Logo System
```typescript
interface LogoProps {
  size: 'hero' | 'large' | 'medium' | 'small';
  variant: 'animated' | 'full' | 'compact' | 'minimal';
  theme?: 'light' | 'dark';
  animate?: boolean;
}
```

#### Safe Ride Fund Components
- **SafeRideFundCTA**: Call-to-action button
- **SafeRideFundModal**: Donation modal
- **ImpactCounter**: Animated ride counter
- **ContributionSelector**: Amount selector

## Component Guidelines

### Development Standards

#### TypeScript Requirements
```typescript
// All components must be strongly typed
interface ComponentProps {
  // Required props
  id: string;
  // Optional props with defaults
  className?: string;
  style?: CSSProperties;
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  // Children
  children?: ReactNode;
}

// Use generics for flexible components
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
}
```

#### CSS Module Structure
```css
/* Component.module.css */
.container {
  /* Mobile first */
  padding: var(--space-md);
  background: var(--color-background);
}

.title {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-lg);
  }
}

/* State modifiers */
.container.active {
  border-color: var(--color-primary);
}

.container.disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

### Accessibility Requirements

#### ARIA Implementation
```tsx
<button
  role="button"
  aria-label="Book security transport"
  aria-pressed={isActive}
  aria-disabled={isDisabled}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {children}
</button>
```

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Logical tab order
- Escape key closes modals
- Enter/Space activates buttons
- Arrow keys for navigation

### Performance Optimization

#### Code Splitting
```typescript
// Lazy load heavy components
const MapView = lazy(() => import('./MapView'));
const PaymentForm = lazy(() => import('./PaymentForm'));

// Use Suspense for loading states
<Suspense fallback={<Spinner />}>
  <MapView />
</Suspense>
```

#### Memoization
```typescript
// Memoize expensive components
const ExpensiveList = memo(({ items }) => {
  return items.map(item => <ListItem key={item.id} {...item} />);
});

// Use useMemo for expensive calculations
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

### Testing Strategy

#### Component Testing
```typescript
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

## Component Documentation

### Props Documentation
```typescript
interface ButtonProps {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether button should take full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;
}
```

### Usage Examples
```tsx
// Basic usage
<Button onClick={handleSubmit}>Submit</Button>

// With variants
<Button variant="secondary" size="large">
  Cancel
</Button>

// With loading state
<Button loading={isSubmitting} onClick={handleSubmit}>
  {isSubmitting ? 'Processing...' : 'Submit'}
</Button>

// Full width on mobile
<Button fullWidth className={styles.mobileButton}>
  Book Now
</Button>
```

## Design Tokens

### Color Tokens
```css
:root {
  /* Primary palette */
  --color-primary: #1a1a2e;
  --color-primary-light: #2d2d44;
  --color-primary-dark: #0f0f1a;
  
  /* Accent palette */
  --color-accent: #FFD700;
  --color-accent-light: #FFED4E;
  --color-accent-dark: #B8860B;
  
  /* Semantic colors */
  --color-success: #4CAF50;
  --color-error: #F44336;
  --color-warning: #FF9800;
  --color-info: #2196F3;
}
```

### Typography Tokens
```css
:root {
  /* Font sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 2.5rem;
  
  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Spacing Tokens
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}
```

## Component Status

### ✅ Production Ready
- Button, Input, Card, Modal
- Form components
- Navigation components
- Authentication flows
- Dashboard components

### 🚧 In Development
- Advanced form validation
- Data visualization
- Map integration
- Payment components
- Real-time updates

### 📋 Planned
- Advanced animations
- Gesture controls
- Voice input
- AR preview
- Biometric auth

---

Last updated: 2025-09-20T16:50:52.078Z
