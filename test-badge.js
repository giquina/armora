const puppeteer = require('puppeteer');

async function testHighDemandBadge() {
  console.log('🚀 Starting HIGH DEMAND badge test...');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to the app
    console.log('📱 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'initial-state.png' });
    console.log('📷 Initial screenshot saved');
    
    // Look for questionnaire or navigate to it
    try {
      // Try to find welcome page first
      await page.waitForSelector('.welcome-page, [data-testid="welcome"], .splash-screen', { timeout: 5000 });
      console.log('✅ Found welcome/splash screen');
      
      // Look for start questionnaire button
      const startButton = await page.$('button:contains("Start"), button:contains("Begin"), button:contains("Continue"), .cta-button, .start-button');
      if (startButton) {
        await startButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('⚠️  No welcome screen found, continuing...');
    }
    
    // Wait for questionnaire options
    console.log('🔍 Looking for questionnaire options...');
    await page.waitForSelector('[data-option-value="international_visitor"], .option, .questionnaire-option', { timeout: 10000 });
    
    // Take screenshot of questionnaire
    await page.screenshot({ path: 'questionnaire-loaded.png' });
    console.log('📷 Questionnaire loaded screenshot saved');
    
    // Find the International Visitor option
    const internationalVisitorOption = await page.$('[data-option-value="international_visitor"]');
    if (!internationalVisitorOption) {
      console.log('❌ Could not find International Visitor option');
      // Try alternative selectors
      const allOptions = await page.$$('.option, .questionnaire-option');
      console.log(`Found ${allOptions.length} options total`);
      
      for (let i = 0; i < allOptions.length; i++) {
        const optionText = await allOptions[i].textContent();
        console.log(`Option ${i}: ${optionText?.substring(0, 50)}...`);
        if (optionText?.toLowerCase().includes('international') || optionText?.toLowerCase().includes('visitor')) {
          console.log('✅ Found International Visitor option by text');
          
          // Check for HIGH DEMAND badge before click
          const badgeBefore = await allOptions[i].$('div:contains("HIGH DEMAND"), [style*="HIGH DEMAND"]');
          console.log(`🏷️  HIGH DEMAND badge visible before click: ${badgeBefore ? 'YES' : 'NO'}`);
          
          // Take screenshot before click
          await page.screenshot({ path: 'before-click.png' });
          console.log('📷 Before click screenshot saved');
          
          // Get option dimensions before click
          const boundsBefore = await allOptions[i].boundingBox();
          console.log('📏 Option dimensions before click:', boundsBefore);
          
          // Click the option
          console.log('🖱️  Clicking International Visitor option...');
          await allOptions[i].click();
          await page.waitForTimeout(500);
          
          // Take screenshot after click
          await page.screenshot({ path: 'after-click.png' });
          console.log('📷 After click screenshot saved');
          
          // Get option dimensions after click
          const boundsAfter = await allOptions[i].boundingBox();
          console.log('📏 Option dimensions after click:', boundsAfter);
          
          // Check for dimension changes
          if (boundsBefore && boundsAfter) {
            const widthChange = boundsAfter.width - boundsBefore.width;
            const heightChange = boundsAfter.height - boundsBefore.height;
            console.log(`📊 Size changes - Width: ${widthChange}px, Height: ${heightChange}px`);
            
            if (Math.abs(widthChange) > 5 || Math.abs(heightChange) > 5) {
              console.log('⚠️  EXPANSION BUG DETECTED! Option size changed significantly');
            } else {
              console.log('✅ No significant size changes detected');
            }
          }
          
          // Check for HIGH DEMAND badge after click
          const badgeAfter = await allOptions[i].$('div:contains("HIGH DEMAND"), [style*="HIGH DEMAND"]');
          console.log(`🏷️  HIGH DEMAND badge visible after click: ${badgeAfter ? 'YES' : 'NO'}`);
          
          // Check for golden bar
          const goldenBars = await page.$$('[style*="border-bottom"], [style*="golden"], [style*="FFD700"]');
          console.log(`🟡 Found ${goldenBars.length} elements with golden styling`);
          
          break;
        }
      }
    } else {
      console.log('✅ Found International Visitor option directly');
      await internationalVisitorOption.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'international-visitor-clicked.png' });
    }
    
    // Final screenshot
    await page.screenshot({ path: 'final-state.png' });
    console.log('📷 Final screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'error-state.png' });
  } finally {
    console.log('🏁 Test completed. Check the screenshots for visual inspection.');
    await browser.close();
  }
}

testHighDemandBadge().catch(console.error);