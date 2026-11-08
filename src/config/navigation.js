/**
 * Navigation Configuration (Single Source of Truth)
 *
 * All navigation surfaces (desktop header, mobile menu, footer sitemap,
 * command palette, and the site-index review page) MUST consume this configuration.
 *
 * Plain-voice rules:
 * - At most 5 items per dropdown.
 * - Rows have a title (semibold) and one short descriptor of at most 5 words in sentence case.
 * - No buzzwords, no metaphors, no uppercase descriptions.
 */

export const NAV_GROUPS = [
  {
    id: 'work',
    label: 'Work',
    description: 'Selected projects, agency work, and software tools',
  },
  {
    id: 'about',
    label: 'About',
    description: 'Background, work experience, credentials, and uptime',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    description: 'Articles, wiki notes, and system architecture',
  },
  {
    id: 'lab',
    label: 'Lab',
    description: 'In-browser tools, experiments, and creative canvas',
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Send a message or email',
  },
];

export const NAVIGATION_ITEMS = [
  // ── 01. Work (5 items in dropdown) ──────────────────────────
  {
    id: 'nav-projects',
    label: 'Projects',
    href: '/#projects',
    type: 'anchor',
    group: 'work',
    blurb: 'Selected projects and case studies',
    description: 'Selected projects and case studies',
    status: 'live',
    keywords: ['projects', 'code', 'portfolio', 'iot', 'patent', 'work'],
    icon: 'folder',
  },
  {
    id: 'nav-wefik',
    label: 'WEFIK',
    href: '/wefik',
    type: 'page',
    group: 'work',
    blurb: 'Digital agency co-founded in 2021',
    description: 'Digital agency co-founded in 2021',
    status: 'live',
    keywords: ['wefik', 'agency', 'client', 'co-founder', 'business'],
    icon: 'building',
  },
  {
    id: 'nav-plugin',
    label: 'Plugins',
    href: '/plugin',
    type: 'page',
    group: 'work',
    targetAppHost: true,
    blurb: 'Tools for WordPress sites',
    description: 'Tools for WordPress sites',
    status: 'live',
    keywords: ['plugin', 'wordpress', 'security', 'checkup', 'tools'],
    icon: 'puzzle',
  },
  {
    id: 'nav-extension',
    label: 'Extensions',
    href: '/extensions',
    type: 'page',
    group: 'work',
    targetAppHost: true,
    blurb: 'Browser tools, including KuraCode',
    description: 'Browser tools, including KuraCode',
    status: 'live',
    keywords: ['extension', 'extensions', 'chrome', 'browser', 'kuracode', 'tools'],
    icon: 'blocks',
  },
  {
    id: 'nav-store',
    label: 'Store',
    href: '/store',
    type: 'page',
    group: 'work',
    blurb: 'Developer gear and recommendations',
    description: 'Developer gear and recommendations',
    status: 'live',
    keywords: ['store', 'gear', 'hardware', 'setup', 'amazon', 'products'],
    icon: 'shopping-bag',
  },
  {
    id: 'nav-kuracode',
    label: 'KuraCode',
    href: '/extensions/kuracode',
    type: 'page',
    group: 'work',
    inDropdown: false,
    targetAppHost: true,
    blurb: 'Browser tool for code snippets',
    description: 'Browser tool for code snippets',
    status: 'preview',
    keywords: ['kuracode', 'code', 'snippet', 'extension', 'browser', 'chrome'],
    icon: 'code',
  },

  // ── 02. About (4 items in dropdown) ─────────────────────────
  {
    id: 'nav-about',
    label: 'About',
    href: '/about',
    type: 'page',
    group: 'about',
    blurb: 'Background, systems work, and patent',
    description: 'Background, systems work, and patent',
    status: 'live',
    keywords: ['about', 'bio', 'story', 'developer', 'sonu', 'engineer'],
    icon: 'user',
  },
  {
    id: 'nav-experience',
    label: 'Experience',
    href: '/#experience',
    type: 'anchor',
    group: 'about',
    blurb: 'Work history across companies',
    description: 'Work history across companies',
    status: 'live',
    keywords: ['experience', 'career', 'jobs', 'history', 'timeline', 'work'],
    icon: 'briefcase',
  },
  {
    id: 'nav-certifications',
    label: 'Certifications',
    href: '/#certifications',
    type: 'anchor',
    group: 'about',
    blurb: 'Verified credentials and badges',
    description: 'Verified credentials and badges',
    status: 'live',
    keywords: ['certifications', 'credentials', 'security', 'badges', 'skills'],
    icon: 'award',
  },
  {
    id: 'nav-status',
    label: 'Status',
    href: '/status',
    type: 'page',
    group: 'about',
    blurb: 'System uptime and health',
    description: 'System uptime and health',
    status: 'live',
    keywords: ['status', 'uptime', 'health', 'system', 'ping', 'infrastructure'],
    icon: 'activity',
  },

  // ── 03. Knowledge (4 items in dropdown) ─────────────────────
  {
    id: 'nav-blog',
    label: 'Blog',
    href: '/blog',
    type: 'page',
    group: 'knowledge',
    blurb: 'Articles on architecture and systems',
    description: 'Articles on architecture and systems',
    status: 'live',
    keywords: ['blog', 'articles', 'writing', 'posts', 'sanity', 'essays'],
    icon: 'book-open',
  },
  {
    id: 'nav-wiki',
    label: 'Wiki',
    href: '/wiki',
    type: 'page',
    group: 'knowledge',
    blurb: 'Notes on tools and infrastructure',
    description: 'Notes on tools and infrastructure',
    status: 'live',
    keywords: ['wiki', 'garden', 'notes', 'docs', 'knowledge', 'patent'],
    icon: 'bookmark',
  },
  {
    id: 'nav-architecture',
    label: 'Architecture',
    href: '/architecture',
    type: 'page',
    group: 'knowledge',
    blurb: 'System design and edge topologies',
    description: 'System design and edge topologies',
    status: 'live',
    keywords: ['architecture', 'system', 'flow', 'security', 'diagram', 'diagrams'],
    icon: 'cpu',
  },
  {
    id: 'nav-uses',
    label: 'Uses',
    href: '/uses',
    type: 'page',
    group: 'knowledge',
    blurb: 'Hardware setup and software tools',
    description: 'Hardware setup and software tools',
    status: 'live',
    keywords: ['uses', 'setup', 'hardware', 'rig', 'specs', 'desk'],
    icon: 'monitor',
  },

  // ── 04. Lab (5 items in dropdown) ───────────────────────────
  {
    id: 'nav-tools',
    label: 'Tools',
    href: '/tools',
    type: 'page',
    group: 'lab',
    blurb: 'In-browser developer utilities',
    description: 'In-browser developer utilities',
    status: 'live',
    keywords: ['tools', 'utilities', 'formatters', 'encoders', 'regex'],
    icon: 'terminal',
  },
  {
    id: 'nav-play',
    label: 'Play',
    href: '/play',
    type: 'page',
    group: 'lab',
    blurb: 'Interactive canvas and sound experiments',
    description: 'Interactive canvas and sound experiments',
    status: 'live',
    keywords: ['play', 'experiment', 'canvas', 'shaders', 'webgl'],
    icon: 'sparkles',
  },
  {
    id: 'nav-vault',
    label: 'Vault',
    href: '/vault',
    type: 'page',
    group: 'lab',
    blurb: 'Archive of books and films',
    description: 'Archive of books and films',
    status: 'live',
    keywords: ['vault', 'media', 'books', 'movies', 'music', 'archive'],
    icon: 'lock',
  },
  {
    id: 'nav-lounge',
    label: 'Lounge',
    href: '/lounge',
    type: 'page',
    group: 'lab',
    blurb: 'Real-time room for calls',
    description: 'Real-time room for calls',
    status: 'live',
    keywords: ['lounge', 'hangout', 'video', 'webrtc', 'chat', 'rooms'],
    icon: 'video',
  },
  {
    id: 'nav-space',
    label: 'Space',
    href: '/space',
    type: 'page',
    group: 'lab',
    blurb: 'Collaborative concept canvas',
    description: 'Collaborative concept canvas',
    status: 'live',
    keywords: ['space', 'whiteboard', 'canvas', 'multiplayer', 'draw'],
    icon: 'edit-3',
  },
  {
    id: 'nav-confession',
    label: 'Confession',
    href: '/confession',
    type: 'page',
    group: 'lab',
    inDropdown: false,
    blurb: 'Anonymous message inbox',
    description: 'Anonymous message inbox',
    status: 'live',
    keywords: ['confession', 'feedback', 'anonymous', 'inbox'],
    icon: 'message-square',
  },

  // ── 05. Primary CTA ─────────────────────────────────────────
  {
    id: 'nav-contact',
    label: 'Contact',
    href: '/contact',
    type: 'page',
    group: 'contact',
    blurb: 'Send an email or message',
    description: 'Send an email or message',
    status: 'live',
    keywords: ['contact', 'email', 'hire', 'message', 'telegram'],
    icon: 'mail',
  },
];

