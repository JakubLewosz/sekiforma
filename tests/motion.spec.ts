import { test, expect } from '@playwright/test';

test('sekcje pojawiają się raz, a zmiana preferencji ruchu kończy efekt', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const card = page.locator('.project-card').first();
  await card.evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await expect
    .poll(() =>
      card.evaluate((element) =>
        element.getAnimations().some((a) => a.playState === 'running'),
      ),
    )
    .toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      card.evaluate((element) => ({
        opacity: getComputedStyle(element).opacity,
        animations: element.getAnimations().length,
      })),
    )
    .toEqual({ opacity: '1', animations: 0 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await card.evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
});

test('ograniczony ruch: brak wejścia nagłówka i animacji sekcji', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(
    await page
      .locator('.hero-line > span')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  const card = page.locator('.project-card').first();
  await card.evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await expect(card).toBeVisible();
  expect(
    await card.evaluate((element) => getComputedStyle(element).opacity),
  ).toBe('1');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
  await page
    .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
    .click();
  await expect(page.locator('.project-cover')).toBeVisible();
});

for (const width of [390, 1440])
  test(`zdjęcie łączy kartę i koncepcję, również po powrocie: ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      Object.assign(window, { nativeTransition: null });
      window.addEventListener('pagereveal', (event) => {
        const transition = (
          event as Event & {
            viewTransition?: { ready: Promise<void>; finished: Promise<void> };
          }
        ).viewTransition;
        if (!transition) return;
        transition.ready.then(
          () => {
            const style = getComputedStyle(
              document.documentElement,
              '::view-transition-group(project-image)',
            );
            Object.assign(window, {
              nativeTransition: {
                name: style.animationName,
                duration: style.animationDuration,
              },
            });
          },
          () => {},
        );
      });
    });
    await page.goto('/projekty');
    await page
      .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
      .click();
    await expect(page.locator('.project-cover')).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (
              window as Window & {
                nativeTransition?: { name: string; duration: string };
              }
            ).nativeTransition,
        ),
      )
      .toMatchObject({ duration: width < 800 ? '0.42s' : '0.62s' });
    expect(
      await page.evaluate(
        () =>
          (window as Window & { nativeTransition?: { name: string } })
            .nativeTransition?.name,
      ),
    ).not.toBe('none');
    await page.goBack();
    await expect(page).toHaveURL(/\/projekty\/?$/);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (
              window as Window & {
                nativeTransition?: { name: string; duration: string };
              }
            ).nativeTransition,
        ),
      )
      .toMatchObject({ duration: width < 800 ? '0.42s' : '0.62s' });
    expect(
      await page.evaluate(
        () =>
          (window as Window & { nativeTransition?: { name: string } })
            .nativeTransition?.name,
      ),
    ).not.toBe('none');
    await expect(
      page.getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' }),
    ).toBeVisible();
  });

test('nawigacja i galeria działają także bez natywnych przejść', async ({
  page,
}) => {
  await page.goto('/projekty');
  await page.addStyleTag({ content: '@view-transition { navigation: none; }' });
  await page
    .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
    .click();
  await page
    .getByRole('button', {
      name: 'Powiększ: Całość koncepcji — wizualizacja AI',
    })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Zamknij' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
