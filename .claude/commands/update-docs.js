#!/usr/bin/env node

/**
 * /update-docs slash command
 * Scans and updates ALL documentation files across the entire codebase
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
        this.devToolsDir = path.join(this.projectRoot, 'dev-tools');
        
        // Track all markdown files found
        this.markdownFiles = [];
        this.updatedFiles = [];
        this.skippedFiles = [];
    }

    async updateDocs() {
        console.log('🔄 Scanning entire codebase for documentation files...\n');
        
        try {
            // Ensure docs directory exists
            if (!fs.existsSync(this.docsDir)) {
                fs.mkdirSync(this.docsDir, { recursive: true });
            }

            // Discover all markdown files
            this.discoverMarkdownFiles();
            
            console.log(`📚 Found ${this.markdownFiles.length} markdown files\n`);

            // Update core documentation files with custom logic
            await this.updateCoreDocumentation();
            
            // Update all other markdown files with timestamps
            await this.updateAllMarkdownFiles();
            
            // Generate summary report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Error updating documentation:', error.message);
        }
    }

    discoverMarkdownFiles() {
        const findMarkdownFiles = (dir) => {
            // Skip certain directories
            const skipDirs = ['node_modules', '.git', 'build', 'dist', 'coverage'];
            
            if (skipDirs.some(skip => dir.includes(skip))) {
                return;
            }

            try {
                const items = fs.readdirSync(dir);
                
                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        findMarkdownFiles(fullPath);
                    } else if (item.endsWith('.md')) {
                        this.markdownFiles.push(fullPath);
                    }
                }
            } catch (error) {
                // Silently skip directories we can't read
            }
        };

        findMarkdownFiles(this.projectRoot);
        this.markdownFiles.sort();
    }

    async updateCoreDocumentation() {
        console.log('📝 Updating core documentation files...\n');
        
        // Update primary docs
        await this.updateReadme();
        await this.updateClaudeMd();
        await this.updateAgentsDocs();
        
        // Update docs directory files
        await this.updateMobileDesignSpecs();
        await this.updatePwaRequirements();
        await this.updateBookingFlowGuide();
        await this.updateComponentLibrary();
        await this.updateArchitectureDocs();
        await this.updateDevelopmentStandards();
        await this.updateBrandGuidelines();
        
        // Update .claude directory docs
        await this.updateSubagentsDocs();
        await this.updateAgentSpecificDocs();
        
        // Update dev-tools docs
        await this.updateDevToolsDocs();
    }

    async updateAllMarkdownFiles() {
        console.log('\n📄 Updating timestamps for all markdown files...\n');
        
        for (const filePath of this.markdownFiles) {
            try {
                const relativePath = path.relative(this.projectRoot, filePath);
                
                // Skip files we've already updated with custom logic
                if (this.updatedFiles.includes(filePath)) {
                    continue;
                }
                
                // Update timestamp if file contains one
                const content = fs.readFileSync(filePath, 'utf8');
                
                if (content.includes('Last updated:') || content.includes('Last Updated:')) {
                    const updatedContent = content.replace(
                        /Last [Uu]pdated: .*/g,
                        `Last updated: ${new Date().toISOString()}`
                    );
                    
                    fs.writeFileSync(filePath, updatedContent);
                    console.log(`  ✓ Updated: ${relativePath}`);
                    this.updatedFiles.push(filePath);
                } else {
                    // Add timestamp if it doesn't exist (only for docs)
                    if (relativePath.includes('docs/') || relativePath.includes('.claude/')) {
                        const updatedContent = content + `\n\n---\n\nLast updated: ${new Date().toISOString()}\n`;
                        fs.writeFileSync(filePath, updatedContent);
                        console.log(`  ✓ Added timestamp: ${relativePath}`);
                        this.updatedFiles.push(filePath);
                    } else {
                        this.skippedFiles.push(filePath);
                    }
                }
            } catch (error) {
                console.error(`  ✗ Error updating ${filePath}: ${error.message}`);
            }
        }
    }

    async updateReadme() {
        console.log('  📝 README.md');
        
        const readmeContent = `# 🛡️ Armora Security Transport

Premium VIP security transport mobile app built with React TypeScript + PWA for app store distribution.

## 🚀 Quick Start

\`\`\`bash
npm install
npm start          # Start development server
npm run dev        # Start with hooks system
npm run build      # Production build
npm test           # Run tests
\`\`\`

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
- \`npm start\` - Development server (localhost:3000)
- \`npm run build\` - Production build with type checking
- \`npm test\` - Run tests in watch mode
- \`npm run dev\` - Start with full hooks system

### Hooks System
- \`npm run hooks:start\` - Start all development hooks
- \`npm run hooks:status\` - Show hook status
- \`npm run hooks:stop\` - Stop all hooks
- \`npm run hooks:restart\` - Restart all hooks
- \`npm run hooks:emergency\` - Emergency stop

### Task Management
- \`npm run suggest\` - Get AI task suggestions
- \`npm run task-status\` - View current tasks
- \`npm run add-task\` - Add new task
- \`npm run complete-task\` - Mark task complete
- \`npm run start-task\` - Start working on task

### Documentation
- \`npm run update-docs\` - Update all documentation
- \`npm run project-health\` - Check project health

### Agents
- \`npm run agents\` - Interactive agent selector
- \`npm run agents:all\` - Run all agents
- \`npm run agents:critical\` - Run critical agents only

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

\`\`\`
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
\`\`\`

## 🚀 Deployment

The app is configured for deployment as a Progressive Web App, ready for:
- Google Play Store (via TWA)
- Apple App Store (via WebView wrapper)
- Direct web access

## 🤝 Contributing

1. Run \`npm run suggest\` for AI task suggestions
2. Use \`npm run dev\` for development with hooks
3. Ensure no horizontal scrolling on mobile
4. Follow TypeScript strict mode
5. Test on real devices

## 📄 License

Proprietary - Armora Security Transport Ltd.

---

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.projectRoot, 'README.md'), readmeContent);
        this.updatedFiles.push(path.join(this.projectRoot, 'README.md'));
    }

    async updateMobileDesignSpecs() {
        console.log('  🎨 mobile-design-specs.md');
        
        const mobileSpecsContent = `# 📱 Armora Mobile Design Specifications

## Design System Overview

Armora's design system is built for premium security service delivery on mobile devices, emphasizing trust, professionalism, and ease of use.

## Core Design Principles

1. **Mobile-First**: Every design decision starts at 320px width
2. **Touch-Optimized**: All interactions designed for thumb reach
3. **Premium Feel**: Dark theme with golden accents conveys luxury
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Performance**: Lightweight, fast-loading components

## Color Palette

### Primary Colors
- **Navy Background**: #1a1a2e (main background)
- **Gold Accent**: #FFD700 (CTAs, highlights)
- **White Text**: #FFFFFF (primary text)
- **Light Gray**: #e0e0e0 (secondary text)

### Semantic Colors
- **Success**: #4CAF50
- **Error**: #F44336
- **Warning**: #FF9800
- **Info**: #2196F3

### Gradients
- **Premium Gradient**: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)
- **Gold Gradient**: linear-gradient(135deg, #FFD700 0%, #FFA500 100%)

## Typography

### Font Stack
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
\`\`\`

### Type Scale (Mobile)
- **Hero**: 2.5rem (40px)
- **H1**: 2rem (32px)
- **H2**: 1.75rem (28px)
- **H3**: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

### Line Heights
- **Headings**: 1.2
- **Body**: 1.5
- **Compact**: 1.3

## Spacing System

8px grid with consistent spacing tokens:

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

## Layout Grid

### Mobile (320px - 768px)
- **Columns**: 4
- **Gutter**: 16px
- **Margin**: 16px

### Tablet (768px - 1024px)
- **Columns**: 8
- **Gutter**: 24px
- **Margin**: 24px

### Desktop (1024px+)
- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 32px
- **Max Width**: 1280px

## Component Specifications

### Buttons
- **Min Height**: 48px (mobile), 44px (desktop)
- **Min Width**: 120px
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Font Size**: 1rem (16px)
- **Font Weight**: 600

### Input Fields
- **Height**: 48px
- **Padding**: 12px 16px
- **Border**: 2px solid
- **Border Radius**: 8px
- **Font Size**: 1rem (16px)

### Cards
- **Padding**: 16px
- **Border Radius**: 12px
- **Shadow**: 0 4px 6px rgba(0,0,0,0.1)
- **Border**: 2px solid rgba(255,215,0,0.2)

### Navigation
- **Header Height**: 64px
- **Tab Bar Height**: 56px
- **Drawer Width**: 280px

## Touch Targets

Minimum touch target sizes:
- **Primary Actions**: 48x48px
- **Secondary Actions**: 44x44px
- **Icons**: 24x24px with 44x44px tap area
- **Links**: 44px minimum height

## Animation & Motion

### Timing Functions
- **Ease Out**: cubic-bezier(0.0, 0, 0.2, 1)
- **Ease In Out**: cubic-bezier(0.4, 0, 0.2, 1)
- **Sharp**: cubic-bezier(0.4, 0, 0.6, 1)

### Duration
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (transitions)
- **Slow**: 500ms (complex animations)

### Common Animations
- **Fade In**: opacity 0 to 1, 300ms
- **Slide Up**: translateY(20px) to 0, 300ms
- **Scale**: scale(0.95) to 1, 150ms

## Responsive Breakpoints

\`\`\`css
/* Mobile First */
@media (min-width: 480px) { /* Large phones */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
\`\`\`

## Accessibility Guidelines

1. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus Indicators**: Visible focus states on all interactive elements
3. **Touch Targets**: Minimum 44x44px
4. **Text Size**: User scalable, minimum 16px
5. **ARIA Labels**: All interactive elements properly labeled
6. **Keyboard Navigation**: Full keyboard support

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB gzipped

## Platform-Specific Considerations

### iOS
- Respect safe areas (notch, home indicator)
- Use native-style components where appropriate
- Support dark mode
- Haptic feedback for important actions

### Android
- Material Design influences
- Support for system-wide dark theme
- Back button handling
- Edge-to-edge display support

## Logo & Branding

### Armora Logo Variations
- **Hero**: 200x200px (splash screen)
- **Large**: 120x120px (welcome page)
- **Medium**: 80x80px (headers)
- **Small**: 40x40px (compact views)

### Logo Usage Rules
- Always maintain aspect ratio
- Minimum clear space: 0.5x logo height
- Use on dark backgrounds only
- Include 4D animation effects on hero/large sizes

---

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'mobile-design-specs.md'), mobileSpecsContent);
        this.updatedFiles.push(path.join(this.docsDir, 'mobile-design-specs.md'));
    }

    async updatePwaRequirements() {
        console.log('  ⚡ pwa-requirements.md');
        
        const pwaContent = `# 📲 PWA Requirements for App Store Distribution

## Overview

Armora is being developed as a Progressive Web App (PWA) for distribution through Google Play Store and Apple App Store, as well as direct web access.

## Core PWA Requirements

### ✅ Completed
- [x] Responsive design (320px - 4K)
- [x] Mobile-first architecture
- [x] Touch-optimized interface
- [x] Fast loading (<3s on 3G)
- [x] App-like navigation

### 🚧 In Progress
- [ ] Service Worker implementation
- [ ] Offline functionality
- [ ] Web App Manifest completion
- [ ] Push notifications setup
- [ ] Background sync

### 📋 Planned
- [ ] App store wrappers (TWA/WebView)
- [ ] Install prompts
- [ ] App shortcuts
- [ ] Share target
- [ ] File handling

## Technical Specifications

### Web App Manifest
\`\`\`json
{
  "name": "Armora Security Transport",
  "short_name": "Armora",
  "description": "Premium VIP security transport service",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#1a1a2e",
  "background_color": "#1a1a2e",
  "categories": ["transportation", "security", "business"],
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot1.png",
      "sizes": "1080x1920",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Book Now",
      "url": "/booking",
      "icons": [{"src": "/book-icon.png", "sizes": "96x96"}]
    }
  ]
}
\`\`\`

### Service Worker Strategy

#### Caching Strategy
- **Cache First**: Static assets (CSS, JS, fonts)
- **Network First**: API calls, dynamic content
- **Stale While Revalidate**: Images, non-critical resources

#### Offline Support
- Essential pages cached for offline viewing
- Offline booking queue with sync
- Cached user preferences
- Fallback pages for network errors

### Performance Requirements

#### Lighthouse Scores (Target)
- **Performance**: 95+
- **PWA**: 100
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

#### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTFB**: < 600ms

## App Store Distribution

### Google Play Store (Android)

#### Trusted Web Activity (TWA)
- Android app wrapper for PWA
- Digital Asset Links verification
- Play Store listing requirements
- Minimum Android 5.0 (API 21)

#### Requirements
- [ ] Google Play Developer account ($25)
- [ ] App signing certificate
- [ ] Privacy policy URL
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (min 2, max 8)
- [ ] App description (up to 4000 chars)
- [ ] Short description (80 chars)

### Apple App Store (iOS)

#### WebView Wrapper
- Native iOS app with WKWebView
- App Store Connect setup
- iOS 12.0+ support

#### Requirements
- [ ] Apple Developer account ($99/year)
- [ ] App Store Connect access
- [ ] Xcode for building
- [ ] App icons (all sizes)
- [ ] Launch screens
- [ ] Screenshots (6.5", 5.5")
- [ ] App preview video (optional)
- [ ] Privacy policy
- [ ] App description

## Asset Requirements

### Icons
- **Android**: 192x192, 512x512 (PNG)
- **iOS**: Multiple sizes from 20x20 to 1024x1024
- **Favicon**: 16x16, 32x32, 48x48
- **Apple Touch**: 180x180
- **MS Tile**: 150x150

### Splash Screens
- **iPhone SE**: 640x1136
- **iPhone 8**: 750x1334
- **iPhone X/11/12**: 1125x2436
- **iPad**: 1536x2048
- **Android**: 1920x1080 (9:16 ratio)

### Screenshots
- **Google Play**: 1080x1920 (min 320px, max 3840px)
- **App Store**: Device-specific sizes required

## Installation Flow

### Add to Home Screen
1. Custom install prompt UI
2. Browser native prompt
3. Post-install onboarding
4. Engagement tracking

### App Store Installation
1. Store listing discovery
2. Download TWA/WebView app
3. First launch experience
4. Permission requests

## Update Strategy

### PWA Updates
- Service worker skipWaiting
- Update notification banner
- Force refresh capability
- Version tracking

### App Store Updates
- Semantic versioning
- Update notes
- Forced update capability
- A/B testing support

## Analytics & Monitoring

### PWA Metrics
- Install rate
- Engagement metrics
- Offline usage
- Performance monitoring
- Error tracking

### App Store Metrics
- Download statistics
- User ratings
- Crash reports
- Revenue tracking

## Compliance & Security

### Requirements
- HTTPS only
- Content Security Policy
- GDPR compliance
- Data encryption
- Secure storage
- Authentication tokens
- Session management

### Permissions
- Location (for pickup)
- Notifications (optional)
- Camera (future: document scanning)
- No unnecessary permissions

## Testing Strategy

### Device Testing
- Real device testing (iOS/Android)
- Multiple screen sizes
- Network conditions
- Offline scenarios

### Browser Testing
- Chrome (primary)
- Safari (iOS)
- Firefox
- Edge
- Samsung Internet

### Tools
- Lighthouse CI
- WebPageTest
- BrowserStack
- PWA Builder
- Workbox

## Launch Checklist

### Pre-Launch
- [ ] Service worker tested
- [ ] Offline mode verified
- [ ] Install flow smooth
- [ ] Icons/splash screens ready
- [ ] Performance optimized

### Launch
- [ ] TWA published to Play Store
- [ ] iOS wrapper in App Store
- [ ] Web version live
- [ ] Analytics configured
- [ ] Monitoring active

### Post-Launch
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Update cycle established
- [ ] Marketing materials ready

---

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'pwa-requirements.md'), pwaContent);
        this.updatedFiles.push(path.join(this.docsDir, 'pwa-requirements.md'));
    }

    async updateBookingFlowGuide() {
        console.log('  🚗 booking-flow-guide.md');
        
        const bookingContent = `# 🚗 Armora Booking Flow Guide

## Overview

The Armora booking system provides a seamless, secure process for arranging premium VIP security transport services.

## User Journey Map

\`\`\`
Start → Service Selection → Location Input → Time Selection → Preferences → Review → Payment → Confirmation
\`\`\`

## Detailed Flow Stages

### 1. Service Selection 🎯

Users choose from three distinct service levels:

#### Armora Standard (£45/hour)
- Professional security-trained drivers
- Standard luxury vehicles
- Basic route security assessment
- Real-time tracking
- 24/7 support

#### Armora Executive (£75/hour)
- Elite security personnel
- Premium luxury vehicles
- Advanced security protocols
- Priority routing
- Dedicated concierge

#### Armora Shadow (£65/hour) - Most Popular (67% of bookings)
- Independent security escort
- Flexible vehicle options
- Personalized protection
- Discrete service
- Adaptable to client needs

### 2. Location Planning 📍

#### Pickup Location
- Address autocomplete
- Saved locations
- Current location option
- Landmark search
- Map pin placement
- Special instructions field

#### Destination Input
- Multiple destinations support
- Route optimization
- Estimated time display
- Distance calculation
- Alternative routes
- Security assessment

### 3. Scheduling Options ⏰

#### Immediate Booking
- Available within 15 minutes
- Real-time driver matching
- Instant confirmation
- Live tracking activation

#### Scheduled Booking
- Advance booking (up to 90 days)
- Time slot selection
- Recurring options
- Calendar integration
- Reminder notifications

#### Recurring Services
- Daily commute
- Weekly appointments
- Monthly services
- Custom schedules
- Bulk booking discounts

### 4. Security Preferences 🛡️

#### Protection Level
- **Basic**: Standard security protocols
- **Enhanced**: Additional security measures
- **Maximum**: Full security detail

#### Special Requirements
- Female security personnel option
- Language preferences
- Medical training required
- Child safety expertise
- Pet-friendly service

#### Privacy Settings
- Anonymous booking
- NDA requirements
- No photography
- Discrete vehicles
- Alternative pickup points

### 5. Vehicle Selection 🚙

#### Vehicle Categories
- **Executive Sedan**: Mercedes S-Class, BMW 7 Series
- **Luxury SUV**: Range Rover, Mercedes GLS
- **Discrete Option**: Unmarked vehicles
- **Armored**: B6/B7 protection level
- **Convoy**: Multiple vehicle options

### 6. Payment Processing 💳

#### Payment Methods
- Credit/Debit cards
- Corporate accounts
- Apple Pay/Google Pay
- Bank transfer (pre-approved)
- Cryptocurrency (coming soon)

#### Pricing Structure
- Base rate (per hour)
- Distance surcharge
- Wait time charges
- Security level premium
- Peak time rates
- Loyalty discounts

### 7. Booking Confirmation ✅

#### Confirmation Details
- Booking reference number
- Driver/escort information
- Vehicle details
- ETA updates
- Contact information
- Emergency procedures

#### Pre-Service Communication
- Driver introduction message
- Route confirmation
- Security briefing
- Special instructions acknowledgment

## State Management Architecture

### Booking State Flow
\`\`\`typescript
interface BookingState {
  // Selection State
  serviceLevel: 'standard' | 'executive' | 'shadow';
  vehicleType: VehicleCategory;
  
  // Location State
  pickup: {
    address: string;
    coordinates: [number, number];
    instructions?: string;
  };
  destinations: Destination[];
  
  // Timing State
  bookingType: 'immediate' | 'scheduled' | 'recurring';
  scheduledTime?: Date;
  recurringPattern?: RecurrenceRule;
  
  // Preferences State
  securityLevel: 'basic' | 'enhanced' | 'maximum';
  specialRequirements: string[];
  privacySettings: PrivacyOptions;
  
  // Payment State
  paymentMethod: PaymentMethod;
  promoCode?: string;
  corporateAccount?: string;
  
  // Status State
  status: 'draft' | 'confirming' | 'confirmed' | 'active' | 'completed';
  confirmationNumber?: string;
  driverInfo?: DriverDetails;
}
\`\`\`

### Context Implementation
\`\`\`typescript
const BookingContext = React.createContext<{
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  confirmBooking: () => Promise<void>;
  cancelBooking: () => void;
}>();
\`\`\`

## User Capabilities by Type

### Registered Users
- Full booking capabilities
- Payment method storage
- Booking history
- Favorite locations
- 50% loyalty rewards
- Priority support

### Google Sign-In Users
- Same as registered users
- Quick authentication
- Calendar integration
- Contact sync

### Guest Users
- Quote-only mode
- No direct booking
- Limited features
- Conversion prompts
- Basic support

## Performance Requirements

### Speed Metrics
- Service selection: < 1s
- Location search: < 500ms
- Price calculation: < 2s
- Payment processing: < 3s
- Total booking time: < 3 minutes

### Reliability Targets
- 99.9% uptime
- Zero data loss
- Automatic failover
- Offline queue support

## Error Handling

### Common Scenarios
1. **No drivers available**: Show alternatives, waitlist option
2. **Payment failure**: Retry options, alternative methods
3. **Location not serviceable**: Nearest serviceable area
4. **Network issues**: Offline mode, retry queue
5. **Invalid promo code**: Clear messaging, remove code

### Recovery Flows
- Auto-save draft bookings
- Session restoration
- Payment retry logic
- Alternative driver matching
- Customer support escalation

## Tracking & Analytics

### Key Metrics
- Booking completion rate
- Average booking time
- Service level distribution
- Payment method usage
- Cancellation rate
- User satisfaction score

### Conversion Optimization
- A/B testing on flow steps
- Funnel analysis
- Drop-off point identification
- User behavior tracking
- Performance monitoring

## Security Measures

### Data Protection
- End-to-end encryption
- PCI DSS compliance
- GDPR compliance
- Secure token storage
- Regular security audits

### User Verification
- Phone number verification
- Email confirmation
- Identity verification (for high-value bookings)
- Corporate account validation
- Payment method verification

## Integration Points

### External Services
- Google Maps API (routing)
- Stripe/PayPal (payments)
- Twilio (SMS notifications)
- SendGrid (email)
- Calendar APIs

### Internal Systems
- Driver management system
- Fleet tracking
- Billing system
- CRM integration
- Analytics platform

## Mobile Optimization

### Touch Interactions
- Large tap targets (44px+)
- Swipe gestures for steps
- Pull to refresh
- Long press for options
- Pinch to zoom on map

### Performance
- Lazy loading
- Image optimization
- Code splitting
- Cache strategies
- Minimal bundle size

## Accessibility Features

### WCAG 2.1 AA Compliance
- Screen reader support
- Keyboard navigation
- High contrast mode
- Text scaling
- Focus indicators
- Error announcements

## Testing Strategy

### Unit Tests
- Component testing
- State management tests
- Utility function tests
- API integration tests

### E2E Tests
- Complete booking flow
- Payment processing
- Error scenarios
- Edge cases
- Performance tests

## Future Enhancements

### Phase 2 Features
- AI-powered route optimization
- Predictive booking suggestions
- Voice booking
- Blockchain payments
- AR vehicle preview

### Phase 3 Features
- Autonomous vehicle integration
- Biometric authentication
- Real-time threat assessment
- International expansion
- White-label solution

---

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'booking-flow-guide.md'), bookingContent);
        this.updatedFiles.push(path.join(this.docsDir, 'booking-flow-guide.md'));
    }

    async updateComponentLibrary() {
        console.log('  🧩 component-library.md');
        
        const componentsContent = `# 🧩 Armora Component Library

## Component Architecture Overview

Armora's component library follows atomic design principles with a focus on reusability, accessibility, and performance.

## Component Categories

### 🎨 Foundation Components

#### Layout Components
- **Container**: Responsive wrapper with max-width constraints
- **Grid**: Flexible grid system with responsive columns
- **Stack**: Vertical spacing utility component
- **Flex**: Flexbox wrapper with common patterns
- **Spacer**: Dynamic spacing component

#### Typography Components
- **Heading**: H1-H6 with consistent styling
- **Text**: Body text with size variants
- **Label**: Form labels and small text
- **Caption**: Image captions and hints

### 🔧 Atomic Components

#### Button Components
\`\`\`typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick: () => void;
}
\`\`\`

#### Input Components
- **TextField**: Text input with validation
- **TextArea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Single checkbox with label
- **RadioGroup**: Radio button group
- **Switch**: Toggle switch
- **DatePicker**: Date selection
- **TimePicker**: Time selection

#### Feedback Components
- **Alert**: Info/warning/error messages
- **Toast**: Temporary notifications
- **ProgressBar**: Linear progress indicator
- **Spinner**: Loading spinner
- **Skeleton**: Content placeholder

### 🏗️ Molecular Components

#### Card Components
\`\`\`typescript
interface CardProps {
  variant: 'default' | 'outlined' | 'elevated';
  padding: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  onClick?: () => void;
}
\`\`\`

#### Modal Components
- **Modal**: Base modal wrapper
- **Dialog**: Confirmation dialogs
- **Drawer**: Side panel drawer
- **BottomSheet**: Mobile bottom sheet

#### Navigation Components
- **Header**: App header with navigation
- **TabBar**: Tab navigation
- **Breadcrumb**: Breadcrumb navigation
- **Pagination**: Page navigation
- **Stepper**: Multi-step process indicator

### 🎯 Organism Components

#### Form Components
- **Form**: Form wrapper with validation
- **FormField**: Field wrapper with label/error
- **FormSection**: Grouped form fields
- **FormActions**: Form button group

#### List Components
- **List**: Base list container
- **ListItem**: Individual list item
- **VirtualList**: Virtualized long lists
- **DataTable**: Sortable data table

### 📱 Screen Components

#### Authentication Screens
- **SplashScreen**: 3-second branded intro
- **WelcomePage**: Landing with auth options
- **LoginForm**: Email/password login
- **SignupForm**: Registration flow
- **GuestDisclaimer**: Guest mode warning

#### Questionnaire Screens
- **QuestionnaireFlow**: 9-step questionnaire
- **QuestionStep**: Individual question
- **PrivacyStep**: Privacy preferences
- **ProgressIndicator**: Step progress

#### Dashboard Screens
- **Dashboard**: Main service selection
- **ServiceCard**: Service level display
- **QuickActions**: Fast access buttons
- **UserStats**: Usage statistics

#### Booking Screens
- **VehicleSelection**: Vehicle chooser
- **LocationPicker**: Map-based location
- **TimeSelector**: Schedule picker
- **BookingReview**: Booking summary
- **PaymentForm**: Payment input
- **BookingConfirmation**: Success screen

### 🎭 Specialized Components

#### Armora Logo System
\`\`\`typescript
interface LogoProps {
  size: 'hero' | 'large' | 'medium' | 'small';
  variant: 'animated' | 'full' | 'compact' | 'minimal';
  theme?: 'light' | 'dark';
  animate?: boolean;
}
\`\`\`

#### Safe Ride Fund Components
- **SafeRideFundCTA**: Call-to-action button
- **SafeRideFundModal**: Donation modal
- **ImpactCounter**: Animated ride counter
- **ContributionSelector**: Amount selector

## Component Guidelines

### Development Standards

#### TypeScript Requirements
\`\`\`typescript
// All components must be strongly typed
interface ComponentProps {
  // Required props
  id: string;
  // Optional props with defaults
  className?: string;
  style?: CSSProperties;
  // Event handlers
  onClick?: (event: MouseEvent) => void;
  // Children
  children?: ReactNode;
}

// Use generics for flexible components
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
}
\`\`\`

#### CSS Module Structure
\`\`\`css
/* Component.module.css */
.container {
  /* Mobile first */
  padding: var(--space-md);
  background: var(--color-background);
}

.title {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-lg);
  }
}

/* State modifiers */
.container.active {
  border-color: var(--color-primary);
}

.container.disabled {
  opacity: 0.5;
  pointer-events: none;
}
\`\`\`

### Accessibility Requirements

#### ARIA Implementation
\`\`\`tsx
<button
  role="button"
  aria-label="Book security transport"
  aria-pressed={isActive}
  aria-disabled={isDisabled}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {children}
</button>
\`\`\`

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Logical tab order
- Escape key closes modals
- Enter/Space activates buttons
- Arrow keys for navigation

### Performance Optimization

#### Code Splitting
\`\`\`typescript
// Lazy load heavy components
const MapView = lazy(() => import('./MapView'));
const PaymentForm = lazy(() => import('./PaymentForm'));

// Use Suspense for loading states
<Suspense fallback={<Spinner />}>
  <MapView />
</Suspense>
\`\`\`

#### Memoization
\`\`\`typescript
// Memoize expensive components
const ExpensiveList = memo(({ items }) => {
  return items.map(item => <ListItem key={item.id} {...item} />);
});

// Use useMemo for expensive calculations
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
\`\`\`

### Testing Strategy

#### Component Testing
\`\`\`typescript
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
\`\`\`

## Component Documentation

### Props Documentation
\`\`\`typescript
interface ButtonProps {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether button should take full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;
}
\`\`\`

### Usage Examples
\`\`\`tsx
// Basic usage
<Button onClick={handleSubmit}>Submit</Button>

// With variants
<Button variant="secondary" size="large">
  Cancel
</Button>

// With loading state
<Button loading={isSubmitting} onClick={handleSubmit}>
  {isSubmitting ? 'Processing...' : 'Submit'}
</Button>

// Full width on mobile
<Button fullWidth className={styles.mobileButton}>
  Book Now
</Button>
\`\`\`

## Design Tokens

### Color Tokens
\`\`\`css
:root {
  /* Primary palette */
  --color-primary: #1a1a2e;
  --color-primary-light: #2d2d44;
  --color-primary-dark: #0f0f1a;
  
  /* Accent palette */
  --color-accent: #FFD700;
  --color-accent-light: #FFED4E;
  --color-accent-dark: #B8860B;
  
  /* Semantic colors */
  --color-success: #4CAF50;
  --color-error: #F44336;
  --color-warning: #FF9800;
  --color-info: #2196F3;
}
\`\`\`

### Typography Tokens
\`\`\`css
:root {
  /* Font sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
  --font-size-3xl: 2.5rem;
  
  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
\`\`\`

### Spacing Tokens
\`\`\`css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}
\`\`\`

## Component Status

### ✅ Production Ready
- Button, Input, Card, Modal
- Form components
- Navigation components
- Authentication flows
- Dashboard components

### 🚧 In Development
- Advanced form validation
- Data visualization
- Map integration
- Payment components
- Real-time updates

### 📋 Planned
- Advanced animations
- Gesture controls
- Voice input
- AR preview
- Biometric auth

---

Last updated: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.docsDir, 'component-library.md'), componentsContent);
        this.updatedFiles.push(path.join(this.docsDir, 'component-library.md'));
    }

    async updateClaudeMd() {
        console.log('  📋 CLAUDE.md');
        
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
        
        this.updatedFiles.push(path.join(this.projectRoot, 'CLAUDE.md'));
    }

    async updateAgentsDocs() {
        console.log('  🤖 agents.md');
        
        const agentsPath = path.join(this.claudeDir, 'agents.md');
        
        // Always regenerate agents.md with latest information
        const agentsContent = this.generateAgentsDocumentation();
        fs.writeFileSync(agentsPath, agentsContent);
        this.updatedFiles.push(agentsPath);
        
        // Update individual agent docs if they exist
        const agentsDir = path.join(this.claudeDir, 'agents');
        if (fs.existsSync(agentsDir)) {
            const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
            for (const agentFile of agentFiles) {
                const agentPath = path.join(agentsDir, agentFile);
                const content = fs.readFileSync(agentPath, 'utf8');
                const updated = content.replace(
                    /Last updated: .*/g,
                    `Last updated: ${new Date().toISOString()}`
                );
                fs.writeFileSync(agentPath, updated);
                this.updatedFiles.push(agentPath);
            }
        }
    }
    
    generateAgentsDocumentation() {
        return `# Armora Development Agents

## Overview
Specialized AI agents that automate specific development tasks and maintain code quality standards for the Armora premium VIP security transport service application.

## Agent System Architecture

### Location
All agents are stored in \`.claude/agents/\` directory as JavaScript modules.

### Integration Points
- **Hooks System**: Agents integrate with the development hooks for automated execution
- **Task Management**: Connected to the AI-powered task suggestion system
- **CI/CD Pipeline**: Can be triggered during build and deployment processes

## Available Agents

### 1. Mobile Viewport Tester (\`mobile-tester.js\`)
**Purpose**: Ensures perfect mobile responsiveness and prevents horizontal scrolling issues.

**Key Features**:
- Tests all viewport widths from 320px to 768px
- Validates touch target sizes (minimum 44px)
- Checks for horizontal overflow issues
- Verifies CSS Module calculations (\`calc(100vw - 36px)\`)
- Tests card border visibility
- Validates responsive breakpoints
- Checks font scaling on different devices

**Trigger**: Automatically on CSS changes or manual via \`npm run agents:mobile-test\`

**Success Criteria**:
- Zero horizontal scroll at any viewport
- All touch targets ≥ 44px
- Text readable without zooming
- Images properly constrained

### 2. PWA Optimizer (\`pwa-optimizer.js\`)
**Purpose**: Optimizes Progressive Web App features for app store distribution.

**Key Features**:
- Service worker configuration and caching strategies
- Manifest.json optimization
- Offline functionality verification
- App icon and splash screen generation
- Lighthouse PWA audit automation
- Install prompt optimization
- Update notification system

**Trigger**: On build or via \`npm run agents:pwa-optimize\`

**Success Criteria**:
- Lighthouse PWA score: 100
- Service worker active
- Offline mode functional
- Install prompt working

### 3. UX Validator (\`ux-validator.js\`)
**Purpose**: Validates user experience patterns and accessibility standards.

**Key Features**:
- WCAG 2.1 AA compliance checking
- Color contrast validation (#1a1a2e navy, #FFD700 gold)
- Typography scale verification (1.4-1.5rem mobile)
- Touch gesture validation
- Loading state consistency
- Error message clarity
- Keyboard navigation testing
- Screen reader compatibility

**Trigger**: Before commits or via \`npm run agents:ux-validate\`

**Success Criteria**:
- WCAG 2.1 AA compliant
- Color contrast ratios pass
- All interactive elements keyboard accessible
- Error messages clear and actionable

### 4. Booking Flow Manager (\`booking-flow-manager.js\`)
**Purpose**: Manages and validates the complete booking flow architecture.

**Key Features**:
- State management validation across booking steps
- Service level calculations (Standard £45/h, Executive £75/h, Shadow £65/h)
- Location picker integration testing
- Payment flow preparation
- Guest vs registered user capability checks
- 50% reward system validation
- Booking persistence across sessions
- Error recovery testing

**Trigger**: On booking component changes or via \`npm run agents:booking-test\`

**Success Criteria**:
- Complete booking in < 3 minutes
- All user types can complete flow
- Payment calculations accurate
- State persists correctly

### 5. Server Keeper (\`server-keeper.js\`)
**Purpose**: Monitors development server health and performance.

**Key Features**:
- Memory usage monitoring
- Hot reload performance tracking
- Build time optimization
- Error log aggregation
- Port conflict resolution
- Auto-restart on critical errors
- Bundle size tracking
- Dependency analysis

**Trigger**: Continuous during development or via \`npm run agents:server-monitor\`

**Success Criteria**:
- Build time < 30 seconds
- Memory usage < 512MB
- Hot reload < 2 seconds
- Zero critical errors

## Agent Commands

### Individual Agent Execution
\`\`\`bash
npm run agents:mobile-test      # Run mobile viewport tester
npm run agents:pwa-optimize     # Run PWA optimizer
npm run agents:ux-validate      # Run UX validator
npm run agents:booking-test     # Run booking flow manager
npm run agents:server-monitor   # Run server keeper
\`\`\`

### Batch Operations
\`\`\`bash
npm run agents           # Interactive agent selector
npm run agents:all       # Run all agents in sequence
npm run agents:critical  # Run critical agents (mobile, ux, booking)
npm run agents:status    # Check agent health status
npm run agents:profile   # Profile agent performance
\`\`\`

## Creating New Agents

### Agent Template Structure
\`\`\`javascript
// .claude/agents/[agent-name].js
module.exports = {
  name: 'Agent Name',
  description: 'Agent purpose and functionality',
  priority: 1, // 1-5, lower is higher priority
  category: 'testing|optimization|validation|monitoring',
  
  async run(context) {
    const { utils, options, files } = context;
    
    // Agent logic here
    const results = [];
    const issues = [];
    const recommendations = [];
    
    // Perform checks
    try {
      // Your validation logic
      results.push({
        type: 'success',
        message: 'Check passed',
        file: 'path/to/file',
        line: 42
      });
    } catch (error) {
      issues.push({
        type: 'error',
        message: error.message,
        severity: 'high|medium|low'
      });
    }
    
    return {
      success: issues.length === 0,
      results,
      issues,
      recommendations,
      metrics: {
        testsRun: results.length,
        testsPassed: results.filter(r => r.type === 'success').length,
        duration: Date.now() - startTime
      }
    };
  },
  
  triggers: ['file-change', 'pre-commit', 'manual', 'scheduled'],
  
  config: {
    enabled: true,
    autoFix: false,
    threshold: {
      maxIssues: 10,
      severity: 'medium'
    },
    filePatterns: ['**/*.tsx', '**/*.css'],
    excludePatterns: ['node_modules/**', 'build/**']
  }
};
\`\`\`

### Agent Context Object
\`\`\`javascript
{
  projectRoot: '/workspaces/armora',
  files: [], // Changed files (for file-change trigger)
  event: 'file-change', // Trigger event type
  options: {}, // Runtime options passed to agent
  utils: {
    // File operations
    readFile: async (path) => {},
    writeFile: async (path, content) => {},
    fileExists: (path) => {},
    
    // Command execution
    runCommand: async (cmd) => {},
    
    // Logging
    log: (message, level) => {},
    
    // Analysis helpers
    parseCSS: (content) => {},
    parseJS: (content) => {},
    analyzeDependencies: () => {},
    
    // Reporting
    createReport: (data) => {},
    saveMetrics: (metrics) => {}
  },
  
  // Previous run data
  previousRun: {
    timestamp: Date,
    results: [],
    metrics: {}
  }
}
\`\`\`

## Agent Development Guidelines

### 1. Single Responsibility
Each agent should focus on one specific aspect of the application.

### 2. Non-Blocking Execution
Agents should run asynchronously and not block the development workflow.

### 3. Clear Reporting
Provide actionable feedback with specific file locations and line numbers.

### 4. Fail Gracefully
Handle errors without crashing the development environment.

### 5. Performance Conscious
Optimize for speed, especially for agents that run frequently.

### 6. Incremental Checking
Cache results and only re-check changed files when possible.

## Integration with Development Workflow

### Pre-Commit Hooks
Critical agents (mobile-tester, ux-validator) run automatically before commits.

### CI/CD Pipeline
All agents run during the build process to ensure production readiness.

### Development Mode
Agents provide real-time feedback through the hooks system during development.

### Task Management Integration
Agents can create tasks in the \`.claude/tasks/\` system when issues are found.

### IDE Integration
Agents can output problems in formats compatible with VS Code and other IDEs.

## Configuration

### Global Agent Configuration (\`.claude/agent-config.json\`)
\`\`\`json
{
  "enabled": true,
  "logLevel": "info",
  "reportPath": ".claude/reports",
  "autoRun": {
    "mobile-tester": true,
    "pwa-optimizer": false,
    "ux-validator": true,
    "booking-flow-manager": true,
    "server-keeper": true
  },
  "schedule": {
    "daily": ["pwa-optimizer"],
    "hourly": ["server-keeper"],
    "onSave": ["mobile-tester", "ux-validator"]
  },
  "thresholds": {
    "mobileViewport": {
      "minWidth": 320,
      "maxWidth": 768,
      "testIncrement": 10
    },
    "performance": {
      "maxBuildTime": 30000,
      "maxMemoryUsage": 512,
      "maxBundleSize": 500000
    },
    "accessibility": {
      "minContrastRatio": 4.5,
      "maxLoadTime": 3000
    }
  },
  "notifications": {
    "slack": false,
    "email": false,
    "desktop": true
  }
}
\`\`\`

## Troubleshooting

### Agent Not Running
1. Check if agent is enabled in \`agent-config.json\`
2. Verify agent file exists in \`.claude/agents/\`
3. Check console for error messages
4. Run \`npm run agents:status\` to see agent health
5. Verify Node.js version compatibility

### Performance Issues
1. Disable non-critical agents during development
2. Adjust agent run frequency in configuration
3. Use \`npm run agents:profile\` to identify slow agents
4. Enable incremental checking
5. Reduce file pattern scope

### False Positives
1. Update agent thresholds in configuration
2. Add exceptions for specific files/patterns
3. Report issues to maintain agent accuracy
4. Check for outdated rules
5. Verify environment-specific settings

### Integration Problems
1. Check hooks system is running
2. Verify file watchers are active
3. Ensure proper permissions
4. Check for port conflicts
5. Review agent dependencies

## Best Practices

### For Development
- Run critical agents before pushing code
- Use agent recommendations to improve code quality
- Keep agents updated with project changes
- Review agent reports regularly
- Configure IDE integration for real-time feedback

### For CI/CD
- Include all agents in build pipeline
- Fail builds on critical agent errors
- Generate agent reports for review
- Track metrics over time
- Set up notifications for failures

### For Maintenance
- Review agent logs weekly
- Update agent rules based on project evolution
- Document agent customizations
- Monitor agent performance metrics
- Keep agent dependencies updated

## Performance Metrics

### Agent Execution Times (Target)
- Mobile Tester: < 5 seconds
- PWA Optimizer: < 10 seconds
- UX Validator: < 8 seconds
- Booking Flow Manager: < 15 seconds
- Server Keeper: < 2 seconds (continuous)

### Resource Usage (Maximum)
- CPU: < 25% per agent
- Memory: < 100MB per agent
- Disk I/O: < 10MB/s
- Network: Minimal (local only)

## Related Documentation
- [Development Infrastructure](../CLAUDE.md#development-infrastructure)
- [Hooks System](../dev-tools/hooks/README.md)
- [Task Management](../dev-tools/task-manager/README.md)
- [CI/CD Pipeline](../docs/ci-cd.md)
- [Testing Strategy](../docs/testing.md)

## Agent Metrics and Reporting

### Success Metrics
- **Mobile Tester**: 0 horizontal scroll issues, 100% touch target compliance
- **PWA Optimizer**: 100/100 Lighthouse PWA score
- **UX Validator**: WCAG 2.1 AA compliance
- **Booking Flow**: 0 state management errors
- **Server Keeper**: <30s build time, <512MB memory usage

### Report Format
\`\`\`json
{
  "timestamp": "2025-09-12T10:00:00Z",
  "agent": "mobile-tester",
  "duration": 4523,
  "success": true,
  "summary": {
    "testsRun": 45,
    "testsPassed": 45,
    "issues": 0,
    "warnings": 2
  },
  "details": [
    {
      "test": "viewport-320px",
      "result": "pass",
      "duration": 234
    }
  ],
  "recommendations": [
    "Consider optimizing image sizes for faster mobile loading"
  ]
}
\`\`\`

### Reporting Dashboard
Access agent reports at \`.claude/reports/dashboard.html\` for visual metrics and trends.

---

Last Updated: ${new Date().toISOString()}
Version: 1.1.0`;
    }

    async updateArchitectureDocs() {
        console.log('  🏗️ ARCHITECTURE.md');
        
        const archPath = path.join(this.docsDir, 'ARCHITECTURE.md');
        if (fs.existsSync(archPath)) {
            const content = fs.readFileSync(archPath, 'utf8');
            const updated = content.replace(
                /Last updated: .*/g,
                `Last updated: ${new Date().toISOString()}`
            );
            fs.writeFileSync(archPath, updated);
            this.updatedFiles.push(archPath);
        }
    }

    async updateDevelopmentStandards() {
        console.log('  📏 Development-Standards.md');
        
        const devStandardsPath = path.join(this.docsDir, 'Development-Standards.md');
        if (fs.existsSync(devStandardsPath)) {
            const content = fs.readFileSync(devStandardsPath, 'utf8');
            const updated = content.replace(
                /Last updated: .*/g,
                `Last updated: ${new Date().toISOString()}`
            );
            fs.writeFileSync(devStandardsPath, updated);
            this.updatedFiles.push(devStandardsPath);
        }
    }

    async updateBrandGuidelines() {
        console.log('  🎨 Brand-Guidelines.md');
        
        const brandPath = path.join(this.docsDir, 'Brand-Guidelines.md');
        if (fs.existsSync(brandPath)) {
            const content = fs.readFileSync(brandPath, 'utf8');
            const updated = content.replace(
                /Last updated: .*/g,
                `Last updated: ${new Date().toISOString()}`
            );
            fs.writeFileSync(brandPath, updated);
            this.updatedFiles.push(brandPath);
        }
    }

    async updateSubagentsDocs() {
        console.log('  🤖 SUBAGENTS.md');
        
        const subagentsPath = path.join(this.claudeDir, 'SUBAGENTS.md');
        if (fs.existsSync(subagentsPath)) {
            const content = fs.readFileSync(subagentsPath, 'utf8');
            const updated = content.replace(
                /Last updated: .*/g,
                `Last updated: ${new Date().toISOString()}`
            );
            fs.writeFileSync(subagentsPath, updated);
            this.updatedFiles.push(subagentsPath);
        }
    }

    async updateAgentSpecificDocs() {
        const agentsDir = path.join(this.claudeDir, 'agents');
        if (fs.existsSync(agentsDir)) {
            const agentMdFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
            for (const file of agentMdFiles) {
                console.log(`  📄 ${file}`);
                const filePath = path.join(agentsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const updated = content.replace(
                    /Last updated: .*/g,
                    `Last updated: ${new Date().toISOString()}`
                );
                fs.writeFileSync(filePath, updated);
                this.updatedFiles.push(filePath);
            }
        }
    }

    async updateDevToolsDocs() {
        console.log('  🔧 dev-tools documentation');
        
        const devDocsDir = path.join(this.devToolsDir, 'docs');
        if (fs.existsSync(devDocsDir)) {
            const mdFiles = fs.readdirSync(devDocsDir).filter(f => f.endsWith('.md'));
            for (const file of mdFiles) {
                const filePath = path.join(devDocsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const updated = content.replace(
                    /Last updated: .*/g,
                    `Last updated: ${new Date().toISOString()}`
                );
                fs.writeFileSync(filePath, updated);
                this.updatedFiles.push(filePath);
            }
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 Documentation Update Summary\n');
        
        console.log(`✅ Updated ${this.updatedFiles.length} files:`);
        
        // Group files by directory
        const grouped = {};
        for (const file of this.updatedFiles) {
            const dir = path.dirname(path.relative(this.projectRoot, file));
            if (!grouped[dir]) grouped[dir] = [];
            grouped[dir].push(path.basename(file));
        }
        
        // Display grouped files
        for (const [dir, files] of Object.entries(grouped)) {
            console.log(`\n  📁 ${dir || '.'}/`);
            for (const file of files.sort()) {
                console.log(`    ✓ ${file}`);
            }
        }
        
        if (this.skippedFiles.length > 0) {
            console.log(`\n⏭️  Skipped ${this.skippedFiles.length} files (no timestamps needed)`);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('✨ All documentation successfully updated!');
        console.log(`📅 Timestamp: ${new Date().toISOString()}\n`);
    }
}

// Run the docs updater
if (require.main === module) {
    const updater = new DocsUpdater();
    updater.updateDocs();
}

module.exports = DocsUpdater;