/**
 * Central Inventory of Hardware, Peripherals & Curated Developer Gear
 * Personally used and battle-tested by SK Sahinur Islam (Genious Sonu).
 *
 * Amazon Associate Tag: genioussonu-21
 * Rule: Only verified Amazon links are included. Items without links are kept empty ('')
 * so the user can easily populate them later.
 */

export const AMAZON_AFFILIATE_TAG = 'genioussonu-21';

export const GEAR_PRODUCTS = [
  // ── 01. Displays ──────────────────────────────────────────
  {
    _id: 'gear-display-main',
    name: 'Acer Nitro VG270K V2 27" 4K UHD IPS Monitor',
    category: 'Displays',
    specs: '27-inch · 4K UHD (3840 x 2160) · IPS Panel · HDR10 · 100% sRGB',
    description:
      'Primary workspace display delivering ultra-sharp typography, accurate color grading for interface design, and expansive 4K canvas for side-by-side terminal and IDE windows.',
    price: 'Check on Amazon',
    affiliateUrl: 'https://link.amazon/B04di5nGT',
    featured: true,
    showOnUsesPage: true,
    badge: 'PRIMARY DISPLAY',
    icon: 'monitor',
    cloudinaryImage: 'portfolio/store/gear-display-main',
  },
  {
    _id: 'gear-display-secondary',
    name: 'Dell S2425HSM 24" Secondary Monitor',
    category: 'Displays',
    specs: '24-inch · Full HD (1920 x 1080) · Ergonomic Height & Pivot Stand',
    description:
      'Dedicated secondary screen with versatile portrait/landscape pivot stand. Positioned vertically for real-time docker server logs, database queries, and Telegram live-chat monitoring.',
    price: 'Check on Amazon',
    affiliateUrl: 'https://link.amazon/B0eQ7xMY4',
    featured: false,
    showOnUsesPage: true,
    badge: 'SECONDARY MONITOR',
    icon: 'monitor',
    cloudinaryImage: 'portfolio/store/gear-display-secondary',
  },

  // ── 02. Core Workstation Components ──────────────────────
  {
    _id: 'gear-gpu-rtx5060',
    name: 'NVIDIA GeForce RTX 5060 (Next Gen Power)',
    category: 'Hardware',
    specs: 'Next-Gen Architecture · Ray Tracing · DLSS 4 · CUDA Acceleration',
    description:
      'High-performance dedicated graphics engine handling local AI model fine-tuning, WebGL 3D shaders (Three.js/Globe.gl), video encoding, and GPU-accelerated development workloads.',
    price: 'Check on Amazon',
    affiliateUrl: 'https://link.amazon/B01KFpqaB',
    featured: true,
    showOnUsesPage: true,
    badge: 'GPU OF CHOICE',
    icon: 'gpu',
    cloudinaryImage: 'portfolio/store/gear-gpu-rtx5060',
  },
  {
    _id: 'gear-cpu-ryzen5600x',
    name: 'AMD Ryzen 5 5600X Processor',
    category: 'Hardware',
    specs: '6 Cores · 12 Threads · Up to 4.6 GHz Boost · 35MB Cache · AM4 Socket',
    description:
      'The multi-core workhorse driving Sahinur’s engineering workstation. Delivers rapid Next.js Turbopack compilation, concurrent Docker microservices execution, and snappy OS multitasking.',
    price: 'Check on Amazon',
    affiliateUrl: 'https://link.amazon/B024XdQNe',
    featured: true,
    showOnUsesPage: true,
    badge: 'CPU WORKHORSE',
    icon: 'cpu',
  },
  {
    _id: 'gear-mobo-am4',
    name: 'AMD AM4 High-Performance Motherboard',
    category: 'Hardware',
    specs: 'AM4 Platform · PCIe 4.0 Support · Multi-M.2 Slots · Robust VRM Heatsinks',
    description:
      'Rock-solid motherboard platform providing clean power delivery, high-speed NVMe data channels, and expansion connectivity for Sahinur’s Ryzen multi-storage workstation.',
    price: 'Check on Amazon',
    affiliateUrl: 'https://link.amazon/B0apuvRvA',
    featured: false,
    showOnUsesPage: true,
    badge: 'SYSTEM BOARD',
    icon: 'motherboard',
  },
  {
    _id: 'gear-ram-corsair32gb',
    name: 'Corsair Vengeance LPX 32GB (2x16GB) 3200MHz DDR4 RAM',
    category: 'Hardware',
    specs: '32GB Dual-Channel (2 x 16GB) · 3200 MHz · Low-Profile Aluminum Heatspreader',
    description:
      'Generous high-frequency memory capacity essential for running multiple memory-intensive IDE instances, local Postgres databases, Docker containers, and dozens of browser test tabs.',
    price: 'In My Daily Rig',
    affiliateUrl: '', // Intentionally blank as requested - user will provide link later
    featured: false,
    showOnUsesPage: true,
    badge: '32GB DUAL-CHANNEL',
    icon: 'ram',
  },

  // ── 03. High-Speed & Archival Storage ─────────────────────
  {
    _id: 'gear-ssd-wdblack1tb',
    name: 'WD_BLACK 1TB NVMe High-Performance SSD',
    category: 'Storage',
    specs: '1TB M.2 2280 · PCIe Gen4 NVMe · Read speeds up to 5,150+ MB/s',
    description:
      'Primary lightning-fast system drive hosting the operating system, development source trees, package caches, and active repository working directories for instant I/O response.',
    price: 'Check on Amazon',
    affiliateUrl: 'https://link.amazon/B02Iy4ffO',
    featured: true,
    showOnUsesPage: true,
    badge: 'PRIMARY NVME DRIVE',
    icon: 'ssd',
  },
  {
    _id: 'gear-ssd-sata2tb-a',
    name: '2TB High-Capacity SATA SSD (Tier 1 Cache & Repos)',
    category: 'Storage',
    specs: '2TB 2.5" Solid State Drive · SATA III 6Gb/s · Sustained High-Throughput',
    description:
      'Dedicated secondary solid-state storage partition for hosting container persistent volumes, virtual machines, and active client project assets without loading the OS drive.',
    price: 'In My Daily Rig',
    affiliateUrl: '', // Intentionally blank as requested
    featured: false,
    showOnUsesPage: true,
    badge: '2TB SECONDARY SSD',
    icon: 'ssd',
  },
  {
    _id: 'gear-ssd-sata2tb-b',
    name: '2TB High-Capacity SATA SSD (Tier 2 Media & Staging)',
    category: 'Storage',
    specs: '2TB 2.5" Solid State Drive · SATA III 6Gb/s · High Endurance',
    description:
      'Additional 2TB SSD dedicated to staging production media, software assets, development tools ISOs, and offline build mirrors.',
    price: 'In My Daily Rig',
    affiliateUrl: '', // Intentionally blank as requested
    featured: false,
    showOnUsesPage: true,
    badge: '2TB EXTRA SSD',
    icon: 'ssd',
  },
  {
    _id: 'gear-hdd-1tb',
    name: '1TB Mechanical Hard Drive (Cold Archive & Backups)',
    category: 'Storage',
    specs: '1TB 3.5" Internal HDD · SATA 6Gb/s · Long-Term Cold Storage',
    description:
      'High-reliability rotational magnetic disk dedicated to off-line snapshots, periodic database dumps, and historical archives.',
    price: 'In My Daily Rig',
    affiliateUrl: '', // Intentionally blank as requested
    featured: false,
    showOnUsesPage: true,
    badge: 'COLD BACKUP ARCHIVE',
    icon: 'hdd',
  },

  // ── 04. Mobile & Everyday Device ─────────────────────────
  {
    _id: 'gear-device-iqoo13',
    name: 'iQOO 13 Flagship (Snapdragon 8 Gen 3)',
    category: 'Mobile',
    specs: 'Qualcomm Snapdragon 8 Gen 3 · 2K 144Hz LTPO AMOLED · Flagship NPU',
    description:
      'Sahinur’s daily handheld driver. Powers on-the-go Telegram live-chat dispatching, 2FA security authenticators, mobile PWA cross-browser debugging, and high-performance communication.',
    price: 'Daily Driver',
    affiliateUrl: '', // Intentionally blank as requested
    featured: true,
    showOnUsesPage: true,
    badge: 'DAILY DRIVER SMARTPHONE',
    icon: 'phone',
  },
];

/**
 * Returns the full curated product catalog, optionally merged with Sanity CMS items.
 */
export function getCuratedGearProducts(sanityProducts = []) {
  if (!Array.isArray(sanityProducts) || sanityProducts.length === 0) {
    return GEAR_PRODUCTS;
  }

  // Deduplicate products by name or affiliateUrl if Sanity duplicates local gear
  const sanityNames = new Set(sanityProducts.map((p) => p.name?.toLowerCase().trim()));
  const nonDuplicateLocal = GEAR_PRODUCTS.filter(
    (local) => !sanityNames.has(local.name?.toLowerCase().trim())
  );

  return [...sanityProducts, ...nonDuplicateLocal];
}

export default GEAR_PRODUCTS;
