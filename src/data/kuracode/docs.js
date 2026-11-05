/**
 * KuraCode Documentation Content Registry
 */

export const KURACODE_DOCS = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    shortDesc: 'Install the extension and save your first code snippet in under 60 seconds.',
    content: `
### Welcome to KuraCode

KuraCode is designed to capture and organize code snippets without breaking your development flow. Because it is local-first, it requires no account creation or cloud configuration to start saving snippets.

#### Quick Setup
1. Download the pre-release build from the Install page.
2. Open your Chromium-based browser (Chrome, Edge, Brave) and navigate to \`chrome://extensions\`.
3. Enable **Developer mode** and click **Load unpacked**.
4. Select the unzipped KuraCode directory.
    `,
  },
  {
    slug: 'capture',
    title: 'Capturing Snippets',
    shortDesc: 'Learn the three capture mechanisms: shortcut, right-click context menu, and detected code blocks.',
    content: `
### Three Ways to Capture Code

KuraCode automatically captures the surrounding context so you never ask "Where did I find this?" again.

#### 1. Keyboard Shortcut (Recommended)
Highlight any code block on any web page and press:
- **macOS:** \`⌥ + ⇧ + S\`
- **Windows / Linux:** \`Alt + Shift + S\`

#### 2. Right-Click Context Menu
Select text, right-click, and choose **Save to KuraCode**.

#### 3. Automatic Code Cleaning
When code is captured, KuraCode automatically:
- Strips leading line numbers (e.g. \`1. \`, \`01: \`)
- Strips shell prompts (\`$\`, \`>\`, \`#\`)
- Strips "Copy" or "Copied!" button text accidentally selected
- Preserves accurate tab/space indentation
    `,
  },
  {
    slug: 'organize',
    title: 'Organizing & Tagging',
    shortDesc: 'Create collections, assign tags, search in full-text, and favorite frequent snippets.',
    content: `
### Instant Organization

All saved snippets are stored locally in your browser's indexed storage.

- **Collections:** Group related snippets into projects (e.g. "React Hooks", "Docker Compose", "CSS Grids").
- **Tags:** Apply multiple searchable tags (\`#auth\`, \`#postgres\`, \`#regex\`).
- **Full-Text Search:** Instant offline search matching snippet titles, code bodies, notes, and source domains.
    `,
  },
  {
    slug: 'shortcuts',
    title: 'Keyboard Shortcuts',
    shortDesc: 'Complete reference of built-in shortcuts and customization options.',
    content: `
### Keyboard-First Productivity

| Action | macOS | Windows / Linux | Purpose |
|---|---|---|---|
| Capture Selection | \`⌥ + ⇧ + S\` | \`Alt + Shift + S\` | Saves selected code block with provenance |
| Quick Search Popup | \`⌥ + ⇧ + Y\` | \`Alt + Shift + Y\` | Opens instant fuzzy-search overlay |
| Command Palette | \`⌥ + ⇧ + K\` | \`Alt + Shift + K\` | Manages collections and quick exports |

*Note: You can customize any shortcut in your browser's native extension shortcut settings (\`chrome://extensions/shortcuts\`).*
    `,
  },
  {
    slug: 'export',
    title: 'Export & Backup',
    shortDesc: 'Export your snippet library anytime as JSON or Markdown. No lock-in.',
    content: `
### Data Sovereignty & Portability

Your code belongs to you. KuraCode enforces zero platform lock-in.

- **Export JSON:** Complete raw dump including code, provenance URLs, creation timestamps, and custom tags.
- **Export Markdown:** Structured folder of clean \`.md\` files compatible with Obsidian, Logseq, and VS Code.
- **Delete All:** One-click clear local database with zero server residue.
    `,
  },
];

export default KURACODE_DOCS;
