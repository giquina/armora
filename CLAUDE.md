# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React 19.1.1 TypeScript application for premium close protection and security transport services across England & Wales. Nationwide service delivery with SIA-licensed Close Protection Officers (CPOs). Mobile-first Progressive Web App targeting app store distribution.

**NATIONWIDE SERVICE SCOPE**: Armora operates across England & Wales with regional pricing and coverage areas. Complete geographic service delivery with specialized airport services and major city coverage.

**PROFESSIONAL PROTECTION FOCUSED**: Use close protection terminology throughout - "CPO" (Close Protection Officer), "Principal" (not passenger), "Protection Detail" (not ride), "Security Assessment" (not booking review). All UI copy should reflect professional security services, not taxi/ride-sharing language.

**SIA COMPLIANCE CRITICAL**: This codebase underwent major restructuring in September 2025 for full SIA compliance. All folder names, file names, and component names now use protection terminology. See `SIA_COMPLIANCE.md` for comprehensive guidelines.

**LEGAL SERVICE DEFINITION**: Armora provides SIA-licensed Close Protection Officers (CPOs) who deliver secure transport as an integrated element of their protective duties. NOT a private hire vehicle (PHV) or taxi service.

## Critical Dependencies
- **React 19.1.1** with new JSX Transform
- **TypeScript 4.9.5** in strict mode
- **react-scripts 5.0.1** (Create React App)
- **CSS Modules** for styling (no CSS-in-JS libraries)
- **No external UI libraries** - custom components only

### Backend & Integration Dependencies
- **Supabase**: Backend database, auth, real-time (@supabase/supabase-js, @supabase/auth-helpers-react)
- **Clerk**: Modern authentication provider (@clerk/clerk-react) with fallback support
- **No Clerk Dependencies**: Project currently runs without Clerk - removed in cleanup
- **Stripe**: Payment processing (@stripe/react-stripe-js, @stripe/stripe-js)
- **Leaflet**: Maps and location services (react-leaflet)
- **QR Code**: QR code generation for assignments (qrcode)
- **Canvas Confetti**: Achievement animations (canvas-confetti)
- **Playwright**: End-to-end testing framework

## Core Development Commands
- `npm run dev` - **RECOMMENDED**: Start with hooks system AND agent orchestration (full development experience)
- `npm start` - **PRIMARY**: Development server with deprecation warnings suppressed via NODE_OPTIONS
- `PORT=3001 npm start` - Start on specific port 3001 (recommended port)
- `npm run build` - Production build with type checking
- `npm test` - Run tests in watch mode (Jest + React Testing Library)
- `npm test -- --coverage` - Coverage report
- `npm test -- --watchAll=false` - Single run (CI mode)
- `npm test -- src/components/ProtectionAssignment/__tests__/AssignmentConfirmation.test.tsx` - Run specific test file
- `npm run test:e2e` - Run Playwright end-to-end tests (tests/e2e directory)

### 🚀 Server Management
**⚠️ IMPORTANT: ALWAYS USE PORT 3001 - PORT 3000 IS BROKEN**

**Port 3000 Issue**: Due to webpack chunk loading errors and stale cache, port 3000 shows "ChunkLoadError" and fails to load. GitHub Codespaces may cache broken builds on port 3000.

**SOLUTION: Use port 3001 exclusively**

**Always use `npm run dev` for the best development experience** - it includes:
- Development server with hot reload on PORT 3001
- AI-powered hooks system (mobile viewport testing, brand compliance, auto-save)
- Specialized agent orchestration
- Real-time file monitoring and suggestions

**To keep server running in background:**
```bash
# Method 1: Recommended full development setup (auto-uses port 3001)
npm run dev

# Method 2: Basic server only - MUST specify PORT=3001
PORT=3001 npm start

# NEVER use port 3000 - it will show chunk loading errors
# npm start  # ❌ DON'T USE - defaults to broken port 3000

# Check if server is running on correct port
curl -s http://localhost:3001 | head -20
lsof -i :3001

# Kill any broken port 3000 processes
pkill -f "react-scripts start"
```

**Access URLs:**
- ✅ **Working**: http://localhost:3001
- ❌ **Broken**: http://localhost:3000 (shows ChunkLoadError)

**CRITICAL**: No separate lint/typecheck commands - always run `npm run build` to verify TypeScript correctness before committing.

**IMPORTANT DEVELOPMENT NOTES**:
- **Clerk Removed**: All Clerk-related code was removed in recent cleanup. Project uses Supabase auth only.
- **ClerkAuthWrapper.tsx**: This file was deleted - references in docs are historical.
- **Authentication Flow**: Now simplified to Supabase-only authentication system.

## Development Infrastructure
Includes automated hooks system and AI task management:
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
- Special Jest module mapping for CSS imports and assets

## Architecture

