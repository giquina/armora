# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React TypeScript application for a premium VIP security transport service (similar to Uber but with professional security officers). The project is currently in early development with a fresh Create React App foundation and extensive development infrastructure already configured. The goal is to build a mobile-first Progressive Web App ready for app store distribution.

## Development Commands

### Primary Commands
- `npm start` - Start development server (opens on http://localhost:3000)
- `npm run build` - Build for production  
- `npm test` - Run tests in watch mode
- `npm run dev` - Start development with hooks system

### Advanced Development Infrastructure
The project includes a sophisticated hooks system for mobile-first development:
- `npm run hooks:start` - Start all development hooks
- `npm run hooks:stop` - Stop all hooks gracefully  
- `npm run hooks:status` - Show hook status
- `npm run hooks:restart` - Restart all hooks
- `npm run hooks:emergency` - Emergency stop (force kill)
- `npm run hooks:help` - Show detailed hooks help

### AI-Powered Task Management
- `npm run suggest` - Get AI-generated task suggestions based on codebase analysis
- `npm run select-suggestion` - Select a task to work on
- `npm run add-task` - Add a custom task to the queue
- `npm run complete-task` - Mark current task as completed
- `npm run start-task` - Start working on a selected task
- `npm run task-status` - View current task status
- `npm run refresh-suggestions` - Regenerate task suggestions

The hooks system includes 7 specialized development tools:
- **Auto GitHub Saver**: Automatically commits and pushes work every 5 minutes
- **Dev Server Monitor**: Keeps dev server running with mobile QR codes
- **Mobile Viewport Tester**: CRITICAL - Tests all screen sizes and prevents horizontal scrolling
- **Brand Compliance Monitor**: Enforces Armora colors and mobile standards
- **File Structure Organizer**: Maintains organized file structure
- **Codebase Reviewer**: AI-powered code analysis and task suggestions
- **Subagent Manager**: Coordinates specialized development agents

## Project Architecture

### Current Development State
This is a fresh Create React App project with:
- **React 19.1.1** with TypeScript 4.9.5
- Basic App.tsx with default React template
- Comprehensive development infrastructure configured
- Extensive documentation and planning completed
- Component directories created but not yet implemented

### Planned Application Structure
The app will follow a single-page application pattern with view-based routing:
- **Views**: `splash` | `welcome` | `login` | `signup` | `guest-disclaimer` | `questionnaire` | `dashboard` | `booking`
- **User Types**: `registered` | `google` | `guest`
- **State Management**: React hooks with localStorage persistence

### Component Structure (To Be Implemented)
```
src/
├── components/
│   ├── Auth/           - Authentication system
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomePage.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── GuestDisclaimer.tsx
│   ├── Questionnaire/  - Multi-step onboarding (9 steps)
│   │   ├── QuestionnaireFlow.tsx
│   │   ├── QuestionnaireStep.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── PersonalizationEngine.tsx
│   ├── Dashboard/      - Service selection interface
│   │   ├── Dashboard.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── RewardBanner.tsx
│   │   └── PersonalizedRecommendation.tsx
│   └── Booking/        - Booking flow components
├── data/               - Configuration and mock data
│   ├── questionnaireData.ts
│   └── servicesData.ts
├── utils/              - Helper functions
│   └── recommendationEngine.ts
├── types/              - TypeScript interfaces
└── styles/             - Mobile-first CSS
    ├── App.css
    ├── Dashboard.css
    └── customScrollbars.css
```

## Business Context & Requirements

### Service Offering
Armora provides premium security transport with three service levels:
- **Armora Standard**: Professional security transport (£45/hour)
- **Armora Executive**: Luxury security transport (£75/hour)  
- **Armora Shadow**: Independent security escort service (£65/hour, most popular - 67% selection rate)

### User Journey Flow (To Be Implemented)
1. **SplashScreen** - 3-second branded loading with Armora branding
2. **WelcomePage** - Landing with sign-in/sign-up/guest options
3. **Authentication** - Email/password, Google OAuth, or guest access
4. **GuestDisclaimer** - Guest limitations and upgrade path (guest users only)
5. **QuestionnaireFlow** - 9 adaptive personalization questions
6. **AchievementScreen** - Gamified reward unlock (50% off first ride)
7. **Dashboard** - Service selection with personalized recommendations
8. **BookingFlow** - Pickup/dropoff selection and confirmation

### User Type Capabilities
| Feature | Registered | Google | Guest |
|---------|------------|--------|-------|
| Direct Booking | ✅ | ✅ | ❌ |
| 50% Reward | ✅ | ✅ | ❌ |
| Personalization | ✅ | ✅ | ✅ |
| Quote Access | ✅ | ✅ | ✅ |

## Mobile-First Design Requirements

### Critical Standards
- **CRITICAL**: No horizontal scrolling allowed on any screen size (320px minimum)
- Touch-friendly design with 44px+ button targets
- One-handed use optimization
- Thumb-friendly navigation zones

### Design System
- **Primary Color**: #1a1a2e (Dark Navy) - professional security aesthetic
- **Accent Color**: #FFD700 (Gold) - premium VIP positioning  
- **Text**: #e0e0e0 (Light Gray) - high contrast readability
- **Typography**: System fonts for optimal mobile performance
- **Spacing**: 8px grid system with 16px, 24px, 32px standard margins

### Responsive Breakpoints
- **Mobile**: 320px - 768px (primary focus)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+ (secondary)

## Specialized Agents System
The project includes 5 specialized Claude Code agents in `.claude/agents/`:
- **mobile-tester**: Responsive testing across devices, prevents horizontal scrolling
- **pwa-optimizer**: App store preparation and PWA optimization
- **ux-validator**: Mobile user experience validation
- **booking-flow-manager**: Taxi booking logic and flow management
- **server-keeper**: Maintains localhost:3000 uptime

Use `/agents` command to view, create, edit, or delete agents. These provide specialized context for development workflows.

## Development Workflow & Standards

### Development Environment
- **GitHub Codespaces** with VS Code integration
- **Claude Code** AI development assistant
- **Hot reloading** for real-time development
- **Mobile-first testing** using browser dev tools (start at 320px width)

### Key Development Principles
- Start every component at 320px width first
- NO HORIZONTAL SCROLLING is a hard requirement
- Use the hooks system for development workflow
- Maintain TypeScript strict typing throughout
- Follow Armora brand guidelines (dark theme + gold accents)
- Components must handle loading, error, and empty states
- Utilize specialized agents for task-specific development

### Testing Requirements
- Test on iPhone SE (320px) first
- Verify no horizontal scrolling at any breakpoint
- Ensure all interactive elements are 44px+ touch targets
- Test loading performance for mobile networks
- Validate PWA functionality

## App Store Preparation Goals
- **Progressive Web App (PWA)** capabilities with proper manifest
- **Capacitor integration** for native app packaging  
- **90+ Lighthouse score** target
- **App Store distribution** ready (Google Play Store & Apple App Store)

## Development Status
- ✅ Project setup and development infrastructure
- ✅ Comprehensive documentation and planning
- ✅ Hooks system and AI-powered development tools
- ✅ Component structure and file organization planned
- ⏳ Core components implementation (next phase)
- ⏳ Authentication system
- ⏳ Questionnaire flow
- ⏳ Dashboard and booking components

Last updated: 2025-09-08T13:30:00.000Z