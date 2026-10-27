import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PURGED_FONTS = ['Geist', 'Brooklyn', 'Instrument Serif', 'IBM Plex Mono', 'Poppins'];
const ALLOWED_FONT_REGEX = /var\(--(body|display|serif|mono|hand|font-[a-z0-9_-]+|v3-font-[a-z0-9_-]+)(,\s*[^)]+)?\)|inherit|initial|unset/;

function walkDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === '.private') {
      continue;
    }
    if (entry.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (/\.(css|js|jsx|mjs|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const srcDir = path.join(rootDir, 'src');
const allFiles = walkDir(srcDir);
const errors = [];

for (const file of allFiles) {
  const relPath = path.relative(rootDir, file);
  // Skip font definition files or email routes
  const isDefinitionFile = relPath.includes('src/lib/fonts.js') || 
                           relPath.includes('src/lib/bootFonts.js') || 
                           relPath.includes('src/app/globals.css') ||
                           relPath.includes('src/app/api/contact/route.js');

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Check for purged font names
    for (const purged of PURGED_FONTS) {
      if (new RegExp(`\\b${purged}\\b`, 'i').test(line)) {
        // Exception: comments or documentation mentions
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) continue;
        if (relPath.includes('src/app/uses/page.jsx')) continue; // Text content mentioning tools
        errors.push({
          file: relPath,
          line: lineNum,
          type: 'PURGED_FONT',
          message: `Found purged font "${purged}": ${line.trim()}`,
        });
      }
    }

    // 2. Check for raw font-family without token
    if (/font-family\s*:/.test(line) && !isDefinitionFile) {
      if (!ALLOWED_FONT_REGEX.test(line)) {
        errors.push({
          file: relPath,
          line: lineNum,
          type: 'NON_TOKEN_FONT',
          message: `Raw or non-token font-family declaration: ${line.trim()}`,
        });
      }
    }
  });
}

console.log('--- FONT INTEGRITY AUDIT ---');
if (errors.length > 0) {
  console.error(`FAILED: Found ${errors.length} font policy violations:\n`);
  for (const err of errors) {
    console.error(`  [${err.type}] ${err.file}:${err.line} -> ${err.message}`);
  }
  process.exit(1);
} else {
  console.log(`PASSED: 0 violations across ${allFiles.length} source files.`);
  console.log('Three-font system (Bricolage Grotesque, Space Mono, Shantell Sans) strictly enforced.');
  process.exit(0);
}
