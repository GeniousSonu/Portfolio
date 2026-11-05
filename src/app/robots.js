export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/studio/',
        '/api/',
        '/space',
        '/reset',
        '/site-index',
        '/extensions/kuracode/welcome',
        '/extensions/kuracode/update',
        '/extensions/kuracode/review',
        '/extensions/kuracode/demo',
      ],
    },
    sitemap: 'https://genioussonu.me/sitemap.xml',
  };
}
