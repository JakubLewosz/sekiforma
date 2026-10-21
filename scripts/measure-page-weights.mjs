import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const pages = [];
try {
  for (const slug of [
    'jasna-kuchnia',
    'garderoba-we-wnece',
    'zabudowa-salonu',
  ]) {
    const context = await browser.newContext({
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4322/projekty/${slug}/`);
    await page.evaluate(() =>
      [...document.images]
        .filter((image) => image.hasAttribute('src'))
        .forEach((image) => (image.loading = 'eager')),
    );
    await page.waitForFunction(() =>
      [...document.images]
        .filter((image) => image.hasAttribute('src'))
        .every((image) => image.complete && image.naturalWidth > 0),
    );
    await page.evaluate(() => document.fonts.ready);
    const weight = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const navigation = performance.getEntriesByType('navigation');
      return [...navigation, ...resources].reduce(
        (total, entry) => total + entry.encodedBodySize,
        0,
      );
    });
    pages.push({ path: `/projekty/${slug}/`, encodedBodyBytes: weight });
    await context.close();
  }
  pages.sort((a, b) => b.encodedBodyBytes - a.encodedBodyBytes);
  const result = {
    date: new Date().toISOString(),
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    cache: 'fresh browser context for every page',
    scope:
      'document and resources after loading all inline images; lightbox full-size assets excluded',
    pages,
  };
  await writeFile(
    'docs/audits/page-weights.json',
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log(result);
} finally {
  await browser.close();
}
