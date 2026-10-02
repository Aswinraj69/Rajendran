const sharp = require('sharp');
const path = require('path');

async function makeTransparent() {
  const inputPath = 'C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\2a6d64a1-be95-4b63-a5f8-ba82d6ae165e\\rajendran_transparent_1790920538239.jpg';
  const outputPath = path.join(__dirname, '../../../client/public/rajendran-about.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Processing image ${width}x${height}, channels: ${channels}`);

  // Create output buffer
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check how close to white (background is very close to 255, 255, 255)
    // Notice his hair and shirt are dark, so white background threshold is safe
    const minVal = Math.min(r, g, b);
    if (minVal > 245) {
      data[i + 3] = 0; // completely transparent
    } else if (minVal > 230) {
      // smooth alpha feathering
      const alpha = Math.round(((245 - minVal) / 15) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  await sharp(data, {
    raw: { width, height, channels }
  })
  .png()
  .toFile(outputPath);

  console.log('Saved transparent PNG to', outputPath);
}

makeTransparent().catch(console.error);
