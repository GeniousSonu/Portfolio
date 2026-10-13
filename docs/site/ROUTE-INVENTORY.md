# Route Inventory & Site Topology

**Project:** SK Sahinur Islam (Genious Sonu) — Portfolio & Engineering Platform  
**Document Version:** 1.0.0 (Phase R0 Skeleton Audit)  
**Last Updated:** October 2026  

---

## 1. Route Audit Matrix

| Route | File Path | Rendering | Purpose | Status | In-Nav (Group) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `src/app/page.js` | Client / Dynamic shell | Main Landing & Operator Console | Real | Yes (Home / Logo) |
| `/#about` | `src/app/page.js` (`#about`) | Client section | Operator bio, education & certifications overview | Real | Yes (About) |
| `/#experience` | `src/app/page.js` (`#experience`) | Client section | Pinned career timeline (Ib Arts, WEFIK, ARC) | Real | Yes (Work) |
| `/#projects` | `src/app/page.js` (`#projects`) | Client section | Selected works & patent cold-chain card | Real | Yes (Work) |
| `/#skills` | `src/app/page.js` (`#skills`) | Client section | Core competencies & tech matrices | Real | No (Anchor) |
| `/#certifications`| `src/app/page.js` (`#certifications`)| Client section | 30+ verified security & cloud credentials | Real | Yes (About) |
| `/#global-reach` | `src/app/page.js` (`#global-reach`)| Client section | Three.js interactive WebGL telemetry globe | Real | No (Anchor) |
| `/about` | `src/app/about/page.js` | Static / RSC | Dedicated deep-dive biographical narrative | Real | Yes (About) |
| `/blog` | `src/app/blog/page.jsx` | ISR (Sanity) | Technical essays, architecture deep-dives | Real | Yes (Knowledge) |
| `/blog/[slug]` | `src/app/blog/[slug]/page.jsx` | ISR (Sanity) | Headless article reader with TOC & code blocks | Real | No (Dynamic) |
| `/wiki` | `src/app/wiki/page.js` | Static / RSC | Digital garden, patent blueprints & knowledge base | Real | Yes (Knowledge) |
| `/architecture` | `src/app/architecture/page.jsx` | Static / RSC | System topology, telemetry data flow & security specs | Real | Yes (Knowledge) |
| `/uses` | `src/app/uses/page.jsx` | Static / RSC | Dual-monitor workstation, hardware & toolchain setup | Real | Yes (Knowledge) |
| `/wefik` | `src/app/wefik/page.js` | Static / RSC | Co-founder agency showcase & client operations | Real | Yes (Work) |
| `/plugin` | `src/app/plugin/page.js` | Static / RSC | WordPress plugin hub (Site Checkup suite) | Real | Yes (Work) |
| `/plugin/[slug]` | `src/app/plugin/[slug]/page.js` | Dynamic / SSR | Plugin detail & feature breakdown | Real | No (Dynamic) |
| `/plugin/[slug]/changelog` | `src/app/plugin/[slug]/changelog/page.js` | Dynamic / SSR | Version releases & upgrade history | Real | No (Dynamic) |
| `/plugin/[slug]/docs` | `src/app/plugin/[slug]/docs/page.js` | Dynamic / SSR | Developer docs index | Real | No (Dynamic) |
| `/plugin/[slug]/docs/[topic]` | `src/app/plugin/[slug]/docs/[topic]/page.js` | Dynamic / SSR | Topic-specific documentation | Real | No (Dynamic) |
| `/plugin/[slug]/privacy-policy` | `src/app/plugin/[slug]/privacy-policy/page.js` | Dynamic / SSR | Plugin compliance privacy notice | Real | No (Dynamic) |
| `/plugin/[slug]/support` | `src/app/plugin/[slug]/support/page.js` | Dynamic / SSR | Plugin customer support desk | Real | No (Dynamic) |
| `/plugin/[slug]/terms` | `src/app/plugin/[slug]/terms/page.js` | Dynamic / SSR | Plugin software license & terms | Real | No (Dynamic) |
| `/store` | `src/app/store/page.jsx` | ISR / Static | Curated developer gear, workstation hardware & affiliate catalog | Real | Yes (Work) |
| `/tools` | `src/app/tools/page.js` | Client / Dynamic | Developer utility belt (converters, generators, formatters) | Real | Yes (Lab) |
| `/play` | `src/app/play/page.js` | Client / Dynamic | Interactive experimental canvas & WebGL shaders | Real | Yes (Lab) |
| `/lounge` | `src/app/lounge/page.jsx` | Dynamic / Client | Synchronized video room lobby & WebRTC hangout | Real | Yes (Lab) |
| `/lounge/[roomId]` | `src/app/lounge/[roomId]/page.jsx` | Dynamic / Client | Realtime P2P voice, screen-share & synchronized video room | Real | No (Excluded) |
| `/space` | `src/app/space/page.jsx` | Dynamic / Client | Collaborative multiplayer whiteboard lobby | Real | Yes (Lab) |
| `/space/[roomId]`| `src/app/space/[roomId]/page.jsx` | Dynamic / Client | Live canvas room with real-time cursor sync | Real | No (Excluded) |
| `/vault` | `src/app/vault/page.js` | Static / RSC | Curated media repository (books, cinema, sound) | Real | Yes (Lab) |
| `/confession` | `src/app/confession/page.js` | Client / Dynamic | Anonymous feedback & cryptographic confessions inbox | Real | Yes (Lab) |
| `/status` | `src/app/status/page.jsx` | Dynamic / Edge | Live infrastructure health & uptime telemetry | Real | Yes (About) |
| `/contact` | `src/app/contact/page.js` | Client / Dynamic | Direct communication channel & inquiry dispatch | Real | Yes (Contact CTA) |
| `/changelog` | `src/app/changelog/page.jsx`| Static / RSC | Platform release log & development updates | Real | No (Footer) |
| `/privacy` | `src/app/privacy/page.jsx` | Static / RSC | Platform GDPR/CCPA privacy notice | Real | Yes (Footer) |
| `/terms` | `src/app/terms/page.jsx` | Static / RSC | Terms of service & intellectual property notice | Real | Yes (Footer) |
| `/bot/privacy-policy` | `src/app/bot/privacy-policy/page.jsx` | Static / RSC | Telegram live-chat bot privacy policy | Real | Yes (Footer) |
| `/offline` | `src/app/offline/page.js` | Static / PWA | Service Worker offline fallback screen | Real | No (Excluded) |
| `/studio` | `src/app/studio/[[...tool]]/page.jsx` | Dynamic / SSR | Embedded Sanity Studio CMS route | Real | No (Excluded) |
| `/site-index` | `src/app/site-index/page.js` | Static / Review | Complete route directory (R0 owner review only) | Real | No (Excluded) |

---

## 2. Inventory Summary Counts

- **Real Active Routes / Sections:** 38
- **Partial Routes:** 0
- **Stub Routes:** 0
- **Missing Expected Routes:** 0

---

## 3. Route Status Classification

1. **Real**: Fully implemented with page markup, server logic, or active component tree.
2. **Missing**: Expected in PRD/architecture specifications but lacking a physical route folder and `page.js/jsx` in `src/app/`.
3. **Excluded from Main Nav**: Dynamic rooms, PWA fallbacks, and backend CMS interfaces accessible via direct links or authenticated flows only.
