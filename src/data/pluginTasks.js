/**
 * Task Registry Data from GeniousSonu Site Checkup
 * Sourced directly from includes/class-task-registry.php
 */

export const SOP_SECTIONS = [
  {
    "key": "security_update",
    "label": "Security Update",
    "icon": "shield",
    "desc": "Core security patches, automatic update policies, and foundational protection."
  },
  {
    "key": "general_check",
    "label": "General Check",
    "icon": "visibility",
    "desc": "Environment audit, rogue admin detection, database integrity, and file scans."
  },
  {
    "key": "hardening",
    "label": "Hardening",
    "icon": "lock",
    "desc": "Server security headers, .htaccess protection, wp-config restrictions, and login security."
  },
  {
    "key": "seo_sop",
    "label": "SEO SOP",
    "icon": "search",
    "desc": "Search console indexing integrity, robots.txt audit, and URL removal tracking."
  },
  {
    "key": "regular_checks",
    "label": "Regular Checks",
    "icon": "calendar",
    "desc": "Recurring 15-day credential rotations, vault tracking, and staging site protection."
  },
  {
    "key": "advanced_protection",
    "label": "Advanced Protection",
    "icon": "shield-alt",
    "desc": "Login throttling, user enumeration defense, session security, and runtime hardening."
  },
  {
    "key": "report",
    "label": "SOP Report",
    "icon": "clipboard",
    "desc": "Client-ready SOP coverage summary report and export."
  }
];

