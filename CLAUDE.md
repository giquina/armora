# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React 19.1.1 TypeScript application for premium close protection and security transport services across England & Wales. Nationwide service delivery with SIA-licensed Close Protection Officers (CPOs). Mobile-first Progressive Web App targeting app store distribution.

**NATIONWIDE SERVICE SCOPE**: Armora operates across England & Wales with regional pricing and coverage areas. Complete geographic service delivery with specialized airport services and major city coverage.

**PROFESSIONAL PROTECTION FOCUSED**: Use close protection terminology throughout - "CPO" (Close Protection Officer), "Principal" (not passenger), "Protection Detail" (not ride), "Security Assessment" (not booking review). All UI copy should reflect professional security services, not taxi/ride-sharing language.

## Critical Dependencies
- **React 19.1.1** with new JSX Transform
- **TypeScript 4.9.5** in strict mode
- **react-scripts 5.0.1** (Create React App)
- **CSS Modules** for styling (no CSS-in-JS libraries)
- **No external UI libraries** - custom components only

### Additional Key Dependencies
- **Stripe**: Payment processing (@stripe/react-stripe-js, @stripe/stripe-js)
- **Leaflet**: Maps and location services (react-leaflet)
- **QR Code**: QR code generation for bookings
- **Playwright**: End-to-end testing framework

## Core Development Commands
- `npm start` - Start development server (localhost:3000)
- `npm run build` - Production build with type checking
- `npm test` - Run tests in watch mode (Jest + React Testing Library)
- `npm test -- --coverage` - Coverage report
- `npm test -- --watchAll=false` - Single run (CI mode)
- `npm test -- src/components/Booking/__tests__/BookingConfirmation.test.tsx` - Run specific test file
- `npm run test:e2e` - Run Playwright end-to-end tests

**CRITICAL**: No separate lint/typecheck commands - always run `npm run build` to verify TypeScript correctness before committing.

## Development Infrastructure
Includes automated hooks system and AI task management:
- `npm run dev` - Start with hooks system and orchestration
- `npm run hooks:start/stop/status/restart/emergency` - Manage development hooks
- `npm run hooks:help` - Show hooks system help
- `npm run suggest` - AI task suggestions via codebase analysis
- `npm run select-suggestion` - Interactive suggestion selector
- `npm run refresh-suggestions` - Refresh AI task suggestions
- `npm run add-task/complete-task/start-task/task-status` - Task management system
- `npm run update-docs` - Update documentation automatically
- `npm run project-health` - Check overall project health
- `npm run statusline` - Update status line
- `npm run agents` - Manage specialized agents (.claude/agents/)
- `npm run agents:start/status/test/file` - Agent management commands
- `npm run orchestrate:status` - View active agents and system status

**Hooks System**: 9 tools including mobile viewport tester (prevents horizontal scrolling), auto-saver, dev server monitor, brand compliance, and AI agent management.

**Task Management**: Integrated AI-powered suggestion system tracks development tasks, priorities, and completion status through `.claude/` directory.

## TypeScript Configuration
**Strict mode enabled** (`tsconfig.json`):
- Target: ES2018
- JSX: react-jsx (React 19 transform)
- Module: ESNext with Node resolution
- All strict checks enabled

## Architecture

### Core Stack
- **React 19.1.1** + **TypeScript 4.9.5** (strict mode)
- **CSS Modules** for component styling
- **React Context** for state (no Redux)
- **Create React App 5.0.1** build system

### State Management Pattern
**View-based routing** (NO React Router - uses AppContext `currentView` state):
- Views: `splash` → `welcome` → `login`/`signup`/`guest-disclaimer` → `questionnaire` → `achievement` → `dashboard` → `booking` → `profile`
- User types: `registered` | `google` | `guest`
- Navigation: `navigateToView(viewName)` function from AppContext
- Persistence: localStorage keys: `armoraUser`, `armoraQuestionnaireResponses`, `armoraBookingData`

**Global State Structure** (`AppContext.tsx`):
- `useReducer` for state management (no Redux)
- Device capabilities detection (mobile, touch, orientation)
- Subscription management with tier system
- Error handling and loading states

### Component Architecture
**Full-screen views** (bypass AppLayout): splash, welcome, auth, questionnaire, achievement
**App-wrapped views** (include header): dashboard, booking, profile

