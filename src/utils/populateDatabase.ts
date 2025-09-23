/**
 * ARMORA PROTECTION SERVICE - DATABASE POPULATION UTILITY
 * Populates Supabase database with sample protection service data
 * Version: 1.0.0
 */

import { createClient } from '@supabase/supabase-js';
import { SAMPLE_DATA_SQL, SAMPLE_DATA_CONFIG, TEST_CREDENTIALS } from './sampleData';

// Service role client for admin operations
const getServiceRoleClient = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role credentials for database population');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Population result interface
 */
export interface PopulationResult {
  success: boolean;
  message: string;
  details: {
    profiles: number;
    officers: number;
    assignments: number;
    reviews: number;
    emergencies: number;
    questionnaires: number;
  };
  errors: string[];
  warnings: string[];
}

/**
 * Populate database with sample protection service data
 */
export async function populateDatabase(
  environment: keyof typeof SAMPLE_DATA_CONFIG = 'development'
): Promise<PopulationResult> {
  const result: PopulationResult = {
    success: false,
    message: '',
    details: {
      profiles: 0,
      officers: 0,
      assignments: 0,
      reviews: 0,
      emergencies: 0,
      questionnaires: 0,
    },
    errors: [],
    warnings: [],
  };

  try {
    const config = SAMPLE_DATA_CONFIG[environment];

    // Validate environment
    if (environment === 'production' && config.principalCount > 0) {
      result.errors.push('❌ Cannot populate production database with sample data');
      return result;
    }

    console.log(`🚀 Starting database population for ${environment} environment...`);

    const supabase = getServiceRoleClient();

    // Test connection first
    const { error: connectionError } = await supabase.from('profiles').select('count').limit(1);
    if (connectionError) {
      result.errors.push(`❌ Database connection failed: ${connectionError.message}`);
      return result;
    }

    console.log('✅ Database connection established');

    // Execute sample data SQL
    console.log('📝 Executing sample data SQL script...');
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: SAMPLE_DATA_SQL });

    if (sqlError) {
      // Try alternative approach - execute in parts
      console.log('⚠️ Bulk SQL execution failed, trying individual operations...');
      await executeIndividualOperations(supabase, result);
    } else {
      console.log('✅ Sample data SQL executed successfully');
    }

    // Verify data was inserted
    await verifyDataInsertion(supabase, result);

    // Create test user accounts if in development
    if (environment === 'development' && config.includeTestUsers) {
      await createTestUserAccounts(supabase, result);
    }

    // Final verification
    if (result.details.profiles > 0 && result.details.officers > 0) {
      result.success = true;
      result.message = `✅ Database population completed successfully for ${environment}`;
    } else {
      result.errors.push('❌ No data was successfully inserted');
    }

  } catch (error: any) {
    console.error('❌ Database population failed:', error);
    result.errors.push(`Database population error: ${error.message}`);
  }

  return result;
}

/**
 * Execute database operations individually for better error handling
 */
async function executeIndividualOperations(supabase: any, result: PopulationResult): Promise<void> {
  try {
    // Insert profiles
    const { error: profilesError } = await supabase.from('profiles').upsert([
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'sarah.thompson@globalcorp.com',
        full_name: 'Sarah Thompson',
        phone_number: '+44 7700 900001',
        preferred_protection_level: 'executive',
        account_type: 'premium',
        subscription_status: 'active',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'michael.brown@startup.io',
        full_name: 'Michael Brown',
        phone_number: '+44 7700 900004',
        preferred_protection_level: 'essential',
        account_type: 'standard',
        subscription_status: 'active',
      },
    ]);

    if (profilesError) {
      result.warnings.push(`Profile insertion warning: ${profilesError.message}`);
    } else {
      console.log('✅ Sample profiles inserted');
    }

    // Insert protection officers
    const { error: officersError } = await supabase.from('protection_officers').upsert([
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        user_id: '550e8400-e29b-41d4-a716-446655440007',
        full_name: 'Marcus Wellington',
        sia_license_number: 'SIA-123456789',
        sia_license_expiry: '2025-12-31',
        protection_level: 'all',
        specializations: ['Executive Protection', 'Threat Assessment'],
        languages: ['English', 'French'],
        first_aid_certified: true,
        vehicle_registration: 'AR25 CPO',
        vehicle_make_model: 'BMW 5 Series',
        vehicle_type: 'executive',
        availability_status: 'available',
        assignments_completed: 125,
        average_rating: 4.8,
        background_check_status: 'passed',
        active: true,
      },
    ]);

    if (officersError) {
      result.warnings.push(`Officer insertion warning: ${officersError.message}`);
    } else {
      console.log('✅ Sample protection officers inserted');
    }

  } catch (error: any) {
    result.errors.push(`Individual operations error: ${error.message}`);
  }
}

/**
 * Verify that sample data was successfully inserted
 */
