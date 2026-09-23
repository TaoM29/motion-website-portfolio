import sharp from 'sharp';
import { readdir } from 'node:fs/promises';

for (const directory of ['public/images/projects', 'public/images/interests']) {
  for (const file of await readdir(directory)) {
    if (!file.endsWith('.png')) continue;
    await sharp(`${directory}/${file}`).resize({ width: directory.endsWith('interests') ? 640 : 1600, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`${directory}/${file.replace('.png', '.webp')}`);
  }
}
await sharp('public/images/personal-avatar-head.png').resize(960).webp({ quality: 88 }).toFile('public/images/personal-avatar-head.webp');
await sharp('public/images/personal-avatar-head.png').resize(480).webp({ quality: 85 }).toFile('public/images/personal-avatar-head-small.webp');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#08090b"/>
  <circle cx="1110" cy="50" r="380" fill="#681b2a" opacity=".35"/>
  <path d="M80 112H1120" stroke="#de354b" stroke-width="3"/>
  <g font-family="Arial, sans-serif">
    <text x="80" y="190" fill="#ef6578" font-size="25" letter-spacing="3">DATA SCIENCE · AI · SOFTWARE</text>
    <text x="76" y="310" fill="#e4e6ea" font-size="88" font-weight="700">Taofik Muhriz</text>
    <text x="80" y="383" fill="#b9bdc7" font-size="32">Research, data tools and web development.</text>
    <text x="80" y="538" fill="#e4e6ea" font-size="26">builtbytaofik.com</text>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile('public/images/social-card.jpg');
console.log('Optimized WebP assets and social card generated.');
