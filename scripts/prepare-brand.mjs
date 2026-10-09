import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
await mkdir('public/brand', { recursive: true });
const original = await readFile('DESIGN-REFERENCE/full-logo.png');
const cropped = await sharp(original).trim().png().toBuffer();
const metadata = await sharp(cropped).metadata();
// Embed the exact supplied raster logo in an SVG container. No tracing or redesign.
await writeFile(
  'public/brand/logo-horizontal.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${metadata.width}" height="${metadata.height}" viewBox="0 0 ${metadata.width} ${metadata.height}"><image width="${metadata.width}" height="${metadata.height}" href="data:image/png;base64,${cropped.toString('base64')}"/></svg>`,
);
const monoCrop = await sharp(original)
  .extract({ left: 240, top: 125, width: 520, height: 490 })
  .png()
  .toBuffer();
const monogram = await sharp(monoCrop).trim().png().toBuffer();
const mono = await sharp(monogram).metadata();
await writeFile(
  'public/brand/monogram.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${mono.width}" height="${mono.height}" viewBox="0 0 ${mono.width} ${mono.height}"><image width="${mono.width}" height="${mono.height}" href="data:image/png;base64,${monogram.toString('base64')}"/></svg>`,
);
await sharp(monogram)
  .resize(64, 64, { fit: 'contain', background: '#f2efe7' })
  .png()
  .toFile('src/app/icon.png');
// A text-free swatch of the supplied approved identity. Not an invented city photo.
await sharp('DESIGN-REFERENCE/logo-reference.png')
  .extract({ left: 0, top: 0, width: 370, height: 190 })
  .resize(1480, 760)
  .webp({ quality: 88 })
  .toFile('public/brand/ink-texture.webp');
console.log('Official logo and reference texture prepared.');
