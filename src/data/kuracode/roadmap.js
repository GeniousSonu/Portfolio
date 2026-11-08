/**
 * KuraCode Product Roadmap
 * Strictly separates Available, In Progress, Coming Soon, and Planned items.
 * Each item provides an accurate, factual summary of its delivery scope.
 */

export const KURACODE_ROADMAP = [
  {
    phase: 'Phase 1: Local-First Core',
    stage: 'Current Release Target',
    status: 'In Progress / Pre-release',
    description: 'The foundational local-first architecture, automated code sanitization, and browser store packaging.',
    items: [
      {
        name: 'Context-Aware Selection Capture',
        status: 'Available',
        description: 'Single-hotkey (Alt+Shift+S / ⌥+Shift+S) capture preserving source URL, page title, nearest section heading, and timestamp.',
      },
      {
        name: 'Automated Line Number & Prompt Sanitizer',
        status: 'Available',
        description: 'Removes leading line numbers, terminal prompts ($, >, #), and copy-button artifacts while preserving code indentation.',
      },
      {
        name: 'Local IndexedDB Offline Storage',
        status: 'Available',
        description: 'Zero account or authentication dependencies; all snippet contents and metadata persist locally in the browser.',
      },
      {
        name: 'Client-Side Secret & Token Detection',
        status: 'Available',
        description: 'Heuristic scanning for accidental API keys, private tokens, passwords, and private certificates before saving.',
      },
      {
        name: 'Full-Text Syntax Highlighted Search',
        status: 'Available',
        description: 'Instant local search across snippet contents, tags, source domains, and page titles with syntax highlighting.',
      },
      {
        name: 'JSON & Markdown Data Export',
        status: 'Available',
        description: 'Complete data portability allowing full library export into structured Markdown files or unified JSON.',
      },
      {
        name: 'Chrome Web Store & Edge Add-ons Submission',
        status: 'In Progress',
        description: 'Preparing final Manifest V3 packaging and privacy disclosure compliance for official Chromium store listings.',
      },
      {
        name: 'Firefox Add-ons (AMO) Store Submission',
        status: 'In Progress',
        description: 'Cross-browser manifest normalization and automated review validation for Mozilla Firefox Add-ons.',
      },
    ],
  },
  {
    phase: 'Phase 2: Team Collaboration & Sharing',
    stage: 'Next Development Milestone',
    status: 'Coming Soon',
    description: 'Opt-in multi-developer workflows, web sharing, and verified engineering snippet libraries.',
    items: [
      {
        name: 'End-to-End Encrypted Cloud Sync (Opt-In)',
        status: 'Coming soon',
        description: 'Zero-knowledge client-side encryption for optional synchronization across multiple developer workstations.',
      },
      {
        name: 'Read-Only Web Sharing Links',
        status: 'Coming soon',
        description: 'Generate secure, standalone web viewer links for snippets so teammates can view them without installing the extension.',
      },
      {
        name: 'Shared Team Workspaces',
        status: 'Coming soon',
        description: 'Shared collections for approved company architectural patterns, onboarding snippets, and internal API conventions.',
      },
      {
        name: 'Line-by-Line Code Annotations',
        status: 'Coming soon',
        description: 'Add contextual notes, caveats, and documentation comments to specific lines within saved snippets.',
      },
    ],
  },
  {
    phase: 'Phase 3: Ecosystem & Platform Integrations',
    stage: 'Future Exploration',
    status: 'Planned',
    description: 'Deeper IDE integrations, external documentation bridges, and expanded browser platforms.',
    items: [
      {
        name: 'VS Code Companion Extension',
        status: 'Planned',
        description: 'Search and insert saved snippets directly from your code editor palette with source attribution.',
      },
      {
        name: 'GitHub Gist & Notion Sync Bridge',
        status: 'Planned',
        description: 'Two-way synchronization between your local KuraCode library and personal GitHub Gists or Notion databases.',
      },
      {
        name: 'Apple Safari Browser Extension',
        status: 'Planned',
        description: 'Porting KuraCode to Safari on macOS using the Safari Web Extension converter.',
      },
      {
        name: 'Local Opt-In AI Summarization',
        status: 'Planned',
        description: 'Optional on-device model integration for auto-tagging and generating concise function summaries.',
      },
    ],
  },
];

export default KURACODE_ROADMAP;
