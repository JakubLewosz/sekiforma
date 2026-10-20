import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  output: 'static',
  site:
    process.env.SITE_URL ??
    'https://sek-i-forma-portfolio.frostyclove2.chatgpt.site',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
