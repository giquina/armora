# Armora Marketplace Schema Reference

## Quick Reference for New Marketplace Fields

### Protection Officers Table - New Marketplace Fields

| Column | Type | Default | Constraint | Description |
|--------|------|---------|------------|-------------|
| `stripe_connect_id` | TEXT | NULL | UNIQUE | Stripe Connect account ID |
| `stripe_connect_status` | TEXT | 'not_created' | CHECK | not_created, pending, onboarding, active, rejected, suspended |
| `contractor_status` | TEXT | 'onboarding' | CHECK | onboarding, active, suspended, deactivated |
| `bank_details_verified` | BOOLEAN | FALSE | - | Bank account verification status |
| `onboarding_completed_at` | TIMESTAMP | NULL | - | When CPO completed onboarding |
| `daily_rate` | DECIMAL(10,2) | NULL | >= 180 | Daily rate in GBP (minimum £180) |
| `hourly_rate` | DECIMAL(10,2) | NULL | >= 22.50 | Hourly rate in GBP (minimum £22.50) |
| `minimum_booking_hours` | INTEGER | 4 | - | Minimum booking duration |
| `substitute_network` | JSONB | '[]' | - | Array of substitute CPO IDs |
| `equipment` | JSONB | '{}' | - | Available equipment details |
| `is_available` | BOOLEAN | FALSE | - | Toggle for marketplace availability |
| `company_name` | TEXT | NULL | - | Business/company name |
| `tax_id` | TEXT | NULL | - | Tax identification number |
| `business_address` | JSONB | NULL | - | Business address details |

### Protection Assignments Table - New Payment Fields

| Column | Type | Default | Constraint | Description |
|--------|------|---------|------------|-------------|
| `client_total` | DECIMAL(10,2) | NULL | - | Total amount client pays |
| `platform_fee` | DECIMAL(10,2) | NULL | - | Armora platform commission |
| `cpo_earnings` | DECIMAL(10,2) | NULL | - | Amount CPO receives |
| `commission_rate` | DECIMAL(5,4) | 0.15 | 0-0.50 | Platform commission rate (15% default) |
| `payout_status` | TEXT | 'pending' | CHECK | pending, processing, completed, failed, on_hold |
| `accepted_at` | TIMESTAMP | NULL | - | When CPO accepted assignment |
| `completed_at` | TIMESTAMP | NULL | - | When assignment completed |
| `cancelled_at` | TIMESTAMP | NULL | - | When assignment cancelled |
| `cancellation_reason` | TEXT | NULL | - | Reason for cancellation |
| `pickup_location` | JSONB | NULL | - | Enhanced pickup location data |
| `dropoff_location` | JSONB | NULL | - | Enhanced dropoff location data |
| `assignment_type` | TEXT | 'protection_detail' | CHECK | Type of assignment |
| `vehicle_type` | TEXT | NULL | - | Vehicle type used |

**Assignment Types**:
- `protection_detail` - Standard protection service
- `airport_transfer` - Airport pickup/dropoff
- `event_security` - Event protection
- `executive_transport` - Executive transportation
- `venue_protection` - Venue security

### CPO Payouts Table - Complete Structure

| Column | Type | Default | Constraint | Description |
|--------|------|---------|------------|-------------|
| `id` | UUID | gen_random_uuid() | PRIMARY KEY | Unique payout ID |
| `cpo_id` | UUID | - | NOT NULL, FK | Protection officer ID |
| `assignment_id` | UUID | - | NOT NULL, FK, UNIQUE | Assignment ID (one payout per assignment) |
| `amount` | DECIMAL(10,2) | - | > 0 | CPO earnings amount |
| `platform_fee` | DECIMAL(10,2) | - | >= 0 | Platform fee amount |
| `client_total` | DECIMAL(10,2) | - | > 0 | Total client paid |
| `status` | TEXT | 'pending' | CHECK | Payout status |
| `stripe_transfer_id` | TEXT | NULL | - | Stripe transfer ID |
| `stripe_payout_id` | TEXT | NULL | - | Stripe payout ID |
| `failure_reason` | TEXT | NULL | - | Failure reason if failed |
| `failure_code` | TEXT | NULL | - | Error code if failed |
| `retry_count` | INTEGER | 0 | - | Number of retry attempts |
| `created_at` | TIMESTAMP | NOW() | - | When payout created |
| `processed_at` | TIMESTAMP | NULL | - | When payout processed |
| `expected_payout_date` | DATE | NULL | - | Expected payout date |
| `actual_payout_date` | DATE | NULL | - | Actual payout date |
| `metadata` | JSONB | '{}' | - | Additional data |
| `admin_notes` | TEXT | NULL | - | Admin notes |

**Payout Statuses**:
- `pending` - Awaiting processing
- `processing` - Currently being processed
- `completed` - Successfully paid out
- `failed` - Failed to process
- `on_hold` - Temporarily held

