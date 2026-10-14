/**
 * Navigation Configuration (Single Source of Truth)
 *
 * All navigation surfaces (desktop header, mobile menu, footer sitemap,
 * command palette, and the site-index review page) MUST consume this configuration.
 *
 * Rules:
 * - Do not hardcode navigation links in component files.
 * - All anchor links (#projects, #experience, #certifications) resolve to homepage sections.
 * - All page links resolve to real or stub routes.
 */

export const NAV_GROUPS = [
  { id: 'work', label: 'Work', description: 'Production code, agency platforms & hardware gear' },
  { id: 'knowledge', label: 'Knowledge', description: 'Essays, system topology & engineering garden' },
  { id: 'lab', label: 'Lab', description: 'Collaborative rooms, experiments & developer tools' },
  { id: 'about', label: 'About', description: 'Operator profile, verified credentials & telemetry' },
  { id: 'contact', label: 'Contact', description: 'Direct transmission channel & lead ingestion' },
];

export const NAVIGATION_ITEMS = [
  // ── 01. Work ──────────────────────────────────────────────
  {
    id: 'nav-projects',
    label: 'Projects',
    href: '/#projects',
    type: 'anchor',
    group: 'work',
    description: 'AI tutoring, cold-chain IoT hardware & full-stack web platforms',
    status: 'live',
    keywords: ['projects', 'code', 'portfolio', 'iot', 'patent', 'work'],
    icon: 'folder',
  },
  {
    id: 'nav-experience',
    label: 'Experience',
    href: '/#experience',
    type: 'anchor',
    group: 'work',
    description: 'Career timeline: Ib Arts, WEFIK, and enterprise document QA',
    status: 'live',
    keywords: ['experience', 'career', 'jobs', 'history', 'timeline', 'work'],
    icon: 'briefcase',
  },
  {
    id: 'nav-wefik',
    label: 'WEFIK',
    href: '/wefik',
    type: 'page',
    group: 'work',
    description: 'Digital agency co-founded in 2021 delivering 30+ client products',
    status: 'live',
    keywords: ['wefik', 'agency', 'client', 'co-founder', 'business'],
    icon: 'building',
  },
  {
    id: 'nav-plugin',
    label: 'Plugin',
    href: '/plugin',
    type: 'page',
    group: 'work',
    description: 'Site Checkup WordPress performance & security extension suite',
    status: 'live',
    keywords: ['plugin', 'wordpress', 'security', 'checkup', 'tools'],
    icon: 'puzzle',
  },
  {
    id: 'nav-store',
    label: 'Store',
    href: '/store',
    type: 'page',
    group: 'work',
    description: 'Curated developer gear, workstation hardware & verified recommendations',
    status: 'live',
    keywords: ['store', 'gear', 'hardware', 'setup', 'amazon', 'products'],
    icon: 'shopping-bag',
  },

  // ── 02. Knowledge ─────────────────────────────────────────
  {
    id: 'nav-blog',
    label: 'Blog',
    href: '/blog',
    type: 'page',
    group: 'knowledge',
    description: 'Headless articles, software architecture & systems engineering essays',
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
    description: 'Digital garden covering patents, cloud infrastructure & algorithms',
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
    description: 'System topology, request lifecycles & edge security diagrams',
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
    description: 'Daily developer workstation, dual-monitor setup & software toolchain',
    status: 'live',
    keywords: ['uses', 'setup', 'hardware', 'rig', 'specs', 'desk'],
    icon: 'monitor',
  },

  // ── 03. Lab ───────────────────────────────────────────────
  {
    id: 'nav-play',
    label: 'Play',
    href: '/play',
    type: 'page',
    group: 'lab',
    description: 'Interactive experimental canvas, audio nodes & WebGL shaders',
    status: 'live',
    keywords: ['play', 'experiment', 'canvas', 'shaders', 'webgl'],
    icon: 'sparkles',
  },
  {
    id: 'nav-lounge',
    label: 'Lounge',
    href: '/lounge',
    type: 'page',
    group: 'lab',
    description: 'Real-time collaborative hangout with synchronized video & audio mesh',
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
    description: 'Multiplayer collaborative whiteboard and infinite concept canvas',
    status: 'live',
    keywords: ['space', 'whiteboard', 'canvas', 'multiplayer', 'draw'],
    icon: 'edit-3',
  },
  {
    id: 'nav-vault',
    label: 'Vault',
    href: '/vault',
    type: 'page',
    group: 'lab',
    description: 'Curated cultural archive of influential cinema, literature & records',
    status: 'live',
    keywords: ['vault', 'media', 'books', 'movies', 'music', 'archive'],
    icon: 'lock',
  },
  {
    id: 'nav-confession',
    label: 'Confession',
    href: '/confession',
    type: 'page',
    group: 'lab',
    description: 'Anonymous cryptographic feedback transmission channel',
    status: 'live',
    keywords: ['confession', 'feedback', 'anonymous', 'inbox'],
    icon: 'message-square',
  },
  {
    id: 'nav-tools',
    label: 'Tools',
    href: '/tools',
    type: 'page',
    group: 'lab',
    description: 'In-browser utilities: base64, hash generation & JSON formatting',
    status: 'live',
    keywords: ['tools', 'utilities', 'formatters', 'encoders', 'regex'],
    icon: 'terminal',
  },

  // ── 04. About ─────────────────────────────────────────────
  {
    id: 'nav-about',
    label: 'About',
    href: '/about',
    type: 'page',
    group: 'about',
    description: 'Senior software developer background, patents, vision & bio',
    status: 'live',
    keywords: ['about', 'bio', 'story', 'developer', 'sonu', 'engineer'],
    icon: 'user',
  },
  {
    id: 'nav-certifications',
    label: 'Certifications',
    href: '/#certifications',
    type: 'anchor',
    group: 'about',
    description: 'CompTIA, IBM, TryHackMe & 30+ verified industry credentials',
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
    description: 'Real-time telemetry, server health & third-party service probes',
    status: 'live',
    keywords: ['status', 'uptime', 'health', 'telemetry', 'ping', 'infrastructure'],
    icon: 'activity',
  },

  // ── 05. Primary CTA ───────────────────────────────────────
  {
    id: 'nav-contact',
    label: 'Contact',
    href: '/contact',
    type: 'page',
    group: 'contact',
    description: 'Direct communication portal for engineering inquiries & contracts',
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
    description: 'GDPR/CCPA privacy notice and minimal data retention terms',
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
    description: 'Platform usage guidelines and intellectual property notice',
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
    description: 'Telegram bot communication policies and zero-retention rules',
    status: 'live',
    keywords: ['bot', 'telegram', 'privacy'],
    icon: 'bot',
  },
];

export const EXCLUDED_FROM_NAV = [
  {
    id: 'nav-studio',
    label: 'Sanity Studio',
    href: '/studio',
    type: 'page',
    group: 'excluded',
    description: 'Gated headless content management studio',
    status: 'live',
  },
  {
    id: 'nav-offline',
    label: 'Offline Fallback',
    href: '/offline',
    type: 'page',
    group: 'excluded',
    description: 'PWA service worker offline fallback screen',
    status: 'live',
  },
  {
    id: 'nav-site-index',
    label: 'Site Index',
    href: '/site-index',
    type: 'page',
    group: 'excluded',
    description: 'Complete directory of all platform routes and documents',
    status: 'stub',
  },
];

/**
 * Helper to retrieve items belonging to a specific group
 * @param {string} groupId
 * @returns {Array} List of navigation items in group
 */
export function getNavItemsByGroup(groupId) {
  return NAVIGATION_ITEMS.filter((item) => item.group === groupId);
}

/**
 * Helper to retrieve all indexed routes (including legal and utility)
 * @returns {Array} Consolidated list of all navigatable routes
 */
export function getAllNavigableItems() {
  return [...NAVIGATION_ITEMS, ...FOOTER_LEGAL_ITEMS];
}
