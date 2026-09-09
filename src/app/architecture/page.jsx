import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './architecture.module.css';

export const metadata = {
  title: 'System Architecture & Data Flows — SK Sahinur Islam',
  description: 'Technical topology, request flow diagrams, and architectural rationale behind the infrastructure powering genioussonu.me.',
  openGraph: {
    title: 'System Architecture — SK Sahinur Islam',
    description: 'Technical topology, serverless relays, and engineering decisions powering this portfolio.',
    url: 'https://genioussonu.me/architecture',
  },
};

export default function ArchitecturePage() {
  const stackItems = [
    {
      name: 'Next.js & React',
      role: 'Application Core',
      desc: 'Built on the App Router with Turbopack, Incremental Static Regeneration (ISR), and progressive web app capabilities with offline asset caching.',
    },
    {
      name: 'Supabase & PostgreSQL',
      role: 'State & Realtime Engine',
      desc: 'Manages low-latency real-time WebSockets, serverless rate counters, collaborative state synchronization, and privacy-preserving site visit logs.',
    },
    {
      name: 'Sanity.io',
      role: 'Structured Headless CMS',
      desc: 'Provides structured content schemas for the engineering blog, public changelog, and developer gear with global edge caching.',
    },
    {
      name: 'Resend & React Email',
      role: 'Email Delivery Engine',
      desc: 'Handles transactional email delivery for direct inquiries with server-side validation and formatted responsive email templates.',
    },
    {
      name: 'Telegram Bot Relay',
      role: 'Mobile Admin Gateway',
      desc: 'Enables bi-directional, zero-polling live chat communication between web visitors and my mobile device via webhook callbacks.',
    },
    {
      name: 'Gemini & OpenRouter',
      role: 'Multi-Turn LLM Tier',
      desc: 'Powers the genious.exe systems assistant with FAQ semantic matching, prompt guardrails, and automated multi-provider failover routing.',
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <Navbar />

      <main className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Systems Architecture · Topology &amp; Design</span>
          </div>
          <h1 className={styles.title}>System Architecture &amp; Data Flow</h1>
          <p className={styles.subtitle}>
            A transparent, technical breakdown of how real-time communication, intelligent routing, and content infrastructure interact across this platform.
          </p>
        </header>

        {/* Section 1: Technology Topology */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>01</span>
            Core Technology Topology
          </h2>
          <div className={styles.stackGrid}>
            {stackItems.map((item) => (
              <div key={item.name} className={styles.stackCard}>
                <div className={styles.stackHeader}>
                  <h3 className={styles.stackName}>{item.name}</h3>
                  <span className={styles.stackRole}>{item.role}</span>
                </div>
                <p className={styles.stackDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Request Flow Diagrams */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>02</span>
            End-to-End Request Flows
          </h2>

          {/* Flow A: Contact Inquiry */}
          <div className={styles.flowContainer}>
            <h3 className={styles.flowTitle}>Flow A: Direct Contact Submission</h3>
            <p className={styles.flowDesc}>
              How a message submitted through the contact form transitions from client validation to verified inbox delivery.
            </p>

            <div className={styles.flowSteps}>
              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 1 · Client</span>
                <span className={styles.stepLabel}>Form Submission</span>
                <span className={styles.stepDetail}>
                  Client-side format checks validate email and character lengths prior to dispatch.
                </span>
              </div>

              <div className={styles.flowArrow} aria-hidden="true">→</div>

              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 2 · Edge API</span>
                <span className={styles.stepLabel}>Abuse &amp; Rate Guards</span>
                <span className={styles.stepDetail}>
                  Serverless function validates payload integrity, sanitizes input strings, and checks rate limits.
                </span>
              </div>

              <div className={styles.flowArrow} aria-hidden="true">→</div>

              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 3 · Delivery</span>
                <span className={styles.stepLabel}>Resend API Dispatch</span>
                <span className={styles.stepDetail}>
                  Payload is rendered into structured HTML and dispatched to my personal inbox with delivery confirmation.
                </span>
              </div>
            </div>
          </div>

          {/* Flow B: AI Chatbot (genious.exe) */}
          <div className={styles.flowContainer}>
            <h3 className={styles.flowTitle}>Flow B: Autonomous Systems Assistant (genious.exe)</h3>
            <p className={styles.flowDesc}>
              How user queries are filtered, semantically matched, and routed across resilient LLM providers.
            </p>

            <div className={styles.flowSteps}>
              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 1 · Ingestion</span>
                <span className={styles.stepLabel}>Input &amp; Guardrails</span>
                <span className={styles.stepDetail}>
                  Validates origin headers, checks server-side rate limits, and sanitizes multi-turn message history.
                </span>
              </div>

              <div className={styles.flowArrow} aria-hidden="true">→</div>

              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 2 · Knowledge Router</span>
                <span className={styles.stepLabel}>Semantic Matching</span>
                <span className={styles.stepDetail}>
                  Evaluates question intent against indexed portfolio knowledge to construct targeted context.
                </span>
              </div>

              <div className={styles.flowArrow} aria-hidden="true">→</div>

              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 3 · Inference</span>
                <span className={styles.stepLabel}>Dual-Provider Fallback</span>
                <span className={styles.stepDetail}>
                  Executes inference via primary model (Gemini 1.5 Flash), automatically failing over to secondary models if limits are reached.
                </span>
              </div>
            </div>
          </div>

          {/* Flow C: Telegram Live Chat Relay */}
          <div className={styles.flowContainer}>
            <h3 className={styles.flowTitle}>Flow C: Zero-Polling Live Chat Relay</h3>
            <p className={styles.flowDesc}>
              Bi-directional, zero-polling communication between a web visitor and my personal mobile device.
            </p>

            <div className={styles.flowSteps}>
              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 1 · Visitor</span>
                <span className={styles.stepLabel}>Realtime Session Join</span>
                <span className={styles.stepDetail}>
                  Visitor browser subscribes to a scoped Supabase Realtime channel keyed by an unguessable session ID.
                </span>
              </div>

              <div className={styles.flowArrow} aria-hidden="true">→</div>

              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 2 · Relay</span>
                <span className={styles.stepLabel}>Telegram Bot Push</span>
                <span className={styles.stepDetail}>
                  Server forwards the message to Telegram Bot API with quick-reply action buttons sent directly to my phone.
                </span>
              </div>

              <div className={styles.flowArrow} aria-hidden="true">→</div>

              <div className={styles.stepCard}>
                <span className={styles.stepIndex}>Step 3 · Response</span>
                <span className={styles.stepLabel}>Webhook to Realtime</span>
                <span className={styles.stepDetail}>
                  My mobile reply triggers a verified serverless webhook that immediately broadcasts to the visitor&apos;s channel.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Engineering Rationale */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            <span className={styles.sectionNumber}>03</span>
            Engineering Decisions &amp; Architectural Rationale
          </h2>

          <article className={styles.narrativeCard}>
            <h3 className={styles.narrativeTitle}>Why a Hybrid Data Architecture (Sanity + Supabase)?</h3>
            <div className={styles.narrativeBody}>
              <p>
                Early in the design of this portfolio, I evaluated using a single database for everything. However, editorial content and operational application state have fundamentally divergent access patterns.
              </p>
              <p>
                <span className={styles.highlight}>Sanity CMS</span> excels as an immutable content lake for articles, project write-ups, and changelogs. It provides clean structured schemas and benefits from global CDN caching with Incremental Static Regeneration (ISR).
              </p>
              <p>
                Conversely, <span className={styles.highlight}>Supabase (PostgreSQL)</span> was chosen for dynamic, low-latency workloads: real-time collaborative scratchpads, ephemeral live chat session mapping, rate limit tracking, and privacy-respecting analytics. Isolating dynamic operational state from editorial content keeps both systems fast, robust, and cleanly separated.
              </p>
            </div>
          </article>

          <article className={styles.narrativeCard}>
            <h3 className={styles.narrativeTitle}>Zero-Polling Live Chat via Webhooks</h3>
            <div className={styles.narrativeBody}>
              <p>
                Most portfolio live chat widgets rely on third-party SaaS embeds (Intercom, Crisp) that inject hundreds of kilobytes of tracking scripts, damage Core Web Vitals, and incur monthly seat subscriptions.
              </p>
              <p>
                I engineered a zero-polling relay: when a visitor sends a message, my serverless route relays it to a private <span className={styles.highlight}>Telegram Bot API</span> chat with instant push notifications on my phone. When I reply or tap a quick-reply button in Telegram, an authenticated webhook triggers a broadcast event over <span className={styles.highlight}>Supabase Realtime</span> directly into the visitor&apos;s active channel.
              </p>
              <p>
                The visitor gets instantaneous answers without long-polling or bulky third-party scripts, and I manage incoming communications from an application I already use daily.
              </p>
            </div>
          </article>

          <article className={styles.narrativeCard}>
            <h3 className={styles.narrativeTitle}>Resilient Multi-Provider AI Routing</h3>
            <div className={styles.narrativeBody}>
              <p>
                AI service rate limits and downtime are inevitable when relying on a single provider tier. To guarantee that <span className={styles.highlight}>genious.exe</span> remains responsive around the clock, I implemented a tiered routing architecture.
              </p>
              <p>
                Incoming queries are first evaluated against local portfolio domain knowledge. When high-relevance domain questions are identified, queries route to <span className={styles.highlight}>Google Gemini 1.5 Flash</span>. If rate ceilings or upstream outages occur, the request automatically falls back to secondary open-weights models through <span className={styles.highlight}>OpenRouter</span>.
              </p>
              <p>
                This ensures high precision, zero downtime, and strict control over provider quotas without degrading the visitor experience.
              </p>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
