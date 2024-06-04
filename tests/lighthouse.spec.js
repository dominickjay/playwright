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

        const results = await playAudit({
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

        const resultArray = results.lhr.categories;

        if (resultArray['performance'].score * 100 < thresholds['performance']) {
            console.log(`performance failed - score is ${resultArray['performance'].score * 100}, threshold is ${thresholds['performance']}`);
        }

        if (resultArray['accessibility'].score * 100 < thresholds['accessibility']) {
            console.log(`accessibility failed - score is ${resultArray['accessibility'].score * 100}, threshold is ${thresholds['accessibility']}`);
        }

        if (resultArray['best-practices'].score * 100 < thresholds['best-practices']) {
            console.log(`best-practices failed - score is ${resultArray['best-practices'].score * 100}, threshold is ${thresholds['best-practices']}`);
        }

        if (resultArray['seo'].score * 100 < thresholds['seo']) {
            console.log(`seo failed - score is ${resultArray['seo'].score * 100}, threshold is ${thresholds['seo']}`);
        }

        await page.close();
        await browser.close();
    })
});