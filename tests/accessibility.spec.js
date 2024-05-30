const { test, expect, chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
import { createHtmlReport } from 'axe-html-reporter';
const fs = require('fs');
import dotenv from 'dotenv';
const { URLs } = require("../utils/urls.json");

dotenv.config();

URLs.forEach(url => {
    test(` ${url} should not have any automatically detectable WCAG A or AA violations`, async ({ page }) => {

        await page.goto(url);

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        const reportHTML = createHtmlReport({
            results: accessibilityScanResults,
            options: {
                projectKey: process.env.PLAYWRIGHT_SITE_REPORT_TITLE
            },
        });

        if (!fs.existsSync(`build/reports/accessibility/axe-report-${new Date().toISOString()}.html`)) {
            fs.mkdirSync("build/reports/accessibility/", {
                recursive: true,
            });
        }
        fs.writeFileSync(`build/reports/accessibility/axe-report-${new Date().toISOString()}.html`, reportHTML);

    });
});