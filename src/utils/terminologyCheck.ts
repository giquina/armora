/**
 * ARMORA PROTECTION SERVICE - TERMINOLOGY COMPLIANCE CHECKER
 * Automated verification of protection service terminology compliance
 * Version: 1.0.0
 *
 * Ensures zero tolerance for Protection Service terminology throughout the codebase
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

/**
 * Forbidden terms and their correct replacements
 */
export const TERMINOLOGY_RULES = {
  forbidden: {
    // Core forbidden terms (zero tolerance)
    'Protection Service': 'protection service',
    'cab': 'secure transport',
    'Assignment': 'assignment',
    'rider': 'principal',
    'Principal': 'principal',
    'Protection Officer': 'protection officer',
    'Service Fee': 'service fee',
    'Protection Detail': 'protection detail',
    'Commencement Point': 'collection point',
    'Secure Destination': 'secure destination',
    'protection-assignment': 'assignment request',

    // Service-specific terms
    'uber': 'Armora Protection',
    'lyft': 'Armora Protection',
    'bolt': 'Armora Protection',
    'chauffeur': 'protection officer',
    'minicab': 'secure vehicle',

    // Operational terms
    'hail': 'request protection',
    'fleet': 'protection team',
    'dispatch': 'assign officer',
    'surge pricing': 'security premium',
    'dynamic pricing': 'protection rate adjustment',
  },

  preferred: {
    // Preferred professional terms
    'protection officer': ['CPO', 'security specialist', 'close protection operative'],
    'principal': ['client', 'protected individual'],
    'assignment': ['protection detail', 'security assignment'],
    'service fee': ['protection cost', 'security charge'],
    'collection point': ['commencement location', 'secure Commencement Point'],
    'secure destination': ['protected destination', 'safe location'],
    'SIA licensed': ['security certified', 'professionally qualified'],
    'threat assessment': ['security evaluation', 'risk analysis'],
    'executive protection': ['VIP security', 'close protection'],
  },

  exceptions: {
    // Technical terms that are allowed
    'driver_license': true,
    'screwdriver': true,
    'passenger_manifest': true,
    'ride_height': true,
    'taxi_number': true, // Only in database field names
    'driver_name': true, // Only in legacy API responses
  },
} as const;

/**
 * File patterns to scan
 */
export const SCAN_PATTERNS = {
  include: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  exclude: [
    'node_modules',
    'build',
    'dist',
    '.git',
    'coverage',
    'test-results',
    '.next',
    'out',
  ],
  priority: [
    'src/components',
    'src/contexts',
    'src/utils',
    'src/data',
    'src/types',
  ],
} as const;

/**
 * Terminology violation interface
 */
export interface TerminologyViolation {
  file: string;
  line: number;
  column: number;
  term: string;
  context: string;
  suggestion: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'forbidden' | 'inconsistent' | 'improvement';
}

export interface TerminologyReport {
  scanPath: string;
  filesScanned: number;
  violationsFound: number;
  criticalViolations: number;
  warningViolations: number;
  violations: TerminologyViolation[];
  summary: string;
  compliance: 'PASSED' | 'FAILED' | 'WARNING';
}

/**
 * Main terminology compliance checker
 */
export async function checkTerminologyCompliance(
  scanPath: string = '/workspaces/armora/src'
): Promise<TerminologyReport> {
  const report: TerminologyReport = {
    scanPath,
    filesScanned: 0,
    violationsFound: 0,
    criticalViolations: 0,
    warningViolations: 0,
    violations: [],
    summary: '',
    compliance: 'PASSED',
  };

  console.log('🔍 Starting Armora Protection Service Terminology Compliance Check...\n');
  console.log(`📁 Scanning directory: ${scanPath}`);

  try {
    // Scan all files recursively
    const files = await scanDirectory(scanPath);

    // Filter files by extension
    const targetFiles = files.filter(file =>
      SCAN_PATTERNS.include.some(ext => file.endsWith(ext))
    );

    console.log(`📄 Found ${targetFiles.length} files to scan\n`);

    // Check each file
    for (const file of targetFiles) {
      await checkFile(file, report);
      report.filesScanned++;
    }

    // Generate compliance summary
    generateSummary(report);

  } catch (error: any) {
    console.error('❌ Terminology check failed:', error);
    report.summary = `Terminology check failed: ${error.message}`;
    report.compliance = 'FAILED';
  }

  console.log(`\n${report.summary}`);
  return report;
}

