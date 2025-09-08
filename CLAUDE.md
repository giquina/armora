# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React TypeScript application for a premium security transport service. The app features a multi-step onboarding flow through a questionnaire system, authentication (including guest mode), and a dashboard interface. The project emphasizes mobile-first design with strict no-horizontal-scrolling requirements.

## Development Commands

### Primary Commands
- `npm start` - Start development server (opens on http://localhost:3000)
- `npm run build` - Build for production  
- `npm test` - Run tests in watch mode (Note: Test setup in progress)
- `npm run dev` - Start development with hooks system

### Hooks System
The project includes a sophisticated development hooks system for mobile-first development:
- `npm run hooks:start` - Start all development hooks
- `npm run hooks:stop` - Stop all hooks gracefully  
- `npm run hooks:status` - Show hook status
- `npm run hooks:restart` - Restart all hooks
- `npm run hooks:emergency` - Emergency stop (force kill)
- `npm run hooks:help` - Show detailed hooks help

### Task Management Commands
- `npm run suggest` - Get AI-generated task suggestions based on codebase analysis
- `npm run select-suggestion` - Select a task to work on
- `npm run add-task` - Add a custom task to the queue
- `npm run complete-task` - Mark current task as completed
- `npm run start-task` - Start working on a selected task
- `npm run task-status` - View current task status
- `npm run refresh-suggestions` - Regenerate task suggestions

The hooks system includes:
- **Auto GitHub Saver**: Automatically commits and pushes work every 5 minutes
- **Dev Server Monitor**: Keeps dev server running with mobile QR codes
- **Mobile Viewport Tester**: Tests all screen sizes and prevents horizontal scrolling
- **Brand Compliance Monitor**: Enforces Armora colors and mobile standards
- **File Structure Organizer**: Maintains organized file structure
- **Codebase Reviewer**: AI-powered code analysis and task suggestions
- **Subagent Manager**: Coordinates specialized development agents

## Architecture

### Application Structure
The app follows a single-page application pattern with view-based routing managed in `App.tsx`:
- **Views**: `welcome` | `login` | `signup` | `guest-disclaimer` | `questionnaire` | `dashboard`
- **User Types**: `registered` | `google` | `guest`
- **State Management**: React hooks with localStorage persistence

### Key Components

#### Core Flow Components
- `SplashScreen` - 3-second branded loading screen
- `WelcomePage` - Landing page with sign-in/sign-up/guest options
- `LoginForm`/`SignupForm` - Authentication forms with Google Sign-In integration
- `GuestDisclaimer` - Guest mode warning and account creation prompt
- `QuestionnaireFlow` - Multi-step onboarding questionnaire (9 steps)
- `Dashboard` - Main application interface post-onboarding

#### Component Organization
```
src/components/
├── Auth/           - Authentication related components
├── Questionnaire/  - Multi-step questionnaire system
└── Dashboard/      - Main dashboard interface
```

### Data Management
- `QuestionnaireData` interface defines the complete questionnaire data structure (9 steps)
- `questionnaireSteps` array contains all step configurations, options, and content
- `questionnaireData.ts` serves as the single source of truth for questionnaire logic
- User data and questionnaire completion stored in localStorage with error handling

### Mobile-First Requirements
- **CRITICAL**: No horizontal scrolling allowed on any screen size
- Touch-friendly design with 44px+ button targets
- Progressive Web App capabilities
- Real-time mobile viewport testing via hooks system
- Armora brand compliance enforcement

## Business Context
Armora provides premium security transport services with three service levels:
- **Armora Standard**: Professional security transport (£45/hour)
- **Armora Executive**: Luxury security transport (£75/hour)  
- **Armora Shadow**: Independent security escort service (£65/hour, most popular)

The questionnaire collects comprehensive client preferences including frequency, priorities, coverage areas, service types, routes, special requirements, emergency contacts, and service level selection.

## Specialized Agents
The project includes specialized Claude Code agents in `.claude/agents/` for task-specific workflows:
- **auth-forms-specialist**: Authentication and form handling expert
- **navigation-flow-manager**: App navigation and routing specialist  
- **pwa-appstore-specialist**: Progressive Web App and app store expert
- **responsive-animation-expert**: Responsive design and animation specialist
- **ui-component-builder**: UI component development expert

Use `/agents` command to view, create, edit, or delete agents. These agents provide specialized context and tools for their specific domains.

## Development Guidelines
- Use existing component patterns and styling approaches
- Maintain TypeScript strict typing throughout
- Follow the established mobile-first CSS patterns
- Leverage the hooks system for development workflow
- All UI must pass mobile viewport testing before deployment
- Components should handle loading, error, and empty states appropriately
- Utilize specialized agents for task-specific development workflows

Last updated: 2025-09-08T13:29:50.738Z