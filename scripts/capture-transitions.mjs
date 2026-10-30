// Seed-only evidence on an owned port. Run from the isolated production snapshot.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const out = process.env.BTS_CAPTURE_OUTPUT || `artifacts/transitions/${phase}`;
await mkdir(out, { recursive: true });
const port = 3122;
await new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once('error', reject);
  probe.listen(port, '127.0.0.1', () => probe.close(resolve));
});
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  stdio: 'ignore', env: { ...process.env, BTS_DATABASE_PATH: '', ADMIN_USERNAME: '', ADMIN_PASSWORD_HASH: '', ADMIN_SESSION_SECRET: '' },
});
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`${origin}/en`)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error('Isolated preview did not start');
  browser = await chromium.launch({ channel: 'chrome' });
  const results = [];
  for (const [design, title] of Object.entries({ atelier: 'Botanical Atelier', gallery: 'Modern Gallery', linen: 'Linen Boutique', salon: 'Scent Salon' })) {
    for (const width of [320, 390, 768, 1440]) for (const locale of ['en', 'ar']) {
      const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/en`);
      await page.getByRole('button', { name: 'Choose Design', exact: true }).click();
      await page.getByRole('button', { name: `Preview ${title}`, exact: true }).click();
      for (const [kind, path] of [['home', ''], ['catalogue', '/catalogue'], ['product', '/perfumes/dior-spice-blend-p0168']]) {
        await page.goto(`${origin}/${locale}${path}`, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (const image of document.images) image.loading = 'eager';
          for (let y = 0; y < document.documentElement.scrollHeight; y += 750) {
            scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 20));
          }
          await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
          scrollTo(0, 0);
        });
        const name = `${design}-${kind}-${locale}-${width}`;
        await page.screenshot({ path: `${out}/${name}-opening.png` });
        await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
        results.push({ name, errors: [...errors], ...await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          failedImages: [...document.images].filter(image => image.getClientRects().length && !image.naturalWidth).map(image => image.src),
        })) });
      }
      await context.close();
    }
  }
  await writeFile(`${out}/measurements.json`, JSON.stringify({ browser: browser.version(), results }, null, 2));
  console.log(`${results.length} captures; ${results.filter(item => item.overflow || item.errors.length || item.failedImages.length).length} warnings`);
} finally {
  await browser?.close();
  server.kill();
}