### Core Stack
- **React 19.1.1** + **TypeScript 4.9.5** (strict mode)
- **CSS Modules** for component styling
- **React Context** for state management (no Redux)
- **Create React App 5.0.1** build system

### State Management Pattern
**View-based routing** (NO React Router - uses AppContext `currentView` state):
- Views: `splash` → `welcome` → `login`/`signup`/`guest-disclaimer` → `questionnaire` → `achievement` → `home` → `assignments` → `hub` → `account`
- User types: `registered` | `google` | `guest`
- Navigation: `navigateToView(viewName)` function from AppContext
- Persistence: localStorage keys: `armoraUser`, `armoraQuestionnaireResponses`, `armoraAssignmentData`
- **Supabase Backend**: Real-time database with SIA-compliant schema

**Global State Structure** (`AppContext.tsx`):
- `useReducer` for state management (no Redux)
- Device capabilities detection (mobile, touch, orientation)
- Subscription management with tier system
- Assignment state tracking with panic alert system
- Error handling and loading states

**Backend Architecture** (`src/lib/supabase.ts`):
- **Complete Supabase Integration**: 372 lines of SIA-compliant functions
- **Real-time Features**: Assignment tracking, officer location updates
- **SIA-Compliant Schema**: protection_assignments, protection_officers, principals
- **Emergency Systems**: Panic button with location tracking
- **Geographic Search**: PostGIS-powered officer finding with radius queries
- **Payment Integration**: Stripe transactions with protection terminology

### Component Architecture
**Full-screen views** (bypass AppLayout): splash, welcome, auth, questionnaire, achievement
**App-wrapped views** (include header): dashboard, assignments, profile, hub

### Key File Structure
```
src/
├── App.tsx                               - Main router with view switching and BookingFlow component
├── contexts/
│   ├── AppContext.tsx                    - Global state management with assignment tracking
│   └── ProtectionAssignmentContext.tsx  - Protection assignment state management
├── lib/
│   └── supabase.ts                       - Supabase client with SIA-compliant functions
├── types/
│   ├── index.ts                          - Comprehensive TypeScript interfaces (940+ lines)
│   └── database.types.ts                 - Supabase-generated database types
├── components/
│   ├── Auth/                            - Authentication flow
│   ├── Questionnaire/                   - 9-step onboarding system
│   ├── Dashboard/                       - Protection tier selection
│   ├── Hub/                             - Professional protection hub command centre
│   │   ├── NavigationCards/             - Interactive assignment status navigation cards
│   │   └── ActiveProtectionPanel/       - Real-time protection detail monitoring
│   ├── HubsView/                        - Complete hub management system with search/filtering
│   ├── ProtectionAssignment/            - Complete protection assignment system
│   ├── Assignments/                     - Assignment management and history
│   ├── Officer/                         - CPO-related components (panic alerts, etc.)
│   ├── SafeAssignmentFund/              - Community safety fund components
│   ├── VenueProtection/                 - Venue security services
│   ├── WeddingEventSecurity/            - Specialized event protection
│   ├── UI/ArmoraLogo.tsx                - Premium 4D logo system
│   └── Layout/AppLayout.tsx             - Header with navigation
├── utils/
│   ├── compliance/                      - SIA compliance and terminology scanning
│   ├── database/                        - Database utility functions
│   ├── testing/                         - Testing utilities and mobile testing
│   └── [various].ts                     - Pricing, verification, and other utilities
├── data/questionnaireData.ts            - Dynamic questionnaire logic
└── styles/                              - Global CSS variables and themes

migration-scripts/                        - Database setup and migration utilities
```

## Business Context
**Nationwide Coverage**: England & Wales with regional pricing variations. London premium rates, major cities -10%, rural areas +15%, airport services +25%.

**Protection Tiers**:
- Essential Protection (£65/h): SIA Level 2, personal protection trained drivers
- Executive Shield (£95/h): SIA Level 3, corporate bodyguard services
- Shadow Protocol (£125/h): Special Forces trained, covert protection specialists
- Client Vehicle Service (£55/h): Security-trained driver for customer's vehicle

**Venue Protection Services**: Day (£450), Weekend (£850), Monthly (£12,500), Annual (£135,000) contracts with 1-10 officer scaling.

**User Journey**: splash → welcome → auth → questionnaire → achievement → home → hub
**User Capabilities**: Registered/Google users get direct protection booking + 50% reward; guests get quotes only
**Professional Standards**: All officers are SIA licensed with specializations in Executive Protection, Threat Assessment, and Medical Response

**Geographic Service Areas**:
- Primary: London & Greater London (immediate availability)
- Major Cities: Manchester, Birmingham, Leeds, Liverpool, Bristol, Cardiff
- Regional: All major towns with 2-hour response time
- Airports: Heathrow, Gatwick, Manchester, Birmingham specialists

