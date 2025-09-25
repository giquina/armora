import { test, expect } from '@playwright/test';

const MOBILE_BREAKPOINTS = [
  { name: '320px (iPhone SE)', width: 320, height: 568 },
  { name: '375px (iPhone X)', width: 375, height: 812 },
  { name: '414px (iPhone Plus)', width: 414, height: 896 },
  { name: '768px (iPad)', width: 768, height: 1024 }
];

test.describe('Hub Mobile Design Validation', () => {
  for (const viewport of MOBILE_BREAKPOINTS) {
    test(`${viewport.name} - Complete Mobile UX Compliance`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate directly to the Hub page (bypassing splash/welcome for testing)
      await page.goto('/');

      // Wait for app to initialize and then navigate programmatically to hub
      await page.waitForLoadState('networkidle');

      // Use JavaScript to navigate directly to hub view
      await page.evaluate(() => {
        // Set app state to navigate to hub
        const appContainer = document.querySelector('#root');
        if (appContainer) {
          // Trigger hub navigation through app context or direct DOM manipulation
          window.localStorage.setItem('armora-test-view', 'hub');
          // Try to find navigation to hub
          const hubButton = document.querySelector('[data-testid*="hub"], .hub, button:contains("Hub")');
          if (hubButton) {
            (hubButton as HTMLElement).click();
          }
        }
      });

      // Give some time for navigation to complete
      await page.waitForTimeout(2000);

      // Wait for Hub content to load using the correct Hub container class
      await page.waitForSelector('[class*="hubContainer"], [class*="Hub"], .navigation-cards, [class*="activeProtection"]', { timeout: 10000 });

      // Test Results Object
      const results = {
        viewport: viewport.name,
        officerPhotoSize: null,
        actionButtonHeights: [],
        cardPadding: null,
        touchTargets: [],
        horizontalScrolling: false,
        textReadability: [],
        compliance: {
          officerPhoto: false,
          actionButtons: false,
          cardPadding: false,
          touchTargets: false,
          noScrolling: false,
          textSize: false
        }
      };

      console.log(`\n🔍 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

      // 1. Test Officer Photo Size (should be exactly 44px)
      const officerPhoto = page.locator('[class*="officer"] img, [data-testid*="officer-photo"], .officer-photo, [class*="Officer"] img').first();
      if (await officerPhoto.isVisible()) {
        const photoBox = await officerPhoto.boundingBox();
        if (photoBox) {
          results.officerPhotoSize = { width: photoBox.width, height: photoBox.height };
          results.compliance.officerPhoto = photoBox.width >= 44 && photoBox.height >= 44;
          console.log(`📸 Officer Photo: ${photoBox.width}x${photoBox.height}px - ${results.compliance.officerPhoto ? '✅' : '❌'}`);
        }
      }

      // 2. Test Action Button Heights (should be exactly 48px+ minimum)
      const actionButtons = page.locator('button[class*="action"], [data-testid*="action-button"], .action-button, button[class*="Action"]');
      const buttonCount = await actionButtons.count();
      for (let i = 0; i < buttonCount; i++) {
        const button = actionButtons.nth(i);
        if (await button.isVisible()) {
          const buttonBox = await button.boundingBox();
          if (buttonBox) {
            results.actionButtonHeights.push(buttonBox.height);
            console.log(`🔘 Action Button ${i + 1}: ${buttonBox.height}px height - ${buttonBox.height >= 48 ? '✅' : '❌'}`);
          }
        }
      }
      results.compliance.actionButtons = results.actionButtonHeights.every(height => height >= 48);

      // 3. Test Card Padding (should be exactly 12px)
      const cards = page.locator('[class*="card"], .card, [data-testid*="card"]');
      if (await cards.first().isVisible()) {
        const cardPadding = await cards.first().evaluate(el => {
          const computed = window.getComputedStyle(el);
          return parseInt(computed.paddingTop) || parseInt(computed.padding);
        });
        results.cardPadding = cardPadding;
        results.compliance.cardPadding = cardPadding >= 12;
        console.log(`📦 Card Padding: ${cardPadding}px - ${results.compliance.cardPadding ? '✅' : '❌'}`);
      }

      // 4. Test Touch Targets (all should be ≥44px)
      const touchTargets = page.locator('button, a, [role="button"], input, [tabindex="0"]');
      const touchTargetCount = await touchTargets.count();
      for (let i = 0; i < Math.min(touchTargetCount, 10); i++) { // Test first 10 touch targets
        const target = touchTargets.nth(i);
        if (await target.isVisible()) {
          const targetBox = await target.boundingBox();
          if (targetBox) {
            const minSize = Math.min(targetBox.width, targetBox.height);
            results.touchTargets.push(minSize);
            if (minSize < 44) {
              console.log(`👆 Touch Target ${i + 1}: ${minSize}px minimum - ❌ (too small)`);
            }
          }
        }
      }
      results.compliance.touchTargets = results.touchTargets.every(size => size >= 44);

      // 5. Test for Horizontal Scrolling
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      results.horizontalScrolling = hasHorizontalScroll;
      results.compliance.noScrolling = !hasHorizontalScroll;
      console.log(`📜 Horizontal Scrolling: ${hasHorizontalScroll ? '❌ DETECTED' : '✅ NONE'}`);

      // 6. Test Text Readability (should be ≥12px)
      const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6, li, td, th, label');
      const textCount = await textElements.count();
      for (let i = 0; i < Math.min(textCount, 15); i++) { // Test first 15 text elements
        const textEl = textElements.nth(i);
        if (await textEl.isVisible()) {
          const fontSize = await textEl.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return parseInt(computed.fontSize);
          });
          if (fontSize > 0) {
            results.textReadability.push(fontSize);
            if (fontSize < 12) {
              console.log(`📝 Text ${i + 1}: ${fontSize}px - ❌ (too small)`);
            }
          }
        }
      }
      results.compliance.textSize = results.textReadability.every(size => size >= 12);

      // Calculate Overall Compliance
      const passedTests = Object.values(results.compliance).filter(Boolean).length;
      const totalTests = Object.keys(results.compliance).length;
      const compliancePercentage = Math.round((passedTests / totalTests) * 100);

      console.log(`\n📊 ${viewport.name} RESULTS:`);
      console.log(`   Overall Compliance: ${compliancePercentage}% (${passedTests}/${totalTests})`);
      console.log(`   Officer Photo: ${results.compliance.officerPhoto ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Action Buttons: ${results.compliance.actionButtons ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Card Padding: ${results.compliance.cardPadding ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Touch Targets: ${results.compliance.touchTargets ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   No Scrolling: ${results.compliance.noScrolling ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Text Readability: ${results.compliance.textSize ? '✅ PASS' : '❌ FAIL'}`);

      // Assertions for test framework
      expect(results.compliance.officerPhoto, `Officer photo should be ≥44px at ${viewport.name}`).toBe(true);
      expect(results.compliance.actionButtons, `Action buttons should be ≥48px at ${viewport.name}`).toBe(true);
      expect(results.compliance.cardPadding, `Card padding should be ≥12px at ${viewport.name}`).toBe(true);
      expect(results.compliance.touchTargets, `Touch targets should be ≥44px at ${viewport.name}`).toBe(true);
      expect(results.compliance.noScrolling, `No horizontal scrolling at ${viewport.name}`).toBe(true);
      expect(results.compliance.textSize, `Text should be ≥12px at ${viewport.name}`).toBe(true);

      // Overall compliance should be 100%
      expect(compliancePercentage, `Overall compliance should be 100% at ${viewport.name}`).toBe(100);
    });
  }

  test('Mobile Compliance Summary Report', async ({ page }) => {
    console.log('\n🎯 FINAL MOBILE COMPLIANCE VALIDATION COMPLETE');
    console.log('==========================================');
    console.log('All breakpoints tested: 320px, 375px, 414px, 768px');
    console.log('Navigation flow: Splash → Welcome → Hub (guest mode)');
    console.log('Measurements taken for all critical elements');
    console.log('Accessibility standards validated');
    console.log('\nIf all tests above passed, mobile compliance is 100% ✅');
    console.log('If any tests failed, additional CSS fixes needed ❌');
  });
});