/**
 * generate-icons.mjs
 * Generates all Karigori app icons for Android + PWA
 * Design: deep green background, bright green ring border, white Bengali "ক"
 * Run: node generate-icons.mjs
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RES = join(__dirname, 'android/app/src/main/res');
const PUBLIC = join(__dirname, 'public');

// ── SVG icon builder ──────────────────────────────────────
function makeSVG(size, round = false) {
  const c  = size / 2;
  const outerR  = c;
  const borderW = Math.max(4, size * 0.055);
  const innerR  = outerR - borderW;
  const fs      = size * 0.46;
  const clip    = round ? `<clipPath id="clip"><circle cx="${c}" cy="${c}" r="${outerR}"/></clipPath>` : '';
  const clipAttr = round ? `clip-path="url(#clip)"` : '';

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    ${clip}
    <radialGradient id="bg" cx="38%" cy="32%" r="70%">
      <stop offset="0%" stop-color="#008860"/>
      <stop offset="100%" stop-color="#004d38"/>
    </radialGradient>
  </defs>
  <!-- Border ring -->
  <circle cx="${c}" cy="${c}" r="${outerR}" fill="#22c55e" ${clipAttr}/>
  <!-- Background -->
  <circle cx="${c}" cy="${c}" r="${innerR}" fill="url(#bg)" ${clipAttr}/>
  <!-- White "ক" -->
  <text x="${c}" y="${c + fs * 0.37}"
    text-anchor="middle"
    font-family="serif"
    font-size="${fs}"
    font-weight="900"
    fill="white">${'ক'}</text>
</svg>`);
}

// ── Generate one PNG ──────────────────────────────────────
async function gen(outPath, size, round = false) {
  const dir = join(outPath, '..');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await sharp(makeSVG(size, round), { density: 300 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log(`  ✔ ${outPath.replace(__dirname, '.')}`);
}

// ── Android sizes ─────────────────────────────────────────
const SIZES = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

// ── Run ───────────────────────────────────────────────────
console.log('\n🎨  Generating Karigori icons...\n');

const tasks = [];

// Android square + round icons
for (const [dir, size] of Object.entries(SIZES)) {
  tasks.push(gen(join(RES, dir, 'ic_launcher.png'),       size, false));
  tasks.push(gen(join(RES, dir, 'ic_launcher_round.png'), size, true));
  tasks.push(gen(join(RES, dir, 'ic_launcher_foreground.png'), size, false));
}

// PWA icons
tasks.push(gen(join(PUBLIC, 'icon-192.png'), 192, true));
tasks.push(gen(join(PUBLIC, 'icon-512.png'), 512, true));
tasks.push(gen(join(PUBLIC, 'favicon.png'),  32,  false));

await Promise.all(tasks);

console.log('\n✅  All icons generated!\n');
console.log('Next:  npx cap open android  → Build → Generate Signed APK\n');
