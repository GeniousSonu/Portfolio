import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const inventoryPath = path.join(rootDir, 'docs/compliance/DATA-INVENTORY.md');
const imprintPath = path.join(rootDir, 'src/app/imprint/page.jsx');
const privacyPath = path.join(rootDir, 'src/app/privacy/page.jsx');
const termsPath = path.join(rootDir, 'src/app/terms/page.jsx');
const cssPath = path.join(rootDir, 'src/app/legal.module.css');

console.log('--- Testing T02 (Imprint, Terms, Privacy Pages & Compliance) ---');

let passed = true;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    passed = false;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Files existence
assert(fs.existsSync(inventoryPath), 'docs/compliance/DATA-INVENTORY.md exists');
assert(fs.existsSync(imprintPath), 'src/app/imprint/page.jsx exists');
assert(fs.existsSync(privacyPath), 'src/app/privacy/page.jsx exists');
assert(fs.existsSync(termsPath), 'src/app/terms/page.jsx exists');
assert(fs.existsSync(cssPath), 'src/app/legal.module.css exists');

const inventory = fs.readFileSync(inventoryPath, 'utf-8');
const imprint = fs.readFileSync(imprintPath, 'utf-8');
const privacy = fs.readFileSync(privacyPath, 'utf-8');
const terms = fs.readFileSync(termsPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');

// 2. Decision D-02 validation in Imprint
assert(imprint.includes('SK Sahinur Islam'), 'Imprint discloses legal name SK Sahinur Islam');
assert(imprint.includes('talk2sahinur@gmail.com'), 'Imprint uses public contact talk2sahinur@gmail.com');
assert(imprint.includes('Republic of India'), 'Imprint establishes Indian jurisdiction');
assert(imprint.includes('Kolkata, West Bengal'), 'Imprint designates Kolkata dispute forum');
const addressPattern = /\b\d{1,5}\s+[\w\s]{1,20}(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr|boulevard|blvd)\b/i;
assert(!addressPattern.test(imprint) && !imprint.includes('Flat No') && !imprint.includes('Apartment No'), 'Zero home/residential address disclosed (D-02 address policy)');
assert(imprint.includes('Statutory Review Notice'), 'Imprint includes legal professional review advisory');

// 3. Privacy Policy verification
assert(privacy.includes('talk2sahinur@gmail.com'), 'Privacy policy uses public contact talk2sahinur@gmail.com');
assert(privacy.includes('Digital Personal Data Protection Act'), 'Privacy policy cites Indian DPDP Act 2023');
assert(privacy.includes('GDPR'), 'Privacy policy cites GDPR rights');
assert(privacy.includes('CookiePreferencesButton'), 'Privacy policy includes interactive cookie preferences trigger');
assert(privacy.includes('Data Retention Periods'), 'Privacy policy defines explicit data retention schedules');
assert(privacy.includes('Statutory Review Advisory'), 'Privacy policy includes legal professional review advisory');

// 4. Terms of Service verification
assert(terms.includes('talk2sahinur@gmail.com'), 'Terms of Service uses public contact talk2sahinur@gmail.com');
assert(terms.includes('Republic of India'), 'Terms of Service designates Republic of India jurisdiction');
assert(terms.includes('Statutory Review Advisory'), 'Terms of Service includes legal professional review advisory');

// 5. Zero raw hex codes in legal CSS module and pages
const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
const cssHexes = css.match(hexRegex);
assert(!cssHexes || cssHexes.length === 0, `Zero raw hex codes in legal.module.css (found: ${cssHexes ? cssHexes.join(', ') : 'none'})`);

const imprintHexes = imprint.match(hexRegex);
assert(!imprintHexes || imprintHexes.length === 0, 'Zero raw hex codes in imprint/page.jsx');

const privacyHexes = privacy.match(hexRegex);
assert(!privacyHexes || privacyHexes.length === 0, 'Zero raw hex codes in privacy/page.jsx');

const termsHexes = terms.match(hexRegex);
assert(!termsHexes || termsHexes.length === 0, 'Zero raw hex codes in terms/page.jsx');

if (!passed) {
  console.error('\n❌ T02 verification failed.');
  process.exit(1);
} else {
  console.log('\n🎉 All T02 Imprint, Terms, Privacy & Compliance checks passed!');
  process.exit(0);
}
