// Decode the recorded browser video into reviewable sequential frames (no ffmpeg).
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const root = process.argv[2] || 'artifacts/transitions/motion';
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  for (const width of [1440, 390]) {
    const data = (await readFile(`${root}/${width}-normal-motion.webm`)).toString('base64');
    await page.setContent(`<video muted src="data:video/webm;base64,${data}"></video>`);
    await page.locator('video').evaluate(video => new Promise(resolve => {
      if (video.readyState >= 1) return resolve();
      video.addEventListener('loadedmetadata', resolve, { once: true });
    }));
    const duration = await page.locator('video').evaluate(video => video.duration);
    console.log(width, 'duration', duration);
    const frames = [];
    const dir = `${root}/video-frames-${width}`;
    await mkdir(dir, { recursive: true });
    for (let t = 0.08; t < Math.min(duration, 12); t += 0.08) {
      const url = await page.locator('video').evaluate(async (video, time) => {
        await new Promise(resolve => { video.addEventListener('seeked', resolve, { once: true }); video.currentTime = time; });
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        return canvas.toDataURL('image/png');
      }, t);
      const buffer = Buffer.from(url.split(',')[1], 'base64');
      const name = `${t.toFixed(2)}.png`;
      await writeFile(`${dir}/${name}`, buffer);
      const image = await sharp(buffer).resize({ width: 216, height: 150, fit: 'contain', background: '#ddd' }).png().toBuffer();
      const label = Buffer.from(`<svg width="216" height="20"><rect width="216" height="20" fill="white"/><text x="5" y="15" font-size="14">${width}px · ${t.toFixed(2)}s</text></svg>`);
      frames.push({ input: await sharp({ create: { width: 216, height: 170, channels: 3, background: 'white' } }).composite([{ input: image, top: 0, left: 0 }, { input: label, top: 150, left: 0 }]).png().toBuffer() });
    }
    for (let start = 0; start < frames.length; start += 50) {
      const sheet = frames.slice(start, start + 50);
      await sharp({ create: { width: 2160, height: Math.ceil(sheet.length / 10) * 170, channels: 3, background: '#ddd' } })
        .composite(sheet.map((frame, i) => ({ ...frame, left: (i % 10) * 216, top: Math.floor(i / 10) * 170 })))
        .png().toFile(`${root}/${width}-sequence-${start}.png`);
    }
  }
} finally { await browser.close(); }
