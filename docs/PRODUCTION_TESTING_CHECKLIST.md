# Production Testing Checklist
## Armora Protection App - Manual QA Testing Guide

**Production URL:** https://armora-hpp7ejnrw-giquinas-projects.vercel.app
**Test Date:** _____________
**Tester Name:** _____________
**Device/Browser:** _____________

---

## Priority Legend
- **P0**: Critical - Blocks core functionality, must work for launch
- **P1**: High - Important features, should work for good UX
- **P2**: Medium - Nice to have, can be addressed post-launch

---

## 1. Authentication Tests

### 1.1 Email Authentication (P0)
- [ ] **Sign Up with Email**
  - Navigate to signup view
  - Enter valid email and password
  - Enter full name
  - Click "Sign Up"
  - **Expected:** User account created, redirected to questionnaire
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Email Validation**
  - Attempt signup with invalid email format
  - **Expected:** Error message displayed, signup blocked
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Password Requirements**
  - Attempt signup with weak password (<6 characters)
  - **Expected:** Error message about password strength
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Sign In with Email**
  - Navigate to login view
  - Enter registered email and password
  - Click "Sign In"
  - **Expected:** Successful login, redirected to Hub view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Incorrect Credentials**
  - Attempt login with wrong password
  - **Expected:** Error message "Invalid credentials"
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 1.2 Google OAuth (P0)
- [ ] **Sign In with Google**
  - Click "Continue with Google" button
  - Select Google account
  - Grant permissions
  - **Expected:** Account created/logged in, redirected appropriately
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Google OAuth - New User**
  - Sign in with Google using new account
  - **Expected:** Profile created automatically, taken to questionnaire
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Google OAuth - Returning User**
  - Sign in with Google using existing account
  - **Expected:** Logged in directly to Hub view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 1.3 Guest Mode (P1)
- [ ] **Continue as Guest**
  - Click "Continue as Guest" from welcome screen
  - **Expected:** Access to app with limited features (quote-only mode)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Guest Booking Limitations**
  - As guest, attempt to book protection service
  - **Expected:** Prompted to create account, cannot complete booking
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Guest to Registered Conversion**
  - While in guest mode, click signup/login prompt
  - Complete registration
  - **Expected:** Seamless transition, data preserved
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 1.4 Sign Out (P0)
- [ ] **Sign Out Functionality**
  - Navigate to Account view
  - Click "Sign Out"
  - **Expected:** Logged out, returned to welcome screen, localStorage cleared
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Session Persistence**
  - Log in, close browser
  - Reopen app
  - **Expected:** Still logged in (session maintained)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 2. Protection Booking Flow

### 2.1 Essential Tier (£65/h - SIA Level 2) (P0)
- [ ] **Select Essential Protection**
  - Navigate to booking flow
  - Select "Essential" tier
  - **Expected:** Tier selected, pricing displayed (£65/h)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Enter Pickup Location**
  - Enter valid UK address/postcode
  - **Expected:** Location validated, map marker displayed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Enter Destination**
  - Enter valid destination address
  - **Expected:** Route calculated, duration and cost estimated
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Select Date & Time**
  - Choose future date and time
  - **Expected:** Date/time selector works, validates future bookings only
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Review Booking Summary**
  - Review all details before payment
  - **Expected:** Correct tier, locations, time, and cost displayed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Complete Essential Booking**
  - Proceed to payment (test mode)
  - Complete payment flow
  - **Expected:** Booking confirmed, assignment created, redirected to Hub
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 2.2 Executive Tier (£95/h - SIA Level 3) (P0)
- [ ] **Select Executive Protection**
  - Select "Executive" tier during booking
  - **Expected:** Tier selected, pricing displayed (£95/h), corporate bodyguard description shown
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Executive Booking Flow**
  - Complete full booking with locations and time
  - **Expected:** Premium pricing reflected, correct service level
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Complete Executive Booking**
  - Complete payment and booking
  - **Expected:** Executive CPO assigned, booking confirmed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 2.3 Shadow Protocol (£125/h - Special Forces) (P0)
