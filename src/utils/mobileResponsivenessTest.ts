/**
 * ARMORA PROTECTION SERVICE - MOBILE RESPONSIVENESS VERIFICATION
 * Automated testing for mobile-first design compliance at 320px minimum
 * Version: 1.0.0
 */

/**
 * Mobile test configuration
 */
export const MOBILE_TEST_CONFIG = {
  minWidth: 320,
  maxWidth: 768,
  touchTargetSize: 44,
  testViewports: [
    { name: 'iPhone SE', width: 320, height: 568 },
    { name: 'iPhone 12/13', width: 390, height: 844 },
    { name: 'Samsung Galaxy S8', width: 360, height: 740 },
    { name: 'iPad Mini', width: 768, height: 1024 },
  ],
  criticalElements: [
    'button',
    'input',
    'select',
    'textarea',
    '.card',
    '.service-card',
    '.protection-status',
    '.protection assignment-interface',
    '.navigation-item',
    '.panic-button',
  ],
} as const;

export interface MobileTestResult {
  testName: string;
  viewport: { name: string; width: number; height: number };
  success: boolean;
  issues: string[];
  warnings: string[];
  details: any;
}

export interface MobileTestSuite {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: MobileTestResult[];
  summary: string;
}

/**
 * Main mobile responsiveness test runner
 */
export async function runMobileResponsivenessTests(): Promise<MobileTestSuite> {
  const suite: MobileTestSuite = {
    suiteName: 'Armora Protection Service Mobile Responsiveness Tests',
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    results: [],
    summary: '',
  };

  console.log('📱 Starting Mobile Responsiveness Tests...\n');

  // Test each viewport
  for (const viewport of MOBILE_TEST_CONFIG.testViewports) {
    await testViewport(suite, viewport);
  }

  // Calculate summary
  suite.summary = `Mobile Tests ${suite.passedTests === suite.totalTests ? '✅ PASSED' : '❌ FAILED'}: ${suite.passedTests}/${suite.totalTests} viewports passed`;

  console.log(`\n${suite.summary}`);
  return suite;
}

/**
 * Test a specific viewport
 */
