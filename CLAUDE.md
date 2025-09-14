# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React 19.1.1 TypeScript application for premium VIP security transport service. Mobile-first Progressive Web App targeting app store distribution.

**PASSENGER-FOCUSED**: Write all UI copy from the passenger's perspective, emphasizing safety benefits and convenience over technical features.

## Critical Dependencies
- **React 19.1.1** with new JSX Transform
- **TypeScript 4.9.5** in strict mode
- **react-scripts 5.0.1** (Create React App)
- **CSS Modules** for styling (no CSS-in-JS libraries)
- **No external UI libraries** - custom components only

## Core Development Commands
- `npm start` - Start development server (localhost:3000)
- `npm run build` - Production build with type checking
- `npm test` - Run tests in watch mode (Jest + React Testing Library)
- `npm test -- --coverage` - Coverage report
- `npm test -- --watchAll=false` - Single run (CI mode)
- `npm test -- src/components/Booking/__tests__/BookingConfirmation.test.tsx` - Run specific test file

**CRITICAL**: No separate lint/typecheck commands - always run `npm run build` to verify TypeScript correctness before committing.

## Development Infrastructure
Includes automated hooks system and AI task management:
- `npm run dev` - Start with hooks system and orchestration
- `npm run hooks:start/stop/status/restart/emergency` - Manage development hooks
- `npm run suggest` - AI task suggestions via codebase analysis
- `npm run add-task/complete-task/start-task/task-status` - Task management system
- `npm run update-docs` - Update documentation automatically
- `npm run project-health` - Check overall project health
- `npm run agents` - Manage specialized agents (.claude/agents/)
- `npm run orchestrate` - Start intelligent agent orchestration service
- `npm run orchestrate:status` - View active agents and system status

**Hooks System**: 7 tools including mobile viewport tester (prevents horizontal scrolling), auto-saver, dev server monitor, and brand compliance.

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
├── App.tsx                     - Main router with view switching
├── contexts/AppContext.tsx     - Global state management
├── types/index.ts              - TypeScript interfaces
├── components/
│   ├── Auth/                   - Authentication flow
│   ├── Questionnaire/          - 9-step onboarding system
│   ├── Dashboard/              - Service selection
│   ├── Booking/                - Complete booking flow
│   ├── UI/ArmoraLogo.tsx       - Premium 4D logo system
│   └── Layout/AppLayout.tsx    - Header with navigation
└── data/questionnaireData.ts   - Dynamic questionnaire logic
```

## Business Context
**Service Levels**: Standard (£45/h), Executive (£75/h), Shadow (£65/h - most popular 67%)
**User Journey**: splash → welcome → auth → questionnaire → achievement → dashboard → booking
**User Capabilities**: Registered/Google users get direct booking + 50% reward; guests get quotes only

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
- **armora-brand-compliance.js** - Enforces brand standards
- **auto-github-saver.js** - Automated Git operations
- **codebase-reviewer-suggester.js** - AI-powered task suggestions
- **dev-server-monitor.js** - Development server monitoring
- **file-structure-organizer.js** - Code organization
- **mobile-viewport-tester.js** - Prevents horizontal scrolling
- **hooks-manager.js** - Central hooks control

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
✅ **Complete**: Auth, Questionnaire (9-step + privacy), Dashboard, Booking flow, Achievement, 4D logo system, Safe Ride Fund integration
⚠️ **Critical Needs**: Test coverage (only App.test.tsx exists), PWA service worker, payment integration
🔜 **Planned**: Real-time tracking, push notifications, offline mode

## Key Utility Functions
- **timeEstimate** (`src/utils/timeEstimate.ts`) - Standardized time formatting across app
- **seasonalThemes** (`src/utils/seasonalThemes.ts`) - Dynamic seasonal theming
- **dynamicPersonalization** (`src/utils/dynamicPersonalization.ts`) - User-specific content

## Critical Implementation Notes

### Questionnaire System (`/src/data/questionnaireData.ts`)
Dynamic 9-step system with privacy options. Enhanced mobile typography (1.4-1.5rem) and `calc(100vw - 8px)` width utilization.

### Booking Flow Architecture
Complete flow: VehicleSelection → LocationPicker → BookingConfirmation → BookingSuccess.
- State managed in App.tsx BookingFlow component (`src/App.tsx:17-95`)
- Error boundary wrapper: `BookingErrorBoundary` component
- Test data available in `src/utils/testUserScenarios.ts`

### WelcomePage Features (`src/components/Auth/WelcomePage.tsx`)
- **Animated impact counter**: Shows 3,741+ safe rides with random increments
- **Seasonal themes**: Dynamic theming based on date
- **Credentials modal**: Development mode toggle for testing
- **Safe Ride Fund integration**: Prominent CTAs and donation modal

### Authentication & User Types
Three distinct user types with different capabilities:
- **Registered**: Full booking + 50% rewards
- **Google**: Same as registered
- **Guest**: Quote-only mode, no direct booking

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

Last updated: 2025-09-14