### Key File Structure
```
src/
├── App.tsx                               - Main router with view switching
├── contexts/
│   ├── AppContext.tsx                    - Global state management
│   └── ProtectionAssignmentContext.tsx  - Protection assignment booking state
├── types/index.ts                        - TypeScript interfaces
├── components/
│   ├── Auth/                            - Authentication flow
│   ├── Questionnaire/                   - 9-step onboarding system
│   ├── Dashboard/                       - Protection tier selection
│   ├── AssignmentsView/                 - Professional protection assignments command centre
│   ├── Booking/                         - Complete protection booking flow
│   ├── ProtectionAssignment/            - New unified protection booking system
│   ├── VenueProtection/                 - Venue security services
│   ├── WeddingEventSecurity/            - Specialized event protection
│   ├── UI/ArmoraLogo.tsx                - Premium 4D logo system
│   └── Layout/AppLayout.tsx             - Header with navigation
└── data/questionnaireData.ts            - Dynamic questionnaire logic
```

## Business Context
**Nationwide Coverage**: England & Wales with regional pricing variations. London premium rates, major cities -10%, rural areas +15%, airport services +25%.

**Protection Tiers**:
- Standard Protection (£65/h): SIA Level 2, personal protection trained drivers
- Executive Shield (£95/h): SIA Level 3, corporate bodyguard services
- Shadow Protocol (£125/h): Special Forces trained, covert protection specialists
- Client Vehicle Service (£55/h): Security-trained driver for customer's vehicle

**Venue Protection Services**: Day (£450), Weekend (£850), Monthly (£12,500), Annual (£135,000) contracts with 1-10 officer scaling.

**User Journey**: splash → welcome → auth → questionnaire → achievement → dashboard → assignments
**User Capabilities**: Registered/Google users get direct protection booking + 50% reward; guests get quotes only
**Professional Standards**: All officers are SIA licensed with specializations in Executive Protection, Threat Assessment, and Medical Response

**Geographic Service Areas**:
- Primary: London & Greater London (immediate availability)
- Major Cities: Manchester, Birmingham, Leeds, Liverpool, Bristol, Cardiff
- Regional: All major towns with 2-hour response time
- Airports: Heathrow, Gatwick, Manchester, Birmingham specialists

### Safe Ride Fund Initiative
- **Impact Counter**: Live counter showing 3,741+ safe rides delivered (animated on WelcomePage)
- **Components**: `SafeRideFundCTA`, `SafeRideFundModal` with interactive contribution system
- **Development Mode**: Credentials modal always visible in dev mode (`showDevButton` in WelcomePage)

## CSS Architecture & Design System

### Global Styling Structure
- **CSS Modules** for component-scoped styles
- **Central design system** via `/src/styles/variables.css`
- **Card standardization** via `/src/styles/card-standards.css` for consistent UI
- **Global container** system via `/src/styles/global-container.css`
- **Master width control**: `--content-max-width: 680px` across all views

### Mobile-First Design (CRITICAL: No horizontal scrolling 320px+)
- **Colors**: #1a1a2e (navy), #FFD700 (gold), #e0e0e0 (text)
- **Touch targets**: 44px+ minimum (`--touch-target` CSS variable)
- **Typography**: Aggressive mobile sizing (1.4-1.5rem), system fonts
- **8px grid spacing**: `--space-xs: 4px` through `--space-xxl: 48px`
- **Viewport constraints**: Cards use `calc(100vw - 36px)` to account for borders

## Development Tools & Automation

### Hooks System (`dev-tools/hooks/`)
9 development hooks for automated quality assurance:
- **armora-brand-compliance.js** - Enforces brand standards and messaging consistency
- **auto-github-saver.js** - Automated Git operations and backup
- **codebase-reviewer-suggester.js** - AI-powered task suggestions and code review
- **dev-server-monitor.js** - Development server monitoring and auto-restart
- **file-structure-organizer.js** - Code organization and file structure validation
- **mobile-viewport-tester.js** - Prevents horizontal scrolling across all breakpoints
- **subagent-manager.js** - Manages specialized development agents
- **suggestion-selector.js** - Interactive task management system
- **hooks-manager.js** - Central hooks control and coordination

