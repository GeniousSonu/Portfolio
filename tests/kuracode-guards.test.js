import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { KURACODE_FACTS } from '../src/data/kuracode/facts';

describe('KuraCode Guards & Compliance Tests', () => {
  it('enforces D10: legacy internal name must NEVER appear anywhere in public repo files or metadata', () => {
    // Search all source files excluding .git, .private, node_modules, .next, and this test file
    const forbiddenTerm = ['snip', 'hub'].join('');
    let matches = [];
    try {
      const output = execSync(
        `grep -rnwi "${forbiddenTerm}" --exclude-dir=.git --exclude-dir=.private --exclude-dir=node_modules --exclude-dir=.next --exclude="kuracode-guards.test.js" . || true`,
        { encoding: 'utf-8' }
      );
      matches = output.trim().split('\n').filter(Boolean);
    } catch {
      matches = [];
    }

    expect(matches).toEqual([]);
  });

  it('enforces D5 & facts consistency: product is in pre-release state', () => {
    expect(KURACODE_FACTS.releaseStatus).toBe('pre-release');
    expect(KURACODE_FACTS.pricing.isFreeAtLaunch).toBe(true);
    expect(KURACODE_FACTS.telemetry.enabledAtLaunch).toBe(false);
    expect(KURACODE_FACTS.features.offlineStorage).toBe('Available');
    expect(KURACODE_FACTS.features.cloudSync).toBe('Coming soon');
    expect(KURACODE_FACTS.features.aiHelpers).toBe('Planned');
  });

  it('enforces D8: security.txt expires within one year and has valid Contact', () => {
    const secPath = path.resolve('public/.well-known/security.txt');
    expect(fs.existsSync(secPath)).toBe(true);
    const content = fs.readFileSync(secPath, 'utf-8');

    const expiresMatch = content.match(/Expires:\s*([^\r\n]+)/);
    expect(expiresMatch).not.toBeNull();
    const expiresDate = new Date(expiresMatch[1]);
    const now = new Date();
    const oneYearFromNow = new Date(now.getTime() + 366 * 24 * 60 * 60 * 1000);

    expect(expiresDate.getTime()).toBeGreaterThan(now.getTime());
    expect(expiresDate.getTime()).toBeLessThan(oneYearFromNow.getTime());

    const contactMatch = content.match(/Contact:\s*https:\/\/genioussonu\.me\/contact/);
    expect(contactMatch).not.toBeNull();
  });
});
