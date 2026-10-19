import { chromium } from '@playwright/test';
import { mkdir, rename } from 'node:fs/promises';
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
await mkdir('docs/screenshots', { recursive: true });
await mkdir('docs/video', { recursive: true });
for (const [device, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: { dir: 'docs/video', size: { width, height } },
  });
  const page = await context.newPage();
  const video = page.video();
  await page.goto('http://127.0.0.1:4322/');
  await page.locator('#materialy').scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  for (const [index, name] of ['oak', 'stone', 'green'].entries()) {
    await page.getByRole('tab').nth(index).click();
    await page.waitForFunction(() => {
      const image = document.querySelector('.material-panel:not([hidden]) img');
      return (
        image instanceof HTMLImageElement &&
        image.complete &&
        image.naturalWidth > 0
      );
    });
    await page.waitForTimeout(900);
    await page
      .locator('.materials-studio')
      .screenshot({ path: `docs/screenshots/materials-${name}-${device}.png` });
  }
  await page.getByRole('tabpanel').getByRole('link').click();
  await page.locator('.gallery').scrollIntoViewIfNeeded();
  await page
    .getByRole('button', { name: 'Powiększ: Drugie ujęcie — wizualizacja AI' })
    .click();
  await page.getByRole('dialog').waitFor();
  await page.waitForFunction(() => {
    const image = document.querySelector('.lightbox-image');
    return (
      image instanceof HTMLImageElement &&
      image.complete &&
      image.naturalWidth > 0 &&
      document.querySelector('.lightbox')?.getAttribute('aria-busy') === 'false'
    );
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `docs/screenshots/second-view-${device}.png` });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await context.close();
  await rename(
    await video.path(),
    `docs/video/materialy-i-ujecia-${device}.webm`,
  );
}
await browser.close();
console.log('Zapisano paletę i dodatkowe ujęcia na komputerze i telefonie.');
