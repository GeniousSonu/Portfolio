import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageShell, PageHeader, Container, Section } from '@/components/layout';
import { buildMetadata } from '@/lib/seo';
import styles from './wefik.module.css';

export const metadata = buildMetadata({
  title: 'WEFIK — Agency Co-Founder & Technical Leadership | SK Sahinur Islam',
  description:
    'Comprehensive venture dossier of WEFIK (Web Era for Innovation & Knowledge), co-founded by SK Sahinur Islam. Real-life genie of your ideas: 30+ production platforms, custom Next.js engineering, UI/UX design, Shopify, and cloud infrastructure.',
  path: '/wefik',
});

const AGENCY_SERVICES = [
  {
    title: 'Custom Web Application Development',
    badge: 'Engineering',
    desc: 'Engineering resilient, scalable web applications with sub-second page loads, modular React/Next.js frontends, and hardened Node.js/Express backends built for high concurrent traffic.',
    deliverables: [
      'Single-Page (SPA) & SSR Portals',
      'High-throughput REST & GraphQL APIs',
      'Role-based access control (RBAC)',
      'Sub-100ms edge caching & microservices',
    ],
    stack: ['Next.js', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'UI/UX & Product Design Systems',
    badge: 'Design',
    desc: 'Translating complex user journeys into intuitive, elegant digital interfaces. We craft end-to-end design systems in Figma that maintain strict consistency from wireframe to code.',
    deliverables: [
      'Interactive Figma prototypes & wireframes',
      'Component design systems & token libraries',
      'User journey mapping & usability audits',
      'WCAG 2.1 AA accessibility compliance',
    ],
    stack: ['Figma', 'Design Systems', 'Micro-Interactions', 'Prototyping'],
  },
  {
    title: 'Shopify & Headless E-Commerce',
    badge: 'Commerce',
    desc: 'Building high-converting digital storefronts and bespoke Shopify experiences engineered to optimize checkout conversion, sync real-time inventories, and scale internationally.',
    deliverables: [
      'Custom Shopify theme & Liquid development',
      'Headless commerce architecture',
      'Multi-currency payment gateways (Stripe, Razorpay)',
      'Custom inventory & ERP integrations',
    ],
    stack: ['Shopify Liquid', 'Storefront API', 'Hydrogen', 'Stripe'],
  },
  {
    title: 'WordPress & Bespoke CMS Engineering',
    badge: 'CMS',
    desc: 'Zero-bloat, bespoke WordPress engineering designed for speed, editorial freedom, and ironclad security. Custom Gutenberg blocks and headless CMS setups tailored to each brand.',
    deliverables: [
      'Custom themes with zero third-party bloat',
      'Custom Gutenberg block development',
      'Headless WordPress with Next.js frontend',
      'Enterprise security & performance audits',
    ],
    stack: ['WordPress', 'PHP', 'ACF Pro', 'WP REST API', 'MySQL'],
  },
  {
    title: 'Brand Identity & Visual Direction',
    badge: 'Branding',
    desc: 'Crafting distinctive brand personalities that command authority. From logo marks and bespoke color palettes to comprehensive brand books and digital marketing assets.',
    deliverables: [
      'Primary & secondary logo marks',
      'Brand style guides & typography rules',
      'Marketing collateral & pitch decks',
      'Digital social identity kits',
    ],
    stack: ['Brand Strategy', 'Vector Craft', 'Visual Systems', 'Typography'],
  },
  {
    title: 'Technical SEO & Performance Tuning',
    badge: 'Growth',
    desc: 'Data-driven search engine optimization and Core Web Vitals optimization engineered to achieve top search rankings and drive sustainable organic acquisition.',
    deliverables: [
      'Complete Core Web Vitals overhauls',
      'Schema.org structured data implementation',
      'Technical site audits & crawl budget tuning',
      'Keyword strategy & on-page optimization',
    ],
    stack: ['Search Console', 'Lighthouse 100', 'Schema.org', 'Analytics'],
  },
];

const CASE_STUDIES = [
  {
    title: 'Enterprise Document QA & Pipeline Engine',
    category: 'Fintech / Legal',
    desc: 'High-speed document parsing, OCR ingestion, and QA automation pipeline processing multi-megabyte PDF and architectural documents with automated format verification and zero defect rate.',
    impact: '99.8% verification accuracy across 50,000+ monthly documents',
    stack: ['Node.js', 'Python', 'AWS S3', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'High-Volume Headless E-Commerce Storefront',
    category: 'Retail & Commerce',
    desc: 'Custom headless storefront delivering sub-100ms product catalog lookups, real-time multi-warehouse stock sync, and localized multi-currency Stripe checkout.',
    impact: '3.4x faster checkout speed; 42% boost in mobile conversion rate',
    stack: ['Next.js', 'Shopify Storefront API', 'Redis', 'Stripe'],
  },
  {
    title: 'Real-Time Fleet & Cold-Chain IoT Dashboard',
    category: 'Hardware & Healthcare IoT',
    desc: 'Live telemetry ingestion engine aggregating temperature probes, GPS coordinates, and vehicle health metrics over WebSocket channels with automatic alert triggers.',
    impact: 'Continuous sub-second telemetry across 120+ active transit units',
    stack: ['Node.js', 'MQTT', 'Docker', 'WebSockets', 'PostgreSQL'],
  },
  {
    title: 'WEFIK Agency Internal Operating System',
    category: 'Internal Systems',
    desc: 'Internal business platform for WEFIK — centralized client portal, milestone tracking, automated invoice generation, and developer task assignment.',
    impact: 'Streamlined agency operations across 30+ simultaneous client projects',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
  },
];

const TECH_PILLARS = [
  {
    domain: 'Frontend & Frameworks',
    skills: ['Next.js', 'React.js', 'TypeScript', 'Vanilla CSS Modules', 'Tailwind CSS', 'HTML5 / Semantic UI'],
  },
  {
    domain: 'Backend & APIs',
    skills: ['Node.js', 'Express.js', 'Python', 'PHP', 'Laravel', 'RESTful APIs', 'GraphQL', 'WebSockets'],
  },
  {
    domain: 'Databases & Cloud',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS (S3, EC2)', 'Docker', 'Linux VPS', 'Vercel'],
  },
  {
    domain: 'E-Commerce & CMS',
    skills: ['Shopify Liquid', 'Headless WordPress', 'ACF Pro', 'WooCommerce', 'Stripe', 'Razorpay'],
  },
];

export default function WefikPage() {
  return (
    <PageShell dataRoute="/wefik">
      <PageHeader
        eyebrow="[ VENTURE DOSSIER · CO-FOUNDER & TECHNICAL LEAD ]"
        title="WEFIK — Web Era for Innovation & Knowledge"
        summary="Turning ambitious concepts into digital reality. Co-founded in March 2021 as a premier digital engineering and design agency in Kolkata, delivering 30+ production systems for global clients."
      />

      <Section className={styles.wrapper}>
        <Container>
          {/* Hero Agency Identity Card */}
          <div className={styles.agencyHeroCard}>
            <div className={styles.heroBrandRow}>
              <div className={styles.logoBadge}>
                <Image
                  src="/logo/wefik.jpeg"
                  alt="WEFIK official logo"
                  width={64}
                  height={64}
                  className={styles.brandLogoImg}
                  priority
                />
              </div>

              <div className={styles.brandTitleArea}>
                <div className={styles.brandMetaTags}>
                  <span className={styles.statusLive}>
                    <span className={styles.livePulse} aria-hidden="true" /> Active Venture
                  </span>
                  <span className={styles.tagMono}>Est. March 2021</span>
                  <span className={styles.tagMono}>Kolkata, India</span>
                </div>
                <h2 className={styles.agencySlogan}>&ldquo;Real Life Genie of Your Idea&rdquo;</h2>
                <p className={styles.agencySubhead}>
                  Full-service web development, bespoke UI/UX design, and scalable cloud software agency.
                </p>
              </div>
            </div>

            {/* Action Buttons for Real Agency Interaction */}
            <div className={styles.actionButtonBar}>
              <a
                href="https://www.wefik.in/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnGold}`}
              >
                <span>Visit Official Site (wefik.in)</span>
                <span className={styles.btnArrow} aria-hidden="true">↗</span>
              </a>

              <a
                href="https://cal.com/wefik/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnGhost}`}
              >
                <span>Book 30-Min Strategy Call</span>
                <span className={styles.btnArrow} aria-hidden="true">↗</span>
              </a>

              <a
                href="mailto:info@wefik.in"
                className={`${styles.actionBtn} ${styles.actionBtnGhost}`}
              >
                <span>Email: info@wefik.in</span>
                <span className={styles.btnArrow} aria-hidden="true">✉</span>
              </a>

              <a
                href="https://wa.me/919609653522"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnGhost}`}
              >
                <span>WhatsApp / Phone</span>
                <span className={styles.btnArrow} aria-hidden="true">💬</span>
              </a>

              <Link
                href="/contact"
                className={`${styles.actionBtn} ${styles.actionBtnGhost}`}
              >
                <span>Discuss with Sonu</span>
                <span className={styles.btnArrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className={styles.metricsBar}>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>30+</div>
              <div className={styles.metricLabel}>Client Systems Delivered</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>4.9/5</div>
              <div className={styles.metricLabel}>Client Satisfaction Rating</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>5+</div>
              <div className={styles.metricLabel}>Countries Served</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>2021</div>
              <div className={styles.metricLabel}>Founded in Kolkata</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>99.9%</div>
              <div className={styles.metricLabel}>Production Uptime SLA</div>
            </div>
          </div>

          {/* Agency Story & Technical Leadership */}
          <div className={styles.sectionBlock}>
            <span className={styles.blockTag}>Executive Dossier &amp; Architecture</span>
            <h2 className={styles.blockTitle}>Engineering Reliable Digital Platforms for Global Growth</h2>
            <div className={styles.blockText}>
              <p>
                In March 2021, I co-founded <strong>WEFIK (Web Era for Innovation &amp; Knowledge)</strong> in Kolkata, India,
                driven by a clear mission: to act as the <em>&ldquo;Real Life Genie of Your Idea&rdquo;</em>, transforming ambitious concepts
                from founders, enterprises, and growing businesses into production-grade, beautifully crafted digital reality.
              </p>
              <p>
                As <strong>Co-Founder &amp; Principal Systems Architect</strong>, I established the agency&apos;s technical blueprint
                from ground zero. My direct responsibilities encompass full-stack architecture, backend system design, database modeling,
                DevOps automation, and mentoring our engineering team on clean code practices, security audits, and sub-second performance.
              </p>
              <p>
                Over more than 5 years of steady execution, WEFIK has partnered with clients across North America, Europe, the Middle East,
                and India — shipping over 30 bespoke web applications, headless e-commerce platforms, brand identities, and high-performance websites.
              </p>
            </div>
          </div>

          {/* Comprehensive Services Grid */}
          <div className={styles.sectionBlock}>
            <div className={styles.blockHeaderFlex}>
              <div>
                <span className={styles.blockTag}>Agency Capabilities</span>
                <h2 className={styles.blockTitle}>Core Service Offerings</h2>
              </div>
              <a
                href="https://www.wefik.in/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.headerExternalLink}
              >
                Explore on wefik.in ↗
              </a>
            </div>

            <div className={styles.servicesGrid}>
              {AGENCY_SERVICES.map((s) => (
                <article key={s.title} className={styles.serviceCard}>
                  <div className={styles.serviceTop}>
                    <span className={styles.serviceBadge}>{s.badge}</span>
                    <h3 className={styles.serviceTitle}>{s.title}</h3>
                  </div>
                  <p className={styles.serviceDesc}>{s.desc}</p>

                  <div className={styles.deliverablesList}>
                    <span className={styles.deliverableHeading}>Key Deliverables:</span>
                    <ul>
                      {s.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.techPills}>
                    {s.stack.map((tech) => (
                      <span key={tech} className={styles.stackPill}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Client Deliverables & Case Studies */}
          <div className={styles.sectionBlock}>
            <span className={styles.blockTag}>Selected Case Studies</span>
            <h2 className={styles.blockTitle}>Key Client Implementations</h2>
            <div className={styles.caseGrid}>
              {CASE_STUDIES.map((c) => (
                <div key={c.title} className={styles.caseCard}>
                  <div className={styles.caseHeader}>
                    <span className={styles.caseBadge}>{c.category}</span>
                  </div>
                  <h3 className={styles.caseTitle}>{c.title}</h3>
                  <p className={styles.caseDesc}>{c.desc}</p>
                  <div className={styles.caseImpact}>
                    <span className={styles.impactIcon}>⚡</span>
                    <span>{c.impact}</span>
                  </div>
                  <div className={styles.caseStack}>
                    {c.stack.map((s) => (
                      <span key={s} className={styles.stackPill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Pillars Matrix */}
          <div className={styles.sectionBlock}>
            <span className={styles.blockTag}>Production Stack</span>
            <h2 className={styles.blockTitle}>Engineered with Modern Technologies</h2>
            <div className={styles.pillarsGrid}>
              {TECH_PILLARS.map((pillar) => (
                <div key={pillar.domain} className={styles.pillarCard}>
                  <h3 className={styles.pillarDomain}>{pillar.domain}</h3>
                  <div className={styles.pillarSkills}>
                    {pillar.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Trust & Credibility Quote */}
          <div className={styles.quoteBlock}>
            <div className={styles.quoteMark}>“</div>
            <blockquote className={styles.quoteText}>
              WEFIK delivers an exceptional blend of sharp aesthetic sensitivity and ironclad technical stability.
              Whether scaling e-commerce catalogs or engineering secure cloud workflows, their execution is disciplined,
              punctual, and focused on tangible business ROI.
            </blockquote>
            <div className={styles.quoteAuthor}>
              <strong>Verified Client Partner</strong>
              <span>International E-Commerce &amp; Systems Brand</span>
            </div>
          </div>

          {/* Consultation & Action CTA */}
          <div className={styles.ctaBox}>
            <div className={styles.ctaBadge}>Ready to Build?</div>
            <h2 className={styles.ctaTitle}>Transform Your Idea into Production Reality</h2>
            <p className={styles.ctaDesc}>
              Whether you need a high-performance web platform, a custom Shopify storefront, or dedicated backend engineering,
              our team at WEFIK and I are ready to architect your next milestone.
            </p>
            <div className={styles.ctaActions}>
              <a
                href="https://cal.com/wefik/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnGold}`}
              >
                Book 30-Min Strategy Call (Cal.com) ↗
              </a>
              <a
                href="https://www.wefik.in/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnGhost}`}
              >
                Explore WEFIK Official Site ↗
              </a>
              <Link href="/contact" className={`${styles.actionBtn} ${styles.actionBtnGhost}`}>
                Direct Discussion with Sonu →
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
