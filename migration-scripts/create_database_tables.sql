-- ARMORA PROTECTION SERVICES DATABASE SCHEMA
-- This SQL file creates the complete database schema for Armora's protection services
-- Run this in your Supabase SQL editor

-- Check existing tables first
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN (
  'protection_officers', 'principals', 'protection_assignments', 'payments', 'subscriptions'
);

-- Protection Officers (NOT drivers) - Core security personnel table
CREATE TABLE IF NOT EXISTS protection_officers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  sia_license TEXT UNIQUE NOT NULL,
  protection_level TEXT[] DEFAULT ARRAY['essential'],
  vehicle_details JSONB,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'suspended', 'inactive')),
  availability_status TEXT DEFAULT 'offline' CHECK (availability_status IN ('available', 'on_assignment', 'offline', 'busy')),
  current_location JSONB, -- For real-time tracking
  coverage_areas TEXT[] DEFAULT ARRAY['london'],
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_assignments INTEGER DEFAULT 0,
  specializations TEXT[] DEFAULT ARRAY[], -- executive, event, medical, etc.
  background_check_expires DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Principals (NOT passengers) - Client/customer table
CREATE TABLE IF NOT EXISTS principals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  subscription_tier TEXT DEFAULT 'guest' CHECK (subscription_tier IN ('guest', 'essential', 'executive', 'shadow')),
  subscription_valid_until TIMESTAMP WITH TIME ZONE,
  discount_percentage INTEGER DEFAULT 0,
  questionnaire_completed BOOLEAN DEFAULT FALSE,
  questionnaire_data JSONB,
  preferred_protection_level TEXT,
  emergency_contacts JSONB,
  accessibility_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Protection Assignments (NOT rides/bookings) - Core service delivery table
CREATE TABLE IF NOT EXISTS protection_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  principal_id UUID REFERENCES principals(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES protection_officers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  protection_level TEXT NOT NULL CHECK (protection_level IN ('essential', 'executive', 'shadow')),
  commencement_point JSONB NOT NULL, -- NOT pickup - starting location
  secure_destination JSONB NOT NULL, -- NOT dropoff - destination
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  service_fee DECIMAL(10,2) NOT NULL, -- NOT fare - professional service fee
  distance_miles DECIMAL(8,2),
  duration_minutes INTEGER,
  special_requirements TEXT,
  officer_notes TEXT,
  principal_rating INTEGER CHECK (principal_rating >= 1 AND principal_rating <= 5),
  officer_rating INTEGER CHECK (officer_rating >= 1 AND officer_rating <= 5),
  assignment_metadata JSONB, -- Additional data like panic events, route changes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions - Premium membership management
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  principal_id UUID REFERENCES principals(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('essential', 'executive', 'shadow')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  stripe_subscription_id TEXT UNIQUE,
  monthly_fee DECIMAL(10,2) DEFAULT 14.99,
  discount_percentage INTEGER DEFAULT 20,
  priority_booking BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Payments - Financial transaction tracking
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES protection_assignments(id) ON DELETE CASCADE,
  principal_id UUID REFERENCES principals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  stripe_payment_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questionnaire Responses - User profiling and personalization
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Can be linked to either principals or protection_officers
  clerk_user_id TEXT,
  responses JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  profile_type TEXT, -- Result of questionnaire analysis
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Protection Reviews - Service quality tracking
CREATE TABLE IF NOT EXISTS protection_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES protection_assignments(id) ON DELETE CASCADE,
  principal_id UUID REFERENCES principals(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES protection_officers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_aspects JSONB, -- Detailed ratings for punctuality, professionalism, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency Activations - Panic button and emergency response
CREATE TABLE IF NOT EXISTS emergency_activations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  assignment_id UUID REFERENCES protection_assignments(id) ON DELETE SET NULL,
  activation_type TEXT NOT NULL CHECK (activation_type IN ('panic_button', 'medical', 'security_threat', 'breakdown')),
  location JSONB NOT NULL,
  response_status TEXT DEFAULT 'activated' CHECK (response_status IN ('activated', 'dispatched', 'resolved', 'false_alarm')),
  response_time_seconds INTEGER,
  resolution_notes TEXT,
  activated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Venue Protection Contracts - Event and venue security services
CREATE TABLE IF NOT EXISTS venue_protection_contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES principals(id) ON DELETE CASCADE,
  venue_name TEXT NOT NULL,
  venue_address JSONB NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('day', 'weekend', 'monthly', 'annual')),
  officer_count INTEGER DEFAULT 1,
  protection_level TEXT NOT NULL CHECK (protection_level IN ('essential', 'executive', 'shadow')),
  contract_value DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  special_requirements TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe Assignment Fund - Community impact tracking
CREATE TABLE IF NOT EXISTS safe_ride_fund_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contributor_id UUID REFERENCES principals(id) ON DELETE SET NULL,
  assignment_id UUID REFERENCES protection_assignments(id) ON DELETE SET NULL,
  contribution_amount DECIMAL(10,2) NOT NULL,
  contribution_type TEXT CHECK (contribution_type IN ('assignment_percentage', 'direct_donation', 'subscription_bonus')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safe Assignment Fund Statistics - Real-time impact metrics
CREATE TABLE IF NOT EXISTS safe_ride_fund_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_safe_assignments INTEGER DEFAULT 0,
  total_contributions DECIMAL(10,2) DEFAULT 0.00,
  monthly_target INTEGER DEFAULT 5000,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SIA License Verifications - Regulatory compliance tracking
CREATE TABLE IF NOT EXISTS sia_license_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_number TEXT UNIQUE NOT NULL,
  holder_name TEXT NOT NULL,
  license_type TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
  verification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_officers_status ON protection_officers(availability_status);
CREATE INDEX IF NOT EXISTS idx_officers_clerk_id ON protection_officers(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_officers_location ON protection_officers USING GIN(current_location);
CREATE INDEX IF NOT EXISTS idx_principals_clerk_id ON principals(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON protection_assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_principal ON protection_assignments(principal_id);
CREATE INDEX IF NOT EXISTS idx_assignments_officer ON protection_assignments(officer_id);
CREATE INDEX IF NOT EXISTS idx_assignments_scheduled ON protection_assignments(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe ON payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_officer ON protection_reviews(officer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_assignment ON protection_reviews(assignment_id);

-- Insert initial safe ride fund stats record
INSERT INTO safe_ride_fund_stats (total_safe_assignments, total_contributions)
VALUES (3741, 15642.50)
ON CONFLICT (id) DO NOTHING;

-- Create a function to find nearby officers using PostGIS (if PostGIS is enabled)
CREATE OR REPLACE FUNCTION find_nearby_officers(lat DOUBLE PRECISION, lng DOUBLE PRECISION, radius_km INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  protection_level TEXT[],
  rating DECIMAL,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  -- Note: This function requires PostGIS extension for geographic calculations
  -- For now, returning a simple placeholder that can be enhanced with PostGIS
  RETURN QUERY
  SELECT
    po.id,
    po.full_name,
    po.protection_level,
    po.rating,
    0.0 as distance_km -- Placeholder - replace with ST_Distance calculation when PostGIS is available
  FROM protection_officers po
  WHERE po.availability_status = 'available'
    AND po.status = 'approved'
  ORDER BY po.rating DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION find_nearby_officers IS 'Find available protection officers within specified radius. Requires PostGIS for accurate distance calculation.';