import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16 uses Turbopack by default; the PWA plugin injects a webpack
  // config for service-worker generation. An empty turbopack key tells Next
  // that the webpack config (from next-pwa) is intentional.
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // Transpile packages that expose TS development source in node_modules
  transpilePackages: ['@sanity/workbench', '@sanity/sdk-react', 'sanity', '@sanity/vision'],

  // Required for Sanity Studio embedded at /studio
  async headers() {
    return [
      {
        // Allow Sanity Studio to load resources from its CDN
        source: '/studio/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
};

export default withPWA(nextConfig);
