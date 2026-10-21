/**
 * WordPress.org Plugin Directory API Integration
 *
 * Fetches real-time plugin metadata from api.wordpress.org with Next.js ISR (1-hour revalidation).
 * Falls back gracefully to static configuration if the API is unreachable or returns 404.
 */

export async function getWordPressOrgPluginData(slug = 'genioussonu-site-checkup') {
  try {
    const url = `https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&request%5Bslug%5D=${encodeURIComponent(
      slug
    )}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every 1 hour (3600 seconds)
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    // Check if plugin is not found or error occurred
    if (!data || data.error || !data.version) {
      return null;
    }

    // Format last updated date nicely
    let formattedDate = null;
    if (data.last_updated) {
      try {
        const d = new Date(data.last_updated);
        formattedDate = d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        formattedDate = data.last_updated;
      }
    }

    return {
      name: data.name,
      slug: data.slug,
      version: data.version,
      author: data.author,
      requiresWp: data.requires,
      testedUpTo: data.tested,
      requiresPhp: data.requires_php,
      rating: typeof data.rating === 'number' ? (data.rating / 20).toFixed(1) : null,
      numRatings: data.num_ratings || 0,
      activeInstalls:
        typeof data.active_installs === 'number'
          ? data.active_installs > 0
            ? `${data.active_installs.toLocaleString()}+`
            : 'Active'
          : null,
      lastUpdated: formattedDate,
      downloadUrl: data.download_link,
      wordpressOrgUrl: `https://wordpress.org/plugins/${data.slug}/`,
      changelogHtml: data.sections?.changelog || null,
      descriptionHtml: data.sections?.description || null,
      raw: data,
    };
  } catch (err) {
    // Fail safely: never crash page on network or API failures
    console.warn(`[WordPress.org API] Fetch failed for ${slug}:`, err.message);
    return null;
  }
}
