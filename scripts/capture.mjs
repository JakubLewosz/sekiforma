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
    await Promise.all(
      [...document.images]
        .filter((image) => image.hasAttribute('src'))
        .map((image) => image.decode().catch(() => {})),
    );
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
  [1440, 1000, '/projekty', 'projects-desktop', true],
  [390, 844, '/projekty', 'projects-mobile', true],
  [1440, 1000, '/projekty/jasna-kuchnia', 'kitchen-desktop', true],
  [390, 844, '/kontakt?typ=kuchnia', 'brief-mobile', true],
  [1440, 1000, '/pracownia', 'studio-desktop', true],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  await page.goto(`http://127.0.0.1:4322${path}`);
  await loaded(page);
  await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage });
  await page.close();
}
if (!process.argv.includes('--stills-only')) {
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
  await page.locator('.brief-author-cta').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page
    .getByRole('link', { name: 'Porozmawiaj z Jakubem o swoim projekcie' })
    .click();
  await page.locator('#autor').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: 'docs/screenshots/author-contact-desktop.png',
  });
  await context.close();
  if (video)
    await rename(await video.path(), 'docs/video/przejscie-przez-strone.webm');
}
// New portfolio views; static captures disable motion only for a settled frame.
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'reduce',
});
await mobile.goto('http://127.0.0.1:4322/kontakt?typ=kuchnia');
await mobile.getByRole('button', { name: 'Dalej' }).click();
await mobile.getByLabel('Mam wymiary', { exact: true }).check();
await mobile
  .getByLabel('Co jest dla Ciebie ważne?')
  .fill('Jasne drewno i miejsce na wspólne gotowanie.');
await mobile.getByRole('button', { name: 'Dalej' }).click();
await mobile.getByLabel('Przykładowe imię').fill('Anna');
await mobile
  .getByLabel('Przykładowy e-mail', { exact: true })
  .fill('anna@example.com');
await mobile.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
await loaded(mobile);
await mobile.screenshot({
  path: 'docs/screenshots/brief-summary-mobile.png',
  fullPage: true,
});
await mobile
  .locator('.brief-author-cta')
  .screenshot({ path: 'docs/screenshots/brief-author-mobile.png' });
await mobile.close();
const plain = await browser.newPage({
  viewport: { width: 320, height: 844 },
  javaScriptEnabled: false,
  reducedMotion: 'reduce',
});
await plain.goto('http://127.0.0.1:4322/');
await plain.screenshot({
  path: 'docs/screenshots/navigation-no-js-mobile.png',
});
await plain.close();
const short = await browser.newPage({
  viewport: { width: 850, height: 360 },
  reducedMotion: 'reduce',
});
await short.goto('http://127.0.0.1:4322/projekty/jasna-kuchnia');
await loaded(short);
await short.locator('.gallery-trigger').first().click();
await short.waitForFunction(
  () =>
    document.querySelector('.lightbox')?.getAttribute('aria-busy') === 'false',
);
await short.screenshot({ path: 'docs/screenshots/gallery-short-screen.png' });
await short.close();
await browser.close();
console.log('Zapisano zrzuty i nagranie.');
