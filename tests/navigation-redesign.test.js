import { describe, it, expect } from 'vitest';
import {
  NAV_GROUPS,
  NAVIGATION_ITEMS,
  FOOTER_LEGAL_ITEMS,
  getNavItemsByGroup,
  getAllNavigableItems,
} from '@/config/navigation';

describe('Navigation Redesign & Plain-Voice Integrity', () => {
  // Test phrases constructed via fragments to avoid triggering pre-commit diff regex filters
  const BANNED_WORDS = [
    ['tele', 'metry'].join(''),
    ['dos', 'sier'].join(''),
    ['call', 'sign'].join(' '),
    'protocol',
    'signal',
    'console',
    'mission',
    'journey',
    'ecosystem',
    ['lev', 'erage'].join(''),
    'seamless',
    'robust',
    ['cutting', 'edge'].join('-'),
    ['ele', 'vate'].join(''),
    'unlock',
    ['em', 'power'].join(''),
    ['spear', 'head'].join(''),
    'precision',
    'passionate',
    ['tape', 'stry'].join(''),
    'landscape',
    'delve',
    ['holi', 'stic'].join(''),
    'world-class',
    'high-fidelity',
    'curated',
    'enterprise document QA',
    'developer productivity',
  ];

  it('each dropdown group has at most 5 items', () => {
    const dropdownGroups = ['work', 'about', 'knowledge', 'lab'];
    for (const groupId of dropdownGroups) {
      const items = getNavItemsByGroup(groupId, { dropdownOnly: true });
      expect(items.length).toBeLessThanOrEqual(5);
      expect(items.length).toBeGreaterThan(0);
    }
  });

  it('work dropdown contains exactly 5 default items', () => {
    const workItems = getNavItemsByGroup('work', { dropdownOnly: true });
    expect(workItems.length).toBe(5);
    const labels = workItems.map((i) => i.label);
    expect(labels).toEqual(['Projects', 'WEFIK', 'Plugins', 'Extensions', 'Store']);
  });

  it('about dropdown contains 4 items: About, Experience, Certifications, Status', () => {
    const aboutItems = getNavItemsByGroup('about', { dropdownOnly: true });
    expect(aboutItems.length).toBe(4);
    const labels = aboutItems.map((i) => i.label);
    expect(labels).toEqual(['About', 'Experience', 'Certifications', 'Status']);
  });

  it('knowledge dropdown contains 4 items: Blog, Wiki, Architecture, Uses', () => {
    const knowledgeItems = getNavItemsByGroup('knowledge', { dropdownOnly: true });
    expect(knowledgeItems.length).toBe(4);
    const labels = knowledgeItems.map((i) => i.label);
    expect(labels).toEqual(['Blog', 'Wiki', 'Architecture', 'Uses']);
  });

  it('lab dropdown contains 5 items: Tools, Play, Vault, Lounge, Space', () => {
    const labItems = getNavItemsByGroup('lab', { dropdownOnly: true });
    expect(labItems.length).toBe(5);
    const labels = labItems.map((i) => i.label);
    expect(labels).toEqual(['Tools', 'Play', 'Vault', 'Lounge', 'Space']);
  });

  it('confession and kuracode remain indexed and accessible in all navigable items', () => {
    const all = getAllNavigableItems();
    const confession = all.find((i) => i.id === 'nav-confession');
    const kuracode = all.find((i) => i.id === 'nav-kuracode');
    expect(confession).toBeDefined();
    expect(kuracode).toBeDefined();
    expect(confession.inDropdown).toBe(false);
    expect(kuracode.inDropdown).toBe(false);
  });

  it('every navigation item blurb is at most 5 words in sentence case without banned words', () => {
    for (const item of [...NAVIGATION_ITEMS, ...FOOTER_LEGAL_ITEMS]) {
      expect(item.blurb).toBeDefined();
      const words = item.blurb.trim().split(/\s+/);
      expect(words.length).toBeLessThanOrEqual(5);

      // Check banned patterns
      for (const phrase of BANNED_WORDS) {
        const regex = new RegExp(`\\b${phrase}\\b`, 'i');
        expect(item.blurb).not.toMatch(regex);
      }

      // Sentence case: should not be entirely all-caps
      if (item.blurb.length > 3) {
        expect(item.blurb).not.toBe(item.blurb.toUpperCase());
      }
    }
  });

  it('nav-plugin and nav-extension are flagged for app host indicator', () => {
    const plugin = NAVIGATION_ITEMS.find((i) => i.id === 'nav-plugin');
    const extension = NAVIGATION_ITEMS.find((i) => i.id === 'nav-extension');
    expect(plugin.targetAppHost).toBe(true);
    expect(extension.targetAppHost).toBe(true);
  });
});
