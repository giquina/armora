/**
 * ARMORA PROTECTION SERVICE - SAMPLE DATA POPULATION
 * SIA-compliant test data for protection assignments
 * Version: 1.0.1
 *
 * This file contains SQL scripts to populate the Supabase database
 * with realistic sample data for testing the protection service.
 */

export const SAMPLE_DATA_SQL = `
-- ARMORA PROTECTION SERVICE - SAMPLE DATA POPULATION
-- SIA-compliant test data (working version)
-- Version: 1.0.1

-- =====================================
-- TEMPORARILY DISABLE FOREIGN KEY CONSTRAINTS
-- =====================================

-- Temporarily disable the foreign key constraint to allow sample data
ALTER TABLE public.profiles DISABLE TRIGGER ALL;
ALTER TABLE public.protection_officers DISABLE TRIGGER ALL;

-- =====================================
-- SAMPLE USER PROFILES (PRINCIPALS)
-- =====================================

-- Insert sample profiles (simulating authenticated users)
INSERT INTO public.profiles (id, email, full_name, phone_number, preferred_protection_level, account_type, subscription_status, created_at) VALUES
-- Executive clients
('550e8400-e29b-41d4-a716-446655440001', 'sarah.thompson@globalcorp.com', 'Sarah Thompson', '+44 7700 900001', 'executive', 'premium', 'active', NOW() - INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'james.wilson@financegroup.co.uk', 'James Wilson', '+44 7700 900002', 'shadow', 'corporate', 'active', NOW() - INTERVAL '25 days'),
('550e8400-e29b-41d4-a716-446655440003', 'alexandra.clark@techventures.com', 'Alexandra Clark', '+44 7700 900003', 'executive', 'premium', 'active', NOW() - INTERVAL '20 days'),

-- Standard protection clients
('550e8400-e29b-41d4-a716-446655440004', 'michael.brown@startup.io', 'Michael Brown', '+44 7700 900004', 'essential', 'standard', 'active', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440005', 'emma.davis@consultancy.co.uk', 'Emma Davis', '+44 7700 900005', 'essential', 'standard', 'inactive', NOW() - INTERVAL '10 days'),
('550e8400-e29b-41d4-a716-446655440006', 'david.miller@property.com', 'David Miller', '+44 7700 900006', 'executive', 'premium', 'active', NOW() - INTERVAL '5 days'),

-- CPO user profiles
('550e8400-e29b-41d4-a716-446655440007', 'cpo1@armora.security', 'Marcus Wellington', '+44 7700 900007', NULL, 'standard', 'active', NOW() - INTERVAL '60 days'),
('550e8400-e29b-41d4-a716-446655440008', 'cpo2@armora.security', 'Sarah Mitchell', '+44 7700 900008', NULL, 'standard', 'active', NOW() - INTERVAL '90 days'),
('550e8400-e29b-41d4-a716-446655440009', 'cpo3@armora.security', 'David Harrison', '+44 7700 900009', NULL, 'standard', 'active', NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE PROTECTION OFFICERS (CPOs)
-- =====================================

INSERT INTO public.protection_officers (
  id, user_id, full_name, sia_license_number, sia_license_expiry, protection_level,
  specializations, languages, first_aid_certified, tactical_training,
  vehicle_registration, vehicle_make_model, vehicle_type, availability_status,
  assignments_completed, average_rating, total_ratings, background_check_status,
  active, created_at
) VALUES
-- Senior Protection Officers
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Marcus Wellington', 'SIA-123456789', '2025-12-31', 'all',
 '["Executive Protection", "Threat Assessment", "Counter-Surveillance"]', '["English", "French"]', true, true,
 'AR25 CPO', 'BMW 5 Series', 'executive', 'available',
 125, 4.8, 89, 'passed', true, NOW() - INTERVAL '60 days'),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'Sarah Mitchell', 'SIA-987654321', '2026-03-15', 'all',
 '["VIP Protection", "Event Security", "Risk Management"]', '["English", "Spanish", "Arabic"]', true, true,
 'AR26 SEC', 'Mercedes-Benz E-Class', 'executive', 'available',
 201, 4.9, 156, 'passed', true, NOW() - INTERVAL '90 days'),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', 'David Harrison', 'SIA-456789123', '2025-09-20', 'all',
 '["Corporate Protection", "Discrete Operations"]', '["English", "German"]', true, true,
 'AR25 PRO', 'Audi A6', 'executive', 'available',
 87, 4.7, 67, 'passed', true, NOW() - INTERVAL '45 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE PROTECTION ASSIGNMENTS
-- =====================================

INSERT INTO public.protection_assignments (
  id, principal_id, officer_id, protection_level, assignment_type,
  assignment_status, commencement_address, secure_destination_address,
  scheduled_start, estimated_duration, total_amount, special_requirements,
  created_at, actual_start, actual_end
) VALUES
-- Completed assignments
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001',
 'executive', 'immediate', 'completed', 'Canary Wharf, London E14', 'Heathrow Terminal 5, Hounslow TW6',
 NOW() - INTERVAL '7 days', '3 hours', 225.00, '{"discretion_required": true, "media_presence": false}',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '15 minutes', NOW() - INTERVAL '7 days' + INTERVAL '3 hours'),

('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002',
 'shadow', 'immediate', 'completed', 'The Shard, London SE1', 'Park Lane Hotel, London W1K',
 NOW() - INTERVAL '5 days', '4 hours', 260.00, '{"discrete_protection": true, "media_presence": true}',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '20 minutes', NOW() - INTERVAL '5 days' + INTERVAL '4 hours'),

-- Active assignment
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001',
 'essential', 'immediate', 'protection_active', 'Manchester Piccadilly', 'MediaCity UK, Salford',
 NOW() - INTERVAL '1 hour', '2 hours', 100.00, '{"standard_protection": true}',
 NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', NULL),

-- Upcoming assignment
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001',
 'executive', 'scheduled', 'officer_assigned', 'London Kings Cross', 'Edinburgh Waverley',
 NOW() + INTERVAL '2 days', '5 hours', 375.00, '{"overnight_return": true}',
 NOW() - INTERVAL '1 day', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE PROTECTION REVIEWS
-- =====================================

INSERT INTO public.protection_reviews (
  id, assignment_id, reviewer_id, officer_id, overall_rating, professionalism_rating,
  punctuality_rating, discretion_rating, communication_rating, review_text,
  would_recommend, created_at
) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001',
 5, 5, 5, 5, 5, 'Exceptional service from start to finish. The Protection Officer was professional, discrete, and made me feel completely secure throughout the assignment. Highly recommended for executive protection.',
 true, NOW() - INTERVAL '6 days'),

('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002',
 5, 5, 5, 4, 5, 'Outstanding shadow protection service. The officer maintained perfect discretion while ensuring my safety during a high-profile event. Professional and skilled.',
 true, NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE EMERGENCY ACTIVATIONS
-- =====================================

INSERT INTO public.emergency_activations (
  id, user_id, assignment_id, activation_type, response_status,
  activation_metadata, activated_at, resolved_at
) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001',
 'manual', 'resolved', '{"test_activation": true, "response_time_seconds": 45}',
 NOW() - INTERVAL '7 days' + INTERVAL '2 hours', NOW() - INTERVAL '7 days' + INTERVAL '2 hours 5 minutes')
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- SAMPLE QUESTIONNAIRE RESPONSES
-- =====================================

INSERT INTO public.questionnaire_responses (
  id, user_id, responses, completed, completed_at, created_at
) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001',
 '{"security_level": "high", "travel_frequency": "weekly", "protection_preference": "discrete", "special_requirements": ["medical_trained_officer"], "threat_assessment": "medium"}',
 true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),

('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002',
 '{"security_level": "maximum", "travel_frequency": "daily", "protection_preference": "visible", "special_requirements": ["counter_surveillance", "threat_assessment"], "threat_assessment": "high"}',
 true, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================
-- UPDATE SAFE RIDE FUND STATS
-- =====================================

INSERT INTO public.safe_ride_fund_stats (total_rides_provided, total_contributions, total_contributors, last_updated)
VALUES (3741, 187050.00, 892, NOW())
ON CONFLICT (id) DO UPDATE SET
  total_rides_provided = 3741,
  total_contributions = 187050.00,
  total_contributors = 892,
  last_updated = NOW();

-- =====================================
-- RE-ENABLE CONSTRAINTS AND COMPLETE
-- =====================================

-- Re-enable triggers
ALTER TABLE public.profiles ENABLE TRIGGER ALL;
ALTER TABLE public.protection_officers ENABLE TRIGGER ALL;

-- Success verification
DO $$
BEGIN
  RAISE NOTICE '✅ SAMPLE DATA POPULATION COMPLETED SUCCESSFULLY';
  RAISE NOTICE '👥 Created % user profiles (principals)', (SELECT COUNT(*) FROM public.profiles);
  RAISE NOTICE '🛡️ Created % protection officers', (SELECT COUNT(*) FROM public.protection_officers);
  RAISE NOTICE '📋 Created % protection assignments', (SELECT COUNT(*) FROM public.protection_assignments);
  RAISE NOTICE '⭐ Created % protection reviews', (SELECT COUNT(*) FROM public.protection_reviews);
  RAISE NOTICE '🚨 Created % emergency activations', (SELECT COUNT(*) FROM public.emergency_activations);
  RAISE NOTICE '📝 Created % questionnaire responses', (SELECT COUNT(*) FROM public.questionnaire_responses);
  RAISE NOTICE '🎯 Database ready for Armora Protection Service testing!';
END
$$;
`;

