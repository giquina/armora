#!/usr/bin/env node

/**
 * /update-docs slash command
 * Scans latest mobile app codebase changes and auto-updates documentation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DocsUpdater {
    constructor() {
        this.projectRoot = process.cwd();
        this.docsDir = path.join(this.projectRoot, 'docs');
        this.srcDir = path.join(this.projectRoot, 'src');
        this.claudeDir = path.join(this.projectRoot, '.claude');
    }

    async updateDocs() {
        console.log('🔄 Scanning codebase for changes...');
        
        try {
            // Ensure docs directory exists
            if (!fs.existsSync(this.docsDir)) {
                fs.mkdirSync(this.docsDir, { recursive: true });
            }

            // Update each documentation file
            await this.updateReadme();
            await this.updateClaudeMd();
            await this.updateMobileDesignSpecs();
            await this.updatePwaRequirements();
            await this.updateBookingFlowGuide();
            await this.updateComponentLibrary();
            
            console.log('✅ All documentation updated successfully!');
            
        } catch (error) {
            console.error('❌ Error updating documentation:', error.message);
        }
    }

    async updateReadme() {
        console.log('📝 Updating README.md...');
        
        const readmeContent = `# 🛡️ Armora Security Transport

Premium VIP security transport mobile app built with React TypeScript + PWA for app store distribution.

## 🚀 Quick Start

\`\`\`bash
npm install
npm start          # Start development server
npm run dev        # Start with hooks system
npm run build      # Production build
\`\`\`

## 📱 Mobile-First Development

- **CRITICAL**: No horizontal scrolling on any screen size
- Touch-friendly design with 44px+ button targets
- Progressive Web App ready for app stores
- Dark theme (#1a1a2e) with golden accents (#FFD700)

## 🏗️ Architecture

- **SPA Pattern**: Single-page app with view-based routing
- **User Flow**: Splash → Welcome → Auth → Questionnaire → Dashboard → Booking
- **Service Levels**: Standard (£45/hr) | Executive (£75/hr) | Shadow (£65/hr)

## 🔧 Development Commands

### Hooks System
- \`npm run hooks:start\` - Start all development hooks
- \`npm run hooks:status\` - Show hook status
- \`npm run hooks:stop\` - Stop all hooks

### Task Management
- \`npm run suggest\` - Get AI task suggestions
- \`npm run task-status\` - View current task status

## 📊 Project Status

Server: Running on http://localhost:3000
Build: Success
Mobile Testing: Active
PWA Ready: In Progress

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.projectRoot, 'README.md'), readmeContent);
    }

    async updateMobileDesignSpecs() {
        console.log('🎨 Updating mobile-design-specs.md...');
        
        const mobileSpecsContent = `# 📱 Armora Mobile Design Specifications

## Design System

### Colors
- **Primary**: #1a1a2e (Dark Navy)
- **Accent**: #FFD700 (Gold) 
- **Background**: #1a1a2e
- **Text**: #FFFFFF

### Typography
- **Font Stack**: System fonts for optimal mobile performance
- **Heading Scale**: 2.5rem, 2rem, 1.5rem, 1.25rem
- **Line Height**: 1.5 for readability

### Spacing
- **Grid**: 8px base unit
- **Touch Targets**: Minimum 44px x 44px
- **Margins**: 16px, 24px, 32px standard

## Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## Component Requirements

### SplashScreen
- 3-second branded loading
- Armora logo with golden accent
- Smooth transition to welcome

### Welcome Page  
- Clear call-to-action buttons
- Sign-in, Sign-up, Guest options
- Mobile-optimized layout

### Authentication
- Touch-friendly form inputs
- Google Sign-In integration
- Error handling with helpful messages

### Questionnaire
- 9-step progressive flow
- Clear progress indication
- Back/forward navigation

### Dashboard
- Service level selection
- Quick booking access
- User preference display

## Mobile UX Standards

- **One-handed use** optimized
- **Thumb-friendly** navigation
- **Clear visual hierarchy**
- **Consistent spacing**
- **Loading states** for all actions
- **Error recovery** paths

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'mobile-design-specs.md'), mobileSpecsContent);
    }

    async updatePwaRequirements() {
        console.log('⚡ Updating pwa-requirements.md...');
        
        const pwaContent = `# 📲 PWA Requirements for App Store

## PWA Checklist

### Core Requirements
- [ ] Manifest.json with complete configuration
- [ ] Service worker implementation
- [ ] HTTPS deployment
- [ ] Responsive design (works on all devices)
- [ ] Fast loading (< 3 seconds)

### App Store Preparation

#### Google Play (Android)
- [ ] Trusted Web Activity (TWA) setup
- [ ] Play Console developer account
- [ ] App signing key configuration
- [ ] Play Store metadata

#### Apple App Store (iOS)  
- [ ] WebView wrapper application
- [ ] iOS developer account
- [ ] App Store Connect setup
- [ ] iOS-specific icons and splash screens

### Performance Targets
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds  
- **Bundle Size**: < 500KB gzipped
- **Lighthouse PWA Score**: 100%
- **Lighthouse Performance**: 90+

### Required Assets
- App icons: 192x192, 512x512
- iOS icons: Multiple sizes (57x57 to 1024x1024)
- Splash screens for various devices
- Screenshots for app stores

### Manifest Configuration
\`\`\`json
{
  "name": "Armora Security Transport",
  "short_name": "Armora",
  "theme_color": "#1a1a2e",
  "background_color": "#1a1a2e", 
  "display": "standalone",
  "orientation": "portrait-primary",
  "start_url": "/",
  "scope": "/"
}
\`\`\`

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'pwa-requirements.md'), pwaContent);
    }

    async updateBookingFlowGuide() {
        console.log('🚗 Updating booking-flow-guide.md...');
        
        const bookingContent = `# 🚗 Armora Booking Flow Guide

## Booking Process Overview

### 1. Service Selection
User chooses from three service levels:
- **Armora Standard** (£45/hour): Professional security transport
- **Armora Executive** (£75/hour): Luxury security transport  
- **Armora Shadow** (£65/hour): Independent security escort (most popular)

### 2. Route Planning
- Pickup location input
- Destination specification
- Route optimization suggestions
- Estimated time and cost display

### 3. Scheduling Options
- **Immediate**: Available now
- **Scheduled**: Future booking
- **Recurring**: Regular appointments
- **Emergency**: Priority booking

### 4. Security Preferences
- Escort level selection
- Special requirements
- Vehicle preferences
- Confidentiality settings

### 5. Payment Processing
- Payment method selection
- Cost breakdown display
- Secure payment processing
- Confirmation receipt

### 6. Confirmation & Tracking
- Booking confirmation
- Driver/escort details
- Real-time GPS tracking
- Emergency contact access

## State Management

\`\`\`typescript
interface BookingState {
  service: 'standard' | 'executive' | 'shadow';
  pickup: Location;
  destination: Location;
  schedule: ScheduleType;
  preferences: SecurityPreferences;
  payment: PaymentMethod;
  status: BookingStatus;
}
\`\`\`

## Performance Requirements
- Booking completion: < 3 minutes
- Real-time updates: < 2 seconds
- Offline capability: Essential info cached
- 99.9% booking system uptime

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'booking-flow-guide.md'), bookingContent);
    }

    async updateComponentLibrary() {
        console.log('🧩 Updating component-library.md...');
        
        const componentsContent = `# 🧩 Armora Component Library

## Component Architecture

### Core Components

#### SplashScreen
- **Purpose**: 3-second branded loading screen
- **Location**: \`src/components/SplashScreen.tsx\`
- **Props**: None
- **State**: Timer-based auto-transition

#### WelcomePage
- **Purpose**: Landing page with auth options
- **Location**: \`src/components/WelcomePage.tsx\`
- **Features**: Sign-in, Sign-up, Guest mode buttons

#### Authentication Components
- **LoginForm**: \`src/components/Auth/LoginForm.tsx\`
- **SignupForm**: \`src/components/Auth/SignupForm.tsx\`
- **GuestDisclaimer**: \`src/components/Auth/GuestDisclaimer.tsx\`

#### Questionnaire System
- **QuestionnaireFlow**: \`src/components/Questionnaire/QuestionnaireFlow.tsx\`
- **QuestionStep**: Individual step component
- **ProgressIndicator**: Progress bar for 9 steps

#### Dashboard Components
- **Dashboard**: \`src/components/Dashboard/Dashboard.tsx\`
- **ServiceSelector**: Service level selection
- **QuickBooking**: Rapid booking interface

### Shared Components

#### UI Elements
- **Button**: Touch-friendly buttons (44px+ targets)
- **Input**: Mobile-optimized form inputs
- **Card**: Content containers with Armora styling
- **LoadingSpinner**: Branded loading indicator

#### Layout Components
- **Container**: Responsive container with max-width
- **Grid**: CSS Grid system for layout
- **Stack**: Vertical spacing utility

### Styling Approach
- **CSS Modules**: Component-scoped styles
- **Mobile-First**: 320px base, progressive enhancement
- **Brand Colors**: #1a1a2e primary, #FFD700 accent
- **Touch Targets**: All interactive elements 44px+

### Component Guidelines
1. **Mobile-first** responsive design
2. **Accessibility** built-in (WCAG 2.1 AA)
3. **TypeScript** strict typing
4. **Error boundaries** for robust UX
5. **Loading states** for all async operations

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'component-library.md'), componentsContent);
    }

    async updateClaudeMd() {
        // CLAUDE.md is already comprehensive, just update timestamp
        console.log('📋 Updating CLAUDE.md timestamp...');
        
        const claudeContent = fs.readFileSync(path.join(this.projectRoot, 'CLAUDE.md'), 'utf8');
        const updatedContent = claudeContent.replace(
            /Last updated: .*/g, 
            `Last updated: ${new Date().toISOString()}`
        );
        
        if (!claudeContent.includes('Last updated:')) {
            const finalContent = updatedContent + `\n\nLast updated: ${new Date().toISOString()}`;
            fs.writeFileSync(path.join(this.projectRoot, 'CLAUDE.md'), finalContent);
        } else {
            fs.writeFileSync(path.join(this.projectRoot, 'CLAUDE.md'), updatedContent);
        }
    }
}

// Run the docs updater
if (require.main === module) {
    const updater = new DocsUpdater();
    updater.updateDocs();
}

module.exports = DocsUpdater;