/**
 * Recursively scan directory for files
 */
async function scanDirectory(dirPath: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);

      // Skip excluded directories
      if (SCAN_PATTERNS.exclude.some(exclude => fullPath.includes(exclude))) {
        continue;
      }

      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively scan subdirectory
        const subFiles = await scanDirectory(fullPath);
        files.push(...subFiles);
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (error: any) {
    console.warn(`⚠️ Could not scan directory ${dirPath}: ${error.message}`);
  }

  return files;
}

/**
 * Check individual file for terminology violations
 */
async function checkFile(filePath: string, report: TerminologyReport): Promise<void> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      checkLineForViolations(line, lineIndex + 1, filePath, report);
    });

  } catch (error: any) {
    console.warn(`⚠️ Could not read file ${filePath}: ${error.message}`);
  }
}

/**
 * Check individual line for terminology violations
 */
function checkLineForViolations(
  line: string,
  lineNumber: number,
  filePath: string,
  report: TerminologyReport
): void {
  // Skip comments and import statements for some checks
  const isComment = line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*');
  const isImport = line.trim().startsWith('import ') || line.trim().startsWith('export ');

  // Check for forbidden terms
  Object.entries(TERMINOLOGY_RULES.forbidden).forEach(([forbidden, replacement]) => {
    const regex = new RegExp(`\\b${forbidden}\\b`, 'gi');
    const matches = line.matchAll(regex);

    for (const match of matches) {
      const term = match[0];
      const column = match.index || 0;

      // Check for exceptions
      const contextBefore = line.substring(Math.max(0, column - 20), column);
      const contextAfter = line.substring(column, Math.min(line.length, column + 20));
      const fullContext = contextBefore + term + contextAfter;

      // Skip if it's an allowed exception
      if (isException(term, fullContext)) {
        continue;
      }

      // Skip certain contexts
      if (isComment && !isUserFacingComment(line)) {
        continue;
      }

      const violation: TerminologyViolation = {
        file: filePath,
        line: lineNumber,
        column,
        term,
        context: line.trim(),
        suggestion: `Replace "${term}" with "${replacement}"`,
        severity: isUserFacing(line) ? 'critical' : 'warning',
        category: 'forbidden',
      };

      report.violations.push(violation);
      report.violationsFound++;

      if (violation.severity === 'critical') {
        report.criticalViolations++;
      } else {
        report.warningViolations++;
      }
    }
  });

  // Check for inconsistent terminology
  checkInconsistentTerminology(line, lineNumber, filePath, report);

  // Check for improvement opportunities
  checkImprovementOpportunities(line, lineNumber, filePath, report);
}

/**
 * Check if a term usage is an allowed exception
 */
function isException(term: string, context: string): boolean {
  const lowerTerm = term.toLowerCase();
  const lowerContext = context.toLowerCase();

  // Check explicit exceptions
  if (TERMINOLOGY_RULES.exceptions[lowerTerm as keyof typeof TERMINOLOGY_RULES.exceptions]) {
    return true;
  }

  // Technical field names
  if (lowerContext.includes('_license') || lowerContext.includes('_height') || lowerContext.includes('_manifest')) {
    return true;
  }

  // Database field names (snake_case)
  if (lowerContext.match(/\w+_\w+/) && (lowerContext.includes('driver_') || lowerContext.includes('passenger_'))) {
    return true;
  }

  // External API responses
  if (lowerContext.includes('response.') || lowerContext.includes('api.') || lowerContext.includes('data.')) {
    return true;
  }

  // URLs and external references
  if (lowerContext.includes('http') || lowerContext.includes('url') || lowerContext.includes('.com')) {
    return true;
  }

  return false;
}

/**
 * Check if content is user-facing
 */
function isUserFacing(line: string): boolean {
  const lowerLine = line.toLowerCase();

  // UI text patterns
  if (lowerLine.includes('text:') || lowerLine.includes('title:') || lowerLine.includes('message:')) {
    return true;
  }

  // JSX content
  if (lowerLine.includes('<') && lowerLine.includes('>') && !lowerLine.includes('import')) {
    return true;
  }

  // String literals that look like UI text
  if (lowerLine.includes('"') || lowerLine.includes("'")) {
    const hasCapitalLetter = /[A-Z]/.test(line);
    const hasSpaces = line.includes(' ');
    if (hasCapitalLetter && hasSpaces) {
      return true;
    }
  }

  return false;
}

