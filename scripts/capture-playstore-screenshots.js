#!/usr/bin/env node

/**
 * Armora Play Store Screenshot Capture Script
 *
 * Captures 8 screenshots in 1080x1920 portrait format for Google Play Store.
 * Uses Playwright to automate browser navigation and screenshot capture.
 *
 * Usage:
 *   node scripts/capture-playstore-screenshots.js
 *
 * Requirements:
 *   - App running on http://localhost:3000
 *   - Playwright installed (npm install -D @playwright/test)
 *
 * Output:
 *   - Screenshots saved to: public/playstore/screenshots/
 *   - Format: PNG, 1080x1920 pixels (portrait)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration
const APP_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '../play-store-assets/screenshots');
const VIEWPORT = { width: 1080, height: 1920 };

// Screenshot definitions
const SCREENSHOTS = [
  {
    name: '01-hub-dashboard',
    title: 'Hub Dashboard',
    description: 'Main command center with navigation cards',
    steps: async (page) => {
      await page.goto(`${APP_URL}/?view=home`);
      await page.waitForTimeout(2000); // Let animations complete
    }
  },
  {
    name: '02-service-selection',
    title: 'Service Selection',
    description: 'Four protection tiers with pricing',
    steps: async (page) => {
      // Navigate to booking flow
      await page.goto(`${APP_URL}/?view=hub`);
      await page.waitForTimeout(1000);

      // Click on "Request Protection" or similar button
      const requestButton = await page.locator('text=/request.*protection/i').first();
      if (await requestButton.isVisible().catch(() => false)) {
        await requestButton.click();
        await page.waitForTimeout(1500);
      }
    }
  },
  {
    name: '03-where-when-booking',
    title: 'Booking Flow - Where & When',
    description: 'Location inputs with date/time picker',
    steps: async (page) => {
      await page.goto(`${APP_URL}/?view=hub`);
      await page.waitForTimeout(1000);

      // Try to navigate to booking view
      // This assumes there's a way to get to WhereWhenView
      // Adjust selector based on actual app structure
    }
  },
  {
    name: '04-live-tracking',
    title: 'Live Tracking Map',
    description: 'Real-time CPO location with route visualization',
    steps: async (page) => {
      // Note: This may require a mock active assignment
      await page.goto(`${APP_URL}/?view=hub`);
      await page.waitForTimeout(2000);

      // Look for active assignment or map view
      const mapContainer = await page.locator('[class*="map"]').first();
      if (await mapContainer.isVisible().catch(() => false)) {
        await page.waitForTimeout(1000);
      }
    }
  },
  {
    name: '05-protection-panel',
    title: 'Enhanced Protection Panel',
    description: 'CPO credentials with SIA license and emergency buttons',
    steps: async (page) => {
      await page.goto(`${APP_URL}/?view=hub`);
      await page.waitForTimeout(1500);

      // Look for EnhancedProtectionPanel
      const protectionPanel = await page.locator('[class*="protection-panel"]').first();
      if (await protectionPanel.isVisible().catch(() => false)) {
        await page.waitForTimeout(1000);
      }
    }
  },
  {
    name: '06-payment-screen',
    title: 'Payment Integration',
    description: 'Stripe Elements with payment summary',
    steps: async (page) => {
      // Note: May require navigating through booking flow
      await page.goto(`${APP_URL}/?view=hub`);
      await page.waitForTimeout(1000);

      // Try to reach payment view
      // This will need adjustment based on actual routing
    }
  },
  {
    name: '07-assignment-history',
    title: 'Assignment History',
    description: 'Past assignments with filtering and rating',
    steps: async (page) => {
      await page.goto(`${APP_URL}/?view=assignments`);
      await page.waitForTimeout(2000);
    }
  },
  {
    name: '08-account-profile',
    title: 'Account Profile',
    description: 'User profile with settings and preferences',
    steps: async (page) => {
      await page.goto(`${APP_URL}/?view=account`);
      await page.waitForTimeout(2000);
    }
  }
];

async function captureScreenshots() {
  console.log('🚀 Armora Play Store Screenshot Capture\n');

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    console.log(`✅ Created directory: ${SCREENSHOT_DIR}\n`);
  }

  console.log(`📱 Viewport: ${VIEWPORT.width}x${VIEWPORT.height} (portrait)`);
  console.log(`🌐 App URL: ${APP_URL}`);
  console.log(`📁 Output: ${SCREENSHOT_DIR}\n`);

  // Launch browser
  const browser = await chromium.launch({
    headless: true // Set to false to see the browser
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // Higher quality screenshots
    hasTouch: true, // Simulate mobile device
    isMobile: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  // Set longer timeout for navigation
  page.setDefaultTimeout(10000);

  let successCount = 0;
  let errorCount = 0;

  // Capture each screenshot
  for (const screenshot of SCREENSHOTS) {
    try {
      console.log(`📸 Capturing: ${screenshot.title}...`);

      // Execute screenshot-specific steps
      await screenshot.steps(page);

      // Capture screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `${screenshot.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false, // Only capture viewport
        type: 'png'
      });

      // Verify file was created
      if (fs.existsSync(screenshotPath)) {
        const stats = fs.statSync(screenshotPath);
        console.log(`   ✅ Saved: ${screenshot.name}.png (${(stats.size / 1024).toFixed(1)}KB)`);
        successCount++;
      } else {
        console.log(`   ❌ Failed: ${screenshot.name}.png`);
        errorCount++;
      }

    } catch (error) {
      console.log(`   ❌ Error capturing ${screenshot.title}: ${error.message}`);
      errorCount++;
    }
  }

  await browser.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CAPTURE SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${SCREENSHOTS.length}`);
  console.log(`❌ Failed: ${errorCount}/${SCREENSHOTS.length}`);
  console.log(`📁 Location: ${SCREENSHOT_DIR}`);

  if (successCount === SCREENSHOTS.length) {
    console.log('\n🎉 All screenshots captured successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review screenshots in play-store-assets/screenshots/');
    console.log('   2. Upload to Google Play Console');
    console.log('   3. Main store listing → Phone screenshots');
  } else if (successCount > 0) {
    console.log('\n⚠️  Some screenshots failed. You may need to:');
    console.log('   1. Ensure the app is running on http://localhost:3000');
    console.log('   2. Check if all views are accessible');
    console.log('   3. Manually capture missing screenshots');
  } else {
    console.log('\n❌ No screenshots captured. Please:');
    console.log('   1. Start the app: npm start');
    console.log('   2. Verify it\'s running on http://localhost:3000');
    console.log('   3. Run this script again');
  }

  console.log('\n');
}

// Check if app is running before attempting capture
async function checkAppRunning() {
  try {
    const http = require('http');
    return new Promise((resolve) => {
      const req = http.get(APP_URL, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  try {
    console.log('🔍 Starting screenshot capture...');
    console.log('⚠️  Make sure app is running on http://localhost:3000\n');

    await captureScreenshots();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
})();
