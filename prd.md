# ARMORA SECURITY TRANSPORT - PRODUCT REQUIREMENTS DOCUMENT
*Professional Close Protection Services Nationwide*

## EXECUTIVE SUMMARY

Armora is a premium security transport and personal protection service operating across England & Wales. We provide SIA-licensed Close Protection Officers (CPOs) for professional security transport, venue protection, and executive bodyguard services.

**Market Position**: Professional security services, not rideshare
**Target Market**: High-net-worth individuals, corporate executives, high-risk personalities
**Service Areas**: Nationwide coverage across England & Wales with regional pricing
**Core Technology**: React 19.1.1 PWA with real-time tracking and professional security protocols

---

## 1. BUSINESS MODEL & SERVICE OFFERINGS

### 1.1 Core Service Categories

#### A. Security Transport Services
**Professional protection during transit with SIA-certified officers**

**Service Tiers:**
- **Standard Protection** (£65/hour): SIA Level 2, personal protection trained drivers
- **Executive Shield** (£95/hour): SIA Level 3, corporate bodyguard services
- **Shadow Protocol** (£125/hour): Special Forces trained, covert protection specialists
- **Client Vehicle Service** (£55/hour): Security-trained driver for customer's vehicle

**Pricing Models:**
- **Hourly Blocks**: 4h, 6h, 8h minimum commitments per service tier
- **Per-Journey Pricing**: Time + distance calculations with service minimums
- **Service-Specific Minimums**: Executive (6h), Shadow (8h), Standard (4h)

#### B. Personal Protection Officer (PPO) Venue Services
**Dedicated security presence for events, residences, and business venues**

**Contract Options:**
- **Day Protection**: £450 (8-hour coverage)
- **Weekend Coverage**: £850 (2-day commitment)
- **Monthly Contract**: £12,500 (dedicated officer availability)
- **Annual Contract**: £135,000 (year-round security management)

**Scaling Options:**
- 1-10 officers per venue with dynamic pricing
- Standard vs High-Risk venue assessment (+50% premium)
- SIA Level 3 certified specialists for complex requirements

### 1.2 Geographic Coverage

#### England & Wales Nationwide Service
**Complete coverage with regional pricing variations**

**Primary Service Areas:**
- **London & Greater London**: Premium rates, immediate availability
- **Major Cities**: Manchester, Birmingham, Leeds, Liverpool, Bristol, Cardiff
- **Regional Coverage**: All major towns and cities with 2-hour response time
- **Airport Specialists**: Heathrow, Gatwick, Manchester, Birmingham specialists

**Regional Pricing Structure:**
- **London Zone**: Standard rates as base pricing
- **Major Cities**: -10% adjustment for regional markets
- **Rural Areas**: +15% for extended travel requirements
- **Airport Services**: +25% for specialized terminal procedures

---

## 2. USER EXPERIENCE & CUSTOMER JOURNEY

### 2.1 User Types & Capabilities

#### Registered Users (Verified Accounts)
- **Security Vetting**: Background check required for direct booking access
- **Full Booking Rights**: Immediate protection service booking
- **Loyalty Benefits**: 50% reward accumulation on completed services
- **Priority Support**: 24/7 emergency assistance and account management

#### Google OAuth Users
- **Streamlined Verification**: Faster account setup with Google verification
- **Same Benefits**: Identical capabilities to registered users
- **Corporate Integration**: Google Workspace compatibility for business accounts

#### Guest Users (Quote-Only)
- **Service Information**: Detailed cost breakdown and service explanations
- **Quote Generation**: Professional estimates for all service levels
- **Conversion Path**: Seamless upgrade to verified account
- **Security Restriction**: No direct booking until background verification

### 2.2 Customer Journey Flow

```
Welcome → Security Questionnaire → Background Verification → Service Selection → Booking → Protection Detail → Completion
```

