import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('.private/assets/kuracode');
const DEST_DIR = path.resolve('public/assets/kuracode');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

async function run() {
  console.log('--- Generating KuraCode Brand Assets ---');

  const iconSvgPath = path.join(SOURCE_DIR, 'kuracode-icon.svg');
  const logoPngPath = path.join(SOURCE_DIR, 'KuraCode logo.png');
  const boardPngPath = path.join(SOURCE_DIR, 'Kura-board.png');

  // 1. Sanitize & write SVG
  const rawSvg = fs.readFileSync(iconSvgPath, 'utf-8');
  // Clean comments and ensure proper viewBox
  const cleanSvg = rawSvg
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  fs.writeFileSync(path.join(DEST_DIR, 'kuracode-icon.svg'), cleanSvg);
  fs.writeFileSync(path.join(DEST_DIR, 'favicon.svg'), cleanSvg);
  console.log('✓ Wrote sanitized SVGs (kuracode-icon.svg, favicon.svg)');

  // 2. Favicons & Extension Icons from SVG buffer
  const svgBuffer = Buffer.from(cleanSvg);
  const iconSizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'icon-48.png', size: 48 },
    { name: 'icon-128.png', size: 128 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
  ];

  for (const { name, size } of iconSizes) {
    await sharp(svgBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(DEST_DIR, name));
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // 3. Logo Optimization
  if (fs.existsSync(logoPngPath)) {
    const logoSharp = sharp(logoPngPath);
    await logoSharp
      .clone()
      .webp({ quality: 90 })
      .toFile(path.join(DEST_DIR, 'kuracode-logo.webp'));

    await logoSharp
      .clone()
      .resize(800, null, { fit: 'inside' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(DEST_DIR, 'kuracode-logo.png'));
    console.log('✓ Generated kuracode-logo.webp & kuracode-logo.png');
  }

  // 4. Hero Banner Optimization & Social Card (1200x630)
  if (fs.existsSync(boardPngPath)) {
    const boardSharp = sharp(boardPngPath);
    const meta = await boardSharp.metadata();

    // Responsive WebP hero
    await boardSharp
      .clone()
      .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(path.join(DEST_DIR, 'kuracode-hero.webp'));

    // Responsive AVIF hero
    try {
      await boardSharp
        .clone()
        .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
        .avif({ quality: 80 })
        .toFile(path.join(DEST_DIR, 'kuracode-hero.avif'));
      console.log('✓ Generated kuracode-hero.avif');
    } catch (e) {
      console.warn('AVIF not supported in this sharp build, using WebP fallback');
    }

    // 1200x630 Open Graph / Twitter Card
    await boardSharp
      .clone()
      .resize(1200, 630, { fit: 'cover', position: 'center' })
      .png({ compressionLevel: 8 })
      .toFile(path.join(DEST_DIR, 'og-kuracode.png'));
    console.log('✓ Generated og-kuracode.png (1200x630)');
  }

  console.log('🎉 Brand assets generation complete.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