## Helper Functions

### calculate_payment_split(client_total, commission_rate)

Calculates payment split between platform and CPO.

**Parameters**:
- `client_total` (DECIMAL): Total amount client pays
- `commission_rate` (DECIMAL): Platform commission rate (default 0.15)

**Returns**:
```sql
TABLE (
  client_total DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  cpo_earnings DECIMAL(10,2)
)
```

**Example**:
```sql
-- Calculate 15% commission on £100
SELECT * FROM calculate_payment_split(100.00, 0.15);

-- Result:
-- client_total | platform_fee | cpo_earnings
-- 100.00       | 15.00        | 85.00
```

### get_cpo_payout_summary(cpo_id)

Gets earnings summary for a CPO.

**Parameters**:
- `cpo_id` (UUID): Protection officer ID

**Returns**:
```sql
TABLE (
  total_earnings DECIMAL(10,2),
  total_paid DECIMAL(10,2),
  total_pending DECIMAL(10,2),
  total_assignments INTEGER,
  average_earnings DECIMAL(10,2)
)
```

**Example**:
```sql
-- Get payout summary for CPO
SELECT * FROM get_cpo_payout_summary('123e4567-e89b-12d3-a456-426614174000');

-- Result:
-- total_earnings | total_paid | total_pending | total_assignments | average_earnings
-- 2550.00        | 2125.00    | 425.00        | 12                | 212.50
```

## Common Queries

### Find Available CPOs with Marketplace Status
```sql
SELECT
  id,
  full_name,
  contractor_status,
  stripe_connect_status,
  daily_rate,
  hourly_rate,
  is_available,
  availability_status
FROM protection_officers
WHERE
  is_available = true
  AND availability_status = 'available'
  AND contractor_status = 'active'
  AND stripe_connect_status = 'active'
ORDER BY rating DESC;
```

### Get Pending Assignments with Payment Details
```sql
SELECT
  pa.id,
  pa.status,
  pa.client_total,
  pa.platform_fee,
  pa.cpo_earnings,
  pa.commission_rate,
  pa.scheduled_start,
  p.full_name as principal_name,
  po.full_name as officer_name
FROM protection_assignments pa
LEFT JOIN principals p ON pa.principal_id = p.id
LEFT JOIN protection_officers po ON pa.officer_id = po.id
WHERE pa.status = 'pending'
ORDER BY pa.created_at DESC;
```

### Get CPO Earnings Summary
```sql
SELECT
  po.id,
  po.full_name,
  COUNT(cp.id) as total_payouts,
  SUM(cp.amount) as total_earnings,
  SUM(CASE WHEN cp.status = 'completed' THEN cp.amount ELSE 0 END) as paid_amount,
  SUM(CASE WHEN cp.status IN ('pending', 'processing') THEN cp.amount ELSE 0 END) as pending_amount,
  AVG(cp.amount) as average_payout
FROM protection_officers po
LEFT JOIN cpo_payouts cp ON po.id = cp.cpo_id
WHERE po.contractor_status = 'active'
GROUP BY po.id, po.full_name
ORDER BY total_earnings DESC;
```

### Get Upcoming Payouts
```sql
SELECT
  cp.id,
  po.full_name as cpo_name,
  cp.amount,
  cp.expected_payout_date,
  cp.status,
  pa.id as assignment_id
FROM cpo_payouts cp
JOIN protection_officers po ON cp.cpo_id = po.id
JOIN protection_assignments pa ON cp.assignment_id = pa.id
WHERE
  cp.status IN ('pending', 'processing')
  AND cp.expected_payout_date >= CURRENT_DATE
ORDER BY cp.expected_payout_date ASC;
```

### Get Failed Payouts for Retry
```sql
SELECT
  cp.id,
  po.full_name as cpo_name,
  po.email,
  cp.amount,
  cp.failure_reason,
  cp.failure_code,
  cp.retry_count,
  cp.created_at
FROM cpo_payouts cp
JOIN protection_officers po ON cp.cpo_id = po.id
WHERE
  cp.status = 'failed'
  AND cp.retry_count < 3
ORDER BY cp.created_at ASC;
```

### Get CPO Onboarding Progress
```sql
SELECT
  id,
  full_name,
  email,
  contractor_status,
  stripe_connect_status,
  bank_details_verified,
  daily_rate IS NOT NULL as has_rate,
  sia_license IS NOT NULL as has_license,
  onboarding_completed_at,
  CASE
    WHEN stripe_connect_status = 'active'
      AND bank_details_verified = true
      AND daily_rate IS NOT NULL
      AND sia_license IS NOT NULL
    THEN 'Complete'
    ELSE 'Incomplete'
  END as onboarding_status
FROM protection_officers
WHERE contractor_status = 'onboarding'
ORDER BY created_at DESC;
```

