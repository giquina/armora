-- ARMORA PROTECTION SERVICE DATABASE SCHEMA
-- Version: 1.0.0
-- Purpose: Professional close protection service management
-- SIA-compliant terminology throughout

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable PostGIS for geographic operations
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    date_of_birth DATE,
    -- Protection preferences
    preferred_protection_level TEXT CHECK (preferred_protection_level IN ('essential', 'executive', 'shadow')),
    security_requirements JSONB DEFAULT '{}',
    accessibility_needs JSONB DEFAULT '{}',
    emergency_contacts JSONB DEFAULT '[]',
    -- Account details
    account_type TEXT DEFAULT 'standard' CHECK (account_type IN ('standard', 'premium', 'corporate')),
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    discount_percentage INTEGER DEFAULT 0,
    -- Compliance
    sia_verification_status TEXT DEFAULT 'pending' CHECK (sia_verification_status IN ('pending', 'verified', 'failed')),
    martyns_law_acknowledged BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMPTZ,
    privacy_accepted_at TIMESTAMPTZ,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROTECTION OFFICERS (CPOs)
-- =====================================================

CREATE TABLE public.protection_officers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Officer details
    full_name TEXT NOT NULL,
    sia_license_number TEXT UNIQUE NOT NULL,
    sia_license_expiry DATE NOT NULL,
    protection_level TEXT NOT NULL CHECK (protection_level IN ('essential', 'executive', 'shadow', 'all')),
    -- Qualifications
    specializations JSONB DEFAULT '[]',
    languages JSONB DEFAULT '["English"]',
    first_aid_certified BOOLEAN DEFAULT false,
    tactical_training BOOLEAN DEFAULT false,
    -- Vehicle details
    vehicle_registration TEXT,
    vehicle_make_model TEXT,
    vehicle_type TEXT CHECK (vehicle_type IN ('sedan', 'suv', 'executive', 'armored')),
    vehicle_inspection_date DATE,
    -- Availability
    availability_status TEXT DEFAULT 'offline' CHECK (availability_status IN ('available', 'on_assignment', 'offline', 'break')),
    current_location GEOGRAPHY(POINT, 4326),
    coverage_areas JSONB DEFAULT '[]',
    -- Performance
    assignments_completed INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    -- Metadata
    background_check_date DATE,
    background_check_status TEXT CHECK (background_check_status IN ('passed', 'pending', 'failed')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROTECTION ASSIGNMENTS
-- =====================================================

CREATE TABLE public.protection_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- Assignment parties
    principal_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    officer_id UUID REFERENCES public.protection_officers(id) ON DELETE SET NULL,
    -- Assignment details
    protection_level TEXT NOT NULL CHECK (protection_level IN ('essential', 'executive', 'shadow')),
    assignment_type TEXT DEFAULT 'immediate' CHECK (assignment_type IN ('immediate', 'scheduled', 'recurring')),
    -- Location details
    commencement_point GEOGRAPHY(POINT, 4326) NOT NULL,
    commencement_address TEXT NOT NULL,
    secure_destination GEOGRAPHY(POINT, 4326),
    secure_destination_address TEXT,
    -- Timing
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    estimated_duration INTERVAL,
    actual_end TIMESTAMPTZ,
    -- Status tracking
    assignment_status TEXT DEFAULT 'requested' CHECK (assignment_status IN (
        'requested', 'searching', 'officer_assigned', 'officer_en_route',
        'protection_active', 'completed', 'cancelled', 'no_officers_available'
    )),
    -- Pricing
    service_fee DECIMAL(10, 2),
    base_rate DECIMAL(10, 2),
    mileage_fee DECIMAL(10, 2),
    waiting_time_fee DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    -- Security details
    threat_level TEXT DEFAULT 'standard' CHECK (threat_level IN ('minimal', 'standard', 'elevated', 'high')),
    special_requirements JSONB DEFAULT '{}',
    incident_reports JSONB DEFAULT '[]',
    -- Metadata
    cancellation_reason TEXT,
    cancelled_by TEXT CHECK (cancelled_by IN ('principal', 'officer', 'system', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROTECTION REVIEWS
-- =====================================================

CREATE TABLE public.protection_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES public.protection_assignments(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    officer_id UUID REFERENCES public.protection_officers(id) ON DELETE CASCADE NOT NULL,
    -- Review details
    professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
    punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
    discretion_rating INTEGER CHECK (discretion_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    overall_rating DECIMAL(3, 2) CHECK (overall_rating BETWEEN 1 AND 5),
    -- Feedback
    review_text TEXT,
    would_recommend BOOLEAN DEFAULT true,
    officer_response TEXT,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAYMENT TRANSACTIONS
-- =====================================================

CREATE TABLE public.payment_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assignment_id UUID REFERENCES public.protection_assignments(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    -- Transaction details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'subscription', 'deposit')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'apple_pay', 'google_pay', 'bank_transfer', 'corporate_account')),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'GBP',
    -- Status
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    -- Metadata
    payment_metadata JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EMERGENCY ACTIVATIONS
-- =====================================================

CREATE TABLE public.emergency_activations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assignment_id UUID REFERENCES public.protection_assignments(id) ON DELETE SET NULL,
    -- Activation details
    activation_type TEXT NOT NULL CHECK (activation_type IN ('panic_button', 'voice_command', 'auto_detected', 'manual')),
    location GEOGRAPHY(POINT, 4326),
    activation_metadata JSONB DEFAULT '{}',
    -- Response details
    response_status TEXT DEFAULT 'activated' CHECK (response_status IN ('activated', 'acknowledged', 'responding', 'resolved', 'false_alarm')),
    responder_id UUID REFERENCES public.protection_officers(id) ON DELETE SET NULL,
    response_time INTERVAL,
    resolution_notes TEXT,
    -- Timestamps
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUESTIONNAIRE RESPONSES
-- =====================================================

CREATE TABLE public.questionnaire_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    responses JSONB NOT NULL DEFAULT '{}',
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VENUE PROTECTION CONTRACTS
-- =====================================================

CREATE TABLE public.venue_protection_contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    -- Venue details
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    venue_type TEXT,
    venue_capacity INTEGER,
    -- Contract details
    contract_type TEXT NOT NULL CHECK (contract_type IN ('day', 'weekend', 'monthly', 'annual', 'event')),
    protection_level TEXT NOT NULL CHECK (protection_level IN ('basic', 'enhanced', 'comprehensive')),
    number_of_officers INTEGER DEFAULT 1,
    -- Duration
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    -- Pricing
    contract_value DECIMAL(10, 2) NOT NULL,
    payment_terms TEXT,
    -- Compliance
    martyns_law_compliant BOOLEAN DEFAULT false,
    risk_assessment_completed BOOLEAN DEFAULT false,
    -- Status
    contract_status TEXT DEFAULT 'draft' CHECK (contract_status IN ('draft', 'pending', 'active', 'expired', 'cancelled')),
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SIA LICENSE VERIFICATIONS
-- =====================================================

CREATE TABLE public.sia_license_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    license_number TEXT UNIQUE NOT NULL,
    holder_name TEXT NOT NULL,
    license_type TEXT,
    issue_date DATE,
    expiry_date DATE,
    verification_status TEXT CHECK (verification_status IN ('valid', 'expired', 'suspended', 'revoked', 'not_found')),
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SAFE RIDE FUND
-- =====================================================

CREATE TABLE public.safe_ride_fund_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    contributor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    contribution_type TEXT CHECK (contribution_type IN ('one_time', 'monthly', 'assignment_percentage')),
    assignment_id UUID REFERENCES public.protection_assignments(id) ON DELETE SET NULL,
    anonymous BOOLEAN DEFAULT false,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.safe_ride_fund_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_rides_provided INTEGER DEFAULT 0,
    total_contributions DECIMAL(12, 2) DEFAULT 0.00,
    total_contributors INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_subscription_status ON public.profiles(subscription_status);

-- Officer indexes
CREATE INDEX idx_officers_availability ON public.protection_officers(availability_status);
CREATE INDEX idx_officers_location ON public.protection_officers USING GIST(current_location);
CREATE INDEX idx_officers_sia_license ON public.protection_officers(sia_license_number);

-- Assignment indexes
CREATE INDEX idx_assignments_principal ON public.protection_assignments(principal_id);
CREATE INDEX idx_assignments_officer ON public.protection_assignments(officer_id);
CREATE INDEX idx_assignments_status ON public.protection_assignments(assignment_status);
CREATE INDEX idx_assignments_created ON public.protection_assignments(created_at DESC);
CREATE INDEX idx_assignments_location ON public.protection_assignments USING GIST(commencement_point);

-- Payment indexes
CREATE INDEX idx_payments_user ON public.payment_transactions(user_id);
CREATE INDEX idx_payments_assignment ON public.payment_transactions(assignment_id);
CREATE INDEX idx_payments_status ON public.payment_transactions(payment_status);

-- Emergency indexes
CREATE INDEX idx_emergency_user ON public.emergency_activations(user_id);
CREATE INDEX idx_emergency_status ON public.emergency_activations(response_status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protection_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_protection_contracts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Protection assignments policies
CREATE POLICY "Users can view own assignments" ON public.protection_assignments
    FOR SELECT USING (auth.uid() = principal_id);

CREATE POLICY "Users can create assignments" ON public.protection_assignments
    FOR INSERT WITH CHECK (auth.uid() = principal_id);

CREATE POLICY "Officers can view assigned assignments" ON public.protection_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.protection_officers
            WHERE protection_officers.user_id = auth.uid()
            AND protection_officers.id = protection_assignments.officer_id
        )
    );

-- Payment policies
CREATE POLICY "Users can view own payments" ON public.payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Emergency policies
CREATE POLICY "Users can create emergency activations" ON public.emergency_activations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own emergencies" ON public.emergency_activations
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON public.protection_officers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.protection_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate officer rating
CREATE OR REPLACE FUNCTION calculate_officer_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.protection_officers
    SET average_rating = (
        SELECT AVG(overall_rating)
        FROM public.protection_reviews
        WHERE officer_id = NEW.officer_id
    ),
    total_ratings = (
        SELECT COUNT(*)
        FROM public.protection_reviews
        WHERE officer_id = NEW.officer_id
    )
    WHERE id = NEW.officer_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_officer_rating AFTER INSERT OR UPDATE ON public.protection_reviews
    FOR EACH ROW EXECUTE FUNCTION calculate_officer_rating();

-- Function to find nearby officers
CREATE OR REPLACE FUNCTION find_nearby_officers(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    sia_license_number TEXT,
    protection_level TEXT,
    distance_km DOUBLE PRECISION,
    availability_status TEXT,
    average_rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        po.id,
        po.full_name,
        po.sia_license_number,
        po.protection_level,
        ST_Distance(
            po.current_location::geography,
            ST_MakePoint(lng, lat)::geography
        ) / 1000 AS distance_km,
        po.availability_status,
        po.average_rating
    FROM public.protection_officers po
    WHERE po.active = true
    AND po.availability_status = 'available'
    AND ST_DWithin(
        po.current_location::geography,
        ST_MakePoint(lng, lat)::geography,
        radius_km * 1000
    )
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-expire assignments
CREATE OR REPLACE FUNCTION auto_expire_assignments()
RETURNS void AS $$
BEGIN
    UPDATE public.protection_assignments
    SET assignment_status = 'cancelled',
        cancellation_reason = 'Auto-expired after 24 hours',
        cancelled_by = 'system'
    WHERE assignment_status = 'requested'
    AND requested_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (new.id, new.email, now(), now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert initial Safe Ride Fund stats
INSERT INTO public.safe_ride_fund_stats (total_rides_provided, total_contributions, total_contributors)
VALUES (3741, 187050.00, 892)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- GRANTS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;