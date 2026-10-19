import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function readyImages(page: Page) {
  await page.evaluate(async () => {
    [...document.images]
      .filter((i) => i.hasAttribute('src'))
      .forEach((i) => (i.loading = 'eager'));
    await document.fonts.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.images]
          .filter(
            (i) =>
              i.hasAttribute('src') && (!i.complete || i.naturalWidth === 0),
          )
          .map((i) => i.currentSrc || i.src),
      ),
    )
    .toEqual([]);
}
const routes = [
  '/',
  '/oferta',
  '/projekty',
  '/projekty/jasna-kuchnia',
  '/projekty/garderoba-we-wnece',
  '/projekty/zabudowa-salonu',
  '/pracownia',
  '/kontakt',
];

test('brief: błędy, cofanie, podsumowanie i brak transmisji', async ({
  page,
}) => {
  const outbound: string[] = [];
  let started = false;
  page.on('request', (r) => {
    if (started) outbound.push(`${r.method()} ${r.url()}`);
  });
  await page.goto('/kontakt');
  await expect(page.getByRole('button', { name: 'Dalej' })).toBeEnabled();
  await readyImages(page);
  started = true;
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Wybierz rodzaj projektu',
  );
  await page.getByLabel('Jeszcze nie wiem', { exact: true }).check();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByRole('alert')).toContainText('Wybierz etap');
  await page.getByLabel('Mam wymiary', { exact: true }).check();
  await page
    .getByLabel('Co jest dla Ciebie ważne?')
    .fill('Jasne drewno, miejsce na książki.');
  await page.getByLabel('Preferowany termin').fill('Wiosna 2027');
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Wróć', exact: false }).click();
  await expect(page.getByLabel('Mam wymiary', { exact: true })).toBeChecked();
  await expect(page.getByLabel('Co jest dla Ciebie ważne?')).toHaveValue(
    'Jasne drewno, miejsce na książki.',
  );
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  await expect(
    page.getByText('Wpisz przykładowe imię.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Przykładowe imię').fill('Anna');
  await page
    .getByLabel('Przykładowy e-mail', { exact: true })
    .fill('bledny-adres');
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  await expect(page.getByRole('alert')).toContainText('Wpisz poprawny');
  await expect(
    page.getByLabel('Przykładowy e-mail', { exact: true }),
  ).toBeFocused();
  await page
    .getByLabel('Przykładowy e-mail', { exact: true })
    .fill('anna@example.com');
  await page.getByRole('button', { name: 'Wróć', exact: false }).click();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByLabel('Przykładowe imię')).toHaveValue('Anna');
  await expect(
    page.getByLabel('Przykładowy e-mail', { exact: true }),
  ).toHaveValue('anna@example.com');
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  await expect(
    page.getByRole('heading', { name: 'Twój pomysł ma już kształt.' }),
  ).toBeVisible();
  const summary = page.locator('.form-summary');
  for (const value of [
    'Jeszcze nie wiem',
    'Mam wymiary',
    'Jasne drewno, miejsce na książki.',
    'Wiosna 2027',
    'Anna',
    'anna@example.com',
  ])
    await expect(summary).toContainText(value);
  expect(outbound).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.reload();
  await expect(
    page.getByLabel('Jeszcze nie wiem', { exact: true }),
  ).not.toBeChecked();
});

test('każda koncepcja wybiera właściwy typ briefu', async ({ page }) => {
  for (const [slug, label] of [
    ['jasna-kuchnia', 'Kuchnia'],
    ['garderoba-we-wnece', 'Szafa lub garderoba'],
    ['zabudowa-salonu', 'Zabudowa salonu'],
  ]) {
    await page.goto(`/projekty/${slug}`);
    await page.getByRole('link', { name: 'Zacznij podobny brief' }).click();
    await expect(
      page.getByRole('radio', { name: label, exact: true }),
    ).toBeChecked();
  }
});

test('galeria: klawiatura, zmiana zdjęcia, fokus i Escape', async ({
  page,
}) => {
  await page.goto('/projekty/jasna-kuchnia');
  const opener = page.getByRole('button', {
    name: 'Powiększ: Całość koncepcji — wizualizacja AI',
  });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zamknij' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.lightbox-caption')).toContainText('wycinek');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Zamknij' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('menu mobilne i FAQ działają klawiaturą', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(
    page
      .locator('#main-nav')
      .getByRole('link', { name: 'Oferta', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  const faq = page.getByText('Czy potrzebuję gotowego projektu?', {
    exact: true,
  });
  await faq.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
});

for (const width of [320, 390, 768, 1440])
  test(`responsywność ${width}px: wszystkie adresy, obrazy i linki`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const targets = new Set<string>();
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /.{30}/,
      );
      await readyImages(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      for (const url of await page
        .locator('a[href]')
        .evaluateAll((links) =>
          links
            .map((link) => link.getAttribute('href') ?? '')
            .filter((h) => h.startsWith('/')),
        ))
        targets.add(url);
    }
    for (const target of targets) {
      const response = await request.get(target);
      expect(response.status(), target).toBe(200);
    }
    expect(errors).toEqual([]);
  });

test('dostępność automatyczna WCAG 2.2 AA na głównych stronach i krokach formularza', async ({
  page,
}) => {
  for (const route of routes) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
  await page.goto('/kontakt');
  await page.getByLabel('Kuchnia', { exact: true }).check();
  await page.getByRole('button', { name: 'Dalej' }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByLabel('Mam wymiary', { exact: true }).check();
  await page.getByRole('button', { name: 'Dalej' }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByLabel('Przykładowe imię').fill('Anna');
  await page
    .getByLabel('Przykładowy e-mail', { exact: true })
    .fill('anna@example.com');
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('statyczna treść bez JavaScript, 404, powiększenie tekstu i ograniczenie ruchu', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto('http://127.0.0.1:4322');
  await expect(staticPage.getByRole('heading', { level: 1 })).toContainText(
    'Meble, które',
  );
  await staticPage.goto('http://127.0.0.1:4322/projekty/jasna-kuchnia');
  await expect(
    staticPage.getByRole('link', { name: 'Zacznij podobny brief' }),
  ).toBeVisible();
  await staticPage.goto('http://127.0.0.1:4322/kontakt');
  await expect(
    staticPage.getByRole('button', { name: 'Dalej' }),
  ).toBeDisabled();
  await context.close();
  const response = await page.goto('/nie-ma-takiej-strony');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'nie ma formy',
  );
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addStyleTag({
    content:
      'html{font-size:200%} p,a,button,input,label,summary{font-size:1rem!important}',
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('brief na telefonie 320px: pełna ścieżka klawiaturą i reset', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/kontakt');
  await expect(page.getByRole('button', { name: 'Dalej' })).toBeEnabled();
  await page.getByLabel('Kuchnia', { exact: true }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(
    page.getByText('Na jakim jesteś etapie?', { exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel('Mam wymiary', { exact: true })).toBeChecked();
  await page.keyboard.press('Tab');
  await page.keyboard.insertText('Dębowe fronty.');
  await page.keyboard.press('Tab');
  await page.keyboard.insertText('Do ustalenia');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Sprawdź swój pomysł.' }),
  ).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.insertText('Anna');
  await page.keyboard.press('Tab');
  await page.keyboard.insertText('anna@example.com');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'Twój pomysł ma już kształt.' }),
  ).toBeVisible();
  await expect(page.locator('.form-summary')).toContainText('Dębowe fronty.');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Zacznij od nowa' }).click();
  await expect(page.getByLabel('Kuchnia', { exact: true })).not.toBeChecked();
});
