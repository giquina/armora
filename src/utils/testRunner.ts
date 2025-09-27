/**
 * ARMORA PROTECTION SERVICE - TEST RUNNER UTILITY
 * Convenient interface for running all integration tests
 * Version: 1.0.0
 */

import { runMasterTestSuite, quickIntegrationCheck, runTestCategory, getTestEnvironmentStatus } from './masterTestSuite';
import { populateDatabase } from './populateDatabase';

/**
 * Test runner configuration
 */
export interface TestRunnerConfig {
  // Test selection
  runIntegration?: boolean;
  runMobile?: boolean;
  checkTerminology?: boolean;
  runWorkflows?: boolean;
  runPerformance?: boolean;
  runSecurity?: boolean;

  // Database options
  populateData?: boolean;
  clearDataFirst?: boolean;

  // Output options
  generateReports?: boolean;
  saveReports?: boolean;
  outputPath?: string;

  // Environment
  environment?: 'development' | 'staging' | 'production';
  verbose?: boolean;
}

/**
 * Default configuration for different scenarios
 */
export const TEST_CONFIGS = {
  // Full comprehensive test (all tests enabled)
  full: {
    runIntegration: true,
    runMobile: true,
    checkTerminology: true,
    runWorkflows: true,
    runPerformance: true,
    runSecurity: true,
    populateData: true,
    clearDataFirst: false,
    generateReports: true,
    saveReports: true,
    environment: 'development' as const,
    verbose: true,
  },

  // Quick smoke test (essential tests only)
  quick: {
    runIntegration: true,
    runMobile: false,
    checkTerminology: false,
    runWorkflows: false,
    runPerformance: false,
    runSecurity: false,
    populateData: false,
    clearDataFirst: false,
    generateReports: false,
    saveReports: false,
    environment: 'development' as const,
    verbose: false,
  },

  // CI/CD pipeline test (automated deployment validation)
  ci: {
    runIntegration: true,
    runMobile: true,
    checkTerminology: true,
    runWorkflows: true,
    runPerformance: false,
    runSecurity: true,
    populateData: true,
    clearDataFirst: true,
    generateReports: true,
    saveReports: true,
    environment: 'staging' as const,
    verbose: true,
  },

  // Pre-deployment validation
  deployment: {
    runIntegration: true,
    runMobile: true,
    checkTerminology: true,
    runWorkflows: true,
    runPerformance: true,
    runSecurity: true,
    populateData: false,
    clearDataFirst: false,
    generateReports: true,
    saveReports: true,
    environment: 'production' as const,
    verbose: true,
  },

  // Development testing (during feature development)
  dev: {
    runIntegration: true,
    runMobile: false,
    checkTerminology: true,
    runWorkflows: false,
    runPerformance: false,
    runSecurity: false,
    populateData: true,
    clearDataFirst: false,
    generateReports: false,
    saveReports: false,
    environment: 'development' as const,
    verbose: true,
  },
} as const;

/**
 * Main test runner function
 */
export async function runTests(
  configName?: keyof typeof TEST_CONFIGS | TestRunnerConfig,
  customOptions?: Partial<TestRunnerConfig>
): Promise<any> {
  // Determine configuration
  let config: TestRunnerConfig;

  if (typeof configName === 'string') {
    // Use predefined config
    config = { ...TEST_CONFIGS[configName] };
  } else if (configName && typeof configName === 'object') {
    // Use provided config object
    config = configName;
  } else {
    // Use default (full) config
    config = { ...TEST_CONFIGS.full };
  }

  // Apply custom options
  if (customOptions) {
    config = { ...config, ...customOptions };
  }


  // Validate environment first
  await validateTestEnvironment(config);

  // Run the test suite
  const result = await runMasterTestSuite({
    populateData: config.populateData,
    clearDataFirst: config.clearDataFirst,
    testMobile: config.runMobile,
    checkTerminology: config.checkTerminology,
    generateReports: config.generateReports,
  });

  // Save reports if requested
  if (config.saveReports && config.generateReports) {
    await saveTestReports(result, config);
  }

  // Display final summary
  displayFinalSummary(result, config);

  return result;
}

/**
 * Validate test environment before running tests
 */
async function validateTestEnvironment(config: TestRunnerConfig): Promise<void> {

  // Check environment status
  const status = await getTestEnvironmentStatus();


  // Validate critical requirements
  if (status.database !== 'connected') {
    throw new Error('❌ Database not connected - cannot run tests');
  }

  if (config.runIntegration && status.sampleData === 'missing' && !config.populateData) {
  }

}

/**
 * Save test reports to files
 */
async function saveTestReports(result: any, config: TestRunnerConfig): Promise<void> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const basePath = config.outputPath || './test-reports';


    // In a real implementation, you would save these to files
    // For now, just log that we would save them

    if (result.reports.mobile) {
    }

    if (result.reports.terminology) {
    }


  } catch (error: any) {
    console.error(`❌ Failed to save reports: ${error.message}\n`);
  }
}

/**
 * Display final summary
 */
function displayFinalSummary(result: any, config: TestRunnerConfig): void {

  const statusIcon = result.overallStatus === 'PASSED' ? '✅' :
                    result.overallStatus === 'WARNING' ? '⚠️' : '❌';


  if (result.summary.criticalIssues.length > 0) {
  }

  if (result.summary.recommendations.length > 0) {
  }

  // Next steps

}

/**
 * Run quick health check
 */
export async function quickCheck(): Promise<boolean> {

  const result = await quickIntegrationCheck();

  if (result.ready) {
  } else {
  }

  return result.ready;
}

/**
 * Setup test environment
 */
export async function setupTestEnvironment(): Promise<void> {

  const populationResult = await populateDatabase('development');

  if (populationResult.success) {
  } else {
    throw new Error('Test environment setup failed');
  }
}

/**
 * Run specific test category
 */
export async function runSpecificTests(
  category: 'integration' | 'mobile' | 'terminology' | 'workflow' | 'performance' | 'security'
): Promise<any> {
  return await runTestCategory(category);
}

/**
 * Export convenient test functions for CLI usage
 */
export const CLI_COMMANDS = {
  // Run full test suite
  'test:full': () => runTests('full'),

  // Quick tests
  'test:quick': () => runTests('quick'),

  // CI/CD tests
  'test:ci': () => runTests('ci'),

  // Individual test categories
  'test:integration': () => runSpecificTests('integration'),
  'test:mobile': () => runSpecificTests('mobile'),
  'test:terminology': () => runSpecificTests('terminology'),

  // Environment management
  'test:setup': setupTestEnvironment,
  'test:check': quickCheck,

  // Custom configurations
  'test:dev': () => runTests('dev'),
  'test:deployment': () => runTests('deployment'),
} as const;

/**
 * Helper function to run tests from command line arguments
 */
export async function runFromCLI(args: string[]): Promise<void> {
  const command = args[0] || 'test:quick';

  if (command in CLI_COMMANDS) {
    try {
      await CLI_COMMANDS[command as keyof typeof CLI_COMMANDS]();
    } catch (error: any) {
      console.error(`❌ Command '${command}' failed:`, error.message);
      process.exit(1);
    }
  } else {
    console.error(`❌ Unknown command: ${command}`);
    process.exit(1);
  }
}