export const FOOTER_LEGAL_ITEMS = [
  {
    id: 'nav-privacy',
    label: 'Privacy Policy',
    href: '/privacy',
    type: 'page',
    group: 'legal',
    blurb: 'Privacy notice and data retention',
    description: 'Privacy notice and data retention',
    status: 'live',
    keywords: ['privacy', 'legal', 'data', 'gdpr'],
    icon: 'shield',
  },
  {
    id: 'nav-terms',
    label: 'Terms of Service',
    href: '/terms',
    type: 'page',
    group: 'legal',
    blurb: 'Terms of platform usage',
    description: 'Terms of platform usage',
    status: 'live',
    keywords: ['terms', 'legal', 'conditions'],
    icon: 'file-text',
  },
  {
    id: 'nav-bot-privacy',
    label: 'Bot Privacy',
    href: '/bot/privacy-policy',
    type: 'page',
    group: 'legal',
    blurb: 'Telegram bot privacy policies',
    description: 'Telegram bot privacy policies',
    status: 'live',
    keywords: ['bot', 'telegram', 'privacy'],
    icon: 'bot',
  },
  {
    id: 'nav-imprint',
    label: 'Imprint',
    href: '/imprint',
    type: 'page',
    group: 'legal',
    blurb: 'Legal details and statutory disclosures',
    description: 'Legal details and statutory disclosures',
    status: 'live',
    keywords: ['imprint', 'legal', 'operator', 'impressum', 'statutory'],
    icon: 'info',
  },
];