/**
 * Sample data configuration for different environments
 */
export const SAMPLE_DATA_CONFIG = {
  development: {
    includeSensitiveData: true,
    includeTestUsers: true,
    includeActiveAssignments: true,
    principalCount: 6,
    officerCount: 3,
    assignmentCount: 4,
  },
  staging: {
    includeSensitiveData: false,
    includeTestUsers: true,
    includeActiveAssignments: false,
    principalCount: 10,
    officerCount: 5,
    assignmentCount: 15,
  },
  production: {
    includeSensitiveData: false,
    includeTestUsers: false,
    includeActiveAssignments: false,
    principalCount: 0,
    officerCount: 0,
    assignmentCount: 0,
  },
} as const;

/**
 * Sample user credentials for testing authentication
 * WARNING: Only use in development/testing environments
 */
export const TEST_CREDENTIALS = {
  principals: [
    { email: 'sarah.thompson@globalcorp.com', password: 'TestPrincipal123!' },
    { email: 'james.wilson@financegroup.co.uk', password: 'TestPrincipal456!' },
    { email: 'michael.brown@startup.io', password: 'TestPrincipal789!' },
  ],
  officers: [
    { email: 'cpo1@armora.security', password: 'TestOfficer123!' },
    { email: 'cpo2@armora.security', password: 'TestOfficer456!' },
    { email: 'cpo3@armora.security', password: 'TestOfficer789!' },
  ],
} as const;

/**
 * Sample protection service data for quick testing
 */
export const SAMPLE_PROTECTION_DATA = {
  protectionLevels: ['essential', 'executive', 'shadow'] as const,
  assignmentTypes: ['immediate', 'scheduled', 'recurring'] as const,
  assignmentStatuses: [
    'requested',
    'searching',
    'officer_assigned',
    'officer_en_route',
    'protection_active',
    'completed',
    'cancelled',
    'no_officers_available'
  ] as const,
  threatLevels: ['minimal', 'standard', 'elevated', 'high'] as const,
  officerSpecializations: [
    'Executive Protection',
    'Threat Assessment',
    'Counter-Surveillance',
    'VIP Protection',
    'Event Security',
    'Risk Management',
    'Corporate Protection',
    'Discrete Operations',
    'Medical Response',
    'Tactical Driving'
  ] as const,
} as const;