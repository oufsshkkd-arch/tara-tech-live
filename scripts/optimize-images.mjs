import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';

const dir = './public/images/water-filter';
const files = readdirSync(dir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const src = join(dir, file);
  const base = file.replace('.png', '');

  // WebP — quality 80, max 800px wide (more than enough for any viewport)
  await sharp(src)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(dir, `${base}.webp`));

  // Smaller mobile variant — 400px
  await sharp(src)
    .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(join(dir, `${base}-sm.webp`));

  console.log(`✅ ${file} → ${base}.webp + ${base}-sm.webp`);
}

console.log('\nDone! All images converted.');
