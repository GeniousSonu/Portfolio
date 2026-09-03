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

export default nextConfig;
