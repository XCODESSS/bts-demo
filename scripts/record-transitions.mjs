// Record real normal-motion browser paint; no animation overrides or route mocks.
// Run from the isolated snapshot, with BTS_MOTION_OUTPUT pointing outside it.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
const out = process.env.BTS_MOTION_OUTPUT || 'artifacts/transitions/motion';
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
const observations = [];
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`${origin}/en`)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error('Isolated preview did not start');
  browser = await chromium.launch({ channel: 'chrome' });
  for (const width of [1440, 390]) {
    const viewport = { width, height: width === 390 ? 844 : 1000 };
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference', recordVideo: { dir: out, size: viewport } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    async function observe(label, action, selector, bottle) {
      const name = `${width}-${label}`;
      await page.screenshot({ path: `${out}/${name}-before.png` });
      await page.evaluate(({ selector, bottle }) => {
        cancelAnimationFrame(window.__motionRaf);
        window.__motionFrames = [];
        const sample = () => {
          const target = selector && document.querySelector(selector);
          window.__motionFrames.push({
            time: performance.now(),
            names: document.getAnimations().filter(a => a instanceof CSSAnimation).map(a => a.animationName),
            pseudoElements: document.getAnimations().map(a => a.effect?.pseudoElement).filter(Boolean),
            headerTop: document.querySelector('header')?.getBoundingClientRect().top,
            target: target ? { height: target.getBoundingClientRect().height, opacity: getComputedStyle(target).opacity, transform: getComputedStyle(target).transform } : null,
            bottleTransform: bottle ? getComputedStyle(document.documentElement, `::view-transition-group(${bottle})`).transform : null,
          });
          if (window.__motionFrames.length < 180) window.__motionRaf = requestAnimationFrame(sample);
        };
        sample();
      }, { selector, bottle });
      await action();
      await page.screenshot({ path: `${out}/${name}-during.png` });
      await page.waitForTimeout(550); // Recording only: allow this real animation to finish.
      await page.screenshot({ path: `${out}/${name}-after.png` });
      observations.push({ name, errors: [...errors], frames: await page.evaluate(() => window.__motionFrames) });
    }
    await page.goto(`${origin}/en`, { waitUntil: 'networkidle' });
    await observe('page', () => page.getByRole('main').getByRole('link', { name: 'Explore Collection', exact: true }).click());
    await page.goto(`${origin}/en/catalogue?brand=Dior`, { waitUntil: 'networkidle' });
    const card = page.getByTestId('product-card').getByRole('link');
    await card.hover();
    await page.waitForTimeout(300); // Genuine hover intent, not a production delay.
    await observe('bottle-forward', () => card.click(), null, 'bts-bottle-P0168');
    const photoTrigger = page.getByRole('article').locator('button:has(img)');
    await photoTrigger.scrollIntoViewIfNeeded();
    await observe('photo-open', () => photoTrigger.click(), 'dialog[data-motion-dialog][aria-label]');
    await observe('photo-close', () => page.keyboard.press('Escape'), 'dialog[data-motion-dialog][aria-label]');
    const back = page.getByRole('link', { name: 'Back to the Collection', exact: true });
    await back.hover();
    await observe('bottle-reverse', () => back.click(), null, 'bts-bottle-P0168');
    if (width === 390) {
      const toggle = page.locator('button[aria-controls="catalogue-filters"]');
      await observe('filters-open', () => toggle.click(), '#catalogue-filters');
      await observe('filters-close', () => toggle.click(), '#catalogue-filters');
      await page.evaluate(() => scrollTo(0, 0));
      await observe('menu-open', () => page.getByRole('button', { name: 'Open Menu', exact: true }).click(), '#mobile-navigation');
      await observe('menu-interrupt', async () => {
        await page.getByRole('button', { name: 'Close Menu', exact: true }).click();
        await page.getByRole('button', { name: 'Open Menu', exact: true }).click();
      }, '#mobile-navigation');
      await page.keyboard.press('Escape');
    }
    await page.goto(`${origin}/en#houses`, { waitUntil: 'networkidle' });
    const houses = page.locator('#houses button[aria-haspopup="dialog"]');
    await houses.scrollIntoViewIfNeeded();
    await observe('house-open', () => houses.click(), 'dialog[aria-labelledby="brand-directory-title"]');
    await observe('house-close', () => page.keyboard.press('Escape'), 'dialog[aria-labelledby="brand-directory-title"]');
    const shipping = page.getByRole('contentinfo').getByRole('button', { name: 'Shipping Information', exact: true });
    await shipping.scrollIntoViewIfNeeded();
    await observe('footer-open', () => shipping.click(), 'dialog[aria-labelledby="footer-information-title"]');
    await observe('footer-close', () => page.keyboard.press('Escape'), 'dialog[aria-labelledby="footer-information-title"]');
    const chooser = page.getByRole('button', { name: 'Choose Design', exact: true });
    await chooser.scrollIntoViewIfNeeded();
    await observe('design-open', () => chooser.click(), '.design-dialog');
    await observe('design-close', () => page.keyboard.press('Escape'), '.design-dialog');
    await chooser.click();
    await observe('design-switch', () => page.getByRole('button', { name: 'Preview Modern Gallery', exact: true }).click());
    const video = page.video();
    await context.close();
    await video.saveAs(`${out}/${width}-normal-motion.webm`);
  }
  await writeFile(`${out}/observations.json`, JSON.stringify({ browser: browser.version(), observations }, null, 2));
  console.log(`${observations.length} real interactions recorded`);
} finally {
  await browser?.close();
  server.kill();
}
