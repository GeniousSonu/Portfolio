# Product Requirements Document (PRD)

**Product:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform
**Domain:** <https://genioussonu.me>
**Document version:** 3.0.0 (supersedes PRD 2.4.0)
**Product baseline:** 2.4.0 (production) → target 3.0.0
**Owner:** SK Sahinur Islam
**Architecture authority:** Senior Architect (Claude) · **Implementation agent:** Antigravity · **Coordinator:** Owner
**Status:** Approved for execution, living document
**Last updated:** October 2026

---

## 0. How to Read This Document

### 0.1 Purpose

This PRD is the single source of truth for what the platform is, what it must do, how well it must do it, and how it will evolve. It is written to be consumed by three audiences: the owner (decisions), the architect (design authority), and AI coding agents (unambiguous, testable requirements).

### 0.2 Requirement conventions

- **Requirement IDs** follow `FR-<MODULE>-<NN>` (functional), `NFR-<AREA>-<NN>` (non-functional), `SEC-<NN>` (security), `PRV-<NN>` (privacy), `OPS-<NN>` (operations). IDs are permanent. A retired requirement is marked `Deprecated`, never renumbered.
- **Priority (MoSCoW):** `MUST` (release blocker), `SHOULD` (expected, can slip one release), `COULD` (nice to have), `WONT` (explicitly out of scope).
- **Status legend:** `SHIPPED` (live in production), `PARTIAL` (UI or part exists, backend or polish missing), `PLANNED` (scheduled in the roadmap), `FUTURE` (direction only, not committed).
- **Acceptance criteria** use the form "Given / When / Then" or a measurable threshold. A requirement without verifiable acceptance criteria is not ready for implementation.
- Statements marked **[VERIFY]** came from earlier documents and must be confirmed against the live codebase before being relied upon.

### 0.3 Reconciliation notes (conflicts found between earlier documents)

These were identified while consolidating PRD 2.4.0, the System Architecture document, the delivery report, and AGENTS.md. Resolutions are binding unless the owner overrides them (see Section 16, Decision Log).

| # | Conflict | Resolution in this PRD |
| --- | ---------- | ------------------------ |
| R1 | `/vault` was described as a *password-gated encrypted client-document vault* (PRD 2.4.0) and also as a *public curated list of favorite movies, shows and music* (architecture and delivery docs). | Split into two products: **Culture Vault** at `/vault` (public, Sanity-driven) and **Private Vault** at `/vault/private` (authenticated, FUTURE). See FR-VAULT. |
| R2 | `/confession` was called *encrypted, moderated* (PRD 2.4.0) but is currently a UI-only form. | Treated as `PARTIAL`. Backend (Phase 1) and optional client-side encryption (Phase 1B) are specified in FR-CONF. |
| R3 | LCP < 1.2s, INP < 50ms, CLS 0.000 and Lighthouse 100/100 on every page are not realistic alongside GSAP, Lenis, WebGL and a service worker. "First Input Delay" is also a retired Core Web Vital (replaced by INP). | Replaced with enforceable p75 field budgets and Lighthouse lab floors (Section 9.1). |
| R4 | The AI assistant was specified against a fixed model name (Gemini 1.5 Flash). Provider model names are retired regularly. | Specified as a **provider-agnostic abstraction** with model IDs supplied by configuration (FR-CHAT-05, Section 12.1). |
| R5 | Sentry appeared in KPIs but is not integrated. | Scheduled in Phase 5 (OPS-03). KPIs that depend on it are marked accordingly. |
| R6 | `/wiki` was described both as a digital garden for architectures and patent details and as the home of `/uses` (workstation setup). | `/wiki` is the knowledge base (Sanity). `/uses` remains a standalone static page. |
| R7 | Item "invasive visitor data collection" appeared in the original idea list. | Permanently out of scope under GDPR/CCPA (WONT-01). |

---

## 1. Executive Summary

### 1.1 Vision

Build the most technically credible, fast, and delightful personal engineering platform in its category: a site that proves seniority through its own architecture, operates as a living "operating system" for the owner's professional presence, and stays maintainable by a solo owner with AI-assisted development.

### 1.2 Product description

A production full-stack web platform combining a portfolio, a headless-CMS blog and knowledge base, a real-time communication hub (AI assistant and Telegram-bridged live chat), collaboration spaces (WebRTC lounge, shared canvas), a product showcase for the owner's WordPress plugin and agency, an interactive playground, and a privacy-respecting analytics and PWA layer.

### 1.3 Business goals

| ID | Goal | Measure |
| ---- | ------ | --------- |
| G1 | Convert recruiter, client and founder visits into qualified conversations | ≥ 15 qualified inbound leads per month |
| G2 | Demonstrate engineering depth through the platform itself | Architecture page engagement; GitHub and plugin referral clicks |
| G3 | Build discoverability for humans and AI answer engines | Indexed pages, rich-result eligibility, LLM citation presence |
| G4 | Keep operating cost and maintenance burden near zero | Monthly infrastructure cost cap; zero unplanned manual interventions per month |
| G5 | Showcase and distribute the WordPress plugin and agency work | Plugin page to WordPress.org click-through |

### 1.4 Product principles (decision tie-breakers)

1. **Performance is a feature.** A new capability that cannot meet the performance budget does not ship in its current form.
2. **Edge-first, server-by-default.** Server Components and static generation unless interactivity demands otherwise.
3. **Graceful degradation everywhere.** Every external dependency has a defined fallback; the site never shows a blank or crashed page because a third party is down.
4. **Privacy by design.** Collect the minimum; consent before analytics; hash instead of store; never fingerprint.
5. **Zero lock-in.** Content in portable formats (Portable Text, Markdown, SQL). Providers are behind interfaces.
6. **Delight with discipline.** Motion and easter eggs are layered on top of a fully usable, accessible baseline and respect reduced-motion.
7. **Honest engineering.** Do not claim capabilities the system does not have (for example, "end-to-end encrypted AI chat").

### 1.5 Non-goals (WONT)

| ID | Non-goal | Reason |
| ---- | ---------- | -------- |
| WONT-01 | Covert collection of device, IP, identity or behavioral fingerprints | Illegal without consent under GDPR/CCPA; contradicts principle 4 |
| WONT-02 | Tor-style onion routing in the browser | Not feasible or secure in JavaScript; WebRTC covers the use case |
| WONT-03 | End-to-end encryption for the AI assistant | The model provider must read plaintext; claiming otherwise is dishonest |
| WONT-04 | Heavy UI frameworks (Material UI, Bootstrap, etc.) | Violates the performance and styling paradigm |
| WONT-05 | User accounts, comments or social features for the public | Increases moderation and legal surface with no business value |
| WONT-06 | Scraping third-party sites for status data (for example, Valorant rank) | Terms-of-service and reliability risk |

---

## 2. Personas and Jobs-To-Be-Done

