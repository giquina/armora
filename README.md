# 🛡️ Armora - Professional Secure Transport with Close Protection

**SIA-licensed Close Protection Officers providing secure transport as an integrated element of their protective duties.**

Professional secure transport platform built with React TypeScript + PWA, connecting clients with SIA-licensed protection officers across England & Wales.

## 🛡️ Service Overview

Armora provides **secure transport with close protection** - NOT taxi or ride-hailing services. Our SIA-licensed Close Protection Officers (CPOs) deliver integrated protective security and professional secure transport.

### What We Provide:
- ✅ **Close Protection with Secure Transport** - Licensed protective security during movement
- ✅ **Executive Protection Services** - Professional security for high-value clients
- ✅ **SIA-Licensed Officers** - All personnel hold valid SIA Close Protection licenses
- ✅ **Secure Route Planning** - Risk-assessed transportation with security protocols

### What We Are NOT:
- ❌ Private Hire Vehicle (PHV) service
- ❌ Taxi or ride-hailing platform
- ❌ Standard chauffeur service
- ❌ Transportation company

## 🚀 Quick Start

```bash
npm install
npm start          # Start development server (localhost:3001)
npm run dev        # Start with hooks system + agent orchestration
npm run build      # Production build with type checking
npm test           # Run tests
```

## 📱 Mobile-First Development

- **CRITICAL**: No horizontal scrolling on any screen size (320px+)
- Touch-friendly design with 44px+ button targets
- Progressive Web App ready for app stores
- Dark theme (#1a1a2e) with golden accents (#FFD700)

## 🏗️ Architecture

- **SPA Pattern**: Single-page app with view-based routing (NO React Router)
- **User Flow**: Splash → Welcome → Auth → Questionnaire → Achievement → Dashboard → Protection Hub
- **Protection Tiers**: Essential (£65/hr) | Executive (£95/hr) | Shadow Protocol (£125/hr)
- **State Management**: React Context with useReducer + Supabase backend
- **Database**: Supabase with protection-compliant schema

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
- `npm run agents:all` - Run all agents
- `npm run agents:critical` - Run critical agents only

## 📊 Project Status

✅ **Complete**:
- Authentication system (registered/Google/guest)
- 9-step questionnaire with privacy options
- Dashboard with protection tier selection
- Complete protection assignment flow
- Achievement celebrations
- 4D premium logo system
- Safe Assignment Fund integration (3,741+ protected assignments)
- Professional Hub with assignment tracking
- Supabase backend with SIA-compliant schema

⏳ **In Progress**:
- PWA service worker implementation
- App store preparation
- Payment integration
- Real-time tracking

🔜 **Planned**:
- Push notifications
- Offline mode
- Multi-language support
- Advanced analytics

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 + TypeScript 4.9.5
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: CSS Modules (no CSS-in-JS)
- **State**: React Context + useReducer + Supabase
- **Build**: Create React App 5.0.1
- **Testing**: Jest + React Testing Library + Playwright E2E
- **PWA**: Service Workers + Manifest
- **Payment**: Stripe integration
- **Maps**: Leaflet for location services

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
│   ├── contexts/       # Global state
│   ├── styles/         # CSS modules & variables
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Utility functions
│   └── data/           # Static data
├── .claude/            # AI development tools
│   ├── agents/         # Specialized agents
│   ├── commands/       # Slash commands
│   └── tasks/          # Task management
├── dev-tools/          # Development utilities
│   └── hooks/          # Development hooks
└── docs/               # Documentation
```

## 🚀 Deployment

The app is configured for deployment as a Progressive Web App, ready for:
- Google Play Store (via TWA)
- Apple App Store (via WebView wrapper)
- Direct web access

## 🤝 Contributing

1. Run `npm run suggest` for AI task suggestions
2. Use `npm run dev` for development with hooks
3. Ensure no horizontal scrolling on mobile
4. Follow TypeScript strict mode
5. Test on real devices

## 📄 License

Proprietary - Armora Security Transport Ltd.

---

Last updated: 2025-09-25T15:29:38.574Z
