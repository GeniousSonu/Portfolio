/**
 * Central JSON-LD Structured Data Graph Generator (Task SEO-PRESENCE-001)
 *
 * Directives & Rules:
 * - Fixed facts: SK Sahinur Islam (Genious Sonu) is a Full-Stack Developer, Network Engineer,
 *   Backend Specialist, Systems Administrator, and Cyber Security Enthusiast.
 * - He is strictly NOT a designer (no markup or text may describe him as one).
 * - Zero fake ratings, reviews, or awards.
 */

export const BASE_URL = 'https://genioussonu.me';

export function getPersonEntity() {
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/#person`,
    name: 'SK Sahinur Islam',
    alternateName: [
      'Genious Sonu',
      'Sonu',
      'Sahinur Islam',
      'Sahinur',
      'GeniousSonu',
      'SK Sahinur',
    ],
    url: BASE_URL,
    image: `${BASE_URL}/icon-512.png`,
    email: 'mailto:sahinurislamm2002@gmail.com',
    jobTitle: 'Senior Web Application Developer & Network Engineer',
    description:
      'Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, Systems Administrator, and IoT Patent Holder.',
    worksFor: [
      {
        '@type': 'Organization',
        name: 'Ib Arts',
        role: 'Senior Web Application Developer',
        startDate: '2026-07',
      },
      {
        '@type': 'Organization',
        name: 'WEFIK',
        role: 'Co-Founder',
        startDate: '2021-03',
      },
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Guru Nanak Institute of Technology, Kolkata',
      sameAs: 'https://www.gnit.ac.in/',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://github.com/GeniousSonu',
      'https://profiles.wordpress.org/genioussonu/',
      'https://www.linkedin.com/in/sksahinurislam/',
      'https://x.com/GeniousSonu',
      'https://twitter.com/GeniousSonu',
      'https://instagram.com/genious.exe',
      'https://www.youtube.com/@GeniousSonu',
      'https://www.upwork.com/freelancers/~0104912246c7c7bdbf',
      'https://linktr.ee/sksahinurislam',
      'https://tryhackme.com/p/mrbettle',
    ],
    knowsAbout: [
      'Full Stack Development',
      'Backend Architecture',
      'Network Engineering',
      'Linux Server Administration',
      'Cyber Security & Penetration Testing',
      'WordPress Plugin Development',
      'Distributed Systems & Cloud Architecture',
      'IoT Systems & Cold-Chain Monitoring',
      'React',
      'Next.js',
      'Node.js',
      'Express',
      'MongoDB',
      'MySQL',
      'PostgreSQL',
      'Docker',
      'Python',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Indian Patent No. 544062 (IoT Real-Time Vaccine Storage Monitoring)',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'CompTIA A+',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'TryHackMe Pre Security Certification',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'CoCubes Certified Coding & Aptitude',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'IBM Machine Learning with Python (Honors)',
      },
    ],
  };
}

export function getWebSiteEntity() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    alternateName: 'Genious Sonu Portfolio',
    publisher: {
      '@id': `${BASE_URL}/#person`,
    },
    inLanguage: 'en-US',
  };
}

export function getProfilePageEntity() {
  return {
    '@type': 'ProfilePage',
    '@id': `${BASE_URL}/#profilepage`,
    url: BASE_URL,
    name: 'SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Resume',
    mainEntity: {
      '@id': `${BASE_URL}/#person`,
    },
  };
}

export function getOrganizationEntity() {
  return {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#wefik`,
    name: 'WEFIK',
    url: `${BASE_URL}/wefik`,
    founder: {
      '@id': `${BASE_URL}/#person`,
    },
    subOrganization: [
      { '@type': 'Organization', name: 'Wefik World' },
      { '@type': 'Organization', name: 'Alpha Qubit' },
      { '@type': 'Organization', name: 'Wefik News' },
    ],
  };
}

export function getBreadcrumbList(items = []) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function buildRootGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getPersonEntity(),
      getWebSiteEntity(),
      getProfilePageEntity(),
      getOrganizationEntity(),
    ],
  };
}
