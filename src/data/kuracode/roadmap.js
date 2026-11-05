/**
 * KuraCode Product Roadmap
 * Strictly separates Available, Coming Soon, and Planned items.
 */

export const KURACODE_ROADMAP = [
  {
    phase: 'Phase 1: Local-First Core (Current)',
    status: 'In Progress / Pre-release',
    items: [
      { name: '1-Click Selection Capture', status: 'Available' },
      { name: 'Automated Line Number & Prompt Cleaner', status: 'Available' },
      { name: 'Provenance & Context Logging (URL, Heading, Time)', status: 'Available' },
      { name: 'Local-First Offline Storage (0 Account Required)', status: 'Available' },
      { name: 'Secret & Credential Scanner', status: 'Available' },
      { name: 'JSON & Markdown Data Export', status: 'Available' },
      { name: 'Official Chrome & Edge Store Listing Submissions', status: 'In Progress' },
      { name: 'Firefox Add-ons (AMO) Submission', status: 'In Progress' },
    ],
  },
  {
    phase: 'Phase 2: Team Collaboration (Next)',
    status: 'Coming Soon',
    items: [
      { name: 'Encrypted Cloud Sync (Opt-In)', status: 'Coming soon' },
      { name: 'Web-Viewer Share Links (No Extension Required to View)', status: 'Coming soon' },
      { name: 'Team Workspaces & Shared Approved Libraries', status: 'Coming soon' },
      { name: 'Line-by-Line Code Annotations & Comments', status: 'Coming soon' },
    ],
  },
  {
    phase: 'Phase 3: Ecosystem & Integrations (Future)',
    status: 'Planned',
    items: [
      { name: 'VS Code Companion Extension', status: 'Planned' },
      { name: 'GitHub Gist & Notion Synchronizer', status: 'Planned' },
      { name: 'Slack Approval Bridge', status: 'Planned' },
      { name: 'Apple Safari Extension', status: 'Planned' },
      { name: 'Local AI Code Summarizer & Auto-Tagger', status: 'Planned' },
    ],
  },
];

export default KURACODE_ROADMAP;

