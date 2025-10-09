# Armora Professional Protection Services
**Premium Close Protection Services with Secure Vehicle Operation**

> Accessible Professional Protection for the Modern Professional

A mobile-first professional protection application offering SIA-licensed close protection services, built with React TypeScript and designed for app store distribution.

## 🎯 Service Overview
Armora provides professional close protection services with secure vehicle operation. Unlike traditional transport or conventional close protection contracts, we offer flexible, time-based protection assignments with transparent dual pricing - perfect for the underserved mid-market professional segment.

## 📊 Service Metrics
- **1,200+ protection assignments completed**
- **99.8% client satisfaction rate**
- **Three service tiers** with SIA-licensed protection officers
- **Greater London coverage** (expanding to major UK cities)
- **Full SIA compliance** - close protection services

## 🛡️ Protection Service Tiers

### 1. Standard Protection - £50/hour
- **Tagline:** "Professional Protection, Every Day"
- **Includes:** SIA Level 2 certified protection officer + secure vehicle operation + real-time tracking
- **Best For:** Daily security needs, routine professional appointments
- **Minimum:** 2-hour assignments + £2.50/mile

### 2. Executive Protection - £75/hour
- **Tagline:** "Enhanced Security for Business Leaders"
- **Includes:** SIA Level 3 protection officer + luxury vehicle + priority response + business amenities
- **Best For:** Important meetings, corporate events, high-profile assignments
- **Minimum:** 2-hour assignments + £2.50/mile

### 3. Shadow Protection - £65/hour ⭐ **MOST POPULAR**
- **Tagline:** "Discrete Professional Protection"
- **Includes:** Special Forces trained protection officer + client vehicle option + covert protection + advanced threat detection
- **Best For:** High-profile individuals, celebrities, sensitive business operations
- **Minimum:** 2-hour assignments + £2.50/mile

## 💰 Dual Pricing Model (SIA Compliant)

### **Service Fee Structure**
```
Total = (Protection Hours × Hourly Rate) + (Distance × £2.50/mile) + Booking Fee
```

### **Example: London Bridge to Heathrow**
```
Distance: 22 miles
Time: 55 minutes
Service: Standard Protection

Protection Officer (2 hrs): £100.00
Secure Vehicle Operation (22 mi): £55.00
Booking Fee (non-member): £10.00
────────────────────────────────────
Total Service Fee: £165.00
Member Price (20% discount): £124.00
```

## ⭐ Essential Membership - £14.99/month

### **Member Benefits**
- **20% discount** on all protection services
- **£0 booking fees** (save £10 per assignment)
- **Priority response** and scheduling
- **30-day free trial** for new members
- **Member-only features**: Vehicle preferences, SMS confirmations

### **Value Example**
Regular user (2 assignments/month) saves £41+ per assignment = £82+ monthly savings vs £14.99 membership cost.

## 🛠️ Technical Stack

### **Frontend Framework:**
- **React 18** with TypeScript
- **Progressive Web App (PWA)** capabilities
- **Mobile-first responsive design** (320px minimum width)

### **Development Environment:**
- **GitHub Codespaces** with VS Code integration
- **Claude Code** AI development assistant
- **Live preview** at localhost:3001
- **Hot reloading** for real-time development

