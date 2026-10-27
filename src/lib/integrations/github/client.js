import { PROJECTS } from '../../../data/projects.js';
import { classifyProject } from '../../../config/projectTaxonomy.js';

const GITHUB_API_URL = 'https://api.github.com/users/GeniousSonu/repos?per_page=100&sort=updated';

/**
 * Normalizes a raw GitHub repository item into the project portfolio schema.
 */
export function normalizeGitHubRepo(repo) {
  return {
    slug: repo.name.toLowerCase(),
    title: repo.name.replace(/[-_]/g, ' '),
    category: `Open Source · ${repo.language || 'Software'}`,
    dotColor: '#60A5FA',
    desc: repo.description || 'Public engineering repository and open-source system implementation.',
    stack: [repo.language, ...(repo.topics || [])].filter(Boolean),
    metrics: [
      { val: String(repo.stargazers_count ?? 0), label: 'Stars' },
      { val: String(repo.forks_count ?? 0), label: 'Forks' },
      { val: repo.license?.spdx_id || 'MIT', label: 'License' },
    ],
    link: repo.html_url,
    btnType: 'github',
    btnText: 'View on GitHub',
    stars: repo.stargazers_count || 0,
    isFork: repo.fork,
    isArchived: repo.archived,
  };
}

/**
 * Fetches and merges GitHub repositories with curated projects.
 * Guaranteed to return offline seed projects if GitHub is unreachable or rate-limited.
 */
export async function getUnifiedProjects() {
  const curated = PROJECTS.map((proj) => ({
    ...proj,
    categories: classifyProject(proj),
    isCurated: true,
  }));

  try {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Engine-Next16',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(GITHUB_API_URL, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return curated;
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) {
      return curated;
    }

    const curatedSlugs = new Set(curated.map((p) => p.slug.toLowerCase()));

    // Filter out forks, archived repos, and existing curated projects unless notable
    const publicRepos = repos
      .filter((r) => !r.fork && !r.archived && !curatedSlugs.has(r.name.toLowerCase()))
      .slice(0, 12)
      .map(normalizeGitHubRepo)
      .map((proj) => ({
        ...proj,
        categories: classifyProject(proj),
        isCurated: false,
      }));

    return [...curated, ...publicRepos];
  } catch {
    // Offline resilience fallback
    return curated;
  }
}
