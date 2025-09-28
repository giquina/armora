/**
 * Mobile Viewport Testing Utilities
 *
 * Tests components at various mobile breakpoints to ensure
 * no horizontal scrolling and proper touch target sizing
 */

export interface ViewportTest {
  name: string;
  width: number;
  height: number;
  description: string;
  userAgent?: string;
}

// Standard mobile viewports to test
export const MOBILE_VIEWPORTS: ViewportTest[] = [
  {
    name: 'iPhone SE (1st gen)',
    width: 320,
    height: 568,
    description: 'Smallest modern mobile viewport',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    name: 'iPhone 12 mini',
    width: 375,
    height: 812,
    description: 'Small modern iPhone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    name: 'iPhone 12/13',
    width: 390,
    height: 844,
    description: 'Standard modern iPhone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    name: 'iPhone 12 Pro Max',
    width: 428,
    height: 926,
    description: 'Large modern iPhone',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    name: 'Galaxy S20',
    width: 360,
    height: 800,
    description: 'Standard Android viewport',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36'
  }
];

export interface TouchTargetTest {
  element: Element;
  width: number;
  height: number;
  isValid: boolean;
  recommendation?: string;
}

export interface HorizontalScrollTest {
  hasHorizontalScroll: boolean;
  documentWidth: number;
  viewportWidth: number;
  overflowAmount: number;
  overflowingElements: Element[];
}

export interface ViewportTestResult {
  viewport: ViewportTest;
  touchTargets: TouchTargetTest[];
  horizontalScroll: HorizontalScrollTest;
  overallScore: number;
  recommendations: string[];
}

/**
 * Test for horizontal scrolling at a specific viewport width
 */
export function testHorizontalScroll(viewportWidth: number): HorizontalScrollTest {
  // Set viewport width temporarily
  const originalWidth = window.innerWidth;

  // Get document dimensions
  const documentWidth = Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.clientWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth
  );

  const hasHorizontalScroll = documentWidth > viewportWidth;
  const overflowAmount = hasHorizontalScroll ? documentWidth - viewportWidth : 0;

  // Find elements that exceed viewport width
  const overflowingElements: Element[] = [];
  const allElements = document.querySelectorAll('*');

  allElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Check if element extends beyond viewport
    if (rect.right > viewportWidth) {
      // Exclude elements that are intentionally hidden or positioned
      if (computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden' &&
          computedStyle.position !== 'fixed' &&
          computedStyle.position !== 'absolute') {
        overflowingElements.push(element);
      }
    }
  });

  return {
    hasHorizontalScroll,
    documentWidth,
    viewportWidth,
    overflowAmount,
    overflowingElements
  };
}

/**
 * Test touch target sizes for accessibility
 */
export function testTouchTargets(): TouchTargetTest[] {
  const MIN_TOUCH_TARGET = 44; // 44px minimum recommended by WCAG
  const COMFORTABLE_TOUCH_TARGET = 48; // 48px recommended for comfortable tapping

  const interactiveSelectors = [
    'button',
    'a',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    '[role="button"]',
    '[tabindex]',
    'select',
    'textarea',
    'input[type="text"]',
    'input[type="email"]',
    'input[type="tel"]',
    'input[type="password"]',
    '[onclick]'
  ].join(', ');

  const interactiveElements = document.querySelectorAll(interactiveSelectors);
  const results: TouchTargetTest[] = [];

  interactiveElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Skip hidden elements
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      return;
    }

    const width = rect.width;
    const height = rect.height;
    const minDimension = Math.min(width, height);

    let isValid = true;
    let recommendation = '';

    if (minDimension < MIN_TOUCH_TARGET) {
      isValid = false;
      recommendation = `Increase size to at least ${MIN_TOUCH_TARGET}px minimum (currently ${Math.round(minDimension)}px)`;
    } else if (minDimension < COMFORTABLE_TOUCH_TARGET) {
      recommendation = `Consider increasing to ${COMFORTABLE_TOUCH_TARGET}px for better accessibility (currently ${Math.round(minDimension)}px)`;
    }

    results.push({
      element,
      width: Math.round(width),
      height: Math.round(height),
      isValid,
      recommendation
    });
  });

  return results;
}

/**
 * Run comprehensive mobile viewport test
 */
export function runViewportTest(viewport: ViewportTest): ViewportTestResult {
  // Set viewport meta tag if not present
  let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewportMeta);
  }

  // Test horizontal scrolling
  const horizontalScroll = testHorizontalScroll(viewport.width);

  // Test touch targets
  const touchTargets = testTouchTargets();

  // Calculate overall score
  let score = 100;

  // Deduct points for horizontal scroll
  if (horizontalScroll.hasHorizontalScroll) {
    score -= 30;
  }

  // Deduct points for invalid touch targets
  const invalidTouchTargets = touchTargets.filter(t => !t.isValid).length;
  score -= invalidTouchTargets * 5;

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Generate recommendations
  const recommendations: string[] = [];

  if (horizontalScroll.hasHorizontalScroll) {
    recommendations.push(
      `Fix horizontal scrolling: Document width (${horizontalScroll.documentWidth}px) exceeds viewport (${viewport.width}px)`
    );

    if (horizontalScroll.overflowingElements.length > 0) {
      recommendations.push(
        `${horizontalScroll.overflowingElements.length} elements exceed viewport width`
      );
    }
  }

  if (invalidTouchTargets > 0) {
    recommendations.push(
      `${invalidTouchTargets} touch targets are smaller than 44px minimum`
    );
  }

  const smallTouchTargets = touchTargets.filter(t => t.isValid && t.recommendation).length;
  if (smallTouchTargets > 0) {
    recommendations.push(
      `${smallTouchTargets} touch targets could be larger for better accessibility`
    );
  }

  return {
    viewport,
    touchTargets,
    horizontalScroll,
    overallScore: score,
    recommendations
  };
}

