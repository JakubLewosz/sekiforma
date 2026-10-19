import { test, expect } from '@playwright/test';

for (const width of [390, 1440])
  test(`przewijanie ${width}px: zdjęcia pozostają widoczne i nieruchome w układzie`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    // A stationary pointer also catches hover effects triggered by scrolling.
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
        let minOpacity = 1;
        const shifted = new Set<string>();
        const photos = [
          ...document.querySelectorAll<HTMLImageElement>('main img'),
        ];
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
            ) {
              const style = getComputedStyle(element);
              opacity *= Number(style.opacity);
              if (style.transform !== 'none')
                shifted.add(
                  `${photo.alt}: ${element.tagName}.${element.className}`,
                );
            }
            minOpacity = Math.min(minOpacity, opacity);
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
            direction > 0 ? y <= bottom + 180 : y >= -180;
            y += 180 * direction
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
        return { minOpacity, shifted: [...shifted] };
      });
      expect(
        result.minOpacity,
        `${route}: zdjęcie zgasło w trakcie przewijania`,
      ).toBe(1);
      expect(
        result.shifted,
        `${route}: zdjęcie zostało przesunięte lub przeskalowane`,
      ).toEqual([]);
    }
  });
