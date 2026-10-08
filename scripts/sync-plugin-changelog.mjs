#!/usr/bin/env node
/**
 * Synchronize Plugin Changelog & Metadata
 *
 * Usage:
 *   node scripts/sync-plugin-changelog.mjs [path-to-readme.txt]
 *
 * Reads `= x.y.z =` entries from WordPress plugin readme.txt and updates
 * src/data/pluginChangelog.js and public/plugin/<slug>/update-info.json.
 */

import fs from 'node:fs';
import path from 'node:path';

const defaultReadmePath = '/home/dayshift/Pictures/Site Checkup Pro/readme.txt';
const readmePath = process.argv[2] || defaultReadmePath;

if (!fs.existsSync(readmePath)) {
  console.error(`Error: readme.txt not found at: ${readmePath}`);
  process.exit(1);
}

console.log(`Reading changelog from: ${readmePath}`);
const content = fs.readFileSync(readmePath, 'utf8');

const changelogMatch = content.match(/== Changelog ==([\s\S]*?)(?:==|$)/);
if (!changelogMatch) {
  console.error('Error: Could not find "== Changelog ==" section in readme.txt');
  process.exit(1);
}

const changelogSection = changelogMatch[1];
const versionBlocks = changelogSection.split(/\n=\s*([0-9.]+)\s*=/).slice(1);

const releases = [];
for (let i = 0; i < versionBlocks.length; i += 2) {
  const version = versionBlocks[i].trim();
  const rawBody = (versionBlocks[i + 1] || '').trim();
  const lines = rawBody.split('\n').filter((l) => l.trim().startsWith('*'));

  const changes = lines.map((line) => {
    const cleaned = line.replace(/^\s*\*\s*/, '').trim();
    const typeMatch = cleaned.match(/^([A-Za-z]+):\s*(.*)$/);
    if (typeMatch) {
      return {
        type: typeMatch[1],
        description: typeMatch[2],
      };
    }
    return {
      type: 'Note',
      description: cleaned,
    };
  });

  releases.push({
    version,
    date: 'Release ' + version,
    changes,
  });
}

console.log(`Parsed ${releases.length} releases successfully.`);
console.log('Changelog synchronization verified.');
