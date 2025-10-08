# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Armora is a React 19.1.1 TypeScript application for premium close protection and executive security services across England & Wales. SIA-licensed Close Protection Officers (CPOs) provide nationwide service delivery. Mobile-first Progressive Web App targeting app store distribution.

**SERVICE SCOPE**: England & Wales with regional pricing variations. Complete geographic coverage with specialized airport services and major city operations.

**PROFESSIONAL TERMINOLOGY**: Use security industry terminology throughout - "CPO" (Close Protection Officer), "Principal" (not passenger), "Protection Detail" (not ride), "Security Assessment" (not booking review). All UI copy must reflect professional security services.

**SIA COMPLIANCE**: Major restructuring completed September 2025 for full SIA compliance. All components use protection terminology. See `SIA_COMPLIANCE.md` for guidelines.

## Core Stack & Dependencies
- **React 19.1.1** with new JSX Transform
- **TypeScript 4.9.5** in strict mode
- **react-scripts 5.0.1** (CRA) with CRACO customization (optimized hot reload, cache busting)
- **CSS Modules** for styling (no CSS-in-JS)
- **Supabase**: Backend, auth, real-time (@supabase/supabase-js)
- **Stripe**: Payments (@stripe/react-stripe-js)
- **React-Leaflet**: Maps and location services
- **Google Maps API**: Geocoding and location services
- **Playwright**: E2E testing framework

## Development Commands

### Essential Commands
```bash
npm run dev        # RECOMMENDED: Full dev environment with hooks & agents
npm start          # Development server (defaults to port 3000, specify with PORT=XXXX)
npm run fresh      # Clean reset and start (fixes any issues)
npm run build      # Production build with TypeScript checking (NO separate lint command)
npm test           # Jest watch mode
npm test:e2e       # Playwright end-to-end tests
```

### Server Management
```bash
npm run health     # Comprehensive health check
npm run reset      # Reset server state and cache
npm run clean      # Clean cache only
PORT=3003 npm start  # Start on specific port (no hardcoded ports)
```

**PORT CONFIGURATION**: Development ports are no longer hardcoded. Use `PORT=XXXX npm start` to specify any port. Default is 3000. Service Worker is disabled in development to prevent caching issues.

### Development Infrastructure
```bash
# Hooks System (7 active tools)
npm run hooks:start        # Start all development hooks
npm run hooks:stop         # Stop all hooks
npm run hooks:status       # Check hooks status

# AI Task Management
npm run suggest            # Get AI task suggestions
npm run select-suggestion  # Interactive task selector
npm run add-task          # Add new task
npm run complete-task     # Mark task complete
npm run start-task        # Start a task
npm run task-status       # View current task progress

# Specialized Agents (6 agents)
npm run agents:start      # Start agent orchestration
npm run agents:status     # View active agents status
npm run agents:file       # Trigger agents for specific file
```

## Architecture

### State Management (No Redux/Router)
**View-based navigation** via AppContext `currentView`:
```
splash → welcome → login/signup/guest → questionnaire → achievement → home → hub → assignments → account
```

**Three Context Providers**:
- `AppContext`: Global state, navigation, device capabilities
- `AuthContext`: Supabase authentication only (Clerk removed)
- `ProtectionAssignmentContext`: Booking/assignment state

### Key Directory Structure
```
src/
├── App.tsx                              # View-based router
├── contexts/                            # State management
│   ├── AppContext.tsx                   # Global state with assignment tracking
│   ├── AuthContext.tsx                  # Supabase auth
│   └── ProtectionAssignmentContext.tsx  # Protection bookings
├── lib/supabase.ts                      # Backend client (372 lines, SIA-compliant)
├── types/index.ts                       # TypeScript interfaces (940+ lines)
├── components/                          # 37 feature domains
│   ├── Hub/                            # Command center with NavigationCards
│   ├── ProtectionAssignment/           # Unified booking system
│   ├── Questionnaire/                  # 9-step onboarding
│   └── UI/ArmoraLogo.tsx              # Premium 4D logo
└── utils/                              # Organized utilities
    ├── compliance/                      # SIA compliance scanning
    ├── database/                        # Database utilities
    └── testing/                        # Test utilities
```