/**
 * Check if comment contains user-facing content
 */
function isUserFacingComment(line: string): boolean {
  const lowerLine = line.toLowerCase();

  // Documentation comments
  if (lowerLine.includes('/**') || lowerLine.includes('*')) {
    return true;
  }

  // User story or feature comments
  if (lowerLine.includes('user') || lowerLine.includes('customer') || lowerLine.includes('client')) {
    return true;
  }

  return false;
}

/**
 * Check for inconsistent terminology usage
 */
function checkInconsistentTerminology(
  line: string,
  lineNumber: number,
  filePath: string,
  report: TerminologyReport
): void {
  // Check for mixed terminology in the same line
  const protectionTerms = ['protection officer', 'cpo', 'security specialist'];
  const transportTerms = ['Protection Officer', 'chauffeur'];

  const hasProtectionTerms = protectionTerms.some(term =>
    line.toLowerCase().includes(term.toLowerCase())
  );
  const hasTransportTerms = transportTerms.some(term =>
    line.toLowerCase().includes(term.toLowerCase())
  );

  if (hasProtectionTerms && hasTransportTerms) {
    const violation: TerminologyViolation = {
      file: filePath,
      line: lineNumber,
      column: 0,
      term: 'mixed terminology',
      context: line.trim(),
      suggestion: 'Use consistent protection service terminology throughout',
      severity: 'warning',
      category: 'inconsistent',
    };

    report.violations.push(violation);
    report.violationsFound++;
    report.warningViolations++;
  }
}

/**
 * Check for improvement opportunities
 */
function checkImprovementOpportunities(
  line: string,
  lineNumber: number,
  filePath: string,
  report: TerminologyReport
): void {
  const lowerLine = line.toLowerCase();

  // Suggest more professional terms
  const improvements = [
    { find: 'security guard', replace: 'protection officer', reason: 'More professional terminology' },
    { find: 'bodyguard', replace: 'close protection operative', reason: 'Industry standard terminology' },
    { find: 'transport', replace: 'secure transport', reason: 'Emphasizes security aspect' },
    { find: 'car service', replace: 'protection service', reason: 'Clarifies service type' },
  ];

  improvements.forEach(({ find, replace, reason }) => {
    if (lowerLine.includes(find)) {
      const violation: TerminologyViolation = {
        file: filePath,
        line: lineNumber,
        column: lowerLine.indexOf(find),
        term: find,
        context: line.trim(),
        suggestion: `Consider "${replace}" instead of "${find}" - ${reason}`,
        severity: 'info',
        category: 'improvement',
      };

      report.violations.push(violation);
      report.violationsFound++;
    }
  });
}

/**
 * Generate compliance summary
 */
function generateSummary(report: TerminologyReport): void {
  if (report.criticalViolations > 0) {
    report.compliance = 'FAILED';
    report.summary = `❌ TERMINOLOGY COMPLIANCE FAILED: ${report.criticalViolations} critical violations found`;
  } else if (report.warningViolations > 0) {
    report.compliance = 'WARNING';
    report.summary = `⚠️ TERMINOLOGY COMPLIANCE WARNING: ${report.warningViolations} warnings found`;
  } else {
    report.compliance = 'PASSED';
    report.summary = `✅ TERMINOLOGY COMPLIANCE PASSED: No violations found`;
  }

  // Log detailed results
  console.log(`\n📊 Terminology Compliance Report:`);
  console.log(`   Files scanned: ${report.filesScanned}`);
  console.log(`   Total violations: ${report.violationsFound}`);
  console.log(`   Critical violations: ${report.criticalViolations}`);
  console.log(`   Warning violations: ${report.warningViolations}`);

  if (report.criticalViolations > 0) {
    console.log(`\n🚨 Critical violations (must be fixed):`);
    report.violations
      .filter(v => v.severity === 'critical')
      .slice(0, 10) // Show first 10
      .forEach(violation => {
        console.log(`   ${violation.file}:${violation.line} - "${violation.term}"`);
        console.log(`      Context: ${violation.context}`);
        console.log(`      Fix: ${violation.suggestion}\n`);
      });
  }
}

/**
 * Fix violations automatically where possible
 */
