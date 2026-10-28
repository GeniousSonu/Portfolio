#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC_DIR = '/home/dayshift/Music/Portfolio/src';
const PROHIBITED_PATTERNS = [
  /\bDesign\s+Engineer\b/i,
  /\bUI\s*\/?\s*UX\s+Designer\b/i,
  /\bWeb\s+Designer\b/i,
  /\bProduct\s+Designer\b/i,
];

// Exempt laboratory page title
const ALLOWED_EXCEPTIONS = [
  'Design Engineering Laboratory',
];

function scanDir(dir) {
  let issues = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      issues = issues.concat(scanDir(fullPath));
    } else if (/\.(jsx?|tsx?|md|json)$/.test(entry)) {
      const content = readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        for (const pattern of PROHIBITED_PATTERNS) {
          if (pattern.test(line)) {
            const isException = ALLOWED_EXCEPTIONS.some((ex) => line.includes(ex));
            if (!isException) {
              issues.push({ file: fullPath, line: idx + 1, text: line.trim() });
            }
          }
        }
      });
    }
  }
  return issues;
}

console.log('--- Scanning for Prohibited Positioning Copy in src/ ---');
const findings = scanDir(SRC_DIR);
if (findings.length === 0) {
  console.log('✓ Zero prohibited designer positioning copy instances found.');
  process.exit(0);
} else {
  console.error(`✗ Found ${findings.length} positioning copy issues:`);
  console.error(findings);
  process.exit(1);
}
