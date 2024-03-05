const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('example test', async ({ page }) => {
    // THIS TEST WILL FAIL THE FIRST TIME AS THERE'S NO COMPARISON IMAGE
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded');
    await test.slow();
    await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled' });
});