export const EXCLUDED_FROM_NAV = [
  {
    id: 'nav-studio',
    label: 'Sanity Studio',
    href: '/studio',
    type: 'page',
    group: 'excluded',
    blurb: 'Content management studio',
    description: 'Content management studio',
    status: 'live',
  },
  {
    id: 'nav-offline',
    label: 'Offline Fallback',
    href: '/offline',
    type: 'page',
    group: 'excluded',
    blurb: 'Service worker offline screen',
    description: 'Service worker offline screen',
    status: 'live',
  },
  {
    id: 'nav-site-index',
    label: 'Site Index',
    href: '/site-index',
    type: 'page',
    group: 'excluded',
    blurb: 'Complete directory of all platform routes',
    description: 'Complete directory of all platform routes',
    status: 'stub',
  },
];

/**
 * Helper to retrieve items belonging to a specific group
 * @param {string} groupId
 * @param {object} [options]
 * @param {boolean} [options.dropdownOnly] - If true, excludes items marked inDropdown: false
 * @returns {Array} List of navigation items in group
 */
export function getNavItemsByGroup(groupId, options = {}) {
  return NAVIGATION_ITEMS.filter((item) => {
    if (item.group !== groupId) return false;
    if (options.dropdownOnly && item.inDropdown === false) return false;
    return true;
  });
}

/**
 * Helper to retrieve all indexed routes (including legal and utility)
 * @returns {Array} Consolidated list of all navigatable routes
 */
export function getAllNavigableItems() {
  return [...NAVIGATION_ITEMS, ...FOOTER_LEGAL_ITEMS];
}
