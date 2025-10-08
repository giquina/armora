# E2E Testing Guide: Armora Principal + ArmoraCPO Integration

## Overview

This guide provides comprehensive end-to-end testing procedures for the dual-app Armora protection services ecosystem:
- **Armora (Principal App)**: Client-facing application for booking protection services
- **ArmoraCPO (Officer App)**: CPO-facing application for accepting and managing assignments

## Table of Contents

1. [Setup Requirements](#setup-requirements)
2. [Complete Protection Flow](#complete-protection-flow)
3. [Test Scenarios](#test-scenarios)
4. [GPS Tracking Verification](#gps-tracking-verification)
5. [Database Verification Queries](#database-verification-queries)
6. [Common Issues & Troubleshooting](#common-issues--troubleshooting)

---

## Setup Requirements

### 1. Deployment Prerequisites

#### Armora (Principal App)
- **Production URL**: https://armora.vercel.app
- **Development**: `npm start` on PORT 3000
- **Environment Variables**:
  ```bash
  REACT_APP_SUPABASE_URL=<your-supabase-url>
  REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>
  REACT_APP_FIREBASE_API_KEY=<firebase-api-key>
  REACT_APP_FIREBASE_PROJECT_ID=armora-protection
  REACT_APP_GOOGLE_MAPS_API_KEY=<google-maps-key>
  REACT_APP_STRIPE_PUBLISHABLE_KEY=<stripe-key>
  REACT_APP_SENTRY_DSN=<sentry-dsn> # Optional
  ```

#### ArmoraCPO (Officer App)
- **Production URL**: <armoracpo-production-url>
- **Development**: `npm start` on PORT 3001
- **Environment Variables**: Same as Armora Principal App
- **Additional Requirements**:
  - GPS location permissions enabled
  - Background location tracking enabled (mobile)
  - Firebase Cloud Messaging configured

### 2. Test Account Setup

#### Principal Test Account
```
Email: test-principal@armora.com
Password: TestPrincipal123!
Role: principal
User ID: <principal-user-id>
```

#### CPO Test Account
```
Email: test-cpo@armora.com
Password: TestCPO123!
Role: protection_officer
User ID: <cpo-user-id>
SIA License: TEST-SIA-12345678
Protection Levels: ['essential', 'executive', 'shadow']
Vehicle: Mercedes S-Class, REG: ABC 123
```

#### Admin Test Account (Optional)
```
Email: test-admin@armora.com
Password: TestAdmin123!
Role: admin
```

### 3. Database Access

#### Supabase Dashboard
- URL: https://app.supabase.com/project/<project-id>
- Access: SQL Editor for running verification queries
- Tables to monitor:
  - `profiles`
  - `protection_officers`
  - `protection_assignments`
  - `assignment_broadcasts`
  - `officer_location_tracking` (Firebase Realtime DB)
  - `payment_transactions`
  - `protection_reviews`

#### Firebase Console
- URL: https://console.firebase.google.com/project/armora-protection
- Access: Realtime Database for GPS tracking
- Tables to monitor:
  - `tracking/{assignmentId}/location`
  - `tracking/{assignmentId}/progress`

### 4. Testing Tools

#### Browser DevTools
- Network tab: Monitor API calls and real-time subscriptions
- Console: Watch for errors and tracking updates
- Application tab: Check Service Worker status, localStorage

#### Mobile Testing
- Chrome DevTools device emulation (375x667 minimum)
- Physical iOS/Android devices for GPS testing
- Location spoofing tools: GPS Emulator (Chrome), Xcode Simulator

#### Database Monitoring
- Supabase Studio: Real-time table updates
- Firebase Console: Realtime Database viewer
- SQL queries: Verification scripts (see section 5)

---

## Complete Protection Flow

### Flow Overview

```
Principal App                          ArmoraCPO App
┌─────────────────┐                   ┌─────────────────┐
│ 1. Book Assignment │                │                 │
│ 2. Payment Processing │             │                 │
│ 3. Create Broadcast │──────────────>│ 4. Receive Notification │
│                     │                │ 5. View Assignment Details │
│ 6. Wait for CPO     │<───────────── │ 6. Accept Assignment │
│ 7. CPO Assigned     │                │ 7. Start GPS Tracking │
│ 8. View Tracking Map│<───real-time──│ 8. Update Location (3-5s) │
│ 9. Monitor Progress │<───updates────│ 9. Navigate to Pickup │
│10. CPO Arriving     │                │10. Update Status: "arrived" │
│11. Protection Active│<───────────── │11. Start Protection Detail │
│12. Live GPS Updates │<───real-time──│12. Navigate to Destination │
│13. CPO at Destination│<──────────── │13. Complete Assignment │
│14. Rate & Review    │                │14. View Rating │
└─────────────────┘                   └─────────────────┘
```

### Step-by-Step Testing Flow

#### Step 1: Principal Books Protection Assignment

**Principal App Actions:**
1. Navigate to Hub view (`currentView: 'hub'`)
2. Click "Request Protection" button
3. Enter commencement point: "221B Baker Street, London"
4. Enter secure destination: "10 Downing Street, London"
5. Select protection tier: "Executive" (£95/hr)
6. Review pricing: £142.50 (1.5 hours estimated)
7. Click "Confirm & Pay"
8. Enter payment details (or use saved payment method)
9. Complete Stripe payment processing

**Expected Outcomes:**
- Payment intent created successfully
- Assignment record created in `protection_assignments` table
- Assignment status: `requested`
- Broadcast record created in `assignment_broadcasts` table
- Broadcast status: `pending`
- Broadcast expires_at: 60 seconds from now

**Database Verification:**
```sql
-- Check assignment creation
SELECT id, principal_id, protection_level, assignment_status, service_fee, created_at
FROM protection_assignments
WHERE principal_id = '<principal-user-id>'
ORDER BY created_at DESC
LIMIT 1;

-- Check broadcast creation
SELECT id, assignment_id, status, expires_at, broadcast_radius_km
FROM assignment_broadcasts
WHERE principal_user_id = '<principal-user-id>'
ORDER BY created_at DESC
LIMIT 1;

-- Check payment transaction
SELECT id, assignment_id, payment_status, total_amount, stripe_payment_intent_id
FROM payment_transactions
WHERE principal_id = '<principal-user-id>'
ORDER BY created_at DESC
LIMIT 1;
```

**Visual Checks (Principal App):**
- Loading spinner: "Finding available Protection Officers..."
- Timer: 60-second countdown showing time remaining
- Map view: Shows commencement point and destination markers

---

#### Step 2: CPO Receives Assignment Notification

**ArmoraCPO App Actions:**
1. CPO app is open and monitoring broadcasts
2. Push notification received: "New Assignment Available"
3. Notification shows: Protection tier, location, estimated earnings
4. CPO clicks notification to open assignment details

**Expected Outcomes:**
- FCM push notification delivered to CPO device
- Notification contains: `assignment_id`, `protection_tier`, `service_fee`
- ArmoraCPO app navigates to assignment details view
- Assignment shows on "Available Assignments" list

**Database Verification:**
```sql
-- Check broadcast is visible to CPO
SELECT
  ab.id,
  ab.assignment_id,
  ab.commencement_address,
  ab.destination_address,
  ab.protection_tier,
  ab.service_fee,
  ab.status,
  ab.expires_at
FROM assignment_broadcasts ab
WHERE ab.status = 'pending'
  AND ab.expires_at > NOW()
  AND ST_DWithin(
    ST_MakePoint(ab.principal_longitude, ab.principal_latitude)::geography,
    (SELECT current_location::geography FROM protection_officers WHERE user_id = '<cpo-user-id>'),
    ab.broadcast_radius_km * 1000
  );
```

**Visual Checks (ArmoraCPO App):**
- Assignment card displayed with:
  - Protection tier badge (e.g., "Executive")
  - Commencement point address
  - Destination address
  - Estimated duration and distance
  - Service fee (CPO earnings)
  - "Accept Assignment" button (green, prominent)
  - Countdown timer matching broadcast expiry

---

#### Step 3: CPO Accepts Assignment

**ArmoraCPO App Actions:**
1. CPO reviews assignment details
2. CPO clicks "Accept Assignment" button
3. Confirmation prompt: "Confirm you can reach commencement point in time?"
4. CPO clicks "Confirm Acceptance"

**Expected Outcomes:**
- Broadcast status updated to `accepted`
- Assignment status updated to `officer_assigned`
- Officer ID linked to assignment
- CPO availability status changed to `on_assignment`
- Principal app receives real-time update via Supabase subscription
- GPS tracking session initialized in Firebase

**Database Verification:**
```sql
-- Check broadcast acceptance
SELECT id, assignment_id, status, accepted_by_cpo_id, accepted_at
FROM assignment_broadcasts
WHERE assignment_id = '<assignment-id>';

-- Check assignment update
SELECT id, assignment_status, officer_id, officer_assigned_at
FROM protection_assignments
WHERE id = '<assignment-id>';

-- Check officer status
SELECT id, user_id, availability_status, current_assignment_id
FROM protection_officers
WHERE user_id = '<cpo-user-id>';
```

**Visual Checks (Principal App):**
- Broadcast waiting screen replaced with "Officer Assigned" view
- CPO details displayed:
  - Name: "James Smith"
  - SIA License: "TEST-SIA-12345678"
  - Rating: "4.9 ⭐ (127 assignments)"
  - Vehicle: "Mercedes S-Class • ABC 123 • Silver"
- EnhancedProtectionPanel appears (collapsed state)
- Status: "Protection Officer Assigned • En Route to Commencement Point"
- Live tracking map initializes

**Visual Checks (ArmoraCPO App):**
- Assignment moved to "Active Assignments" section
- "Start Navigation" button appears
- Assignment status: "Officer Assigned"
- Map shows route to commencement point

---

#### Step 4: GPS Tracking Begins

**ArmoraCPO App Actions:**
1. CPO clicks "Start Navigation"
2. App requests location permissions (if not granted)
3. GPS tracking starts automatically
4. Location updates sent every 3-5 seconds

**Expected Outcomes:**
- Firebase Realtime Database tracking node created
- Location updates written to: `tracking/{assignmentId}/location`
- Route progress calculated and written to: `tracking/{assignmentId}/progress`
- Principal app subscribes to location updates via `useRealtimeTracking` hook

**Firebase Realtime Database Structure:**
```json
{
  "tracking": {
    "{assignmentId}": {
      "assignmentId": "uuid",
      "officerId": "uuid",
      "status": "en_route",
      "startedAt": 1696800000000,
      "active": true,
      "location": {
        "officerId": "uuid",
        "assignmentId": "uuid",
        "latitude": 51.5237,
        "longitude": -0.1585,
        "heading": 180.5,
        "speed": 15.3,
        "accuracy": 10,
        "timestamp": 1696800010000,
        "status": "en_route"
      },
      "progress": {
        "distanceRemaining": 2500,
        "estimatedTimeArrival": 1696800600000,
        "percentComplete": 15.5,
        "timestamp": 1696800010000
      }
    }
  }
}
```

**Database Verification (Supabase):**
```sql
-- Check officer location update (optional PostgreSQL backup)
SELECT id, officer_id, current_location, last_location_update
FROM protection_officers
WHERE id = '<officer-id>';

-- Check assignment status
SELECT id, assignment_status, assignment_start_time
FROM protection_assignments
WHERE id = '<assignment-id>';
```

**Visual Checks (Principal App):**
- Live tracking map shows:
  - Officer's current position (blue marker with pulsing animation)
  - Commencement point (green marker)
  - Destination (red marker)
  - Route path (blue polyline)
- Status banner: "Live Tracking Active • 15% Complete"
- Info panel shows:
  - Distance Remaining: 1.6 mi
  - ETA: 12:45 PM
  - Progress: 15%
- EnhancedProtectionPanel (collapsed):
  - "Protection Officer Approaching • James Smith • 1.6 mi away"

**Visual Checks (ArmoraCPO App):**
- GPS accuracy indicator: "GPS Accuracy: 10m"
- Route navigation with turn-by-turn directions
- Current speed: "15 mph"
- Distance to commencement: "1.6 mi"
- ETA: "12:45 PM"

---

#### Step 5: CPO Arrives at Commencement Point

**ArmoraCPO App Actions:**
1. CPO reaches commencement point (within 50m)
2. App automatically detects arrival (geofencing)
3. CPO clicks "I Have Arrived" button
4. Status updated to `arrived`

**Expected Outcomes:**
- Firebase location status updated to `arrived`
- Assignment status updated to `officer_en_route` → `protection_commenced`
- Principal app receives arrival notification
- ArmoraCPO app shows "Waiting for Principal" screen

**Database Verification:**
```sql
-- Check assignment status update
SELECT id, assignment_status, assignment_start_time
FROM protection_assignments
WHERE id = '<assignment-id>';

-- Check officer status
SELECT id, availability_status
FROM protection_officers
WHERE id = '<officer-id>';
```

**Visual Checks (Principal App):**
- Push notification: "Your Protection Officer has arrived"
- Map centers on commencement point
- Officer marker shows "Arrived" status
- EnhancedProtectionPanel (half-expanded):
  - Status: "Protection Officer Arrived"
  - Button grid visible (3x2 layout):
    - Call CPO (green)
    - Send Message (purple)
    - View Route (blue)
    - Emergency (red)
    - Extend Time (amber)
    - Share Location (gray)

**Visual Checks (ArmoraCPO App):**
- "Principal Approaching" message
- Timer: Time elapsed since arrival
- "Start Protection Detail" button (green, prominent)

---

#### Step 6: Protection Detail Commences

**ArmoraCPO App Actions:**
1. Principal enters vehicle and confirms identity
2. CPO clicks "Start Protection Detail" button
3. Status updated to `in_progress`
4. Navigation to destination begins

**Expected Outcomes:**
- Assignment status: `protection_commenced`
- Assignment start time recorded
- GPS tracking continues with updated route (now heading to destination)
- Principal app shows "Protection Active" status

**Database Verification:**
```sql
-- Check assignment activation
SELECT
  id,
  assignment_status,
  assignment_start_time,
  actual_duration_minutes
FROM protection_assignments
WHERE id = '<assignment-id>';
```

**Visual Checks (Principal App):**
- EnhancedProtectionPanel (full-expanded on demand):
  - Status: "Protection Detail Active"
  - Timer: "00:05:32" (elapsed time)
  - Action buttons (2x3 grid):
    - 🚨 EMERGENCY (red, top-left)
    - 📞 Call CPO (green)
    - ⏱️ Extend Time (amber)
    - 🗺️ View Route (blue)
    - 💬 Message CPO (purple)
    - 📍 Share Location (green when active)
- Live map updates:
  - Officer marker moves in real-time
  - Blue polyline shows traveled path
  - Progress: 45% complete
  - Distance remaining: 0.9 mi
  - ETA: 12:58 PM

**Visual Checks (ArmoraCPO App):**
- "Protection Active" badge (green)
- Navigation route to destination
- Timer: Duration of active protection
- "Complete Assignment" button (disabled until near destination)

---

#### Step 7: En Route to Destination

**Continuous Updates (Both Apps):**

**ArmoraCPO App:**
- GPS location updated every 3-5 seconds
- Firebase Realtime DB receives updates
- Route progress recalculated automatically
- Speed, heading, accuracy sent with each update

**Principal App:**
- Map auto-centers on officer location
- Route path grows as officer moves
- Info panel updates in real-time:
  - Distance Remaining: 0.5 mi → 0.3 mi → 0.1 mi
  - ETA: 12:58 PM → 12:56 PM → 12:55 PM
  - Progress: 45% → 70% → 95%

**Database Verification (Firebase Console):**
```javascript
// Watch updates in Firebase Console
// Path: tracking/{assignmentId}/location
// Should see updates every 3-5 seconds with:
{
  latitude: 51.5034, // Changes with each update
  longitude: -0.1276, // Changes with each update
  heading: 165.3, // Direction of travel
  speed: 18.5, // Current speed (m/s)
  accuracy: 8, // GPS accuracy (meters)
  timestamp: 1696800450000, // Unix timestamp
  status: "in_progress"
}
```

**Visual Checks (Principal App):**
- Officer marker animates smoothly between positions
- Blue polyline trail extends behind officer
- Status banner: "Live Tracking Active • 95% Complete"
- EnhancedProtectionPanel (collapsed):
  - "Protection Active • James Smith • 0.1 mi to Destination"

---

#### Step 8: Arrival at Destination

**ArmoraCPO App Actions:**
1. CPO reaches destination (within 50m)
2. App detects arrival via geofencing
3. CPO clicks "Complete Assignment" button
4. Confirmation prompt: "Confirm Principal has arrived safely?"
5. CPO clicks "Confirm Completion"

**Expected Outcomes:**
- Firebase tracking status: `completed`
- Assignment status: `completed`
- Assignment end time recorded
- Actual duration calculated
- GPS tracking session ended
- Officer availability status: `available`
- Principal app receives completion notification

**Database Verification:**
```sql
-- Check assignment completion
SELECT
  id,
  assignment_status,
  assignment_start_time,
  assignment_end_time,
  estimated_duration_minutes,
  actual_duration_minutes,
  distance_miles
FROM protection_assignments
WHERE id = '<assignment-id>';

-- Check officer availability
SELECT id, availability_status, current_assignment_id
FROM protection_officers
WHERE id = '<officer-id>';

-- Check payment finalization
SELECT id, payment_status, processed_at
FROM payment_transactions
WHERE assignment_id = '<assignment-id>';
```

**Visual Checks (Principal App):**
- Push notification: "Protection Assignment Completed Safely"
- EnhancedProtectionPanel disappears
- "Assignment Complete" view displays:
  - Success checkmark animation
  - Duration: "1 hour 23 minutes"
  - Distance: "5.8 miles"
  - Service fee: £142.50
  - "Rate Your Protection Officer" button

**Visual Checks (ArmoraCPO App):**
- "Assignment Completed" confirmation screen
- Earnings displayed: £142.50
- "View Assignment Summary" button
- Officer returns to "Available" status

---

#### Step 9: Rating & Review

**Principal App Actions:**
1. Click "Rate Your Protection Officer"
2. Select overall rating: 5 stars
3. Rate specific categories:
   - Security: 5 stars
   - Professionalism: 5 stars
   - Communication: 5 stars
   - Vehicle: 5 stars
4. Enter review text: "Excellent protection service. James was professional and made me feel secure throughout the journey."
5. Toggle "Would recommend": Yes
6. Click "Submit Review"

**Expected Outcomes:**
- Review record created in `protection_reviews` table
- Officer's average rating recalculated automatically
- Officer's completed assignments count incremented
- Review visible to other Principals (after moderation)

**Database Verification:**
```sql
-- Check review submission
SELECT
  id,
  assignment_id,
  officer_id,
  principal_id,
  overall_rating,
  security_rating,
  professionalism_rating,
  communication_rating,
  vehicle_rating,
  review_text,
  would_recommend,
  created_at
FROM protection_reviews
WHERE assignment_id = '<assignment-id>';

-- Check officer rating update
SELECT
  id,
  average_rating,
  total_assignments,
  completed_assignments
FROM protection_officers
WHERE id = '<officer-id>';

-- Verify rating calculation
SELECT
  officer_id,
  AVG(overall_rating) as calculated_avg,
  COUNT(*) as review_count
FROM protection_reviews
WHERE officer_id = '<officer-id>'
  AND review_status = 'published'
GROUP BY officer_id;
```

**Visual Checks (Principal App):**
- Success message: "Thank you for your feedback!"
- Hub view displays completed assignment in "Past Assignments"
- Assignment shows officer rating and review

**Visual Checks (ArmoraCPO App):**
- Notification: "You received a new review from [Principal Name]"
- Rating displayed in officer profile
- Review visible in "My Reviews" section

---

## Test Scenarios

### Scenario 1: Essential Tier, Immediate Booking

**Objective:** Test basic protection assignment with standard Essential tier service.

**Prerequisites:**
- Principal logged in
- CPO available within 10km
- Payment method configured

**Test Steps:**

1. **Principal Books Assignment:**
   - Tier: Essential (£65/hr)
   - Commencement: "Kings Cross Station, London"
   - Destination: "Heathrow Airport Terminal 5"
   - Schedule: Immediate (ASAP)
   - Estimated duration: 45 minutes
   - Service fee: £48.75

2. **Expected Assignment Flow:**
   - Broadcast created with 60-second expiry
   - Nearest available Essential-qualified CPO notified
   - CPO accepts within 30 seconds
   - GPS tracking begins
   - ETA to commencement: 8 minutes
   - Protection detail duration: 45 minutes
   - Successful completion
   - Rating: 5 stars

**Success Criteria:**
- ✅ Broadcast delivered to qualified CPOs only
- ✅ Acceptance within 60 seconds
- ✅ GPS updates every 3-5 seconds
- ✅ No location tracking gaps
- ✅ Accurate ETA calculations (±2 minutes)
- ✅ Payment processed successfully
- ✅ Review submitted and officer rating updated

**Database Queries:**
```sql
-- Verify Essential tier matching
SELECT po.id, po.user_id, p.full_name, po.protection_level, po.availability_status
FROM protection_officers po
JOIN profiles p ON p.id = po.user_id
WHERE 'essential' = ANY(po.protection_level)
  AND po.availability_status = 'available'
  AND po.active = TRUE;

-- Check broadcast targeting
SELECT id, assignment_id, protection_tier, status, expires_at
FROM assignment_broadcasts
WHERE assignment_id = '<assignment-id>'
  AND protection_tier = 'essential';
```

---

### Scenario 2: Executive Tier, Scheduled Booking

**Objective:** Test scheduled assignment with advanced notice and Executive tier service.

**Prerequisites:**
- Principal has completed questionnaire
- Executive tier recommended based on profile
- Scheduled for 2 hours in future

**Test Steps:**

1. **Principal Schedules Assignment:**
   - Tier: Executive (£95/hr)
   - Commencement: "The Dorchester Hotel, Park Lane, London"
   - Destination: "Royal Opera House, Covent Garden"
   - Schedule: 2 hours from now (19:30)
   - Estimated duration: 30 minutes
   - Service fee: £47.50

2. **Assignment Lifecycle:**
   - Assignment created with `scheduled_time`
   - No immediate broadcast (scheduled for later)
   - 30 minutes before scheduled time: Broadcast activated
   - CPO accepts with commitment to arrive by 19:25
   - CPO arrives early at 19:20
   - Protection detail commences at 19:30
   - Arrives at destination at 19:55
   - Assignment completed

**Success Criteria:**
- ✅ Scheduled assignment stored correctly
- ✅ No immediate broadcast created
- ✅ Broadcast triggered 30 minutes before scheduled time
- ✅ Only Executive-qualified CPOs notified
- ✅ CPO arrives at or before scheduled time
- ✅ Actual start time matches scheduled time (±5 minutes)
- ✅ Duration tracking accurate
- ✅ Payment processing deferred until completion

**Database Queries:**
```sql
-- Verify scheduled assignment
SELECT
  id,
  assignment_status,
  scheduled_time,
  requested_time,
  assignment_start_time,
  assignment_end_time
FROM protection_assignments
WHERE id = '<assignment-id>'
  AND scheduled_time > requested_time;

-- Check broadcast timing
SELECT
  ab.id,
  ab.assignment_id,
  pa.scheduled_time,
  ab.created_at,
  EXTRACT(EPOCH FROM (pa.scheduled_time - ab.created_at)) / 60 as minutes_before_scheduled
FROM assignment_broadcasts ab
JOIN protection_assignments pa ON pa.id = ab.assignment_id
WHERE ab.assignment_id = '<assignment-id>';
```

---

### Scenario 3: Shadow Protocol, Multi-Day Assignment

**Objective:** Test premium Shadow Protocol service with extended multi-day protection detail.

**Prerequisites:**
- Principal with high threat assessment score
- Shadow Protocol qualified CPO available
- Payment authorized for multi-day service

**Test Steps:**

1. **Principal Books Extended Protection:**
   - Tier: Shadow Protocol (£125/hr)
   - Commencement: "Principal's Residence"
   - Multiple destinations over 3 days
   - Schedule: Starts today, ends in 72 hours
   - Estimated total: 24 hours of protection
   - Service fee: £3,000

2. **Extended Assignment Management:**
   - Day 1 (8 hours):
     - Residence → Office → Business Meeting → Dinner → Residence
   - Day 2 (10 hours):
     - Residence → Airport → International Flight (security to gate)
   - Day 3 (6 hours):
     - Return Flight → Airport → Residence
   - GPS tracking active during all active segments
   - Breaks tracked separately (CPO on standby)

**Success Criteria:**
- ✅ Multi-day assignment created with itinerary
- ✅ Only Shadow Protocol CPOs notified (Special Forces background)
- ✅ GPS tracking active during active protection segments
- ✅ GPS paused during breaks/standby periods
- ✅ Duration calculated per segment
- ✅ Total hours tracked accurately
- ✅ Payment holds processed correctly
- ✅ Daily summaries generated
- ✅ Final payment processed at completion

**Database Queries:**
```sql
-- Check multi-day assignment structure
SELECT
  id,
  assignment_status,
  protection_level,
  assignment_start_time,
  assignment_end_time,
  EXTRACT(EPOCH FROM (assignment_end_time - assignment_start_time)) / 3600 as total_hours,
  service_fee
FROM protection_assignments
WHERE id = '<assignment-id>'
  AND protection_level = 'shadow';

-- Verify Shadow Protocol officer qualification
SELECT po.id, p.full_name, po.specializations, po.protection_level
FROM protection_officers po
JOIN profiles p ON p.id = po.user_id
WHERE po.id = '<officer-id>'
  AND 'shadow' = ANY(po.protection_level)
  AND 'special_forces' = ANY(po.specializations);

-- Check GPS tracking sessions
SELECT
  assignment_id,
  status,
  MIN(timestamp) as session_start,
  MAX(timestamp) as session_end,
  COUNT(*) as location_updates
FROM officer_location_tracking
WHERE assignment_id = '<assignment-id>'
GROUP BY assignment_id, status
ORDER BY session_start;
```

---

### Scenario 4: Client Vehicle Mode

**Objective:** Test Client Vehicle protection mode where CPO drives Principal's vehicle.

**Prerequisites:**
- Principal owns vehicle and requests CPO to drive
- CPO qualified for client vehicle operation
- Vehicle insurance covers CPO drivers

**Test Steps:**

1. **Principal Books Client Vehicle Service:**
   - Tier: Client Vehicle (£55/hr)
   - Commencement: "Principal's Home"
   - Destination: "Business Conference Center"
   - Vehicle details: "Range Rover Sport, Black, REG: XYZ 789"
   - Special instructions: "Vehicle parked in garage, keys at reception desk"
   - Estimated duration: 1 hour
   - Service fee: £55

2. **Client Vehicle Assignment Flow:**
   - CPO arrives at principal's location
   - CPO collects vehicle keys
   - Principal enters vehicle (passenger seat)
   - CPO drives to destination
   - GPS tracking shows vehicle location (not CPO's personal vehicle)
   - Arrival at destination
   - Optional: CPO remains with vehicle or returns after drop-off

**Success Criteria:**
- ✅ Client Vehicle tier broadcast to qualified CPOs only
- ✅ Special instructions visible to CPO
- ✅ Lower service fee (£55/hr vs £65/hr)
- ✅ GPS tracking active throughout journey
- ✅ No vehicle information required from CPO profile
- ✅ Insurance verification logged
- ✅ Vehicle handover documented (photos optional)
- ✅ Completion confirmed by Principal

**Database Queries:**
```sql
-- Verify Client Vehicle assignment
SELECT
  id,
  protection_level,
  client_preferences,
  special_instructions,
  service_fee
FROM protection_assignments
WHERE id = '<assignment-id>'
  AND protection_level = 'client_vehicle';

-- Check CPO qualifications
SELECT
  po.id,
  p.full_name,
  po.protection_level,
  po.specializations
FROM protection_officers po
JOIN profiles p ON p.id = po.user_id
WHERE po.id = '<officer-id>'
  AND 'client_vehicle' = ANY(po.protection_level);
```

---

### Scenario 5: Assignment Cancellation

**Objective:** Test assignment cancellation at different stages of the workflow.

**Test Cases:**

#### 5a. Cancellation Before CPO Acceptance

**Steps:**
1. Principal books assignment
2. Broadcast created (60-second window)
3. 20 seconds elapsed, no CPO accepted yet
4. Principal clicks "Cancel Assignment"
5. Confirmation prompt: "Are you sure? Cancellation fee: £0"
6. Principal confirms cancellation

**Expected Outcomes:**
- Broadcast status: `cancelled`
- Assignment status: `cancelled`
- No cancellation fee charged
- Full refund issued (if payment processed)
- CPOs no longer see broadcast
- Principal returns to Hub

**Database Verification:**
```sql
SELECT id, assignment_status, cancellation_reason, cancelled_by
FROM protection_assignments
WHERE id = '<assignment-id>';

SELECT id, status, updated_at
FROM assignment_broadcasts
WHERE assignment_id = '<assignment-id>';

SELECT id, payment_status, refund_amount, refunded_at
FROM payment_transactions
WHERE assignment_id = '<assignment-id>';
```

#### 5b. Cancellation After CPO Acceptance (Before Arrival)

**Steps:**
1. CPO accepts assignment and begins traveling
2. 5 minutes into CPO's journey to commencement point
3. Principal needs to cancel due to emergency
4. Principal clicks "Cancel Assignment"
5. Warning: "Cancellation fee: £15 (CPO compensation)"
6. Principal confirms cancellation

**Expected Outcomes:**
- Assignment status: `cancelled`
- CPO receives cancellation notification
- Cancellation fee charged: £15
- CPO compensated for time/fuel
- GPS tracking stops
- CPO availability returns to `available`

**Database Verification:**
```sql
SELECT
  id,
  assignment_status,
  cancellation_reason,
  cancelled_by,
  service_fee,
  cancellation_fee
FROM protection_assignments
WHERE id = '<assignment-id>';

-- Verify CPO compensation payment
SELECT id, payment_type, amount, recipient_id
FROM cpo_payments
WHERE assignment_id = '<assignment-id>'
  AND payment_type = 'cancellation_compensation';
```

#### 5c. Cancellation After Protection Commenced

**Steps:**
1. Protection detail is active (Principal in transit)
2. Principal requests early termination
3. Principal clicks "End Protection Early"
4. Current location confirmed as new destination
5. CPO completes assignment at current location

**Expected Outcomes:**
- Assignment marked as `completed` (not cancelled)
- Duration calculated from start to early termination
- Partial payment charged based on actual time
- CPO paid for actual time worked
- GPS tracking ends at new destination
- Rating prompt displayed (optional)

**Database Verification:**
```sql
SELECT
  id,
  assignment_status,
  assignment_start_time,
  assignment_end_time,
  estimated_duration_minutes,
  actual_duration_minutes,
  service_fee,
  actual_charge
FROM protection_assignments
WHERE id = '<assignment-id>';
```

---

### Scenario 6: Emergency Panic Button

**Objective:** Test emergency panic button activation during active protection detail.

**Prerequisites:**
- Protection detail is active
- Principal app has EnhancedProtectionPanel visible
- Emergency contacts configured in profile

**Test Steps:**

1. **Emergency Activation:**
   - Principal in distress during protection detail
   - Principal clicks "EMERGENCY" button (large red button)
   - Confirmation dialog: "ACTIVATE EMERGENCY ALERT?" with 3-second hold
   - Principal holds for 3 seconds to confirm (prevents accidental activation)

2. **Emergency Response Flow:**
   - Emergency record created in `emergency_activations` table
   - GPS location captured with high accuracy
   - CPO receives immediate alert: "PRINCIPAL EMERGENCY - RESPOND NOW"
   - Emergency contacts notified via SMS/push notification
   - Emergency services contacted (optional, based on threat level)
   - Live audio/video connection established (if available)

3. **Resolution:**
   - CPO responds and confirms Principal safety
   - Emergency marked as resolved or escalated
   - Assignment continues or terminates based on situation
   - Incident report generated

**Expected Outcomes:**
- ✅ Emergency activation requires 3-second hold (no accidental triggers)
- ✅ CPO receives alert within 1 second
- ✅ GPS location accuracy ≤ 10 meters
- ✅ Emergency contacts notified immediately
- ✅ Incident logged in database
- ✅ Police reference number generated (if emergency services contacted)
- ✅ Assignment timeline includes emergency event
- ✅ Post-incident review required before service reuse

**Database Queries:**
```sql
-- Check emergency activation
SELECT
  id,
  user_id,
  assignment_id,
  officer_id,
  activation_type,
  ST_AsText(emergency_location) as location,
  location_accuracy,
  response_status,
  emergency_services_contacted,
  police_reference_number,
  activated_at,
  first_response_at,
  resolved_at
FROM emergency_activations
WHERE assignment_id = '<assignment-id>'
ORDER BY activated_at DESC
LIMIT 1;

-- Check emergency response time
SELECT
  id,
  activated_at,
  first_response_at,
  EXTRACT(EPOCH FROM (first_response_at - activated_at)) as response_time_seconds
FROM emergency_activations
WHERE id = '<emergency-id>';

-- Verify emergency contact notifications sent
SELECT
  id,
  emergency_id,
  contact_type,
  contact_value,
  notification_status,
  sent_at
FROM emergency_notifications
WHERE emergency_id = '<emergency-id>';
```

**Visual Checks (Principal App):**
- Emergency activation screen:
  - Full-screen red overlay
  - "EMERGENCY ACTIVE" message
  - CPO response status: "CPO Notified • Responding"
  - Emergency services status: "999 Contacted • Police Dispatched"
  - Live location sharing active
  - Audio connection with CPO
  - "Cancel Emergency" button (if false alarm)

**Visual Checks (ArmoraCPO App):**
- Emergency alert screen:
  - Full-screen red alert
  - "PRINCIPAL EMERGENCY" header
  - Principal's current location on map
  - Distance to Principal
  - "I'm Responding" button (confirms acknowledgment)
  - "Call Principal" button
  - "Call Emergency Services" button
  - Emergency protocol checklist

---

## GPS Tracking Verification

### How ArmoraCPO Sends Location Updates

#### Location Tracking Service (ArmoraCPO)

**Implementation:** `src/services/locationTrackingService.ts`

```typescript
// ArmoraCPO sends location every 3-5 seconds
export async function startLocationTracking(assignmentId: string) {
  // Request high-accuracy GPS
  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const location: OfficerLocation = {
        officerId: currentOfficerId,
        assignmentId: assignmentId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        status: currentStatus // 'en_route', 'arrived', 'in_progress'
      };

      // Send to Firebase Realtime Database
      await RealtimeTrackingService.updateLocation(assignmentId, location);

      // Calculate route progress
      const progress = calculateProgress(location, destinationCoords);
      await RealtimeTrackingService.updateRouteProgress(assignmentId, progress);
    },
    (error) => console.error('GPS Error:', error),
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      distanceFilter: 10 // Update every 10 meters minimum
    }
  );

  return watchId;
}
```

### How Armora Receives and Displays GPS Updates

#### Real-time Tracking Hook (Armora Principal)

**Implementation:** `src/hooks/useRealtimeTracking.ts`

```typescript
// Armora Principal subscribes to location updates
export function useRealtimeTracking(assignmentId: string) {
  useEffect(() => {
    // Subscribe to Firebase Realtime Database
    const unsubscribeLocation = RealtimeTrackingService.subscribeToLocation(
      assignmentId,
      (location) => {
        // Update state with new location
        setState(prev => ({
          ...prev,
          location,
          isLoading: false,
          isActive: location?.status !== 'completed'
        }));
      }
    );

    const unsubscribeProgress = RealtimeTrackingService.subscribeToProgress(
      assignmentId,
      (progress) => {
        setState(prev => ({ ...prev, progress }));
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribeLocation();
      unsubscribeProgress();
    };
  }, [assignmentId]);
}
```

### Supabase Table Structure

**PostgreSQL Tables (Backup Storage):**

```sql
-- Optional: Store location history in Supabase for record-keeping
CREATE TABLE officer_location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID NOT NULL REFERENCES protection_officers(id),
  assignment_id UUID NOT NULL REFERENCES protection_assignments(id),
  location POINT NOT NULL, -- PostGIS (latitude, longitude)
  heading DECIMAL(5,2), -- 0-360 degrees
  speed DECIMAL(6,2), -- meters per second
  accuracy DECIMAL(8,2), -- meters
  status TEXT NOT NULL, -- 'en_route', 'arrived', 'in_progress', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast location queries
CREATE INDEX idx_location_history_assignment
ON officer_location_history (assignment_id, created_at DESC);

CREATE INDEX idx_location_history_geospatial
ON officer_location_history USING GIST (location);
```

### Firebase Realtime Database Structure

**Primary Storage for Live Tracking:**

```json
{
  "tracking": {
    "<assignment-id>": {
      "assignmentId": "uuid-here",
      "officerId": "cpo-uuid",
      "status": "in_progress",
      "startedAt": 1696800000000,
      "active": true,
      "location": {
        "officerId": "cpo-uuid",
        "assignmentId": "uuid-here",
        "latitude": 51.5074,
        "longitude": -0.1278,
        "heading": 180.5,
        "speed": 15.3,
        "accuracy": 8,
        "timestamp": 1696800010000,
        "status": "in_progress"
      },
      "progress": {
        "distanceRemaining": 1200,
        "estimatedTimeArrival": 1696800300000,
        "percentComplete": 75.5,
        "timestamp": 1696800010000
      },
      "lastUpdated": 1696800010000
    }
  }
}
```

### Real-time Subscription Testing

#### Test Live Updates (Browser DevTools Console)

**ArmoraCPO Console:**
```javascript
// Check if updates are being sent
console.log('Starting location tracking for assignment:', assignmentId);
// Watch console for: "Location updated: lat, lng, accuracy"
// Should see updates every 3-5 seconds
```

**Armora Principal Console:**
```javascript
// Check if updates are being received
console.log('Subscribed to location updates for assignment:', assignmentId);
// Watch console for: "Location update received: { latitude, longitude, ... }"
// Should match ArmoraCPO update frequency
```

#### Firebase Console Verification

1. Open Firebase Console: https://console.firebase.google.com/project/armora-protection
2. Navigate to **Realtime Database** → **Data**
3. Expand path: `tracking/{assignment-id}/location`
4. Watch for real-time updates (should flash with each update)
5. Verify fields:
   - `latitude` and `longitude` changing
   - `timestamp` incrementing
   - `accuracy` ≤ 15 meters (high accuracy GPS)
   - `status` matches current assignment state

#### Network Tab Verification

**ArmoraCPO (Sending Updates):**
1. Open DevTools → Network tab
2. Filter: `firebase`
3. Look for WebSocket connection: `wss://...firebaseio.com/.ws?...`
4. Watch for outgoing messages every 3-5 seconds
5. Inspect payload:
   ```json
   {
     "t": "d",
     "d": {
       "b": {
         "p": "/tracking/{assignment-id}/location",
         "d": {
           "latitude": 51.5074,
           "longitude": -0.1278,
           ...
         }
       }
     }
   }
   ```

**Armora Principal (Receiving Updates):**
1. Open DevTools → Network tab
2. Filter: `firebase`
3. Look for WebSocket connection (same as above)
4. Watch for incoming messages every 3-5 seconds
5. Verify real-time data arrival

---

## Database Verification Queries

### Check Assignment Creation

```sql
-- Verify assignment was created correctly
SELECT
  pa.id,
  pa.principal_id,
  pa.officer_id,
  pa.assignment_status,
  pa.protection_level,
  pa.commencement_point->>'address' as pickup_address,
  pa.secure_destination->>'address' as dropoff_address,
  pa.service_fee,
  pa.estimated_duration_minutes,
  pa.requested_time,
  pa.scheduled_time,
  pa.created_at
FROM protection_assignments pa
WHERE pa.id = '<assignment-id>';
```

### Check Broadcast Status

```sql
-- Verify broadcast was sent and accepted
SELECT
  ab.id,
  ab.assignment_id,
  ab.status,
  ab.protection_tier,
  ab.service_fee,
  ab.broadcast_radius_km,
  ab.created_at,
  ab.expires_at,
  ab.accepted_at,
  ab.accepted_by_cpo_id,
  po.user_id as cpo_user_id,
  p.full_name as cpo_name
FROM assignment_broadcasts ab
LEFT JOIN protection_officers po ON po.id = ab.accepted_by_cpo_id
LEFT JOIN profiles p ON p.id = po.user_id
WHERE ab.assignment_id = '<assignment-id>';
```

### Check CPO Assignment

```sql
-- Verify CPO was properly assigned
SELECT
  po.id as officer_id,
  po.user_id,
  p.full_name,
  p.phone_number,
  po.sia_license_number,
  po.protection_level,
  po.availability_status,
  po.vehicle_make_model,
  po.vehicle_registration,
  po.average_rating,
  po.completed_assignments,
  ST_AsText(po.current_location) as current_location
FROM protection_officers po
JOIN profiles p ON p.id = po.user_id
WHERE po.id = '<officer-id>';
```

### Check GPS Tracking Activity (Supabase Backup)

```sql
-- Check location history records
SELECT
  id,
  officer_id,
  assignment_id,
  ST_AsText(location) as location,
  ST_X(location) as longitude,
  ST_Y(location) as latitude,
  heading,
  speed,
  accuracy,
  status,
  created_at
FROM officer_location_history
WHERE assignment_id = '<assignment-id>'
ORDER BY created_at DESC
LIMIT 20;

-- Check update frequency
SELECT
  assignment_id,
  COUNT(*) as total_updates,
  MIN(created_at) as first_update,
  MAX(created_at) as last_update,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / COUNT(*) as avg_seconds_between_updates
FROM officer_location_history
WHERE assignment_id = '<assignment-id>'
GROUP BY assignment_id;
```

### Check Payment Processing

```sql
-- Verify payment transaction
SELECT
  pt.id,
  pt.assignment_id,
  pt.principal_id,
  pt.service_fee,
  pt.platform_fee,
  pt.total_amount,
  pt.payment_status,
  pt.payment_method,
  pt.stripe_payment_intent_id,
  pt.stripe_charge_id,
  pt.processed_at,
  pt.created_at
FROM payment_transactions pt
WHERE pt.assignment_id = '<assignment-id>';

-- Check for refunds
SELECT
  id,
  assignment_id,
  payment_status,
  refund_amount,
  refund_reason,
  refunded_at
FROM payment_transactions
WHERE assignment_id = '<assignment-id>'
  AND refund_amount > 0;
```

### Check Assignment Completion

```sql
-- Verify assignment completion details
SELECT
  pa.id,
  pa.assignment_status,
  pa.assignment_start_time,
  pa.assignment_end_time,
  pa.estimated_duration_minutes,
  pa.actual_duration_minutes,
  pa.distance_miles,
  pa.service_fee,
  EXTRACT(EPOCH FROM (pa.assignment_end_time - pa.assignment_start_time)) / 60 as actual_minutes,
  CASE
    WHEN pa.actual_duration_minutes > pa.estimated_duration_minutes
    THEN 'Over Estimated'
    ELSE 'Within Estimate'
  END as duration_status
FROM protection_assignments pa
WHERE pa.id = '<assignment-id>';
```

### Check Reviews and Ratings

```sql
-- Verify review submission
SELECT
  pr.id,
  pr.assignment_id,
  pr.officer_id,
  pr.principal_id,
  pr.overall_rating,
  pr.security_rating,
  pr.professionalism_rating,
  pr.communication_rating,
  pr.vehicle_rating,
  pr.review_text,
  pr.would_recommend,
  pr.review_status,
  pr.created_at
FROM protection_reviews pr
WHERE pr.assignment_id = '<assignment-id>';

-- Check officer's updated rating
SELECT
  po.id,
  po.average_rating,
  po.total_assignments,
  po.completed_assignments,
  COUNT(pr.id) as review_count,
  AVG(pr.overall_rating) as calculated_avg_rating
FROM protection_officers po
LEFT JOIN protection_reviews pr ON pr.officer_id = po.id AND pr.review_status = 'published'
WHERE po.id = '<officer-id>'
GROUP BY po.id, po.average_rating, po.total_assignments, po.completed_assignments;
```

### Check Emergency Activations

```sql
-- Verify emergency activation (if panic button used)
SELECT
  ea.id,
  ea.user_id,
  ea.assignment_id,
  ea.officer_id,
  ea.activation_type,
  ST_AsText(ea.emergency_location) as location,
  ea.location_accuracy,
  ea.response_status,
  ea.emergency_services_contacted,
  ea.police_reference_number,
  ea.activated_at,
  ea.first_response_at,
  ea.resolved_at,
  EXTRACT(EPOCH FROM (ea.first_response_at - ea.activated_at)) as response_time_seconds
FROM emergency_activations ea
WHERE ea.assignment_id = '<assignment-id>';
```

### Check Real-time Subscriptions (Active Assignments)

```sql
-- Find all active assignments with live tracking
SELECT
  pa.id as assignment_id,
  pa.assignment_status,
  p_principal.full_name as principal_name,
  p_cpo.full_name as cpo_name,
  pa.commencement_point->>'address' as pickup,
  pa.secure_destination->>'address' as destination,
  pa.assignment_start_time,
  EXTRACT(EPOCH FROM (NOW() - pa.assignment_start_time)) / 60 as elapsed_minutes,
  po.availability_status as cpo_status
FROM protection_assignments pa
JOIN profiles p_principal ON p_principal.id = pa.principal_id
JOIN protection_officers po ON po.id = pa.officer_id
JOIN profiles p_cpo ON p_cpo.id = po.user_id
WHERE pa.assignment_status IN ('officer_en_route', 'protection_commenced', 'in_progress')
  AND pa.assignment_start_time IS NOT NULL
ORDER BY pa.assignment_start_time DESC;
```

---

## Common Issues & Troubleshooting

### Issue 1: GPS Permissions Not Granted

**Symptoms:**
- ArmoraCPO app shows "Location permission required"
- No GPS updates sent to Firebase
- Principal app shows "Waiting for location data..."
- Map shows no officer marker

**Causes:**
- User denied location permission
- Location services disabled on device
- App doesn't have background location permission (iOS/Android)

**Solutions:**

**iOS:**
1. Open Settings → Privacy → Location Services
2. Ensure Location Services is ON
3. Find ArmoraCPO app in list
4. Set to "Always" (for background tracking)
5. Restart ArmoraCPO app

**Android:**
1. Open Settings → Apps → ArmoraCPO
2. Tap Permissions → Location
3. Set to "Allow all the time"
4. Enable "Use precise location"
5. Restart ArmoraCPO app

**Web App (Desktop/Mobile Browser):**
1. Check browser address bar for location icon
2. Click icon and set to "Always allow"
3. If blocked, go to browser settings:
   - Chrome: Settings → Privacy → Site Settings → Location
   - Firefox: Settings → Privacy → Permissions → Location
   - Safari: Preferences → Websites → Location
4. Clear site data and reload app

**Verification:**
```javascript
// ArmoraCPO console check
navigator.permissions.query({ name: 'geolocation' }).then(result => {
  console.log('Location permission:', result.state); // Should be 'granted'
});

// Test GPS acquisition
navigator.geolocation.getCurrentPosition(
  position => console.log('GPS working:', position.coords),
  error => console.error('GPS error:', error)
);
```

---

### Issue 2: Real-time Subscriptions Not Working

**Symptoms:**
- ArmoraCPO sending updates (visible in console)
- Principal app not receiving updates
- Map shows stale/frozen officer location
- No console errors in Principal app

**Causes:**
- Firebase WebSocket connection dropped
- Supabase real-time connection disconnected
- Network interruption
- Service Worker caching stale data
- React component not re-rendering on state updates

**Solutions:**

**1. Check Firebase Connection (Both Apps):**
```javascript
// Principal App console
import { database } from './lib/firebase';
console.log('Firebase DB instance:', database);
console.log('Is connected:', database.app.automaticDataCollectionEnabled);

// Test connection
const testRef = ref(database, '.info/connected');
onValue(testRef, (snapshot) => {
  console.log('Firebase connected:', snapshot.val()); // Should be true
});
```

**2. Check Real-time Subscription (Principal App):**
```javascript
// Add to useRealtimeTracking hook
useEffect(() => {
  console.log('Subscribing to assignment:', assignmentId);

  const unsubscribe = RealtimeTrackingService.subscribeToLocation(
    assignmentId,
    (location) => {
      console.log('Location update received:', location); // Should see updates
      setState(prev => ({ ...prev, location }));
    }
  );

  return () => {
    console.log('Unsubscribing from assignment:', assignmentId);
    unsubscribe();
  };
}, [assignmentId]);
```

**3. Force Refresh Connection:**
- Close both apps completely
- Clear browser cache (Ctrl+Shift+Delete)
- Restart Firebase connection:
  ```javascript
  // ArmoraCPO & Principal
  import { database } from './lib/firebase';
  database.goOffline();
  setTimeout(() => database.goOnline(), 1000);
  ```

**4. Check Service Worker (Development Mode):**
```javascript
// Principal App - Check if Service Worker is disabled in dev
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Service Workers:', registrations.length);
    if (registrations.length > 0) {
      console.warn('Service Worker active in development - may cache real-time data');
      // Unregister all
      registrations.forEach(reg => reg.unregister());
    }
  });
}
```

**5. Verify Network Connectivity:**
```bash
# Check Firebase Realtime DB endpoint
curl -X GET "https://armora-protection-default-rtdb.firebaseio.com/.json"

# Should return: { "tracking": {...} } or empty object
```

---

### Issue 3: Notifications Not Received

**Symptoms:**
- CPO doesn't receive assignment notifications
- Principal doesn't receive "Officer Assigned" notification
- No FCM token generated
- Notification permission shows "default" or "denied"

**Causes:**
- Notification permission not granted
- FCM token not generated or stored
- Firebase Cloud Messaging not configured
- Push notification service worker not registered
- iOS Safari limitations (no web push support)

**Solutions:**

**1. Request Notification Permission (Both Apps):**
```javascript
// Check permission status
console.log('Notification permission:', Notification.permission);

// Request permission
import { notificationService } from './services/notificationService';
const result = await notificationService.requestPermission();
console.log('Permission result:', result);

// Expected: { success: true, token: "fcm-token-here..." }
```

**2. Verify FCM Configuration:**
```javascript
// Check Firebase config
import { messaging } from './lib/firebase';
console.log('FCM messaging instance:', messaging);

// Generate FCM token manually
import { getToken } from 'firebase/messaging';
const token = await getToken(messaging, {
  vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
});
console.log('FCM Token:', token);
```

**3. Check VAPID Key (Environment Variable):**
```bash
# Verify VAPID key is set
echo $REACT_APP_FIREBASE_VAPID_KEY

# If missing, get from Firebase Console:
# Project Settings → Cloud Messaging → Web Push Certificates → Generate Key Pair
```

**4. Store FCM Token in Database:**
```javascript
// Store token for user
import { supabase } from './lib/supabase';
await supabase
  .from('profiles')
  .update({ fcm_token: token })
  .eq('id', userId);

console.log('FCM token stored for user:', userId);
```

**5. Test Notification Manually:**
```javascript
// Send test notification (development)
import { notificationService } from './services/notificationService';
await notificationService.sendTestNotification();

// Should see notification appear
```

**6. Send Notification from Backend (Supabase Function):**
```javascript
// Example: Notify CPO of new assignment broadcast
import admin from 'firebase-admin';

const message = {
  notification: {
    title: 'New Assignment Available',
    body: 'Executive tier assignment near you - £142.50 earnings'
  },
  data: {
    type: 'new_assignment',
    assignment_id: assignmentId,
    protection_tier: 'executive',
    service_fee: '142.50'
  },
  token: cpoFcmToken
};

await admin.messaging().send(message);
```

**iOS Safari Workaround:**
- iOS Safari doesn't support Web Push notifications
- Use PWA installed via "Add to Home Screen"
- Or deploy as native iOS app (TWA or React Native)

---

### Issue 4: Map Not Displaying or Loading

**Symptoms:**
- Blank map container (white or gray box)
- Console error: "Leaflet is not defined"
- Console error: "Google Maps API error"
- Map shows incorrect center/zoom
- Markers not appearing

**Causes:**
- Google Maps API key invalid or not set
- Leaflet CSS not loaded
- React-Leaflet version mismatch
- Map container has no height (CSS issue)
- Coordinates are undefined or invalid

**Solutions:**

**1. Verify Google Maps API Key:**
```bash
# Check environment variable
echo $REACT_APP_GOOGLE_MAPS_API_KEY

# Test API key
curl "https://maps.googleapis.com/maps/api/geocode/json?address=London&key=$REACT_APP_GOOGLE_MAPS_API_KEY"

# Should return valid JSON with results
```

**2. Import Leaflet CSS (if using Leaflet):**
```javascript
// In LiveTrackingMap.tsx or main App.tsx
import 'leaflet/dist/leaflet.css';
```

**3. Fix Map Container Height:**
```css
/* LiveTrackingMap.module.css */
.mapContainer {
  width: 100%;
  height: 400px; /* Must have explicit height */
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}
```

**4. Check Coordinate Validity:**
```javascript
// Verify coordinates before rendering map
console.log('Officer location:', officerLocation);
console.log('Pickup coordinates:', pickupLocation);
console.log('Destination coordinates:', dropoffLocation);

// Validate coordinates
const isValidCoord = (lat, lng) => {
  return typeof lat === 'number' && typeof lng === 'number' &&
         lat >= -90 && lat <= 90 &&
         lng >= -180 && lng <= 180;
};

if (!isValidCoord(pickupLocation.lat, pickupLocation.lng)) {
  console.error('Invalid pickup coordinates');
}
```

**5. Force Map Re-render:**
```javascript
// Add key prop to MapContainer to force re-render on location change
<MapContainer
  key={`${officerLocation?.latitude}-${officerLocation?.longitude}`}
  center={mapCenter}
  zoom={13}
>
  {/* ... */}
</MapContainer>
```

---

### Issue 5: Payment Processing Failures

**Symptoms:**
- Payment fails at checkout
- Stripe error: "Invalid API key"
- Error: "Payment intent creation failed"
- Payment succeeds but assignment not created

**Causes:**
- Stripe publishable key not set or invalid
- Stripe test mode vs production mode mismatch
- Payment intent amount mismatch
- Card details invalid (test mode)
- Network error during payment processing

**Solutions:**

**1. Verify Stripe Configuration:**
```bash
# Check Stripe key
echo $REACT_APP_STRIPE_PUBLISHABLE_KEY

# Should start with:
# pk_test_... (test mode) or pk_live_... (production)
```

**2. Use Stripe Test Cards:**
```
Success: 4242 4242 4242 4242 (Any future expiry, any CVC)
Decline: 4000 0000 0000 0002
Authentication Required: 4000 0025 0000 3155
Insufficient Funds: 4000 0000 0000 9995
```

**3. Check Payment Intent Creation:**
```javascript
// Log payment intent creation
const createPaymentIntent = async (amount, currency) => {
  console.log('Creating payment intent:', { amount, currency });

  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency })
  });

  const data = await response.json();
  console.log('Payment intent response:', data);
  return data;
};
```

**4. Handle Payment Errors:**
```javascript
// Stripe payment error handling
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const handlePayment = async () => {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    console.error('Stripe not loaded');
    return;
  }

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement),
      billing_details: { name: principalName }
    }
  });

  if (error) {
    console.error('Payment error:', error.message);
    // Display error to user
  } else {
    console.log('Payment succeeded:', paymentIntent.id);
    // Create assignment
  }
};
```

---

### Issue 6: Assignment Not Appearing in CPO App

**Symptoms:**
- Assignment broadcast created in database
- CPO app shows "No assignments available"
- CPO is online and available
- CPO is within broadcast radius

**Causes:**
- CPO's `protection_level` doesn't match assignment tier
- CPO's `availability_status` is not `available`
- CPO's location not updated recently
- Broadcast expired before CPO saw it
- Real-time subscription not active in CPO app

**Solutions:**

**1. Verify CPO Qualifications:**
```sql
-- Check if CPO can accept this tier
SELECT
  po.id,
  po.protection_level,
  po.availability_status,
  po.active,
  ST_AsText(po.current_location) as location
FROM protection_officers po
WHERE po.user_id = '<cpo-user-id>';

-- Check assignment broadcast requirements
SELECT
  id,
  assignment_id,
  protection_tier,
  status,
  expires_at
FROM assignment_broadcasts
WHERE assignment_id = '<assignment-id>';

-- Verify tier matching
-- protection_tier must be in CPO's protection_level array
-- Example: CPO has ['essential', 'executive'] → can accept 'essential' or 'executive'
```

**2. Update CPO Availability:**
```javascript
// ArmoraCPO app - Set availability
import { supabase } from './lib/supabase';
await supabase
  .from('protection_officers')
  .update({
    availability_status: 'available',
    last_location_update: new Date().toISOString()
  })
  .eq('user_id', cpoUserId);

console.log('CPO availability updated to: available');
```

**3. Check Real-time Subscription:**
```javascript
// ArmoraCPO app - Subscribe to broadcasts
useEffect(() => {
  const channel = supabase
    .channel('assignment-broadcasts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'assignment_broadcasts',
        filter: `status=eq.pending`
      },
      (payload) => {
        console.log('New broadcast received:', payload.new);
        // Check if CPO qualifies for this broadcast
        const qualifies = checkQualifications(payload.new);
        if (qualifies) {
          showNotification(payload.new);
        }
      }
    )
    .subscribe();

  console.log('Subscribed to assignment broadcasts');

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

**4. Manual Broadcast Check:**
```sql
-- Find broadcasts that CPO should see
SELECT
  ab.id,
  ab.assignment_id,
  ab.protection_tier,
  ab.service_fee,
  ab.commencement_address,
  ab.status,
  ab.expires_at,
  ST_Distance(
    ST_MakePoint(ab.principal_longitude, ab.principal_latitude)::geography,
    po.current_location::geography
  ) / 1000 as distance_km
FROM assignment_broadcasts ab
CROSS JOIN protection_officers po
WHERE po.user_id = '<cpo-user-id>'
  AND ab.status = 'pending'
  AND ab.expires_at > NOW()
  AND ab.protection_tier = ANY(po.protection_level)
  AND ST_DWithin(
    ST_MakePoint(ab.principal_longitude, ab.principal_latitude)::geography,
    po.current_location::geography,
    ab.broadcast_radius_km * 1000
  );
```

---

### Issue 7: GPS Tracking Stops Mid-Journey

**Symptoms:**
- GPS updates working initially
- After 5-10 minutes, updates stop
- Officer marker freezes on map
- ArmoraCPO console shows no new updates

**Causes:**
- Browser background tab throttling
- iOS background location restrictions
- Android doze mode
- Firebase connection timeout
- Battery saver mode enabled

**Solutions:**

**1. Prevent Background Tab Throttling (Web):**
```javascript
// Use Page Visibility API to detect background/foreground
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('App in background - GPS may be throttled');
  } else {
    console.log('App in foreground - resuming full GPS updates');
    // Restart location tracking
    restartLocationTracking();
  }
});

// Use Wake Lock API to keep screen on (prevents sleep)
let wakeLock = null;
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake lock acquired - screen will stay on');
  } catch (err) {
    console.error('Wake lock error:', err);
  }
};
```

**2. iOS Background Location (PWA/Native):**
```javascript
// Enable background geolocation (requires native app)
const watchId = navigator.geolocation.watchPosition(
  position => sendLocationUpdate(position),
  error => console.error('GPS error:', error),
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
    // iOS specific options (if using Capacitor/Cordova)
    backgroundLocationUpdates: true,
    pausesLocationUpdatesAutomatically: false
  }
);
```

**3. Android Background Location (Native App):**
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

<!-- Start foreground service for background tracking -->
```

**4. Heartbeat Mechanism (Keep-Alive):**
```javascript
// Send heartbeat every 30 seconds even if location unchanged
let lastHeartbeat = Date.now();
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

setInterval(() => {
  const now = Date.now();
  if (now - lastHeartbeat > HEARTBEAT_INTERVAL) {
    console.log('Sending heartbeat to keep connection alive');
    RealtimeTrackingService.sendHeartbeat(assignmentId);
    lastHeartbeat = now;
  }
}, HEARTBEAT_INTERVAL);
```

**5. Reconnect on Disconnect:**
```javascript
// Monitor Firebase connection and reconnect if needed
import { ref, onValue } from 'firebase/database';
import { database } from './lib/firebase';

const connectedRef = ref(database, '.info/connected');
onValue(connectedRef, (snapshot) => {
  if (snapshot.val() === false) {
    console.error('Firebase disconnected - attempting reconnection');
    // Reconnect
    database.goOffline();
    setTimeout(() => database.goOnline(), 2000);
  } else {
    console.log('Firebase connected');
  }
});
```

---

## Additional Resources

### Documentation
- **CLAUDE.md**: Project architecture and development guidelines
- **DATABASE_SCHEMA.md**: Complete database structure and queries
- **IMPLEMENTATION_SUMMARY.md**: Recent feature implementations (Sentry, GPS)
- **SENTRY.md**: Error tracking setup and configuration

### API Documentation
- **Supabase API**: https://supabase.com/docs/reference/javascript
- **Firebase Realtime Database**: https://firebase.google.com/docs/database/web/start
- **Stripe API**: https://stripe.com/docs/api
- **Google Maps API**: https://developers.google.com/maps/documentation

### Testing Tools
- **Playwright E2E Tests**: `/tests/e2e/` directory
- **Jest Unit Tests**: `npm test`
- **Supabase Studio**: Real-time database monitoring
- **Firebase Console**: GPS tracking visualization
- **Stripe Dashboard**: Payment transaction logs

### Support Contacts
- **Technical Issues**: Create GitHub issue or contact development team
- **Database Issues**: Check Supabase project dashboard
- **GPS Tracking**: Review Firebase Realtime Database logs
- **Payment Issues**: Check Stripe dashboard for transaction details

---

**Document Version:** 1.0
**Last Updated:** October 8, 2025
**Compatibility:** Armora Principal App v1.0 + ArmoraCPO v1.0
**Testing Framework:** Playwright + Manual QA

**Note:** This guide assumes both apps are deployed and configured correctly. For initial setup and deployment, refer to CLAUDE.md and individual app README files.
