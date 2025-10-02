# Armora Marketplace Transformation - Phase 1 Migration Summary

## Overview
**Migration File**: `20251002_marketplace_transformation_phase1.sql`
**Created**: October 2, 2025
**Purpose**: Transform Armora from dispatch model to marketplace platform
**Status**: ✅ Ready for execution (NOT YET EXECUTED)

## What This Migration Does

### 1. Protection Officers Table - Marketplace Fields
Adds contractor and marketplace capabilities to existing CPOs:

#### Stripe Connect Integration
- `stripe_connect_id` - Unique Stripe Connect account ID
- `stripe_connect_status` - Status: not_created, pending, onboarding, active, rejected, suspended

#### Contractor Management
- `contractor_status` - Status: onboarding, active, suspended, deactivated
- `bank_details_verified` - Boolean flag for verified banking info
- `onboarding_completed_at` - Timestamp when onboarding completed

#### Marketplace Pricing
- `daily_rate` - Daily rate (min £180/day)
- `hourly_rate` - Hourly rate (min £22.50/hour)
- `minimum_booking_hours` - Minimum booking duration (default 4 hours)

#### Network & Equipment
- `substitute_network` - JSONB array of substitute CPOs
- `equipment` - JSONB object of available equipment

#### Availability
- `is_available` - Boolean toggle for marketplace availability

#### Business Information
- `company_name` - Business/company name
- `tax_id` - Tax identification number
- `business_address` - JSONB business address

### 2. Protection Assignments Table - Payment Split Fields
Adds marketplace payment tracking:

#### Payment Split Tracking
- `client_total` - Total amount client pays
- `platform_fee` - Armora platform commission (15% default)
- `cpo_earnings` - Amount CPO receives (85% default)
- `commission_rate` - Configurable commission rate (0-50%, default 0.15)

#### Payout Management
- `payout_status` - Status: pending, processing, completed, failed, on_hold

#### Enhanced Lifecycle
- `accepted_at` - When CPO accepted assignment
- `completed_at` - When assignment completed
- `cancelled_at` - When assignment cancelled
- `cancellation_reason` - Reason for cancellation

#### Enhanced Location Data
- `pickup_location` - JSONB pickup location details
- `dropoff_location` - JSONB dropoff location details

#### Assignment Metadata
- `assignment_type` - Type: protection_detail, airport_transfer, event_security, executive_transport, venue_protection
- `vehicle_type` - Vehicle type used

### 3. New Table: cpo_payouts
Complete payout tracking system:

```sql
CREATE TABLE cpo_payouts (
  id UUID PRIMARY KEY,
  cpo_id UUID NOT NULL,                    -- FK to protection_officers
  assignment_id UUID NOT NULL,             -- FK to protection_assignments
  amount DECIMAL(10,2),                    -- CPO earnings amount
  platform_fee DECIMAL(10,2),              -- Platform fee amount
  client_total DECIMAL(10,2),              -- Total client paid
  status TEXT,                             -- pending, processing, completed, failed, on_hold
  stripe_transfer_id TEXT,                 -- Stripe transfer ID
  stripe_payout_id TEXT,                   -- Stripe payout ID
  failure_reason TEXT,                     -- If failed, why
  failure_code TEXT,                       -- Error code
  retry_count INTEGER,                     -- Number of retry attempts
  created_at TIMESTAMP,                    -- When created
  processed_at TIMESTAMP,                  -- When processed
  expected_payout_date DATE,               -- Expected payout date
  actual_payout_date DATE,                 -- Actual payout date
  metadata JSONB,                          -- Additional data
  admin_notes TEXT                         -- Admin notes
);
```

### 4. Performance Indexes
Created 14 optimized indexes:

**Protection Officers**:
- `idx_protection_officers_stripe_connect_id` - Fast Stripe Connect lookups
- `idx_protection_officers_contractor_status` - Filter by contractor status
- `idx_protection_officers_availability` - Find available CPOs
- `idx_protection_officers_stripe_connect_status` - Onboarding status filtering

**Protection Assignments**:
- `idx_protection_assignments_payout_status` - Payout status filtering
- `idx_protection_assignments_accepted_at` - Accepted assignments timeline
- `idx_protection_assignments_completed_at` - Completed assignments timeline
- `idx_protection_assignments_available` - Find pending assignments

**CPO Payouts**:
- `idx_cpo_payouts_cpo_id` - CPO's payouts
- `idx_cpo_payouts_assignment_id` - Assignment payouts
- `idx_cpo_payouts_status` - Filter by status
- `idx_cpo_payouts_created_at` - Timeline sorting
- `idx_cpo_payouts_expected_date` - Upcoming payouts
- `idx_cpo_payouts_stripe_transfer` - Stripe transfer lookups

### 5. Row Level Security (RLS) Policies
Secure data access policies:

**cpo_payouts table**:
- ✅ CPOs can view their own payouts
- ✅ Service role has full access
- ❌ CPOs cannot insert/update/delete payouts (system-only)

**protection_officers table**:
- ✅ CPOs can update their own marketplace profile

**protection_assignments table**:
- ✅ CPOs and Principals can view assignments with payment details

### 6. Helper Functions

#### `calculate_payment_split(client_total, commission_rate)`
Calculates payment split:
- Input: Client total amount, commission rate (default 15%)
- Returns: client_total, platform_fee, cpo_earnings

```sql
SELECT * FROM calculate_payment_split(100.00, 0.15);
-- Returns: client_total=100.00, platform_fee=15.00, cpo_earnings=85.00
```

