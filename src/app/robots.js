export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/', '/space'],
    },
    sitemap: 'https://genioussonu.me/sitemap.xml',
  };
}
