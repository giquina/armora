# 📱 ARMORA PROTECTION REQUEST USER FLOW

## **🔄 COMPLETE BOOKING PROCESS**

### **Step 1: Service Selection**
**Choose Protection Tier:**
- Essential Protection (£50/hour + £2.50/mile)
- Executive Shield (£75/hour + £2.50/mile)
- Shadow Protocol (£65/hour + £2.50/mile)
- Client Vehicle Service (£55/hour + £2.50/mile)

**Display Features:**
- Clear service descriptions with CPO qualifications
- Real-time availability indicators
- Service tier benefits and specializations
- SIA license levels for each tier

### **Step 2: Location Input**

#### **Pickup Location**
- Address autocomplete with postcode validation
- Current location detection (GPS)
- Saved locations for registered users
- Special instructions field (security notes)
- Map integration with pin placement
- Landmark search capability

#### **Destination Input**
- Multiple destinations support
- Route optimization and security assessment
- Estimated journey time and distance calculation
- Alternative route suggestions
- Security threat level assessment

### **Step 3: Time Selection**

#### **Booking Options**
- **Immediate**: Available within 15 minutes (subject to CPO availability)
- **Scheduled**: Advance booking up to 90 days
- **Recurring**: Daily, weekly, monthly patterns

#### **Time Parameters**
- Minimum 2-hour blocks for all services
- 30-minute increments after minimum
- Real-time CPO availability display
- Peak time rate notifications

### **Step 4: Protection Preferences**

#### **Security Level**
- **Basic**: Standard security protocols
- **Enhanced**: Additional security measures and threat assessment
- **Maximum**: Full security detail with advance reconnaissance

#### **Special Requirements**
- Female CPO preference (when available)
- Language requirements (multilingual CPOs)
- Medical training certification required
- Child safety expertise needed
- Discrete/unmarked vehicles preferred
- Pet-friendly service options

#### **Privacy Settings**
- Anonymous booking option
- NDA requirements for high-profile clients
- No photography policy
- Alternative pickup points for discretion

### **Step 5: Real-Time Pricing Review**

#### **Live Calculation Display**
```
Example: Central London to Heathrow
Distance: 22 miles | Estimated Time: 55 minutes
Service: Executive Shield

Protection Officer (2 hrs minimum): £150.00
Secure Vehicle Operation (22 miles): £55.00
Booking Fee (non-member): £10.00
─────────────────────────
Total: £215.00

Member Price (20% discount): £164.00
```

#### **Pricing Breakdown**
- Clear itemization of all charges
- Real-time distance and time calculations
- Member vs non-member pricing comparison
- Regional pricing adjustments shown

### **Step 6: Payment Processing**

#### **Payment Methods**
- Credit/Debit cards (Stripe integration)
- Apple Pay / Google Pay for quick checkout
- Corporate accounts with VAT handling
- Bank transfer (pre-approved customers only)

#### **Payment Security**
- PCI DSS compliant processing
- End-to-end encryption for all transactions
- Secure token storage (no card details stored)
- Real-time fraud detection and prevention

### **Step 7: Assignment Confirmation**

#### **Confirmation Details**
- Unique assignment reference number
- CPO details and professional credentials
- Vehicle information and registration number
- Estimated arrival time (ETA) with live updates
- Emergency contact procedures and protocols
- Live tracking activation confirmation

#### **Pre-Assignment Communication**
- CPO introduction message with photo
- Route confirmation and security briefing
- Special instructions acknowledgment
- Emergency contact verification

---

## **📊 PROTECTION ASSIGNMENT STATES**

### **Assignment Lifecycle**
1. **Draft** → User building assignment details in app
2. **Confirming** → Payment processing and CPO assignment
3. **Confirmed** → CPO assigned and preparing for departure
4. **Active** → CPO en route to pickup location
5. **In Progress** → Protection detail active, Principal secured
6. **Completed** → Assignment successfully concluded
7. **Cancelled** → Assignment terminated with refund policy applied

### **Real-Time Status Updates**
- **CPO Assigned**: Professional credentials, photo, and experience
- **CPO Approaching**: Live ETA and location tracking
- **Protection Detail Active**: Continuous monitoring and status updates
- **Assignment Complete**: Service summary and feedback request

---

## **👥 USER CAPABILITIES BY TYPE**

### **Registered Members**
- **Direct Protection Booking**: Complete assignment creation and payment
- **50% Loyalty Rewards**: Points system for frequent protection users
- **Saved Preferences**: Locations, payment methods, special requirements
- **Assignment History**: Complete protection detail records and reports
- **Priority Support**: 24/7 dedicated assistance hotline
- **20% Member Discount**: Applied automatically to all services

### **Google Sign-In Users**
- Same capabilities as registered members
- Quick authentication via Google OAuth
- Calendar integration for scheduled assignments
- Contact synchronization for emergency contacts

### **Guest Users**
- **Quote-Only Mode**: Pricing estimates without booking capability
- **Limited Features**: Basic service information and pricing calculator
- **Conversion Prompts**: Encouragement to register for full access
- **Basic Support**: General inquiries and information only

---

## **📱 MOBILE-FIRST OPTIMIZATION**

### **Touch-Friendly Design**
- **Touch Targets**: Minimum 44px for all interactive elements
- **Gesture Support**: Swipe navigation between flow steps
- **One-Handed Use**: Critical actions within thumb reach
- **Quick Actions**: Saved locations and preferences for speed

### **Performance Requirements**
- **Viewport Constraints**: No horizontal scrolling on any device (320px+)
- **Loading Speed**: Sub-3-second total booking completion time
- **Offline Capability**: Core features work without connectivity
- **Progressive Enhancement**: Advanced features layer on top

### **PWA Features**
- **App Store Ready**: iOS App Store and Google Play distribution
- **Push Notifications**: Assignment updates and emergency alerts
- **Home Screen Install**: Native app experience
- **Background Sync**: Offline assignment queue and sync

---

## **🚨 EMERGENCY PROCEDURES**

### **Panic Button Integration**
- **Immediate Response**: Direct connection to 24/7 control room
- **Location Tracking**: Automatic GPS coordinates transmission
- **Emergency Contacts**: Automatic notification to pre-set contacts
- **CPO Alert**: Instant notification to assigned Protection Officer

### **Emergency Communication**
- **24/7 Control Room**: Continuous monitoring capability
- **Emergency Hotline**: Direct line bypassing normal support
- **Live Chat**: Instant messaging with control room operators
- **Silent Alerts**: Discrete emergency notification options

---

**Last Updated**: 2025-09-28
**Status**: OFFICIAL USER FLOW - Production Implementation

---

Last updated: 2025-10-09T08:08:25.962Z
