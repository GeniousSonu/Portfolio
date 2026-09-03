import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
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