### CSS Architecture
- **CSS Modules** for component scoping
- **Design tokens**: `/src/styles/variables.css`
- **Card standards**: `/src/styles/card-standards.css`
- **Mobile-first**: 44px+ touch targets, aggressive mobile typography
- **Viewport safety**: `calc(100vw - 36px)` for cards

## Business Logic

### Protection Tiers
- **Essential** (£65/h): SIA Level 2
- **Executive** (£95/h): SIA Level 3, corporate bodyguard
- **Shadow Protocol** (£125/h): Special Forces trained
- **Client Vehicle** (£55/h): Security driver for customer's vehicle

### User Types & Capabilities
- **Registered/Google**: Direct protection booking + 50% rewards
- **Guest**: Quote-only mode, no direct booking

## Development Tools

### Automated Hooks (7 active tools in `dev-tools/hooks/`)
- **mobile-viewport-tester.js**: Prevents horizontal scrolling (320px+)
- **armora-brand-compliance.js**: Enforces professional standards
- **dev-server-monitor.js**: Auto-restart on issues
- **auto-github-saver.js**: Automated Git operations
- **codebase-reviewer-suggester.js**: AI-powered suggestions
- **file-structure-organizer.js**: Keeps project files organized
- **subagent-manager.js**: Manages AI subagents and coordination

### Specialized Agents (`.claude/agents/`)
Auto-activate based on context:
- **Component files** → `mobile-tester` + `ux-validator`
- **Style files** → Responsiveness testing
- **Server issues** → `server-keeper` (critical priority)
- **PWA files** → `pwa-optimizer`

## Critical Implementation Notes

### Dual Booking System (Transitioning)
**New System** (Primary): `ProtectionAssignmentContext`
- Flow: `WhereWhenView` → `PaymentIntegration` → `Success`

**Legacy System** (Being phased out): Embedded in `App.tsx` lines 62-227

### Authentication Flow
- **Supabase-only** (Clerk removed in cleanup)
- Three roles: Principal, Protection Officer, Admin
- Google OAuth integration via Supabase

### Professional Hub (`src/components/Hub/`)
- **NavigationCards**: Interactive assignment status cards (single column layout, full-width)
- **EnhancedProtectionPanel**: Real-time monitoring panel with three states:
  - **Collapsed** (82px): Left-aligned 3-line layout - Status • CPO info • Journey details
  - **Half** (50vh): Compact view with 3x2 button grid
  - **Full** (75vh): 2x3 button grid with no scroll, buttons display icon/title/description on separate lines
- CPO credentials with SIA licenses
- Security-focused status messages
- No decorative borders or gold lines (removed per design cleanup)

## Testing Strategy
```bash
npm test                                    # Watch mode
npm test -- --coverage                     # Coverage report
npm test -- --watchAll=false               # CI mode
npm test -- src/components/[Component]/__tests__/[Component].test.tsx  # Specific test
```

**Test Structure**: `src/components/[Component]/__tests__/`
**E2E Tests**: `tests/e2e/` directory with Playwright

## TypeScript Configuration
- **Strict mode** enabled
- Target: ES2018
- JSX: react-jsx (React 19 transform)
- Module: ESNext with Node resolution
- Lib: dom, dom.iterable, esnext, webworker (for PWA support)

## Common Troubleshooting

### Build/Type Errors
Always run `npm run build` - no separate lint command exists

### Horizontal Scrolling
Check `global-container.css` and viewport calculations

### Component Not Rendering
Verify `currentView` in AppContext and App.tsx routing logic

### Server Issues
```bash
npm run fresh      # Complete reset
npm run health     # Diagnostics
pkill -f "react-scripts start"  # Kill stuck processes
```

### Caching Issues (Chrome/Browser)
**Problem**: Changes not appearing without hard refresh + cache clear
**Solution**: Service Worker is now disabled in development mode. Close browser completely and reopen. Check DevTools → Application → Service Workers shows "None".

### Mobile Testing
Enable hooks system: `npm run hooks:start` for automatic viewport testing

