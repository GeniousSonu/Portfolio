import { classifyProject, PROJECT_CATEGORIES } from '../src/config/projectTaxonomy.js';
import { normalizeGitHubRepo } from '../src/lib/integrations/github/client.js';

console.log('\n─── GitHub Projects & Taxonomy Test Suite ───');

// Test 1: Category Taxonomy Coverage
const categories = PROJECT_CATEGORIES.map((c) => c.id);
const expected = ['all', 'iot', 'web', 'wordpress', 'aiml', 'devtools'];
const missingCats = expected.filter((c) => !categories.includes(c));

if (missingCats.length > 0) {
  console.error(`✗ Missing categories: ${missingCats.join(', ')}`);
  process.exit(1);
}
console.log('✓ All 6 canonical project categories configured.');

// Test 2: Classification Logic
const samplePatent = {
  category: '2025 · IoT · Hardware',
  stack: ['ESP8266', 'NodeMCU', 'MQTT'],
  desc: 'Peltier cooling IoT cold-chain',
};
const patentCats = classifyProject(samplePatent);
if (!patentCats.includes('iot') || !patentCats.includes('all')) {
  console.error('✗ Patent failed taxonomy match for iot:', patentCats);
  process.exit(1);
}
console.log('✓ IoT patent correctly mapped to "iot" and "all".');

const sampleWP = {
  category: '2026 · WordPress · Security',
  stack: ['PHP', 'WordPress'],
  desc: 'WordPress security checklist',
};
const wpCats = classifyProject(sampleWP);
if (!wpCats.includes('wordpress')) {
  console.error('✗ WordPress project failed taxonomy match:', wpCats);
  process.exit(1);
}
console.log('✓ WordPress plugin correctly mapped to "wordpress".');

// Test 3: GitHub Repo Normalization
const mockRepo = {
  name: 'Telemetry-Daemon',
  description: 'Cryptographic node daemon for sensor telemetry',
  language: 'C++',
  topics: ['iot', 'cryptography'],
  stargazers_count: 14,
  forks_count: 2,
  license: { spdx_id: 'Apache-2.0' },
  html_url: 'https://github.com/GeniousSonu/Telemetry-Daemon',
  fork: false,
  archived: false,
};

const normalized = normalizeGitHubRepo(mockRepo);
if (normalized.slug !== 'telemetry-daemon' || normalized.btnType !== 'github') {
  console.error('✗ Normalization failed:', normalized);
  process.exit(1);
}
if (!normalized.metrics.some((m) => m.label === 'Stars' && m.val === '14')) {
  console.error('✗ Metric normalization failed:', normalized.metrics);
  process.exit(1);
}
console.log('✓ GitHub repository normalization verified.');

console.log('PASS: All projects and taxonomy tests passed successfully.\n');
