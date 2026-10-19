import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('src/assets', { recursive: true });
for (const name of ['kitchen', 'wardrobe', 'living']) {
  const file = `docs/assets/${name}-original.png`;
  await sharp(file).webp({ quality: 87 }).toFile(`src/assets/${name}.webp`);
  await sharp(`docs/assets/${name}-angle-original.png`)
    .webp({ quality: 87 })
    .toFile(`src/assets/${name}-angle.webp`);
  const crop =
    name === 'kitchen'
      ? { left: 360, top: 450, width: 880, height: 574 }
      : name === 'wardrobe'
        ? { left: 400, top: 100, width: 720, height: 700 }
        : { left: 820, top: 80, width: 570, height: 660 };
  await sharp(file)
    .extract(crop)
    .webp({ quality: 88 })
    .toFile(`src/assets/${name}-detail.webp`);
}
await sharp('docs/assets/kitchen-original.png')
  .resize(1200, 630, { fit: 'cover' })
  .composite([
    {
      input: Buffer.from(
        '<svg width="1200" height="630"><rect x="42" y="438" width="560" height="152" rx="4" fill="#f6f3ee"/><text x="72" y="500" font-family="Georgia" font-size="48" fill="#242820">Sęk i Forma</text><text x="74" y="545" font-family="sans-serif" font-size="22" fill="#3e5143">Meble na wymiar · Projekt demonstracyjny</text></svg>',
      ),
    },
  ])
  .jpeg({ quality: 87 })
  .toFile('public/og-image.jpg');