### Calculate Total Platform Revenue
```sql
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_payouts,
  SUM(client_total) as total_revenue,
  SUM(platform_fee) as platform_revenue,
  SUM(amount) as cpo_payouts,
  ROUND(AVG(commission_rate) * 100, 2) as avg_commission_percent
FROM cpo_payouts
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

## Payment Flow Example

### 1. Assignment Created
```sql
INSERT INTO protection_assignments (
  principal_id,
  protection_level,
  scheduled_start,
  client_total,
  commission_rate
) VALUES (
  'principal-uuid',
  'executive',
  '2025-10-15 14:00:00+00',
  200.00,
  0.15
);
```

### 2. Calculate Payment Split (Automatic)
```sql
-- Using function or trigger
UPDATE protection_assignments
SET
  platform_fee = ROUND(client_total * commission_rate, 2),
  cpo_earnings = ROUND(client_total * (1 - commission_rate), 2)
WHERE id = 'assignment-uuid';

-- Result: client_total=200, platform_fee=30, cpo_earnings=170
```

### 3. CPO Accepts Assignment
```sql
UPDATE protection_assignments
SET
  officer_id = 'cpo-uuid',
  status = 'confirmed',
  accepted_at = NOW()
WHERE id = 'assignment-uuid';
```

### 4. Assignment Completed
```sql
UPDATE protection_assignments
SET
  status = 'completed',
  completed_at = NOW()
WHERE id = 'assignment-uuid';
```

### 5. Create Payout Record
```sql
INSERT INTO cpo_payouts (
  cpo_id,
  assignment_id,
  amount,
  platform_fee,
  client_total,
  expected_payout_date
)
SELECT
  officer_id,
  id,
  cpo_earnings,
  platform_fee,
  client_total,
  CURRENT_DATE + INTERVAL '7 days'
FROM protection_assignments
WHERE id = 'assignment-uuid';
```

### 6. Process Payout (via Stripe)
```sql
-- After successful Stripe transfer
UPDATE cpo_payouts
SET
  status = 'completed',
  stripe_transfer_id = 'tr_xxxxx',
  stripe_payout_id = 'po_xxxxx',
  processed_at = NOW(),
  actual_payout_date = CURRENT_DATE
WHERE id = 'payout-uuid';
```

## TypeScript Type Definitions

```typescript
// Protection Officer Marketplace Fields
interface ProtectionOfficerMarketplace {
  stripe_connect_id?: string;
  stripe_connect_status: 'not_created' | 'pending' | 'onboarding' | 'active' | 'rejected' | 'suspended';
  contractor_status: 'onboarding' | 'active' | 'suspended' | 'deactivated';
  bank_details_verified: boolean;
  onboarding_completed_at?: string;
  daily_rate?: number;
  hourly_rate?: number;
  minimum_booking_hours: number;
  substitute_network: string[];
  equipment: Record<string, any>;
  is_available: boolean;
  company_name?: string;
  tax_id?: string;
  business_address?: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
}

// Protection Assignment Payment Fields
interface ProtectionAssignmentPayment {
  client_total?: number;
  platform_fee?: number;
  cpo_earnings?: number;
  commission_rate: number;
  payout_status: 'pending' | 'processing' | 'completed' | 'failed' | 'on_hold';
  accepted_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  pickup_location?: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoff_location?: {
    lat: number;
    lng: number;
    address: string;
  };
  assignment_type: 'protection_detail' | 'airport_transfer' | 'event_security' | 'executive_transport' | 'venue_protection';
  vehicle_type?: string;
}

// CPO Payout
interface CPOPayout {
  id: string;
  cpo_id: string;
  assignment_id: string;
  amount: number;
  platform_fee: number;
  client_total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'on_hold';
  stripe_transfer_id?: string;
  stripe_payout_id?: string;
  failure_reason?: string;
  failure_code?: string;
  retry_count: number;
  created_at: string;
  processed_at?: string;
  expected_payout_date?: string;
  actual_payout_date?: string;
  metadata: Record<string, any>;
  admin_notes?: string;
}
```

## Indexes Quick Reference

### Performance Optimization
All queries using these fields will benefit from indexes:

**Protection Officers**:
- `stripe_connect_id` - Unique lookups
- `contractor_status` - Status filtering
- `(availability_status, is_available)` - Find available CPOs
- `stripe_connect_status` - Onboarding filtering

**Protection Assignments**:
- `payout_status` - Payout filtering
- `accepted_at` - Timeline queries
- `completed_at` - Completion queries
- `(status, created_at)` - Pending assignments

**CPO Payouts**:
- `cpo_id` - CPO's payouts
- `assignment_id` - Assignment lookup
- `status` - Status filtering
- `created_at` - Timeline sorting
- `expected_payout_date` - Upcoming payouts
- `stripe_transfer_id` - Stripe lookups

---

**Reference Version**: 1.0.0
**Last Updated**: October 2, 2025
**Migration File**: `20251002_marketplace_transformation_phase1.sql`
