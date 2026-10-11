# Engineering Rules & Development Guidelines

**Platform:** SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Platform  
**Target Codebase:** Next.js 16 (App Router) · React 19 · Vanilla CSS · Supabase · Sanity  
**Document Version:** 2.4.0  

---

## 1. Core Engineering Principles

1. **Zero Runtime Utility Bloat**:  
   We strictly use **Vanilla CSS** with global CSS custom properties and component-scoped CSS Modules (`*.module.css`). Do NOT install or configure TailwindCSS, styled-components, or emotion. All styles must use existing design tokens defined in `src/app/globals.css`.
2. **Server-Side Security First**:  
   Private environment variables and backend database handles (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`) must NEVER be imported or exposed in client components. Files that handle secrets must start with `import 'server-only';`.
3. **No Placeholders in Production**:  
   Never deploy placeholder text ("Lorem ipsum"), dead anchor links (`href="#"`), or broken dummy image URLs. All data structures, blog entries, and project cards must contain verified, production-accurate metadata.
4. **Performance as an Invariant**:  
   Every new route and interactive component must maintain 100 Lighthouse performance metrics. Dynamic imports (`next/dynamic` with `ssr: false`) must be used for heavy client-only 3D/canvas libraries (e.g. `Three.js`, `Globe.gl`, `HomeBlogSection`).

---

## 2. Next.js 16 & React 19 Coding Standards

### 2.1. Server vs. Client Component Boundaries

- **Default to React Server Components (RSC)**: Keep pages, layouts, and data-fetching views as Server Components by default to minimize client bundle footprint.
- **Client Components (`"use client";`)**: Restrict `"use client";` to leaf components that require:
  - Browser APIs (`window`, `localStorage`, `document`, Web Audio API).
  - React interactive state (`useState`, `useEffect`, `useRef`, `useCallback`).
  - GSAP animations and Lenis scroll subscribers.
- **Route Handlers (`src/app/api/**/route.js`)**:
  - Always export named HTTP method functions: `export async function GET(request) { ... }`, `POST`, `OPTIONS`.
  - Always validate incoming payload types and enforce character caps.
  - Return responses using `NextResponse.json(data, { status, headers })`.

### 2.2. Hooks & Event Handling Conventions

- Always wrap functions passed to effects or child components in `useCallback`.
- Clean up all event listeners, timers (`setTimeout`, `setInterval`), GSAP animation contexts (`ctx.revert()`), and WebSocket subscriptions in the effect cleanup return function.
- In Next.js 16, do NOT rely on obsolete `next/router`; use `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`).

---

## 3. CSS, Theming & Styling Rules

### 3.1. Design Token Usage Mandate

Never hardcode ad-hoc hexadecimal color codes in component styles. Always reference the centralized CSS custom properties:

- Backgrounds: `var(--void)`, `var(--graphite)`, `var(--gunmetal)`, `var(--surface)`
- Borders: `var(--border)`, `var(--border-dim)`
- Typography: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
- Brand Emerald: `var(--gold)`, `var(--gold-dim)`, `var(--gold-bright)`
- Status: `var(--green)`, `var(--amber)`, `var(--red)`, `var(--blue)`, `var(--purple)`

### 3.2. Responsive Design Standards

- Avoid fixed pixel widths (`width: 500px`). Use relative units (`%`, `rem`, `clamp()`, `min()`, `max()`).
- All media and interactive canvas elements must maintain explicit aspect ratios or height limits to guarantee `CLS = 0.000`.
- Mobile navigation overlays and popups must lock background body scrolling using `useScrollLock(isOpen)` or the centralized `OverlayContext`.

---

## 4. Animation & Interaction Guardrails

### 4.1. GSAP & ScrollTrigger Best Practices

- Always wrap GSAP timeline and ScrollTrigger declarations inside `gsap.context(() => { ... })` and call `ctx.revert()` in the component unmount cleanup.
- Consolidate individual triggers using `ScrollTrigger.batch()` for repeating elements (e.g., rack separators, project cards, grid items) to prevent scroll performance bottlenecks.
- Never animate non-GPU properties like `width`, `height`, `top`, or `left` during high-frequency scroll events. Animate only GPU-accelerated transforms: `x`, `y`, `scale`, `rotation`, and `opacity`.

### 4.2. Accessibility & Reduced Motion

- All animation controllers must query `window.matchMedia('(prefers-reduced-motion: reduce)')`. If matched, set animation durations to `0` or bypass transitions entirely.
- Ensure all interactive elements (`<button>`, `<a>`, `<input>`) have discernible accessible names, `aria-label` attributes where text is omitted, and visible `:focus-visible` outline rings.

---

## 5. Security & Data Protection Guidelines

### 5.1. API Route Hardening

- **Rate Limiting**: All public POST endpoints (`/api/contact`, `/api/chatbot`, `/api/live-chat/send`) must enforce IP rate limiting using Supabase rate-limit tables with in-memory fallback.
- **CSRF & Origin Verification**: Verify `request.headers.get('origin')` matches `https://genioussonu.me` or `localhost` in local development.
- **Bot Deterrence**: Enforce Cloudflare Turnstile verification or hidden honeypot field checks on contact forms.
- **MIME & Headers**: Maintain strict security headers via `next.config.mjs` (`X-Frame-Options`, `Content-Security-Policy`, `Cache-Control`).

### 5.2. Database & Storage Rules

- Use Supabase **Row-Level Security (RLS)** on all public tables.
- Use `supabaseClient.js` (with public anon key) for client-side reads with RLS.
- Use `supabaseServer.js` (with service role key) STRICTLY on the server inside route handlers for privileged updates and admin actions.
- Firestore rules must enforce strict schema type checks, string length caps, and authenticated user identity (`request.auth.uid == uid`).

---

## 6. Git, Build & Deployment Standards

### 6.1. Commit Conventions

Follow Conventional Commits:

- `feat: add WebRTC screen share support in Lounge`
- `fix: resolve ViewTransitions abort error in soft navigation`
- `perf: optimize Globe.gl WebGL bundle size with dynamic import`
- `docs: update system architecture and request flow diagrams`
- `style: refine emerald gradient highlights on experience cards`

### 6.2. Production Build Verification

Before deploying to production or merging pull requests:

1. `npm run dev` — verify that development server runs without console errors or hydration mismatches.
2. `node scripts/update-sw-version.mjs` — ensure Service Worker cache version is incremented.
3. `npm run build` — ensure compilation succeeds with zero webpack/turbopack errors.
4. Verify PWA service worker registration and manifest validity.
