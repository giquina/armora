# Armora Marketplace Integration Testing Guide

**Version:** 1.0.0
**Last Updated:** October 2, 2025
**Status:** Ready for Testing (Post-Migration)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test 1: Payment Flow with Marketplace Fees](#test-1-payment-flow-with-marketplace-fees)
3. [Test 2: CPO Assignment Acceptance](#test-2-cpo-assignment-acceptance)
4. [Test 3: CPO Payout Processing](#test-3-cpo-payout-processing)
5. [Test 4: Real-time Assignment Feed](#test-4-real-time-assignment-feed)
6. [Database Verification Queries](#database-verification-queries)
7. [Edge Function Testing](#edge-function-testing)
8. [Known Issues and Troubleshooting](#known-issues-and-troubleshooting)

---

## Prerequisites

### Required Setup

Before testing, ensure the following are completed:

- ✅ **Database Migration Executed**: `20251002_marketplace_transformation_phase1.sql` has been run
- ✅ **Edge Functions Deployed**: All 5 marketplace Edge Functions deployed to Supabase
- ✅ **Environment Variables Set**: All required Stripe and Supabase keys configured
- ✅ **Stripe Connect Configured**: At least one test CPO has a Stripe Connect account
- ✅ **Test Accounts Created**:
  - Principal account (client who books protection)
  - CPO account (protection officer)
  - Admin account (for manual payout processing)

### Test Environment URLs

**Principal App:** `https://armora.vercel.app`
**CPO App:** `https://armora-cpo.vercel.app` (if deployed)
**Supabase Dashboard:** `https://app.supabase.com`
**Stripe Dashboard:** `https://dashboard.stripe.com/test`

### Test Data Requirements

You'll need:
- Valid test payment card (use Stripe test cards: `4242 4242 4242 4242`)
- Test CPO with SIA license number
- Test Principal with saved addresses

---

## Test 1: Payment Flow with Marketplace Fees

### Objective
Verify that when a Principal creates a booking, the correct marketplace fee structure is applied:
- Client pays **120%** of base rate (20% markup)
- Platform takes **35%** of base rate
- CPO receives **85%** of base rate
- Net platform commission: **15%** of base rate

### Step-by-Step Instructions

#### 1.1 Log in as Principal
1. Navigate to `https://armora.vercel.app`
2. Log in with Principal test account
3. Complete onboarding questionnaire if not already done

#### 1.2 Create Protection Booking
1. Tap **"Request Protection"** or navigate to Services
2. Select protection tier (e.g., **Executive** - £95/hr base rate)
3. Enter pickup location: `"10 Downing Street, London"`
4. Enter dropoff location: `"Heathrow Airport, London"`
5. Select date/time for protection detail
6. Tap **"Continue"** or **"Next"**

#### 1.3 Verify Transparent Pricing Display
On the booking summary screen, verify the following information is displayed:

**Expected Display:**
```
┌─────────────────────────────────────┐
│ Transparent Pricing                 │
│ Fair marketplace for Principals     │
│ and CPOs                            │
├─────────────────────────────────────┤
│ Base Rate                           │
│ £95/hr × 2.5 hrs         £237.50    │
│                                     │
│ Service Fee                         │
│ 20% marketplace fee       £47.50    │
├─────────────────────────────────────┤
│ Total (You Pay)          £285.00    │
├─────────────────────────────────────┤
│ 👮 CPO Earnings                     │
│ Your assigned CPO receives          │
│ £201.88 (85% of base rate).         │
│ Armora takes a 35% platform fee     │
│ to maintain security infrastructure,│
│ insurance, and 24/7 support.        │
└─────────────────────────────────────┘
```

**Verification Checklist:**
- [ ] Base rate calculation is correct (hourly rate × duration)
- [ ] Service fee is 20% of base rate
- [ ] Total equals base + service fee (120% of base)
- [ ] CPO earnings shown as 85% of base rate
- [ ] Platform fee explanation is visible

#### 1.4 Complete Payment
1. Tap **"Proceed to Payment"**
2. Enter Stripe test card: `4242 4242 4242 4242`
3. Enter any future expiry date (e.g., `12/25`)
4. Enter any 3-digit CVC (e.g., `123`)
5. Tap **"Pay £285.00"**
6. Wait for payment confirmation

**Expected Result:**
- Payment successful message displayed
- Redirected to confirmation screen
- Assignment status shows "Pending CPO Assignment"

#### 1.5 Verify Database Records

Open Supabase SQL Editor and run:

```sql
-- Get the most recent assignment
SELECT
  id,
  principal_id,
  protection_level,
  status,
  client_total,
  platform_fee,
  cpo_earnings,
  commission_rate,
  payout_status,
  created_at
FROM protection_assignments
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Values (for £95/hr × 2.5hrs = £237.50 base):**
- `client_total`: **285.00** (120% of £237.50)
- `platform_fee`: **83.13** (35% of £237.50)
- `cpo_earnings`: **201.88** (85% of £237.50)
- `commission_rate`: **0.15** (15% net commission)
- `payout_status`: **'pending'**
- `status`: **'pending'** or **'confirmed'**

**Verification Checklist:**
- [ ] `client_total` = base × 1.20
- [ ] `platform_fee` = base × 0.35
- [ ] `cpo_earnings` = base × 0.85
- [ ] `platform_fee + cpo_earnings` = `client_total`
- [ ] `payout_status` is 'pending'

#### 1.6 Verify Payment Intent Metadata

Check Stripe Dashboard:

1. Go to `https://dashboard.stripe.com/test/payments`
2. Find the most recent payment (£285.00)
3. Click to view details
4. Scroll to **Metadata** section

**Expected Metadata:**
```json
{
  "assignment_id": "uuid-here",
  "base_cost": "237.50",
  "client_total": "285.00",
  "platform_fee": "83.13",
  "cpo_earnings": "201.88",
  "protection_level": "executive"
}
```

**Verification Checklist:**
- [ ] Metadata includes all fee breakdown fields
- [ ] Values match database records
- [ ] `assignment_id` is valid UUID

---

## Test 2: CPO Assignment Acceptance

### Objective
Verify that CPOs can toggle availability, see nearby assignments, accept them, and view correct earnings calculations.

### Step-by-Step Instructions

#### 2.1 Set Up CPO Profile
1. Log in to Supabase Dashboard → SQL Editor
2. Ensure test CPO has marketplace fields populated:

```sql
UPDATE protection_officers
SET
  contractor_status = 'active',
  stripe_connect_status = 'active',
  stripe_connect_id = 'acct_test_12345',
  bank_details_verified = true,
  daily_rate = 300.00,
  hourly_rate = 37.50,
  is_available = false,
  availability_status = 'off_duty'
WHERE email = 'testcpo@armora.com';
```

#### 2.2 Log in as CPO
1. Navigate to CPO app (or CPO portal in main app)
2. Log in with CPO test account
3. Verify dashboard loads correctly

#### 2.3 Toggle Availability to On Duty
1. Locate **Availability Toggle** (usually in header or dashboard)
2. Current status should show: **"Off Duty"** with gray indicator
3. Tap the toggle switch
4. Status should change to: **"Available"** with green pulsing indicator

**Verify Database Update:**
```sql
SELECT
  id,
  full_name,
  availability_status,
  is_available,
  updated_at
FROM protection_officers
WHERE email = 'testcpo@armora.com';
```

**Expected Values:**
- `availability_status`: **'available'** (or **'on_duty'**)
- `is_available`: **true**
- `updated_at`: timestamp should be recent

**Verification Checklist:**
- [ ] Toggle switch responds immediately
- [ ] Visual indicator changes to green with pulse animation
- [ ] Database updated in real-time (check `updated_at`)
- [ ] No errors in browser console

#### 2.4 View Available Assignments
1. Navigate to **"Available Assignments"** screen
2. Should see the assignment created in Test 1

**Expected Display:**
```
┌─────────────────────────────────────┐
│ Available Assignments               │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ EXECUTIVE        £201.88        │ │
│ ├─────────────────────────────────┤ │
│ │ Principal: John Smith           │ │
│ │ Pickup: 10 Downing Street       │ │
│ │ Dropoff: Heathrow Airport       │ │
│ │ Time: Oct 15, 2025 2:00 PM      │ │
│ │ Duration: 150 min               │ │
│ ├─────────────────────────────────┤ │
│ │   [Accept Assignment]           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Verification Checklist:**
- [ ] Assignment card displays correct tier (Executive)
- [ ] Earnings shown match `cpo_earnings` from database (£201.88)
- [ ] Pickup and dropoff locations are correct
- [ ] Date/time displays correctly
- [ ] Duration matches booking (150 minutes = 2.5 hours)
- [ ] "Accept Assignment" button is enabled

#### 2.5 Accept Assignment
1. Tap **"Accept Assignment"** button
2. Button should show loading state
3. Assignment should disappear from list
4. Success message or redirect to "My Assignments"

**Verify Database Update:**
```sql
SELECT
  id,
  officer_id,
  status,
  accepted_at,
  payout_status,
  cpo_earnings
FROM protection_assignments
WHERE id = 'assignment-uuid-from-test-1';
```

**Expected Values:**
- `officer_id`: CPO's UUID (not null)
- `status`: **'confirmed'** or **'accepted'**
- `accepted_at`: Recent timestamp
- `payout_status`: Still **'pending'**
- `cpo_earnings`: **201.88** (unchanged)

**Verification Checklist:**
- [ ] `officer_id` is populated with CPO's ID
- [ ] `status` changed from 'pending' to 'confirmed'/'accepted'
- [ ] `accepted_at` timestamp is set
- [ ] `cpo_earnings` remains correct (85% of base)
- [ ] Assignment removed from Available Assignments feed

#### 2.6 Verify Principal Notification
As Principal:
1. Check assignment status in Principal app
2. Should now show CPO assigned
3. CPO details should be visible (name, SIA license, rating)

**Expected Display:**
- Status: **"CPO Assigned"** or **"Confirmed"**
- CPO Name: **"Test CPO Name"**
- SIA License: **"SIA-123456"**
- Rating: **4.8** stars (or test data rating)

---

## Test 3: CPO Payout Processing

### Objective
Verify that after assignment completion, the payout can be processed via Stripe Connect and the database records are updated correctly.

### Step-by-Step Instructions

#### 3.1 Mark Assignment as Completed
As CPO (or simulate completion):

```sql
UPDATE protection_assignments
SET
  status = 'completed',
  completed_at = NOW()
WHERE id = 'assignment-uuid-from-test-1';
```

**Verify Update:**
```sql
SELECT
  id,
  status,
  completed_at,
  payout_status
FROM protection_assignments
WHERE id = 'assignment-uuid-from-test-1';
```

**Expected Values:**
- `status`: **'completed'**
- `completed_at`: Recent timestamp
- `payout_status`: Still **'pending'**

#### 3.2 Trigger Payout Processing
**Option A: Via Edge Function (Admin API Call)**

Using curl or Postman:

```bash
# Get admin auth token from Supabase
ADMIN_TOKEN="your-admin-jwt-token"
SUPABASE_URL="https://jmzvrqwjmlnvxojculee.supabase.co"
ASSIGNMENT_ID="assignment-uuid-from-test-1"
CPO_ID="cpo-uuid"

curl -X POST "${SUPABASE_URL}/functions/v1/process-cpo-payout" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"assignmentId\": \"${ASSIGNMENT_ID}\",
    \"cpoId\": \"${CPO_ID}\",
    \"amount\": 201.88
  }"
```

**Expected Response:**
```json
{
  "success": true,
  "payoutId": "payout-uuid",
  "transferId": "tr_test_12345",
  "amount": 201.88,
  "cpoId": "cpo-uuid",
  "assignmentId": "assignment-uuid",
  "status": "completed"
}
```

**Option B: Manual Database Insert (Testing Only)**

```sql
INSERT INTO cpo_payouts (
  cpo_id,
  assignment_id,
  amount,
  platform_fee,
  client_total,
  status,
  stripe_transfer_id,
  processed_at
)
VALUES (
  'cpo-uuid',
  'assignment-uuid-from-test-1',
  201.88,
  83.13,
  285.00,
  'completed',
  'tr_test_manual',
  NOW()
);
```

#### 3.3 Verify Payout Record Created

```sql
SELECT
  id,
  cpo_id,
  assignment_id,
  amount,
  platform_fee,
  client_total,
  status,
  stripe_transfer_id,
  stripe_payout_id,
  created_at,
  processed_at,
  expected_payout_date,
  actual_payout_date,
  retry_count,
  failure_reason
FROM cpo_payouts
WHERE assignment_id = 'assignment-uuid-from-test-1';
```

**Expected Values:**
- `amount`: **201.88**
- `platform_fee`: **83.13**
- `client_total`: **285.00**
- `status`: **'completed'**
- `stripe_transfer_id`: Starts with `tr_` (Stripe transfer ID)
- `processed_at`: Recent timestamp
- `retry_count`: **0**
- `failure_reason`: **NULL**

**Verification Checklist:**
- [ ] Payout record exists in `cpo_payouts` table
- [ ] `amount` matches `cpo_earnings` from assignment
- [ ] `platform_fee` is correct (35% of base)
- [ ] `client_total` matches payment amount
- [ ] `status` is 'completed'
- [ ] `stripe_transfer_id` is populated
- [ ] `processed_at` timestamp is set

#### 3.4 Verify Stripe Connect Transfer
1. Go to Stripe Dashboard → **Connect → Transfers**
2. Find transfer matching `stripe_transfer_id`
3. Verify details:

**Expected Transfer Details:**
- Amount: **£201.88**
- Destination: CPO's Stripe Connect account (`acct_test_12345`)
- Description: `"Payout for assignment {assignment-uuid}"`
- Status: **Paid**
- Metadata:
  - `assignment_id`: assignment UUID
  - `cpo_id`: CPO UUID
  - `cpo_name`: CPO's name

**Verification Checklist:**
- [ ] Transfer exists in Stripe
- [ ] Amount is correct (£201.88)
- [ ] Destination is CPO's Connect account
- [ ] Metadata includes assignment and CPO details
- [ ] Transfer status is 'paid' or 'in_transit'

#### 3.5 Verify Assignment Payout Status Updated

```sql
SELECT
  id,
  status,
  payout_status,
  cpo_earnings,
  completed_at
FROM protection_assignments
WHERE id = 'assignment-uuid-from-test-1';
```

**Expected Values:**
- `status`: **'completed'**
- `payout_status`: **'completed'**
- `cpo_earnings`: **201.88**

**Verification Checklist:**
- [ ] `payout_status` changed from 'pending' to 'completed'
- [ ] All other fields remain unchanged

#### 3.6 Verify CPO Dashboard Shows Earnings
As CPO:
1. Navigate to **"Earnings"** or **"Dashboard"**
2. Should see earnings summary updated

**Expected Display:**
```
┌─────────────────────────────────────┐
│ Earnings Dashboard                  │
├─────────────────────────────────────┤
│ This Month                          │
│ £201.88                             │
├─────────────────────────────────────┤
│ Pending Payouts: 0                  │
│ Completed Assignments: 1            │
├─────────────────────────────────────┤
│ Recent Payouts                      │
│ ┌─────────────────────────────────┐ │
│ │ Oct 2, 2025        £201.88      │ │
│ │ Assignment #123                 │ │
│ │ Status: Completed ✅            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Verification Checklist:**
- [ ] Total earnings includes completed payout
- [ ] Pending payouts count is accurate
- [ ] Recent payouts list shows latest payout
- [ ] Payout status badge shows "Completed"

---

## Test 4: Real-time Assignment Feed

### Objective
Verify that CPOs receive real-time updates when new assignments are created and when assignments are accepted by other CPOs.

### Step-by-Step Instructions

#### 4.1 Set Up Two Browser Windows
1. **Window 1**: CPO app (logged in as CPO)
2. **Window 2**: Principal app (logged in as Principal)

#### 4.2 CPO Opens Available Assignments
In Window 1 (CPO):
1. Navigate to **"Available Assignments"**
2. Keep this window visible

#### 4.3 Principal Creates New Assignment
In Window 2 (Principal):
1. Create a new protection booking (follow Test 1 steps 1.2-1.4)
2. Complete payment
3. Do NOT close the confirmation screen

#### 4.4 Verify Real-time Update in CPO App
In Window 1 (CPO):
- **Expected Behavior**: New assignment should appear in the feed **within 2-3 seconds**
- No manual refresh required

**Verification Checklist:**
- [ ] New assignment appears automatically
- [ ] No manual refresh needed
- [ ] Assignment details are correct
- [ ] Earnings calculation is correct
- [ ] No console errors

#### 4.5 Test Assignment Disappearance
**Set Up:**
1. Open CPO app in **two different browsers** (e.g., Chrome and Firefox)
2. Log in as different CPOs in each browser
3. Both should see the same available assignment

**Test:**
1. In Browser 1, click **"Accept Assignment"**
2. Watch Browser 2

**Expected Behavior:**
- Browser 2 should see the assignment **disappear immediately** (within 2-3 seconds)
- No error messages

**Verification Checklist:**
- [ ] Assignment disappears from other CPO's feed
- [ ] Happens automatically (no refresh)
- [ ] No duplicate accepts possible
- [ ] Supabase subscription working correctly

#### 4.6 Verify Supabase Subscription
Check browser console for Supabase subscription logs:

**Expected Console Logs:**
```
[Supabase] Subscription established: available-assignments
[Supabase] Realtime event received: INSERT
[Supabase] Assignment list updated
```

**Verification Checklist:**
- [ ] Subscription channel name is 'available-assignments'
- [ ] Event type is 'postgres_changes'
- [ ] Filter is `status=eq.pending`
- [ ] No subscription errors

#### 4.7 Test Subscription Reconnection
1. In CPO app, open DevTools → Network tab
2. Find WebSocket connection to Supabase Realtime
3. Right-click → Close connection (simulates network issue)
4. Wait 5-10 seconds

**Expected Behavior:**
- Subscription automatically reconnects
- No data loss
- Feed continues to update

**Verification Checklist:**
- [ ] Reconnection happens automatically
- [ ] No errors displayed to user
- [ ] Real-time updates resume

---

## Database Verification Queries

### Quick Health Checks

#### Check Marketplace Schema Completeness
```sql
-- Verify new columns exist in protection_officers
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'protection_officers'
  AND column_name IN (
    'stripe_connect_id',
    'contractor_status',
    'daily_rate',
    'hourly_rate',
    'is_available'
  )
ORDER BY column_name;

-- Expected: 5 rows returned
```

#### Check Fee Calculation Accuracy
```sql
-- Verify fee splits for all assignments
SELECT
  id,
  protection_level,
  client_total,
  platform_fee,
  cpo_earnings,
  -- Verify client_total = platform_fee + cpo_earnings
  (platform_fee + cpo_earnings) AS total_sum,
  client_total - (platform_fee + cpo_earnings) AS difference,
  -- Verify percentages
  ROUND((platform_fee / (client_total / 1.20)) * 100, 2) AS platform_fee_pct,
  ROUND((cpo_earnings / (client_total / 1.20)) * 100, 2) AS cpo_pct
FROM protection_assignments
WHERE client_total IS NOT NULL
ORDER BY created_at DESC;

-- Expected:
-- difference should be 0.00 or very close (rounding tolerance)
-- platform_fee_pct should be ~35%
-- cpo_pct should be ~85%
```

#### Check CPO Payout Status
```sql
-- View all payouts with assignment details
SELECT
  cp.id AS payout_id,
  cp.status AS payout_status,
  cp.amount,
  cp.stripe_transfer_id,
  cp.created_at,
  cp.processed_at,
  pa.id AS assignment_id,
  pa.protection_level,
  pa.status AS assignment_status,
  po.full_name AS cpo_name
FROM cpo_payouts cp
JOIN protection_assignments pa ON cp.assignment_id = pa.id
JOIN protection_officers po ON cp.cpo_id = po.id
ORDER BY cp.created_at DESC
LIMIT 20;
```

#### Check CPO Availability Status
```sql
-- Find all available CPOs
SELECT
  id,
  full_name,
  availability_status,
  is_available,
  contractor_status,
  stripe_connect_status,
  daily_rate,
  hourly_rate
FROM protection_officers
WHERE
  is_available = true
  AND availability_status = 'available'
  AND contractor_status = 'active'
ORDER BY rating DESC;
```

#### Check Pending Payouts
```sql
-- List all assignments awaiting payout
SELECT
  pa.id,
  pa.protection_level,
  pa.status,
  pa.payout_status,
  pa.cpo_earnings,
  pa.completed_at,
  po.full_name AS cpo_name,
  po.stripe_connect_id
FROM protection_assignments pa
JOIN protection_officers po ON pa.officer_id = po.id
WHERE
  pa.status = 'completed'
  AND pa.payout_status = 'pending'
  AND pa.officer_id IS NOT NULL
ORDER BY pa.completed_at ASC;
```

#### Calculate Platform Revenue
```sql
-- Monthly revenue breakdown
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS total_payouts,
  SUM(client_total) AS total_revenue,
  SUM(platform_fee) AS platform_revenue,
  SUM(amount) AS cpo_payouts,
  SUM(platform_fee) - SUM(amount) AS net_platform_commission,
  ROUND(AVG(commission_rate) * 100, 2) AS avg_commission_pct
FROM cpo_payouts
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

#### Test Helper Functions
```sql
-- Test calculate_payment_split function
SELECT * FROM calculate_payment_split(100.00, 0.15);

-- Expected:
-- client_total | platform_fee | cpo_earnings
-- 100.00       | 15.00        | 85.00

-- Test with different amounts
SELECT * FROM calculate_payment_split(237.50, 0.15);

-- Expected:
-- client_total | platform_fee | cpo_earnings
-- 237.50       | 35.63        | 201.88
```

```sql
-- Test get_cpo_payout_summary function
SELECT * FROM get_cpo_payout_summary('cpo-uuid-here');

-- Expected columns:
-- total_earnings, total_paid, total_pending, total_assignments, average_earnings
```

---

## Edge Function Testing

### 1. Calculate Marketplace Fees

**Test Request:**
```bash
curl -X POST "https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/calculate-marketplace-fees" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "baseRate": 65,
    "hours": 2.0,
    "protectionLevel": "essential"
  }'
```

**Expected Response:**
```json
{
  "baseRate": 65,
  "hours": 2.0,
  "subtotal": 130,
  "clientPays": 156,
  "platformFee": 45.5,
  "cpoReceives": 110.5,
  "breakdown": {
    "clientMarkup": 0.20,
    "platformFeePercentage": 0.35,
    "cpoPercentage": 0.85
  }
}
```

**Verification:**
- `clientPays = subtotal * 1.20` ✓
- `platformFee = subtotal * 0.35` ✓
- `cpoReceives = subtotal * 0.85` ✓
- `platformFee + cpoReceives = clientPays` ✓

### 2. Get CPO Earnings

**Test Request:**
```bash
curl -X POST "https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/get-cpo-earnings" \
  -H "Authorization: Bearer YOUR_CPO_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cpoId": "cpo-uuid",
    "period": "month"
  }'
```

**Expected Response:**
```json
{
  "totalEarnings": 1250.00,
  "totalPayouts": 5,
  "pendingEarnings": 340.00,
  "pendingPayouts": 2,
  "payouts": [
    {
      "id": "payout-uuid",
      "assignmentId": "assignment-uuid",
      "amount": 255.00,
      "status": "completed",
      "createdAt": "2025-10-01T10:00:00Z",
      "processedAt": "2025-10-02T08:00:00Z"
    }
  ],
  "dateRange": {
    "start": "2025-09-01",
    "end": "2025-10-01"
  }
}
```

**Verification:**
- Response includes summary stats ✓
- `payouts` array contains recent payouts ✓
- Date range matches requested period ✓

### 3. Find Available CPOs

**Test Request:**
```bash
curl -X POST "https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/find-available-cpos" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 51.5074,
    "longitude": -0.1278,
    "protectionLevel": "executive",
    "startTime": "2025-10-03T14:00:00Z",
    "endTime": "2025-10-03T18:00:00Z",
    "maxDistanceKm": 25,
    "minRating": 4.5
  }'
```

**Expected Response:**
```json
{
  "cpos": [
    {
      "id": "cpo-uuid",
      "fullName": "John Smith",
      "siaLicense": "SIA-123456",
      "siaLevel": "3",
      "rating": 4.8,
      "totalAssignments": 45,
      "distanceKm": 3.2,
      "dailyRate": 300,
      "hourlyRate": 37.50,
      "protectionLevels": ["essential", "executive"]
    }
  ],
  "count": 1
}
```

**Verification:**
- CPOs match criteria (rating >= 4.5) ✓
- Distance calculation is reasonable ✓
- Only available CPOs returned ✓

### 4. Process CPO Payout (Admin Only)

**Test Request:**
```bash
curl -X POST "https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/process-cpo-payout" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assignmentId": "assignment-uuid",
    "cpoId": "cpo-uuid",
    "amount": 201.88
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "payoutId": "payout-uuid",
  "transferId": "tr_test_12345",
  "amount": 201.88,
  "cpoId": "cpo-uuid",
  "assignmentId": "assignment-uuid",
  "status": "completed"
}
```

**Verification:**
- Payout record created in database ✓
- Stripe transfer created ✓
- Assignment `payout_status` updated ✓

---

## Known Issues and Troubleshooting

### Issue 1: Fee Calculation Mismatch

**Symptom:**
- Client total doesn't match expected 120% markup
- CPO earnings not exactly 85% of base rate

**Causes:**
- Rounding errors in calculation
- Base rate calculation incorrect
- Edge Function not deployed

**Solutions:**

1. **Check Edge Function deployment:**
```bash
supabase functions list
# Should show "calculate-marketplace-fees" as deployed
```

2. **Verify calculation in database:**
```sql
SELECT
  id,
  client_total,
  platform_fee,
  cpo_earnings,
  (client_total / 1.20) AS base_rate_calc,
  ((client_total / 1.20) * 0.35) AS expected_platform_fee,
  ((client_total / 1.20) * 0.85) AS expected_cpo_earnings
FROM protection_assignments
WHERE id = 'assignment-uuid';
```

3. **Use helper function for accurate calculation:**
```sql
SELECT * FROM calculate_payment_split(
  (SELECT client_total / 1.20 FROM protection_assignments WHERE id = 'assignment-uuid'),
  0.15
);
```

### Issue 2: Real-time Updates Not Working

**Symptom:**
- New assignments don't appear in CPO feed
- Must manually refresh page

**Causes:**
- Supabase subscription not established
- WebSocket connection blocked
- RLS policies preventing subscription

**Solutions:**

1. **Check browser console for errors:**
```
Look for: "RealtimeSubscription: ERROR"
```

2. **Verify RLS policies allow SELECT:**
```sql
-- Test as CPO user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "cpo-uuid"}';

SELECT * FROM protection_assignments
WHERE status = 'pending';

-- Should return rows
```

3. **Restart Supabase Realtime subscription:**
```typescript
// In CPO app
const subscription = supabase
  .channel('available-assignments')
  .on('postgres_changes', { ... })
  .subscribe((status) => {
    console.log('Subscription status:', status);
  });
```

4. **Check Realtime is enabled in Supabase:**
- Go to Supabase Dashboard → Database → Replication
- Ensure `protection_assignments` table has Realtime enabled

### Issue 3: CPO Cannot Accept Assignment

**Symptom:**
- "Accept Assignment" button doesn't work
- Error message shown

**Causes:**
- CPO not available/active
- Assignment already accepted by another CPO
- Database constraint violation

**Solutions:**

1. **Verify CPO status:**
```sql
SELECT
  contractor_status,
  is_available,
  availability_status,
  stripe_connect_status
FROM protection_officers
WHERE id = 'cpo-uuid';
```

**Expected:**
- `contractor_status`: 'active'
- `is_available`: true
- `availability_status`: 'available' or 'on_duty'
- `stripe_connect_status`: 'active'

2. **Check assignment is still available:**
```sql
SELECT status, officer_id
FROM protection_assignments
WHERE id = 'assignment-uuid';
```

**Expected:**
- `status`: 'pending'
- `officer_id`: NULL

3. **Check RLS policy allows UPDATE:**
```sql
-- Test CPO can update assignment
UPDATE protection_assignments
SET officer_id = 'cpo-uuid', status = 'confirmed'
WHERE id = 'assignment-uuid'
  AND status = 'pending'
  AND officer_id IS NULL;
```

### Issue 4: Payout Processing Fails

**Symptom:**
- `process-cpo-payout` Edge Function returns error
- Payout status remains 'pending'

**Causes:**
- CPO Stripe Connect account not configured
- Insufficient balance in platform Stripe account
- Assignment not completed or payment not received

**Solutions:**

1. **Verify CPO Stripe Connect account:**
```sql
SELECT
  id,
  full_name,
  stripe_connect_id,
  stripe_connect_status,
  bank_details_verified
FROM protection_officers
WHERE id = 'cpo-uuid';
```

**Required:**
- `stripe_connect_id`: Not NULL
- `stripe_connect_status`: 'active'
- `bank_details_verified`: true

2. **Check assignment completion:**
```sql
SELECT
  status,
  completed_at,
  payment_status,
  payout_status
FROM protection_assignments
WHERE id = 'assignment-uuid';
```

**Required:**
- `status`: 'completed'
- `completed_at`: Not NULL
- `payment_status`: 'succeeded'
- `payout_status`: 'pending'

3. **Check Stripe Dashboard for errors:**
- Go to Stripe → Transfers
- Look for failed transfer attempts
- Check error message

4. **Manually retry payout:**
```sql
-- Reset payout status for retry
UPDATE cpo_payouts
SET
  status = 'pending',
  retry_count = retry_count + 1,
  failure_reason = NULL
WHERE assignment_id = 'assignment-uuid';

-- Then trigger Edge Function again
```

### Issue 5: Transparent Pricing Component Not Loading

**Symptom:**
- Booking summary shows skeleton loader indefinitely
- No pricing breakdown displayed

**Causes:**
- Edge Function not deployed
- CORS error blocking request
- Invalid Supabase credentials

**Solutions:**

1. **Check browser console for errors:**
```
Look for: "Failed to fetch", "CORS", "401 Unauthorized"
```

2. **Verify Edge Function CORS headers:**
```typescript
// In calculate-marketplace-fees/index.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

3. **Test Edge Function directly:**
```bash
curl -X POST "https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/calculate-marketplace-fees" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"baseRate": 65, "hours": 2.0, "protectionLevel": "essential"}'
```

4. **Check environment variables:**
```bash
# In .env.local
REACT_APP_SUPABASE_URL=https://jmzvrqwjmlnvxojculee.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

5. **Use fallback calculation:**
- Component has built-in fallback if Edge Function fails
- Check for "Using offline calculation" banner

### Issue 6: Database Migration Not Applied

**Symptom:**
- Queries reference columns that don't exist
- "column does not exist" errors

**Causes:**
- Migration SQL file not executed
- Migration partially executed (some statements failed)

**Solutions:**

1. **Verify columns exist:**
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'protection_officers'
  AND column_name IN (
    'stripe_connect_id',
    'contractor_status',
    'daily_rate'
  );

-- Should return 3 rows
```

2. **Check migration history:**
```sql
SELECT * FROM _migrations
ORDER BY executed_at DESC
LIMIT 10;

-- Look for 20251002_marketplace_transformation_phase1
```

3. **Re-run migration:**
```bash
cd /workspaces/armora
supabase db push
```

4. **Manual execution:**
- Open Supabase Dashboard → SQL Editor
- Paste contents of `20251002_marketplace_transformation_phase1.sql`
- Click "Run"

---

## Testing Completion Checklist

### Pre-Deployment Tests
- [ ] Database migration executed successfully
- [ ] All 5 Edge Functions deployed
- [ ] Environment variables configured
- [ ] Test CPO has Stripe Connect account
- [ ] Test Principal account created

### Test 1: Payment Flow
- [ ] Transparent pricing component loads
- [ ] Fee breakdown displays correctly (120/35/85 split)
- [ ] Payment processing succeeds
- [ ] Database records created with correct fee splits
- [ ] Stripe Payment Intent has correct metadata

### Test 2: CPO Assignment Acceptance
- [ ] Availability toggle updates database in real-time
- [ ] Available assignments feed displays pending assignments
- [ ] CPO earnings calculation is correct (85% of base)
- [ ] Assignment acceptance updates database correctly
- [ ] Principal sees CPO assigned status

### Test 3: CPO Payout Processing
- [ ] Completed assignments can trigger payout
- [ ] Stripe Connect transfer created successfully
- [ ] Payout record created in `cpo_payouts` table
- [ ] Assignment `payout_status` updated to 'completed'
- [ ] CPO dashboard shows earnings

### Test 4: Real-time Updates
- [ ] New assignments appear automatically in CPO feed
- [ ] Accepted assignments disappear from other CPOs' feeds
- [ ] Supabase subscription working correctly
- [ ] Auto-reconnection after network interruption

### Database Verification
- [ ] All marketplace columns exist
- [ ] Fee calculations are accurate (SQL queries pass)
- [ ] Payouts table populated correctly
- [ ] Helper functions working

### Edge Function Tests
- [ ] `calculate-marketplace-fees` returns correct breakdown
- [ ] `get-cpo-earnings` returns CPO summary
- [ ] `find-available-cpos` filters correctly
- [ ] `process-cpo-payout` creates Stripe transfer
- [ ] All functions handle errors gracefully

---

## Next Steps After Testing

### If All Tests Pass ✅
1. **Document test results** in project wiki
2. **Deploy to production** (if not already live)
3. **Monitor metrics** for first 7 days:
   - Payment success rate
   - Payout processing time
   - CPO acceptance rate
4. **Set up alerts** for:
   - Failed payouts
   - High payout retry count
   - Edge Function errors

### If Tests Fail ❌
1. **Document failures** with screenshots and error logs
2. **Check troubleshooting section** above
3. **Review migration file** for missing steps
4. **Verify Edge Functions** are deployed correctly
5. **Contact development team** with test results

---

## Support Resources

- **Database Schema Reference:** `/workspaces/armora/supabase/migrations/SCHEMA_REFERENCE.md`
- **Marketplace Documentation:** `/workspaces/armora/MARKETPLACE_TRANSFORMATION_COMPLETE.md`
- **Supabase Dashboard:** https://app.supabase.com
- **Stripe Dashboard:** https://dashboard.stripe.com/test

---

**Testing Guide Version:** 1.0.0
**Last Updated:** October 2, 2025
**Maintained by:** Armora Development Team
