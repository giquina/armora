# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React 19.1.1 TypeScript application for premium VIP security transport service. Mobile-first Progressive Web App targeting app store distribution.

**PASSENGER-FOCUSED**: Write all UI copy from the passenger's perspective, emphasizing safety benefits and convenience over technical features.

## Core Development Commands
- `npm start` - Start development server (localhost:3000)
- `npm run build` - Production build with type checking
- `npm test` - Run tests in watch mode (Jest + React Testing Library)
- `npm test -- --coverage` - Coverage report
- `npm test -- --watchAll=false` - Single test run (CI)

## Development Infrastructure
Includes automated hooks system and AI task management:
- `npm run dev` - Start with hooks system
- `npm run hooks:start/stop/status` - Manage development hooks
- `npm run suggest` - AI task suggestions
- `npm run update-docs` - Update documentation
- `npm run agents` - Manage specialized agents (.claude/agents/)

**Hooks System**: 7 tools including mobile viewport tester (prevents horizontal scrolling), auto-saver, dev server monitor, and brand compliance.

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

### Component Architecture
**Full-screen views** (bypass AppLayout): splash, welcome, auth, questionnaire, achievement  
**App-wrapped views** (include header): dashboard, booking, profile

### Key File Structure
```
src/
├── App.tsx                     - Main router with view switching
├── contexts/AppContext.tsx     - Global state management
├── types/index.ts              - TypeScript interfaces (234 lines)
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

## Mobile-First Design (CRITICAL: No horizontal scrolling 320px+)
- **Colors**: #1a1a2e (navy), #FFD700 (gold), #e0e0e0 (text)  
- **Touch targets**: 44px+ minimum
- **Typography**: Aggressive mobile sizing (1.4-1.5rem), system fonts
- **Layout**: `calc(100vw - 8px)` width utilization, 8px grid spacing

## Specialized Agents (`.claude/agents/`)
5 agents for specialized development: mobile-tester, pwa-optimizer, ux-validator, booking-flow-manager, server-keeper

## Development Standards
- **Mobile-first**: Start at 320px, NO horizontal scrolling allowed
- **TypeScript strict mode**: All components typed
- **CSS Modules**: Component-scoped styling
- **Testing**: Jest + React Testing Library (only App.test.tsx exists currently)
- **Error handling**: Components handle loading/error/empty states

## Current Status
✅ **Complete**: Auth, Questionnaire (9-step + privacy), Dashboard, Booking flow, Achievement, 4D logo system  
⏳ **Needs**: Test coverage (critical), PWA service worker, payment integration, real-time tracking

## Critical Implementation Notes

### Questionnaire System (`/src/data/questionnaireData.ts`)
Dynamic 9-step system with privacy options. Enhanced mobile typography (1.4-1.5rem) and `calc(100vw - 8px)` width utilization.

### Booking Flow Architecture
Complete flow: VehicleSelection → LocationPicker → BookingConfirmation → BookingSuccess. State managed in App.tsx BookingFlow component with service level selection and location handling.

### TypeScript Configuration  
Strict mode enabled with React 19 JSX transform. All interfaces in `/src/types/index.ts` (234 lines).

Last updated: 2025-09-10