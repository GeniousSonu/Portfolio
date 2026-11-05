/**
 * KuraCode FAQ Registry (At least 20 questions matching facts strictly)
 */

export const KURACODE_FAQS = [
  {
    category: 'General & Concepts',
    questions: [
      {
        q: 'What is KuraCode?',
        a: 'KuraCode is a local-first browser extension and developer tool that lets you capture, annotate, clean, search, and organize code snippets directly from any webpage without losing their origin context.',
      },
      {
        q: 'How does KuraCode differ from standard browser bookmarks?',
        a: 'Bookmarks only save URLs. KuraCode captures the exact code text, automatically strips line numbers and shell prompts, preserves indentation, records the source heading, and provides full-text syntax-highlighted search.',
      },
      {
        q: 'Is an account required to use KuraCode?',
        a: 'No. KuraCode operates on a local-first architecture. It works offline out of the box with zero sign-up, zero login, and zero remote database dependencies.',
      },
      {
        q: 'What is the current release status of KuraCode?',
        a: 'KuraCode is currently in pre-release. It is being prepared for submission to official browser stores (Chrome Web Store, Microsoft Edge Add-ons, Firefox Add-ons).',
      },
      {
        q: 'How much does KuraCode cost?',
        a: 'KuraCode is completely free to use at launch with full local-first capabilities.',
      },
    ],
  },
  {
    category: 'Capture & Code Cleaning',
    questions: [
      {
        q: 'How does code cleaning work?',
        a: 'When you capture code, KuraCode strips leading line numbers (e.g. 1., 02:), terminal prompt markers ($, >, #), and accidental "Copy" button labels, while keeping indentation intact.',
      },
      {
        q: 'Can I capture code from any website?',
        a: 'Yes. KuraCode works on GitHub, Stack Overflow, MDN, documentation sites, blogs, and internal web tools.',
      },
      {
        q: 'Does KuraCode capture code in private/incognito windows?',
        a: 'No. By default, KuraCode respects privacy and does not persist snippets captured during private browsing sessions.',
      },
      {
        q: 'What metadata is captured automatically with each snippet?',
        a: 'The source webpage URL, page title, surrounding section heading, timestamp, and detected programming language are stored alongside the code.',
      },
      {
        q: 'What programming languages are supported for syntax highlighting?',
        a: 'JavaScript, TypeScript, Python, Go, Rust, PHP, HTML, CSS, SQL, Bash, JSON, YAML, Dockerfile, and Markdown, with automatic language detection and manual override.',
      },
    ],
  },
  {
    category: 'Privacy, Security & Storage',
    questions: [
      {
        q: 'Does KuraCode send my code to any cloud servers?',
        a: 'No. In the pre-release and launch version, nothing leaves your device. All data is stored in your browser local storage.',
      },
      {
        q: 'Does KuraCode contain any analytics or tracking scripts?',
        a: 'No. KuraCode contains zero analytics, zero telemetry beacons, and zero tracking cookies.',
      },
      {
        q: 'What does the built-in secret scanner do?',
        a: 'The secret scanner runs locally to detect accidental tokens, passwords, AWS keys, or private SSH keys in your snippet before you copy or export it.',
      },
      {
        q: 'Can I export all my data?',
        a: 'Yes. You can export your entire library at any time as JSON or structured Markdown files without lock-in.',
      },
      {
        q: 'How are extension permissions scoped?',
        a: 'KuraCode follows the principle of least privilege. The extension declares only 4 essential permissions: activeTab (captures highlighted code upon user trigger), contextMenus (right-click save action), storage (persists local settings), and unlimitedStorage (prevents quota eviction for large code libraries). Zero broad host permissions.',
      },
    ],
  },
  {
    category: 'Roadmap & Future Integrations',
    questions: [
      {
        q: 'Is team collaboration or cloud sync available right now?',
        a: 'No. Team workspaces and cloud synchronization are labeled "Coming soon" and will only be enabled after the initial local-first release.',
      },
      {
        q: 'Will there be a VS Code extension?',
        a: 'A VS Code companion extension is on the planned roadmap to allow two-way insertion between browser and IDE.',
      },
      {
        q: 'Will KuraCode support Safari?',
        a: 'Safari support is planned for a future release cycle following the Chromium and Firefox rollouts.',
      },
      {
        q: 'Are AI code explanation features available now?',
        a: 'No. AI helpers and auto-tagging are classified as "Planned" and are not included in the pre-release build.',
      },
      {
        q: 'How do I report a bug or request a feature?',
        a: 'You can submit feedback via the KuraCode Support page or open an issue on the official GitHub repository.',
      },
    ],
  },
];

export default KURACODE_FAQS;

