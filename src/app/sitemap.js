import { client } from '@/sanity/client';
import { PLUGIN_CONFIG } from '@/config/plugin';
import { DOCS_TOPICS } from '@/data/pluginDocs';
import { KURACODE_FACTS } from '@/data/kuracode/facts';

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
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lounge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/architecture`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/uses`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/status`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
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
    // WordPress Plugin Showcase Routes
    {
      url: `${baseUrl}/plugin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...DOCS_TOPICS.map((topic) => ({
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}/docs/${topic.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/plugin/${PLUGIN_CONFIG.slug}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // KuraCode Product Section (Delta D2: Only included when indexable: true and zero unresolved placeholders)
  if (KURACODE_FACTS.indexable) {
    routes.push(
      { url: `${baseUrl}/extensions`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/extensions/kuracode`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/extensions/kuracode/install`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/extensions/kuracode/docs`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/extensions/kuracode/faq`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/extensions/kuracode/roadmap`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/extensions/kuracode/changelog`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/extensions/kuracode/support`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/extensions/kuracode/privacy`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/terms`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/permissions`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/data`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/security`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/licenses`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/accessibility`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/cookies`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${baseUrl}/extensions/kuracode/brand`, lastModified: new Date(KURACODE_FACTS.lastUpdated), changeFrequency: 'monthly', priority: 0.5 }
    );
  }

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
