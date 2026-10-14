# Data Inventory & Processor Registry

**Project:** SK Sahinur Islam (Genious Sonu) — Engineering Platform  
**Document Version:** 1.0.0 · **Date:** 2026-10-14  
**Governing Regulation:** Digital Personal Data Protection Act 2023 (India), GDPR (EU), CCPA/CPRA (California)  
**Maintenance Mandate:** Updated upon introduction of any new third-party sub-processor or data ingestion pipeline. Verified via `npm run check:processors`.

---

## 1. Principles of Data Processing

1. **Data Minimization:** No personally identifiable information (PII) is captured without explicit user intent or consent.
2. **Zero Commercial Sale:** Personal data is never rented, monetized, traded, or sold to third-party data brokers or advertisers.
3. **Consent-Gated Telemetry:** Analytics tracking is completely suppressed until explicit user opt-in via Google Consent Mode v2.
4. **Transparent Retention:** Ephemeral sessions and live chat messages are automatically purged after defined expiration windows.

---

## 2. Comprehensive Sub-Processor Registry

The following third-party infrastructure entities and service providers process personal or technical data on behalf of the operator:

| Processor Name | Legal Entity & Location | Processing Purpose | Data Categories | Transfer Safeguards | Retention Period |
|---|---|---|---|---|---|
| **Vercel** | Vercel Inc., Walnut, CA, USA | Global edge hosting, serverless execution, CDN caching, and Core Web Vitals telemetry | IP addresses, request headers, user agent, performance metrics | Standard Contractual Clauses (SCCs), DPA | Server logs retained up to 30 days |
| **Supabase** | Supabase Pte. Ltd., Singapore / USA | Relational PostgreSQL database, auth state, and room metadata | Pseudonymous room IDs, message payload metadata | TLS 1.3 in-transit, AES-256 at-rest, SCCs | Retained until manually deleted or room expires (max 90 days) |
| **Firebase** | Google LLC, Mountain View, CA, USA | Firestore realtime presence, connection counters, and synchronization | Anonymous session identifiers, presence timestamps | ISO/IEC 27001, SOC 2, SCCs | Purged upon session termination |
| **Sanity** | Sanity AS, Oslo, Norway (EEA) | Headless Content Management System (articles, projects, media metadata) | Public author profiles, blog content | EEA GDPR native protections | Indefinite for published static content |
| **Cloudinary** | Cloudinary Ltd., Sunnyvale, CA, USA | Image optimization, CDN transformation, and asset delivery | Anonymous IP for asset delivery requests, cached media | SOC 2 Type II, ISO 27001 | Cached for CDN efficiency up to 365 days |
| **Resend** | Resend Inc., San Francisco, CA, USA | Transactional email delivery from contact form submissions | Sender name, sender email, message body, IP | TLS encryption, SOC 2 | Up to 30 days for delivery diagnostics |
| **Telegram** | Telegram Messenger Inc., Dubai, UAE / Global | Optional developer alert dispatch and real-time live chat relay | User submitted message text, contact handle | TLS in-transit | 30 days or manual room clearance |
| **Google Gemini** | Google LLC, Mountain View, CA, USA | AI chatbot inference and interactive assistant summaries | Ephemeral user prompts submitted to chatbot | Google Cloud AI Enterprise Terms, no model training | Ephemeral (zero persistent storage on server) |
| **Google Analytics** | Google LLC, Mountain View, CA, USA | Audience metrics (consent-gated via Google Consent Mode v2) | Pseudonymous client ID, pageviews, session duration, referrers | Standard Contractual Clauses (SCCs), IP anonymization | 14 months (Google default) |
| **Spotify** | Spotify AB, Stockholm, Sweden | Interactive audio lounge preview player embeds | Anonymous player interaction events | EU GDPR native protections | Managed per Spotify Privacy Policy |
| **YouTube** | YouTube LLC (Google LLC), San Bruno, CA, USA | Video embeds and Lounge media player streaming | Streaming requests, user agent, IP | Standard Contractual Clauses | Managed per Google Privacy Policy |
| **GitHub** | GitHub Inc. (Microsoft Corp.), San Francisco, CA, USA | Public repository commit history, showcase feeds, star counts | Public developer profile info, Git commit history | ISO 27001, SOC 1/2, SCCs | Public immutable ledger |

---

## 3. Data Ingestion & Storage Architecture

### A. Contact Form & Communications
- **Endpoint:** `/api/contact`
- **Fields Collected:** Name, email, message body.
- **Processing Flow:** Validated with Zod, sanitized against injection, dispatched via Resend to the operator's private inbox.
- **Retention:** Emails retained in operator inbox for active correspondence; transit logs deleted after 30 days.

### B. Live Chat & Lounge Space
- **Endpoints:** `/api/live-chat`, `/api/space`
- **Fields Collected:** Ephemeral nickname, temporary room ID, real-time message stream.
- **Processing Flow:** Relayed in real time via Supabase / Firebase with auto-pruning.
- **Retention:** Transcripts automatically flushed upon session termination or after 24 hours of inactivity.

### C. Analytics & Cookies
- **Protocol:** Google Consent Mode v2 (`analytics_storage: 'denied'` by default).
- **Activation:** Activated strictly after user clicks "Accept" in the consent banner.
- **Revocation:** Instantly revocable at any time via the "Cookie Settings" button in the footer or Privacy Policy page.

---

## 4. Legal Assessment & Compliance Checklist

- [x] All processors disclosed with legal entity names and locations.
- [x] Zero home or personal street address disclosures (Operator protected under Decision D-02).
- [x] Explicit legal bases cited under Indian DPDP Act 2023 Section 4 & GDPR Article 6.
- [x] Opt-out and cookie revocation mechanisms validated without page reload.
- [x] Automated CI processor coverage verification enabled.