- [ ] **Select Shadow Protocol**
  - Select "Shadow Protocol" tier
  - **Expected:** Premium tier selected, pricing £125/h, Special Forces description
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Shadow Protocol Booking**
  - Complete full booking flow
  - **Expected:** Top-tier pricing and features displayed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Complete Shadow Protocol Booking**
  - Complete payment
  - **Expected:** Elite CPO assigned, highest service level confirmed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 2.4 Client Vehicle (£55/h - Security Driver) (P1)
- [ ] **Select Client Vehicle**
  - Select "Client Vehicle" option
  - **Expected:** Different pricing (£55/h), security driver terminology
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Client Vehicle Booking**
  - Complete booking with customer's vehicle
  - **Expected:** Appropriate messaging about using own vehicle
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 2.5 Booking Validation (P0)
- [ ] **Past Date Validation**
  - Attempt to book with past date
  - **Expected:** Error message, booking blocked
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Invalid Location**
  - Enter location outside England & Wales
  - **Expected:** Warning or error about service area
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Incomplete Booking Prevention**
  - Attempt to proceed without all required fields
  - **Expected:** Form validation errors, cannot proceed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 2.6 Booking Modifications (P1)
- [ ] **Edit Booking Before Confirmation**
  - Start booking, go back to edit details
  - **Expected:** Can modify all fields, data preserved
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Cancel Booking Flow**
  - Start booking, click cancel
  - **Expected:** Warning prompt, booking cancelled, no charge
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 3. Hub Navigation & View Transitions

### 3.1 Splash Screen (P0)
- [ ] **Initial Load - Splash Screen**
  - Load app for first time
  - **Expected:** Armora 4D logo displayed for 2-3 seconds
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Splash to Welcome Transition**
  - Wait for splash to complete
  - **Expected:** Smooth transition to welcome screen
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.2 Welcome Screen (P0)
- [ ] **Welcome Screen Display**
  - View welcome screen
  - **Expected:** Brand messaging, CTA buttons for Login/Signup/Guest visible
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Navigation to Login**
  - Click "Sign In" button
  - **Expected:** Navigate to login view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Navigation to Signup**
  - Click "Sign Up" button
  - **Expected:** Navigate to signup view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.3 Questionnaire Flow (P0)
- [ ] **Questionnaire Entry**
  - Complete signup as new user
  - **Expected:** Automatically redirected to questionnaire
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Step 1: User Type Selection**
  - Select user type (Individual/Corporate/etc.)
  - **Expected:** Progressive disclosure applied, appropriate questions shown
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Progress Indicator**
  - Complete multiple steps
  - **Expected:** Progress bar updates, shows X/9 steps completed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Back Navigation**
  - Click back button during questionnaire
  - **Expected:** Return to previous step, answers preserved
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Risk Assessment Display**
  - Complete risk-related questions
  - **Expected:** Risk matrix/indicators update in real-time
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **7Ps Security Assessment** (P1)
  - Trigger high-risk profile
  - **Expected:** 7Ps assessment shown (Planning, Preparation, etc.)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Emergency Contacts**
  - Add emergency contacts (name, phone, relationship)
  - **Expected:** Multiple contacts can be added, validated
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Questionnaire Completion**
  - Complete all 9 steps
  - **Expected:** Profile summary shown, redirected to achievement view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.4 Achievement View (P1)
- [ ] **Achievement Display**
  - Complete questionnaire
  - **Expected:** Congratulations message, service recommendation shown
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Achievement to Home Transition**
  - Click continue from achievement
  - **Expected:** Navigate to Home view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.5 Home View (P1)
- [ ] **Home View Display**
  - Navigate to Home
  - **Expected:** Overview of services, quick actions visible
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Home to Hub Navigation**
  - Click through to Hub
  - **Expected:** Navigate to Hub command center
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.6 Hub Command Center (P0)
- [ ] **Hub Header Display**
  - View Hub
  - **Expected:** Greeting (42px, weight 800), date (18px), time (16px) hierarchy correct
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **NavigationCards Layout**
  - Scroll through Hub
  - **Expected:** Single-column layout, full-width cards, no decorative borders
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Current Assignment Card** (with active booking)
  - View with active assignment
  - **Expected:** Current protection detail displayed, CPO info, status
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Upcoming Assignment Card**
  - View with scheduled booking
  - **Expected:** Upcoming protection details shown with countdown
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Completed Assignments Card**
  - View completed bookings
  - **Expected:** History shown, ratings, costs
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Analytics Card** (P1)
  - View analytics
  - **Expected:** Usage stats, sparklines, mini visualizations
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Hub to Assignments Navigation**
  - Click "View All Assignments"
  - **Expected:** Navigate to assignments view
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.7 Assignments View (P1)
- [ ] **Assignments List Display**
  - View assignments
  - **Expected:** All bookings shown (active, upcoming, completed)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Assignment Details**
  - Click on assignment
  - **Expected:** Full details displayed, CPO info, route, cost
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 3.8 Account View (P0)
- [ ] **Account Profile Display**
  - Navigate to Account
  - **Expected:** Profile info, settings, preferences visible
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Edit Profile**
  - Update profile information
  - **Expected:** Changes saved, Supabase profile updated
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Account to Hub Navigation**
  - Return to Hub from Account
  - **Expected:** Back navigation works
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 4. EnhancedProtectionPanel

