# 🛡️ Armora Security Transport

Premium VIP security transport mobile app built with React TypeScript + PWA for app store distribution.

## 🚀 Quick Start

```bash
npm install
npm start          # Start development server
npm run dev        # Start with hooks system
npm run build      # Production build
npm test           # Run tests
```

## 📱 Mobile-First Development

- **CRITICAL**: No horizontal scrolling on any screen size (320px+)
- Touch-friendly design with 44px+ button targets
- Progressive Web App ready for app stores
- Dark theme (#1a1a2e) with golden accents (#FFD700)

## 🏗️ Architecture

- **SPA Pattern**: Single-page app with view-based routing
- **User Flow**: Splash → Welcome → Auth → Questionnaire → Dashboard → Booking
- **Service Levels**: Standard (£45/hr) | Executive (£75/hr) | Shadow (£65/hr)
- **State Management**: React Context with useReducer (no Redux)

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
- Dashboard with service selection
- Complete booking flow
- Achievement celebrations
- 4D premium logo system
- Safe Ride Fund integration (3,741+ rides)

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
- **Styling**: CSS Modules (no CSS-in-JS)
- **State**: React Context + useReducer
- **Build**: Create React App 5.0.1
- **Testing**: Jest + React Testing Library
- **PWA**: Service Workers + Manifest

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

Last updated: 2025-09-13T21:40:16.951Z