**Step 1: Welcome & Initial Assessment**
- Professional security service positioning
- Safe Ride Fund impact counter (3,741+ safe rides delivered)
- Service area verification and availability check

**Step 2: Security Questionnaire (9-Step Vetting)**
- Risk assessment and protection requirements
- Service level recommendation based on needs
- Privacy options and data handling preferences
- Background check initiation for verified users

**Step 3: Achievement & Qualification**
- Security clearance confirmation
- Service tier qualification and benefits unlock
- 50% loyalty reward program activation

**Step 4: Dashboard & Service Selection**
- Personalized protection recommendations
- Live availability and officer assignment
- Service tier comparison and selection

**Step 5: Protection Booking Flow**
- Vehicle/service selection with officer credentials
- Location pickup and destination specification
- Booking confirmation with protection detail summary
- Payment processing and service agreement

**Step 6: Active Protection Detail**
- Real-time tracking and security monitoring
- Direct CPO communication channels
- Emergency response protocols activation
- Live status updates and ETA management

**Step 7: Service Completion**
- Protection summary and debrief
- Service rating and feedback collection
- Loyalty reward processing
- Follow-up protection scheduling

---

## 3. TECHNICAL REQUIREMENTS

### 3.1 Platform Architecture

#### Core Technology Stack
- **Frontend**: React 19.1.1 with TypeScript 4.9.5 (strict mode)
- **Build System**: Create React App 5.0.1 with CSS Modules
- **State Management**: React Context with useReducer (no Redux)
- **Styling**: CSS Modules with mobile-first responsive design
- **PWA Features**: Service worker, offline capabilities, app store distribution

#### Mobile-First Requirements
- **Viewport Support**: No horizontal scrolling from 320px+
- **Touch Targets**: 44px minimum (Apple guidelines compliance)
- **Performance**: 60fps animations, <3s load time on 3G
- **Accessibility**: WCAG 2.1 AA compliance, screen reader support

### 3.2 Security & Compliance Features

#### Data Protection & Privacy
- **GDPR Compliance**: Full user data control and deletion rights
- **Security Vetting**: Background check integration and verification
- **Payment Security**: PCI DSS compliance with Stripe integration
- **Communication Security**: Encrypted CPO-Principal communication

#### Professional Standards Integration
- **SIA License Verification**: Real-time certification checking
- **Insurance Validation**: Professional liability coverage verification
- **Emergency Protocols**: 24/7 response center integration
- **Incident Reporting**: Comprehensive security event logging

### 3.3 Integration Requirements

#### Location & Mapping Services
- **Real-time GPS**: Live tracking for active protection details
- **Route Optimization**: Security-conscious path planning
- **Geofencing**: Area-based service availability and pricing
- **Location Verification**: Address validation and risk assessment

#### Payment & Billing Systems
- **Stripe Integration**: Secure payment processing for all services
- **Corporate Billing**: B2B invoicing and expense management
- **Dynamic Pricing**: Real-time rate calculation based on service and location
- **Subscription Management**: Monthly and annual contract handling

#### Communication Systems
- **Push Notifications**: Service updates and emergency alerts
- **SMS Integration**: Critical communication backup
- **Voice Communication**: Direct CPO-Principal connection
- **Emergency Services**: Integrated response protocols

---

## 4. COMPLIANCE & REGULATORY REQUIREMENTS

### 4.1 UK Security Industry Regulations

#### SIA (Security Industry Authority) Compliance
- **License Categories**:
  - SIA Level 2: Basic security transport
  - SIA Level 3: Executive protection and close protection
  - Specialist Endorsements: Firearms, surveillance, emergency response
- **Verification Process**: Real-time license status checking
- **Renewal Management**: Automatic license expiry monitoring
- **Training Requirements**: Ongoing professional development tracking

#### Professional Standards
- **Background Checks**: Enhanced DBS (Disclosure and Barring Service) verification
- **Insurance Requirements**: Professional indemnity and public liability
- **Vehicle Standards**: Security-modified vehicles with professional equipment
- **Emergency Protocols**: 24/7 response capability and incident management

