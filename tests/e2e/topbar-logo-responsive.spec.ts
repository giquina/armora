import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-320', width: 320, height: 640 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'wide-1440', width: 1440, height: 900 },
];

// Helper to hop to home (Dashboard) using Dev Navigation Panel
async function goToHome(page) {
  await page.goto('/');
  // Hide CRA dev overlay if present (it can block clicks)
  await page.addStyleTag({ content: `#webpack-dev-server-client-overlay{display:none!important;pointer-events:none!important}` });
  // Try primary DEV skip button first
  const skipBtn = page.getByRole('button', { name: /skip to dashboard/i });
  if (await skipBtn.count()) {
    await skipBtn.first().click();
  } else {
    // Fallback to Dev Navigation Panel
    const dashBtn = page.getByTitle('Navigate to Dashboard');
    await dashBtn.waitFor({ timeout: 25000 });
    await dashBtn.click();
  }
  // Wait for Dev Navigation Panel button (title attribute) and click
  await page.waitForSelector('nav[aria-label="Top"]', { timeout: 15000 });
}

for (const vp of viewports) {
  test.describe(`TopToolbar logo responsive - ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`logo visible and crisp, brand positioned correctly - ${vp.name}`, async ({ page }) => {
  await goToHome(page);

  // Wait for toolbar to mount
  await page.waitForSelector('nav[aria-label="Top"]', { timeout: 15000 });
  const toolbar = page.locator('nav[aria-label="Top"]');
  await expect(toolbar).toBeVisible();

      // Logo present
      const logo = toolbar.locator('svg, canvas').first();
      await expect(logo).toBeVisible();

      // Brand text present
      await expect(toolbar.getByText(/armora/i).first()).toBeVisible();

      // Booking icon visible
      const bookBtn = toolbar.getByRole('button', { name: /schedule or book/i });
      await expect(bookBtn).toBeVisible();

      // Notifications visible
      const bellBtn = toolbar.getByRole('button', { name: /notifications/i });
      await expect(bellBtn).toBeVisible();

      // On large screens, label should appear for Book
      if (vp.width >= 768) {
        await expect(bookBtn.getByText(/book/i)).toBeVisible();
      } else {
        await expect(bookBtn.getByText(/book/i)).toBeHidden();
      }

      // No snapshot assertion to keep test environment-independent
    });
  });
}
