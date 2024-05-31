const { playAudit } = require('playwright-lighthouse');
const { test, chromium } = require('@playwright/test');
const { URLs } = require("../utils/urls.json");

const options = {
		loglevel: "info",
}

test.describe.configure({ mode: 'serial' });

URLs.forEach(url => {

	test(`Use Performance API to measure performance for ${url}`, async ({}, TestInfo) => {

		const browser = await chromium.launch({
				args: ['--remote-debugging-port=9222'],
				headless: true
		});

		const page = await browser.newPage();
			await page.goto(url);
			await test.slow()

			const [performanceTiming] = await page.evaluate(() => {
				const [timing] = performance.getEntriesByType('navigation');
				return [timing];
			});
			// Get the start to load event end time
			const startToLoadEventEnd = performanceTiming.loadEventEnd - performanceTiming.startTime;

			// Add the performance annotation to the HTML report
			test.info().annotations.push({ type: 'Performance', description: `"${TestInfo.project.name}" - Navigation start to load event end: ${startToLoadEventEnd}ms` });
		});

	test(`Simulate slow network connection for ${url}`, async () => {

		const browser = await chromium.launch({
			args: ['--remote-debugging-port=9222'],
			headless: true
		});

		const page = await browser.newPage();

		const client = await page.context().newCDPSession(page);
		await client.send('Network.enable');
		await client.send('Network.emulateNetworkConditions', {
			offline: false,
			downloadThroughput: (2 * 1024 * 1024) / 4,
			uploadThroughput: (3 * 1024 * 1024) / 4,
			connectionType: 'cellular2g',
			latency: 10,
		});
		await page.goto(url);
	});

	// test(`Run Lighthouse Performance Audit for ${url}`, async () => {

	//   const browser = await chromium.launch({
	//     args: ['--remote-debugging-port=9222'],
	//     headless: true
	//   });

	//   const page = await browser.newPage();
	//   await page.goto(url);

	//   await playAudit({
	//     page: page,
	//     thresholds: {
	//       performance: 90,
	//     },
	//     port: 9222,
	//     ignoreError: true,
	//     opts: options,
	//     reports: {
	//       formats: {
	//         html: true,
	//       },
	//       name: `report-${new Date().toISOString()}`, //defaults to `lighthouse-${new Date().getTime()}`
	//       directory: `build/reports/performance/lighthouse/`
	//     },
	//   });

	//   await page.close();
	//   await browser.close();
	// });
});