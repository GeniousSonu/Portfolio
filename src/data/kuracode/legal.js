/**
 * KuraCode Legal Documents & Policy Registry
 * Conforms strictly with Chrome Web Store, Edge Add-ons, and Firefox AMO policies.
 */

export const KURACODE_LEGAL = {
  effectiveDate: '2026-11-05',
  version: '1.0.0-preview',

  // 6-Bullet Privacy Summary
  privacySummaryBullets: [
    'Local-First Guarantee: Your code snippets, tags, and notes are stored exclusively on your device in local storage. Nothing is transmitted to any external server.',
    'Zero Telemetry & Tracking: KuraCode contains no tracking scripts, no behavioral analytics, and no third-party advertising SDKs.',
    'No Private Browsing Tracking: KuraCode deliberately disables background persistence in incognito or private browsing windows.',
    'Strictly Scoped Permissions: The extension requests only 4 declared permissions: activeTab (user-triggered snippet capture), contextMenus (right-click save), storage (local settings), and unlimitedStorage (local library capacity). Zero broad host permissions.',
    'Complete Data Portability: You can export your entire snippet archive at any time in standard JSON or Markdown format, or permanently purge all data locally.',
    'No Sale of User Data: We never sell, rent, monetize, or broker your personal information or code snippets under any circumstances.',
  ],

  termsOfService: {
    title: 'Terms of Service',
    description: 'Pre-release terms governing usage of the KuraCode browser extension and associated web resources.',
    summary: 'KuraCode is provided as a developer utility tool under permissive licensing without warranties of uninterrupted service.',
  },

  dataPolicy: {
    title: 'Data & Storage Architecture',
    description: 'Technical explanation of how code data is isolated, indexed, and stored on your workstation.',
    storageType: 'IndexedDB & Chrome Local Storage API',
    encryptionAtRest: 'Protected by host operating system user-profile encryption',
  },

  securityPolicy: {
    title: 'Security Policy & Disclosure',
    description: 'How KuraCode handles secret scanning, content security policies (CSP), and vulnerability reporting.',
    reportingEmail: 'mailto:contact@genioussonu.me',
  },

  accessibilityPolicy: {
    title: 'Accessibility Statement (VPAT / WCAG 2.1 AA)',
    description: 'KuraCode interfaces are designed to meet WCAG 2.1 AA standards with high contrast, complete keyboard navigation, and ARIA labeling.',
  },
};

export default KURACODE_LEGAL;