### Safe Assignment Fund Initiative
- **Impact Counter**: Live counter showing 3,741+ safe assignments delivered (animated on WelcomePage)
- **Components**: `SafeAssignmentFundCTA`, `SafeAssignmentFundModal` with interactive contribution system
- **Development Mode**: Credentials modal always visible in dev mode (`showDevButton` in WelcomePage)

## CSS Architecture & Design System

### Global Styling Structure
- **CSS Modules** for component-scoped styles
- **Central design system** via `/src/styles/variables.css`
- **Card standardization** via `/src/styles/card-standards.css` for consistent UI
- **Global container** system via `/src/styles/global-container.css`
- **Master width control**: `--content-max-width: 680px` across all views
- **Special booking theme**: White background applied via `booking-white-theme.css`

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
- `npm test` - Interactive watch mode (Jest + React Testing Library)
- `npm test -- --coverage` - Generate coverage report
- `npm test -- --watchAll=false` - Single run for CI
- `npm run test:e2e` - Playwright end-to-end tests (./tests/e2e directory)
- **Test files location**: `src/components/[Component]/__tests__/[Component].test.tsx`
- **Current coverage**: Limited - has App.test.tsx and some booking tests
- **Jest configuration**: Custom module mapping for CSS and assets in package.json

## Current Status
✅ **Complete** (Latest Update September 2025):
- **Complete passenger app cleanup** - All driver-related code removed
- **TypeScript optimization** - All compilation errors fixed, ESLint warnings minimized
- **Dual authentication system** - Clerk integration with Supabase fallback
- **Enhanced component architecture** - New HubsView system with search/filtering
- **Professional file organization** - Migration scripts, compliance utilities
- **Performance optimization** - Bundle size optimized (382KB), clean compilation
- **SIA compliance restructuring** - Complete professional terminology implementation
- **Backend integration** - Supabase + Clerk with real-time features
- **Mobile-first design** - Responsive optimization across all breakpoints
- **Development tooling** - Advanced hooks system with deprecation warning suppression

✅ **Stable Core Features**:
- 9-step questionnaire with privacy options
- Dashboard with protection tier selection
- Professional Hub with assignment tracking
- Protection assignment flow (unified system)
- Achievement system with confetti animations
- Safe Assignment Fund integration (3,741+ assignments tracked)
- Assignment state tracking with panic alert system

⚠️ **Minor Remaining Tasks**:
- Test coverage expansion for new folder structure
- PWA service worker implementation
- Payment integration completion
- Enhanced real-time tracking features

🔜 **Planned**: Push notifications, offline mode, advanced analytics

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

### Booking Flow Architecture
The app uses a **dual booking system** transitioning from legacy to new:

**New Protection Assignment System** (Primary):
- Flow: `WhereWhenView` → `PaymentIntegration` → `ProtectionAssignmentSuccess`
- State: Managed in `ProtectionAssignmentContext.tsx`
- Error handling: `ProtectionAssignmentErrorBoundary` with state recovery
- Location: `src/contexts/ProtectionAssignmentContext.tsx`

**Legacy Booking Flow** (Being phased out):
- Embedded `BookingFlow` component in `App.tsx` (lines 62-227)
- State preservation for error recovery via localStorage
- Error boundary wrapper with retry mechanisms

### Assignment State Management
**Real-time Assignment Tracking** (`AppContext.tsx`):
- `assignmentState` tracks current protection details
- Panic alert system with location tracking
- Auto-navigation to hub when active assignment detected
- Assignment status: `scheduled` | `active` | `in_progress` | `completed` | `cancelled`

**Dual Assignment System** (Legacy + New Integration):
- **New System**: `ProtectionAssignmentContext` with unified protection flow
- **Legacy Components**: Under `src/components/ProtectionAssignment/Booking/` (being integrated)
- **Migration Status**: Folder structure updated, some TypeScript interfaces need alignment

### Questionnaire System (`/src/data/questionnaireData.ts`)
Dynamic 9-step system with privacy options. Enhanced mobile typography (1.4-1.5rem) and `calc(100vw - 8px)` width utilization.

### Professional Hub View (`src/components/Hub/`)
Premium close protection command centre with professional terminology:
- **NavigationCards System** (`NavigationCards/`): Interactive card-based navigation for current/upcoming/completed/analytics views with real-time data visualization
- **Active Protection Panel** (`ActiveProtectionPanel/`): Mobile-optimized full-screen scroll snap UX for real-time protection monitoring
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
**Simplified Authentication System**: Supabase-only authentication (Clerk removed in cleanup)
- **Supabase Auth**: Direct Supabase authentication integration
- **User Role System**: Principal, Protection Officer, Admin roles via Supabase RLS
- **Historical Note**: ClerkAuthWrapper.tsx and clerk.ts were removed in recent cleanup

