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
await mkdir('docs/video', { recursive: true });
for (const [width, height, label] of [
  [1440, 900, 'desktop'],
  [390, 844, 'mobile'],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'no-preference',
    recordVideo: { dir: 'docs/video', size: { width, height } },
  });
  await context.addInitScript(() => {
    window.addEventListener('pagereveal', (event) => {
      if (event.viewTransition)
        event.viewTransition.ready.then(
          () => (document.documentElement.dataset.motionCaptureReady = 'true'),
          () => {},
        );
    });
  });
  const page = await context.newPage();
  const video = page.video();
  await page.goto('http://127.0.0.1:4322/');
  await page.waitForTimeout(1400);
  if (width < 800) {
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.waitForTimeout(350);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
  await page.locator('.projects-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page
    .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
    .click();
  await page.waitForFunction(
    () => document.documentElement.dataset.motionCaptureReady === 'true',
  );
  await page.waitForTimeout(width < 800 ? 100 : 180);
  await page.screenshot({
    path: `docs/screenshots/motion-transition-${label}.png`,
  });
  await page.waitForTimeout(800);
  await page.locator('.project-story').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page
    .getByRole('button', {
      name: 'Powiększ: Całość koncepcji — wizualizacja AI',
    })
    .click();
  await page.waitForTimeout(600);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  await page.goBack();
  await page.waitForTimeout(1000);
  await context.close();
  if (video)
    await rename(await video.path(), `docs/video/animacje-${label}.webm`);
}
await browser.close();
console.log('Zapisano nagrania animacji i kadry przejścia.');
