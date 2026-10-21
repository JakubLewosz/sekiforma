import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('paleta materiałów: ręczna aktywacja klawiaturą i przejście do koncepcji', async ({
  page,
}) => {
  await page.goto('/');
  const oak = page.getByRole('tab', { name: 'Naturalny dąb' });
  const stone = page.getByRole('tab', { name: 'Jasny kamień' });
  const green = page.getByRole('tab', { name: 'Zgaszona zieleń' });
  const panel = page.getByRole('tabpanel');
  await oak.focus();
  await page.keyboard.press('ArrowRight');
  await expect(stone).toBeFocused();
  await expect(oak).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(stone).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveAccessibleName('Jasny kamień');
  await expect(panel.getByRole('heading')).toHaveText(
    'Światło zatrzymane w detalu.',
  );
  await page.keyboard.press('End');
  await expect(green).toBeFocused();
  await page.keyboard.press('Space');
  await expect(panel).toHaveAccessibleName('Zgaszona zieleń');
  await page.keyboard.press('Tab');
  await expect(panel).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Home');
  await expect(oak).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(green).toBeFocused();
  await panel.getByRole('link').click();
  await expect(page).toHaveURL(/\/projekty\/zabudowa-salonu\/?$/);
});

for (const width of [320, 1440])
  test(`paleta materiałów: obrazy, dostępność i stały układ przy ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const tabs = page.getByRole('tab');
    const positions: number[] = [];
    for (const [index, target] of [
      '/projekty/jasna-kuchnia/',
      '/projekty/jasna-kuchnia/',
      '/projekty/zabudowa-salonu/',
    ].entries()) {
      await tabs.nth(index).click();
      const panel = page.getByRole('tabpanel');
      await expect(panel).toHaveCount(1);
      await expect(panel.getByRole('link')).toHaveAttribute('href', target);
      await expect
        .poll(() =>
          panel
            .locator('img')
            .evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
        )
        .toBe(true);
      expect(
        await panel.evaluate((element) => element.getAnimations().length),
      ).toBe(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      positions.push(
        await page
          .locator('.materials-note')
          .evaluate((element) => element.getBoundingClientRect().top + scrollY),
      );
      const result = await new AxeBuilder({ page })
        .include('.materials-studio')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(2);
    await page.addStyleTag({
      content:
        'html{font-size:200%} p,a,button,input,label,summary{font-size:1rem!important}',
    });
    for (let index = 0; index < 3; index++) {
      await tabs.nth(index).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });

test('trzy widoki każdej koncepcji: szybka zmiana zdjęć zachowuje właściwy obraz i podpis', async ({
  page,
}) => {
  for (const slug of [
    'jasna-kuchnia',
    'garderoba-we-wnece',
    'zabudowa-salonu',
  ]) {
    await page.goto(`/projekty/${slug}/`);
    const triggers = page.locator('.gallery-trigger');
    await expect(triggers).toHaveCount(3);
    expect(
      new Set(
        await triggers.evaluateAll((buttons) =>
          buttons.map((button) => (button as HTMLElement).dataset.full),
        ),
      ).size,
    ).toBe(3);
    const expected = await triggers.nth(2).getAttribute('data-alt');
    await triggers.first().click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.lightbox-count')).toHaveText('3 / 3');
    await expect(page.locator('.lightbox-image')).toHaveAttribute(
      'alt',
      expected ?? '',
    );
    await expect(page.getByRole('dialog')).toHaveAttribute(
      'aria-busy',
      'false',
    );
    await expect
      .poll(() =>
        page
          .locator('.lightbox-image')
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await page.keyboard.press('Escape');
    await expect(triggers.first()).toBeFocused();
  }
});