| Persona | Job to be done | Primary journeys | Success signal |
| --------- | ---------------- | ------------------ | ---------------- |
| **P1 Enterprise recruiter / VP Engineering** | Verify seniority, architecture depth, patents and leadership in under three minutes | `/` → `/architecture` → `/projects` → resume download → contact | Resume downloads; contact submissions; fast first impression |
| **P2 Founder / international client** | Decide whether to trust the owner with a product build | `/wefik` → `/plugin` → `/store` → live chat or contact | Live chat started; inquiry quality |
| **P3 Developer / community member** | Learn from deep technical content and play with tools | `/blog` → `/wiki` → `/tools` → `/play` → `/lounge` | Time on page; return visits; tool usage |
| **P4 AI agent / crawler** | Extract accurate structured facts about the owner and work | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/ai.txt`, JSON-LD | Crawl validity; correct entity resolution |
| **P5 WordPress site owner** | Evaluate, install and trust the security plugin | `/plugin` → docs → WordPress.org listing | Plugin install click-through |
| **P6 Owner / operator** | Update content, answer chats, monitor health with minimal effort | `/studio`, Telegram, `/status`, Vercel and Sentry dashboards | Time-to-update under 5 minutes; no code changes for content |

---

## 3. Product Scope and Release Map

### 3.1 Module inventory and status

| Module | Route(s) | Status |
| -------- | ---------- | -------- |
| Landing and profile | `/` | SHIPPED |
| Engineering blog and CMS | `/blog`, `/blog/[slug]`, `/studio` | SHIPPED |
| AI assistant | ChatbotWidget Mode 1 | SHIPPED |
| Live chat (Telegram bridge) | ChatbotWidget Mode 2, `/api/live-chat/*` | SHIPPED |
| Contact | `/contact`, `/api/contact` | SHIPPED |
| Lounge | `/lounge`, `/lounge/[roomId]` | SHIPPED |
| Shared Space | `/space`, `/space/[roomId]` | SHIPPED |
| Plugin hub | `/plugin`, `/plugin/[slug]`, docs | SHIPPED |
| WEFIK portal | `/wefik` | SHIPPED (content showcase) |
| Store and tools | `/store`, `/tools` | SHIPPED (tools hub extended in latest PR) |
| Architecture visualizer | `/architecture` | SHIPPED [VERIFY] |
| System status | `/status` | SHIPPED [VERIFY] |
| Wiki | `/wiki` | PARTIAL (hardcoded; CMS-backed in Phase 2) |
| Uses | `/uses` | SHIPPED [VERIFY] |
| Culture Vault | `/vault` | PARTIAL (hardcoded; CMS-backed in Phase 2) |
| Confession board | `/confession` | PARTIAL (UI only; backend in Phase 1) |
| Play dashboard | `/play` | PARTIAL (UI; live data in Phase 3) |
| Playground / Chaos Mode | Navbar toggle | SHIPPED |
| God Mode terminal | Command Palette | PLANNED (Phase 4) |
| Live activity status | `/play`, home widget | PLANNED (Phase 3) |
| Observability (Sentry) | Global | PLANNED (Phase 5) |
| Hardening and quality gate | Global | PLANNED (Phase 6) |
| Lichess bot | `/play` (+ separate service) | FUTURE (Phase 7) |
| Private Vault | `/vault/private` | FUTURE |
| Compliance pages | `/privacy`, `/terms`, `/bot/privacy-policy` | SHIPPED |

### 3.2 Release train

| Release | Contents | Exit criteria |
| --------- | ---------- | --------------- |
| **2.5** | Phase 0 baseline; Phase 1 confession backend; Phase 2 Sanity vault and wiki | Build and lint green; confession abuse tests pass; content editable from Studio |
| **2.6** | Phase 3 live activity; Phase 4 God Mode | Activity routes cached and token-safe; God Mode toggles cleanly |
| **2.7** | Phase 5 Sentry; Phase 6 hardening | CSP enforced after report-only; performance budgets met |
| **3.0** | Documentation set complete, Lichess bot (if approved), Private Vault decision | All MUST requirements satisfied |

---

## 4. System Architecture

### 4.1 Context diagram

```text
                         +-----------------------------+
   Visitors / Recruiters |   Browser (PWA, Service     |
   Clients / Crawlers -->|   Worker, WebRTC, WebGL)    |
                         +--------------+--------------+
                                        |
                              HTTPS (Vercel Edge Network)
                                        |
        +-------------------------------v--------------------------------+
        |                    Next.js 16 App Router (React 19)            |
        |  RSC pages | Client leaf components | Route Handlers (/api)    |
        +---+---------+----------+----------+-----------+---------+------+
            |         |          |          |           |         |
        Sanity     Supabase   Firebase    Resend     Telegram   LLM providers
        (content)  (Postgres  (Firestore, (email)     Bot API    (Gemini,
        + Studio    + Realtime Auth,                  + webhook  OpenRouter)
                    + RLS)     AppCheck)
            |
     Cloudflare Turnstile (bot verification) · Analytics (consent-gated)
     Spotify API · Chess.com API (Phase 3) · Sentry (Phase 5)
```

### 4.2 Technology stack and version policy

| Layer | Technology | Policy |
| ------- | ----------- | -------- |
| Framework | Next.js 16.x (App Router, Turbopack in dev) | Track latest stable minor; major upgrades via ADR and a dedicated branch |
| UI | React 19 | Follow Next.js compatibility |
| Styling | Vanilla CSS (Global + CSS Modules), CSS Variables | Locked paradigm (WONT-04) |
| Animation | GSAP (ScrollTrigger, TextPlugin, Draggable, ScrollToPlugin) | Animate `transform` and `opacity` only |
| Smooth scroll | Lenis | Single instance; navigation via `navState` |
| 3D | Three.js, Globe.gl | Dynamic import only; never in the initial bundle |
| CMS | Sanity v3 embedded Studio with `next-sanity` | GROQ queries centralized in `src/lib/sanity` |
| Realtime and auth (rooms) | Firebase Firestore, Auth, App Check | Signaling and presence only |
| Relational and admin state | Supabase PostgreSQL with `@supabase/ssr` | RLS on every table |
| Email | Resend | Transactional only |
| Bot protection | Cloudflare Turnstile | Required on every public write endpoint |
| Command palette | `cmdk` | Registry-driven (see FR-CMD) |
| PWA | `next-pwa` service worker | Never caches `/api/*` or POST bodies |
| Hosting | Vercel (Edge Network) | Preview deployment per PR |
| Observability | Vercel Analytics, Google Analytics (consent-gated), Sentry (Phase 5) | Consent-gated client side |

**Dependency policy:** Dependabot (or Renovate) weekly; security patches within 7 days; no dependency added without stating bundle impact; packages unmaintained for 18+ months require an ADR to keep.

### 4.3 Data domain separation

| Domain | Store | Contents | Rationale |
| -------- | ------- | ---------- | ----------- |
| Editorial / slow-changing | Sanity | Posts, authors, categories, products, vault items, wiki pages, site status | Portable, versioned, editable without deploys |
| Transactional / relational | Supabase Postgres | Live chat sessions, confessions, rate-limit counters, admin state | Strong schema, RLS, SQL |
| Ephemeral real-time | Firebase Firestore | Lounge presence, WebRTC signaling, room chat | Low-latency snapshots |
| Broadcast | Supabase Realtime channels | Telegram-to-web chat replies | Zero-polling fan-out |
| Client-only | localStorage / sessionStorage (try/catch guarded) | UI preferences, boot-session flag, God Mode session | Never holds secrets or user-submitted content |

### 4.4 Rendering and caching matrix

| Route class | Strategy | Revalidation | Notes |
| ------------- | ---------- | -------------- | ------- |
| `/`, `/about`, `/wefik`, `/uses`, `/architecture` | SSG | Build-time | Heavy visuals dynamically imported |
| `/blog`, `/blog/[slug]` | ISR with tags | 30s–1h plus on-demand webhook | `generateStaticParams`, JSON-LD |
| `/vault`, `/wiki`, `/wiki/[slug]` | ISR with tags | 1h plus on-demand webhook | Fallback content when CMS unavailable |
| `/play` shell | SSG | Build-time | Activity data fetched client-side from cached routes |
| `/api/activity/*` | Route Handler, cached | 30s (Spotify), 600s (Chess.com) | Never expose tokens |
| `/api/contact`, `/api/confession`, `/api/live-chat/*`, `/api/revalidate` | Route Handler | `force-dynamic` | Bypass every cache layer |
| `/studio` | Client-heavy, gated | None | Not indexed |
| `/status` | Dynamic with short cache | 30–60s | Health probes |

### 4.5 State management architecture

| Concern | Mechanism | Rule |
| --------- | ----------- | ------ |
| Overlays and modals | `OverlayContext` | Register through `openOverlay('name')`; `useScrollLock` engages globally |
| Page transitions | `TransitionContext` | In-app navigation via `transitionNavigate()` |
| Playground / God Mode | `PlaygroundContext` | Single owner of "edit mode" and "god mode" state |
| Navigation and scroll intent | `navState.js` singleton | Never call `window.scrollTo` directly; coordinate with Lenis |
| Realtime | Firestore `onSnapshot`, Supabase channels | Always unsubscribe on unmount |

---

## 5. Functional Requirements

### FR-LAND — Landing and Profile Experience (`/`) — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-LAND-01 | Boot preloader shows multilingual typewriter greetings (Bengali, Hindi, Japanese, Russian, Arabic, English) once per browser session | MUST | Given a first visit in a session, the sequence plays and sets `hasBootedInSession`; given a return visit or bfcache restore, it is skipped; total duration ≤ 2.5s; skippable by keypress or tap |
| FR-LAND-02 | Hero presents headline, availability badge, and CTAs (Get in Touch, Explore Architecture, Download Resume) | MUST | CTAs are keyboard reachable; resume downloads a PDF ≤ 1 MB |
| FR-LAND-03 | About section summarizes experience, leadership (Ib Arts, WEFIK) and patent | MUST | Content editable without code change (COULD move to Sanity in a later release) |
| FR-LAND-04 | Experience timeline with desktop card stacking (GSAP ScrollTrigger + Lenis) | MUST | On touch or reduced-motion, degrades to a normal vertical list; no scroll-jank (INP within budget) |
| FR-LAND-05 | Projects showcase with technology filters (Full-Stack, Backend, IoT/Cloud, WordPress/Shopify) and detail modals | MUST | Filter changes in ≤ 100ms; modals registered through `openOverlay` |
| FR-LAND-06 | Certifications and patent ledger (Indian Patent No. 544062; 30+ credentials) | MUST | Each credential links to a verification URL where one exists |
| FR-LAND-07 | 3D globe with animated arcs for client geography | SHOULD | Loaded via dynamic import after first paint; on WebGL failure or low-power devices a static fallback image renders; zero CLS |
| FR-LAND-08 | Home blog section shows latest Sanity posts with reading time and category | MUST | Renders without crash when Sanity is unreachable (hidden section, no error) |

### FR-BLOG — Headless Blog and CMS — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-BLOG-01 | Embedded Sanity Studio v3 at `/studio` | MUST | Protected by session token and admin password; `noindex`; excluded from sitemap |
| FR-BLOG-02 | Schemas: `post`, `author`, `category`, `product`, `blockContent` (custom `codeBlock`, callouts) | MUST | Schema changes follow Section 12.3 migration rules |
| FR-BLOG-03 | Public blog with ISR and on-demand revalidation | MUST | Published change visible ≤ 60s after webhook |
| FR-BLOG-04 | Table of contents, reading time, share actions, Article JSON-LD | MUST | Valid in Google Rich Results Test |
| FR-BLOG-05 | RSS/Atom feed at `/feed.xml` | SHOULD | Validates in a standard feed validator |
| FR-BLOG-06 | Draft preview mode for the owner | COULD | Draft content never served to anonymous users |

### FR-CHAT — Communication Hub — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-CHAT-01 | Widget has two modes: **genious.exe** (AI) and **Live Chat** (Telegram) | MUST | Mode switch preserves widget open state and focus |
| FR-CHAT-02 | AI mode is multi-turn with semantic matching against the local FAQ before any cloud LLM call | MUST | FAQ hit rate and LLM call count are logged (aggregate counts only, no message content) |
| FR-CHAT-03 | Rate limit: 10 queries per 10 minutes per IP; global daily cap | MUST | 11th request in the window returns HTTP 429 with `Retry-After` |
| FR-CHAT-04 | Automatic fallback between LLM providers on error, timeout (> 8s) or quota exhaustion | MUST | Primary failure triggers secondary within one request; total failure returns a friendly message and offers live chat |
| FR-CHAT-05 | Provider and model IDs are configuration, behind a single `LLMProvider` interface | MUST | Swapping a model requires an env change only; a contract test runs against every provider adapter |
| FR-CHAT-06 | Live Chat: visitor message → `/api/live-chat/send` → Supabase session mapping → Telegram | MUST | Owner receives a push within 5s at p95 |
| FR-CHAT-07 | Telegram reply → authenticated webhook → Supabase Realtime broadcast → visitor | MUST | Webhook verifies the Telegram secret token; unauthenticated calls return 401; reverse lookup in `liveChatSessions.js` is test-covered |
| FR-CHAT-08 | Notification chime (Web Audio) and Web Push fallback | SHOULD | Muted by default until user interaction; respects a mute toggle |
| FR-CHAT-09 | Anonymous session ID with expiry and purge | MUST | Sessions older than 30 days are purged (PRV-04) |
| FR-CHAT-10 | AI responses must not claim to be the owner and must disclose AI nature | MUST | Persistent "AI assistant" label in the widget |
| FR-CHAT-11 | Prompt-injection hardening: system prompt isolation, output length cap, no tool or secret access | MUST | Adversarial prompt suite (SEC-12) passes |

### FR-CONTACT — Contact Form — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-CONTACT-01 | Fields validated server-side (name, email, subject, message with length bounds) | MUST | Invalid payload returns 422 with field-level errors |
| FR-CONTACT-02 | Anti-abuse stack: Turnstile token, honeypot, minimum time-to-submit, disposable-email filter | MUST | Each layer has an automated test |
| FR-CONTACT-03 | Email delivered through Resend with an HTML template and plain-text alternative | MUST | Delivery failure shows a retry message and never loses the user's text client-side |
| FR-CONTACT-04 | Auto-acknowledgement to the sender | COULD | Rate-limited; does not allow relay abuse |
| FR-CONTACT-05 | Per-IP-hash rate limit of 5 submissions per hour | SHOULD | 6th returns 429 |

### FR-LOUNGE — The Lounge (`/lounge`) — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-LOUNGE-01 | Rooms with presence, Firestore chat, stickers, synchronized YouTube playback, particle canvas | MUST | Presence accurate within 5s; room state cleaned on last leave |
| FR-LOUNGE-02 | Screen share in **star topology** (`PresenterManager` → `ViewerManager`) | MUST | Presenter uplink scales with viewers only through the star hub design documented in `webrtcStar.js` |
| FR-LOUNGE-03 | Voice chat in **mesh topology** (`VoiceMeshManager`) with STUN/TURN from `getRtcConfig()` | MUST | Room cap enforced (default 6 voice peers) to bound mesh cost |
| FR-LOUNGE-04 | Insecure-context checks retained (`getUserMedia` and `getDisplayMedia` blocked over non-localhost HTTP) | MUST | Clear user-facing message instead of a silent failure |
| FR-LOUNGE-05 | Firebase App Check enforced; Firestore rules deny by default | MUST | Unauthenticated read or write is rejected (rules unit tests) |
| FR-LOUNGE-06 | Permissions UX: explicit prompt copy before camera or microphone request; recoverable error states | SHOULD | Denied permission shows how to re-enable |
| FR-LOUNGE-07 | TURN credentials are short-lived and never hardcoded | SHOULD | Credentials fetched per session from a server route |

### FR-SPACE — Shared Space (`/space`) — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-SPACE-01 | Ephemeral rooms with optional PIN, collaborative markdown canvas and live cursors | MUST | PIN never stored in plaintext (hashed server-side); room TTL enforced |
| FR-SPACE-02 | Canvas state persistence and conflict handling | SHOULD | Concurrent edits converge without data loss (last-write-wins documented, CRDT considered in Section 12) |
| FR-SPACE-03 | Rooms expire after inactivity (default 24h) | SHOULD | Expired room data deleted |

### FR-PLUGIN — Plugin Hub (`/plugin`) — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-PLUGIN-01 | Landing for **GeniousSonu Site Checkup** with features, screenshots, changelog, docs, support, privacy, terms | MUST | All sub-pages driven by `src/config/plugin.js` |
| FR-PLUGIN-02 | WordPress.org listing link and review-status accuracy | MUST | Version and "tested up to" data kept in config, not scattered in JSX |
| FR-PLUGIN-03 | `SoftwareApplication` JSON-LD for the plugin | SHOULD | Valid structured data |
| FR-PLUGIN-04 | Changelog sourced from a single changelog file, rendered consistently with `readme.txt` | COULD | One edit updates both |

### FR-WEFIK — Agency Portal (`/wefik`) — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-WEFIK-01 | Services, case studies, methodology, delivery statistics | MUST | Statistics carry a "last updated" date to avoid stale claims |
| FR-WEFIK-02 | Direct CTA to contact and live chat | MUST | Tracked as a conversion event (consent-gated) |
| FR-WEFIK-03 | `Organization` JSON-LD linked to the `Person` graph | SHOULD | Valid and non-contradictory |

### FR-STORE — Store and Tools (`/store`, `/tools`) — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------- |
| FR-STORE-01 | Catalog of digital products (Sanity `product`) with ISR | MUST | 30s–1h revalidation |
| FR-TOOLS-01 | Client-side developer tools (JWT decoder, regex tester, hash calculator, converters, generators) | MUST | All processing happens in the browser; no tool input is sent to a server or logged |
| FR-TOOLS-02 | Personal NPM package listing | SHOULD | Version fetched at build or ISR time, with fallback text |
| FR-TOOLS-03 | Each tool is a lazy-loaded route segment | MUST | Tool code absent from the home bundle |

### FR-ARCH — Architecture Visualizer (`/architecture`) and FR-STATUS — Status (`/status`) — SHIPPED [VERIFY]

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-ARCH-01 | Interactive topology, request-flow animations, engineering rationale | MUST | Content mirrors the real architecture; reviewed at every release (Definition of Done item) |
| FR-STATUS-01 | Health probes for Next.js runtime, Supabase, Sanity CDN, Firebase, Resend, Telegram webhook | MUST | Each probe has a 3s timeout; a failing dependency shows "degraded" without breaking the page |
| FR-STATUS-02 | Probes expose no secrets, versions or internal URLs | MUST | Response contains only status and latency buckets |
| FR-STATUS-03 | 30-day uptime history | COULD | Backed by a scheduled probe, stored in Supabase |

### FR-WIKI — Knowledge Wiki (`/wiki`, `/wiki/[slug]`) — PARTIAL → Phase 2

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-WIKI-01 | Sanity `wikiPage` schema: title, slug, summary, category (architecture, iot, patent, notes), portable-text body, tags, publishedAt, status, relatedPages | MUST | Draft pages never served publicly |
| FR-WIKI-02 | Index with category and tag filtering and client-side search | MUST | Search returns results in ≤ 100ms for 500 pages |
| FR-WIKI-03 | Detail route with `generateStaticParams`, `generateMetadata`, `notFound` | MUST | Unknown slug returns a 404 page |
| FR-WIKI-04 | Related pages and backlinks | SHOULD | Bidirectional links resolved at query time |
| FR-WIKI-05 | Fallback to bundled content when CMS or dataset is unavailable | MUST | Build and runtime succeed with empty Sanity env |
| FR-WIKI-06 | Wiki pages included in the sitemap and `llms.txt` | SHOULD | Verified by script |

### FR-VAULT — Vaults — PARTIAL → Phase 2 (public) / FUTURE (private)

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-VAULT-01 | **Culture Vault** (`/vault`): Sanity `vaultItem` (title, category movie/show/music/game/book, creator, year, rating 1–10, note, link, cover, featured, order) | MUST | Category filter chips; covers via `next/image` with explicit dimensions |
| FR-VAULT-02 | Fallback to bundled data when CMS unavailable | MUST | Same as FR-WIKI-05 |
| FR-VAULT-03 | **Private Vault** (`/vault/private`): authenticated area for client proposals and diagrams | FUTURE | Requires an ADR choosing between Supabase Auth with MFA and a signed-link scheme; documents stored in private Supabase Storage with signed URLs; every access audit-logged; never indexed |
| FR-VAULT-04 | No client data is ever placed in the public repository or public bucket | MUST | Enforced by review checklist and secret scanning |

### FR-CONF — Confession Board (`/confession`) — PARTIAL → Phase 1

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-CONF-01 | Anonymous submission, 1–2000 characters | MUST | Server and client enforce the same bounds |
| FR-CONF-02 | Storage in Supabase `confessions` through a server route using the service-role client only | MUST | Anon key cannot select, update or delete (verified by test) |
| FR-CONF-03 | Anti-abuse: Turnstile, honeypot, time-to-submit ≥ 3s, 3 submissions per IP hash per hour | MUST | Bots receive a generic success response without storage; 4th human submission gets 429 |
| FR-CONF-04 | IPs and user agents stored only as salted hashes with a daily-rotating salt | MUST | No raw IP present in any table or log |
| FR-CONF-05 | Submission animation: note locks and slides into the vault slot; reduced-motion fallback is a simple fade | MUST | Transform and opacity only |
| FR-CONF-06 | Message content never stored in browser storage and never rendered as HTML | MUST | Verified by test |
| FR-CONF-07 | Owner notification via Telegram **without message text** | SHOULD | Message is "New confession received" only |
| FR-CONF-08 | Moderation states `new`, `read`, `archived`, plus a profanity and spam heuristic flag | SHOULD | Flagged items are not auto-published anywhere |
| FR-CONF-09 | Public display of confessions | WONT (for 3.0) | Board is write-only to the public; any future public wall requires moderation and a legal review |
| FR-CONF-10 | Optional hybrid client-side encryption (AES-GCM content key wrapped with owner RSA-OAEP public key) and a local-only decryption tool | COULD (Phase 1B) | Private key never stored or transmitted; limitation documented: protects content at rest, not against a compromised deployment |
| FR-CONF-11 | Retention policy with automated purge | SHOULD | Default 180 days after `archived` (PRV-04) |

### FR-PLAY — Play Dashboard (`/play`) and FR-ACT — Live Activity — PARTIAL → Phase 3

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-PLAY-01 | Game stats and "request a match" form | MUST | Form uses the same anti-abuse stack as FR-CONTACT-02 |
| FR-ACT-01 | `/api/activity/chess` returns rapid, blitz and bullet ratings from the public Chess.com API | MUST | Cached 600s; failure returns last known value or a placeholder |
| FR-ACT-02 | `/api/activity/spotify` returns now-playing (or recently played) using the refresh-token flow | MUST | Cached 30s; HTTP 204 handled; tokens never reach the client; missing env returns `configured:false` |
| FR-ACT-03 | Valorant rank and "currently building/watching" status are manual fields in a Sanity `siteStatus` singleton | MUST | No scraping (WONT-06) |
| FR-ACT-04 | Client polling only while the tab is visible and the card is on screen | MUST | Verified with the Page Visibility API |
| FR-ACT-05 | Skeleton, error and empty states for every activity card | MUST | No CLS when data arrives |
| FR-PLAY-02 | Lichess bot integration through a separate service | FUTURE (Phase 7) | Read-only status endpoint consumed by `/play` |

### FR-PLAYGROUND — Playground / Chaos Mode — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-PLAYGROUND-01 | Desktop users toggle Chaos Mode from the Navbar wand; `PlayableElement` is draggable (GSAP Draggable) and `EditableText` is editable (`contentEditable`) | MUST | Changes are session-local only and never persisted or transmitted |
| FR-PLAYGROUND-02 | Disabled on touch devices and for reduced-motion users | MUST | Toggle hidden in those contexts |
| FR-PLAYGROUND-03 | "Reset layout" control restores original positions and text | SHOULD | Single click, no reload |
| FR-PLAYGROUND-04 | Pasted content in `EditableText` is sanitized to plain text | MUST | No HTML injection possible |

### FR-GOD — God Mode Terminal — PLANNED → Phase 4

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-GOD-01 | Typing `sudo su` in the Command Palette enables God Mode after a short typed terminal sequence; `exit` disables it; `help` lists commands | MUST | Palette retains its existing behavior and `openOverlay` registration |
| FR-GOD-02 | Alternate triggers: Konami code (desktop), 7 taps on the footer logo within 4s (mobile) | SHOULD | Both call the same enable function |
| FR-GOD-03 | Visual transform via `data-god-mode="true"` on `<html>` overriding CSS variables only (terminal-green accent, scanline overlay with `pointer-events:none`) | MUST | No layout shift; instant switch under reduced motion |
| FR-GOD-04 | Unlocks Playground tools without the Navbar wand and reveals unlisted easter-egg routes | SHOULD | Routes documented as **not security**; contain nothing sensitive |
| FR-GOD-05 | State kept in `PlaygroundContext`, persisted in `sessionStorage` (try/catch) | MUST | Reload within the session preserves the state; new session starts normal |
| FR-GOD-06 | `exit` fully restores theme and tools | MUST | Verified by an end-to-end test |

### FR-CMD — Command Palette — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-CMD-01 | Open with Ctrl/Cmd+K; navigate pages, run actions, open chat | MUST | Fully keyboard operable; focus trapped and restored |
| FR-CMD-02 | Commands defined in a registry (`src/lib/commands.js`) with `id`, `title`, `keywords`, `run`, `hidden`, `requires` | SHOULD | New command requires one registry entry, no palette edits |
| FR-CMD-03 | Search over pages, blog posts and wiki titles | COULD | Index built at build time |

### FR-SEO — Discoverability, SEO and AEO — SHIPPED / extend

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-SEO-01 | `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph and Twitter metadata for every public route | MUST | Automated check fails the build on a missing title or description |
| FR-SEO-02 | `llms.txt` and `ai.txt` kept in sync with real content and permissions | SHOULD | Generated from the same data as the sitemap |
| FR-SEO-03 | A single Schema.org JSON-LD graph: `Person`, `WebSite`, `ProfilePage`, `Article`, `SoftwareApplication`, `Organization` | MUST | Entities cross-reference through stable `@id` values; no contradictory facts |
| FR-SEO-04 | Dynamic OG images for blog and wiki | COULD | Generated at the edge with caching |
| FR-SEO-05 | `/studio`, `/space/*`, `/lounge/*`, `/confession` inbox, god-mode routes and `/api/*` are `noindex` | MUST | Verified in headers or metadata |

### FR-PWA — Offline, PWA and Push — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-PWA-01 | Web manifest for standalone install on iOS and Android | MUST | Installable per Lighthouse PWA audit |
| FR-PWA-02 | Offline fallback page `/offline` | MUST | Served when navigation fails offline |
| FR-PWA-03 | Cache tiers: cache-first for immutable assets, stale-while-revalidate for HTML | MUST | Cache names versioned (`sks-static-*`, `sks-pages-*`) |
| FR-PWA-04 | Service worker never caches `/api/*`, POST requests, `/studio`, or authenticated pages | MUST | Verified by test and Phase 0 audit |
| FR-PWA-05 | Update flow: new service worker prompts "refresh for update" instead of silently breaking tabs | SHOULD | Old caches purged on activation |
| FR-PWA-06 | Web Push opt-in is explicit, never auto-prompted on load | MUST | Prompt follows a user gesture |

### FR-CONSENT — Consent and Analytics — SHIPPED

| ID | Requirement | Priority | Acceptance criteria |
| ---- | ------------- | ---------- | --------------------- |
| FR-CONSENT-01 | `ConsentAnalyticsGate` blocks Google Analytics, Vercel Analytics and (Phase 5) Sentry client events until consent | MUST | No analytics network request before consent (verified in a test) |
| FR-CONSENT-02 | Google Consent Mode v2 defaults to denied; regional defaults supported | MUST | Consent state persisted and revocable at any time from a footer link |
| FR-CONSENT-03 | Consent changes apply without a reload | SHOULD | Listeners update immediately |

---

## 6. Data Model

### 6.1 Sanity schemas

| Type | Key fields | Notes |
| ------ | ----------- | ------- |
| `post` | title, slug, author→author, categories→category[], mainImage, excerpt, body(blockContent), publishedAt, seo | Existing |
| `author` | name, slug, image, bio | Existing |
| `category` | title, slug, description | Existing |
| `product` | title, slug, price, currency, description, images, link, status | Existing |
| `vaultItem` | title, category, creator, year, rating, note, link, cover, featured, order | Phase 2 |
| `wikiPage` | title, slug, summary, category, body, tags[], publishedAt, status, relatedPages→wikiPage[] | Phase 2 |
| `siteStatus` (singleton) | valorantRank, currentlyBuilding, currentlyWatching, statusText, updatedAt | Phase 3 |

### 6.2 Supabase tables

| Table | Columns (summary) | RLS posture |
| ------- | ------------------- | ------------- |
| `live_chat_sessions` | id, visitor_session_id, telegram_message_id, created_at, last_seen_at | No public policies; service role only. Schema changes require reverse-lookup tests |
| `confessions` | id uuid PK, created_at, body text (1–2000), is_encrypted bool, status (`new`/`read`/`archived`), ip_hash, user_agent_hash | RLS on; **no** anon/authenticated policies |
| `rate_limits` | key (hash), window_start, count | Service role only; TTL cleanup job |
| `uptime_checks` (FUTURE) | id, service, ok, latency_ms, checked_at | Service role write, public aggregate view |
| `space_rooms` / canvas state | Per implementation [VERIFY] | PIN stored hashed only |

**Migration policy:** every schema change is a versioned SQL file in `supabase/migrations/`, applied to a preview project first, with a documented rollback.

### 6.3 Firebase Firestore

Collections for lounge rooms, presence, chat and signaling are governed by deny-by-default rules, App Check enforcement, per-document size limits, TTL cleanup, and rules unit tests run in CI against the emulator.

---

## 7. API Specification

All routes live under `src/app/api/`. Common contract: JSON in and out; errors use `{ "error": { "code": "string", "message": "string" } }`; no stack traces in responses; every write endpoint validates input with a schema validator; every public write endpoint verifies Turnstile.

| Route | Method | Auth | Rate limit | Cache | Purpose |
| ------- | -------- | ------ | ----------- | ------- | --------- |
| `/api/contact` | POST | Turnstile + honeypot | 5/h per IP hash | `force-dynamic` | Send contact email via Resend |
| `/api/confession` | POST | Turnstile + honeypot | 3/h per IP hash | `force-dynamic` | Store anonymous note |
| `/api/live-chat/send` | POST | Session token | Per-session throttle | `force-dynamic` | Forward visitor message to Telegram |
| `/api/live-chat/webhook` | POST | Telegram secret header | None (authenticated) | `force-dynamic` | Receive owner reply, broadcast via Supabase |
| `/api/chat` (AI) | POST | Turnstile or session | 10 per 10 min per IP; daily global cap | `force-dynamic` | AI assistant with provider fallback |
| `/api/posts` | GET | Public | None | ISR tag `posts` | Validated blog data via GROQ |
| `/api/revalidate` | POST | Shared secret header | Low | `force-dynamic` | Sanity webhook → `revalidateTag` |
| `/api/activity/chess` | GET | Public | CDN-level | 600s | Chess.com ratings |
| `/api/activity/spotify` | GET | Public (server holds tokens) | CDN-level | 30s | Now playing |
| `/api/status` | GET | Public | CDN-level | 30–60s | Dependency health |
| `/api/rtc-config` (recommended) | GET | Session | Low | `no-store` | Short-lived TURN credentials |

**Idempotency and retries:** write endpoints are not retried automatically by the client; the UI prevents double submits and surfaces failures with the user's text preserved.

---

## 8. Integration Matrix

| Integration | Used for | Failure mode | Fallback |
| ------------- | ---------- | -------------- | ---------- |
| Sanity | Content | Dataset or network down, env missing | Bundled fallback content; hide non-essential sections |
| Cloudinary | Global media delivery, project covers, gear catalog, transformations | CDN outage or network error | Fallback to SVG technical wireframe icons or local bundled webp fallbacks |
| Supabase | Chat sessions, confessions, rate limits | DB or Realtime outage | Accept-and-queue is **not** used; show a clear retry message; live chat offers the contact form |
| Firebase | Lounge presence, signaling | Quota or outage | Lounge shows an "unavailable" state; rest of the site unaffected |
| Resend | Email | API error | Show retry; log error to Sentry |
| Telegram | Owner notifications and replies | Bot API down | Live chat shows "owner offline", offers email |
| Gemini / OpenRouter | AI replies | Quota or timeout | Provider fallback, then FAQ-only answer, then handoff to live chat |
| Turnstile | Bot verification | Verification service down | Fail closed on writes with a friendly message |
| Spotify / Chess.com | Activity | API error or token expiry | Last cached value or hidden card |
| Vercel Analytics / GA | Metrics | Blocked or no consent | No impact on UX |
| Sentry (Phase 5) | Errors | DSN missing | No-op initialization |

---

## 9. Non-Functional Requirements

### 9.1 Performance (supersedes PRD 2.4.0 targets; see R3)

| ID | Metric | Target (p75 field, Vercel Analytics / CrUX) | Lab gate (Lighthouse, mobile preset) |
| ---- | -------- | -------------------------------------------- | -------------------------------------- |
| NFR-PERF-01 | LCP | ≤ 1.5s desktop, ≤ 2.0s mobile (Google "Good" threshold is 2.5s) | Performance ≥ 90 on `/`, ≥ 95 on content pages |
| NFR-PERF-02 | INP | ≤ 100ms (Google "Good" is 200ms) | n/a |
| NFR-PERF-03 | CLS | ≤ 0.05 | ≤ 0.05 |
| NFR-PERF-04 | TTFB | ≤ 400ms on cached pages | n/a |
| NFR-PERF-05 | Initial JS (home, gzip) | ≤ 180 KB | Enforced by a CI bundle-size check |
| NFR-PERF-06 | Animation | 60fps; `transform` and `opacity` only; no layout thrash | Profiled for new animations |
| NFR-PERF-07 | Third-party scripts | Loaded after consent and after interaction or idle | Verified in the network waterfall |
| NFR-PERF-08 | Fonts | Local files, preloaded, `font-display: swap` with size-adjusted fallbacks | CLS check |
| NFR-PERF-09 | Images | `next/image` + Cloudinary CDN (`f_auto,q_auto`), AVIF/WebP, explicit dimensions, priority only for LCP image | No unsized images |

Performance budgets are enforced in CI (Lighthouse CI or equivalent). A regression above 10% blocks merge unless waived with a written reason.

### 9.2 Accessibility (WCAG 2.2 AA)

- NFR-A11Y-01: Automated axe checks in CI on all public routes with zero serious or critical violations.
- NFR-A11Y-02: Full keyboard operability (palette, modals, filters, forms, terminal); visible focus; no keyboard traps.
- NFR-A11Y-03: `prefers-reduced-motion` honored by GSAP, Lenis, View Transitions, God Mode scanlines and the globe.
- NFR-A11Y-04: Color contrast ≥ 4.5:1 for text (3:1 for large text and UI components), including God Mode theme.
- NFR-A11Y-05: Target size ≥ 24×24 CSS px; touch targets ≥ 44×44 where feasible.
- NFR-A11Y-06: Live regions announce chat messages and form results; icons have accessible names.
- NFR-A11Y-07: Content usable at 400% zoom and from 320px to 3840px without horizontal scrolling.

### 9.3 Security

**Threat model (STRIDE-lite)**

| Threat | Example | Control | ID |
| -------- | --------- | --------- | ---- |
| Spoofing | Fake Telegram webhook calls | Secret-token header verification | SEC-01 |
| Tampering | Forged revalidation calls | Shared-secret verification; constant-time compare | SEC-02 |
| Repudiation | Disputed admin actions | Audit logging for studio and private vault | SEC-03 |
| Information disclosure | Service-role key or tokens in client bundle | Server-only env; bundle scan in CI; secret scanning | SEC-04 |
| Denial of service | Spam to AI, chat, contact, confession | Rate limits, Turnstile, global caps, request size limits | SEC-05 |
| Elevation of privilege | Anon reads Supabase tables | RLS on every table; policy tests | SEC-06 |
| XSS | User text rendered unsafely | No `dangerouslySetInnerHTML` on user content; sanitize pasted text; CSP | SEC-07 |
| CSRF | Cross-site form posts | Origin and header checks on POST routes, Turnstile token binding | SEC-08 |
| SSRF | Server fetching user-supplied URLs | No endpoint fetches user-supplied URLs; allow-list for outbound hosts | SEC-09 |
| Supply chain | Malicious dependency | Lockfile, Dependabot, `npm audit` in CI, provenance review for new packages | SEC-10 |
| Clickjacking | Framed site | `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors` | SEC-11 |
| Prompt injection | Hostile AI input | Isolated system prompt, no tools or secrets, output caps, red-team suite | SEC-12 |

**Additional controls**

- SEC-13: Content Security Policy rolled out in report-only mode first, then enforced; nonce-based scripts where feasible.
- SEC-14: Headers: `Strict-Transport-Security` (preload-ready), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera and microphone allowed only on `/lounge`), cross-origin policies compatible with WebRTC and embeds.
- SEC-15: CORS: internal APIs same-origin only; no wildcard origins.
- SEC-16: Secrets only in Vercel environment variables, separated per environment (development, preview, production); rotation runbook for every secret; `.env.local` never committed; only `.env.example` placeholders in the repo.
- SEC-17: Studio access gated; administrative routes `noindex`, rate-limited, and monitored.
- SEC-18: `security.txt` at `/.well-known/security.txt` with a disclosure contact.
- SEC-19: Dependency and secret scanning run on every PR; repository branch protection requires review or green CI.
- SEC-20: Logs never contain message bodies, raw IPs, tokens or email addresses.

### 9.4 Privacy and compliance

| ID | Requirement |
| ---- | ------------- |
| PRV-01 | Consent Mode v2 defaults to denied; analytics and Sentry client events start only after consent |
| PRV-02 | No fingerprinting; IPs used only transiently for rate limiting and stored only as salted, daily-rotating hashes |
| PRV-03 | Privacy policy lists every processor (Vercel, Supabase, Firebase, Sanity, Resend, Telegram, LLM providers, Cloudflare, Google, Sentry, Spotify) and purpose |
| PRV-04 | Retention schedule (below), enforced by scheduled jobs |
| PRV-05 | Data subject requests (access, deletion) handled via a documented process and contact address within 30 days |
| PRV-06 | AI chat notice: conversations are processed by third-party model providers; users are warned not to share sensitive information |
| PRV-07 | Live chat notice: messages are relayed to the owner through Telegram |
| PRV-08 | Children's data not knowingly collected; no age-targeted features |

**Retention schedule (proposed defaults, owner may adjust)**

| Data | Retention | Mechanism |
| ------ | ----------- | ----------- |
| Live chat session mappings and messages | 30 days | Scheduled purge |
| Confessions | 180 days after `archived`; unarchived reviewed at 365 days | Scheduled purge |
| Rate-limit counters | 24 hours | TTL cleanup |
| Contact emails | Held in the owner's mailbox; Resend logs per provider default | Documented |
| Space and lounge rooms | 24 hours after last activity | Cleanup job or TTL |
| Server logs | Per Vercel retention; no PII logged | Policy |

### 9.5 Reliability and operations

| ID | Requirement |
| ---- | ------------- |
| NFR-REL-01 | Availability target 99.9% monthly for public pages, measured by an external probe |
| NFR-REL-02 | Every external dependency call has a timeout (≤ 8s; ≤ 3s for probes) and a defined fallback (Section 8) |
| NFR-REL-03 | Zero-downtime deployments through Vercel; instant rollback documented |
| NFR-REL-04 | Preview deployment for every PR; production promotion only from `main` |
| OPS-01 | Runbook set in `docs/runbooks/`: Telegram webhook failure, Supabase outage, Sanity webhook failure, secret rotation, LLM quota exhaustion, service worker rollback |
| OPS-02 | Structured JSON logging with request IDs; no PII |
| OPS-03 | Sentry for client and server errors (consent-gated client side, no session replay, PII scrubbed, trace sample rate ≤ 10%, release tagging, source maps uploaded) |
| OPS-04 | Alerts for webhook failures, error-rate spikes and cron failures delivered to the owner through Telegram |
| OPS-05 | Quarterly restore drill for Supabase backups and Sanity dataset export |
| OPS-06 | Cost guardrails: LLM daily cap, Vercel spend alert, Firebase and Supabase quota alerts |

### 9.6 Compatibility and internationalization

- Browser support: last two major versions of Chrome, Edge, Safari (macOS and iOS 16+), and Firefox. WebRTC and View Transitions features degrade gracefully where unsupported.
- NFR-I18N-01: UTF-8 everywhere; multilingual boot script must render with correct fonts and RTL handling for Arabic.
- NFR-I18N-02 (FUTURE): Locale routing (`/bn`, `/hi`) evaluated after 3.0; strings extracted behind a message catalog before then if the owner approves.

---

## 10. Engineering Standards

### 10.1 Code and architecture rules (aligned with AGENTS.md)

1. Server Components by default; `'use client'` only at leaf components.
2. Vanilla CSS Modules and global CSS variables only; do not change the styling paradigm.
3. No heavy UI libraries; any new dependency states its gzip size and justification.
4. No `window.scrollTo`; use `navState` and Lenis. In-app navigation uses `transitionNavigate()`.
5. New modals register via `openOverlay('name')`.
6. Maintain WebRTC insecure-context checks.
7. Do not alter `live_chat_sessions` without testing the reverse lookup.
8. Never hardcode secrets; use `process.env`; update `.env.example` for every new variable.
9. React purity: no `useRef(Date.now())` (use `useState(() => Date.now())`), no synchronous `setState` in effects that cascade, escape JSX entities.
10. Every data-fetching path survives missing environment variables at build time.

### 10.2 Testing strategy

| Level | Tooling (recommended) | Scope | Gate |
| ------- | ---------------------- | ------- | ------ |
| Static | ESLint (zero errors), Prettier, type checks via JSDoc or gradual TypeScript | All source | Required |
| Unit | Vitest | Utilities, hashing, rate limiters, GROQ result mappers, command registry | ≥ 80% on `src/lib` |
| Integration | Vitest with route-handler harness; Supabase and Firestore emulators | API routes, RLS policies, Firestore rules | Required for security paths |
| End-to-end | Playwright (desktop and mobile viewports) | Contact, confession, live chat (mocked Telegram), command palette, God Mode, consent gating, offline fallback | Required before release |
| Accessibility | axe via Playwright | All public routes | Zero serious or critical |
| Performance | Lighthouse CI | `/`, `/blog`, `/vault`, `/wiki`, `/play` | Budgets in Section 9.1 |
| Visual regression | Playwright screenshots (COULD) | Key pages and God Mode theme | Advisory |
| Security | `npm audit`, secret scan, CSP report review, adversarial AI suite | PR and weekly schedule | Required |

### 10.3 Delivery workflow

- **Branching:** trunk-based with short-lived `feat/phase-N-name` branches; one PR per phase or capability.
- **Conventional commits**; PR template with checklist (build, lint, tests, env example, docs, accessibility, performance, reduced motion).
- **CI pipeline:** install → lint → unit and integration → build (with empty third-party env) → e2e on preview → Lighthouse CI → security scans.
- **Definition of Done (every change):**
  1. Acceptance criteria met and tested.
  2. `npm run lint` has zero errors; `npm run build` passes with and without third-party env vars.
  3. No new secret in the repo; `.env.example` updated.
  4. Reduced-motion and keyboard paths verified for any UI change.
  5. Performance budget unaffected (bundle-size report attached).
  6. Documentation updated (this PRD status, AGENTS.md rules if a rule changed, `/architecture` content if the system changed).
  7. No local artifacts committed (`lint_output.txt`, `npm-debug.log`, etc.).
- **Agent protocol:** the implementation agent reports files created and modified, env vars added, manual owner steps, test instructions and known limitations after each phase, then waits for architect approval.

### 10.4 Environment variable catalog

Names below are conventional; confirm against `.env.example` [VERIFY]. All secrets are server-only unless prefixed `NEXT_PUBLIC_`.

| Variable | Scope | Used by | Status |
| ---------- | ------- | --------- | -------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_VERSION` | Public | Sanity client | Existing |
| `SANITY_API_READ_TOKEN` (if drafts), `SANITY_REVALIDATE_SECRET` | Server | Preview, webhook | Phase 2 |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | `@supabase/ssr` browser client | Existing |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin client | Existing |
| `NEXT_PUBLIC_FIREBASE_*`, App Check site key | Public | Firebase | Existing |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Server | Contact | Existing |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Public / server | Forms | Existing |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_OWNER_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET` | Server | Live chat, alerts | Existing / extended |
| `GEMINI_API_KEY`, `GEMINI_MODEL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | Server | AI assistant | Existing (model IDs become config) |
| `CONFESSION_HASH_SALT` | Server | Confession rate limiting | Phase 1 |
| `NEXT_PUBLIC_CONFESSION_PUBKEY` | Public | Phase 1B encryption | Optional |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`, `CHESS_COM_USERNAME` | Server | Activity | Phase 3 |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` | Public / build | Sentry | Phase 5 |

---

## 11. Observability and Analytics Plan

| Question | Signal | Source | Consent needed |
| ---------- | -------- | -------- | ---------------- |
| Are visitors converting? | Contact submissions, live chat starts, resume downloads, plugin click-through | Server-side counters plus consented client events | Client events yes; server counters no (no PII) |
| Is the site fast for real users? | LCP, INP, CLS, TTFB | Vercel Analytics | Per configuration |
| Is anything breaking? | Error rate, unhandled exceptions, webhook failures | Sentry, Vercel logs | Client side yes |
| Is the AI assistant healthy and affordable? | FAQ hit rate, LLM calls per day, fallback rate, 429 rate | Aggregate server counters | No |
| Are dependencies up? | Probe results | `/api/status`, external uptime probe | No |

Event naming convention: `object_action` (for example `contact_submit`, `resume_download`), no free-text or PII properties.

---

## 12. Future-Proofing Strategy

### 12.1 Abstraction boundaries

| Concern | Interface | Why |
| --------- | ----------- | ----- |
| LLM | `LLMProvider.generate({messages, maxTokens, signal})` with adapters for Gemini and OpenRouter and contract tests | Model names and providers change often |
| Content | `src/lib/content/*` query modules returning plain typed objects | Swap Sanity or add MDX without touching pages |
| Rate limiting | `rateLimit(key, policy)` | Move from Postgres counters to Redis or Upstash later |
| Notifications | `notifyOwner(event)` | Telegram today; email or push later |
| Feature flags | `flags.js` reading env and optional Sanity singleton | Ship dark, enable per environment |
| Activity sources | `ActivitySource` adapters (Spotify, Chess.com, future Lichess, GitHub) | Add sources without touching the UI |

### 12.2 Platform evolution policy

- **Next.js and React:** upgrade through a dedicated branch with codemods, full CI, and a Lighthouse comparison. Use new framework capabilities (partial prerendering, cache components, view-transition improvements) only through ADRs that show a measured benefit.
- **React Compiler / TypeScript:** adopt TypeScript gradually (JSDoc types first, then `.ts` for `src/lib`) once test coverage is in place; evaluate the React Compiler after the purity lint rules pass cleanly.
- **Edge vs Node runtime:** default to Node serverless for routes using Node-only SDKs; use the Edge runtime only for lightweight, SDK-free handlers.
- **Browser APIs:** progressive enhancement for View Transitions, WebGPU (future globe rendering), WebCodecs and WebTransport; always feature-detected.
- **Search and AI:** structured data and `llms.txt` kept current; an MCP-style read-only content endpoint is a FUTURE option if answer engines standardize it.

### 12.3 Schema and content evolution

- Sanity schema changes are additive first; breaking changes follow expand → migrate → contract with scripted migrations and a dataset export beforehand.
- Slugs are permanent; renamed slugs create redirects stored in a `redirect` document or `next.config` map.
- Supabase migrations are forward-only with rollback notes; destructive changes require a backup confirmation.

### 12.4 Scalability thresholds and responses

| Dimension | Current design limit | Trigger | Response |
| ----------- | --------------------- | --------- | ---------- |
| Voice mesh | ~6 peers | Rooms beyond 6 | Introduce an SFU (LiveKit or similar) via ADR |
| Screen share star | Presenter uplink bound | > 10 viewers | Move to SFU |
| Space collaboration | Last-write-wins | Frequent conflicts | Adopt a CRDT (Yjs) with a provider |
| Rate-limit store | Postgres counters | > 100 req/s on limited routes | Move to Redis or Upstash |
| LLM spend | Daily cap | Cap hit regularly | Add a response cache keyed by normalized question; tiered models |
| CMS volume | Hundreds of docs | > 1000 wiki pages | Add paginated GROQ and a build-time search index |
| Telegram bridge | Single operator | Multiple operators | Per-conversation threads or a helpdesk integration |

### 12.5 Architecture Decision Records

Maintain `docs/adr/NNNN-title.md`. Initial ADR backlog: (1) Private Vault authentication approach, (2) CSP and nonce strategy, (3) SFU adoption criteria, (4) TypeScript migration plan, (5) Rate-limit store choice, (6) Analytics provider consolidation, (7) i18n approach.

### 12.6 Technical debt register (initial)

| Item | Impact | Plan |
| ------ | -------- | ------ |
| Hardcoded vault and wiki content | Code changes needed for content edits | Phase 2 |
| Confession backend absent | Feature non-functional | Phase 1 |
| No automated e2e suite documented | Regression risk | Phase 6 |
| AI model names baked in config assumptions | Breakage on model retirement | FR-CHAT-05 |
| Unverified status of several shipped pages | Documentation drift | Phase 0 audit [VERIFY] items |

---

## 13. Roadmap

| Phase | Name | Key deliverables | Depends on | Owner action required |
| ------- | ------ | ------------------ | ----------- | ----------------------- |
| 0 | Baseline and hygiene | Green build and lint; `.env.example` completeness; PWA cache audit; metadata audit | None | None |
| 1 | Confession backend | Migration, API route, anti-abuse, animation, retention job; optional 1B encryption | 0 | Run SQL; set service key, salt, Turnstile |
| 2 | Sanity vault and wiki | Schemas, GROQ layer, fallbacks, ISR, revalidation webhook, `/wiki/[slug]` | 0 | Add content; configure webhook |
| 3 | Live activity | Chess.com and Spotify routes, `siteStatus`, activity cards | 2 (for `siteStatus`) | Spotify app and refresh token |
| 4 | God Mode | Registry commands, triggers, theme, hidden routes | 0 | None |
| 5 | Observability | Sentry (consent-gated), error boundaries, alerts | 0 | DSN and auth token |
| 6 | Hardening and quality gate | CSP, headers, a11y pass, performance budgets, e2e suite, docs refresh | 1–5 | Review CSP reports |
| 7 | Lichess bot (separate repo) | Stockfish service and status endpoint | Owner approval | Lichess bot token, hosting |

**Horizon view**

- **Now (2.5–2.7):** Phases 0–6.
- **Next (3.0):** Private Vault ADR and build, feed and OG image generation, uptime history, i18n evaluation.
- **Later:** SFU-based lounge, CRDT-based Space, MCP-style content endpoint, WebGPU globe, newsletter (double opt-in) if audience warrants it.

---

## 14. Risks and Mitigations

| ID | Risk | Likelihood | Impact | Mitigation |
| ---- | ------ | ----------- | -------- | ----------- |
| K1 | Third-party free-tier limits (LLM, Firebase, Supabase) exhausted | Medium | Medium | Caps, caching, fallbacks, spend and quota alerts |
| K2 | Abuse of public write endpoints (spam, scraping, cost attacks) | High | Medium | Turnstile, honeypot, timing, rate limits, size limits, global caps |
| K3 | Performance regression from animation and 3D | Medium | High | Budgets in CI, dynamic imports, reduced-motion paths |
| K4 | Secret leakage | Low | Critical | Server-only env, scanning, rotation runbook, bundle scan |
| K5 | Model or API deprecation breaks AI or activity features | High | Medium | Provider abstraction, config-driven model IDs, contract tests, graceful fallback |
| K6 | Service worker serves stale or broken assets | Medium | Medium | Versioned caches, update prompt, never cache `/api`, rollback runbook |
| K7 | Legal exposure from user-submitted content | Low | High | Moderation states, retention, takedown process, write-only board, privacy notices |
| K8 | Solo-owner bus factor and AI-agent mistakes | Medium | High | AGENTS.md, ADRs, runbooks, CI gates, architect review per phase |
| K9 | Documentation drift (like the conflicts in Section 0.3) | High | Medium | PRD update is part of Definition of Done; quarterly doc audit |
| K10 | Overpromised claims (security, encryption, performance) erode credibility | Medium | High | Principle 7; claims reviewed against implementation before publishing |

---

## 15. Success Metrics and KPIs

| Area | KPI | Target | Measurement |
| ------ | ----- | -------- | ------------- |
| Conversion | Qualified inbound leads | ≥ 15 per month | Contact, live chat and email tagging |
| Responsiveness | Live chat first response | ≥ 80% within 10 minutes during stated hours | Telegram timestamps (aggregate) |
| Credibility | Lighthouse lab scores | Performance ≥ 90 (home) / ≥ 95 (content); Accessibility, Best Practices, SEO ≥ 95 | Lighthouse CI per release |
| Experience | Core Web Vitals (p75) | LCP ≤ 1.5s desktop / 2.0s mobile; INP ≤ 100ms; CLS ≤ 0.05 | Vercel Analytics |
| Engagement | Average session duration on deep pages | ≥ 3 minutes on `/architecture`, `/blog`, `/plugin` | Consented analytics |
| Reliability | Availability | ≥ 99.9% monthly | External probe |
| Quality | Unhandled errors | Zero unresolved Sev-1; error-free session rate ≥ 99.5% | Sentry (from Phase 5) |
| Security | Open high-severity dependency advisories | 0 older than 7 days | `npm audit`, Dependabot |
| Content velocity | Time from Studio publish to live | ≤ 60 seconds | Webhook logs |
| Discoverability | Indexed public pages; rich-result eligibility | 100% of public routes indexed; zero structured-data errors | Search Console |
| Plugin | Plugin page → WordPress.org click-through | Establish baseline in the first month, then improve | Consented click events |

---

## 16. Decision Log and Open Questions

| ID | Decision / question | Status | Owner |
| ---- | -------------------- | -------- | ------- |
| D1 | `/vault` is the public Culture Vault; Private Vault lives at `/vault/private` (R1) | Recommended, awaiting owner confirmation | Owner |
| D2 | Confessions are write-only to the public in 3.0 (FR-CONF-09) | Recommended | Owner |
| D3 | Confession client-side encryption (Phase 1B) | Open: build or skip | Owner |
| D4 | Retention defaults (Section 9.4) | Proposed | Owner |
| D5 | Valorant rank is manual via Sanity (no scraping) | Decided | Architect |
| D6 | Performance targets replaced with enforceable budgets (R3) | Decided | Architect |
| D7 | Adopt TypeScript gradually | Open | Owner / Architect |
| D8 | Private Vault auth: Supabase Auth with MFA versus signed links | Open (ADR-0001) | Architect |
| D9 | Lichess bot hosting and whether to build it | Open | Owner |
| D10 | Newsletter or RSS-only audience channel | Open | Owner |

---

## Appendix A — Route Inventory

| Route | Index | Rendering | Notes |
| ------- | ------- | ----------- | ------- |
| `/` | Yes | SSG | |
| `/about` | Yes | SSG | |
| `/blog`, `/blog/[slug]` | Yes | ISR | |
| `/wiki`, `/wiki/[slug]` | Yes | ISR | Phase 2 for CMS |
| `/vault` | Yes | ISR | Culture Vault |
| `/vault/private` | No | Dynamic, authenticated | FUTURE |
| `/tools`, `/store` | Yes | SSG / ISR | |
| `/plugin`, `/plugin/[slug]`, `/plugin/docs/[topic]` | Yes | SSG | Config-driven |
| `/wefik`, `/uses`, `/architecture` | Yes | SSG | |
| `/play` | Yes | SSG shell + cached APIs | |
| `/confession` | Yes (page), No (inbox) | SSG + API | |
| `/lounge`, `/lounge/[roomId]` | No (rooms) | Dynamic | |
| `/space`, `/space/[roomId]` | No | Dynamic | |
| `/status` | Yes | Dynamic, short cache | |
| `/contact` | Yes | SSG + API | |
| `/privacy`, `/terms`, `/bot/privacy-policy` | Yes | SSG | |
| `/studio` | No | Gated | |
| `/offline` | No | Static | |
| God Mode easter-egg routes | No | Static | Not security |

## Appendix B — Glossary

- **AEO:** Answer Engine Optimization; making content citable by AI assistants.
- **ADR:** Architecture Decision Record.
- **ISR:** Incremental Static Regeneration.
- **RLS:** Row Level Security (Postgres).
- **SFU:** Selective Forwarding Unit, a server that relays WebRTC media to many peers.
- **Star / Mesh topology:** WebRTC layouts where one presenter fans out to viewers (star) or every peer connects to every other peer (mesh).
- **Turnstile:** Cloudflare's CAPTCHA alternative.
- **p75:** the 75th percentile of real-user measurements.

## Appendix C — Change Log

| Version | Date | Summary |
|---------|------|---------|
| 2.4.0 | Oct 2026 | Previous PRD (feature summary) |
| 3.0.0 | Oct 2026 | Full rewrite: requirement IDs and acceptance criteria, reconciliation notes, data model, API spec, threat model, privacy and retention, performance budgets, testing strategy, future-proofing, roadmap, risks, decision log |
