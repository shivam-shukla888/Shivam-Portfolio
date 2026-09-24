/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(process.cwd(), 'public', 'images', 'image background.png');
const outDir = path.join(process.cwd(), 'public', 'images', 'backgrounds');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Bounding boxes for each panel, accurately excluding gutters, montage borders, and text labels
const crops = [
  { name: 'homepage.webp', left: 1, top: 1, width: 488, height: 235 },
  { name: 'about.webp', left: 497, top: 1, width: 516, height: 235 },
  { name: 'projects.webp', left: 1022, top: 1, width: 508, height: 235 },
  { name: 'services.webp', left: 1, top: 287, width: 499, height: 193 },
  { name: 'store.webp', left: 509, top: 287, width: 506, height: 194 },
  { name: 'store-design.webp', left: 1023, top: 287, width: 507, height: 194 },
  { name: 'store-ai-agents.webp', left: 5, top: 534, width: 495, height: 174 },
  { name: 'store-digital-products.webp', left: 509, top: 534, width: 507, height: 174 },
  { name: 'contact.webp', left: 1023, top: 534, width: 507, height: 174 },
  { name: 'lab.webp', left: 5, top: 761, width: 495, height: 194 },
  { name: 'privacy.webp', left: 509, top: 761, width: 506, height: 194 },
  // admin is NOT created as instructed: "Do NOT create admin.webp"
];

async function extract() {
  console.log('Extracting panels from:', inputPath);
  for (const item of crops) {
    const outPath = path.join(outDir, item.name);
    // 2.5x Lanczos3 upscale for retina/desktop crispness (approx 1250-1280px wide)
    const targetWidth = Math.round(item.width * 2.5);
    const targetHeight = Math.round(item.height * 2.5);

    await sharp(inputPath)
      .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
      .resize(targetWidth, targetHeight, {
        kernel: sharp.kernel.lanczos3,
        fit: 'fill',
      })
      .webp({ quality: 88, effort: 6 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    console.log(
      'Created ' + item.name + ': ' + targetWidth + 'x' + targetHeight + ' (' + stats.size + ' bytes)'
    );
  }
}

extract().catch((err) => {
  console.error(err);
  process.exit(1);
});
