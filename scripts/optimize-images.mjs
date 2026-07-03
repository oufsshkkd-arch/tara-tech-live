import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';

const dirs = [
  './public/images/water-filter',
  './public/images/organizer',
  './public/images/jump-starter'
];

for (const dir of dirs) {
  try {
    const files = readdirSync(dir).filter(f => f.match(/\.(png|jpe?g)$/i));

    for (const file of files) {
      const src = join(dir, file);
      const base = file.replace(/\.(png|jpe?g)$/i, '');

      // WebP — quality 80, max 800px wide
      await sharp(src)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(join(dir, `${base}.webp`));

      // Smaller mobile variant — 400px
      await sharp(src)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(join(dir, `${base}-sm.webp`));

      console.log(`✅ ${dir}/${file} → ${base}.webp + ${base}-sm.webp`);
    }
  } catch (err) {
    console.error(`Skipping ${dir} - not found or error`, err);
  }
}

console.log('\nDone! All images converted.');
