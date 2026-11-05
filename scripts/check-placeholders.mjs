import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve('src/data/kuracode');
const REPORTS_DIR = path.resolve('.private/reports/kuracode');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

console.log('--- Checking KuraCode Placeholders & Indexability (Delta D2) ---');

let totalPlaceholders = 0;
let violations = 0;
const reportLines = [
  '# KuraCode Owner Placeholders Audit Report',
  `Generated: ${new Date().toISOString()}`,
  '',
  '| Data Module / Page | Status | Unresolved Tokens | Allowed In Pre-Release |',
  '|---|---|---|---|',
];

if (fs.existsSync(DATA_DIR)) {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.js') || f.endsWith('.json'));

  for (const file of files) {
    const fullPath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    const matches = content.match(/\[\[OWNER:[^\]]+\]\]/g) || [];
    const isIndexable = content.includes('indexable: true');

    if (matches.length > 0) {
      totalPlaceholders += matches.length;
      reportLines.push(
        `| ${file} | ${isIndexable ? '🚨 Indexable' : '🔒 Noindex'} | ${matches.join(', ')} | ${isIndexable ? 'NO (CI Failure)' : 'YES (Graceful TBC)'} |`
      );

      if (isIndexable) {
        console.error(`❌ VIOLATION: ${file} is marked indexable: true but contains unresolved placeholders:`, matches);
        violations++;
      } else {
        console.log(`ℹ️ [Noindex Guarded] ${file} has ${matches.length} unresolved placeholder(s). Kept noindex.`);
      }
    } else {
      reportLines.push(`| ${file} | ${isIndexable ? 'Indexable' : 'Noindex'} | None | - |`);
    }
  }
}

const reportPath = path.join(REPORTS_DIR, 'placeholders-report.md');
fs.writeFileSync(reportPath, reportLines.join('\n'));
console.log(`\nAudit complete: ${totalPlaceholders} placeholder(s) tracked. Saved report to ${reportPath}`);

if (violations > 0) {
  console.error(`\n❌ CI FAILED: Found ${violations} indexable page(s) with unresolved owner placeholders.`);
  process.exit(1);
} else {
  console.log('✅ CI PASSED: All pages with unresolved placeholders are safely guarded with noindex.');
  process.exit(0);
}
