import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const origin =
  process.env.DEMO_URL ??
  'https://sek-i-forma-portfolio.frostyclove2.chatgpt.site';
const output = process.env.QA_OUTPUT ?? 'docs/qa-public-2026-10-20.json';
const chrome =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  ...(existsSync(chrome) ? { executablePath: chrome } : {}),
});
const context = await browser.newContext({
  baseURL: origin,
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage();
await page.addInitScript(() => {
  window.nativeTransition = null;
  addEventListener('pagereveal', (event) => {
    event.viewTransition?.ready.then(
      () => {
        const style = getComputedStyle(
          document.documentElement,
          '::view-transition-group(project-image)',
        );
        window.nativeTransition = {
          name: style.animationName,
          duration: style.animationDuration,
        };
      },
      () => {},
    );
  });
});
const errors = [],
  failed = [],
  fonts = new Set(),
  links = new Set();
page.on('pageerror', (error) =>
  errors.push({ url: page.url(), message: error.message }),
);
page.on('response', (response) => {
  if (response.request().resourceType() === 'font') fonts.add(response.url());
  if (
    response.status() >= 400 &&
    !response.url().includes('/nie-ma-takiej-strony')
  )
    failed.push(`${response.status()} ${response.url()}`);
});
async function loaded() {
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
          .filter((i) => i.hasAttribute('src'))
          .every((i) => i.complete && i.naturalWidth > 0),
      ),
    )
    .toBe(true);
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
const checked = [];
try {
  for (const route of routes) {
    for (const reload of [false, true]) {
      const response = reload ? await page.reload() : await page.goto(route);
      assert.equal(response.status(), 200, route);
      await expect(page.locator('h1')).toHaveCount(1);
      await loaded();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new URL(route === '/' ? route : `${route}/`, origin).href,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        `${origin}/og-image.jpg`,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      );
    }
    checked.push({ route, direct: 200, reload: 200 });
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href'))))
      links.add(href);
  }
  for (const href of links)
    assert.equal((await context.request.get(href)).status(), 200, href);
  for (const path of ['/favicon.svg', '/og-image.jpg', '/robots.txt'])
    assert.equal((await context.request.get(path)).status(), 200, path);
  assert.match(
    await (await context.request.get('/robots.txt')).text(),
    /Disallow: \/\s/,
  );
  assert(fonts.size > 0, 'No local font loaded');
  assert(
    [...fonts].every((url) => url.startsWith(`${origin}/`)),
    'External font request',
  );
  await page.goto('/');
  for (const name of ['Naturalny dąb', 'Jasny kamień', 'Zgaszona zieleń']) {
    await page.getByRole('tab', { name }).click();
    await expect(page.getByRole('tabpanel')).toHaveAccessibleName(name);
    await expect
      .poll(() =>
        page
          .getByRole('tabpanel')
          .locator('img')
          .evaluate((i) => i.complete && i.naturalWidth > 0),
      )
      .toBe(true);
  }
  await page
    .getByRole('link', { name: 'Zobacz koncepcję: Jasna kuchnia' })
    .click();
  await expect
    .poll(() => page.evaluate(() => window.nativeTransition))
    .toMatchObject({ duration: '0.42s' });
  assert.notEqual(
    await page.evaluate(() => window.nativeTransition.name),
    'none',
  );
  const opener = page.locator('.gallery-trigger').first();
  await opener.click();
  for (const count of ['1 / 3', '2 / 3', '3 / 3']) {
    await expect(page.locator('.lightbox-count')).toHaveText(count);
    await expect(page.getByRole('dialog')).toHaveAttribute(
      'aria-busy',
      'false',
    );
    await expect
      .poll(() =>
        page
          .locator('.lightbox-image')
          .evaluate((i) => i.complete && i.naturalWidth > 0),
      )
      .toBe(true);
    if (count !== '3 / 3') await page.keyboard.press('ArrowRight');
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(opener).toBeFocused();
  await page.locator('.site-header .logo').click();
  await expect(page).toHaveURL(`${origin}/`);
  await expect
    .poll(() => page.evaluate(() => window.nativeTransition))
    .toMatchObject({ duration: '0.42s' });
  assert.notEqual(
    await page.evaluate(() => window.nativeTransition.name),
    'none',
  );
  for (const [slug, name] of [
    ['jasna-kuchnia', 'Kuchnia'],
    ['garderoba-we-wnece', 'Szafa lub garderoba'],
    ['zabudowa-salonu', 'Zabudowa salonu'],
  ]) {
    await page.goto(`/projekty/${slug}`);
    await page.getByRole('link', { name: 'Zacznij podobny brief' }).click();
    await expect(page.getByRole('radio', { name, exact: true })).toBeChecked();
  }
  await loaded();
  const outgoing = [];
  const listener = (r) => {
    if (new URL(r.url()).pathname !== '/favicon.svg')
      outgoing.push(`${r.method()} ${r.url()}`);
  };
  page.on('request', listener);
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByRole('alert')).toContainText('Wybierz etap');
  await page.getByLabel('Mam wymiary', { exact: true }).check();
  await page
    .getByLabel('Co jest dla Ciebie ważne?')
    .fill('Przykładowy brief portfolio.');
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  await expect(
    page.getByText('Wpisz przykładowe imię.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Przykładowe imię').fill('Anna');
  await page
    .getByLabel('Przykładowy e-mail', { exact: true })
    .fill('anna@example.com');
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  await expect(page.locator('.form-summary')).toContainText(
    'Przykładowy brief portfolio.',
  );
  await page
    .getByRole('link', { name: 'Porozmawiaj z Jakubem o swoim projekcie' })
    .click();
  await expect(page.locator('#autor')).toBeFocused();
  await expect(
    page.locator('#autor a[href="mailto:jakub.lewosz.it@gmail.com"]'),
  ).toBeVisible();
  await expect(
    page.locator('#autor a[href="https://github.com/JakubLewosz"]'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Zmień odpowiedzi' }).click();
  await expect(
    page.getByLabel('Zabudowa salonu', { exact: true }),
  ).toBeChecked();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByLabel('Co jest dla Ciebie ważne?')).toHaveValue(
    'Przykładowy brief portfolio.',
  );
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Zobacz podsumowanie' }).click();
  await page.getByRole('button', { name: 'Zacznij od nowa' }).click();
  await expect(
    page.getByLabel('Zabudowa salonu', { exact: true }),
  ).not.toBeChecked();
  assert.deepEqual(outgoing, []);
  assert.deepEqual(
    await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    [0, 0],
  );
  page.off('request', listener);
  const missing = await page.goto('/nie-ma-takiej-strony');
  assert.equal(missing.status(), 404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'nie ma formy',
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  const result = {
    date: new Date().toISOString(),
    origin,
    browser: browser.version(),
    viewport: { width: 390, height: 844 },
    routes: checked,
    localLinks: links.size,
    fonts: [...fonts],
    checks: [
      'all direct routes and reloads',
      'all embedded images and local fonts',
      'canonical, OG, favicon, noindex and robots',
      'local links',
      'all three materials',
      'home → concept → three gallery images → home',
      'native shared photograph transition in both directions: 390px, 420ms',
      'all concept brief prefills',
      'brief validation, correction, summary, author anchor, edit and reset',
      'no brief requests apart from favicon refresh; empty web storage',
      'custom HTTP 404; author mailto and GitHub href',
    ],
    javascriptErrors: errors,
    failedResponses: failed,
    result: 'passed',
  };
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(
    JSON.stringify({
      origin,
      result: 'passed',
      routes: checked.length,
      localLinks: links.size,
      output,
    }),
  );
} finally {
  await browser.close();
}