### 4.1 Panel States (P0)
- [ ] **Collapsed State (82px)**
  - View panel when collapsed
  - **Expected:**
    - Line 1: Status dot + "PROTECTION ACTIVE • [Service Tier]" + expand arrow
    - Line 2: "Protection Officer: [Name] • [Tier]"
    - Line 3: "Route: [Start] → [End]"
    - Line 4: Duration + animated cost meter
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Collapsed Text Alignment**
  - Check text alignment
  - **Expected:** All text left-aligned, no center alignment
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Tap to Expand**
  - Tap collapsed panel
  - **Expected:** Expands to full state (75vh)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Full State (75vh)**
  - View fully expanded panel
  - **Expected:**
    - CPO profile section (inline layout): Avatar + Name + SIA credentials
    - Location + time remaining
    - Quick call button + collapse icon
    - Progress bar with protection level and cost
    - 2x3 action button grid (6 buttons total)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 4.2 Swipe Gestures (P0)
- [ ] **Swipe Up Gesture**
  - Swipe up from collapsed state (>50px distance)
  - **Expected:** Panel expands to full state
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Swipe Down Gesture**
  - Swipe down from full state (>50px distance)
  - **Expected:** Panel collapses to collapsed state
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Insufficient Swipe Distance**
  - Swipe <50px
  - **Expected:** Panel stays in current state
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Drag Handle Visual Feedback**
  - Drag panel
  - **Expected:** Visual feedback during drag, smooth transition
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 4.3 Action Buttons (P0)
Each button should have: Icon (28px) + Label (13px bold) + Subtext (11px), min height 110px, gradient background

- [ ] **Panic Alert Button (Red)**
  - Click "URGENT HELP" button
  - **Expected:**
    - Haptic feedback (vibration pattern)
    - Panic mode activated (red state)
    - Auto-deactivates after 30s
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Call Officer Button (Green)**
  - Click "CALL OFFICER" button
  - **Expected:**
    - Haptic feedback
    - Phone call initiated to CPO
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Extend Service Button (Amber)**
  - Click "EXTEND SERVICE" button
  - **Expected:**
    - Time extension modal opens
    - Shows current rate and extension options
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Change Route Button (Blue)**
  - Click "CHANGE ROUTE" button
  - **Expected:**
    - Haptic feedback
    - Route modification interface opens
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Message Officer Button (Purple)**
  - Click "MESSAGE OFFICER" button
  - **Expected:**
    - Haptic feedback
    - Secure chat interface opens
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Share Location Button (Gray/Green when active)**
  - Click "SHARE LOCATION" button
  - **Expected:**
    - Toggles location sharing on/off
    - Button state changes (gray → green)
    - Text changes: "SHARE LOCATION" → "LOCATION ON"
    - Subtext changes: "Enable GPS Sharing" → "Sharing Live GPS"
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 4.4 Button Styling Verification (P1)
- [ ] **Button Layout**
  - Inspect all 6 buttons
  - **Expected:** Each button has 3 text elements stacked vertically (icon/label/subtext)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Button Colors & Gradients**
  - Check visual appearance
  - **Expected:** Each button has appropriate color gradient and box-shadow
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 4.5 Real-Time Updates (P1)
- [ ] **Progress Bar Updates**
  - Monitor during active assignment
  - **Expected:** Progress percentage updates in real-time
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **ETA Updates**
  - Monitor ETA display
  - **Expected:** ETA recalculates based on real-time data
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Cost Meter Animation**
  - Watch cost meter in collapsed state
  - **Expected:** Animated fill shows current cost
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 5. Mobile Responsiveness

