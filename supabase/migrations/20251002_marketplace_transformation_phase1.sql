-- ============================================================================
-- ARMORA MARKETPLACE TRANSFORMATION - PHASE 1: DATABASE SCHEMA MIGRATION
-- ============================================================================
-- Purpose: Transform Armora from dispatch model to marketplace platform
-- Created: 2025-10-02
-- Version: 1.0.0
--
-- This migration adds marketplace capabilities including:
-- - Stripe Connect integration for CPO payouts
-- - Payment split tracking (client total, platform fee, CPO earnings)
-- - CPO contractor management and onboarding
-- - Payout tracking and management
-- - Enhanced assignment lifecycle tracking
-- ============================================================================

-- ============================================================================
-- SECTION 1: PROTECTION OFFICERS - MARKETPLACE FIELDS
-- ============================================================================
-- Add marketplace and contractor management fields to existing table

ALTER TABLE protection_officers
  -- Stripe Connect Integration
  ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_connect_status TEXT DEFAULT 'not_created',

  -- Contractor Status Management
  ADD COLUMN IF NOT EXISTS contractor_status TEXT DEFAULT 'onboarding',
  ADD COLUMN IF NOT EXISTS bank_details_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,

  -- Marketplace Pricing
  ADD COLUMN IF NOT EXISTS daily_rate DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS minimum_booking_hours INTEGER DEFAULT 4,

  -- Network and Equipment
  ADD COLUMN IF NOT EXISTS substitute_network JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS equipment JSONB DEFAULT '{}'::jsonb,

  -- Availability Toggle
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT FALSE,

  -- Business Information
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS tax_id TEXT,
  ADD COLUMN IF NOT EXISTS business_address JSONB;

-- Add constraints for data integrity
DO $$
BEGIN
  -- Stripe Connect status check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_officers_stripe_connect_status_check'
  ) THEN
    ALTER TABLE protection_officers
      ADD CONSTRAINT protection_officers_stripe_connect_status_check
      CHECK (stripe_connect_status IN ('not_created', 'pending', 'onboarding', 'active', 'rejected', 'suspended'));
  END IF;

  -- Contractor status check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_officers_contractor_status_check'
  ) THEN
    ALTER TABLE protection_officers
      ADD CONSTRAINT protection_officers_contractor_status_check
      CHECK (contractor_status IN ('onboarding', 'active', 'suspended', 'deactivated'));
  END IF;

  -- Daily rate minimum check (£180/day minimum for professional CPO services)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_officers_daily_rate_check'
  ) THEN
    ALTER TABLE protection_officers
      ADD CONSTRAINT protection_officers_daily_rate_check
      CHECK (daily_rate >= 180 OR daily_rate IS NULL);
  END IF;

  -- Hourly rate minimum check (£22.50/hour minimum - £180/8 hours)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_officers_hourly_rate_check'
  ) THEN
    ALTER TABLE protection_officers
      ADD CONSTRAINT protection_officers_hourly_rate_check
      CHECK (hourly_rate >= 22.50 OR hourly_rate IS NULL);
  END IF;

  -- Unique Stripe Connect ID
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'protection_officers_stripe_connect_id_key'
  ) THEN
    ALTER TABLE protection_officers
      ADD CONSTRAINT protection_officers_stripe_connect_id_key
      UNIQUE (stripe_connect_id);
  END IF;
END $$;

-- ============================================================================
-- SECTION 2: PROTECTION ASSIGNMENTS - PAYMENT SPLIT FIELDS
-- ============================================================================
-- Add marketplace payment tracking to assignments

ALTER TABLE protection_assignments
  -- Payment Split Tracking
  ADD COLUMN IF NOT EXISTS client_total DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS cpo_earnings DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.15,

  -- Payout Status
  ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending',

  -- Enhanced Lifecycle Timestamps
  ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,

  -- Enhanced Location Data (replacing commencement_point/secure_destination)
  ADD COLUMN IF NOT EXISTS pickup_location JSONB,
  ADD COLUMN IF NOT EXISTS dropoff_location JSONB,

  -- Assignment Metadata
  ADD COLUMN IF NOT EXISTS assignment_type TEXT DEFAULT 'protection_detail',
  ADD COLUMN IF NOT EXISTS vehicle_type TEXT;

