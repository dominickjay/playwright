const { test, expect } = require('@playwright/test');

test('check for meta tags', async ({ page }) => {
  await page.goto('/');
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute('content', /.*/);
});

test('check for bugherd', async ({ page }) => {
  await page.goto('/');

  const linkList = await page.locator('script');
  for(let i = 0; i < await linkList.count(); i++) {
    const link = expect(await linkList.nth(i).getAttribute('[href*="bugherd.com"]'));
    if (link) {
        // console.log(link);
        console.log('has bugherd');
      }
  }
});

test('check for favicon', async ({ page }) => {
  await page.goto('/');
  var getFavicon = function(){
    var favicon = undefined;
    var nodeList = document.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++)
    {
        if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
        {
            favicon = nodeList[i].getAttribute("href");
        }
    }
    return favicon;
}

  alert(getFavicon());​
});