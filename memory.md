# Project Memory & Knowledge Context

**Platform:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform  
**Target Domain:** [genioussonu.me](https://genioussonu.me)  
**Created:** October 2026  
**Document Purpose:** Persistent context, Architectural Decision Records (ADRs), developer biography, integration references, known quirks, and future roadmap.  

---

## 1. Owner & Developer Identity

- **Full Legal Name**: SK Sahinur Islam
- **Professional Aliases**: Genious Sonu, Sonu, Sahinur
- **Primary Roles**:
  - Senior Web Application Developer at **Ib Arts** (Jul 2026 – Present) — leading backend architecture, REST API design, DevOps pipelines, containerized deployments, and cloud infrastructure.
  - Co-Founder at **WEFIK** (Mar 2021 – Present) — directing technical delivery for 30+ international web and mobile applications across clients in 5+ countries.
  - Freelance Full-Stack Developer on **Upwork** (Apr 2025 – Present) — specialized in high-performance web applications, Shopify, WordPress, Laravel, and AI integrations.
  - Former QA Engineer at **ARC Document Solutions** (Sep 2025 – Jun 2026) — validated document processing pipelines, OCR integrity, and regression testing.
- **Location**: Kolkata, West Bengal, India
- **Indian Patent**:
  - **Patent Title**: Solar-Powered IoT Vaccine Preservation System with Real-Time MQTT Telemetry
  - **Patent Application / Grant No.**: 202531060002 A / 544062
  - **Function**: Autonomous temperature-sensitive vaccine storage monitoring with automated cold-chain failure alerts.
- **Key Certifications**: CompTIA A+, TryHackMe Pre Security, IBM Machine Learning with Python (Honors), CoCubes Certified Coding & Aptitude, Duke & UC Irvine courses.

---

## 2. Key Architectural Decision Records (ADRs)

### ADR-01: Hybrid Data Model (Sanity CMS + Supabase + Firebase)

- **Context**: Deciding between a unified monolithic database vs. specialized multi-tier storage.
- **Decision**:
  - **Sanity.io v3**: Immutable editorial content (articles, changelogs, author profiles) benefiting from global edge CDN distribution and Incremental Static Regeneration (ISR).
  - **Supabase (PostgreSQL)**: Low-latency relational data, rate-limit logs, visit analytics, and live chat session mapping with Row-Level Security.
  - **Firebase Firestore**: Real-time collaborative documents, The Lounge hangout rooms, and WebRTC peer signaling mesh.
- **Consequence**: Clean architectural decoupling. Editorial changes never touch relational databases, and high-frequency real-time events never trigger heavy CMS queries.

### ADR-02: Zero-Polling Live Chat Relay via Telegram Bot API

- **Context**: Enabling real-time visitor communication without paid SaaS widgets (Intercom, Crisp) or resource-heavy server polling.
- **Decision**: When a visitor enters live chat, their browser connects to a scoped Supabase Realtime channel. Incoming messages trigger a serverless API that forwards the query to a private Telegram chat with instant push notifications on Sonu's smartphone. Operator replies trigger an authenticated webhook (`/api/live-chat/webhook`) that immediately broadcasts the reply over Supabase Realtime to the visitor's channel.
- **Consequence**: Sub-second round-trip latency, zero recurring SaaS costs, no heavy tracking scripts, and instant mobile accessibility.

### ADR-03: Tiered AI Assistant (`genious.exe`) with Dual-Provider Fallback

- **Context**: Free-tier cloud LLMs frequently experience rate limits (HTTP 429) or intermittent latency spikes.
- **Decision**: Multi-stage routing pipeline:
  1. Local semantic FAQ matching against indexed portfolio knowledge (0 API cost, instant answer).
  2. Primary LLM: Google Gemini 1.5 Flash.
  3. Automatic failover: OpenRouter API (Mistral / Llama 3) when Gemini encounters rate limits or errors.
- **Consequence**: High response accuracy and virtually 100% uptime without hitting expensive enterprise API tiers.

### ADR-04: Vanilla CSS Over Utility Frameworks (Tailwind)

- **Context**: Maximizing aesthetic distinctiveness, paint performance, and reducing bundle weight.
- **Decision**: Avoid TailwindCSS entirely. Implement custom CSS design tokens in `globals.css` alongside CSS Modules for component encapsulation.
- **Consequence**: Sub-millisecond CSS parsing, zero class bloat, complete control over complex glassmorphism, responsive clamping, and GSAP animation targets.

---

## 3. Environment Variables Reference

| Variable Name | Environment | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client / Server | Sanity CMS Project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Client / Server | Sanity dataset (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Client / Server | API date string (`2026-02-01`) |
| `STUDIO_ADMIN_EMAIL` | Server-only | Sanity Studio admin gate authentication |
| `STUDIO_ADMIN_PASSWORD` | Server-only | Sanity Studio password gate |
| `STUDIO_SESSION_SECRET` | Server-only | Cryptographic secret for Studio session tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | Client / Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client / Server | Supabase public anonymous API key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Privileged Supabase secret key for server APIs |
| `RESEND_API_KEY` | Server-only | Resend transactional email API key |
| `CONTACT_NOTIFICATION_EMAIL` | Server-only | Inbox receiving contact form submissions |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client / Server | Google Analytics 4 measurement tag (`G-XXXXXXXXXX`) |
| `GEMINI_API_KEY` | Server-only | Google AI Studio API key for `genious.exe` |
| `OPENROUTER_API_KEY` | Server-only | Secondary fallback LLM provider API key |
| `TELEGRAM_BOT_TOKEN` | Server-only | Telegram Bot token for Live Chat relay |
| `TELEGRAM_CHAT_ID` | Server-only | Sonu's personal Telegram Chat ID |
| `TELEGRAM_WEBHOOK_SECRET` | Server-only | Secret token to authenticate Telegram webhook requests |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client / Server | Cloudflare Turnstile public widget site key |
| `TURNSTILE_SECRET_KEY` | Server-only | Cloudflare Turnstile server validation secret |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Client / Server | Web Push VAPID public key |
| `VAPID_PRIVATE_KEY` | Server-only | Web Push VAPID private signing key |
| `VAPID_SUBJECT` | Server-only | Contact email for Web Push notifications |

---

## 4. Known Quirks, Gotchas & Established Solutions

1. **Native ViewTransitions AbortError in Next.js Turbopack**:
   - *Issue*: During rapid navigation, browser `startViewTransition` throws an unhandled `AbortError` if another link is clicked before the transition completes.
   - *Solution*: Handled in `TransitionContext.jsx` with an active `AbortController`, deduplication guard (250ms), a 450ms safety timeout, and an `unhandledrejection` listener suppressing harmless cancellation errors in dev overlays.
2. **bfcache (Back-Forward Cache) and BootPreloader**:
   - *Issue*: When returning to the site using browser Back button, the terminal preloader could replay and block the view.
   - *Solution*: `BootPreloader.jsx` listens to the `pageshow` event (`e.persisted === true`) and instantly removes the preloader and releases scroll lock.
3. **Lenis + GSAP ScrollTrigger Synchronization**:
   - *Issue*: Desktop smooth scroll can cause GSAP ScrollTrigger calculations to lag behind visual viewport scroll.
   - *Solution*: Lenis ticker is explicitly synchronized to `gsap.ticker.add((time) => lenis.raf(time * 1000))` in `SmoothScrollProvider.jsx`, ensuring 60-120fps sync.
4. **Supabase Schema Cache Miss Handling**:
   - *Issue*: In serverless edge functions, if a table was recently created or not yet seeded, Supabase might return error `PGRST205`.
   - *Solution*: `route.js` handlers implement graceful fallback to in-memory rate-limiting maps and default static FAQ objects, preventing customer-facing 500 errors.

---

## 5. Future Roadmap & Enhancements

- [ ] **AI Voice Interaction**: Add optional speech-to-text input and synthesized voice output in `ChatbotWidget` using Web Speech API or ElevenLabs edge stream.
- [ ] **Dynamic Case Study Walkthroughs**: Interactive step-by-step code/architecture diff viewer in `/architecture` allowing visitors to inspect system evolution.
- [ ] **The Lounge Whiteboard Export**: Export collaborative Lounge and Space canvas drawings to SVG/PNG directly from the client.
- [ ] **Plugin Directory Expansion**: Launching **ChatKeeper** and WordPress directory listings once official repository reviews conclude.
- [ ] **Automated Performance Lighthouse Bot**: GitHub Action to run automated Core Web Vitals checks on every push to maintain 100/100 performance scores.
