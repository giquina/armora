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
- `npm test -- --watchAll=false` - Single test run (CI)

## Development Infrastructure
Includes automated hooks system and AI task management:
- `npm run dev` - Start with hooks system
- `npm run hooks:start/stop/status/restart/emergency` - Manage development hooks
- `npm run suggest` - AI task suggestions via codebase analysis
- `npm run add-task/complete-task/start-task/task-status` - Task management system
- `npm run update-docs` - Update documentation automatically
- `npm run project-health` - Check overall project health
- `npm run agents` - Manage specialized agents (.claude/agents/)

**Hooks System**: 7 tools including mobile viewport tester (prevents horizontal scrolling), auto-saver, dev server monitor, and brand compliance.

**Task Management**: Integrated AI-powered suggestion system tracks development tasks, priorities, and completion status through `.claude/` directory.

## Architecture

### Core Stack
- **React 19.1.1** + **TypeScript 4.9.5** (strict mode)
- **CSS Modules** for component styling
- **React Context** for state (no Redux)
- **Create React App 5.0.1** build system

### State Management Pattern
**View-based routing** via AppContext `currentView` state instead of URL routing:
- Views: `splash` → `welcome` → `login`/`signup`/`guest-disclaimer` → `questionnaire` → `achievement` → `dashboard` → `booking` → `profile`
- User types: `registered` | `google` | `guest`
- Navigation: `navigateToView(viewName)` function
- Persistence: localStorage for user data and questionnaire responses

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
├── types/index.ts              - TypeScript interfaces (293 lines)
├── components/
│   ├── Auth/                   - Authentication flow
│   ├── Questionnaire/          - 9-step onboarding system  
│   ├── Dashboard/              - Service selection
│   ├── Booking/                - Complete booking flow
│   ├── UI/ArmoraLogo.tsx       - Premium 4D logo system
│   └── Layout/AppLayout.tsx    - Header with navigation
└── data/questionnaireData.ts   - Dynamic questionnaire logic
```

## Premium 4D Logo System (`ArmoraLogo.tsx`)
Multi-layered shield with 4D effects, metallic textures, orbital animations. Responsive scaling 320px+.

**Usage**: `<ArmoraLogo size="hero|large|medium|small" variant="animated|full|compact|minimal" />`
- **Global consistency**: SplashScreen (hero), WelcomePage (large), AppLayout header (small)

## Business Context
**Service Levels**: Standard (£45/h), Executive (£75/h), Shadow (£65/h - most popular 67%)  
**User Journey**: splash → welcome → auth → questionnaire → achievement → dashboard → booking  
**User Capabilities**: Registered/Google users get direct booking + 50% reward; guests get quotes only

## CSS Architecture & Design System

### Global Styling Structure
- **CSS Modules** for component-scoped styles
- **Central design system** via `/src/styles/variables.css` (93 lines)
- **Card standardization** via `/src/styles/card-standards.css` for consistent UI
- **Global container** system via `/src/styles/global-container.css` (286 lines)
- **Master width control**: `--content-max-width: 680px` across all views

### Mobile-First Design (CRITICAL: No horizontal scrolling 320px+)
- **Colors**: #1a1a2e (navy), #FFD700 (gold), #e0e0e0 (text)  
- **Touch targets**: 44px+ minimum (`--touch-target` CSS variable)
- **Typography**: Aggressive mobile sizing (1.4-1.5rem), system fonts
- **8px grid spacing**: `--space-xs: 4px` through `--space-xxl: 48px`
- **Viewport constraints**: Cards use `calc(100vw - 36px)` to account for borders

## Specialized Agents (`.claude/agents/`)
5 agents for specialized development: mobile-tester, pwa-optimizer, ux-validator, booking-flow-manager, server-keeper

## Development Standards
- **Mobile-first**: Start at 320px, NO horizontal scrolling allowed
- **TypeScript strict mode**: All components typed
- **CSS Modules**: Component-scoped styling
- **Testing**: Jest + React Testing Library (only App.test.tsx exists currently)
- **Error handling**: Components handle loading/error/empty states

## Testing Commands
- `npm test` - Interactive watch mode
- `npm test -- --coverage` - Generate coverage report
- `npm test -- --watchAll=false` - Single run for CI
- **Current coverage**: Minimal (only App.test.tsx exists)

## Current Status
✅ **Complete**: Auth, Questionnaire (9-step + privacy), Dashboard, Booking flow, Achievement, 4D logo system  
⏳ **Needs**: Test coverage (critical), PWA service worker, payment integration, real-time tracking

## Critical Implementation Notes

### Questionnaire System (`/src/data/questionnaireData.ts`)
Dynamic 9-step system with privacy options. Enhanced mobile typography (1.4-1.5rem) and `calc(100vw - 8px)` width utilization.

### Booking Flow Architecture
Complete flow: VehicleSelection → LocationPicker → BookingConfirmation → BookingSuccess. State managed in App.tsx BookingFlow component with service level selection and location handling.

### TypeScript Configuration  
Strict mode enabled with React 19 JSX transform. All interfaces in `/src/types/index.ts`.

### Authentication & User Types
Three distinct user types with different capabilities:
- **Registered**: Full booking + 50% rewards
- **Google**: Same as registered  
- **Guest**: Quote-only mode, no direct booking

## Critical Fixes Applied

### Card Border Visibility Issue (2025-09-10)
**Problem**: Right borders of cards were being cut off due to overflow constraints.
**Root Causes**: 
- Global `max-width: 100%` on all elements in `globals.css`
- `overflow-x: hidden` on #root and .App containers
- Card width calculation `calc(100vw - 32px)` didn't account for 2px borders

**Fixes Applied**:
- Changed card width to `calc(100vw - 36px)` in `card-standards.css`
- Removed global max-width constraint, applied only to media elements
- Changed containers to `overflow-x: visible` to show borders

**Result**: All card borders now fully visible across all device breakpoints.

## Common Troubleshooting

### Horizontal Scrolling Issues
Check: `global-container.css` and `card-standards.css` for viewport calculations. Cards use `calc(100vw - 36px)` to prevent overflow.

### Component Not Rendering
Verify view state in `AppContext` and check if component is included in App.tsx view switching logic.

### Styling Not Applied
Ensure CSS Module imports use correct syntax: `import styles from './Component.module.css'`

Last updated: 2025-09-11