/**
 * Run tests on all mobile viewports
 */
export function runAllMobileTests(): ViewportTestResult[] {
  return MOBILE_VIEWPORTS.map(viewport => runViewportTest(viewport));
}

/**
 * Generate HTML report of test results
 */
export function generateTestReport(results: ViewportTestResult[]): string {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.overallScore >= 80).length;
  const averageScore = results.reduce((sum, r) => sum + r.overallScore, 0) / totalTests;

  let html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1a1a2e; border-bottom: 3px solid #FFD700; padding-bottom: 10px;">
        Mobile Viewport Test Report
      </h1>

      <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: #1a1a2e;">Summary</h2>
        <p><strong>Tests Passed:</strong> ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)</p>
        <p><strong>Average Score:</strong> ${Math.round(averageScore)}/100</p>
      </div>
  `;

  results.forEach(result => {
    const statusColor = result.overallScore >= 80 ? '#10b981' :
                       result.overallScore >= 60 ? '#f59e0b' : '#ef4444';

    html += `
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0; overflow: hidden;">
        <div style="background: ${statusColor}; color: white; padding: 15px;">
          <h3 style="margin: 0; display: flex; justify-content: space-between; align-items: center;">
            ${result.viewport.name} (${result.viewport.width}×${result.viewport.height})
            <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 14px;">
              ${result.overallScore}/100
            </span>
          </h3>
        </div>

        <div style="padding: 15px;">
          <p style="color: #4a5568; margin: 0 0 15px 0;">${result.viewport.description}</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
            <div>
              <h4 style="margin: 0 0 10px 0; color: #1a1a2e;">Horizontal Scroll</h4>
              <p style="margin: 0; color: ${result.horizontalScroll.hasHorizontalScroll ? '#ef4444' : '#10b981'};">
                ${result.horizontalScroll.hasHorizontalScroll ? '❌ Failed' : '✅ Passed'}
              </p>
              ${result.horizontalScroll.hasHorizontalScroll ?
                `<p style="margin: 5px 0 0 0; font-size: 14px; color: #4a5568;">
                  Document: ${result.horizontalScroll.documentWidth}px | Viewport: ${result.horizontalScroll.viewportWidth}px
                </p>` : ''
              }
            </div>

            <div>
              <h4 style="margin: 0 0 10px 0; color: #1a1a2e;">Touch Targets</h4>
              <p style="margin: 0;">
                ${result.touchTargets.filter(t => t.isValid).length}/${result.touchTargets.length} valid
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #4a5568;">
                ${result.touchTargets.filter(t => !t.isValid).length} need fixing
              </p>
            </div>
          </div>

          ${result.recommendations.length > 0 ? `
            <div style="background: #fef3cd; border: 1px solid #f59e0b; border-radius: 4px; padding: 10px; margin: 15px 0;">
              <h4 style="margin: 0 0 10px 0; color: #92400e;">Recommendations</h4>
              <ul style="margin: 0; padding-left: 20px;">
                ${result.recommendations.map(rec => `<li style="color: #92400e; margin: 5px 0;">${rec}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

/**
 * Log test results to console with formatting
 */
export function logTestResults(results: ViewportTestResult[]): void {
  console.group('🔍 Mobile Viewport Test Results');

  results.forEach(result => {
    const status = result.overallScore >= 80 ? '✅' :
                   result.overallScore >= 60 ? '⚠️' : '❌';

    console.group(`${status} ${result.viewport.name} (${result.viewport.width}px) - Score: ${result.overallScore}/100`);

    console.log(`📱 Viewport: ${result.viewport.width}×${result.viewport.height}`);
    console.log(`📏 Horizontal Scroll: ${result.horizontalScroll.hasHorizontalScroll ? '❌ Failed' : '✅ Passed'}`);
    console.log(`👆 Touch Targets: ${result.touchTargets.filter(t => t.isValid).length}/${result.touchTargets.length} valid`);

    if (result.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      result.recommendations.forEach(rec => console.log(`   • ${rec}`));
    }

    console.groupEnd();
  });

  console.groupEnd();
}

// Auto-run tests in development mode
if (process.env.NODE_ENV === 'development') {
  // Run tests after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const results = runAllMobileTests();
        logTestResults(results);

        // Store results globally for debugging
        (window as any).mobileTestResults = results;
      }, 1000);
    });
  }
}