export const PLUGIN_TASKS = [
  {
    "id": "trigger_backup",
    "section": "security_update",
    "title": "Verify Recent Site Backup",
    "description": "Verifies that a full database & file backup exists within the last 24\u201348 hours (UpdraftPlus, WPvivid, or host snapshot).",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "toggle_auto_updates",
    "section": "security_update",
    "title": "Disable Automatic Updates",
    "description": "Prevents unverified background core, plugin, and theme updates from breaking client customizations. Agency manages updates manually.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "wordfence_config",
    "section": "security_update",
    "title": "Wordfence Firewall & Scanner",
    "description": "Verifies Wordfence WAF status, brute-force lockout rules, and alert preferences against the agency SOP.",
    "level": "B",
    "subType": "guided",
    "hasUndo": false
  },
  {
    "id": "two_factor_auth",
    "section": "security_update",
    "title": "Enforce Two-Factor Authentication (2FA)",
    "description": "Ensures an active 2FA plugin is installed and mandatory for all administrator accounts.",
    "level": "B",
    "subType": "guided",
    "hasUndo": false
  },
  {
    "id": "vulnerability_database_check",
    "section": "security_update",
    "title": "Scan Vulnerability Database (Patchstack CVE)",
    "description": "Cross-references installed plugins and themes against the Patchstack vulnerability database with match-confidence scoring. Cached 24h.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "system_environment_check",
    "section": "general_check",
    "title": "Environment Audit (PHP, WP, SSL)",
    "description": "Audits PHP version (>= 8.1), WordPress core release, and SSL certificate expiration window.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "scan_rogue_admins",
    "section": "general_check",
    "title": "Detect Rogue / Unrecognized Admins",
    "description": "Compares administrator users against the accepted baseline snapshot taken at activation. Alerts on any newly created or altered admin.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "scan_options_integrity",
    "section": "general_check",
    "title": "wp_options Integrity & Autoload Scan",
    "description": "Checks for siteurl/home URL hijacking and flags oversized autoloaded options (>100KB) that cause database slowdowns or malware persistence.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "scan_mu_plugins",
    "section": "general_check",
    "title": "Audit Must-Use (mu-plugins) Directory",
    "description": "Inspects wp-content/mu-plugins for unauthorized PHP scripts that execute automatically outside standard plugin controls.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "scan_exposed_files",
    "section": "general_check",
    "title": "Scan Exposed Backups & Dumps in Webroot",
    "description": "Scans for public database dumps (*.sql), .env files, and wp-config backups accidentally left in the public webroot.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "detect_unwanted_plugins",
    "section": "general_check",
    "title": "Detect & Quarantine Risky Plugins",
    "description": "Detects leftover migration tools (Better Search Replace, File Manager, Duplicate Page). Deleting zips the plugin first to enable real Undo.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "plugin_integrity_check",
    "section": "general_check",
    "title": "Scan Closed / Abandoned Plugins (WP.org)",
    "description": "Checks installed public plugins against the WordPress.org API to detect plugins removed for security vulnerabilities. Cached 24h.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "scaffold_child_theme",
    "section": "general_check",
    "title": "Custom Child Theme Setup",
    "description": "Verifies if a child theme is active. Generates a clean child theme without third-party online generators.",
    "level": "B",
    "subType": "guided",
    "hasUndo": true
  },
  {
    "id": "file_permissions_audit",
    "section": "general_check",
    "title": "File Permissions Audit (wp-config 640, 644/755)",
    "description": "Audits key files and directories against strict permission baselines (wp-config.php <= 0640, root files <= 0644, directories <= 0755) and flags world-writable bits.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "php_server_restrictions",
    "section": "general_check",
    "title": "PHP Security Restrictions (disable_functions & open_basedir)",
    "description": "Audits php.ini to detect if dangerous execution functions (exec, shell_exec, system, passthru) are disabled and whether open_basedir is active.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "db_prefix_check",
    "section": "general_check",
    "title": "Database Table Prefix Detection",
    "description": "Checks whether database tables use the default \"wp_\" prefix or a custom prefix to resist automated SQL injection scripts.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "tls_cert_depth_check",
    "section": "general_check",
    "title": "TLS Protocol & Certificate Chain Depth Probe",
    "description": "Actively probes server support for legacy TLS 1.0 and 1.1 protocols and verifies intermediate certificate chain completeness.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "email_domain_auth_check",
    "section": "general_check",
    "title": "Domain Email Authentication (SPF & DMARC)",
    "description": "Informational DNS query verifying SPF and DMARC records for the sending domain to prevent email spoofing and spam folder placement.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "rest_api_security_audit",
    "section": "general_check",
    "title": "REST API Security Audit",
    "description": "Enumerates all registered WordPress REST API endpoints, inspects permission callbacks, maps source plugins/themes, and identifies unauthenticated exposure risks.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "environment_badge_check",
    "section": "general_check",
    "title": "Environment Tagging & Admin Bar Badge",
    "description": "Tags the environment (Production, Staging, or Development) and displays a persistent color-coded safety badge in the WordPress top admin bar to prevent accidental changes on production.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "diagnostic_snapshot_check",
    "section": "general_check",
    "title": "Developer Diagnostic Snapshot",
    "description": "Generates a sanitized one-click diagnostic snapshot of PHP, server, database, theme, active plugins, and non-sensitive wp-config flags formatted for developer debugging and support tickets.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "cron_job_audit",
    "section": "general_check",
    "title": "WP-Cron Scheduled Events Audit",
    "description": "Lists all scheduled WP-Cron background jobs, detects overdue stalled tasks indicating cron failure, and identifies duplicate conflicting hook registrations.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "db_health_scanner",
    "section": "general_check",
    "title": "Database Overhead & Orphaned Data Scanner",
    "description": "Detects orphaned postmeta, orphaned usermeta, expired transients, and excess post revisions with storage impact metrics and protected Level-B cleanup.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "migration_readiness_check",
    "section": "general_check",
    "title": "Migration URL & Serialization Risk Check",
    "description": "Scans the database for hardcoded absolute URLs embedded inside PHP serialized strings that break during domain migrations, providing safe WP-CLI guidance.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "changelog_digest_check",
    "section": "general_check",
    "title": "Update Changelog Intelligence Digest",
    "description": "Aggregates changelogs and release notes for available plugin/theme updates and delivers a weekly intelligence digest via alerts and dashboard.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "external_fingerprint_check",
    "section": "general_check",
    "title": "External Fingerprint & Information Disclosure Audit",
    "description": "Conducts safe, non-destructive loopback HTTP probes against the site origin to detect exposed sensitive files, version disclosures, backup artifacts, and debug logs.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "disable_xmlrpc",
    "section": "hardening",
    "title": "Disable XML-RPC (Runtime Filter)",
    "description": "Disables XML-RPC pingbacks and brute-force vectors via WordPress core filters and removes discovery link headers.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "restrict_rest_api",
    "section": "hardening",
    "title": "Restrict REST API User Enumeration",
    "description": "Prevents unauthenticated visitors and bots from enumerating usernames via the /wp/v2/users REST route.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "hide_php_version",
    "section": "hardening",
    "title": "Hide PHP Version (X-Powered-By)",
    "description": "Strips the X-Powered-By server response header. Prioritizes Header unset for modern PHP-FPM servers.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "clickjacking_protection",
    "section": "hardening",
    "title": "Clickjacking Protection (X-Frame-Options)",
    "description": "Prevents the site from being loaded inside unauthorized iframes to protect against clickjacking attacks.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "nosniff_header",
    "section": "hardening",
    "title": "MIME Sniffing (X-Content-Type-Options)",
    "description": "Prevents browsers from MIME-sniffing a response away from the declared content-type.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "hsts_header",
    "section": "hardening",
    "title": "HTTP Strict Transport Security (HSTS)",
    "description": "Enforces HTTPS communication with browsers, protecting against man-in-the-middle SSL-strip attacks.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "disable_directory_listing",
    "section": "hardening",
    "title": "Disable Directory Browsing (Indexes)",
    "description": "Prevents visitors from viewing directory file listings in folders without an index file (e.g., /wp-content/uploads/).",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "protect_sensitive_files",
    "section": "hardening",
    "title": "Protect Sensitive System Files",
    "description": "Blocks web access to .env, .git, .bak, readme.html, and wp-config.php directly at the web server layer.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "block_xmlrpc_htaccess",
    "section": "hardening",
    "title": "Block xmlrpc.php at Server Level",
    "description": "Drops requests to xmlrpc.php before WordPress PHP boots, preventing DDoS amplification attacks.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "disable_file_edit",
    "section": "hardening",
    "title": "Disable Theme & Plugin Editor (wp-config.php)",
    "description": "Adds DISALLOW_FILE_EDIT to wp-config.php so compromised admin accounts cannot inject PHP via the dashboard editor.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "rotate_salts",
    "section": "hardening",
    "title": "Rotate WordPress Security Salts & Keys",
    "description": "Generates 8 fresh 64-char crypto salts in wp-config.php, immediately invalidating all active browser cookies and sessions.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": false
  },
  {
    "id": "login_url_rename",
    "section": "hardening",
    "title": "Rename wp-admin Login URL",
    "description": "Hides wp-login.php behind a custom slug. Bridges to WPS Hide Login if present. Recovery is exclusively via WPSG_DISABLE_LOGIN_RENAME in wp-config.php.",
    "level": "B",
    "subType": "guided",
    "hasUndo": false
  },
  {
    "id": "wp_debug_display_check",
    "section": "hardening",
    "title": "Disable Front-End Debug Output (WP_DEBUG_DISPLAY)",
    "description": "Prevents database errors and PHP warnings from displaying on the front-end to site visitors by setting WP_DEBUG_DISPLAY to false in wp-config.php.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "security_txt_check",
    "section": "hardening",
    "title": "Security Disclosure Policy (security.txt)",
    "description": "Verifies and generates RFC 9116 responsible disclosure contact information at /.well-known/security.txt inside the document root.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "robots_txt_review",
    "section": "seo_sop",
    "title": "Audit robots.txt Directives",
    "description": "Ensures search engines are not accidentally disallowed from crawling the site and that sensitive admin endpoints are disallowed.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "gsc_bing_audit",
    "section": "seo_sop",
    "title": "Google Search Console & Bing Review",
    "description": "Audit indexing coverage, security actions, and sitemaps directly in Google Search Console and Bing Webmaster Tools.",
    "level": "B",
    "subType": "guided",
    "hasUndo": false
  },
  {
    "id": "gsc_removal_reminder",
    "section": "seo_sop",
    "title": "6-Month GSC URL Removal Review",
    "description": "Google Search Console temporary URL removals expire after 6 months. Track submitted removals and schedule rechecks.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "cpanel_password_rotation",
    "section": "regular_checks",
    "title": "Rotate cPanel / Hosting Credentials (15d)",
    "description": "Rotate cPanel, FTP, and hosting passwords every 15 days in adherence to the agency security policy. Update vault.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "admin_password_rotation",
    "section": "regular_checks",
    "title": "Rotate WordPress Admin Password (15d)",
    "description": "Rotate main administrator credentials every 15 days, notify client if necessary, and store in secure team vault.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "staging_site_protection",
    "section": "regular_checks",
    "title": "Verify Staging Site Auth Protection",
    "description": "Ensure staging and development environments are shielded by HTTP Basic Auth (Directory Privacy) to prevent indexing and bot probing.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "wordfence_email_alert",
    "section": "regular_checks",
    "title": "Wordfence Email Alert Routing",
    "description": "Verify security alert notifications from Wordfence route to designated agency monitoring inbox.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "backup_restore_test",
    "section": "regular_checks",
    "title": "Quarterly Backup Restore Test (90d)",
    "description": "Untested backups are worthless. Conduct a quarterly rehearsal restoring a database and file backup to a staging environment.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "domain_ssl_hosting_expiry",
    "section": "regular_checks",
    "title": "Domain, SSL & Hosting Expiry Audit (90d)",
    "description": "Quarterly review of domain registration, auto-renewal status, SSL certificate validity, and hosting plan limits.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "incident_response_contact",
    "section": "regular_checks",
    "title": "Incident Response Emergency Contact Sheet",
    "description": "Record emergency contact details and escalation protocols in the event of a security incident. Surfaced on client reports.",
    "level": "C",
    "subType": "manual",
    "hasUndo": false
  },
  {
    "id": "block_user_enumeration",
    "section": "advanced_protection",
    "title": "Block User & Author Enumeration",
    "description": "Restricts unauthenticated access to /wp/v2/users and intercepts ?author= numeric queries to prevent attacker username discovery.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "login_hardening",
    "section": "advanced_protection",
    "title": "Login Throttling & Honeypot Protection",
    "description": "Enforces atomic DB-level progressive lockouts (1m, 15m, 60m), silent honeypots, and generic error masking.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "session_governance",
    "section": "advanced_protection",
    "title": "Active Session Management",
    "description": "Review concurrent logged-in sessions across devices, terminate stale logins, and enforce automatic session invalidation on password updates.",
    "level": "B",
    "subType": "guided",
    "hasUndo": false
  },
  {
    "id": "hide_wordpress_fingerprint",
    "section": "advanced_protection",
    "title": "Hide WordPress Version Meta Tag",
    "description": "Removes the WordPress generator tag from HTML headers and RSS feeds to reduce version fingerprinting.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "strip_script_versions",
    "section": "advanced_protection",
    "title": "Remove ?ver= from Enqueued Scripts & Styles",
    "description": "Strips version query strings from script and stylesheet URLs (Opt-in: may impact browser caching on file updates).",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "deny_uploads_php",
    "section": "advanced_protection",
    "title": "Block PHP Execution in /wp-content/uploads/",
    "description": "Prevents direct execution of PHP scripts in the uploads folder, shutting down web shells uploaded via plugin vulnerabilities.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "core_checksum_integrity",
    "section": "advanced_protection",
    "title": "WordPress Core Files Checksum Scan",
    "description": "Compares local WordPress core files against official WordPress.org release checksums (strictly excluding wp-content).",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "scan_uploads_executables",
    "section": "advanced_protection",
    "title": "Scan Uploads for Executable Scripts",
    "description": "Audits /wp-content/uploads/ for suspicious .php, .phtml, or .phar scripts.",
    "level": "A",
    "subType": "instant",
    "hasUndo": false
  },
  {
    "id": "basic_firewall_rules",
    "section": "advanced_protection",
    "title": "Lightweight Query String Firewall",
    "description": "Hardcoded rule set blocking SQL injection, XSS, and traversal signatures in URL query strings (Opt-in; does not replace a network WAF).",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "bad_bots_noise_reduction",
    "section": "advanced_protection",
    "title": "Noise Reduction: Block Known Vulnerability Scanners",
    "description": "Blocks requests matching known scanner user agents (sqlmap, nikto, wpscan). Accurately labeled: reduces automated scan log noise.",
    "level": "A",
    "subType": "writes_files",
    "hasUndo": true
  },
  {
    "id": "security_headers_csp",
    "section": "advanced_protection",
    "title": "Content-Security-Policy (Report-Only Mode)",
    "description": "Deploys CSP in safe Report-Only mode to log potential violations without breaking page builders or analytics.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "admin_notice_focus_mode",
    "section": "advanced_protection",
    "title": "Admin Notice Focus Mode & Dashboard Declutter",
    "description": "Buffers and sanitizes promotional plugin notices while never suppressing WordPress core updates or security warnings.",
    "level": "A",
    "subType": "instant",
    "hasUndo": true
  },
  {
    "id": "audit_app_passwords",
    "section": "advanced_protection",
    "title": "Audit & Govern Application Passwords",
    "description": "Audit all active application passwords across users, surface unused credentials, and revoke with re-authentication.",
    "level": "B",
    "subType": "guided",
    "hasUndo": false
  },
  {
    "id": "client_security_report",
    "section": "report",
    "title": "Client SOP Coverage Report",
    "description": "Generate a print-ready client audit report summarizing completed hardening, active protections, and outstanding items.",
    "level": "D",
    "subType": "report",
    "hasUndo": false
  }
];
