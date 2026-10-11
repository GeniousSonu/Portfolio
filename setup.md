# SK Sahinur Islam (Genious Sonu) — Complete Engineering Setup & Gear Inventory

**Owner:** SK Sahinur Islam (Senior Web Application Developer · Co-Founder · IT Engineer)  
**Amazon Associate Tracking ID:** `genioussonu-21`  
**Location:** Kolkata, West Bengal, India  
**Last Updated:** October 2026  

---

## 1. Executive Summary of Workspace Architecture

This document serves as the master catalog and architectural inventory of the hardware, peripherals, dual-monitor workstation, storage hierarchy, and developer tooling utilized daily by **SK Sahinur Islam**.

Every piece of equipment is chosen for maximum engineering throughput: rapid compilation, local containerized microservices orchestration, multi-turn AI inference testing, and high-frequency real-time communications.

---

## 2. Workstation PC Hardware Specifications

| Component | Hardware Specification & Model | Role in Engineering Workflow | Amazon Affiliate Link |
| :--- | :--- | :--- | :--- |
| **Processor (CPU)** | **AMD Ryzen 5 5600X** — 6 Cores, 12 Threads, 4.6 GHz Boost, 35MB Cache | High-speed code compilation, Next.js Turbopack dev server, parallel linting, and Docker container task scheduling. | [Buy on Amazon](https://link.amazon/B024XdQNe) |
| **Graphics Card (GPU)** | **NVIDIA GeForce RTX 5060 (Next Gen Power)** — Ray Tracing, DLSS 4, Tensor Cores, CUDA Acceleration | WebGL 3D rendering (Three.js & Globe.gl), local neural net acceleration, multi-monitor 4K driving, video encoding. | [Buy on Amazon](https://link.amazon/B01KFpqaB) |
| **Motherboard** | **AMD AM4 High-Performance Platform** — PCIe 4.0, Multi-M.2 NVMe Slots, Reinforced VRM Heatsinks | Ultra-stable motherboard power delivery and high-bandwidth interconnects across dual monitors and 4 separate storage drives. | [Buy on Amazon](https://link.amazon/B0apuvRvA) |
| **System Memory (RAM)** | **Corsair Vengeance LPX 32GB (2x16GB) 3200MHz DDR4** — Dual-Channel, Low-Profile Aluminum Heatspreader | Ample memory overhead for multiple concurrent VS Code windows, local PostgreSQL/Redis databases, and heavy browser testing. | *[Pending Link — Keep Blank]* |
| **Primary OS / Dev NVMe SSD** | **WD_BLACK 1TB High-Performance NVMe SSD** — PCIe Gen4 x4, M.2 2280 (5,150+ MB/s Read Speeds) | Dedicated OS drive hosting root Linux/Windows systems, `node_modules` caches, active git repos, and instant system boot. | [Buy on Amazon](https://link.amazon/B02Iy4ffO) |
| **Secondary SSD Tier 1** | **2TB SATA SSD (High Endurance)** — 2.5" Solid State Drive, SATA III 6Gb/s | High-capacity fast drive partition for Docker volumes, container images, local package mirrors, and virtual machine disks. | *[Pending Link — Keep Blank]* |
| **Secondary SSD Tier 2** | **2TB SATA SSD (Media & Staging)** — 2.5" Solid State Drive, SATA III 6Gb/s | Dedicated staging disk for high-resolution project assets, client deliverables, software ISOs, and development tools cache. | *[Pending Link — Keep Blank]* |
| **Cold Archival Drive (HDD)** | **1TB High-Reliability Internal Mechanical HDD** — 3.5" Form Factor, 64MB Cache, SATA 6Gb/s | Long-term backup repository for cold database dumps, historical software archives, and encrypted vault snapshots. | *[Pending Link — Keep Blank]* |

---

## 3. Dual-Display Visual Command Center

| Display Screen | Model & Specifications | Layout & Daily Function | Amazon Affiliate Link |
| :--- | :--- | :--- | :--- |
| **Main Display (Center)** | **Acer Nitro VG270K V2 27" 4K UHD IPS Monitor** — 3840 x 2160, 100% sRGB, HDR10, Ultra-Thin ZeroFrame | Primary visual canvas for code editing, UI architecture design, browser inspection, and pixel-precise color verification. | [Buy on Amazon](https://link.amazon/B04di5nGT) |
| **Secondary Display (Side)** | **Dell S2425HSM 24" Full HD Monitor** — 1920 x 1080, Ergonomic Height & Pivot Adjustable Stand | Dedicated vertical/side monitor displaying continuous terminal output, server log streams, Telegram live chat, and Slack channels. | [Buy on Amazon](https://link.amazon/B0eQ7xMY4) |

---

## 4. Mobile & Testing Device

| Device Type | Model & Specifications | Strategic Role | Amazon Affiliate Link |
| :--- | :--- | :--- | :--- |
| **Primary Smartphone** | **iQOO 13 Flagship** — Qualcomm Snapdragon 8 Gen 3 SoC, 2K 144Hz LTPO AMOLED, Ultra-Fast NPU | Everyday communication device powering bi-directional Telegram live chat notifications, mobile 2FA tokens, and mobile web audit. | *[Pending Link — Keep Blank]* |

---

## 5. Storage Hierarchy & Partition Strategy

```text
Total Usable Workstation Storage: 6 TB across 4 Physical Drives

┌────────────────────────────────────────────────────────────────────────┐
│ [Drive 1: 1TB WD_BLACK NVMe PCIe Gen4 SSD]                             │
│ ├─ Operating System (Windows / Linux dual environment)                 │
│ ├─ Active Project Workspace (~/Projects/Portfolio, ~/Projects/WEFIK)   │
│ └─ Global pnpm / npm cache and high-frequency Node runtime libraries   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│ [Drive 2: 2TB High-Speed SATA SSD #1]                                  │
│ ├─ Docker Desktop / Podman container volumes & images                  │
│ └─ Local PostgreSQL & MongoDB database persistent storage              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│ [Drive 3: 2TB High-Speed SATA SSD #2]                                  │
│ ├─ Client media archives, design assets, video recording scratchpad   │
│ └─ Virtual Machine images (Ubuntu Server, Kali Linux testing box)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│ [Drive 4: 1TB Internal 3.5" Mechanical HDD]                            │
│ ├─ Cold off-site backup mirrors & automated Borg / Restic snapshots    │
│ └─ Legacy archives, deep cold storage, and encrypted vault copies      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Master Amazon Affiliate Inventory Table

> **Associate Tracking ID:** `genioussonu-21`  
> *Note:* Only verified Amazon links are listed. Where no link currently exists, the field is left blank with `[Pending Link]` so it can be populated without adding vague or broken URLs.

| # | Item Name | Category | Status | Amazon Affiliate URL (`genioussonu-21`) |
| :-: | :--- | :--- | :-: | :--- |
| **01** | Motherboard: AMD AM4 High-Performance Board | Hardware | **Active** | `https://link.amazon/B0apuvRvA` |
| **02** | GPU: NVIDIA GeForce RTX 5060 (Next Gen Power) | Hardware | **Active** | `https://link.amazon/B01KFpqaB` |
| **03** | CPU: AMD Ryzen 5 5600X (6-Core, 12-Thread) | Hardware | **Active** | `https://link.amazon/B024XdQNe` |
| **04** | Primary SSD: WD_BLACK 1TB NVMe Gen4 M.2 SSD | Storage | **Active** | `https://link.amazon/B02Iy4ffO` |
| **05** | Secondary Monitor: Dell S2425HSM 24" FHD Monitor | Displays | **Active** | `https://link.amazon/B0eQ7xMY4` |
| **06** | Main Monitor: Acer Nitro VG270K V2 27" 4K UHD | Displays | **Active** | `https://link.amazon/B04di5nGT` |
| **07** | RAM: Corsair Vengeance 32GB (2x16GB) 3200MHz DDR4 | Hardware | *Pending* | `[Pending Link — Keep Blank]` |
| **08** | Storage: 2TB SATA SSD (Cache & Containers) | Storage | *Pending* | `[Pending Link — Keep Blank]` |
| **09** | Storage: 2TB SATA SSD (Media & Staging) | Storage | *Pending* | `[Pending Link — Keep Blank]` |
| **10** | Storage: 1TB Internal Mechanical HDD (Cold Backup) | Storage | *Pending* | `[Pending Link — Keep Blank]` |
| **11** | Device: iQOO 13 Flagship (Snapdragon 8 Gen 3) | Mobile | *Pending* | `[Pending Link — Keep Blank]` |
| **12** | Keyboard: Custom Mechanical Keyboard (Tactile) | Peripherals | *Pending* | `[Pending Link — Keep Blank]` |
| **13** | Mouse: High-Precision Ergonomic Wireless Mouse | Peripherals | *Pending* | `[Pending Link — Keep Blank]` |
| **14** | Audio: Studio ANC Headphones & Sound Setup | Audio | *Pending* | `[Pending Link — Keep Blank]` |
| **15** | Desk & Chair: Ergonomic Desk Setup | Furniture | *Pending* | `[Pending Link — Keep Blank]` |

---

## 7. Developer Toolchain & Software Stack

### 7.1. Code Editors & Typography

- **Primary Editor**: Visual Studio Code (Custom dark cyber theme, customized status bars, zero-distraction layout).
- **Typefaces**: Geist Mono & JetBrains Mono with programming ligatures enabled.
- **Key Extensions**: ESLint, Prettier, Error Lens, GitLens, Docker, REST Client, Tailwind/Vanilla CSS tooling.

### 7.2. Terminal & Shell Environment

- **Terminals**: Warp Terminal & Alacritty (GPU-accelerated rendering).
- **Shell**: Zsh running Starship prompt, `fzf` fuzzy completion, `zoxide` directory jumping, and `zsh-autosuggestions`.
- **System Administration**: OpenSSH with ED25519 hardware-backed keys, `htop`, `tmux`, and `rsync`.

### 7.3. Daily Engineering Workflow

- **Database GUIs**: Beekeeper Studio & TablePlus for PostgreSQL / MySQL / Supabase querying.
- **API Development**: Postman, Thunder Client, and curl scripts with automated JSON pretty-printing.
- **Design & Prototyping**: Figma for design tokens, SVG vector preparation, and UI layout drafts.
- **Knowledge & Documentation**: Obsidian (Local-first Markdown notes) and Git-backed repositories.

### 7.4. Cloud & Media Infrastructure

- **Global Media CDN**: Cloudinary (`uvflwz6x`) for dynamic WebP/AVIF transformation (`f_auto,q_auto`), responsive breakpoint delivery, and image hosting.
- **Backend & Database Cloud**: Supabase (PostgreSQL with RLS) & Firebase Firestore (real-time channels & room signaling).
- **Headless Content Platform**: Sanity.io Studio v3 with GROQ content lake.
- **Transactional Communication**: Resend API & Telegram Bot Gateway.
