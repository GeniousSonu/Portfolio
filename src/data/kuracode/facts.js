/**
 * KuraCode Single Source of Truth — Product Facts & Status Registry
 * 
 * Rules:
 * - Never contradict this module in any page or metadata.
 * - Product is in pre-release state: no store claims, no fake reviews, no fake counts.
 * - Placeholders use searchable [[OWNER: ...]] tokens in data modules.
 */

export const KURACODE_FACTS = {
  name: 'KuraCode',
  tagline: 'Code snippet manager for modern developers',
  oneLinePromise: 'Save code from anywhere on the web in one click, keep where it came from, find it again instantly, and share it with your team.',
  officialHome: 'https://genioussonu.me/extensions/kuracode',
  releaseStatus: 'pre-release', // 'pre-release' | 'live'
  version: '0.1.0-preview',
  lastUpdated: '2026-11-05',
  indexable: false, // Delta D2: Whole product section is noindex until owner resolves items

  // Owner Placeholders (resolved through D2 placeholder chips)
  owner: {
    legalName: '[[OWNER: legal name]]',
    contactEmail: '[[OWNER: contact email]]',
    supportEmail: '[[OWNER: support email]]',
    licenseType: 'MIT License',
    repositoryUrl: 'https://github.com/GeniousSonu/kuracode-extension', // Extension repo only (D9)
  },

  // Supported platforms & browser targets
  platforms: {
    chromium: { name: 'Chromium', supported: true, browsers: ['Google Chrome', 'Microsoft Edge', 'Brave', 'Vivaldi', 'Arc', 'Opera'] },
    firefox: { name: 'Mozilla Firefox', supported: true, browsers: ['Firefox Desktop'] },
    safari: { name: 'Apple Safari', supported: false, status: 'Planned' },
  },

  // Default keyboard shortcuts
  shortcuts: {
    captureSelection: { mac: '⌥ + ⇧ + S', win: 'Alt + Shift + S', description: 'Quickly save selected code with provenance' },
    openQuickSearch: { mac: '⌥ + ⇧ + Y', win: 'Alt + Shift + Y', description: 'Search and copy saved snippets from popup' },
    triggerAction: { mac: '⌥ + ⇧ + K', win: 'Alt + Shift + K', description: 'Open snippet management palette' },
  },

  // Feature Status Table (Available, Coming soon, Planned)
  features: {
    inBrowserCapture: 'Available',
    provenanceTracking: 'Available', // URL, title, heading, timestamp
    codeCleaning: 'Available', // Strips line numbers, prompts ($), copy buttons
    syntaxHighlighting: 'Available',
    languageDetection: 'Available',
    offlineStorage: 'Available', // Local-first, zero account needed
    collectionsAndTags: 'Available',
    fullTextSearch: 'Available',
    secretScanner: 'Available', // Warns on detected API keys / tokens
    cloudSync: 'Coming soon',
    teamWorkspaces: 'Coming soon',
    webViewerSharing: 'Coming soon',
    lineComments: 'Coming soon',
    vsCodeCompanion: 'Planned',
    slackIntegration: 'Planned',
    gistSync: 'Planned',
    notionSync: 'Planned',
    aiHelpers: 'Planned',
  },

  // Privacy & Telemetry Stance
  telemetry: {
    enabledAtLaunch: false,
    analyticsPolicy: 'No telemetry, zero analytics, zero cookies inside the extension at launch. Optional opt-in telemetry will be content-free.',
    localFirst: true,
    privateBrowsingPolicy: 'Data captured in incognito/private windows is never stored.',
  },

  // Pricing
  pricing: {
    isFreeAtLaunch: true,
    freeTierName: 'Community (Free & Local-First)',
    paidTierName: '[[OWNER: team pricing tier]]',
  },

  // Brand Derived Colors (from logo vector)
  brandColors: {
    primaryMint: '#08e88a',
    emeraldMid: '#00b96c',
    emeraldDeep: '#00854f',
    forestDark: '#00613f',
    brightAccent: '#37f6a6',
    derivedNotice: 'Derived from official vector logo icon',
  },
};

export default KURACODE_FACTS;
