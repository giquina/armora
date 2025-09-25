import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { name: '320px', width: 320, height: 568 },
  { name: '375px', width: 375, height: 812 },
  { name: '414px', width: 414, height: 896 },
  { name: '768px', width: 768, height: 1024 }
];

test.describe('Hub Mobile UX Final Validation', () => {

  for (const viewport of MOBILE_VIEWPORTS) {
    test(`${viewport.name} Mobile Compliance Validation`, async ({ page }) => {
      console.log(`\n🔍 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

      // Set mobile viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Navigate to app and wait for load
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take screenshot for manual inspection
      await page.screenshot({
        path: `test-results/${viewport.name}-hub-mobile.png`,
        fullPage: true
      });

      console.log(`📸 Screenshot saved: test-results/${viewport.name}-hub-mobile.png`);

      // Test Results Object
      const results = {
        viewport: viewport.name,
        width: viewport.width,
        horizontalScrolling: false,
        measurements: {
          officerPhotos: [],
          actionButtons: [],
          cardPaddings: [],
          touchTargets: [],
          textSizes: []
        },
        compliance: {
          noHorizontalScroll: false,
          officerPhotoSize: false,
          actionButtonHeight: false,
          cardPadding: false,
          touchTargetSize: false,
          textReadability: false
        }
      };

      // 1. Test for horizontal scrolling (CRITICAL TEST)
      const hasHorizontalScroll = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const scrollWidth = Math.max(body.scrollWidth, html.scrollWidth);
        const clientWidth = Math.max(body.clientWidth, html.clientWidth);
        return scrollWidth > clientWidth;
      });

      results.horizontalScrolling = hasHorizontalScroll;
      results.compliance.noHorizontalScroll = !hasHorizontalScroll;

      console.log(`📜 Horizontal Scrolling: ${hasHorizontalScroll ? '❌ DETECTED' : '✅ NONE'}`);

      // 2. Test Officer Photo sizes (looking for 44px requirement)
      const officerPhotos = await page.locator('img').all();
      for (let i = 0; i < officerPhotos.length; i++) {
        const photo = officerPhotos[i];
        if (await photo.isVisible()) {
          const box = await photo.boundingBox();
          if (box && box.width > 30 && box.width < 60) { // Likely officer photo size range
            results.measurements.officerPhotos.push({ width: box.width, height: box.height });
            console.log(`👤 Officer Photo ${i + 1}: ${Math.round(box.width)}x${Math.round(box.height)}px`);
          }
        }
      }

      // Check if officer photos meet 44px minimum requirement
      results.compliance.officerPhotoSize = results.measurements.officerPhotos.length === 0 ||
        results.measurements.officerPhotos.every(photo => photo.width >= 44 && photo.height >= 44);

      // 3. Test Action Button heights (looking for 48px minimum requirement)
      const buttons = await page.locator('button').all();
      for (let i = 0; i < Math.min(buttons.length, 10); i++) { // Test first 10 buttons
        const button = buttons[i];
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            results.measurements.actionButtons.push(box.height);
            if (box.height < 48) {
              console.log(`🔘 Button ${i + 1}: ${Math.round(box.height)}px height - ❌ (below 48px)`);
            } else {
              console.log(`🔘 Button ${i + 1}: ${Math.round(box.height)}px height - ✅`);
            }
          }
        }
      }

      // Check if action buttons meet 48px minimum requirement
      results.compliance.actionButtonHeight = results.measurements.actionButtons.length === 0 ||
        results.measurements.actionButtons.every(height => height >= 48);

      // 4. Test Card padding (looking for 12px minimum requirement)
      const cards = await page.locator('[class*="card"], .card').all();
      for (let i = 0; i < Math.min(cards.length, 5); i++) { // Test first 5 cards
        const card = cards[i];
        if (await card.isVisible()) {
          const padding = await card.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return parseInt(computed.paddingTop) || parseInt(computed.padding) || 0;
          });
          results.measurements.cardPaddings.push(padding);
          console.log(`📦 Card ${i + 1}: ${padding}px padding - ${padding >= 12 ? '✅' : '❌'}`);
        }
      }

      // Check if card padding meets 12px minimum requirement
      results.compliance.cardPadding = results.measurements.cardPaddings.length === 0 ||
        results.measurements.cardPaddings.every(padding => padding >= 12);

      // 5. Test Touch Target sizes (44px minimum for accessibility)
      const touchTargets = await page.locator('button, a[href], input, [role="button"], [tabindex="0"]').all();
      for (let i = 0; i < Math.min(touchTargets.length, 8); i++) { // Test first 8 touch targets
        const target = touchTargets[i];
        if (await target.isVisible()) {
          const box = await target.boundingBox();
          if (box) {
            const minSize = Math.min(box.width, box.height);
            results.measurements.touchTargets.push(minSize);
            if (minSize < 44) {
              console.log(`👆 Touch Target ${i + 1}: ${Math.round(minSize)}px minimum - ❌ (too small)`);
            }
          }
        }
      }

      // Check if touch targets meet 44px minimum requirement
      results.compliance.touchTargetSize = results.measurements.touchTargets.length === 0 ||
        results.measurements.touchTargets.every(size => size >= 44);

      // 6. Test Text readability (12px minimum requirement)
      const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').all();
      for (let i = 0; i < Math.min(textElements.length, 10); i++) { // Test first 10 text elements
        const textEl = textElements[i];
        if (await textEl.isVisible()) {
          const fontSize = await textEl.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return parseInt(computed.fontSize) || 0;
          });
          if (fontSize > 0) {
            results.measurements.textSizes.push(fontSize);
            if (fontSize < 12) {
              console.log(`📝 Text ${i + 1}: ${fontSize}px - ❌ (below 12px)`);
            }
          }
        }
      }

      // Check if text meets 12px minimum requirement
      results.compliance.textReadability = results.measurements.textSizes.length === 0 ||
        results.measurements.textSizes.every(size => size >= 12);

      // Calculate Overall Compliance
      const complianceResults = Object.values(results.compliance);
      const passedTests = complianceResults.filter(result => result === true).length;
      const totalTests = complianceResults.length;
      const compliancePercentage = Math.round((passedTests / totalTests) * 100);

      console.log(`\n📊 ${viewport.name} COMPLIANCE RESULTS:`);
      console.log(`   Overall: ${compliancePercentage}% (${passedTests}/${totalTests} tests passed)`);
      console.log(`   No Horizontal Scrolling: ${results.compliance.noHorizontalScroll ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Officer Photo Size: ${results.compliance.officerPhotoSize ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Action Button Height: ${results.compliance.actionButtonHeight ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Card Padding: ${results.compliance.cardPadding ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Touch Target Size: ${results.compliance.touchTargetSize ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Text Readability: ${results.compliance.textReadability ? '✅ PASS' : '❌ FAIL'}`);

      // Store results in global for final report
      (global as any).testResults = (global as any).testResults || [];
      (global as any).testResults.push({
        viewport: viewport.name,
        width: viewport.width,
        compliancePercentage,
        passedTests,
        totalTests,
        compliance: results.compliance
      });

      // Individual test assertions
      expect(results.compliance.noHorizontalScroll, `No horizontal scrolling at ${viewport.name}`).toBe(true);
      expect(compliancePercentage, `Overall compliance should be 100% at ${viewport.name} (currently ${compliancePercentage}%)`).toBe(100);
    });
  }

  test('Final Mobile UX Compliance Report', async ({ page }) => {
    const results = (global as any).testResults || [];

    console.log('\n🎯 FINAL MOBILE UX COMPLIANCE REPORT');
    console.log('=====================================');

    let overallCompliant = true;
    let totalScore = 0;

    for (const result of results) {
      console.log(`\n📱 ${result.viewport} (${result.width}px):`);
      console.log(`   Compliance Score: ${result.compliancePercentage}%`);
      console.log(`   Tests Passed: ${result.passedTests}/${result.totalTests}`);

      if (result.compliancePercentage < 100) {
        overallCompliant = false;
        console.log(`   Status: ❌ NEEDS FIXES`);

        // Show specific failures
        if (!result.compliance.noHorizontalScroll) console.log(`     - Fix horizontal scrolling`);
        if (!result.compliance.officerPhotoSize) console.log(`     - Fix officer photo size (need ≥44px)`);
        if (!result.compliance.actionButtonHeight) console.log(`     - Fix action button height (need ≥48px)`);
        if (!result.compliance.cardPadding) console.log(`     - Fix card padding (need ≥12px)`);
        if (!result.compliance.touchTargetSize) console.log(`     - Fix touch target size (need ≥44px)`);
        if (!result.compliance.textReadability) console.log(`     - Fix text size (need ≥12px)`);
      } else {
        console.log(`   Status: ✅ FULLY COMPLIANT`);
      }

      totalScore += result.compliancePercentage;
    }

    const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

    console.log(`\n🏆 OVERALL MOBILE UX COMPLIANCE:`);
    console.log(`   Average Score: ${averageScore}%`);
    console.log(`   Final Status: ${overallCompliant && averageScore === 100 ? '✅ 100% MOBILE COMPLIANT' : '❌ FIXES NEEDED'}`);

    if (overallCompliant && averageScore === 100) {
      console.log(`\n🎉 SUCCESS! All CSS fixes have achieved 100% mobile compliance:`);
      console.log(`   ✅ Officer photos: 44px minimum`);
      console.log(`   ✅ Action buttons: 48px minimum height`);
      console.log(`   ✅ Card padding: 12px consistent`);
      console.log(`   ✅ Touch targets: 44px minimum`);
      console.log(`   ✅ No horizontal scrolling`);
      console.log(`   ✅ Text readability: 12px minimum`);
    } else {
      console.log(`\n⚠️  Additional CSS fixes still needed for full compliance.`);
    }

    // Test assertion for overall compliance
    expect(overallCompliant && averageScore === 100, 'Mobile UX should be 100% compliant').toBe(true);
  });
});