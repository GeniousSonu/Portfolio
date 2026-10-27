export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All Disciplines', countKey: 'all' },
  { id: 'iot', label: 'IoT & Systems', tagMatch: ['iot', 'hardware', 'esp8266', 'nodemcu', 'mqtt', 'c++'] },
  { id: 'web', label: 'Full-Stack & Cloud', tagMatch: ['react', 'next.js', 'node.js', 'gatsby', 'graphql', 'mongodb'] },
  { id: 'wordpress', label: 'WordPress & Security', tagMatch: ['wordpress', 'php', 'security', 'plugin'] },
  { id: 'aiml', label: 'AI & Machine Learning', tagMatch: ['ai/ml', 'python', 'scikit-learn', 'openai', 'fastapi'] },
  { id: 'devtools', label: 'Developer Tools', tagMatch: ['chrome-extension', 'extension', 'ci/cd', 'tools'] },
];

/**
 * Classifies a project into one or more canonical taxonomy categories.
 * @param {object} project
 * @returns {string[]} category IDs
 */
export function classifyProject(project) {
  const matched = new Set(['all']);
  const categoryLower = (project.category || '').toLowerCase();
  const stackLower = (project.stack || []).map((s) => s.toLowerCase());
  const descLower = (project.desc || '').toLowerCase();

  for (const cat of PROJECT_CATEGORIES) {
    if (cat.id === 'all') continue;
    const hasTagMatch = cat.tagMatch?.some(
      (tag) =>
        categoryLower.includes(tag) ||
        stackLower.some((s) => s.includes(tag)) ||
        descLower.includes(tag)
    );
    if (hasTagMatch) {
      matched.add(cat.id);
    }
  }

  return Array.from(matched);
}
