import { chromium } from '@playwright/test';
import { mkdir, rename } from 'node:fs/promises';
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
await mkdir('docs/video', { recursive: true });
for (const [device, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'no-preference',
    recordVideo: { dir: 'docs/video', size: { width, height } },
  });
  const page = await context.newPage();
  const video = page.video();
  await page.goto('http://127.0.0.1:4322/');
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(width / 2, height / 2);
  await page.waitForTimeout(800);
  for (const direction of [1, -1]) {
    await page.evaluate(async (direction) => {
      const start = scrollY;
      const end =
        direction > 0 ? document.documentElement.scrollHeight - innerHeight : 0;
      const duration =
        (Math.abs(end - start) / (direction > 0 ? 900 : 1500)) * 1000;
      await new Promise((resolve) => {
        let began;
        const frame = (timestamp) => {
          began ??= timestamp;
          const progress = Math.min(1, (timestamp - began) / duration);
          window.scrollTo({
            top: start + (end - start) * progress,
            behavior: 'instant',
          });
          if (progress < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
    }, direction);
    await page.waitForTimeout(400);
  }
  await context.close();
  await rename(await video.path(), `docs/video/scroll-${device}.webm`);
}
await browser.close();
console.log('Zapisano przewijanie bez wygaszania i powiększania zdjęć.');
