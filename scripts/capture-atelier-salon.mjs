// Isolated seed-only visual evidence. Never uses the operator database or preview.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const statesOnly = process.argv.includes('--states');
const out = `artifacts/atelier-salon/${phase}${statesOnly ? '/states' : ''}`;
await mkdir(out, { recursive: true });
const port = 3122;
await new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once('error', reject);
  probe.listen(port, '127.0.0.1', () => probe.close(resolve));
});
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: 'ignore', env: { ...process.env, BTS_DATABASE_PATH: '', ADMIN_USERNAME: '', ADMIN_PASSWORD_HASH: '', ADMIN_SESSION_SECRET: '' } });
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
  const widths = phase === 'before' ? [320, 390, 768, 1440] : [320, 360, 390, 768, 1440];
  for (const design of statesOnly ? [] : ['atelier', 'gallery', 'linen', 'salon']) {
    for (const width of design === 'atelier' ? widths : [390, 1440]) {
      for (const locale of ['en', 'ar']) {
        const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
        // Actual chooser keeps DesignText and the pre-paint design store in sync.
        await page.getByRole('button', { name: 'Choose Design', exact: true }).click();
        const names = { atelier: 'Botanical Atelier', gallery: 'Modern Gallery', linen: 'Linen Boutique', salon: 'Scent Salon' };
        await page.getByRole('button', { name: `Preview ${names[design]}`, exact: true }).click();
        const routes = [['home', ''], ['catalogue', '/catalogue'], ['product', '/perfumes/dior-spice-blend-p0168']];
        if (phase === 'after' && design === 'atelier') routes.push(['long-product', '/perfumes/giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042']);
        for (const [kind, path] of routes) {
          await page.goto(`${origin}/${locale}${path}`, { waitUntil: 'networkidle' });
          await page.evaluate(async () => {
            await document.fonts.ready;
            for (const image of document.images) image.loading = 'eager';
            const height = document.documentElement.scrollHeight;
            for (let y = 0; y < height; y += 750) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 20)); }
            await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
            scrollTo(0, 0);
          });
          const name = `${design}-${kind}-${locale}-${width}`;
          await page.screenshot({ path: `${out}/${name}-opening.png` });
          await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
          const metrics = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - innerWidth,
            failedImages: [...document.images].filter(image => image.getClientRects().length && !image.naturalWidth).map(image => image.src),
            h1: document.querySelector('h1')?.textContent,
          }));
          results.push({ name, ...metrics, errors: [...errors] });
        }
        await context.close();
      }
    }
  }
  if (statesOnly) {
    for (const width of [320, 390, 768, 1440]) for (const locale of ['en', 'ar']) {
      const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      async function capture(state, locator) {
        await locator.scrollIntoViewIfNeeded();
        await page.evaluate(async () => {
          await document.fonts.ready;
          const visible = [...document.images].filter(image => image.getClientRects().length);
          for (const image of visible) image.loading = 'eager';
          await Promise.all(visible.map(image => image.decode().catch(() => {})));
        });
        const name = `${state}-${locale}-${width}`;
        await page.screenshot({ path: `${out}/${name}.png` });
        const metrics = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          failedImages: [...document.images].filter(image => image.getClientRects().length && !image.naturalWidth).map(image => image.src),
        }));
        results.push({ name, ...metrics, errors: [...errors] });
      }
      await page.goto(`${origin}/${locale}?scent=rose#scents`, { waitUntil: 'networkidle' });
      const preview = page.locator('[data-placement="discovery"]');
      await capture('rose', preview);
      await page.getByRole('tab').last().click();
      await capture('families', page.getByRole('tabpanel'));
      await page.locator('#houses button[aria-haspopup="dialog"]').click();
      await capture('directory', page.getByRole('dialog'));
      await page.keyboard.press('Escape');
      await page.goto(`${origin}/${locale}/catalogue`, { waitUntil: 'networkidle' });
      const toggle = page.locator('button[aria-controls="catalogue-filters"]');
      if (await toggle.isVisible()) await toggle.click();
      await capture('filters', page.locator('#catalogue-filters'));
      await page.goto(`${origin}/${locale}/perfumes/dior-spice-blend-p0168`, { waitUntil: 'networkidle' });
      await page.getByRole('article').getByRole('button').filter({ has: page.locator('img') }).click();
      await capture('photo', page.getByRole('dialog'));
      await context.close();
    }
  }
  await writeFile(`${out}/measurements.json`, JSON.stringify(results, null, 2));
  console.log(`${results.length} route/viewport captures; ${results.filter(item => item.overflow || item.errors.length || item.failedImages.length).length} with measurement warnings`);
} finally {
  await browser?.close();
  server.kill();
}
