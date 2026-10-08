/**
 * WordPress Plugin Changelog Data
 * Sourced directly from readme.txt (= x.y.z =) and update-info.json
 *
 * To update for a new release:
 * 1. Add the new version block to the top of CHANGELOG_RELEASES array.
 * 2. Update `version` and `updatedDate` in `src/config/plugin.js`.
 */

export const CHANGELOG_RELEASES = [
  {
    version: '1.3.1',
    date: 'September 28, 2026',
    changes: [
      {
        type: 'Fix',
        description:
          'Parameterized and strictly escaped database table queries across migration readiness, DB health scanner, and task status lookup.',
      },
      {
        type: 'Fix',
        description:
          'Excluded internal agent and development markdown files (AGENTS.md, DEVELOPMENT.md, CONTRIBUTING.md, README.md, .agents/) from release packages.',
      },
      {
        type: 'Hardening',
        description:
          'Strengthened SQL query preparation and table validation matching strict injection-prevention guidelines.',
      },
    ],
  },
  {
    version: '1.3.0',
    date: 'September 25, 2026',
    changes: [
      {
        type: 'Feature',
        description:
          'Multi-Source Vulnerability Intelligence — Unified threat feed integrating GitHub Advisory Database (GHSA), Google OSV, NIST NVD, CISA Known Exploited Vulnerabilities (KEV), and WPScan with strict Guideline 7 consent toggles and HKDF-encrypted API keys.',
      },
      {
        type: 'Feature',
        description:
          'Compound Version-Range Correlation — Semver boundary parser (<, <=, >, >=, =, x, compound , / AND) mapping vulnerability ranges accurately to installed plugin/theme versions.',
      },
      {
        type: 'Feature',
        description:
          '3-State Fix Verification — Verifies vulnerability remediations (done, applied_unverified, not_applied) through live HTTP header and file checks.',
      },
      {
        type: 'Feature',
        description:
          'External Fingerprint & Information Disclosure Audit — Non-destructive loopback scanner probing for exposed backup dumps, sensitive files, and version leaks.',
      },
      {
        type: 'Security',
        description:
          'End-to-End Cryptographic Masking — HKDF-derived encryption at rest for all third-party API credentials with write-only REST submissions and masked getters.',
      },
    ],
  },
  {
    version: '1.2.0',
    date: 'September 20, 2026',
    changes: [
      {
        type: 'Feature',
        description:
          'REST API Security Auditor — Complete discovery and permission callback inspection of all registered REST endpoints across core, active plugins, and themes with risk scoring and source reflection.',
      },
      {
        type: 'Feature',
        description:
          'Environment Badge Tagging — Persistent, color-coded admin bar badge (Production/Red, Staging/Amber, Development/Gray) with smart heuristics and hostname safety guards.',
      },
      {
        type: 'Feature',
        description:
          'Developer Diagnostic Snapshot — Sanitized Markdown system report export for GitHub issues and tickets with strict secret/salt/password redaction.',
      },
      {
        type: 'Feature',
        description:
          'WP-Cron Health Auditor — Inspection of scheduled background tasks with overdue stalled event detection (>600s late) and duplicate hook identification.',
      },
      {
        type: 'Feature',
        description:
          'Database Health Scanner & Bloat Cleanup — Detection of orphaned postmeta, orphaned usermeta, expired transients, and excess revisions with protected Level-B cleanup gated by administrator re-authentication and recent backup validation.',
      },
      {
        type: 'Feature',
        description:
          'Migration Serialization Readiness — Bounded scanning for absolute site URLs embedded inside serialized PHP objects with actionable WP-CLI search-replace guidance.',
      },
      {
        type: 'Feature',
        description:
          'Weekly Changelog Digest — Automated aggregation of available plugin and theme updates with upgrade notice highlighting, scheduled weekly digest alerts, and manual inspection.',
      },
      {
        type: 'Integration',
        description:
          'Self-Hosted Update Checker — Native support for update notifications and changelog viewing via YahnisElsts/plugin-update-checker library, cleanly isolated from WordPress.org releases.',
      },
    ],
  },
  {
    version: '1.0.2',
    date: 'September 15, 2026',
    changes: [
      {
        type: 'Fix',
        description:
          'Resolve Run-button flicker and silent reversion on audit scanner tasks (File Permissions Audit, PHP Security Restrictions, Database Table Prefix, etc.) by ensuring all task response states (completed, unverified, findings-detected, failed) render explicit, visible UI states and appropriate action buttons.',
      },
      {
        type: 'Fix',
        description:
          'Restrict administrator password re-authentication exclusively to destructive, state-changing tasks (file modifications, plugin deletion, login URL renames, salt rotation, application password revocation) and exclude all read-only diagnostic scanners.',
      },
      {
        type: 'Performance',
        description:
          'Extend re-authentication token validity to a 30-minute trusted window after successful verification, eliminating repetitive password re-entry while retaining session binding and instant invalidation on logout or password change.',
      },
      {
        type: 'UI',
        description:
          'Retain updated task row visibility and add visual highlight animation upon manual scan execution during filtered status views.',
      },
    ],
  },
  {
    version: '1.0.1',
    date: 'September 12, 2026',
    changes: [
      {
        type: 'Fix',
        description:
          'Prevent syntax corruption in wp-config.php during security salt rotation by removing unescaped quotes/backreferences and using safe callback replacement.',
      },
      {
        type: 'Fix',
        description:
          'Ensure full excision of empty marker blocks and directive-aware verification in WPSG_Htaccess_Manager.',
      },
      {
        type: 'Fix',
        description:
          'Ensure dbDelta schema updates run automatically on plugin version upgrades, not only on initial activation.',
      },
      {
        type: 'Fix',
        description:
          'Replace native browser confirm dialogs with accessible, branded custom modal dialogs.',
      },
      {
        type: 'Fix',
        description:
          'Enforce design tokens across entire admin stylesheet, eliminating hardcoded hex values.',
      },
      {
        type: 'Fix',
        description:
          'Resolve header case-sensitivity in loopback self-verification checks.',
      },
    ],
  },
  {
    version: '1.0.0',
    date: 'September 10, 2026',
    changes: [
      {
        type: 'Initial',
        description: 'Initial release with Task Registry covering complete agency SOP checklist items.',
      },
      {
        type: 'Feature',
        description: 'Implemented client-driven sequential batch runner.',
      },
      {
        type: 'Feature',
        description:
          '.htaccess and wp-config.php marker managers with health checks and live pre-execution diff preview.',
      },
      {
        type: 'Feature',
        description: 'Integrated baseline drift scanner for rogue admins and wp_options.',
      },
      {
        type: 'Feature',
        description: 'Added Nginx server detection and snippet exporter.',
      },
      {
        type: 'Integration',
        description: 'Integrated Patchstack vulnerability database API with match-confidence scoring.',
      },
      {
        type: 'Feature',
        description:
          'Multi-protocol TLS probe (TLSv1.0 – TLSv1.3) and certificate chain depth verification.',
      },
      {
        type: 'Feature',
        description:
          'Strict file permissions auditing (640 for wp-config.php, 644 files, 755 directories).',
      },
      {
        type: 'Feature',
        description:
          'RFC 9116 /.well-known/security.txt generator with document root containment.',
      },
      {
        type: 'Feature',
        description: 'Informational SPF/DKIM/DMARC domain authentication checker.',
      },
      {
        type: 'Feature',
        description: '12-month audit log retention and 15-day / 90-day / 6-month automated scheduler.',
      },
    ],
  },
];

export default CHANGELOG_RELEASES;
