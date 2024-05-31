const { test, expect } = require('@playwright/test');

test('example test', async ({ page }) => {
    // THIS TEST WILL FAIL THE FIRST TIME AS THERE'S NO COMPARISON IMAGE
    await page.goto('/')
    await page.waitForTimeout(5000)

    await expect(page).toHaveScreenshot({ fullPage: true, animations: 'disabled', timeout: 120000, maxDiffPixels: 100 });

});