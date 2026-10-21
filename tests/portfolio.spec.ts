import { test, expect } from '@playwright/test';

for (const width of [320, 390, 768])
  test(`nawigacja bez JS ${width}px: wszystkie odnośniki są dostępne`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width, height: 844 },
    });
    const page = await context.newPage();
    for (const [name, path] of [
      ['Oferta', '/oferta/'],
      ['Koncepcje', '/projekty/'],
      ['Pracownia', '/pracownia/'],
      ['Porozmawiajmy', '/kontakt/'],
    ]) {
      await page.goto('http://127.0.0.1:4322/');
      await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
      const link = page
        .locator('#main-nav')
        .getByRole('link', { name, exact: true });
      await expect(link).toBeVisible();
      await link.focus();
      await expect(link).toBeFocused();
      const [response] = await Promise.all([
        page.waitForResponse((response) =>
          response.request().isNavigationRequest(),
        ),
        link.press('Enter'),
      ]);
      expect(response?.status()).toBe(200);
      expect(new URL(page.url()).pathname).toBe(path);
      expect(
        await page
          .locator('html')
          .evaluate((html) => html.scrollWidth <= innerWidth),
      ).toBe(true);
    }
    await context.close();
  });

test('nawigacja przy 799/800–900px i galeria na niskim ekranie', async ({
  page,
}) => {
  await page.goto('/');
  for (const width of [799, 800, 850, 900]) {
    await page.setViewportSize({ width, height: 600 });
    const menu = page.getByRole('button', { name: 'Menu' });
    const nav = page.locator('#main-nav');
    if (width < 800) {
      await expect(menu).toBeVisible();
      await expect(nav).toHaveJSProperty('inert', true);
      await menu.click();
    } else {
      await expect(menu).toBeHidden();
    }
    await expect(nav).toBeVisible();
    await expect(nav).toHaveJSProperty('inert', false);
    expect(
      await page
        .locator('html')
        .evaluate((html) => html.scrollWidth <= innerWidth),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 850, height: 360 });
  await page.goto('/projekty/jasna-kuchnia/');
  const opener = page.locator('.gallery-trigger').first();
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  for (const name of ['Zamknij', 'Poprzednie zdjęcie', 'Następne zdjęcie']) {
    const control = dialog.getByRole('button', { name });
    await expect(control).toBeInViewport();
  }
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.lightbox-count')).toHaveText('2 / 3');
  const image = dialog.locator('img');
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(image).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
