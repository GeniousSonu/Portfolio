import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const inventoryPath = path.join(rootDir, 'docs/compliance/DATA-INVENTORY.md');
const privacyPagePath = path.join(rootDir, 'src/app/privacy/page.jsx');

console.log('--- Verifying Data Inventory Processor Coverage in Privacy Policy ---');

if (!fs.existsSync(inventoryPath)) {
  console.error(`❌ Missing inventory file: ${inventoryPath}`);
  process.exit(1);
}

if (!fs.existsSync(privacyPagePath)) {
  console.error(`❌ Missing privacy page file: ${privacyPagePath}`);
  process.exit(1);
}

const inventoryContent = fs.readFileSync(inventoryPath, 'utf-8');
const privacyContent = fs.readFileSync(privacyPagePath, 'utf-8');

// Extract processor names from markdown table (| **Name** | ...)
const tableRegex = /\|\s*\*\*([^*]+)\*\*\s*\|/g;
const processors = [];
let match;
while ((match = tableRegex.exec(inventoryContent)) !== null) {
  const name = match[1].trim();
  if (name && !processors.includes(name)) {
    processors.push(name);
  }
}

console.log(`Found ${processors.length} sub-processors in DATA-INVENTORY.md:`, processors);

let missingCount = 0;
for (const processor of processors) {
  // Check case-insensitively in Privacy Page
  const regex = new RegExp(`\\b${processor.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
  if (regex.test(privacyContent)) {
    console.log(`✅ [Covered] Processor "${processor}" is explicitly documented in /privacy`);
  } else {
    console.error(`❌ [Missing] Processor "${processor}" listed in DATA-INVENTORY.md is NOT disclosed in /privacy`);
    missingCount++;
  }
}

if (missingCount > 0) {
  console.error(`\n❌ Failed: ${missingCount} processor(s) missing from /privacy disclosure.`);
  process.exit(1);
}

console.log(`\n🎉 Success: 100% processor disclosure coverage verified (${processors.length}/${processors.length}).`);
process.exit(0);
