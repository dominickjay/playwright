const { playAudit } = require('playwright-lighthouse');
const { test, chromium } = require('@playwright/test');
const { URLs } = require("../utils/urls.json");

// test.describe.configure({ mode: 'serial' });

URLs.forEach(url => {

	test(`Use Performance API to measure performance for ${url}`, async ({}, TestInfo) => {

		const browser = await chromium.launch({
				args: ['--remote-debugging-port=9222'],
				headless: true
		});

		const page = await browser.newPage();

		await page.goto(url);
		await test.slow();

		const [performanceTiming] = await page.evaluate(() => {
			const [timing] = performance.getEntriesByType('navigation');
			return [timing];
		});

		const navigationTimingJson = await page.evaluate(() =>
			JSON.stringify(performance.getEntriesByType('navigation'))
		)

		const navigationTiming = JSON.parse(navigationTimingJson)

		// Get the start to load event end time
		const startToLoadEventEnd = performanceTiming.loadEventEnd - performanceTiming.startTime;

		// Add the performance annotation to the HTML report
		if (navigationTiming[0].domComplete < 5000) {
			test.info().annotations.push({ type: 'Performance', description: `"${TestInfo.project.name}" - Navigation start to load event end: ${startToLoadEventEnd}ms` });
		} else {
			test.info().annotations.push({ type: 'Performance', description: `"${TestInfo.project.name}" - ERROR: domComplete took over 5 seconds - ${startToLoadEventEnd}ms total` });
		}
        await page.close();
        await browser.close();
	});

	test(`Use Resource Timing API to measure image load for ${url}`, async ({}, TestInfo) => {

		const browser = await chromium.launch({
			args: ['--remote-debugging-port=9222'],
			headless: true
		});

		const page = await browser.newPage();

		await page.goto(url);

		const resourceTimingJson = await page.evaluate(() =>
			JSON.stringify(window.performance.getEntriesByType('resource'))
		)

		const resourceTiming = JSON.parse(resourceTimingJson)
		const logoResourceTiming = resourceTiming.find((element) =>
			element.name.includes('.png')
		)

		let resourceName = logoResourceTiming.name.split('?')[0];
		let resourceDuration = Math.round(logoResourceTiming.duration * 100) / 100;
		console.log(resourceDuration)

		test.info().annotations.push({ type: 'Performance', description: `"${TestInfo.project.name}" - ${resourceName} took ${resourceDuration}ms to load` });

        await page.close();
        await browser.close();
	});

	test(`Use Layout Instability API to test for layout shifts on ${url}`, async ({}, TestInfo) => {

		const browser = await chromium.launch({
			args: ['--remote-debugging-port=9222'],
			headless: true
		});

		const page = await browser.newPage();

		await page.goto(url);

		const cummulativeLayoutShift = await page.evaluate(() => {
			return new Promise((resolve) => {
				let CLS = 0

				new PerformanceObserver((l) => {
				const entries = l.getEntries()

				entries.forEach(entry => {
					if (!entry.hadRecentInput) {
					CLS += entry.value
					}
				})

				resolve(CLS)
				}).observe({
					type: 'layout-shift',
					buffered: true
				})
			})
		})

		test.info().annotations.push({ type: 'Performance', description: `"${TestInfo.project.name}" - Cumulative Layout Shift score is ${parseFloat(cummulativeLayoutShift)}` });

        await page.close();
        await browser.close();
	});
});