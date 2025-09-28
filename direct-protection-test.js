const { chromium } = require('playwright');
const fs = require('fs');

async function directlyAccessProtectionPage() {
  console.log('🎯 Direct protection request page access test...');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-dev-shm-usage'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    locale: 'en-GB',
    timezoneId: 'Europe/London'
  });

  const page = await context.newPage();

  try {
    console.log('🚀 Setting up complete user state before loading...');

    // Go to the page first
    await page.goto('http://localhost:3002', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Set up complete user and app state
    await page.evaluate(() => {
      // Clear any existing state
      localStorage.clear();

      // Set up a complete user
      localStorage.setItem('armora_user', JSON.stringify({
        id: 'test-user-123',
        name: 'Test User',
        email: 'test@armora.co.uk',
        userType: 'registered',
        hasCompletedQuestionnaire: true,
        hasUnlockedReward: true,
        subscriptionTier: 'premium',
        createdAt: new Date().toISOString()
      }));

      // Set completed questionnaire
      localStorage.setItem('armora_questionnaire_responses', JSON.stringify({
        profileSelection: 'business-professional',
        primaryConcerns: ['personal-safety'],
        preferredResponseTime: 'immediate',
        securityExperience: 'experienced',
        completedAt: new Date().toISOString(),
        responses: {
          q1: 'business-professional',
          q2: 'immediate',
          q3: 'experienced'
        }
      }));

      // Set the current view directly to protection-request
      localStorage.setItem('armora_current_view', 'protection-request');

      // Set other necessary app state
      localStorage.setItem('armora_app_initialized', 'true');
      localStorage.setItem('armora_onboarding_complete', 'true');
    });

    console.log('🔄 Reloading with complete state...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(5000); // Give extra time for React to initialize

    // Take screenshot of current state
    await page.screenshot({
      path: '/workspaces/armora/direct-protection-attempt.png',
      fullPage: true
    });

    // Check what we got
    const currentState = await page.evaluate(() => {
      return {
        currentView: localStorage.getItem('armora_current_view'),
        url: window.location.href,
        hash: window.location.hash,
        bodyClasses: document.body.className,
        hasProtectionRequest: !!document.querySelector('[class*="protectionRequest"], [class*="protection-request"]'),
        protectionElements: Array.from(document.querySelectorAll('*')).filter(el =>
          el.className && (
            el.className.includes('protection') ||
            el.className.includes('service') ||
            el.className.includes('request')
          )
        ).map(el => ({
          tag: el.tagName,
          className: el.className,
          text: el.textContent?.substring(0, 50) || ''
        })),
        allMainElements: Array.from(document.querySelectorAll('main *, [role="main"] *, .app *, #root *')).slice(0, 15).map(el => ({
          tag: el.tagName,
          className: el.className,
          text: el.textContent?.trim().substring(0, 40) || ''
        }))
      };
    });

    console.log('📊 Current state after direct navigation:');
    console.log(`   - View: ${currentState.currentView}`);
    console.log(`   - URL: ${currentState.url}`);
    console.log(`   - Has Protection Request: ${currentState.hasProtectionRequest}`);
    console.log(`   - Protection Elements Found: ${currentState.protectionElements.length}`);

    if (currentState.protectionElements.length > 0) {
      console.log('🎯 Protection elements:');
      currentState.protectionElements.forEach((el, i) => {
        console.log(`   ${i + 1}. ${el.tag}.${el.className}: "${el.text}"`);
      });
    }

    // Save final state for analysis
    fs.writeFileSync('/workspaces/armora/final-protection-state.json', JSON.stringify(currentState, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
    await page.screenshot({
      path: '/workspaces/armora/error-protection-test.png',
      fullPage: true
    });
  } finally {
    await browser.close();
    console.log('✅ Direct protection test complete!');
  }
}

directlyAccessProtectionPage().catch(console.error);
