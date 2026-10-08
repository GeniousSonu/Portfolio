/**
 * Plugin Documentation Topics & Content Definition
 * Sourced directly from readme.txt, class-task-registry.php, and plugin documentation.
 */

export const DOCS_TOPICS = [
  {
    slug: 'installation',
    title: 'Installation & Activation',
    shortDesc: 'Step-by-step installation via WordPress Admin ZIP upload or manual server directory placement.',
  },
  {
    slug: 'getting-started',
    title: 'Getting Started & First Audit',
    shortDesc: 'How to calculate your baseline SOP Coverage score, review findings, and run automated hardening safely.',
  },
  {
    slug: 'task-reference',
    title: 'Complete SOP Task Reference',
    shortDesc: 'Full catalog of all 64 security checklist tasks organized across 7 agency SOP sections.',
  },
  {
    slug: 'recommended-settings',
    title: 'Recommended Configuration',
    shortDesc: 'Best practices for Nginx/Apache directives, Wordfence bridges, 2FA, and staging environments.',
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting & FAQ',
    shortDesc: 'Emergency lockout recovery, Nginx directive export, secret scrubbing, and multisite notes.',
  },
  {
    slug: 'updating',
    title: 'Updating the Plugin',
    shortDesc: 'Upgrading between releases via WordPress.org or self-hosted update-info.json builds.',
  },
];

export default DOCS_TOPICS;