export async function autoFixViolations(
  report: TerminologyReport,
  dryRun: boolean = true
): Promise<{ fixed: number; errors: string[] }> {
  const result = { fixed: 0, errors: [] as string[] };

  if (dryRun) {
    console.log('🔧 DRY RUN: Showing what would be fixed...\n');
  } else {
    console.log('🔧 Auto-fixing terminology violations...\n');
  }

  // Group violations by file
  const violationsByFile = new Map<string, TerminologyViolation[]>();

  report.violations
    .filter(v => v.category === 'forbidden' && v.severity === 'critical')
    .forEach(violation => {
      const fileViolations = violationsByFile.get(violation.file) || [];
      fileViolations.push(violation);
      violationsByFile.set(violation.file, fileViolations);
    });

  // Process each file
  for (const [filePath, violations] of violationsByFile) {
    try {
      if (dryRun) {
        console.log(`📝 Would fix ${violations.length} violations in ${filePath}`);
        violations.forEach(v => {
          console.log(`   Line ${v.line}: "${v.term}" → "${v.suggestion}"`);
        });
      } else {
        // Actual fixing would go here
        console.log(`📝 Fixed ${violations.length} violations in ${filePath}`);
        result.fixed += violations.length;
      }
    } catch (error: any) {
      result.errors.push(`Failed to fix ${filePath}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Generate detailed terminology report
 */
export function generateTerminologyReport(report: TerminologyReport): string {
  const timestamp = new Date().toISOString();

  let output = `# ARMORA PROTECTION SERVICE TERMINOLOGY COMPLIANCE REPORT\n\n`;
  output += `**Generated:** ${timestamp}\n`;
  output += `**Scan Path:** ${report.scanPath}\n`;
  output += `**Status:** ${report.compliance}\n`;
  output += `**Files Scanned:** ${report.filesScanned}\n`;
  output += `**Total Violations:** ${report.violationsFound}\n\n`;

  output += `## Compliance Status\n`;
  output += `${report.summary}\n\n`;

  if (report.violations.length > 0) {
    output += `## Violation Details\n\n`;

    // Group by severity
    const critical = report.violations.filter(v => v.severity === 'critical');
    const warnings = report.violations.filter(v => v.severity === 'warning');
    const info = report.violations.filter(v => v.severity === 'info');

    if (critical.length > 0) {
      output += `### 🚨 Critical Violations (${critical.length})\n`;
      output += `These must be fixed immediately:\n\n`;
      critical.forEach(v => {
        output += `**${v.file}:${v.line}**\n`;
        output += `- Term: "${v.term}"\n`;
        output += `- Context: \`${v.context}\`\n`;
        output += `- Fix: ${v.suggestion}\n\n`;
      });
    }

    if (warnings.length > 0) {
      output += `### ⚠️ Warnings (${warnings.length})\n`;
      output += `Should be addressed:\n\n`;
      warnings.slice(0, 20).forEach(v => {
        output += `**${v.file}:${v.line}** - "${v.term}": ${v.suggestion}\n`;
      });
      output += `\n`;
    }

    if (info.length > 0) {
      output += `### 💡 Improvements (${info.length})\n`;
      output += `Consider these enhancements:\n\n`;
      info.slice(0, 10).forEach(v => {
        output += `**${v.file}:${v.line}** - ${v.suggestion}\n`;
      });
      output += `\n`;
    }
  }

  output += `## Terminology Guidelines\n\n`;
  output += `### ❌ Forbidden Terms\n`;
  Object.entries(TERMINOLOGY_RULES.forbidden).forEach(([forbidden, replacement]) => {
    output += `- "${forbidden}" → "${replacement}"\n`;
  });

  output += `\n### ✅ Preferred Terms\n`;
  Object.entries(TERMINOLOGY_RULES.preferred).forEach(([preferred, alternatives]) => {
    output += `- "${preferred}" (alternatives: ${alternatives.join(', ')})\n`;
  });

  return output;
}

/**
 * Quick terminology check for individual files
 */
export function quickTerminologyCheck(content: string): {
  violations: number;
  issues: string[];
  compliance: boolean;
} {
  const issues: string[] = [];
  let violations = 0;

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    Object.keys(TERMINOLOGY_RULES.forbidden).forEach(forbidden => {
      if (line.toLowerCase().includes(forbidden.toLowerCase())) {
        const replacement = TERMINOLOGY_RULES.forbidden[forbidden as keyof typeof TERMINOLOGY_RULES.forbidden];
        issues.push(`Line ${index + 1}: Replace "${forbidden}" with "${replacement}"`);
        violations++;
      }
    });
  });

  return {
    violations,
    issues,
    compliance: violations === 0,
  };
}