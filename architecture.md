# System Architecture Document

**Platform:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform  
**Target Domain:** [genioussonu.me](https://genioussonu.me)  
**Document Version:** 2.4.0  
**Status:** Living Engineering Architecture  

---

## 1. High-Level Architectural Topology

The platform is designed around a modern **Decoupled Serverless & Realtime Hybrid Architecture**. It combines edge-rendered user interfaces, edge-cached headless CMS data, distributed relational and document storage, and peer-to-peer real-time communication protocols.

```text
                              ┌──────────────────────────────────────────────┐
                              │            Web / Mobile Visitors             │
                              │ (Desktop, PWA Standalone, Mobile Responsive) │
                              └──────────────────────┬───────────────────────┘
                                                     │ HTTPS / WSS
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │         Vercel Edge Network (Global CDN)     │
                              │  - Anycast DNS & Edge Cache                  │
                              │  - Custom Security Headers (CSP, HSTS)       │
                              │  - Dynamic Image Optimization (WebP / AVIF)  │
                              └──────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
                              ┌──────────────────────────────────────────────┐
                              │     Next.js 16 App Router (Node.js 20+)      │
                              │  - React 19 Server Components (RSC)          │
                              │  - Route Handlers (/api/*)                   │
                              │  - View Transitions API & Smooth Scroll      │
                              │  - Service Worker PWA Tier (/sw.js)          │
                              └──────┬───────────────┼───────────────┬───────┘
                                     │               │               │
            ┌────────────────────────┘               │               └────────────────────────┐
            ▼                                        ▼                                        ▼
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│     Content Layer       │      │  Realtime & Data Layer  │      │  AI & Integration Tier  │
├─────────────────────────┤      ├─────────────────────────┤      ├─────────────────────────┤
│ • Sanity.io CMS v3      │      │ • Supabase (PostgreSQL) │      │ • Google Gemini 1.5     │
│   (Embedded /studio)    │      │   - Row Level Security  │      │ • OpenRouter Failover   │
│ • GROQ Query Engine     │      │   - Realtime Channels   │      │ • Telegram Bot API      │
│ • Cloud CDN Caching     │      │ • Firebase Firestore    │      │   (Zero-polling relay)  │
│ • On-Demand ISR         │      │   - Realtime Rooms      │      │ • Resend Email API      │
│                         │      │   - WebRTC Signaling    │      │ • Web Push (VAPID)      │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 2. Technology Stack Breakdown

| Architectural Layer | Technology Selection | Version / Specification | Rationale & Trade-offs |
| :--- | :--- | :--- | :--- |
| **Application Framework** | Next.js (App Router) | `16.2.9` | Zero-configuration server components, streaming SSR, edge route handlers, and native Turbopack support. |
| **View Engine** | React / React DOM | `19.2.4` | Declarative UI, modern hooks, concurrent rendering, and native View Transitions integration. |
| **Styling & Design System** | Vanilla CSS + CSS Modules | Modern CSS (CSS Custom Properties) | Zero runtime overhead, complete cascade control, sub-millisecond paint speeds; avoids utility bloat. |
| **Smooth Scrolling** | Lenis by Studio Freight | `1.3.26` | Hardware-calibrated inertia scrolling on desktop (`lerp: 0.1`) synchronized with GSAP animation ticker. |
| **Animation Engine** | GSAP & ScrollTrigger | `3.15.0` (`@gsap/react: 2.1.2`) | High-performance timeline pinning, card stacking in Experience section, magnetic physics, and batched reveals. |
| **3D WebGL Visualization** | Three.js & Globe.gl | `0.184.0` / `2.46.1` | High-fidelity 3D interactive globe with client connectivity arcs and GPU-accelerated atmospheric glow. |
| **Headless CMS** | Sanity.io v3 | `5.31.2` (`next-sanity: 13.3.4`) | Strict schema validation, embedded Studio route (`/studio`), real-time content lake with GROQ caching. |
| **Relational Database** | Supabase (PostgreSQL) | `@supabase/supabase-js: 2.114.0` | Relational integrity, built-in Row-Level Security (RLS), real-time WebSocket pub/sub, rate limiting persistence. |
| **Media Delivery & CDN** | Cloudinary | `^2.5.1` (SDK & Client Helpers) | Global media CDN, automated AVIF/WebP transcoding (`f_auto,q_auto`), dynamic responsive transformations, and secure media uploads. |
| **Realtime Documents** | Firebase Firestore | `12.19.0` | Real-time state synchronization for The Lounge (`/lounge`) and P2P WebRTC signaling channels. |
| **Transactional Email** | Resend | `6.25.0` | High-deliverability SMTP alternative via REST API with automated SPF/DKIM verification and React Email templates. |
| **Machine Intelligence** | Gemini 1.5 Flash + OpenRouter | REST Edge Endpoints | Primary low-latency semantic chatbot with transparent fallback to open-source models under quota saturation. |
| **Offline & PWA** | Custom SW + `@ducanh2912/next-pwa` | Service Worker vCache | Full offline page routing, background sync, install prompts, and VAPID Web Push notifications. |

---

## 3. Core Subsystems & Request Flows

### 3.1. Subsystem A: Contact & Lead Ingestion Pipeline

When a user submits an inquiry through `/contact` or the home page contact drawer:

```text
[User Browser]
      │
      │ 1. Validate length, regex & check honeypot (client-side)
      │ 2. Submit POST payload to /api/contact
      ▼
[/api/contact (Next.js Edge Route)]
      │
      ├─► 3. Validate origin & referrer headers (CSRF defense)
      ├─► 4. Verify Cloudflare Turnstile bot token
      ├─► 5. Filter disposable email domains (disposable-email-domains library)
      ├─► 6. Check IP rate limits (Supabase contact_abuse_logs)
      │
      ▼ (If Valid)
[Resend API Gateway]
      │
      ├─► 7. Render responsive HTML notification email
      ├─► 8. Dispatch to personal inbox (contact@genioussonu.me)
      └─► 9. Return JSON confirmation `{ success: true, messageId }` to client
```

### 3.2. Subsystem B: Autonomous Systems Assistant (`genious.exe`)

The conversational AI widget operates across three intelligent tiers:

```text
[Visitor in ChatbotWidget.jsx]
      │
      │ 1. Submits prompt (< 500 characters)
      ▼
[/api/chatbot Route Handler]
      │
      ├─► 2. Enforce strict rate limits (Max 10 requests / 10-min window per IP)
      ├─► 3. Sanitize chat history (Max 6 conversation turns)
      │
      ├─► 4. Tier 1: Semantic Local FAQ Matcher
      │      - Scans query against portfolio knowledge base (career, patent, tech stack, hobbies)
      │      - If exact high-confidence match found, return instantly (0 cloud API cost)
      │
      ├─► 5. Tier 2: Primary LLM (Google Gemini 1.5 Flash)
      │      - Injects system prompt, developer profile, and conversation context
      │      - If response 200 OK, stream/return answer to client
      │
      └─► 6. Tier 3: Secondary LLM Fallback (OpenRouter API)
             - Triggered automatically on HTTP 429 (Rate Limit) or 5xx provider error
             - Invokes Meta Llama 3 / Mistral weights to ensure zero downtime
```

### 3.3. Subsystem C: Zero-Polling Telegram Live Chat Relay

Allows instant two-way mobile communication without running persistent polling servers or injecting heavy commercial chat widgets:

```text
[Web Visitor Browser]
      │
      │ 1. Visitor switches ChatbotWidget to "Live Chat" mode
      │ 2. Subscribes to Supabase Realtime channel: `live-chat:{sessionId}`
      │ 3. Posts message to `/api/live-chat/send`
      ▼
[/api/live-chat/send Route Handler]
      │
      ├─► 4. Persists message mapping in Supabase table `live_chat_sessions`
      ├─► 5. Formats Telegram message with inline action buttons:
      │      [Reply to Visitor]  [End Session]
      ▼
[Telegram Bot API] ──► Pushes notification to Sonu's mobile phone
      │
      │ 6. Sonu taps "Reply" or writes message in Telegram chat
      ▼
[Telegram Webhook: /api/live-chat/webhook]
      │
      ├─► 7. Validates `X-Telegram-Bot-Api-Secret-Token`
      ├─► 8. Looks up `session_id` using `telegram_message_id` from Supabase
      ├─► 9. Broadcasts message payload over Supabase Realtime WebSocket
      ▼
[Supabase Realtime Engine]
      │
      ▼ (Zero-latency WebSocket event)
[Visitor Browser (ChatbotWidget.jsx)]
      │
      ├─► 10. Renders incoming message in chat bubble
      ├─► 11. Plays Web Audio chime notification
      └─► 12. Triggers browser Web Push notification if tab is in background
```

### 3.4. Subsystem D: The Lounge & Shared Space (Realtime Collaboration)

- **State Synchronization**: Uses Firebase Firestore real-time snapshot listeners (`onSnapshot`) for room state, participants, and chat messages.
- **Synchronized Video Player**: Host controls video ID, play/pause state, and current playback time; participant players automatically synchronize within a 1.5-second buffer tolerance.
- **WebRTC Signaling**:
  - P2P Audio Mesh: Each participant exchanges SDP offers/answers and ICE candidates via Firestore subcollection `voiceSignals/{peerA}/peers/{peerB}`.
  - P2P Screenshare (Star Topology): Presenter publishes stream; peers establish one-way downstream RTCPeerConnections negotiated via `signals/{peerA}/peers/{peerB}`.

### 3.5. Subsystem E: Media CDN & Dynamic Asset Pipeline (Cloudinary)

- **Automated Next-Gen Formats**: All image requests automatically transcode to AVIF or WebP based on user-agent capabilities (`f_auto,q_auto`).
- **Dynamic Responsive Breakpoints**: Client components utilize `buildCloudinaryUrl` and `buildCloudinarySrcSet` (`src/lib/cloudinaryClient.js`) to generate device-calibrated asset resolutions.
- **Security & Secret Isolation**: Upload operations are gated through `src/app/api/upload/route.js` and `src/lib/cloudinary.js` (`import 'server-only'`), ensuring `CLOUDINARY_API_SECRET` is never leaked to the client bundle.
- **Remote Domain Pattern**: Enforced in `next.config.mjs` via `remotePatterns` matching `res.cloudinary.com`.

---

## 4. Component Hierarchy & Navigation Flow

```text
RootLayout (layout.js)
 ├── OverlayProvider (Unified body scroll lock & modal manager)
 ├── TransitionProvider (Native View Transitions API router)
 ├── PlaygroundProvider (State for experimental demos)
 ├── LoadingBar (Top navigation progress indicator)
 ├── BootPreloader (Typewriter cyber terminal)
 ├── SmoothScrollProvider (Lenis scroll engine)
 ├── PWARegistration (Service Worker update lifecycle)
 ├── UserPreferences (Sound FX & theme state)
 ├── CustomCursor (Hardware-accelerated reactive cursor)
 ├── CommandPalette (Global cmdk search drawer - Ctrl+K)
 ├── ChatbotWidget (Dual AI & Telegram chat drawer)
 ├── CookieConsentBanner & ConsentAnalyticsGate (Google Consent Mode v2)
 ├── MobileBottomCTA (Sticky conversion bar on mobile)
 └── {children} (Page Route Shell)
      ├── Page: Home (page.js)
      │    ├── Navbar
      │    ├── Hero
      │    ├── About
      │    ├── Experience (Pinned card stack)
      │    ├── Projects (Dynamic filter grid)
      │    ├── Skills (Category matrices)
      │    ├── Certifications & Patent
      │    ├── GlobeConnect (Three.js WebGL)
      │    ├── HomeBlogSection (Sanity query)
      │    ├── Contact
      │    └── Footer
      ├── Page: /architecture (System Topology & Data Flows)
      ├── Page: /blog & /blog/[slug] (Headless Articles)
      ├── Page: /lounge & /lounge/[roomId] (Virtual Hangout)
      ├── Page: /space & /space/[roomId] (Collaborative Whiteboard)
      ├── Page: /plugin/* (WordPress Extensions Hub)
      ├── Page: /status (Live Infrastructure Health)
      ├── Page: /store, /tools, /uses, /wiki, /vault, /wefik
      └── Page: /studio/[[...tool]] (Embedded Sanity CMS)
```

---

## 5. Database Schema & Data Models

### 5.1. Supabase (PostgreSQL) Tables & Migrations

```sql
-- 1. Live Chat Session Mapping (Telegram <-> Visitor)
CREATE TABLE live_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_message_id BIGINT UNIQUE NOT NULL,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_live_chat_session_id ON live_chat_sessions(session_id);

-- 2. Chatbot Rate Limiting & FAQ Cache
CREATE TABLE chatbot_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  priority INT DEFAULT 0
);

CREATE TABLE chatbot_rate_limits (
  ip_address TEXT PRIMARY KEY,
  request_count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now()
);

-- 3. Web Push Subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Shared Space Collaboration Rooms & Documents
CREATE TABLE shared_space_rooms (
  room_id TEXT PRIMARY KEY,
  pin_hash TEXT,
  title TEXT DEFAULT 'Untitled Space',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE shared_space_document (
  room_id TEXT PRIMARY KEY REFERENCES shared_space_rooms(room_id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  version INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Privacy-Preserving Site Visit Telemetry
CREATE TABLE site_visit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_hash TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- 6. Contact Form Abuse Guard
CREATE TABLE contact_abuse_logs (
  ip_address TEXT PRIMARY KEY,
  attempt_count INT DEFAULT 1,
  blocked_until TIMESTAMPTZ
);
```

### 5.2. Sanity Content Schemas

- **`post`**: `title`, `slug`, `author` (reference), `mainImage`, `categories` (array of references), `publishedAt`, `excerpt`, `body` (blockContent), `readingTime`, `featured`, `seoTitle`, `seoDescription`.
- **`author`**: `name`, `slug`, `image`, `bio`.
- **`category`**: `title`, `description`, `color`.
- **`blockContent`**: Structured rich text supporting nested headers, callouts (`info`, `tip`, `warning`), code blocks with language syntax, and inline figures.

---

## 6. Security, Authentication & Deployment

### 6.1. Security Defenses

- **Environment Isolation**: Server-only secrets (`RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`, `STUDIO_ADMIN_PASSWORD`) are wrapped in `import 'server-only'` to guarantee zero client bundle leakage.
- **Webhook Authenticity**: Telegram webhook requests are validated against `X-Telegram-Bot-Api-Secret-Token`.
- **Input Sanitization**: User inputs in contact forms and chat endpoints undergo strict trimming, HTML escaping, and length truncation.
- **CSP & HTTP Headers**: Enforced via `next.config.mjs` with `SAMEORIGIN` framing rules for `/studio`, immutable caching for static assets, and strict MIME types for service workers.

### 6.2. Deployment & CI/CD Pipeline

- **Platform**: Hosted on **Vercel Edge Network** with automatic git push deployments from GitHub `main` branch.
- **Build Step**:
  1. `node scripts/update-sw-version.mjs` updates the Service Worker cache timestamp in `public/sw.js`.
  2. `next build --webpack` compiles static pages, generates static JSON metadata, and validates TypeScript/ESLint rules.
- **Monitoring**: Real-time observability via `@vercel/analytics` and `@vercel/speed-insights`.