Three distinct user types with different capabilities:
- **Registered**: Full protection booking + 50% rewards
- **Google**: Same as registered (via Supabase Google auth)
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
- Confetti animation library included (`canvas-confetti`)
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
Verify view state in `AppContext` and check if component is included in App.tsx view switching logic (`renderCurrentView()` function).

### Styling Not Applied
Ensure CSS Module imports use correct syntax: `import styles from './Component.module.css'`

### Test Failures
- Run `npm test` in watch mode for development
- Use `npm test -- --watchAll=false` for CI
- CSS imports are mocked via `identity-obj-proxy`
- Asset imports use `jest-transform-stub`

### Professional Terminology Requirements
When updating any UI text, ensure professional close protection language:
- "Driver" → "Protection Officer/CPO"
- "Ride/Trip" → "Assignment/Protection Detail"
- "Passenger" → "Principal"
- "Standard" → "Essential" (for protection tier)
- "Premium" → "Executive" (for mid-tier service)
- "VIP" → "Shadow Protocol" (for highest tier)
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
5. **Test issues**: Check Jest configuration in package.json for module mapping

### File Conventions
- Components: PascalCase with matching .module.css files
- Utilities: camelCase in `/src/utils/`
- Types: Centralized in `/src/types/index.ts` (comprehensive 940+ line type definitions)
- Data: Static data in `/src/data/`
- Tests: `__tests__` directories with `.test.tsx` files

## State Management Architecture

### Context Providers
The app uses React Context for state management with two main contexts:

1. **AppContext** (`src/contexts/AppContext.tsx`):
   - Global application state (user, currentView, device capabilities)
   - View-based routing without React Router
   - Subscription and authentication management
   - Assignment state with panic alert system
   - Safe Ride Fund metrics tracking

2. **ProtectionAssignmentContext** (`src/contexts/ProtectionAssignmentContext.tsx`):
   - Protection booking/assignment state management
   - Service selection, location picking, payment methods
   - Backward compatibility with legacy booking system
   - Persistent storage with localStorage integration

### Hook Usage
- `useAppContext()` - Access global app state and navigation
- `useProtectionAssignment()` - Access protection assignment state (new system)
- `useBooking()` - Legacy hook for backward compatibility (being phased out)

### Error Handling
- `ProtectionAssignmentErrorBoundary` for booking flow protection
- State recovery from localStorage after errors
- Retry mechanisms with user-friendly fallbacks

## Payment Integration
- **Stripe Integration**: Uses @stripe/react-stripe-js and @stripe/stripe-js
- **Payment Methods**: Card, Apple Pay, Google Pay, PayPal, Bank Transfer
- **Corporate Billing**: VAT handling and corporate account support
- **Payment Status Tracking**: Comprehensive status management

## Performance Considerations
- **React 19.1.1**: Uses new JSX transform for better performance
- **CSS Modules**: Scoped styles prevent global CSS pollution
- **Lazy Loading**: Components loaded on demand
- **Mobile Optimization**: Aggressive mobile-first approach with touch targets
- **Asset Optimization**: Proper handling of images and static assets

## 🚀 Quick Reference - Server Status & Commands

### Current Development Server Status:
- **Status**: ✅ RUNNING
- **URL**: http://localhost:3001 (PRIMARY PORT)
- **Process**: Clean server instance without stale webpack cache
- **Last Updated**: Port 3000 removed due to chunk loading errors

### Essential Commands:
```bash
# RECOMMENDED: Full development environment
npm run dev

# PRIMARY: Start on port 3001 (recommended)
PORT=3001 npm start

# Check if server is running
curl -s http://localhost:3001 | head -5
lsof -i :3001

# Kill servers if needed
pkill -f "react-scripts start"

# Build and test
npm run build
npm test
```

### Recent Changes:
✅ **Complete Passenger App Cleanup (Latest - September 26, 2025)**:
- **Driver App Removal**: Completely removed all driver-related repositories and code
- **Code Quality**: Fixed all TypeScript compilation errors and minimized ESLint warnings
- **Performance**: Optimized bundle size to 382KB with clean compilation
- **Authentication**: Added Clerk integration with automatic Supabase fallback
- **Architecture**: New HubsView component system with comprehensive search/filtering
- **Organization**: Restructured utilities into compliance/, database/, testing/ folders
- **Migration**: Added comprehensive migration scripts for database setup
- **Development**: Enhanced npm scripts with deprecation warning suppression

✅ **Mobile Navigation Cards Optimized**:
- Fixed text wrapping issues (CPO names no longer span 3 lines)
- Removed excessive empty spaces and improved mobile spacing
- Enhanced visual hierarchy and typography for small screens
- Optimized card heights and responsive layout across 320px-414px+
- Progressive scaling for different mobile screen sizes

---

Last updated: 2025-09-26T15:45:00.000Z