### 5.1 Viewport Testing - 320px (iPhone SE) (P0)
- [ ] **320px - Layout**
  - Test on 320px viewport
  - **Expected:** No horizontal scrolling, all content fits
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **320px - Touch Targets**
  - Test all interactive elements
  - **Expected:** All buttons/links ≥44px tap target size
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **320px - Typography**
  - Check text readability
  - **Expected:** Aggressive mobile typography, text readable without zoom
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **320px - Cards**
  - Check card widths
  - **Expected:** Cards use `calc(100vw - 36px)`, no overflow
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 5.2 Viewport Testing - 375px (iPhone 12/13) (P0)
- [ ] **375px - Layout**
  - Test on 375px viewport
  - **Expected:** Optimal layout, proper spacing
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **375px - EnhancedProtectionPanel**
  - Test panel states
  - **Expected:** Collapsed 82px, full 75vh, all content visible
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **375px - Hub Cards**
  - Check NavigationCards
  - **Expected:** Single column, full width, proper spacing
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 5.3 Viewport Testing - 414px (iPhone Pro Max) (P0)
- [ ] **414px - Layout**
  - Test on 414px viewport
  - **Expected:** Comfortable spacing, no wasted space
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **414px - Action Grid**
  - Check 2x3 button grid in panel
  - **Expected:** Buttons properly sized, no scroll needed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 5.4 Viewport Testing - 768px (Tablet) (P1)
- [ ] **768px - Responsive Layout**
  - Test on tablet viewport
  - **Expected:** Layout adapts, still mobile-first approach
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **768px - Hub Layout**
  - Check Hub display
  - **Expected:** May show wider cards but maintains single-column
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 5.5 Orientation Changes (P1)
- [ ] **Portrait to Landscape**
  - Rotate device during active session
  - **Expected:** Layout adapts smoothly, no layout breaks
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Landscape Panel Behavior**
  - Test EnhancedProtectionPanel in landscape
  - **Expected:** Panel adapts height appropriately
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 5.6 Safe Area Handling (P0)
- [ ] **Notch/Island Devices**
  - Test on iPhone 14 Pro or similar
  - **Expected:** Content respects safe areas, no overlap with notch
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Bottom Navigation Safety**
  - Check bottom UI elements
  - **Expected:** Buttons clear of home indicator area
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 6. GPS Tracking Integration

### 6.1 Location Permissions (P0)
- [ ] **Initial Permission Request**
  - First time enabling location sharing
  - **Expected:** Browser prompts for location permission
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Permission Granted**
  - Grant location permission
  - **Expected:** GPS tracking starts, location shared with CPO
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Permission Denied**
  - Deny location permission
  - **Expected:** Graceful fallback, explanation shown
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 6.2 Real-Time Tracking (P0)
- [ ] **CPO Location Updates**
  - Monitor during active assignment
  - **Expected:** CPO location updates in real-time (via armoracpo app)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Principal Location Sharing**
  - Enable location sharing
  - **Expected:** Principal's location sent to Firebase Realtime Database
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Route Progress Tracking**
  - Monitor route progress
  - **Expected:** Progress percentage updates based on actual location
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 6.3 Map Display (P1)
- [ ] **Real-Time Map Rendering**
  - View map with CPO and Principal markers
  - **Expected:** Both markers visible, route drawn, updates smoothly
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Map Zoom/Pan**
  - Interact with map
  - **Expected:** Can zoom/pan, markers stay accurate
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 6.4 GPS Accuracy (P1)
- [ ] **Location Accuracy Display**
  - Check accuracy indicators
  - **Expected:** Shows GPS accuracy level (meters)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Poor GPS Signal Handling**
  - Simulate poor GPS
  - **Expected:** Warning shown, fallback behavior
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 6.5 ArmoraCPO App Integration (P0)
- [ ] **CPO App Data Reception**
  - Verify data from CPO app
  - **Expected:** CPO's real-time location, status, ETA received
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Two-Way Communication**
  - Check bidirectional updates
  - **Expected:** Both apps sync via Firebase Realtime Database
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 7. Payment Integration (Stripe)