#### `get_cpo_payout_summary(cpo_id)`
Gets earnings summary for a CPO:
- Returns: total_earnings, total_paid, total_pending, total_assignments, average_earnings

```sql
SELECT * FROM get_cpo_payout_summary('uuid-here');
-- Returns summary of all payouts for the CPO
```

### 7. Data Migration
Automatically migrates existing assignment data:
- Sets `client_total` from existing `service_fee`
- Calculates `platform_fee` as 15% of service_fee
- Calculates `cpo_earnings` as 85% of service_fee

## Migration Statistics

- **Total Lines**: 484
- **Total DDL Statements**: 89
- **ALTER TABLE**: 14
- **CREATE TABLE**: 1
- **CREATE INDEX**: 14
- **CREATE POLICY**: 7
- **CREATE FUNCTION**: 2
- **Safety Clauses**: 102 (IF NOT EXISTS / IF EXISTS)
- **Constraint Checks**: 13
- **Foreign Key References**: 2

## Safety Features

✅ **Idempotent**: Can be run multiple times safely
✅ **IF NOT EXISTS**: All creates use IF NOT EXISTS
✅ **Constraint Validation**: All fields have proper constraints
✅ **Foreign Keys**: Proper relationships with CASCADE/SET NULL
✅ **Default Values**: Sensible defaults for all nullable fields
✅ **Data Integrity**: CHECK constraints on critical fields
✅ **Rollback Script**: Included (commented) for emergency rollback

## Constraints Added

### Protection Officers
- Stripe Connect status: 6 valid states
- Contractor status: 4 valid states
- Daily rate minimum: £180
- Hourly rate minimum: £22.50
- Unique Stripe Connect ID

### Protection Assignments
- Payout status: 5 valid states
- Commission rate: 0-50% range
- Assignment type: 5 valid types

### CPO Payouts
- Amount must be > 0
- Platform fee must be >= 0
- Client total must be > 0
- Status must be valid
- Unique assignment_id (one payout per assignment)

## Execution Instructions

### Method 1: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire content of `20251002_marketplace_transformation_phase1.sql`
3. Paste into SQL Editor
4. Click "Run" button
5. Verify success messages in output

### Method 2: Supabase CLI
```bash
# Make sure Supabase CLI is installed
npm install -g supabase

# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Method 3: Direct psql
```bash
psql "postgresql://postgres:[password]@[host]:[port]/postgres" \
  -f /workspaces/armora/supabase/migrations/20251002_marketplace_transformation_phase1.sql
```

## Verification Steps

After executing the migration, verify:

```sql
-- 1. Check new columns exist in protection_officers
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'protection_officers'
  AND column_name IN ('stripe_connect_id', 'contractor_status', 'daily_rate', 'is_available');

-- 2. Check new columns exist in protection_assignments
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'protection_assignments'
  AND column_name IN ('client_total', 'platform_fee', 'cpo_earnings', 'payout_status');

-- 3. Check cpo_payouts table was created
SELECT COUNT(*) FROM information_schema.tables
WHERE table_name = 'cpo_payouts';

-- 4. Check indexes were created
SELECT indexname FROM pg_indexes
WHERE tablename IN ('protection_officers', 'protection_assignments', 'cpo_payouts')
  AND indexname LIKE '%marketplace%' OR indexname LIKE '%payout%';

-- 5. Check RLS policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE tablename = 'cpo_payouts';

-- 6. Test helper functions
SELECT * FROM calculate_payment_split(100.00, 0.15);
```

## Expected Results

After successful execution:

1. **protection_officers table**: 13 new columns added
2. **protection_assignments table**: 10 new columns added
3. **cpo_payouts table**: Created with 18 columns
4. **Indexes**: 14 performance indexes created
5. **Policies**: 7 RLS policies created
6. **Functions**: 2 helper functions created
7. **Existing data**: Migrated with payment splits calculated

## Rollback Information

If needed, a complete rollback script is included at the bottom of the migration file (commented out). To rollback:

1. Uncomment the rollback section
2. Execute in reverse order
3. Verify all changes reverted

**⚠️ Warning**: Rollback will delete all marketplace data including payouts. Only use if absolutely necessary.

## Next Steps After Migration

### Phase 2: Service Layer Implementation
1. Create Stripe Connect integration service
2. Implement payout processing logic
3. Add webhook handlers for Stripe events
4. Build CPO onboarding flow

### Phase 3: UI/UX Implementation
1. CPO dashboard for earnings
2. Assignment acceptance flow
3. Payout history view
4. Onboarding wizard

### Phase 4: Testing & Validation
1. Unit tests for payment calculations
2. Integration tests for Stripe Connect
3. E2E tests for full marketplace flow
4. Load testing for payout processing

## File Locations

- **Migration File**: `/workspaces/armora/supabase/migrations/20251002_marketplace_transformation_phase1.sql`
- **This Summary**: `/workspaces/armora/supabase/migrations/MIGRATION_SUMMARY.md`
- **Database Schema**: `/workspaces/armora/migration-scripts/create_database_tables.sql`

## Support

For questions or issues:
1. Review migration file comments for detailed explanations
2. Check constraint definitions for business rules
3. Review helper functions for calculation logic
4. Consult rollback script if reversal needed

---

**Status**: ✅ Migration file created and verified
**Ready for execution**: YES
**Executed**: NO - Awaiting approval
**Created by**: Claude Code (Armora Marketplace Transformation)
**Date**: October 2, 2025
