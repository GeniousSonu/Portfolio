/**
 * KuraCode Changelog Registry
 * Permanent anchor per version; starts with pre-release entry.
 */

export const KURACODE_CHANGELOG = [
  {
    version: '0.1.0-preview',
    date: '2026-11-05',
    status: 'Pre-release',
    title: 'Initial Developer Preview & Store Staging',
    highlights: [
      'Core in-browser selection capture with hotkey (Alt+Shift+S / Opt+Shift+S).',
      'Automatic code cleaning engine stripping line numbers and shell prompts ($).',
      'Local-first storage engine powered by browser IndexedDB.',
      'Full-text search across titles, code, tags, and origin URLs.',
      'Pre-commit secret scanner warning against accidental credential leaks.',
      'Export library to JSON and structured Markdown.',
    ],
  },
];

export default KURACODE_CHANGELOG;