### 7.1 Payment Setup (P0)
- [ ] **Stripe Elements Loading**
  - Reach payment step
  - **Expected:** Stripe card input elements load correctly
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Payment Form Display**
  - View payment form
  - **Expected:** Card number, expiry, CVC, postal code fields visible
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 7.2 Payment Processing (P0)
- [ ] **Test Card Payment**
  - Use Stripe test card: 4242 4242 4242 4242
  - Enter future expiry, any CVC
  - **Expected:** Payment processes successfully
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Payment Success Flow**
  - Complete successful payment
  - **Expected:**
    - Payment confirmed
    - Booking created in database
    - Redirected to success/hub view
    - Confirmation email sent (if implemented)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 7.3 Payment Validation (P0)
- [ ] **Invalid Card Number**
  - Enter invalid card number
  - **Expected:** Stripe validation error displayed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Expired Card**
  - Enter past expiry date
  - **Expected:** Error message, payment blocked
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Declined Payment**
  - Use test card 4000 0000 0000 0002 (declined)
  - **Expected:** Decline message, booking not created
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 7.4 Payment Security (P0)
- [ ] **HTTPS Connection**
  - Check URL during payment
  - **Expected:** HTTPS protocol, secure connection indicator
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **PCI Compliance**
  - Verify card data handling
  - **Expected:** Card data handled by Stripe iframe, not stored locally
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 7.5 Pricing Display (P0)
- [ ] **Accurate Cost Calculation**
  - Review cost before payment
  - **Expected:** Correct tier pricing × hours, total matches booking
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Currency Display**
  - Check currency formatting
  - **Expected:** GBP (£) displayed correctly throughout
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 7.6 Time Extension Payment (P1)
- [ ] **Extension Payment Flow**
  - Extend active assignment
  - **Expected:** Additional payment processed, time extended
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Extension Cost Accuracy**
  - Check extension pricing
  - **Expected:** Correct hourly rate × extension hours
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 8. Service Worker & PWA

### 8.1 PWA Installation (P1)
- [ ] **Install Prompt**
  - Visit site multiple times (meet criteria)
  - **Expected:** "Add to Home Screen" prompt appears
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Install to Home Screen**
  - Click "Add to Home Screen"
  - **Expected:** App icon added to device home screen
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Standalone Mode**
  - Launch from home screen
  - **Expected:** Opens in standalone mode (no browser chrome)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 8.2 Manifest Configuration (P1)
- [ ] **App Icons**
  - Check installed app icon
  - **Expected:** Armora logo displayed correctly at all sizes
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **App Name**
  - Check app name on home screen
  - **Expected:** "Armora" or full name displayed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Theme Color**
  - Check status bar color
  - **Expected:** Armora brand color applied to status bar
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Splash Screen**
  - Launch installed PWA
  - **Expected:** Splash screen shows while loading
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 8.3 Service Worker (P0)
Note: Service Worker is disabled in development, only active in production

- [ ] **Service Worker Registration**
  - Check DevTools → Application → Service Workers
  - **Expected:** Service worker registered and active in production
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Offline Fallback**
  - Go offline after loading app
  - Navigate between views
  - **Expected:** Basic functionality maintained, offline indicators shown
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Cache Strategy**
  - Check cached resources
  - **Expected:** Static assets cached, API calls handled appropriately
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 8.4 Offline Mode (P2)
- [ ] **Offline Detection**
  - Disable network connection
  - **Expected:** App detects offline state, shows banner/indicator
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Offline Queue** (if implemented)
  - Perform action while offline
  - **Expected:** Action queued, executes when online
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Reconnection Handling**
  - Go back online
  - **Expected:** App syncs queued data, updates UI
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 8.5 PWA Update Mechanism (P1)
- [ ] **Update Detection**
  - Deploy new version
  - **Expected:** Service worker detects update
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Update Prompt**
  - Wait for update notification
  - **Expected:** User prompted to reload for new version
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Seamless Update**
  - Accept update
  - **Expected:** App reloads, new version active, no data loss
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 9. Firebase Cloud Messaging (Notifications)

