import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) {
  test(`przewijanie ${width}px: zdjęcia płynnie się odsłaniają bez ponownego wygaszenia`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.mouse.move(width / 2, 450);
    for (const route of [
      '/',
      '/projekty',
      '/oferta',
      '/projekty/jasna-kuchnia',
      '/pracownia',
    ]) {
      await page.goto(route);
      await page.evaluate(async () => {
        [...document.images]
          .filter((image) => image.hasAttribute('src'))
          .forEach((image) => (image.loading = 'eager'));
        await document.fonts.ready;
      });
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.images]
              .filter((image) => image.hasAttribute('src'))
              .every((image) => image.complete && image.naturalWidth > 0),
          ),
        )
        .toBe(true);
      const result = await page.evaluate(async () => {
        const photos = [
          ...document.querySelectorAll<HTMLImageElement>('main img'),
        ];
        const last = new Map<HTMLImageElement, number>();
        const animated = new Set<string>();
        const drops = new Set<string>();
        const sample = () => {
          for (const photo of photos) {
            const bounds = photo.getBoundingClientRect();
            if (
              bounds.width === 0 ||
              bounds.bottom <= 0 ||
              bounds.top >= innerHeight
            )
              continue;
            let opacity = 1;
            for (
              let element: Element | null = photo;
              element;
              element = element.parentElement
            )
              opacity *= Number(getComputedStyle(element).opacity);
            if (opacity > 0.02 && opacity < 0.98) animated.add(photo.alt);
            if (opacity + 0.025 < (last.get(photo) ?? 0)) drops.add(photo.alt);
            last.set(photo, Math.max(last.get(photo) ?? 0, opacity));
          }
        };
        const frame = () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => {
              sample();
              resolve();
            }),
          );
        const bottom = document.documentElement.scrollHeight - innerHeight;
        for (const direction of [1, -1]) {
          for (
            let y = direction > 0 ? 0 : bottom;
            direction > 0 ? y <= bottom + 140 : y >= -140;
            y += 140 * direction
          ) {
            window.scrollTo({
              top: Math.max(0, Math.min(bottom, y)),
              behavior: 'instant',
            });
            await frame();
            await frame();
            await frame();
          }
        }
        return { animated: [...animated], drops: [...drops] };
      });
      expect(
        result.animated.length,
        `${route}: brak widocznej animacji zdjęć`,
      ).toBeGreaterThan(0);
      expect(
        result.drops,
        `${route}: widoczne zdjęcie ponownie zgasło`,
      ).toEqual([]);
    }
  });

  test(`późny start skryptu ${width}px: widoczne zdjęcie nie znika`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route('**/_astro/*.js', async (route) => {
      await gate;
      await route.continue();
    });
    try {
      await page.goto('/', { waitUntil: 'commit' });
      const frame = page.locator('.project-image-link').first();
      await frame.scrollIntoViewIfNeeded();
      await expect(frame.locator('img')).toBeVisible();
      release();
      await expect(frame).toHaveAttribute('data-reveal-state', 'done');
      const minOpacity = await frame.locator('img').evaluate(async (image) => {
        let min = 1;
        for (let i = 0; i < 45; i++) {
          await new Promise(requestAnimationFrame);
          let opacity = 1;
          for (
            let element: Element | null = image;
            element;
            element = element.parentElement
          )
            opacity *= Number(getComputedStyle(element).opacity);
          min = Math.min(min, opacity);
        }
        return min;
      });
      expect(minOpacity).toBe(1);
    } finally {
      release();
    }
  });
}

test('zdjęcie czeka na dekodowanie, a potem płynnie się odsłania', async ({
  page,
}) => {
  await page.addInitScript(() => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    Object.assign(window, { releaseDecode: release });
    const original = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = async function () {
      await original.call(this);
      await gate;
    };
  });
  await page.goto('/');
  const frame = page.locator('.project-image-link').first();
  await frame.scrollIntoViewIfNeeded();
  await expect(frame).toHaveAttribute('data-reveal-state', 'pending');
  expect(
    await frame
      .locator('img')
      .evaluate((image) => getComputedStyle(image).opacity),
  ).toBe('0');
  expect(
    await frame.evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    ),
  ).not.toBe('rgba(0, 0, 0, 0)');
  await page.evaluate(() =>
    (window as Window & { releaseDecode?: () => void }).releaseDecode?.(),
  );
  await expect(frame).toHaveAttribute('data-reveal-state', 'running');
  await expect(frame).toHaveAttribute('data-reveal-state', 'done');
  expect(
    await frame
      .locator('img')
      .evaluate((image) => getComputedStyle(image).opacity),
  ).toBe('1');
});