### 4.2 Data & Privacy Compliance

#### GDPR Requirements
- **Data Minimization**: Only collect necessary security-related information
- **Consent Management**: Clear opt-in for all data processing activities
- **Right to Deletion**: Complete data removal upon request
- **Data Portability**: Export capability for user data

#### Security Data Handling
- **Sensitive Information**: Special category data protection for security assessments
- **Location Privacy**: Secure handling of real-time location data
- **Communication Records**: Encrypted storage of CPO-Principal communications
- **Incident Data**: Secure logging and reporting of security events

---

## 5. FEATURE SPECIFICATIONS

### 5.1 Core Application Features

#### Welcome & Onboarding System
- **Components**: WelcomePage, QuestionnaireFlow, AchievementSystem
- **Features**:
  - Animated impact counter showing service statistics
  - Professional security service positioning
  - 9-step security questionnaire with risk assessment
  - Achievement unlock with loyalty program activation

#### Authentication & User Management
- **Multi-Modal Auth**: Email, Google OAuth, guest access, phone verification
- **Security Vetting**: Background check integration for verified users
- **Account Types**: Individual, corporate, guest with different access levels
- **Profile Management**: Security preferences, emergency contacts, service history

#### Dashboard & Service Selection
- **Personalized Recommendations**: AI-driven service suggestions based on user profile
- **Live Availability**: Real-time officer availability and service capacity
- **Service Comparison**: Detailed breakdown of protection levels and capabilities
- **Quick Booking**: Streamlined process for repeat customers

#### Booking Flow & Protection Services
- **Vehicle Selection**: Service tier selection with officer credentials
- **Location Services**: Pickup/destination with security route planning
- **Booking Confirmation**: Protection detail summary and service agreement
- **Payment Processing**: Secure transaction handling with pricing transparency

### 5.2 Professional Security Features

#### Real-Time Protection Monitoring
- **Live Tracking**: GPS monitoring of active protection details
- **Status Updates**: Real-time communication between CPO and Principal
- **Emergency Response**: One-touch emergency services activation
- **Incident Reporting**: Comprehensive security event documentation

#### Officer Management System
- **Credentials Display**: SIA licenses, specializations, experience ratings
- **Performance Tracking**: Service quality metrics and customer feedback
- **Assignment Logic**: Automatic officer matching based on service requirements
- **Communication Hub**: Secure messaging between all parties

#### Compliance & Documentation
- **Service Records**: Detailed logs of all protection activities
- **Certification Tracking**: Officer qualification monitoring and renewal alerts
- **Insurance Management**: Coverage verification and claims handling
- **Regulatory Reporting**: Automated compliance documentation

### 5.3 Advanced Features & Integrations

#### Venue Protection Services
- **Contract Management**: Day, weekend, monthly, and annual agreements
- **Multi-Officer Coordination**: Team deployment and management
- **Risk Assessment**: Venue security evaluation and recommendations
- **Specialized Services**: Event security, residential protection, corporate facilities

#### Corporate & B2B Features
- **Multi-User Accounts**: Corporate account management with role-based access
- **Billing Integration**: Enterprise invoicing and expense reporting
- **Service Analytics**: Usage patterns and security performance metrics
- **API Access**: Integration with corporate security and travel systems

#### Mobile & Offline Capabilities
- **Progressive Web App**: App store distribution with native-like experience
- **Offline Mode**: Essential functionality during connectivity issues
- **Push Notifications**: Critical updates and emergency communications
- **Location Services**: GPS tracking with privacy controls

---

## 6. DEVELOPMENT PRIORITIES & ROADMAP

### 6.1 Phase 1: Core Platform (Completed)
- ✅ **Authentication System**: Multi-modal user verification
- ✅ **Booking Flow**: Complete service selection and booking process
- ✅ **Dashboard Interface**: Service management and user control panel
- ✅ **Mobile Optimization**: Touch-optimized interface with PWA capabilities
- ✅ **Security Framework**: Professional terminology and service positioning

