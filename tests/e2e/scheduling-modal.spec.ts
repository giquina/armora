import { test, expect } from '@playwright/test';

test.describe('Scheduling Modal', () => {
  test('open modal, select date & verify time grid inline', async ({ page }) => {
    await page.goto('/');

  // Wait for service cards to render
  await page.getByTestId('service-standard').waitFor();
  // Click schedule button inside the first card
  await page.locator('[data-testid="service-standard"] >> text=Schedule for Later').click();

    // Modal should appear
    await expect(page.getByRole('heading', { name: /schedule your/i })).toBeVisible();

    // Calendar day buttons (ensure clickable) - pick tomorrow
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24*60*60*1000);
    const dayLabel = String(tomorrow.getDate());
    await page.getByRole('button', { name: new RegExp(`^${dayLabel}$`) }).click();

    // Scroll to time section and verify grid present inline
    await page.getByText(/time/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/morning/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /6:00 am/i })).toBeVisible();

    // Ensure Book button enabled once time auto-selected
    const bookBtn = page.getByRole('button', { name: /book scheduled service/i });
    await expect(bookBtn).toBeEnabled();
  });
});