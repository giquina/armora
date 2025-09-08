# 🧩 Armora Component Library

## Component Architecture

### Core Components

#### SplashScreen
- **Purpose**: 3-second branded loading screen
- **Location**: `src/components/SplashScreen.tsx`
- **Props**: None
- **State**: Timer-based auto-transition

#### WelcomePage
- **Purpose**: Landing page with auth options
- **Location**: `src/components/WelcomePage.tsx`
- **Features**: Sign-in, Sign-up, Guest mode buttons

#### Authentication Components
- **LoginForm**: `src/components/Auth/LoginForm.tsx`
- **SignupForm**: `src/components/Auth/SignupForm.tsx`
- **GuestDisclaimer**: `src/components/Auth/GuestDisclaimer.tsx`

#### Questionnaire System
- **QuestionnaireFlow**: `src/components/Questionnaire/QuestionnaireFlow.tsx`
- **QuestionStep**: Individual step component
- **ProgressIndicator**: Progress bar for 9 steps

#### Dashboard Components
- **Dashboard**: `src/components/Dashboard/Dashboard.tsx`
- **ServiceSelector**: Service level selection
- **QuickBooking**: Rapid booking interface

### Shared Components

#### UI Elements
- **Button**: Touch-friendly buttons (44px+ targets)
- **Input**: Mobile-optimized form inputs
- **Card**: Content containers with Armora styling
- **LoadingSpinner**: Branded loading indicator

#### Layout Components
- **Container**: Responsive container with max-width
- **Grid**: CSS Grid system for layout
- **Stack**: Vertical spacing utility

### Styling Approach
- **CSS Modules**: Component-scoped styles
- **Mobile-First**: 320px base, progressive enhancement
- **Brand Colors**: #1a1a2e primary, #FFD700 accent
- **Touch Targets**: All interactive elements 44px+

### Component Guidelines
1. **Mobile-first** responsive design
2. **Accessibility** built-in (WCAG 2.1 AA)
3. **TypeScript** strict typing
4. **Error boundaries** for robust UX
5. **Loading states** for all async operations

Last updated: 2025-09-08T13:29:50.739Z