-- Add constraints for payment fields
DO $$
BEGIN
  -- Payout status check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_assignments_payout_status_check'
  ) THEN
    ALTER TABLE protection_assignments
      ADD CONSTRAINT protection_assignments_payout_status_check
      CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed', 'on_hold'));
  END IF;

  -- Commission rate check (0-50% range, typical 15%)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_assignments_commission_rate_check'
  ) THEN
    ALTER TABLE protection_assignments
      ADD CONSTRAINT protection_assignments_commission_rate_check
      CHECK (commission_rate >= 0 AND commission_rate <= 0.50);
  END IF;

  -- Assignment type check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'protection_assignments_assignment_type_check'
  ) THEN
    ALTER TABLE protection_assignments
      ADD CONSTRAINT protection_assignments_assignment_type_check
      CHECK (assignment_type IN ('protection_detail', 'airport_transfer', 'event_security', 'executive_transport', 'venue_protection'));
  END IF;
END $$;

-- ============================================================================
-- SECTION 3: CPO PAYOUTS TABLE
-- ============================================================================
-- New table for tracking CPO earnings and payouts

CREATE TABLE IF NOT EXISTS cpo_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  cpo_id UUID NOT NULL REFERENCES protection_officers(id) ON DELETE CASCADE,
  assignment_id UUID NOT NULL REFERENCES protection_assignments(id) ON DELETE CASCADE,

  -- Payout Amounts
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  platform_fee DECIMAL(10,2) NOT NULL CHECK (platform_fee >= 0),
  client_total DECIMAL(10,2) NOT NULL CHECK (client_total > 0),

  -- Payout Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'on_hold')),

  -- Stripe Integration
  stripe_transfer_id TEXT,
  stripe_payout_id TEXT,

  -- Failure Handling
  failure_reason TEXT,
  failure_code TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Timing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  expected_payout_date DATE,
  actual_payout_date DATE,

  -- Additional Data
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Notes
  admin_notes TEXT
);

-- Add unique constraint to prevent duplicate payouts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'cpo_payouts_assignment_unique'
  ) THEN
    ALTER TABLE cpo_payouts
      ADD CONSTRAINT cpo_payouts_assignment_unique
      UNIQUE (assignment_id);
  END IF;
END $$;

-- ============================================================================
-- SECTION 4: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Protection Officers Marketplace Indexes
CREATE INDEX IF NOT EXISTS idx_protection_officers_stripe_connect_id
  ON protection_officers(stripe_connect_id)
  WHERE stripe_connect_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_protection_officers_contractor_status
  ON protection_officers(contractor_status);

CREATE INDEX IF NOT EXISTS idx_protection_officers_availability
  ON protection_officers(availability_status, is_available)
  WHERE availability_status = 'available' AND is_available = true;

CREATE INDEX IF NOT EXISTS idx_protection_officers_stripe_connect_status
  ON protection_officers(stripe_connect_status);

-- Protection Assignments Payment Indexes
CREATE INDEX IF NOT EXISTS idx_protection_assignments_payout_status
  ON protection_assignments(payout_status);

CREATE INDEX IF NOT EXISTS idx_protection_assignments_accepted_at
  ON protection_assignments(accepted_at DESC)
  WHERE accepted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_protection_assignments_completed_at
  ON protection_assignments(completed_at DESC)
  WHERE completed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_protection_assignments_available
  ON protection_assignments(status, created_at DESC)
  WHERE status = 'pending';

-- CPO Payouts Indexes
CREATE INDEX IF NOT EXISTS idx_cpo_payouts_cpo_id
  ON cpo_payouts(cpo_id);

CREATE INDEX IF NOT EXISTS idx_cpo_payouts_assignment_id
  ON cpo_payouts(assignment_id);

CREATE INDEX IF NOT EXISTS idx_cpo_payouts_status
  ON cpo_payouts(status);

CREATE INDEX IF NOT EXISTS idx_cpo_payouts_created_at
  ON cpo_payouts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cpo_payouts_expected_date
  ON cpo_payouts(expected_payout_date)
  WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_cpo_payouts_stripe_transfer
  ON cpo_payouts(stripe_transfer_id)
  WHERE stripe_transfer_id IS NOT NULL;

