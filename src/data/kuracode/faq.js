/**
 * KuraCode FAQ Registry
 * Accurate, technical, user-focused answers verified against the extension implementation.
 */

export const KURACODE_FAQS = [
  {
    category: 'General & Architecture',
    id: 'general',
    description: 'Core concepts, local-first architecture, and browser support.',
    questions: [
      {
        id: 'what-is-kuracode',
        q: 'What is KuraCode and how does it work?',
        a: 'KuraCode is a local-first browser extension designed for developers to capture, clean, organize, and search code snippets from any webpage. When you trigger capture on selected text, KuraCode cleans the code, records source provenance (URL, page title, and section heading), and stores it directly in your browser without requiring a remote server.',
      },
      {
        id: 'difference-from-bookmarks',
        q: 'How does KuraCode differ from standard browser bookmarks?',
        a: 'Browser bookmarks only save webpage URLs. KuraCode captures the actual executable code, automatically strips line numbers and shell prompts, preserves whitespace indentation, detects the programming language, and indexes snippets for full-text search.',
      },
      {
        id: 'account-requirements',
        q: 'Is an account or sign-up required to use KuraCode?',
        a: 'No account, email, or registration is required. KuraCode operates on a local-first model where all data stays in your browser IndexedDB storage by default. You can install and use all core features completely offline.',
      },
      {
        id: 'pricing-and-cost',
        q: 'How much does KuraCode cost?',
        a: 'KuraCode is free to use with all local-first core features included at launch. There are no paywalls for offline storage, code cleaning, secret scanning, or data export.',
      },
      {
        id: 'supported-browsers',
        q: 'Which browsers are supported?',
        a: 'KuraCode supports Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, Vivaldi, Arc, and Opera) and Mozilla Firefox using Manifest V3. Apple Safari support is planned for a subsequent release.',
      },
    ],
  },
  {
    category: 'Capture & Code Cleaning',
    id: 'cleaning',
    description: 'Code sanitization, provenance preservation, and syntax detection.',
    questions: [
      {
        id: 'how-cleaning-works',
        q: 'How does automatic code cleaning work?',
        a: 'When code is captured from technical blogs or documentation, it often contains unwanted artifacts. KuraCode runs local regex-based sanitizers to strip leading line numbers (such as "01:" or "12 |"), shell prompts ("$", ">", "#"), and accidental "Copy" button labels while strictly preserving language-specific indentation.',
      },
      {
        id: 'supported-websites',
        q: 'Can I capture code from any website?',
        a: 'Yes. KuraCode functions across all public websites and web tools, including GitHub, GitLab, Stack Overflow, MDN Web Docs, official language documentation, personal engineering blogs, and intranet development portals.',
      },
      {
        id: 'provenance-metadata',
        q: 'What provenance metadata is saved with each snippet?',
        a: 'Each captured snippet automatically records the source webpage URL, page title, nearest section heading (H1–H4), capture timestamp, and detected programming language, allowing you to trace any code block back to its original reference.',
      },
      {
        id: 'private-browsing-policy',
        q: 'Does KuraCode capture code in private or incognito windows?',
        a: 'By default, KuraCode does not persist snippets captured during private or incognito browsing sessions to prevent inadvertent retention of confidential or temporary session data.',
      },
      {
        id: 'syntax-languages',
        q: 'Which programming languages are recognized for syntax highlighting?',
        a: 'KuraCode includes syntax recognition for JavaScript, TypeScript, Python, Go, Rust, PHP, HTML, CSS, SQL, Shell/Bash, JSON, YAML, Dockerfile, and Markdown, with automatic detection and manual language override.',
      },
    ],
  },
  {
    category: 'Privacy, Security & Storage',
    id: 'privacy',
    description: 'Data isolation, browser permissions, and client-side secret detection.',
    questions: [
      {
        id: 'storage-location',
        q: 'Where are saved snippets stored?',
        a: 'All snippet data, metadata, and user tags are stored locally on your device using browser IndexedDB. No snippet content is transmitted to external servers.',
      },
      {
        id: 'analytics-and-telemetry',
        q: 'Does KuraCode contain analytics or telemetry tracking?',
        a: 'No. The extension contains zero third-party analytics trackers, zero telemetry beacons, and zero tracking cookies. It runs self-contained within your browser.',
      },
      {
        id: 'extension-permissions',
        q: 'What browser permissions does KuraCode request and why?',
        a: 'KuraCode follows the principle of least privilege, declaring only 4 scoped permissions: activeTab (to capture selected code upon user command), contextMenus (for right-click snippet saving), storage (for extension settings), and unlimitedStorage (to prevent browser quota eviction of your local snippet library). No broad host permissions are requested.',
      },
      {
        id: 'secret-scanner',
        q: 'How does the built-in secret scanner work?',
        a: 'The secret scanner runs locally within your browser before saving or copying a snippet. It checks against known patterns for accidental inclusions of API keys, private tokens, passwords, and private SSH keys, displaying an alert before the snippet is committed to storage.',
      },
      {
        id: 'data-export',
        q: 'Can I export my snippets and data library?',
        a: 'Yes. You can export your entire collection at any time as structured JSON or Markdown files with complete metadata, ensuring zero vendor lock-in.',
      },
    ],
  },
  {
    category: 'Roadmap & Future Platforms',
    id: 'roadmap',
    description: 'Upcoming features, team collaboration, and editor integrations.',
    questions: [
      {
        id: 'cloud-sync-availability',
        q: 'Are team workspaces and cloud sync available right now?',
        a: 'No. Team workspaces and encrypted cloud synchronization are planned for Phase 2. The initial release is strictly local-first and offline-only.',
      },
      {
        id: 'vscode-extension',
        q: 'Will there be a VS Code companion extension?',
        a: 'Yes. A companion extension for VS Code is on the development roadmap to allow inserting and managing your saved snippets directly inside your editor.',
      },
      {
        id: 'safari-support',
        q: 'Will KuraCode be available on Apple Safari?',
        a: 'Safari support via the WebExtensions API is planned following the stable release of the Chromium and Firefox builds.',
      },
      {
        id: 'ai-features',
        q: 'Does KuraCode include AI code explanation features?',
        a: 'Not in the initial release. Future AI-assisted features (such as local code summarization) are under research for subsequent phases and will be strictly opt-in.',
      },
      {
        id: 'bug-reports',
        q: 'How do I report bugs or submit feature suggestions?',
        a: 'You can report bugs, submit code samples that failed cleaning, or suggest features via the official GitHub Issues repository or through the KuraCode support page.',
      },
    ],
  },
];

export default KURACODE_FAQS;