### 6.2 Phase 2: Service Integration (Current Priority)
- 🔄 **Payment System**: Stripe integration for live transaction processing
- 🔄 **Real-Time Tracking**: GPS monitoring and live status updates
- 🔄 **Officer Management**: Credential verification and assignment system
- 🔄 **Communication Hub**: Secure messaging and emergency response
- 🔄 **Compliance Tools**: SIA verification and regulatory documentation

### 6.3 Phase 3: Advanced Features (Future Development)
- ⏳ **Venue Protection**: Contract management for location-based services
- ⏳ **Corporate Accounts**: B2B billing and multi-user management
- ⏳ **Analytics Dashboard**: Service performance and business intelligence
- ⏳ **API Platform**: Third-party integrations and corporate connectivity
- ⏳ **Advanced Security**: Enhanced protection protocols and threat assessment

### 6.4 Phase 4: Scale & Optimization (Growth Stage)
- ⏳ **Regional Expansion**: Scotland and Northern Ireland coverage
- ⏳ **International Services**: European expansion planning
- ⏳ **AI Integration**: Predictive security and risk assessment
- ⏳ **Fleet Management**: Vehicle tracking and maintenance systems
- ⏳ **Training Platform**: Officer development and certification management

---

## 7. SUCCESS METRICS & KPIs

### 7.1 Business Performance Indicators
- **Revenue Growth**: Monthly recurring revenue from all service categories
- **Market Penetration**: Geographic coverage and service availability
- **Customer Acquisition**: User registration and verification completion rates
- **Service Utilization**: Booking frequency and service tier adoption
- **Customer Retention**: Repeat booking rates and loyalty program engagement

### 7.2 Operational Excellence Metrics
- **Response Times**: Service availability and officer deployment speed
- **Service Quality**: Customer satisfaction and officer performance ratings
- **Safety Record**: Incident-free service delivery and emergency response
- **Compliance Rate**: SIA certification maintenance and regulatory adherence
- **Technical Performance**: App reliability, load times, and error rates

### 7.3 User Experience Metrics
- **Conversion Rates**: Guest-to-registered user conversion
- **Booking Completion**: Start-to-finish booking flow success
- **Mobile Performance**: Touch interaction success and responsive design
- **Accessibility Compliance**: WCAG 2.1 AA adherence and screen reader support
- **Customer Support**: Response times and issue resolution rates

---

## 8. RISK MANAGEMENT & MITIGATION

### 8.1 Business Risks
- **Regulatory Changes**: SIA requirement updates and compliance modifications
- **Market Competition**: Traditional security companies entering digital space
- **Economic Factors**: Economic downturns affecting luxury service demand
- **Insurance Costs**: Professional liability insurance rate increases
- **Officer Availability**: Maintaining adequate certified staff levels

### 8.2 Technical Risks
- **Security Breaches**: Customer data protection and communication security
- **System Downtime**: Service availability and emergency response capability
- **Scalability Issues**: Platform performance under high demand
- **Integration Failures**: Third-party service dependencies and API reliability
- **Mobile Compatibility**: Device and browser support across platforms

### 8.3 Operational Risks
- **Service Quality**: Maintaining professional standards across all officers
- **Emergency Response**: 24/7 support capability and incident management
- **Customer Safety**: Ensuring protection effectiveness and incident prevention
- **Reputation Management**: Professional image and service delivery consistency
- **Legal Compliance**: Regulatory adherence and industry standard maintenance

---

**Document Version**: 1.0
**Last Updated**: September 20, 2025
**Status**: APPROVED - Ready for Implementation
**Next Review**: October 20, 2025

---

*This Product Requirements Document serves as the comprehensive guide for Armora's nationwide security transport service development and operation across England & Wales.*