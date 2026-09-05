<div align="center">

<br />

<!-- Logo -->
<img src="public/logo.svg" alt="SK Sahinur Islam Logo" width="120" />

<br />
<br />

# SK Sahinur Islam — Official Portfolio

### Senior Web Application Developer · Co-Founder · IT Engineer · IoT Patent Holder

<br />

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-genioussonu.me-10B981?style=for-the-badge&labelColor=050505)](https://genioussonu.me)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sksahinurislam/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/GeniousSonu)
[![Upwork](https://img.shields.io/badge/Upwork-Hire%20Me-14A800?style=for-the-badge&logo=upwork&logoColor=white)](https://www.upwork.com/freelancers/~0104912246c7c7bdbf)

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=000)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity_CMS-F03E2F?style=flat-square&logo=sanity&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=flat-square&logo=greensock&logoColor=000)
![Lenis](https://img.shields.io/badge/Lenis_Scroll-000000?style=flat-square)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Resend](https://img.shields.io/badge/Resend_Email-000000?style=flat-square&logo=resend&logoColor=white)

</div>

---

## 📌 Overview

Production web portfolio and technical knowledge hub engineered by **SK Sahinur Islam (Genious Sonu)**. The platform showcases production full-stack systems, architectural case studies, client platforms, and an embedded headless CMS blog.

### Key Highlights:
- 🛠️ **Current Role**: Senior Web Application Developer at **Ib Arts** (Jul 2026 – Present), building scalable backend architecture, distributed systems, and cloud infrastructure.
- 🚀 **Entrepreneurship**: Co-Founder at **WEFIK** (Mar 2021 – Present), directing end-to-end technical delivery for 30+ international web and mobile applications.
- 📜 **Granted Patent**: Solar-Powered IoT Vaccine Preservation System with real-time MQTT telemetry (Patent No. 202531060002 A).
- 🎓 **Credentials**: 30+ professional certifications across CompTIA A+, TryHackMe, Coursera (IBM, Duke, UC Irvine), and LinkedIn Learning.

---

## ⚡ Core Architecture & Features

- **Next.js 16 & React 19 (App Router)**: Hybrid static generation (SSG) with on-demand Incremental Static Regeneration (ISR) and optimized server endpoints.
- **Cinematic Motion & Smooth Scroll**:
  - Desktop smooth scrolling powered by **Lenis** (`lerp: 0.1`) frame-synced with **GSAP ScrollTrigger's** ticker.
  - Native hardware-accelerated kinetic scrolling on mobile and touch devices.
  - Pinned card-stacking timeline in the Experience section and batched entrance reveals.
- **Embedded Sanity Studio (`/studio`)**: Headless CMS powered by `next-sanity`, featuring dynamic schema modeling, custom block decorators, and real-time content management.
- **Interactive 3D WebGL Globe**: Real-time rendering via Three.js and Globe.gl mapping active international client engagements and infrastructure nodes.
- **Server-Side Email Integration**: Direct contact API powered by **Resend** with input sanitization, rate-limiting, and delivery alerts.
- **Progressive Web App (PWA)**: Service worker asset caching, offline support, install prompts, and automatic background cache updates.
- **Semantic SEO & Machine Discovery**: Schema.org JSON-LD graph (`Person`, `WebSite`, `Occupation`, `Patent`), automated XML sitemap, `robots.txt`, and standardized `llms.txt` / `ai.txt` endpoints for LLM search indexing.
- **Zero Cloud Vendor Lock-in**: Clean, framework-native deployment on **Vercel** with optimized HTTP headers for cache immutability and font delivery.

---

## 🛠️ Technology Stack

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Hybrid rendering, server routes, image optimization |
| **UI Model** | React 19 | Declarative state, modern hooks, server components |
| **Styling** | Vanilla CSS + Design Tokens | Custom theme variables, responsive grid, zero utility overhead |
| **Smooth Scroll** | Lenis | Hardware-calibrated desktop smooth scroll |
| **Animation Engine**| GSAP 3 (ScrollTrigger, TextPlugin) | Responsive card pinning, stagger reveals, magnetic buttons |
| **3D Graphics** | Three.js & Globe.gl | Interactive WebGL globe visualization |
| **Content Management** | Sanity.io (v3 Embedded Studio) | Headless blog, category taxonomy, and author management |
| **Database** | Supabase (PostgreSQL) | Structured persistence and relational storage |
| **Email Delivery** | Resend | Transactional contact form dispatch |
| **Deployment** | Vercel Edge Platform | Global CDN distribution and edge compute |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18.18+ or 20+
- npm 9+

### Setup Instructions

```bash
# 1. Clone repository
git clone https://github.com/GeniousSonu/Portfolio.git
cd Portfolio

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Sanity, Resend, and Supabase credentials

# 4. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Build & Production Verification

```bash
# Compile and build the production bundle
npm run build

# Start production server
npm run start
```

---

## 📄 License

MIT License — Copyright (c) 2026 SK Sahinur Islam.
