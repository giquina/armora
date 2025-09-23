# 🛡️ Armora Security Transport

Premium close protection and security transport services across England & Wales. Nationwide service delivery with SIA-licensed Close Protection Officers (CPOs). Mobile-first Progressive Web App targeting app store distribution.

## 🚀 Quick Start

```bash
npm install
npm start          # Start development server (localhost:3000)
npm run dev        # Start with hooks system + orchestration
npm run build      # Production build with type checking
npm test           # Run tests in watch mode
npm run test:e2e   # Run Playwright end-to-end tests
```

## 📱 Mobile-First Development

- **CRITICAL**: No horizontal scrolling on any screen size (320px+)
- Touch-friendly design with 44px+ button targets
- Progressive Web App ready for app stores
- Dark theme (#1a1a2e) with golden accents (#FFD700)

## 🏗️ Architecture

- **View-based Routing**: No React Router - uses AppContext `currentView` state
- **User Flow**: splash → welcome → login/signup/guest-disclaimer → questionnaire → achievement → home → booking → hub → account
- **Protection Tiers**: Essential (£65/h) | Executive (£95/h) | Shadow (£125/h) | Client Vehicle (£55/h)
- **State Management**: React Context with useReducer (no Redux)
- **User Types**: registered | google | guest (with different capabilities)

## 🔧 Development Commands

### Core Commands
- `npm start` - Development server (localhost:3000)
- `npm run build` - Production build with type checking
- `npm test` - Run tests in watch mode
- `npm run dev` - Start with full hooks system

### Hooks System
- `npm run hooks:start` - Start all development hooks
- `npm run hooks:status` - Show hook status
- `npm run hooks:stop` - Stop all hooks
- `npm run hooks:restart` - Restart all hooks
- `npm run hooks:emergency` - Emergency stop

### Task Management
- `npm run suggest` - Get AI task suggestions
- `npm run task-status` - View current tasks
- `npm run add-task` - Add new task
- `npm run complete-task` - Mark task complete
- `npm run start-task` - Start working on task

### Documentation
- `npm run update-docs` - Update all documentation
- `npm run project-health` - Check project health

### Agents
- `npm run agents` - Interactive agent selector
- `npm run agents:start/status/test/file` - Agent management commands
- `npm run orchestrate:status` - View active agents and system status

## 📊 Project Status

✅ **Complete**:
- Authentication system (registered/Google/guest)
- 9-step questionnaire with privacy options
- Dashboard with protection tier selection
- Professional Hub View with NavigationCards and Active Protection Panel
- Complete protection assignment booking flow (dual system)
- Achievement celebrations with confetti
- 4D premium logo system
- Safe Ride Fund integration (3,741+ rides)
- Assignment state tracking with panic alerts
- Professional close protection terminology throughout

⏳ **In Progress**:
- PWA service worker implementation
- App store preparation (iOS/Android ready)
- Payment integration (Stripe + multiple methods)
- Real-time tracking system

🔜 **Planned**:
- Push notifications
- Offline mode
- Multi-language support
- Advanced analytics dashboard

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 + TypeScript 4.9.5 (strict mode)
- **Styling**: CSS Modules (no CSS-in-JS libraries)
- **State**: React Context + useReducer (no Redux)
- **Build**: Create React App 5.0.1 (react-scripts)
- **Testing**: Jest + React Testing Library + Playwright (E2E)
- **Maps**: Leaflet + react-leaflet
- **Payments**: Stripe (@stripe/react-stripe-js)
- **PWA**: Service Workers + Manifest (app store ready)

## 📱 Device Support

- **Mobile**: 320px - 768px (primary target)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+ (enhanced experience)

## 🎨 Design System

- **Colors**: 
  - Primary: #1a1a2e (Navy)
  - Accent: #FFD700 (Gold)
  - Text: #e0e0e0
- **Typography**: System fonts, 1.4-1.5rem mobile
- **Spacing**: 8px grid system
- **Touch**: 44px minimum targets

## 📂 Project Structure

```
armora/
├── src/
│   ├── components/     # React components
│   │   ├── Auth/       # Authentication flow
│   │   ├── Dashboard/  # Protection tier selection
│   │   ├── Hub/        # Professional protection command centre
│   │   ├── Booking/    # Protection booking flow
│   │   ├── ProtectionAssignment/  # New unified booking system
│   │   ├── VenueProtection/       # Venue security services
│   │   └── UI/         # Shared UI components (ArmoraLogo, etc.)
│   ├── contexts/       # Global state (AppContext, ProtectionAssignmentContext)
│   ├── styles/         # CSS modules, variables, design system
│   ├── types/          # TypeScript interfaces (940+ line comprehensive types)
│   ├── utils/          # Utility functions (pricing, compliance, verification)
│   └── data/           # Static data (questionnaires, achievements)
├── .claude/            # AI development tools
│   ├── agents/         # 6 specialized agents (mobile-tester, pwa-optimizer, etc.)
│   ├── commands/       # Slash commands and orchestration
│   └── tasks/          # Task management system
├── dev-tools/          # Development utilities
│   └── hooks/          # 9 development hooks (mobile viewport, brand compliance, etc.)
├── tests/e2e/          # Playwright end-to-end tests
└── docs/               # Comprehensive documentation (25+ files)
```

## 🚀 Deployment

The app is configured for deployment as a Progressive Web App, ready for:
- Google Play Store (via TWA)
- Apple App Store (via WebView wrapper)
- Direct web access

## 🤝 Contributing

1. **Always run `npm run build`** after changes (no separate lint command - type checking in build)
2. **Use `npm run dev`** for development with hooks system + orchestration
3. **Ensure no horizontal scrolling** on mobile (320px+ tested automatically)
4. **Follow TypeScript strict mode** - all new code must be properly typed
5. **Professional terminology** - use CPO, Principal, Protection Detail (not driver/passenger/ride)
6. **Test on real devices** and run `npm run test:e2e` for E2E tests
7. **Use AI assistance** - `npm run suggest` for task suggestions and agent orchestration

## 📄 License

Proprietary - Armora Security Transport Ltd.

---

Last updated: 2025-09-23T18:47:06.472Z
