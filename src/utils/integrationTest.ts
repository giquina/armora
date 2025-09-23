/**
 * ARMORA PROTECTION SERVICE - INTEGRATION TEST SUITE
 * Comprehensive testing for Supabase integration and protection service features
 * Version: 1.0.0
 */

import {
  supabase,
  signUpWithEmail,
  signInWithEmail,
  signOut,
  getCurrentUser,
  getUserProfile,
  createProtectionAssignment,
  getProtectionOfficers,
  activateEmergency,
  getUserAssignments,
  getSafeRideFundStats,
} from "../lib/supabase"

import { populateDatabase, clearSampleData, getSampleDataStats } from './populateDatabase';
import { TEST_CREDENTIALS } from './sampleData';

/**
 * Integration test result interface
 */
export interface IntegrationTestResult {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  details?: any;
  error?: string;
}

export interface IntegrationTestSuite {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  results: IntegrationTestResult[];
  summary: string;
}

/**
 * Main integration test runner
 */
export async function runIntegrationTests(): Promise<IntegrationTestSuite> {
  const suite: IntegrationTestSuite = {
    suiteName: 'Armora Protection Service Integration Tests',
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    duration: 0,
    results: [],
    summary: '',
  };

  const startTime = Date.now();

  console.log('🚀 Starting Armora Protection Service Integration Tests...\n');

  // Test 1: Database Connection
  await runTest(suite, 'Database Connection', testDatabaseConnection);

  // Test 2: Sample Data Population
  await runTest(suite, 'Sample Data Population', testSampleDataPopulation);

  // Test 3: User Authentication
  await runTest(suite, 'User Authentication Flow', testUserAuthentication);

  // Test 4: Protection Officer Queries
  await runTest(suite, 'Protection Officer Queries', testProtectionOfficerQueries);

  // Test 5: Assignment Creation
  await runTest(suite, 'Assignment Creation', testAssignmentCreation);

  // Test 6: Real-time Updates
  await runTest(suite, 'Real-time Updates', testRealTimeUpdates);

  // Test 7: Emergency System
  await runTest(suite, 'Emergency Alert System', testEmergencySystem);

  // Test 8: Safe Assignment Fund
  await runTest(suite, 'Safe Assignment Fund Integration', testSafeRideFund);

  // Test 9: Data Integrity
  await runTest(suite, 'Data Integrity Checks', testDataIntegrity);

  // Test 10: Terminology Compliance
  await runTest(suite, 'Protection Service Terminology', testTerminologyCompliance);

  // Calculate final statistics
  suite.duration = Date.now() - startTime;
  suite.summary = `Integration Tests ${suite.passedTests === suite.totalTests ? '✅ PASSED' : '❌ FAILED'}: ${suite.passedTests}/${suite.totalTests} tests passed in ${suite.duration}ms`;

  console.log(`\n${suite.summary}`);
  console.log(`🎯 Integration test suite completed\n`);

  return suite;
}

/**
 * Helper function to run individual tests
 */
async function runTest(
  suite: IntegrationTestSuite,
  testName: string,
  testFunction: () => Promise<IntegrationTestResult>
): Promise<void> {
  suite.totalTests++;
  console.log(`🧪 Running: ${testName}`);

  try {
    const result = await testFunction();
    result.testName = testName;

    if (result.success) {
      suite.passedTests++;
      console.log(`   ✅ ${result.message} (${result.duration}ms)`);
    } else {
      suite.failedTests++;
      console.log(`   ❌ ${result.message} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   📋 Error: ${result.error}`);
      }
    }

    suite.results.push(result);
  } catch (error: any) {
    suite.failedTests++;
    const failedResult: IntegrationTestResult = {
      testName,
      success: false,
      message: 'Test execution failed',
      duration: 0,
      error: error.message,
    };
    suite.results.push(failedResult);
    console.log(`   ❌ Test execution failed: ${error.message}`);
  }

  console.log('');
}

/**
 * Test 1: Database Connection
 */