### 9.1 Notification Permissions (P0)
- [ ] **Permission Request**
  - Trigger notification request
  - **Expected:** Browser prompts for notification permission
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Permission Granted**
  - Grant notification permission
  - **Expected:** FCM token generated, device registered
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Permission Denied**
  - Deny permission
  - **Expected:** Graceful handling, explanation of limitations
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 9.2 Push Notifications (P0)
- [ ] **Assignment Status Update**
  - CPO updates assignment status (via armoracpo app)
  - **Expected:** Push notification received: "Your CPO is approaching"
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **CPO Arrival Notification**
  - CPO arrives at pickup location
  - **Expected:** Notification: "Your CPO has arrived"
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Assignment Completion**
  - Assignment marked complete
  - **Expected:** Notification with summary and rating prompt
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 9.3 Notification Interaction (P1)
- [ ] **Tap Notification**
  - Tap on notification
  - **Expected:** App opens to relevant view (assignment details)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Notification Actions** (if implemented)
  - Use notification action buttons
  - **Expected:** Actions execute (e.g., "View", "Dismiss")
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 9.4 Foreground Notifications (P1)
- [ ] **Notification While App Open**
  - Receive notification with app in foreground
  - **Expected:** In-app notification or toast displayed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Background Notifications**
  - Receive notification with app closed
  - **Expected:** System notification shown normally
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 9.5 FCM Configuration (P0)
- [ ] **Firebase Project Connection**
  - Check Firebase console (armora-protection project)
  - **Expected:** App connected, messages being received
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Sender ID Verification**
  - Verify Sender ID: 1010601153585
  - **Expected:** Matches Firebase project configuration
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 9.6 Notification Types (P1)
- [ ] **Booking Confirmation**
  - Complete booking
  - **Expected:** Notification confirming booking details
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Assignment Reminders**
  - Check notifications before scheduled assignment
  - **Expected:** Reminder notification 1 hour before (if implemented)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Panic Alert Response** (P0)
  - Trigger panic alert
  - **Expected:** Emergency notifications sent to relevant parties
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 10. Error Tracking (Sentry Integration)

### 10.1 Sentry Setup (P1)
- [ ] **Sentry Initialization**
  - Check browser console/network tab
  - **Expected:** Sentry SDK loaded, DSN configured
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Environment Detection**
  - Verify environment tag
  - **Expected:** Production environment tagged correctly
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 10.2 Error Capture (P1)
- [ ] **JavaScript Error Capture**
  - Trigger intentional error (e.g., invalid state)
  - **Expected:** Error captured and sent to Sentry dashboard
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Network Error Capture**
  - Trigger network failure (disconnect during API call)
  - **Expected:** Network error logged to Sentry
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Unhandled Promise Rejection**
  - Cause async error
  - **Expected:** Rejection captured, logged to Sentry
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 10.3 Error Context (P1)
- [ ] **User Context**
  - Check error event in Sentry
  - **Expected:** User ID, email attached to error
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Breadcrumbs**
  - Review error details
  - **Expected:** User actions leading to error recorded
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Device Information**
  - Check error metadata
  - **Expected:** Browser, OS, device type captured
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 10.4 Error Boundaries (P0)
- [ ] **Component Error Boundary**
  - Trigger component crash
  - **Expected:** Error boundary catches error, shows fallback UI
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Assignment Error Boundary**
  - Cause error in booking flow
  - **Expected:** AssignmentErrorBoundary catches, shows recovery option
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Error Recovery**
  - Use error boundary recovery option
  - **Expected:** Can retry or navigate away, app doesn't crash
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 10.5 Performance Monitoring (P2)
- [ ] **Performance Traces**
  - Check Sentry performance tab
  - **Expected:** Page load times, API call durations tracked
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Slow Transactions**
  - Identify slow operations
  - **Expected:** Transactions >2s flagged, analyzed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 10.6 PII Scrubbing (P0)
- [ ] **Sensitive Data Protection**
  - Check captured error data
  - **Expected:** Passwords, card numbers scrubbed from errors
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **User Privacy Compliance**
  - Review all Sentry events
  - **Expected:** GDPR compliant, minimal PII captured
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 11. Cross-Browser Testing

