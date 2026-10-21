import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
const chrome = await chromeLauncher.launch({
  chromePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
});
await mkdir('docs/audits', { recursive: true });
const summary = [];
try {
  for (const [slug, path] of [
    ['home', '/'],
    ['wardrobe', '/projekty/garderoba-we-wnece/'],
  ]) {
    const result = await lighthouse(`http://127.0.0.1:4322${path}`, {
      port: chrome.port,
      output: ['html', 'json'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      logLevel: 'error',
    });
    if (!result) throw new Error('Brak raportu Lighthouse');
    await writeFile(`docs/audits/${slug}.html`, result.report[0]);
    await writeFile(`docs/audits/${slug}.json`, result.report[1]);
    const { lhr } = result;
    const value = {
      path,
      date: lhr.fetchTime,
      lighthouse: lhr.lighthouseVersion,
      userAgent: lhr.environment.hostUserAgent,
      formFactor: lhr.configSettings.formFactor,
      throttling: lhr.configSettings.throttling,
      throttlingMethod: lhr.configSettings.throttlingMethod,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, item]) => [
          key,
          Math.round(item.score * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'speed-index',
          'total-blocking-time',
          'cumulative-layout-shift',
        ].map((key) => [key, lhr.audits[key].displayValue]),
      ),
      warnings: lhr.runWarnings,
    };
    summary.push(value);
    console.log(value);
  }
  await writeFile(
    'docs/audits/summary.json',
    JSON.stringify(summary, null, 2) + '\n',
  );
} finally {
  await Promise.resolve(chrome.kill());
}
