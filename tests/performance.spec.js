const { test, TestInfo } = require('@playwright/test');
const { chromium } = require('playwright')

test("Capture performance traces by marking actions using Performance API", async ({ page, browser }) => {
  console.log("========== Start Tracing Perf ===========")
  await browser.startTracing(page, { path: './perfTraces.json', screenshots: true })
  await page.goto('/');
  //Using Performanc.mark API
  await page.evaluate(() => (window.performance.mark('Perf:Started')))
  await page.locator('h1')

  //Using performance.mark API
  await page.evaluate(() => (window.performance.mark('Perf:Ended')))

  //Performance measure
  await page.evaluate(() => (window.performance.measure("overall", "Perf:Started", "Perf:Ended")))

  //To get all performance marks
  const getAllMarksJson = await page.evaluate(() => (JSON.stringify(window.performance.getEntriesByType("mark"))))
  const getAllMarks = await JSON.parse(getAllMarksJson)
  console.log('window.performance.getEntriesByType("mark")', getAllMarks)

  //To get all performance measures of Google
  const getAllMeasuresJson = await page.evaluate(() => (JSON.stringify(window.performance.getEntriesByType("measure"))))
  const getAllMeasures = await JSON.parse(getAllMeasuresJson)
  console.log('window.performance.getEntriesByType("measure")', getAllMeasures)
  console.log("======= Stop Tracing ============")
  await browser.stopTracing()
})

test("Capture resource timing by marking actions using Performance API", async ({page}) => {

  // const { chromium } = require('playwright')
  const browser = await chromium.launch()
  await page.goto('/')

  const resourceTimingJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType('resource'))
  )

  const resourceTiming = JSON.parse(resourceTimingJson)
  const logoResourceTiming = resourceTiming.find((element) =>
    element.name.includes('.png')
  )

  console.log(logoResourceTiming)

  await browser.close()
})

test("Capture paint by marking actions using Performance API", async ({page}) => {

  const browser = await chromium.launch()
  await page.goto('/')

  const paintTimingJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType('paint'))
  )
  const paintTiming = JSON.parse(paintTimingJson)

  console.log(paintTiming)

  await browser.close()
})