async function testViewport(
  suite: MobileTestSuite,
  viewport: { name: string; width: number; height: number }
): Promise<void> {
  suite.totalTests++;

  console.log(`📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

  const result: MobileTestResult = {
    testName: `Mobile Responsiveness - ${viewport.name}`,
    viewport,
    success: true,
    issues: [],
    warnings: [],
    details: {},
  };

  try {
    // Set viewport size
    setViewportSize(viewport.width, viewport.height);

    // Test 1: No horizontal scrolling
    const horizontalScrollIssues = checkHorizontalScrolling();
    if (horizontalScrollIssues.length > 0) {
      result.issues.push(...horizontalScrollIssues);
      result.success = false;
    }

    // Test 2: Touch target sizes
    const touchTargetIssues = checkTouchTargetSizes();
    if (touchTargetIssues.length > 0) {
      result.issues.push(...touchTargetIssues);
      result.success = false;
    }

    // Test 3: Text readability
    const readabilityIssues = checkTextReadability();
    if (readabilityIssues.length > 0) {
      result.warnings.push(...readabilityIssues);
    }

    // Test 4: Critical element visibility
    const visibilityIssues = checkCriticalElementVisibility();
    if (visibilityIssues.length > 0) {
      result.issues.push(...visibilityIssues);
      result.success = false;
    }

    // Test 5: Navigation accessibility
    const navigationIssues = checkNavigationAccessibility();
    if (navigationIssues.length > 0) {
      result.issues.push(...navigationIssues);
      result.success = false;
    }

    // Test 6: Content reflow
    const reflowIssues = checkContentReflow();
    if (reflowIssues.length > 0) {
      result.warnings.push(...reflowIssues);
    }

    // Collect performance metrics
    result.details = collectMobileMetrics();

    if (result.success) {
      suite.passedTests++;
      console.log(`   ✅ ${viewport.name} responsive design verified`);
    } else {
      suite.failedTests++;
      console.log(`   ❌ ${viewport.name} has ${result.issues.length} critical issues`);
      result.issues.forEach(issue => console.log(`      • ${issue}`));
    }

    if (result.warnings.length > 0) {
      console.log(`   ⚠️ ${result.warnings.length} warnings:`);
      result.warnings.forEach(warning => console.log(`      • ${warning}`));
    }

  } catch (error: any) {
    result.success = false;
    result.issues.push(`Test execution failed: ${error.message}`);
    suite.failedTests++;
    console.log(`   ❌ Test failed: ${error.message}`);
  }

  suite.results.push(result);
  console.log('');
}

/**
 * Set viewport size for testing
 */
function setViewportSize(width: number, height: number): void {
  if (typeof window !== 'undefined') {
    // In a real browser environment, we would resize the window
    // For testing purposes, we simulate this by setting CSS viewport meta
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', `width=${width}, initial-scale=1.0`);
    }

    // Apply CSS to simulate viewport
    document.documentElement.style.width = `${width}px`;
    document.documentElement.style.height = `${height}px`;
  }
}

/**
 * Check for horizontal scrolling issues
 */
function checkHorizontalScrolling(): string[] {
  const issues: string[] = [];

  if (typeof window === 'undefined') {
    return ['Cannot test horizontal scrolling - no window object'];
  }

  try {
    // Check if page width exceeds viewport
    const bodyWidth = document.body.scrollWidth;
    const viewportWidth = window.innerWidth;

    if (bodyWidth > viewportWidth) {
      issues.push(`Horizontal scrolling detected: body width ${bodyWidth}px exceeds viewport ${viewportWidth}px`);
    }

    // Check for specific elements that might cause overflow
    const wideElements = document.querySelectorAll('*');
    wideElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width > viewportWidth) {
        const tagName = element.tagName.toLowerCase();
        const className = element.className;
        issues.push(`Element ${tagName}${className ? '.' + className.split(' ')[0] : ''} exceeds viewport width`);
      }
    });

  } catch (error: any) {
    issues.push(`Horizontal scroll check failed: ${error.message}`);
  }

  return issues;
}

/**
 * Check touch target sizes meet minimum requirements
 */
function checkTouchTargetSizes(): string[] {
  const issues: string[] = [];

  if (typeof window === 'undefined') {
    return ['Cannot test touch targets - no window object'];
  }

  try {
    const touchElements = document.querySelectorAll(
      'button, input, select, textarea, a, [role="button"], [onclick], .card, .service-card'
    );

    touchElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const minSize = MOBILE_TEST_CONFIG.touchTargetSize;

      if (rect.width < minSize || rect.height < minSize) {
        const tagName = element.tagName.toLowerCase();
        const className = element.className;
        issues.push(
          `Touch target ${tagName}${className ? '.' + className.split(' ')[0] : ''} too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum: ${minSize}px)`
        );
      }
    });

  } catch (error: any) {
    issues.push(`Touch target check failed: ${error.message}`);
  }

  return issues;
}

/**
 * Check text readability on mobile
 */
function checkTextReadability(): string[] {
  const warnings: string[] = [];

  if (typeof window === 'undefined') {
    return ['Cannot test text readability - no window object'];
  }

  try {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, input, label');

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight);

      // Check minimum font size (14px for body text, 16px for input)
      const tagName = element.tagName.toLowerCase();
      const minFontSize = ['input', 'select', 'textarea'].includes(tagName) ? 16 : 14;

      if (fontSize < minFontSize) {
        warnings.push(`Text in ${tagName} too small: ${fontSize}px (minimum: ${minFontSize}px)`);
      }

      // Check line height for readability
      if (lineHeight && lineHeight < fontSize * 1.2) {
        warnings.push(`Line height too small in ${tagName}: ${lineHeight}px (should be at least ${fontSize * 1.2}px)`);
      }
    });

  } catch (error: any) {
    warnings.push(`Text readability check failed: ${error.message}`);
  }

  return warnings;
}

/**
 * Check critical elements are visible and accessible
 */
function checkCriticalElementVisibility(): string[] {
  const issues: string[] = [];

  if (typeof window === 'undefined') {
    return ['Cannot test element visibility - no window object'];
  }

  try {
    MOBILE_TEST_CONFIG.criticalElements.forEach((selector) => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);

        // Check if element is visible
        if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
          return; // Skip hidden elements
        }

        // Check if element is within viewport
        if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
          issues.push(`Critical element ${selector} is outside viewport bounds`);
        }

        // Check if element has minimum size
        if (rect.width < 20 || rect.height < 20) {
          issues.push(`Critical element ${selector} is too small to interact with`);
        }
      });
    });

  } catch (error: any) {
    issues.push(`Element visibility check failed: ${error.message}`);
  }

  return issues;
}

/**
 * Check navigation accessibility on mobile
 */
function checkNavigationAccessibility(): string[] {
  const issues: string[] = [];

  if (typeof window === 'undefined') {
    return ['Cannot test navigation - no window object'];
  }

  try {
    // Check for mobile navigation menu
    const mobileMenu = document.querySelector('.mobile-menu, .hamburger-menu, .nav-toggle');
    const navigationItems = document.querySelectorAll('nav a, .nav-item, .navigation-item');

    if (navigationItems.length > 3 && !mobileMenu) {
      issues.push('Multiple navigation items found but no mobile menu toggle detected');
    }

    // Check navigation item spacing
    navigationItems.forEach((item, index) => {
      if (index > 0) {
        const rect = item.getBoundingClientRect();
        const prevRect = navigationItems[index - 1].getBoundingClientRect();
        const spacing = rect.left - prevRect.right;

        if (spacing < 8) {
          issues.push('Navigation items too close together for touch interaction');
        }
      }
    });

    // Check for footer navigation visibility
    const footer = document.querySelector('footer, .footer, .bottom-navigation');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.bottom > window.innerHeight + 50) {
        issues.push('Footer navigation not easily accessible on mobile');
      }
    }

  } catch (error: any) {
    issues.push(`Navigation accessibility check failed: ${error.message}`);
  }

  return issues;
}

/**
 * Check content reflow and layout issues
 */
function checkContentReflow(): string[] {
  const warnings: string[] = [];

  if (typeof window === 'undefined') {
    return ['Cannot test content reflow - no window object'];
  }

  try {
    // Check for fixed width elements that might cause issues
    const fixedWidthElements = document.querySelectorAll('*');

    fixedWidthElements.forEach((element) => {
      const styles = window.getComputedStyle(element);

      // Check for fixed pixel widths
      if (styles.width && styles.width.endsWith('px')) {
        const width = parseFloat(styles.width);
        if (width > window.innerWidth * 0.9) {
          warnings.push(`Element has fixed width ${width}px that may cause reflow issues`);
        }
      }

      // Check for absolute positioning that might overlap
      if (styles.position === 'absolute' || styles.position === 'fixed') {
        const rect = element.getBoundingClientRect();
        if (rect.left < 0 || rect.right > window.innerWidth) {
          warnings.push('Absolutely positioned element extends beyond viewport');
        }
      }
    });

  } catch (error: any) {
    warnings.push(`Content reflow check failed: ${error.message}`);
  }

  return warnings;
}

/**
 * Collect mobile performance metrics
 */
function collectMobileMetrics(): any {
  if (typeof window === 'undefined') {
    return { error: 'No window object available' };
  }

  try {
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      touchSupported: 'ontouchstart' in window,
      elementsCount: document.querySelectorAll('*').length,
      imagesCount: document.querySelectorAll('img').length,
      buttonsCount: document.querySelectorAll('button').length,
      linksCount: document.querySelectorAll('a').length,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Test specific component for mobile compatibility
 */
export async function testComponentMobileCompatibility(
  componentSelector: string,
  customTests?: Array<(element: Element) => string[]>
): Promise<{ success: boolean; issues: string[]; warnings: string[] }> {
  const result = {
    success: true,
    issues: [] as string[],
    warnings: [] as string[],
  };

  if (typeof window === 'undefined') {
    result.issues.push('Cannot test component - no window object');
    result.success = false;
    return result;
  }

  try {
    const component = document.querySelector(componentSelector);
    if (!component) {
      result.issues.push(`Component ${componentSelector} not found`);
      result.success = false;
      return result;
    }

    // Run standard tests
    const rect = component.getBoundingClientRect();

    // Check component width
    if (rect.width > window.innerWidth) {
      result.issues.push(`Component width ${rect.width}px exceeds viewport ${window.innerWidth}px`);
      result.success = false;
    }

    // Check touch targets within component
    const touchElements = component.querySelectorAll('button, input, select, textarea, a, [role="button"]');
    touchElements.forEach((element) => {
      const touchRect = element.getBoundingClientRect();
      if (touchRect.width < 44 || touchRect.height < 44) {
        result.warnings.push(`Touch target in component too small: ${Math.round(touchRect.width)}x${Math.round(touchRect.height)}px`);
      }
    });

    // Run custom tests if provided
    if (customTests) {
      customTests.forEach((test) => {
        const testResults = test(component);
        result.issues.push(...testResults);
        if (testResults.length > 0) {
          result.success = false;
        }
      });
    }

  } catch (error: any) {
    result.issues.push(`Component test failed: ${error.message}`);
    result.success = false;
  }

  return result;
}

/**
 * Generate mobile responsiveness report
 */
export function generateMobileReport(suite: MobileTestSuite): string {
  const timestamp = new Date().toISOString();

  let report = `# ARMORA PROTECTION SERVICE MOBILE RESPONSIVENESS REPORT\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Test Suite:** ${suite.suiteName}\n`;
  report += `**Status:** ${suite.passedTests === suite.totalTests ? '✅ PASSED' : '❌ FAILED'}\n\n`;

  report += `## Summary\n`;
  report += `- Total Viewports Tested: ${suite.totalTests}\n`;
  report += `- Passed: ${suite.passedTests}\n`;
  report += `- Failed: ${suite.failedTests}\n`;
  report += `- Success Rate: ${((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%\n\n`;

  report += `## Mobile Design Requirements\n`;
  report += `- Minimum Width Support: ${MOBILE_TEST_CONFIG.minWidth}px\n`;
  report += `- Touch Target Size: ${MOBILE_TEST_CONFIG.touchTargetSize}px minimum\n`;
  report += `- No Horizontal Scrolling Required\n`;
  report += `- Professional Protection Service Terminology\n\n`;

  report += `## Viewport Test Results\n\n`;

  for (const result of suite.results) {
    const status = result.success ? '✅' : '❌';
    report += `### ${status} ${result.viewport.name} (${result.viewport.width}x${result.viewport.height})\n`;

    if (result.issues.length > 0) {
      report += `**Critical Issues:**\n`;
      result.issues.forEach(issue => report += `- ${issue}\n`);
      report += `\n`;
    }

    if (result.warnings.length > 0) {
      report += `**Warnings:**\n`;
      result.warnings.forEach(warning => report += `- ${warning}\n`);
      report += `\n`;
    }

    if (result.details && Object.keys(result.details).length > 0) {
      report += `**Metrics:**\n`;
      Object.entries(result.details).forEach(([key, value]) => {
        report += `- ${key}: ${value}\n`;
      });
      report += `\n`;
    }
  }

  return report;
}

/**
 * Quick mobile compatibility check
 */
export function quickMobileCheck(): { mobile: boolean; issues: string[] } {
  const issues: string[] = [];

  if (typeof window === 'undefined') {
    return { mobile: false, issues: ['No window object - cannot test mobile compatibility'] };
  }

  try {
    // Check viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      issues.push('Missing viewport meta tag');
    }

    // Check if design is responsive
    const isResponsive = window.innerWidth <= 768;
    if (!isResponsive) {
      issues.push('Not currently in mobile viewport');
    }

    // Check for horizontal scrolling
    const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
    if (hasHorizontalScroll) {
      issues.push('Horizontal scrolling detected');
    }

    return {
      mobile: isResponsive && !hasHorizontalScroll,
      issues,
    };

  } catch (error: any) {
    return {
      mobile: false,
      issues: [`Mobile check failed: ${error.message}`],
    };
  }
}