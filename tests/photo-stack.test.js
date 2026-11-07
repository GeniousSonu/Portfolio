import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Owner Photo Stack Asset Integrity', () => {
  const assetsDir = path.resolve(process.cwd(), 'public/assets/owner');
  const manifestPath = path.join(assetsDir, 'manifest.json');

  it('manifest.json exists and contains exactly 4 distinct owner images', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(Array.isArray(manifest)).toBe(true);
    expect(manifest.length).toBe(4);

    const ids = new Set(manifest.map((item) => item.id));
    expect(ids.size).toBe(4);
  });

  it('all referenced WebP and thumbnail files exist on disk with valid dimensions', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const item of manifest) {
      const fullPath = path.resolve(process.cwd(), 'public', item.src.replace(/^\//, ''));
      const smPath = path.resolve(process.cwd(), 'public', item.srcSm.replace(/^\//, ''));

      expect(fs.existsSync(fullPath)).toBe(true);
      expect(fs.existsSync(smPath)).toBe(true);

      const stats = fs.statSync(fullPath);
      expect(stats.size).toBeGreaterThan(1000); // Non-empty image
      expect(stats.size).toBeLessThan(150 * 1024); // Kept within bundle/network budget (<150KB)

      expect(item.alt).toBeTruthy();
      expect(item.alt.length).toBeGreaterThan(10);
      expect(item.blurDataURL).toMatch(/^data:image\/webp;base64,/);
      expect(item.width).toBe(800);
      expect(item.height).toBe(800);
    }
  });

  it('avatar.webp exists for sidebar and chat widget within budget', () => {
    const avatarPath = path.join(assetsDir, 'avatar.webp');
    expect(fs.existsSync(avatarPath)).toBe(true);
    const stats = fs.statSync(avatarPath);
    expect(stats.size).toBeGreaterThan(1000);
    expect(stats.size).toBeLessThan(50 * 1024); // <50KB
  });
});
