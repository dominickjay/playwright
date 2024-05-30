const { playAudit } = require('playwright-lighthouse');
const { test, chromium } = require('@playwright/test');
const lighthouseDesktopConfig = require('lighthouse/lighthouse-core/config/lr-desktop-config');
const { URLs } = require("../utils/urls.json");
const { thresholds } = require('../utils/thresholds');

const options = {
    loglevel: "info",
}

URLs.forEach(url => {
    test(`Lighthouse performance test for ${url}`, async () => {
        const browser = await chromium.launch({
            args: ['--remote-debugging-port=9222'],
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(url);
        await playAudit({
            page: page,
            config: lighthouseDesktopConfig,
            thresholds: thresholds,
            port: 9222,
            ignoreError: true,
            opts: options,
            reports: {
                formats: {
                    html: true, //defaults to false
                },
                name: `lighthouse-${new Date().toISOString()}`, //defaults to `lighthouse-${new Date().getTime()}`
                directory: `${process.cwd()}/build`, //defaults to `${process.cwd()}/lighthouse`
            },
        });
        await page.close();
        await browser.close();
    })
});