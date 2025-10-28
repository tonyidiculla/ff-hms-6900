import { test, expect } from '@playwright/test';

test('Purchasing page should load and show content', async ({ page }) => {
  // Navigate to HMS Purchasing page
  await page.goto('http://localhost:6900/purchasing');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/purchasing-page.png', fullPage: true });
  
  // Check if iframe is present
  const iframe = page.frameLocator('iframe[title="Purchasing Service"]');
  
  // Check if dashboard content is visible in iframe
  const dashboardTitle = iframe.locator('h1:has-text("Purchasing Dashboard")');
  await expect(dashboardTitle).toBeVisible({ timeout: 10000 });
  
  console.log('✅ Purchasing page loaded successfully');
});