### Specialized Agents (`.claude/agents/`)
6 agents for specialized development: mobile-tester, pwa-optimizer, ux-validator, booking-flow-manager, server-keeper, orchestration-agent

### Automatic Agent Activation System
**Proactive Agent Orchestration**: Agents automatically activate based on context without manual intervention.

**Auto-Activation Rules**:
- **Component files** (*.tsx) → `mobile-tester` + `ux-validator` automatically engage
- **Style files** (*.css) → `mobile-tester` tests responsiveness + `ux-validator` checks consistency
- **Server issues/port conflicts** → `server-keeper` immediately engages (critical priority)
- **PWA files** (manifest.json, sw.js) → `pwa-optimizer` activates for app store readiness

## Testing Strategy
- `npm test` - Interactive watch mode
- `npm test -- --coverage` - Generate coverage report
- `npm test -- --watchAll=false` - Single run for CI
- **Test files location**: `src/components/[Component]/__tests__/[Component].test.tsx`
- **Current coverage**: Limited - focus on critical booking flow components first

## Current Status
✅ **Complete**: Auth, Questionnaire (9-step + privacy), Dashboard, Professional Assignments View, Booking flow, Achievement, 4D logo system, Safe Ride Fund integration
⚠️ **Critical Needs**: Test coverage (only App.test.tsx exists), PWA service worker, payment integration, location search page improvements
🔜 **Planned**: Real-time tracking, push notifications, offline mode

## Key Utility Functions
- **timeEstimate** (`src/utils/timeEstimate.ts`) - Standardized time formatting across app
- **seasonalThemes** (`src/utils/seasonalThemes.ts`) - Dynamic seasonal theming
- **dynamicPersonalization** (`src/utils/dynamicPersonalization.ts`) - User-specific content
- **protectionPricingCalculator** (`src/utils/protectionPricingCalculator.ts`) - Protection service pricing logic
- **assignmentHistory** (`src/utils/assignmentHistory.ts`) - Protection assignment tracking and history
- **siaVerification** (`src/utils/siaVerification.ts`) - SIA license verification utilities
- **martynsLawCompliance** (`src/utils/martynsLawCompliance.ts`) - Martyn's Law compliance checking
- **venueSecurityCalculator** (`src/utils/venueSecurityCalculator.ts`) - Venue protection pricing and requirements

## Critical Implementation Notes

### Questionnaire System (`/src/data/questionnaireData.ts`)
Dynamic 9-step system with privacy options. Enhanced mobile typography (1.4-1.5rem) and `calc(100vw - 8px)` width utilization.

### Protection Assignment System
**New Unified System** (`src/contexts/ProtectionAssignmentContext.tsx`):
- Replaces legacy booking system with professional protection terminology
- Complete flow: WhereWhenView → UnifiedProtectionBooking → ProtectionAssignmentConfirmation → ProtectionAssignmentSuccess
- State management with `useProtectionAssignment` hook and `ProtectionAssignmentProvider`
- Backward compatibility maintained with legacy `useBooking` hook

**Legacy Booking Flow** (being phased out):
- Original flow: VehicleSelection → LocationPicker → BookingConfirmation → BookingSuccess
- State managed in App.tsx BookingFlow component (`src/App.tsx:17-95`)
- Error boundary wrapper: `BookingErrorBoundary` component

**Geographic Integration**:
- Coverage area validation for England & Wales boundaries
- Regional pricing calculation based on service location
- Airport specialist availability checking for major airports
- Automatic routing between major cities with time estimates

**Test Data**: Available in `src/utils/testUserScenarios.ts` for development testing

### Professional Assignments View (`src/components/AssignmentsView/`)
Premium close protection command centre with professional terminology:
- Protection duration tracking with progress indicators
- CPO credentials including SIA licenses, experience, and specializations
- Security-focused status messages (Protection Detail Active, CPO Approaching, etc.)
- Service tier badges (Essential/Executive/Shadow) with professional color coding
- Professional action buttons (Live Tracking, Contact CPO, Emergency)

### WelcomePage Features (`src/components/Auth/WelcomePage.tsx`)
- **Animated impact counter**: Shows 3,741+ safe rides with random increments
- **Seasonal themes**: Dynamic theming based on date
- **Credentials modal**: Development mode toggle for testing
- **Safe Ride Fund integration**: Prominent CTAs and donation modal