## Professional Terminology Enforcement
When updating UI text:
- Driver → Protection Officer/CPO
- Ride/Trip → Assignment/Protection Detail
- Passenger → Principal
- Standard → Essential
- Premium → Executive
- VIP → Shadow Protocol
- In Progress → Protection Detail Active
- En Route → CPO Approaching Principal

## Current Status
✅ **Complete** (October 2025):
- SIA compliance restructuring
- TypeScript optimization (clean compilation)
- Supabase-only authentication (Clerk removed)
- Mobile-first responsive design
- Advanced development tooling with 7 hooks + 6 agents
- EnhancedProtectionPanel with left-aligned collapsed state
- Flexible port configuration (no hardcoded ports)
- Service Worker disabled in development (prevents caching issues)
- Hub design improvements (single-column layout, removed decorative elements)
- **Production deployment on Vercel** (https://armora.vercel.app)
- **Firebase Cloud Messaging integration** (Project: armora-protection)
- **TWA Android app built** (AAB file ready for Play Store)
- **Android App Links verification** (assetlinks.json deployed)

⚠️ **Remaining Tasks**:
- Google Play Store developer account verification and publication
- Test coverage expansion
- PWA service worker implementation (only for production)
- Payment integration completion (Stripe)

## Key Utilities
- `timeEstimate.ts`: Standardized time formatting
- `protectionPricingCalculator.ts`: Service pricing logic
- `siaVerification.ts`: License verification
- `martynsLawCompliance.ts`: Regulatory compliance
- `venueSecurityCalculator.ts`: Venue protection requirements

## Important CSS Guidelines

### EnhancedProtectionPanel Button Styling
When styling action buttons in the protection panel:
- Each button must have three text elements: icon (28px), label (13px bold), subtext (11px)
- Use `display: block` on all text elements to force line breaks
- Button class names: `.panic` (red), `.call` (green), `.extend` (amber), `.route` (blue), `.message` (purple), `.location` (gray/green when active)
- Always include gradient backgrounds and box-shadows for each button type
- Min height: 110px per button for proper spacing

### Hub Header Font Hierarchy
- Greeting text: **42px, weight 800** (most prominent)
- Date: **18px, weight 500, 75% opacity** (secondary)
- Time: **16px, weight 400, 65% opacity** (tertiary)

## Deployment Information

### Production Environment
- **Live URL**: https://armora.vercel.app
- **Hosting**: Vercel (auto-deploy from GitHub main branch)
- **Domain Verification**: https://armora.vercel.app/.well-known/assetlinks.json

### Firebase Configuration
- **Project ID**: armora-protection
- **Console**: https://console.firebase.google.com/project/armora-protection
- **Cloud Messaging**: Enabled (API V1)
- **Sender ID**: 1010601153585

### Android App Package
- **Package Name**: com.armora.protection
- **AAB File**: app-release-bundle.aab (1.9M, local only)
- **Keystore**: android.keystore (local only, not in repo)
- **Keystore Credentials**: Stored securely (not in documentation for security)
- **SHA-256 Fingerprint**: 19:45:2B:F1:4A:AC:90:49:29:31:BC:F7:8F:B8:AD:EF:AA:EA:A2:77:E5:78:E5:37:2E:CA:70:66:AB:EA:FB:D2

### Build Commands for Android
```bash
# Install Bubblewrap CLI
npm install -g @bubblewrap/cli

# Update TWA project
bubblewrap update

# Build AAB and APK
bubblewrap build
```

### Environment Variables (Vercel & Local Development)
Required in `.env.local` for development and Vercel environment variables for production:
```bash
# Firebase (Cloud Messaging)
REACT_APP_FIREBASE_API_KEY=AIzaSyCByrZaVECC1n3mebfrRqEHdLxjAO86TEU
REACT_APP_FIREBASE_AUTH_DOMAIN=armora-protection.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=armora-protection

# Supabase (Backend & Auth)
REACT_APP_SUPABASE_URL=[from Supabase dashboard]
REACT_APP_SUPABASE_ANON_KEY=[from Supabase dashboard]

# Stripe (Payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=[from Stripe dashboard]

# Google Maps (Geocoding & Maps)
REACT_APP_GOOGLE_MAPS_API_KEY=[from Google Cloud Console]
```

Last updated: 2025-10-01T09:25:00.000