### 11.1 Chrome/Chromium (P0)
- [ ] **Chrome Desktop**
  - Test all critical flows
  - **Expected:** Full functionality, no errors
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Chrome Android**
  - Test on Android Chrome
  - **Expected:** Mobile-optimized, PWA features work
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 11.2 Safari (P0)
- [ ] **Safari iOS**
  - Test on iPhone Safari
  - **Expected:** All features work, iOS quirks handled
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Safari Desktop**
  - Test on macOS Safari
  - **Expected:** Cross-platform consistency
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 11.3 Firefox (P1)
- [ ] **Firefox Desktop**
  - Test core functionality
  - **Expected:** No major issues, graceful degradation if needed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Firefox Android**
  - Test on Android Firefox
  - **Expected:** Mobile features work
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 11.4 Edge (P1)
- [ ] **Edge Desktop**
  - Test on Windows Edge
  - **Expected:** Chromium-based features work
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 12. Professional Terminology Compliance

### 12.1 SIA Terminology (P0)
- [ ] **Protection Officer (not Driver)**
  - Check all UI text
  - **Expected:** "Protection Officer" or "CPO" used throughout
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Principal (not Passenger)**
  - Check booking flow
  - **Expected:** "Principal" used to refer to client
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Protection Detail (not Ride/Trip)**
  - Check assignment references
  - **Expected:** "Protection Detail" or "Assignment" terminology
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Service Tiers**
  - Verify tier naming
  - **Expected:** Essential, Executive, Shadow Protocol (not Standard/Premium/VIP)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 12.2 Status Terminology (P0)
- [ ] **Active Status**
  - Check in-progress assignments
  - **Expected:** "Protection Detail Active" (not "In Progress")
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **En Route Status**
  - Check CPO approaching status
  - **Expected:** "CPO Approaching Principal" (not "Driver En Route")
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 13. Performance Testing

### 13.1 Load Times (P0)
- [ ] **Initial Page Load**
  - Measure cold load time
  - **Expected:** <3 seconds on 4G connection
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Time to Interactive**
  - Measure TTI
  - **Expected:** <5 seconds
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 13.2 Runtime Performance (P1)
- [ ] **Smooth Animations**
  - Test all transitions and animations
  - **Expected:** 60fps, no janky animations
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Scroll Performance**
  - Scroll long lists (assignments, hub cards)
  - **Expected:** Smooth scrolling, no lag
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 13.3 Memory Usage (P2)
- [ ] **Memory Leaks**
  - Navigate extensively, check memory
  - **Expected:** Memory usage stable, no leaks
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 14. Accessibility (WCAG)

### 14.1 Keyboard Navigation (P1)
- [ ] **Tab Navigation**
  - Navigate using Tab key
  - **Expected:** Logical tab order, all interactive elements reachable
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Focus Indicators**
  - Tab through elements
  - **Expected:** Clear focus indicators visible
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 14.2 Screen Reader (P2)
- [ ] **Screen Reader Labels**
  - Test with VoiceOver/TalkBack
  - **Expected:** All elements properly labeled, context clear
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 14.3 Color Contrast (P1)
- [ ] **Text Contrast**
  - Check text against backgrounds
  - **Expected:** All text meets WCAG AA contrast ratio (4.5:1)
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## 15. Security Testing

### 15.1 Authentication Security (P0)
- [ ] **Session Timeout**
  - Leave app idle for extended period
  - **Expected:** Session remains secure, re-auth if needed
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Token Handling**
  - Check localStorage/sessionStorage
  - **Expected:** Tokens stored securely, not exposed in console
  - **Pass/Fail:** _____ | **Notes:** _____________________________

### 15.2 Data Privacy (P0)
- [ ] **No Sensitive Data in URLs**
  - Check URL parameters
  - **Expected:** No passwords, tokens, PII in URLs
  - **Pass/Fail:** _____ | **Notes:** _____________________________

- [ ] **Secure API Calls**
  - Check network tab
  - **Expected:** All API calls over HTTPS, proper headers
  - **Pass/Fail:** _____ | **Notes:** _____________________________

---

## Testing Summary

**Total Tests:** _____
**Passed:** _____
**Failed:** _____
**Blocked:** _____
**Pass Rate:** _____%

### Critical Issues (P0 failures):
1. _____________________________________
2. _____________________________________
3. _____________________________________

### High Priority Issues (P1 failures):
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Recommendations:
_____________________________________
_____________________________________
_____________________________________

### Sign-Off:
**Tester:** _____________________ **Date:** _________
**Review:** _____________________ **Date:** _________

---

## Notes & Observations
_____________________________________
_____________________________________
_____________________________________
_____________________________________
