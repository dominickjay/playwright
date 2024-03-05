const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
import { createHtmlReport } from 'axe-html-reporter';
const fs = require('fs');
import dotenv from 'dotenv';

dotenv.config();

test('should not have any automatically detectable WCAG A or AA violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

    const reportHTML = createHtmlReport({
        results: accessibilityScanResults,
        options: {
            projectKey: process.env.PLAYWRIGHT_SITE_REPORT_TITLE
        },
    });

    if (!fs.existsSync("build/reports/accessibility-report.html")) {
        fs.mkdirSync("build/reports", {
            recursive: true,
        });
    }
    fs.writeFileSync("build/reports/accessibility-report.html", reportHTML);

});

//   https://playwright.dev/docs/accessibility-testing#excluding-individual-elements-from-a-scan
test('Excluding individual elements from a scan', async ({ page }) => {

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('iframe')
        .analyze();


});

//   https://playwright.dev/docs/accessibility-testing#excluding-individual-elements-from-a-scan
test('Disabling individual scan rules', async ({ page }) => {

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('iframe')
        .analyze();


});