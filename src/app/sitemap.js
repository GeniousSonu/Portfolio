import { client } from '@/sanity/client';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap() {
  const baseUrl = 'https://genioussonu.me';

  // Base static routes with proper priorities and change frequencies
  const routes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/bot/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Sanity Blog Post routes
  try {
    const posts = await client.fetch(
      `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] {
        "slug": slug.current,
        _updatedAt,
        publishedAt
      }`
    );

    if (Array.isArray(posts)) {
      posts.forEach((post) => {
        if (post?.slug) {
          routes.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(post.publishedAt || Date.now()),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic sitemap posts from Sanity:', error);
  }

  return routes;
}
