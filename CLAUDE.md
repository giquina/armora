# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React TypeScript application for a premium VIP security transport service (similar to Uber but with professional security officers). The project is currently in early development with a fresh Create React App foundation and extensive development infrastructure already configured. The goal is to build a mobile-first Progressive Web App ready for app store distribution.

**PASSENGER-FOCUSED APPROACH**: All messaging, UI copy, and user-facing content should be written from the passenger's perspective, emphasizing benefits and value to the rider rather than company features or technical capabilities. Use simple, clear language that speaks to safety benefits and convenience.

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

### Project Management Tools
- `npm run update-docs` - Update project documentation
- `npm run project-health` - Check project health status
- `npm run statusline` - Display project status information

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
This is a React TypeScript project with:
- **React 19.1.1** with TypeScript 4.9.5
- **React Router DOM 7.8.2** for navigation
- Comprehensive development infrastructure configured
- Extensive documentation and planning completed
- Core components implemented including SplashScreen, Dashboard, Questionnaire, and Auth components

### Planned Application Structure
The app will follow a single-page application pattern with view-based routing:
- **Views**: `splash` | `welcome` | `login` | `signup` | `guest-disclaimer` | `questionnaire` | `dashboard` | `booking`
- **User Types**: `registered` | `google` | `guest`
- **State Management**: React hooks with localStorage persistence

### Current Component Structure
```
src/
├── components/
│   ├── Auth/           - Authentication system (implemented)
│   ├── SplashScreen/   - App loading screen with premium 4D logo (implemented)
│   ├── Questionnaire/  - Multi-step onboarding with progress indicator (implemented)
│   ├── Dashboard/      - Service selection with cards and quick booking (implemented)
│   ├── Achievement/    - Reward unlock screens (implemented)
│   ├── Booking/        - Booking flow components (in progress)
│   ├── Profile/        - User profile management (in progress)
│   ├── Layout/         - App layout components with header logo (implemented)
│   └── UI/             - Reusable UI components including premium ArmoraLogo (implemented)
├── utils/              - Helper functions including seasonal themes
├── types/              - TypeScript interfaces with questionnaire support (implemented)
└── styles/             - Mobile-first CSS modules
```

## Premium 4D Logo System

### ArmoraLogo Component
A sophisticated 4D logo system that establishes Armora as premium security transport brand:

#### Component Location
- **ArmoraLogo.tsx** - `/src/components/UI/ArmoraLogo.tsx`
- **ArmoraLogo.module.css** - `/src/components/UI/ArmoraLogo.module.css`

#### Features
- **4D Visual Depth** - Multi-layered shield with perspective and dimensional effects
- **Premium Materials** - Metallic gold finishes, glass overlays, holographic elements
- **Advanced Animations** - Floating motion, orbital rings, energy fields, circuit flows
- **Responsive Scaling** - Perfect appearance on all screen sizes (320px+)
- **Multiple Variants** - Full, compact, minimal, animated, monochrome versions

#### Usage Examples
```tsx
// Hero logo for splash screen
<ArmoraLogo size="hero" variant="animated" showOrbits={true} />

// Header logo for navigation
<ArmoraLogo size="small" variant="compact" showOrbits={false} interactive={true} />

// Welcome page prominent display
<ArmoraLogo size="large" variant="full" showOrbits={true} />
```

#### Size Variants
- **small** - 0.7x scale for headers/navigation
- **medium** - 1x scale for standard display
- **large** - 1.3x scale for prominent placement
- **hero** - 1.8x scale for splash screens

#### Display Variants
- **full** - Complete 4D logo with all effects and orbital rings
- **compact** - Simplified version without orbits for space-constrained areas
- **minimal** - Clean shield with premium finish, no decorative elements
- **animated** - Enhanced animations for loading states and splash screens
- **monochrome** - Black/white version maintaining 3D depth

#### Global Consistency Implementation
- **SplashScreen** - Uses hero size with animated variant
- **WelcomePage** - Uses large size with full variant
- **AppLayout Header** - Uses small size with compact variant
- All implementations maintain consistent brand appearance

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
- ✅ Core components implementation (SplashScreen, Dashboard, Questionnaire, Auth)
- ✅ UI component library with modals and interactive elements
- ✅ Mobile-first responsive design system
- ⏳ Booking flow completion
- ⏳ User profile management
- ⏳ PWA implementation and app store preparation

## Key Files Reference

### Core Component Files
- **ArmoraLogo.tsx** - Premium 4D logo component (`/src/components/UI/ArmoraLogo.tsx`)
- **ArmoraLogo.module.css** - Advanced 4D CSS animations (`/src/components/UI/ArmoraLogo.module.css`)
- **AppLayout.tsx** - Main app layout with header logo (`/src/components/Layout/AppLayout.tsx`)
- **SplashScreen.tsx** - Loading screen with hero logo (`/src/components/SplashScreen/SplashScreen.tsx`)
- **WelcomePage.tsx** - Welcome screen with prominent logo (`/src/components/Auth/WelcomePage.tsx`)

### TypeScript Interface Files
- **index.ts** - Main type definitions (`/src/types/index.ts`)
- **questionnaireData.ts** - Complete questionnaire data (`/src/data/questionnaireData.ts`)

### Key Documentation Files
- **CLAUDE.md** - Main development documentation (this file)
- **README.md** - Project overview and setup instructions
- **package.json** - Dependencies and scripts

### Mobile-First CSS Architecture
All components use CSS Modules with mobile-first approach:
- Start at 320px minimum width
- NO horizontal scrolling allowed
- Touch-friendly 44px+ button targets
- Responsive breakpoints: 320px, 768px, 1024px+
- Dark navy (#1a1a2e) + gold (#FFD700) color scheme

### Development Status Update
- ✅ Premium 4D ArmoraLogo system implemented globally
- ✅ TypeScript interfaces updated for questionnaire support  
- ✅ Global logo consistency across all screens
- ✅ Advanced CSS animations with 60fps performance
- ✅ Mobile-responsive scaling (320px+)
- ✅ Multiple logo variants (full, compact, minimal, animated)

Last updated: 2025-09-08T22:25:00.000Z