### Authentication & User Types
Three distinct user types with different capabilities:
- **Registered**: Full protection booking + 50% rewards
- **Google**: Same as registered
- **Guest**: Quote-only mode, no direct protection booking

### Venue Protection & Event Security
**Venue Protection Services** (`src/components/VenueProtection/`):
- Professional venue security management
- Day/weekend/monthly/annual contract pricing
- 1-10 officer scaling with tier-based services
- Specialized security assessments and compliance

**Wedding & Event Security** (`src/components/WeddingEventSecurity/`):
- Specialized event protection services
- Custom security planning for special occasions
- Professional discrete protection for high-profile events

### Compliance & Regulatory Components
**SIA License Integration**:
- `siaVerification` utility (`src/utils/siaVerification.ts`) - License status checking
- Martyn's Law compliance checking (`src/utils/martynsLawCompliance.ts`)
- Professional standards certification tracking

**Geographic Compliance**:
- England & Wales service boundary enforcement
- Regional regulatory variation handling
- Airport security protocol integration
- Cross-border service restrictions (Scotland/NI)

## Important Code Patterns

### Achievement System
- Triggers after questionnaire completion
- Components: `AchievementUnlock`, `AchievementBanner`, `MiniAchievement`
- Confetti animation library included
- Achievement data in `src/components/Achievement/achievementData.ts`

### Loading States
- Use `LoadingSpinner`, `SkeletonLoader`, or `ProgressIndicator` components
- Never use external loading libraries
- All loading states must be mobile-optimized

### Form Validation
- Client-side only (no server validation yet)
- Use HTML5 validation attributes
- Error messages in component state, not global

## Common Troubleshooting

### Horizontal Scrolling Issues
Check: `global-container.css` and `card-standards.css` for viewport calculations. Cards use `calc(100vw - 36px)` to prevent overflow.

### Component Not Rendering
Verify view state in `AppContext` and check if component is included in App.tsx view switching logic.

### Styling Not Applied
Ensure CSS Module imports use correct syntax: `import styles from './Component.module.css'`

### Professional Terminology Requirements
When updating any UI text, ensure professional close protection language:
- "Driver" → "Protection Officer/CPO"
- "Ride/Trip" → "Assignment/Protection Detail"
- "Passenger" → "Principal"
- "Standard" → "Essential" (for protection tier)
- "In Progress" → "Protection Detail Active"
- "En Route" → "CPO Approaching Principal"

## Development Workflow Best Practices

### Before Making Changes
1. **Always run `npm run build` after changes**: This project has no separate lint command - type checking happens during build
2. **Test on multiple breakpoints**: Use mobile viewport tester hook to verify no horizontal scrolling
3. **Follow existing patterns**: Study similar components before creating new ones
4. **Use TypeScript strict mode**: All new code must be properly typed

### Common Debugging Steps
1. **State issues**: Check AppContext state and view navigation logic in App.tsx
2. **Styling issues**: Verify CSS Module imports and check responsive breakpoints
3. **Build failures**: Run `npm run build` to catch type errors before committing
4. **Mobile issues**: Use `npm run hooks:start` to enable mobile viewport testing

### File Conventions
- Components: PascalCase with matching .module.css files
- Utilities: camelCase in `/src/utils/`
- Types: Centralized in `/src/types/index.ts`
- Data: Static data in `/src/data/`

## State Management Architecture

### Context Providers
The app uses React Context for state management with two main contexts:

1. **AppContext** (`src/contexts/AppContext.tsx`):
   - Global application state (user, currentView, device capabilities)
   - View-based routing without React Router
   - Subscription and authentication management

2. **ProtectionAssignmentContext** (`src/contexts/ProtectionAssignmentContext.tsx`):
   - Protection booking/assignment state management
   - Service selection, location picking, payment methods
   - Backward compatibility with legacy booking system
   - Persistent storage with localStorage integration

### Hook Usage
- `useAppContext()` - Access global app state and navigation
- `useProtectionAssignment()` - Access protection assignment state (new system)
- `useBooking()` - Legacy hook for backward compatibility (being phased out)

Last updated: 2025-09-21T17:56:36.886Z