### **Styling & Design:**
- **Custom CSS** with mobile-first approach
- **Dark theme** (#1a1a2e) with golden accents (#FFD700)
- **Touch-optimized** interfaces (44px+ button heights)
- **Premium animations** (60fps orbital rings, particle effects)

### **Future Deployment:**
- **App Store Distribution** (Google Play Store & Apple App Store)
- **Capacitor** or similar for native app packaging
- **PWA manifest** for web app installation

## 📱 User Journey

### **Complete User Flow:**
1. **Splash Screen** → 3-second premium animation with Armora branding
2. **Welcome Page** → Sign In / Sign Up / Continue as Guest options
3. **Authentication** → Email, Gmail, or Guest access with different capabilities
4. **Guest Disclaimer** → Clear explanation of limited vs full access
5. **9-Step Questionnaire** → Dynamic personalization with profile building
6. **Achievement Screen** → Gamified reward unlock (50% off first ride up to £25)
7. **Dashboard** → Service selection and booking interface
8. **Booking Flow** → Pickup/dropoff selection and confirmation

### **Key Features Implemented:**
- ✅ **Dynamic Personalization** - Questions adapt based on previous answers
- ✅ **Conversion Optimization** - Step 3/4 signup encouragement with value preview
- ✅ **Gamified Achievement System** - Mobile game-style reward celebration
- ✅ **User Type Management** - Different capabilities for registered/Google/guest users
- ✅ **Social Proof Integration** - 6,000+ trips messaging throughout
- ✅ **Professional Branding** - VIP security transport positioning
- ✅ **Complete Dashboard** - Service selection with personalized recommendations
- ✅ **Reward System** - 50% off integration with pricing display

## 📁 Project Structure

```
armora-transport-app/
├── README.md                    # Project documentation
├── package.json                 # Dependencies and scripts
├── public/                      # Static assets and PWA manifest
│   ├── manifest.json           # PWA configuration
│   └── icons/                  # App icons for different sizes
├── src/
│   ├── components/             # React components
│   │   ├── Auth/              # Authentication system
│   │   │   ├── WelcomePage.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── GuestDisclaimer.tsx
│   │   ├── Questionnaire/     # 9-step questionnaire flow
│   │   │   ├── QuestionnaireFlowEnhanced.tsx
│   │   │   ├── QuestionnaireStep.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   └── PersonalizationEngine.tsx
│   │   ├── Achievement/       # Gamified completion screen
│   │   │   └── AchievementScreen.tsx
│   │   ├── Dashboard/         # Main app interface
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── RewardBanner.tsx
│   │   │   ├── PersonalizedRecommendation.tsx
│   │   │   ├── GuestUpgradePrompts.tsx
│   │   │   ├── SocialProofSection.tsx
│   │   │   ├── UserStats.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── Common/            # Reusable components
│   │   └── SplashScreen/      # App loading screen
│   ├── styles/                # CSS styling
│   │   ├── App.css
│   │   ├── customScrollbars.css
│   │   └── Dashboard.css
│   ├── data/                  # Static data and configurations
│   │   ├── questionnaireData.ts
│   │   └── servicesData.ts
│   ├── utils/                 # Helper functions
│   │   └── recommendationEngine.ts
│   └── App.tsx               # Main application component
```

## 🚀 Development Setup

### **Prerequisites:**
- GitHub Codespaces environment (recommended)
- Node.js 18+ and npm
- Modern web browser for testing

### **Getting Started:**

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd armora
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **View the app:**
   - Open browser to `http://localhost:3001`
   - In Codespaces: Use the built-in browser preview
   - The app will automatically reload when you make changes

### **Development Workflow:**
- **Hot reloading** enabled for real-time development
- **TypeScript compilation** with error checking
- **Mobile-first testing** recommended using browser dev tools
- **Component isolation** for easier debugging and development

## ⚖️ Compliance Framework

### **SIA (Security Industry Authority) Requirements:**
- **Client Assessment:** Voluntary best practice (NOT legally mandatory)
- **Data Collection:** Framed as "professional service standards"
- **Messaging:** Emphasizes operational necessity and duty of care
- **Driver Licensing:** All drivers hold valid SIA licenses

### **GDPR Compliance:**
- **Data Minimization:** Collect only necessary information
- **Consent Management:** Clear opt-in for data collection
- **Privacy Policy:** Comprehensive data handling procedures
- **User Rights:** Access, rectification, and erasure capabilities

### **Professional Standards:**
- **BS 7858:2019** security screening for drivers
- **Public liability insurance** coverage
- **Health and safety compliance**
- **Professional service delivery standards**

## 👥 User Management

### **Registered Users (Full Access):**
- Complete booking capabilities for all services
- 50% off first ride reward (up to £25)
- Personalized dashboard and recommendations
- Ride history and saved preferences
- Payment method storage
- Priority customer support

### **Google-Authenticated Users:**
- Same capabilities as registered users
- Streamlined signup process
- Google profile integration
- Enhanced security through OAuth

### **Guest Users (Limited Access):**
- Service information browsing
- Quote calculator functionality
- Contact information access
- App preview and demonstration
- **Restrictions:** No direct booking, no payment storage, no ride history
- **Upgrade Path:** Clear conversion prompts throughout experience

## 🎯 Development Status & Roadmap

### **Completed Features (✅):**
- ✅ Splash screen with premium animations
- ✅ Welcome page and authentication system
- ✅ Dynamic 9-step questionnaire with personalization
- ✅ Gamified achievement screen with particle effects
- ✅ User type management and state persistence
- ✅ Mobile-first responsive design
- ✅ Custom scroll bar styling
- ✅ Conversion optimization at questionnaire step 3/4
- ✅ Complete dashboard interface with service selection
- ✅ Personalized service recommendations
- ✅ Reward system integration with pricing display
- ✅ Guest upgrade prompts and conversion flows
- ✅ Social proof integration throughout

### **Upcoming Features (⏳):**
- Complete booking flow implementation
- Payment processing integration
- Real-time GPS tracking preparation
- Push notification system
- Driver assignment and communication
- Ride history and user profiles

### **Future Enhancements (🚀):**
- Native app packaging with Capacitor
- App store optimization and submission
- Advanced analytics and user behavior tracking
- A/B testing framework implementation
- Multi-language support
- International expansion capabilities

## 📊 Performance Metrics
- Target: 90+ Google Lighthouse score
- Mobile-first optimization priority
- 60fps animations and interactions
- Fast loading times across all devices

## 🔒 Security Features
- SIA-compliant driver verification
- Secure data transmission
- Privacy-focused data collection
- Professional security transport standards

## 🗺️ Geographic Coverage
- **Primary:** London Metropolitan area
- **Secondary:** Manchester, Birmingham, Scotland
- **Expansion:** UK-wide coverage planned
- **Service Areas:** City centres, airports, business districts

## 🤝 Contributing

### **Development Guidelines:**
- Follow mobile-first design principles
- Maintain TypeScript type safety
- Test across multiple device sizes
- Preserve brand consistency (dark theme + golden accents)
- Document new features and components

### **Code Standards:**
- React functional components with hooks
- TypeScript interfaces for all data structures
- Mobile-optimized CSS with proper breakpoints
- Accessibility compliance (ARIA labels, contrast ratios)
- Performance optimization for mobile devices

## 📞 Contact & Support

### **Development:**
- **Environment:** GitHub Codespaces with Claude Code integration
- **Hot Reloading:** Real-time development with automatic browser refresh
- **Mobile Testing:** Browser dev tools for responsive design testing

### **Business:**
- **Service Model:** Premium VIP security transport
- **Target Market:** Privacy-conscious, security-minded clients
- **Value Proposition:** Professional protection meets luxury transport

---

**Armora Transport** - *Your Personal Security Driver Team*

*Built with React TypeScript • Mobile-First Design • SIA Compliant • UK Coverage*

---

Last updated: 2025-10-09T08:08:25.959Z
