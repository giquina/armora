-- Migration: Fix payments table structure
-- Purpose: Add missing columns and update indexes
-- Created: 2025-09-30

-- Drop existing indexes if they exist (they might reference columns we're about to add)
DROP INDEX IF EXISTS public.idx_payments_user_id;
DROP INDEX IF EXISTS public.idx_payments_assignment_id;
DROP INDEX IF EXISTS public.idx_payments_stripe_payment_intent_id;
DROP INDEX IF EXISTS public.idx_payments_status;
DROP INDEX IF EXISTS public.idx_payments_created_at;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Service role has full access to payments" ON public.payments;
DROP POLICY IF EXISTS "Users cannot modify payments directly" ON public.payments;
DROP POLICY IF EXISTS "Users cannot update payments directly" ON public.payments;
DROP POLICY IF EXISTS "Users cannot delete payments" ON public.payments;

-- Add missing columns if they don't exist
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS assignment_id UUID REFERENCES public.protection_assignments(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_charge_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_method_type TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS refund_reason TEXT,
  ADD COLUMN IF NOT EXISTS succeeded_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;

-- Add unique constraint to stripe_payment_intent_id if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE public.payments ADD CONSTRAINT payments_stripe_payment_intent_id_key UNIQUE (stripe_payment_intent_id);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN NULL;
  WHEN others THEN NULL;
END $$;

-- Recreate indexes (only if columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'user_id') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'assignment_id') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_assignment_id ON public.payments(assignment_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'stripe_payment_intent_id') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'status') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'created_at') THEN
    CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);
  END IF;
END $$;

-- Recreate RLS policies
CREATE POLICY "Users can view their own payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to payments"
  ON public.payments
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users cannot modify payments directly"
  ON public.payments
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Users cannot update payments directly"
  ON public.payments
  FOR UPDATE
  USING (false);

CREATE POLICY "Users cannot delete payments"
  ON public.payments
  FOR DELETE
  USING (false);

-- Grant permissions
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
