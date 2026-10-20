import { test, expect } from '@playwright/test';

test('zdjęcie ma animowane wejście, a ograniczenie ruchu odsłania wszystkie elementy', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const frame = page.locator('.project-image-link').first();
  await expect(frame).toHaveAttribute('data-reveal-state', 'pending');
  await frame.evaluate((element) =>
    element.scrollIntoView({ block: 'center', behavior: 'instant' }),
  );
  await expect(frame).toHaveAttribute('data-reveal-state', 'running');
  expect(
    await frame
      .locator('img')
      .evaluate((image) => image.getAnimations().length),
  ).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(frame).toHaveAttribute('data-reveal-state', 'done');
  await expect(
    page.locator(
      '[data-reveal-state="pending"], [data-reveal-state="running"]',
    ),
  ).toHaveCount(0);
  expect(
    await frame.locator('img').evaluate((image) => ({
      opacity: getComputedStyle(image).opacity,
      transform: getComputedStyle(image).transform,
    })),
  ).toEqual({ opacity: '1', transform: 'none' });
});

test('wejścia tekstu i zdjęcia nie powtarzają się po powrocie do sekcji', async ({
  page,
}) => {
  await page.goto('/');
  for (const selector of ['.project-image-link', '.process-grid > li']) {
    const element = page.locator(selector).first();
    await element.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    await expect(element).toHaveAttribute('data-reveal-state', 'done');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await element.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    expect(
      await element.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
  }
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

test('przerwane natywne przejście: zwykła nawigacja bez nieobsłużonej odmowy', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.addEventListener('pagereveal', (event) => {
      const transition = (
        event as Event & {
          viewTransition?: { skipTransition(): void; ready: Promise<void> };
        }
      ).viewTransition;
      transition?.ready.catch(() => {});
      transition?.skipTransition();
    });
  });
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
    .click();
  await expect(page).toHaveURL(/\/projekty\/jasna-kuchnia\/?$/);
  await page.locator('.gallery-trigger').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.locator('.site-header .logo').click();
  await expect(page).toHaveURL(/:\d+\/$/);
  expect(errors).toEqual([]);
});
