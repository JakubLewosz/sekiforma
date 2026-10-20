import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const chrome =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browserName = process.env.PW_BROWSER === 'webkit' ? 'webkit' : 'chromium';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 45000,
  reporter: [
    ['list'],
    ['json', { outputFile: process.env.QA_REPORT ?? 'docs/qa-tests.json' }],
  ],
  use: {
    browserName,
    baseURL: 'http://127.0.0.1:4322',
    headless: true,
    launchOptions:
      browserName === 'chromium' && existsSync(chrome)
        ? { executablePath: chrome }
        : {},
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4322 --ignore-lock',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