-- ============================================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on cpo_payouts table
ALTER TABLE cpo_payouts ENABLE ROW LEVEL SECURITY;

-- CPOs can view their own payouts
DROP POLICY IF EXISTS "cpos_see_own_payouts" ON cpo_payouts;
CREATE POLICY "cpos_see_own_payouts" ON cpo_payouts
  FOR SELECT
  USING (cpo_id = auth.uid());

-- Service role has full access to payouts
DROP POLICY IF EXISTS "service_role_full_access_payouts" ON cpo_payouts;
CREATE POLICY "service_role_full_access_payouts" ON cpo_payouts
  FOR ALL
  USING (auth.role() = 'service_role');

-- CPOs cannot modify payouts directly
DROP POLICY IF EXISTS "cpos_cannot_modify_payouts" ON cpo_payouts;
CREATE POLICY "cpos_cannot_modify_payouts" ON cpo_payouts
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS "cpos_cannot_update_payouts" ON cpo_payouts;
CREATE POLICY "cpos_cannot_update_payouts" ON cpo_payouts
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "cpos_cannot_delete_payouts" ON cpo_payouts;
CREATE POLICY "cpos_cannot_delete_payouts" ON cpo_payouts
  FOR DELETE
  USING (false);

-- Update protection_officers RLS for marketplace fields
DROP POLICY IF EXISTS "cpos_update_own_profile_marketplace" ON protection_officers;
CREATE POLICY "cpos_update_own_profile_marketplace" ON protection_officers
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Update protection_assignments RLS for payment visibility
DROP POLICY IF EXISTS "cpos_see_own_assignments_with_payments" ON protection_assignments;
CREATE POLICY "cpos_see_own_assignments_with_payments" ON protection_assignments
  FOR SELECT
  USING (officer_id = auth.uid() OR principal_id = auth.uid());

