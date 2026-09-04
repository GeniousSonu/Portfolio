import fs from 'node:fs';
import path from 'node:path';

const swPath = path.resolve(process.cwd(), 'public/sw.js');

try {
  if (fs.existsSync(swPath)) {
    let content = fs.readFileSync(swPath, 'utf8');
    const timestamp = Date.now();
    const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || '';
    const newVersion = gitSha ? `v-${gitSha.slice(0, 8)}-${timestamp}` : `v-${timestamp}`;

    const updated = content.replace(
      /const CACHE_VERSION = ['"][^'"]+['"];/,
      `const CACHE_VERSION = '${newVersion}';`
    );

    fs.writeFileSync(swPath, updated, 'utf8');
    console.log(`[PWA] Successfully stamped sw.js with CACHE_VERSION: ${newVersion}`);
  } else {
    console.warn('[PWA] Warning: public/sw.js not found for version stamping.');
  }
} catch (err) {
  console.error('[PWA] Failed to update sw.js version:', err);
}
