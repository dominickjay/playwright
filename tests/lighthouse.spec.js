const { playAudit } = require('playwright-lighthouse');
const { test, chromium } = require('@playwright/test');
const { URLs } = require("../utils/urls.json");
const { thresholds } = require('../utils/thresholds');

const options = {
    loglevel: "info",
}

test.describe.configure({ mode: 'serial' });

URLs.forEach(url => {
    test(`Lighthouse accessibility test for ${url}`, async () => {

        const browser = await chromium.launch({
            args: ['--remote-debugging-port=9222'],
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(url);

        await playAudit({
            page: page,
            thresholds: thresholds,
            port: 9222,
            ignoreError: true,
            opts: options,
            reports: {
                formats: {
                    html: true, //defaults to false
                },
                name: `report-${new Date().toISOString()}`, //defaults to `lighthouse-${new Date().getTime()}`
                directory: `build/reports/accessibility/lighthouse/`, //defaults to `${process.cwd()}/lighthouse`
            },
        });
        await page.close();
        await browser.close();
    })
});