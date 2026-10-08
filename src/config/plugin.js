/**
 * Central Configuration for WordPress Plugins Showcase
 *
 * All plugin-related pages read exclusively from this configuration.
 * Nothing should be hardcoded outside this file.
 */

export const PLUGIN_CONFIG = {
  name: 'GeniousSonu Site Checkup',
  slug: 'genioussonu-site-checkup',
  tagline:
    'Complete security audit, site hardening checklist, and vulnerability scanner for WordPress. One-click safe hardening, login protection, and client reports.',
  version: '1.3.1',
  requiresWp: '5.8',
  testedUpTo: '7.1',
  requiresPhp: '7.4',
  author: 'SK Sahinur Islam',
  authorUrl: 'https://www.genioussonu.me/',
  authorWpProfile: 'https://profiles.wordpress.org/genioussonu/',
  githubRepoUrl: 'https://github.com/GeniousSonu/Site-Checkup-Pro',
  releaseZipUrl:
    'https://github.com/GeniousSonu/Site-Checkup-Pro/archive/refs/tags/v1.3.1.zip',
  // WordPress.org URL remains empty until the plugin directory review is approved
  wordpressOrgUrl: '',
  wpDirectoryStatus: 'Submitted to the WordPress.org directory',
  supportEmail: 'support@genioussonu.me',
  updatedDate: 'September 28, 2026',
  license: 'GPLv2 or later',
  licenseUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
  canonicalPluginUri: 'https://www.genioussonu.me/plugin/genioussonu-site-checkup',
  iconUrl: '/plugin/genioussonu-site-checkup/assets/icon.svg',
  logoUrl: '/plugin/genioussonu-site-checkup/assets/genioussonu-site-checkup-logo.svg',
  badgeUrl: '/plugin/genioussonu-site-checkup/assets/badge-sop-verified.svg',
};

// Plural listing for /plugin index directory
export const ALL_PLUGINS = [PLUGIN_CONFIG];

export default PLUGIN_CONFIG;
