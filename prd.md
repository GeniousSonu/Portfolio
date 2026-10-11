# Product Requirements Document (PRD)

**Project Title:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform  
**Target Domain:** [genioussonu.me](https://genioussonu.me)  
**Version:** 2.4.0 (Production)  
**Owner:** SK Sahinur Islam (Senior Web Application Developer · Co-Founder · IT Engineer)  
**Date:** October 2026  

---

## 1. Executive Summary & Vision

The platform is a production-grade personal engineering website, technical portfolio, interactive playground, and knowledge hub built by **SK Sahinur Islam (Genious Sonu)**. Unlike standard static resume sites, this application serves as an enterprise-grade showcase of modern full-stack web engineering, featuring:
- High-performance SSR/ISR with **Next.js 16 (App Router)** and **React 19**.
- Dual-tier data model isolating immutable content (**Sanity Headless CMS**) from low-latency real-time state (**Supabase PostgreSQL** & **Firebase Firestore**).
- Zero-polling live chat relay bridging web visitors directly to personal **Telegram** channels with instant mobile push.
- Resilient multi-turn AI assistant (**genious.exe**) with semantic FAQ retrieval and automatic dual-provider fallback (Google Gemini 1.5 Flash + OpenRouter).
- Real-time collaborative shared whiteboard/notes workspace (**Space**) with peer-to-peer WebRTC signaling and canvas state persistence.
- Interactive WebGL 3D globe visualization (**Three.js** + **Globe.gl**) mapping international clients and infrastructure nodes.
- Full Progressive Web App (PWA) offline capabilities, custom service worker cache tiering, and native Web Push notifications.

---

## 2. Target Audience & Personas

| Persona | Motivation | Key User Journeys | Success Metrics |
| :--- | :--- | :--- | :--- |
| **Enterprise Recruiters & VP Engineering** | Assess technical seniority, backend architecture expertise, patents, and leadership capabilities. | Visits `/` for resume overview, inspects `/architecture`, reviews production projects, downloads CV, triggers contact form. | Fast LCP (<1.2s), clear credibility signals (patent, certifications, experience), instant PDF resume access. |
| **Founders & International Freelance Clients** | Evaluate full-stack product engineering capabilities, Upwork track record, agency leadership (WEFIK), and speed of communication. | Evaluates `/wefik`, explores `/store` and `/plugin`, initiates live chat with Sonu via `/contact` or floating widget. | Response time via Telegram live-chat bridge (<5 mins), interactive 3D globe showing global client trust. |
| **Developers & Tech Community** | Read deep architectural articles, explore open-source extensions, inspect system source code, test interactive playgrounds. | Browses `/blog`, inspects `/wiki`, explores `/tools` and `/play`, uses `/lounge` to hang out or listen to synced music. | High engagement, clean code readability, interactive delight, zero UI glitches. |
| **AI Agents & Crawlers (LLMs, Google, Bing)** | Index personal credentials, skills, patent details, structured articles, and machine-readable context. | Queries `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/ai.txt`, and parses Schema.org JSON-LD graph. | 100% crawl validity, rich search snippet eligibility, high citation index in LLM answer engines. |

---

## 3. Product Features & Functional Requirements

### 3.1. Core Landing & Profile Experience (`/`)
- **Cyber-Terminal Boot Preloader (`BootPreloader.jsx`)**:
  - Displays multi-lingual typewriter script greetings: Bengali (সাহিনুর), Hindi (साहिनुर), Japanese (サヒヌル), Russian (сахинур), Arabic (ساهينور), English (Sahinur).
  - Session-locked (`hasBootedInSession`) with bfcache protection for instant subsequent page returns.
- **Hero Section (`Hero.jsx`)**:
  - High-impact display typography with interactive badge status ("Available for High-Impact Roles & Consulting").
  - Quick action CTA buttons ("Get in Touch", "Explore Architecture", "Download Resume").
- **About & Leadership Narrative (`About.jsx`)**:
  - Detailed bio summarizing 6+ years in software engineering, leadership at Ib Arts and WEFIK, and patent accomplishments.
- **Experience Timeline with Card Stacking (`Experience.jsx`)**:
  - Smooth desktop sticky card stacking powered by GSAP ScrollTrigger and Lenis smooth scrolling.
  - Showcases current roles: Ib Arts (Senior Web Application Developer), Upwork (Top Rated Freelancer), WEFIK (Co-Founder).
  - Showcases past milestones: ARC Document Solutions (QA Engineer), Teenager Esports (Head of Development), earlier ventures.
- **Projects Showcase (`Projects.jsx`)**:
  - Filterable tabs by technology (Full-Stack, Backend, IoT/Cloud, WordPress/Shopify).
  - Highlights live URLs, GitHub repositories, system metrics, and architectural breakdown modals.
- **Certifications & Patent Ledger (`Certifications.jsx`)**:
  - Features Indian Patent No. 544062 (Solar-Powered IoT Vaccine Preservation System).
  - 30+ verifiable credentials across CompTIA A+, TryHackMe, Coursera (IBM, Duke, UC Irvine), and CoCubes.
- **Interactive 3D WebGL Globe (`GlobeConnect.jsx`)**:
  - Dynamic three-dimensional globe with animated arc paths representing global client engagements.
  - Custom WebGL atmosphere shaders with responsive resize handlers and fallback handling.
- **Home Blog Section (`HomeBlogSection.jsx`)**:
  - Live editorial feed directly fetched from Sanity Headless CMS with reading time estimates and category badges.

---

### 3.2. Headless Engineering Blog & CMS (`/blog`, `/studio`)
- **Sanity CMS Integration (`/studio`)**:
  - Embedded Sanity Studio v3 inside Next.js App Router (`/src/app/studio/[[...tool]]/page.jsx`).
  - Strict security gate via environment session token and admin password protection.
  - Content schemas: `post`, `author`, `category`, `blockContent` with custom syntax highlighter (`codeBlock`) and callouts.
- **Public Blog (`/blog`, `/blog/[slug]`)**:
  - Incremental Static Regeneration (ISR) with on-demand cache revalidation.
  - Table of Contents generator, estimated reading time, social share triggers, and semantic JSON-LD article schemas.

---

### 3.3. Communication Hub (`ChatbotWidget.jsx`, `/contact`)
- **Dual-Mode Interactive Widget**:
  - **Mode 1: genious.exe (Autonomous AI Assistant)**:
    - Multi-turn conversation powered by Google Gemini 1.5 Flash with fallback to OpenRouter open-weights models.
    - Semantic knowledge matching against local portfolio FAQ before invoking cloud LLM endpoints.
    - Server-side rate limiting: 10 queries per 10-minute window per IP; daily global caps to protect quotas.
  - **Mode 2: Live Chat (Direct Telegram Bridge)**:
    - Zero-polling realtime messaging. Web visitor messages are dispatched via serverless API to personal Telegram Bot with instant push.
    - Operator responds in Telegram; authenticated webhook broadcasts response to the visitor's scoped Supabase Realtime channel.
    - Web Audio API notification chimes and browser Web Push notification fallback.
- **Contact Form (`Contact.jsx`, `/api/contact`)**:
  - Input validation with disposable email filtering (`disposable-email-domains`), honeypot bot traps, and Cloudflare Turnstile token verification.
  - Transactional email delivery via Resend API formatted with clean HTML responsive templates.

---

### 3.4. Realtime Collaboration & Hangouts (`/space`, `/lounge`)
- **The Lounge (`/lounge`, `/lounge/[roomId]`)**:
  - Virtual hangout space featuring synchronized YouTube playback, interactive particle canvas, real-time Firestore chat, custom cyber stickers, and presence indicators.
  - WebRTC signaling mesh for peer-to-peer screen sharing (star topology) and voice communication.
- **Shared Space (`/space`, `/space/[roomId]`)**:
  - Real-time collaborative markdown canvas and document editor with Supabase Realtime / Firebase synchronization.
  - Ephemeral room creation, pin protection, and live cursor/typing tracking.

---

### 3.5. Extensions & Product Showcase (`/plugin`, `/wefik`, `/store`)
- **WordPress & Web Plugins Hub (`/plugin`, `/plugin/[slug]`)**:
  - Dedicated product landing for **GeniousSonu Site Checkup** (WordPress security audit & site hardening plugin).
  - Sub-pages for Changelog, Documentation (`docs/[topic]`), Support, Privacy Policy, and Terms.
  - Centralized schema configuration via `src/config/plugin.js`.
- **WEFIK Agency Portal (`/wefik`)**:
  - Deep-dive into WEFIK's digital agency services, client case studies, team methodologies, and project delivery statistics.
- **Digital Store & Tools (`/store`, `/tools`)**:
  - Curated developer utilities (code converters, generators, regex testers, hash calculators) and digital software resources.

---

### 3.6. Utility, Privacy & Systems Pages
- **System Architecture Visualizer (`/architecture`)**:
  - Deep architectural breakdown with interactive tech stack topology, step-by-step request flow animations, and engineering rationale narratives.
- **System Status Dashboard (`/status`)**:
  - Real-time health monitoring of all infrastructure dependencies: Next.js edge runtime, Supabase DB, Sanity CDN, Firebase, Resend API, and Telegram bot webhook.
- **Personal Knowledge Wiki (`/wiki`) & Setup Details (`/uses`)**:
  - Developer workstation specs, terminal dotfiles, hardware peripherals, software stack, and engineering cheatsheets.
- **Confession Board (`/confession`)**:
  - Anonymous interactive message board allowing visitors to post encrypted, moderated reflections.
- **Private Encrypted Vault (`/vault`)**:
  - Password-gated encrypted resource vault for private client proposals, architecture diagrams, and internal documents.
- **Compliance & Legal (`/privacy`, `/terms`, `/bot/privacy-policy`)**:
  - Full GDPR/CCPA compliance notices, Google Consent Mode v2 integration, and privacy terms for bot automations.

---

## 4. Non-Functional Requirements (NFRs)

### 4.1. Performance & Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 1.2s on desktop, < 2.0s on 4G mobile.
- **First Input Delay / INP**: < 50ms across all interactions.
- **Cumulative Layout Shift (CLS)**: 0.000 — zero layout jank; explicit aspect ratios on all media and pre-reserved space for dynamic embeds.
- **Asset Optimization**: Local Brooklyn and Geist font files preloaded with `font-display: swap`; images served via Next.js Image Optimization with WebP/AVIF formats.

### 4.2. Accessibility & Responsiveness
- Full WCAG 2.1 AA accessibility compliance.
- Keyboard-accessible navigation via unified Command Palette (`Ctrl+K` / `Cmd+K` via `cmdk`).
- `prefers-reduced-motion` compliance across all GSAP ScrollTrigger sequences and View Transitions.
- Fluid responsive grid scaling seamlessly from 320px mobile screens to 3840px 4K displays.

### 4.3. Security & Privacy
- Zero client-side exposure of private API secrets (Sanity write tokens, Resend keys, Supabase service roles, Telegram bot tokens).
- Cloudflare Turnstile bot verification and honeypot traps on all form POST endpoints.
- Cookie-free tracking option with Google Consent Mode v2 default denial until explicit user consent.
- Strict Content Security Policy (CSP), `X-Frame-Options: SAMEORIGIN`, and strict CORS headers on internal API routes.

### 4.4. Offline & Progressive Web App (PWA)
- Offline fallback page (`/offline`) cached via Service Worker.
- Stale-While-Revalidate caching for static HTML pages and dynamic routes.
- Cache-First caching strategy for immutable fonts, SVG logos, and UI icons.
- Web Application Manifest (`manifest.webmanifest`) supporting standalone PWA installation on iOS and Android.

---

## 5. Success Metrics & KPIs

1. **Portfolio Discovery & Conversion**:
   - Inbound client inquiries and recruiter contact submissions: > 15 qualified leads/month.
   - Live chat response engagement rate: > 80% answered within 10 minutes.
2. **Technical Credibility**:
   - 100/100 Lighthouse performance, accessibility, best practices, and SEO scores.
   - Average session duration: > 3.5 minutes with low bounce rate on deep pages (`/architecture`, `/blog`, `/plugin`).
3. **Infrastructure Reliability**:
   - 99.95% uptime across serverless API routes on Vercel Edge.
   - Zero unhandled crash events in Vercel Analytics and Sentry error monitoring.
