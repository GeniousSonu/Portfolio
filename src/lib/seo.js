/**
 * Unified SEO & Open Graph Metadata Helper
 *
 * Enforces production-grade meta tags, canonical URL assignment, and Open Graph objects.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genioussonu.me';

/**
 * Builds standard Next.js Metadata object
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Compelling meta description
 * @param {string} [options.path=''] - Route pathname (e.g. '/about', '/architecture')
 * @param {string} [options.ogImage] - Custom Open Graph image URL
 * @param {boolean} [options.noIndex=false] - If true, tags page with noindex, nofollow
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
  title,
  description,
  path = '',
  ogImage = '/api/og',
  noIndex = false,
}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${BASE_URL}${cleanPath === '/' ? '' : cleanPath}`;
  const fullTitle = title.includes('SK Sahinur Islam') ? title : `${title} | SK Sahinur Islam`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'SK Sahinur Islam — Official Portfolio',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@GeniousSonu',
      images: [ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`],
    },
  };
}
