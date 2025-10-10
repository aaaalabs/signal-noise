/**
 * Simple post-build prerendering script
 * Generates static HTML for blog routes with correct canonical tags for SEO
 * Saves to public/prerender/ for deployment (dist/ is gitignored)
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import handler from 'serve-handler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');
const prerenderDir = path.join(__dirname, '..', 'public', 'prerender');
const PORT = 5555;

// Published blog routes (keep in sync with BlogIndex.tsx)
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/blog', file: 'blog/index.html' },
  { path: '/blog/steve-jobs-method', file: 'blog/steve-jobs-method.html' },
  { path: '/blog/75-percent-tasks', file: 'blog/75-percent-tasks.html' },
  { path: '/blog/elon-musk-100-signal', file: 'blog/elon-musk-100-signal.html' },
  { path: '/blog/founder-productivity-paradox', file: 'blog/founder-productivity-paradox.html' },
  { path: '/blog/signal-vs-noise-philosophy', file: 'blog/signal-vs-noise-philosophy.html' },
  { path: '/blog/three-things-productivity', file: 'blog/three-things-productivity.html' },
  { path: '/blog/90-day-tracking-experiment', file: 'blog/90-day-tracking-experiment.html' }
];

async function prerender() {
  // Skip prerendering in Vercel CI environment (prerendered files already in git)
  if (process.env.VERCEL || process.env.CI) {
    console.log('⏭️  Skipping prerendering in CI environment (using committed prerendered files)\n');
    return;
  }

  console.log('🚀 Starting prerendering...\n');

  // Start local server
  const server = createServer((request, response) => {
    return handler(request, response, {
      public: distDir,
      cleanUrls: false,
      rewrites: [{ source: '**', destination: '/index.html' }]
    });
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`🌐 Local server started on http://localhost:${PORT}\n`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const route of routes) {
    try {
      const url = `http://localhost:${PORT}${route.path}`;
      console.log(`📄 Prerendering: ${route.path}`);

      // Navigate to route
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Wait for render-event signal from React
      await page.evaluate(() => {
        return new Promise((resolve) => {
          document.addEventListener('render-event', resolve, { once: true });
          setTimeout(resolve, 2000); // Fallback timeout
        });
      });

      // Get the fully rendered HTML
      const html = await page.content();

      // Save to appropriate file
      const filePath = path.join(distDir, route.file);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, html);

      console.log(`  ✅ Saved: ${route.file}`);

      // Verify canonical tag
      const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href')).catch(() => 'NOT FOUND');
      console.log(`  🔗 Canonical: ${canonical}\n`);

    } catch (error) {
      console.error(`  ❌ Error rendering ${route.path}:`, error.message);
    }
  }

  await browser.close();
  server.close();
  console.log('✨ Prerendering complete!\n');
}

prerender().catch(console.error);