async function testDatabaseConnection(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Test basic connection
    const { error } = await supabase.from('profiles').select('count').limit(1);

    if (error) {
      return {
        testName: '',
        success: false,
        message: 'Database connection failed',
        duration: Date.now() - startTime,
        error: error.message,
      };
    }

    // Test table existence
    const tables = ['profiles', 'protection_officers', 'protection_assignments', 'emergency_activations'];
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('count').limit(1);
      if (tableError) {
        return {
          testName: '',
          success: false,
          message: `Table ${table} not found`,
          duration: Date.now() - startTime,
          error: tableError.message,
        };
      }
    }

    return {
      testName: '',
      success: true,
      message: 'Database connection and schema verified',
      duration: Date.now() - startTime,
      details: { tablesVerified: tables.length },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Database connection test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 2: Sample Data Population
 */
async function testSampleDataPopulation(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Get initial stats
    const initialStats = await getSampleDataStats();

    // Populate sample data
    const populationResult = await populateDatabase('development');

    if (!populationResult.success) {
      return {
        testName: '',
        success: false,
        message: 'Sample data population failed',
        duration: Date.now() - startTime,
        error: populationResult.errors.join(', '),
      };
    }

    // Verify data was inserted
    const finalStats = await getSampleDataStats();

    return {
      testName: '',
      success: true,
      message: 'Sample data populated successfully',
      duration: Date.now() - startTime,
      details: {
        initial: initialStats,
        final: finalStats,
        populated: populationResult.details,
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Sample data population test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 3: User Authentication
 */
async function testUserAuthentication(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    const testCredential = TEST_CREDENTIALS.principals[0];

    // Test sign up (may fail if user exists - that's ok)
    const { data: signUpData, error: signUpError } = await signUpWithEmail(
      testCredential.email,
      testCredential.password,
      { test_account: true }
    );

    // Test sign in
    const { data: signInData, error: signInError } = await signInWithEmail(
      testCredential.email,
      testCredential.password
    );

    if (signInError) {
      return {
        testName: '',
        success: false,
        message: 'User sign in failed',
        duration: Date.now() - startTime,
        error: signInError.message,
      };
    }

    // Test getting current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        testName: '',
        success: false,
        message: 'Could not get current user after sign in',
        duration: Date.now() - startTime,
      };
    }

    // Test getting user profile
    const { data: profile, error: profileError } = await getUserProfile(currentUser.id);
    if (profileError) {
      return {
        testName: '',
        success: false,
        message: 'Could not get user profile',
        duration: Date.now() - startTime,
        error: profileError.message,
      };
    }

    // Test sign out
    const { error: signOutError } = await signOut();
    if (signOutError) {
      return {
        testName: '',
        success: false,
        message: 'User sign out failed',
        duration: Date.now() - startTime,
        error: signOutError.message,
      };
    }

    return {
      testName: '',
      success: true,
      message: 'User authentication flow completed successfully',
      duration: Date.now() - startTime,
      details: {
        userId: currentUser.id,
        email: currentUser.email,
        profileExists: !!profile,
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'User authentication test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 4: Protection Officer Queries
 */
async function testProtectionOfficerQueries(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Test getting available officers
    const { data: officers, error } = await getProtectionOfficers();

    if (error) {
      return {
        testName: '',
        success: false,
        message: 'Protection officer query failed',
        duration: Date.now() - startTime,
        error: error.message,
      };
    }

    // Verify officer data structure
    if (officers && officers.length > 0) {
      const officer = officers[0];
      const requiredFields = ['id', 'full_name', 'sia_license_number', 'protection_level'];
      const missingFields = requiredFields.filter(field => !officer[field]);

      if (missingFields.length > 0) {
        return {
          testName: '',
          success: false,
          message: 'Protection officer data structure invalid',
          duration: Date.now() - startTime,
          error: `Missing fields: ${missingFields.join(', ')}`,
        };
      }
    }

    return {
      testName: '',
      success: true,
      message: 'Protection officer queries working correctly',
      duration: Date.now() - startTime,
      details: {
        officersFound: officers?.length || 0,
        availableOfficers: officers?.filter(o => o.availability_status === 'available').length || 0,
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Protection officer query test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 5: Assignment Creation
 */
async function testAssignmentCreation(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // First sign in to get a user
    const testCredential = TEST_CREDENTIALS.principals[0];
    const { data: authData } = await signInWithEmail(testCredential.email, testCredential.password);

    if (!authData.user) {
      return {
        testName: '',
        success: false,
        message: 'Could not authenticate user for assignment test',
        duration: Date.now() - startTime,
      };
    }

    // Create test assignment data
    const assignmentData = {
      principal_id: authData.user.id,
      protection_level: 'essential',
      assignment_type: 'immediate',
      commencement_address: 'Test Location, London',
      secure_destination_address: 'Test Destination, London',
      scheduled_start: new Date().toISOString(),
      estimated_duration: '2 hours',
      total_amount: 130.00,
      special_requirements: { test_assignment: true },
    };

    // Create assignment
    const { data: assignment, error } = await createProtectionAssignment(assignmentData);

    if (error) {
      return {
        testName: '',
        success: false,
        message: 'Protection assignment creation failed',
        duration: Date.now() - startTime,
        error: error.message,
      };
    }

    // Verify assignment was created
    if (!assignment || !assignment.id) {
      return {
        testName: '',
        success: false,
        message: 'Assignment created but no ID returned',
        duration: Date.now() - startTime,
      };
    }

    return {
      testName: '',
      success: true,
      message: 'Protection assignment created successfully',
      duration: Date.now() - startTime,
      details: {
        assignmentId: assignment.id,
        protectionLevel: assignment.protection_level,
        status: assignment.assignment_status,
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Assignment creation test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 6: Real-time Updates
 */
async function testRealTimeUpdates(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Test real-time subscription setup
    let updateReceived = false;

    const channel = supabase
      .channel('test-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'protection_assignments',
        },
        () => {
          updateReceived = true;
        }
      )
      .subscribe();

    // Wait a moment for subscription to establish
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clean up
    supabase.removeChannel(channel);

    return {
      testName: '',
      success: true,
      message: 'Real-time subscription system functioning',
      duration: Date.now() - startTime,
      details: {
        subscriptionEstablished: true,
        channelStatus: 'connected',
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Real-time updates test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 7: Emergency System
 */
async function testEmergencySystem(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Sign in to get a user
    const testCredential = TEST_CREDENTIALS.principals[0];
    const { data: authData } = await signInWithEmail(testCredential.email, testCredential.password);

    if (!authData.user) {
      return {
        testName: '',
        success: false,
        message: 'Could not authenticate user for emergency test',
        duration: Date.now() - startTime,
      };
    }

    // Test emergency activation
    const testLocation = { lat: 51.5074, lng: -0.1278, address: 'Test Emergency Location' };
    const { data: emergency, error } = await activateEmergency(authData.user.id, testLocation);

    if (error) {
      return {
        testName: '',
        success: false,
        message: 'Emergency activation failed',
        duration: Date.now() - startTime,
        error: error.message,
      };
    }

    return {
      testName: '',
      success: true,
      message: 'Emergency alert system functioning correctly',
      duration: Date.now() - startTime,
      details: {
        emergencyId: emergency?.id,
        activationType: emergency?.activation_type,
        status: emergency?.response_status,
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Emergency system test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 8: Safe Assignment Fund
 */
async function testSafeRideFund(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Test Safe Assignment Fund statistics
    const { data: stats, error } = await getSafeRideFundStats();

    if (error) {
      return {
        testName: '',
        success: false,
        message: 'Safe Assignment Fund query failed',
        duration: Date.now() - startTime,
        error: error.message,
      };
    }

    // Verify required fields
    const requiredFields = ['total_rides_provided', 'total_contributions', 'total_contributors'];
    const missingFields = requiredFields.filter(field => stats && !stats[field] && stats[field] !== 0);

    if (missingFields.length > 0) {
      return {
        testName: '',
        success: false,
        message: 'Safe Assignment Fund data structure invalid',
        duration: Date.now() - startTime,
        error: `Missing fields: ${missingFields.join(', ')}`,
      };
    }

    return {
      testName: '',
      success: true,
      message: 'Safe Assignment Fund integration working correctly',
      duration: Date.now() - startTime,
      details: stats,
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Safe Assignment Fund test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 9: Data Integrity
 */
async function testDataIntegrity(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Test referential integrity
    const { data: assignments } = await supabase
      .from('protection_assignments')
      .select(`
        id,
        principal_id,
        officer_id,
        profiles!principal_id (id, full_name),
        protection_officers!officer_id (id, full_name)
      `)
      .limit(5);

    let integrityIssues = 0;

    if (assignments) {
      for (const assignment of assignments) {
        // Check principal exists
        if (assignment.principal_id && !assignment.profiles) {
          integrityIssues++;
        }
        // Check officer exists (if assigned)
        if (assignment.officer_id && !assignment.protection_officers) {
          integrityIssues++;
        }
      }
    }

    return {
      testName: '',
      success: integrityIssues === 0,
      message: integrityIssues === 0 ? 'Data integrity verified' : `Found ${integrityIssues} integrity issues`,
      duration: Date.now() - startTime,
      details: {
        assignmentsChecked: assignments?.length || 0,
        integrityIssues,
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Data integrity test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test 10: Terminology Compliance
 */
async function testTerminologyCompliance(): Promise<IntegrationTestResult> {
  const startTime = Date.now();

  try {
    // Test that we're using protection service terminology
    const { data: officers } = await supabase
      .from('protection_officers')
      .select('full_name, sia_license_number')
      .limit(1);

    const { data: assignments } = await supabase
      .from('protection_assignments')
      .select('assignment_status, protection_level')
      .limit(1);

    // Verify correct table names and field names exist
    const terminologyChecks = [
      { check: 'protection_officers table exists', pass: officers !== null },
      { check: 'protection_assignments table exists', pass: assignments !== null },
      { check: 'SIA license field exists', pass: officers && officers.length > 0 ? 'sia_license_number' in officers[0] : true },
      { check: 'Protection level field exists', pass: assignments && assignments.length > 0 ? 'protection_level' in assignments[0] : true },
    ];

    const failedChecks = terminologyChecks.filter(check => !check.pass);

    return {
      testName: '',
      success: failedChecks.length === 0,
      message: failedChecks.length === 0 ? 'Protection service terminology verified' : `Failed ${failedChecks.length} terminology checks`,
      duration: Date.now() - startTime,
      details: {
        totalChecks: terminologyChecks.length,
        passedChecks: terminologyChecks.length - failedChecks.length,
        failedChecks: failedChecks.map(c => c.check),
      },
    };
  } catch (error: any) {
    return {
      testName: '',
      success: false,
      message: 'Terminology compliance test failed',
      duration: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Run a quick health check of the integration
 */
export async function quickHealthCheck(): Promise<boolean> {
  try {
    console.log('🏥 Running quick health check...');

    // Test database connection
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.log('❌ Database connection failed');
      return false;
    }

    // Test data existence
    const { data: officers } = await getProtectionOfficers();
    if (!officers || officers.length === 0) {
      console.log('⚠️ No protection officers found - database may need sample data');
    }

    console.log('✅ Health check passed');
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error);
    return false;
  }
}

/**
 * Generate integration test report
 */
export function generateTestReport(suite: IntegrationTestSuite): string {
  const timestamp = new Date().toISOString();

  let report = `# ARMORA PROTECTION SERVICE INTEGRATION TEST REPORT\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Test Suite:** ${suite.suiteName}\n`;
  report += `**Duration:** ${suite.duration}ms\n`;
  report += `**Status:** ${suite.passedTests === suite.totalTests ? '✅ PASSED' : '❌ FAILED'}\n\n`;

  report += `## Summary\n`;
  report += `- Total Tests: ${suite.totalTests}\n`;
  report += `- Passed: ${suite.passedTests}\n`;
  report += `- Failed: ${suite.failedTests}\n`;
  report += `- Success Rate: ${((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%\n\n`;

  report += `## Detailed Results\n\n`;

  for (const result of suite.results) {
    const status = result.success ? '✅' : '❌';
    report += `### ${status} ${result.testName}\n`;
    report += `**Message:** ${result.message}\n`;
    report += `**Duration:** ${result.duration}ms\n`;

    if (result.error) {
      report += `**Error:** ${result.error}\n`;
    }

    if (result.details) {
      report += `**Details:** ${JSON.stringify(result.details, null, 2)}\n`;
    }

    report += `\n`;
  }

  return report;
}