export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/studio-login', '/api/'],
    },
    sitemap: 'https://genioussonu.me/sitemap.xml',
  };
}
