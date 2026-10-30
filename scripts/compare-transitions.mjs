// Pixel comparison of fresh reduced-motion captures, without changing baselines.
import sharp from 'sharp';
import { readdir, writeFile } from 'node:fs/promises';
const root = process.argv[2] || 'artifacts/transitions';
const results = [];
for (const name of (await readdir(`${root}/before`)).filter(name => name.endsWith('.png'))) {
  const before = await sharp(`${root}/before/${name}`).raw().toBuffer({ resolveWithObject: true });
  const after = await sharp(`${root}/after/${name}`).raw().toBuffer({ resolveWithObject: true });
  let differentPixels = 0;
  let maximumChannelDifference = 0;
  let changedPixelsOver8 = 0;
  const sameDimensions = before.info.width === after.info.width && before.info.height === after.info.height;
  if (sameDimensions) for (let i = 0; i < before.data.length; i += before.info.channels) {
    let difference = 0;
    for (let channel = 0; channel < before.info.channels; channel++) {
      difference = Math.max(difference, Math.abs(before.data[i + channel] - after.data[i + channel]));
    }
    if (difference) differentPixels++;
    if (difference > 8) changedPixelsOver8++;
    maximumChannelDifference = Math.max(maximumChannelDifference, difference);
  }
  results.push({ name, sameDimensions, differentPixels: sameDimensions ? differentPixels : null, maximumChannelDifference, changedPixelsOver8, before: before.info, after: after.info });
}
await writeFile(`${root}/comparison.json`, JSON.stringify(results, null, 2));
console.log(`${results.length} comparisons; ${results.filter(result => result.sameDimensions && result.differentPixels === 0).length} pixel-identical`);
for (const result of results.filter(result => !result.sameDimensions || result.differentPixels)) console.log(result.name, result.sameDimensions, result.differentPixels, 'maximum channel delta', result.maximumChannelDifference, 'pixels >8', result.changedPixelsOver8);
