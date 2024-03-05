const { test, expect } = require('@playwright/test');

test('check for meta tags', async ({ page }) => {
  await page.goto('/');
  // const metaTitle = page.locator('meta[name="title"]');
  // await expect(metaTitle).toHaveAttribute('content', /.*/);
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute('content', /.*/);
});

test('check for bugherd', async ({ page }) => {
  await page.goto('/');

  const linkList = await page.locator('script');
  for(let i = 0; i < await linkList.count(); i++) {
    const link = expect(await linkList.nth(i).getAttribute('[href*="bugherd.com"]'));
    if (link) {
        // console.log(link.get);
        console.log('has bugherd');
      }
  }
});