-- ============================================================================
-- SECTION 6: HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate payment split
CREATE OR REPLACE FUNCTION calculate_payment_split(
  client_total_amount DECIMAL(10,2),
  commission_rate_param DECIMAL(5,4) DEFAULT 0.15
)
RETURNS TABLE (
  client_total DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  cpo_earnings DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    client_total_amount as client_total,
    ROUND(client_total_amount * commission_rate_param, 2) as platform_fee,
    ROUND(client_total_amount * (1 - commission_rate_param), 2) as cpo_earnings;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_payment_split IS 'Calculate payment split between platform fee and CPO earnings. Default commission is 15%.';

-- Function to get CPO payout summary
CREATE OR REPLACE FUNCTION get_cpo_payout_summary(cpo_id_param UUID)
RETURNS TABLE (
  total_earnings DECIMAL(10,2),
  total_paid DECIMAL(10,2),
  total_pending DECIMAL(10,2),
  total_assignments INTEGER,
  average_earnings DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(amount), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_paid,
    COALESCE(SUM(CASE WHEN status IN ('pending', 'processing') THEN amount ELSE 0 END), 0) as total_pending,
    COUNT(*)::INTEGER as total_assignments,
    COALESCE(AVG(amount), 0) as average_earnings
  FROM cpo_payouts
  WHERE cpo_id = cpo_id_param;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_cpo_payout_summary IS 'Get earnings summary for a CPO including totals and averages.';

-- ============================================================================
-- SECTION 7: GRANTS AND PERMISSIONS
-- ============================================================================

-- Grant appropriate permissions
GRANT SELECT ON cpo_payouts TO authenticated;
GRANT ALL ON cpo_payouts TO service_role;

-- ============================================================================
-- SECTION 8: DATA MIGRATION (OPTIONAL)
-- ============================================================================

-- Migrate existing service_fee to client_total for existing assignments
DO $$
BEGIN
  UPDATE protection_assignments
  SET
    client_total = service_fee,
    platform_fee = ROUND(service_fee * 0.15, 2),
    cpo_earnings = ROUND(service_fee * 0.85, 2)
  WHERE
    client_total IS NULL
    AND service_fee IS NOT NULL
    AND service_fee > 0;

  RAISE NOTICE 'Migrated % existing assignments with payment splits',
    (SELECT COUNT(*) FROM protection_assignments WHERE client_total IS NOT NULL);
END $$;

-- ============================================================================
-- ROLLBACK SCRIPT (FOR REFERENCE - DO NOT EXECUTE)
-- ============================================================================

/*
-- To rollback this migration, execute the following in order:

-- Drop functions
DROP FUNCTION IF EXISTS get_cpo_payout_summary(UUID);
DROP FUNCTION IF EXISTS calculate_payment_split(DECIMAL, DECIMAL);

-- Drop indexes
DROP INDEX IF EXISTS idx_cpo_payouts_stripe_transfer;
DROP INDEX IF EXISTS idx_cpo_payouts_expected_date;
DROP INDEX IF EXISTS idx_cpo_payouts_created_at;
DROP INDEX IF EXISTS idx_cpo_payouts_status;
DROP INDEX IF EXISTS idx_cpo_payouts_assignment_id;
DROP INDEX IF EXISTS idx_cpo_payouts_cpo_id;
DROP INDEX IF EXISTS idx_protection_assignments_available;
DROP INDEX IF EXISTS idx_protection_assignments_completed_at;
DROP INDEX IF EXISTS idx_protection_assignments_accepted_at;
DROP INDEX IF EXISTS idx_protection_assignments_payout_status;
DROP INDEX IF EXISTS idx_protection_officers_stripe_connect_status;
DROP INDEX IF EXISTS idx_protection_officers_availability;
DROP INDEX IF EXISTS idx_protection_officers_contractor_status;
DROP INDEX IF EXISTS idx_protection_officers_stripe_connect_id;

-- Drop table
DROP TABLE IF EXISTS cpo_payouts;

-- Remove columns from protection_assignments
ALTER TABLE protection_assignments
  DROP COLUMN IF EXISTS vehicle_type,
  DROP COLUMN IF EXISTS assignment_type,
  DROP COLUMN IF EXISTS dropoff_location,
  DROP COLUMN IF EXISTS pickup_location,
  DROP COLUMN IF EXISTS cancellation_reason,
  DROP COLUMN IF EXISTS cancelled_at,
  DROP COLUMN IF EXISTS completed_at,
  DROP COLUMN IF EXISTS accepted_at,
  DROP COLUMN IF EXISTS payout_status,
  DROP COLUMN IF EXISTS commission_rate,
  DROP COLUMN IF EXISTS cpo_earnings,
  DROP COLUMN IF EXISTS platform_fee,
  DROP COLUMN IF EXISTS client_total;

-- Remove columns from protection_officers
ALTER TABLE protection_officers
  DROP COLUMN IF EXISTS business_address,
  DROP COLUMN IF EXISTS tax_id,
  DROP COLUMN IF EXISTS company_name,
  DROP COLUMN IF EXISTS is_available,
  DROP COLUMN IF EXISTS equipment,
  DROP COLUMN IF EXISTS substitute_network,
  DROP COLUMN IF EXISTS minimum_booking_hours,
  DROP COLUMN IF EXISTS hourly_rate,
  DROP COLUMN IF EXISTS daily_rate,
  DROP COLUMN IF EXISTS onboarding_completed_at,
  DROP COLUMN IF EXISTS bank_details_verified,
  DROP COLUMN IF EXISTS contractor_status,
  DROP COLUMN IF EXISTS stripe_connect_status,
  DROP COLUMN IF EXISTS stripe_connect_id;
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'ARMORA MARKETPLACE TRANSFORMATION - PHASE 1 COMPLETE';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Migration executed successfully at: %', NOW();
  RAISE NOTICE 'Added marketplace fields to protection_officers table';
  RAISE NOTICE 'Added payment split fields to protection_assignments table';
  RAISE NOTICE 'Created cpo_payouts table for tracking CPO earnings';
  RAISE NOTICE 'Created performance indexes for marketplace operations';
  RAISE NOTICE 'Established RLS policies for secure data access';
  RAISE NOTICE 'Created helper functions for payment calculations';
  RAISE NOTICE '============================================================================';
END $$;
