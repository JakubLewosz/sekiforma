import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, rename } from 'node:fs/promises';
const chrome =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(chrome) ? { executablePath: chrome } : {}),
});
await mkdir('docs/screenshots', { recursive: true });
async function loaded(page) {
  await page.evaluate(async () => {
    [...document.images]
      .filter((i) => i.hasAttribute('src'))
      .forEach((i) => (i.loading = 'eager'));
    await document.fonts.ready;
  });
  await page.waitForFunction(() =>
    [...document.images]
      .filter((i) => i.hasAttribute('src'))
      .every((i) => i.complete && i.naturalWidth > 0),
  );
  await page.evaluate(async () => {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}

for (const [width, height, path, name, fullPage] of [
  [1440, 1000, '/', 'home-desktop', true],
  [390, 844, '/', 'home-mobile', true],
  [1440, 1000, '/', 'home-desktop-first-screen', false],
  [390, 844, '/', 'home-mobile-first-screen', false],
  [1440, 1000, '/projekty/jasna-kuchnia', 'kitchen-desktop', true],
  [390, 844, '/kontakt?typ=kuchnia', 'brief-mobile', true],
  [1440, 1000, '/pracownia', 'studio-desktop', true],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  await page.goto(`http://127.0.0.1:4322${path}`);
  await loaded(page);
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage });
  await page.close();
}
await mkdir('docs/video', { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: 'docs/video', size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const video = page.video();
await page.goto('http://127.0.0.1:4322');
await loaded(page);
await page.waitForTimeout(1200);
await page.locator('.projects-section').scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await page
  .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
  .click();
await loaded(page);
await page.waitForTimeout(1000);
await page.getByRole('link', { name: 'Zacznij podobny brief' }).click();
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Dalej' }).click();
await page.getByLabel('Mam wymiary', { exact: true }).check();
await page
  .getByLabel('Co jest dla Ciebie ważne?')
  .fill('Jasne drewno i miejsce na wspólne gotowanie.');
await page.waitForTimeout(700);
await page.getByRole('button', { name: 'Dalej' }).click();
await page.getByLabel('Przykładowe imię').fill('Anna');
await page
  .getByLabel('Przykładowy e-mail', { exact: true })
  .fill('anna@example.com');
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
await page.locator('.brief-form').scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.screenshot({
  path: 'docs/screenshots/brief-summary-desktop.png',
  fullPage: true,
});
await context.close();
if (video)
  await rename(await video.path(), 'docs/video/przejscie-przez-strone.webm');
await browser.close();
console.log('Zapisano zrzuty i nagranie.');