async function verifyDataInsertion(supabase: any, result: PopulationResult): Promise<void> {
  try {
    // Count profiles
    const { count: profileCount, error: profileError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (!profileError) {
      result.details.profiles = profileCount || 0;
      console.log(`📊 Profiles in database: ${result.details.profiles}`);
    }

    // Count protection officers
    const { count: officerCount, error: officerError } = await supabase
      .from('protection_officers')
      .select('*', { count: 'exact', head: true });

    if (!officerError) {
      result.details.officers = officerCount || 0;
      console.log(`🛡️ Protection officers in database: ${result.details.officers}`);
    }

    // Count assignments
    const { count: assignmentCount, error: assignmentError } = await supabase
      .from('protection_assignments')
      .select('*', { count: 'exact', head: true });

    if (!assignmentError) {
      result.details.assignments = assignmentCount || 0;
      console.log(`📋 Protection assignments in database: ${result.details.assignments}`);
    }

    // Count reviews
    const { count: reviewCount, error: reviewError } = await supabase
      .from('protection_reviews')
      .select('*', { count: 'exact', head: true });

    if (!reviewError) {
      result.details.reviews = reviewCount || 0;
      console.log(`⭐ Protection reviews in database: ${result.details.reviews}`);
    }

    // Count emergencies
    const { count: emergencyCount, error: emergencyError } = await supabase
      .from('emergency_activations')
      .select('*', { count: 'exact', head: true });

    if (!emergencyError) {
      result.details.emergencies = emergencyCount || 0;
      console.log(`🚨 Emergency activations in database: ${result.details.emergencies}`);
    }

    // Count questionnaires
    const { count: questionnaireCount, error: questionnaireError } = await supabase
      .from('questionnaire_responses')
      .select('*', { count: 'exact', head: true });

    if (!questionnaireError) {
      result.details.questionnaires = questionnaireCount || 0;
      console.log(`📝 Questionnaire responses in database: ${result.details.questionnaires}`);
    }

  } catch (error: any) {
    result.warnings.push(`Verification error: ${error.message}`);
  }
}

/**
 * Create test user accounts for authentication testing
 */
async function createTestUserAccounts(supabase: any, result: PopulationResult): Promise<void> {
  try {
    console.log('👤 Creating test user accounts for authentication testing...');

    // Create test principal accounts
    for (const credential of TEST_CREDENTIALS.principals) {
      const { error } = await supabase.auth.admin.createUser({
        email: credential.email,
        password: credential.password,
        email_confirm: true,
        user_metadata: {
          account_type: 'principal',
          test_account: true,
        },
      });

      if (error && !error.message.includes('already been registered')) {
        result.warnings.push(`Test principal account creation warning: ${error.message}`);
      }
    }

    // Create test officer accounts
    for (const credential of TEST_CREDENTIALS.officers) {
      const { error } = await supabase.auth.admin.createUser({
        email: credential.email,
        password: credential.password,
        email_confirm: true,
        user_metadata: {
          account_type: 'protection_officer',
          test_account: true,
        },
      });

      if (error && !error.message.includes('already been registered')) {
        result.warnings.push(`Test officer account creation warning: ${error.message}`);
      }
    }

    console.log('✅ Test user accounts processed');

  } catch (error: any) {
    result.warnings.push(`Test account creation error: ${error.message}`);
  }
}

/**
 * Clear all sample data from database (use with caution!)
 */
export async function clearSampleData(): Promise<PopulationResult> {
  const result: PopulationResult = {
    success: false,
    message: '',
    details: { profiles: 0, officers: 0, assignments: 0, reviews: 0, emergencies: 0, questionnaires: 0 },
    errors: [],
    warnings: [],
  };

  try {
    console.log('🧹 Clearing sample data from database...');
    const supabase = getServiceRoleClient();

    // Delete in reverse order of dependencies
    await supabase.from('protection_reviews').delete().gte('created_at', '1900-01-01');
    await supabase.from('emergency_activations').delete().gte('activated_at', '1900-01-01');
    await supabase.from('questionnaire_responses').delete().gte('created_at', '1900-01-01');
    await supabase.from('protection_assignments').delete().gte('created_at', '1900-01-01');
    await supabase.from('protection_officers').delete().gte('created_at', '1900-01-01');

    // Delete test profiles (keep real user profiles)
    await supabase.from('profiles').delete().like('email', '%@armora.security');
    await supabase.from('profiles').delete().in('email', [
      'sarah.thompson@globalcorp.com',
      'james.wilson@financegroup.co.uk',
      'alexandra.clark@techventures.com',
      'michael.brown@startup.io',
      'emma.davis@consultancy.co.uk',
      'david.miller@property.com',
    ]);

    result.success = true;
    result.message = '✅ Sample data cleared successfully';
    console.log('✅ Sample data cleared from database');

  } catch (error: any) {
    result.errors.push(`Clear data error: ${error.message}`);
    console.error('❌ Failed to clear sample data:', error);
  }

  return result;
}

/**
 * Utility function to get sample data statistics
 */
export async function getSampleDataStats(): Promise<any> {
  try {
    const supabase = getServiceRoleClient();

    const stats = await Promise.all([
      supabase.from('profiles').select('count', { count: 'exact', head: true }),
      supabase.from('protection_officers').select('count', { count: 'exact', head: true }),
      supabase.from('protection_assignments').select('count', { count: 'exact', head: true }),
      supabase.from('protection_reviews').select('count', { count: 'exact', head: true }),
    ]);

    return {
      profiles: stats[0].count || 0,
      officers: stats[1].count || 0,
      assignments: stats[2].count || 0,
      reviews: stats[3].count || 0,
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    console.error('❌ Failed to get sample data stats:', error);
    return null;
  }
}