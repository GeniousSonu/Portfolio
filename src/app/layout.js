import "./globals.css";

export const metadata = {
  title: "SK Sahinur Islam — Full Stack Developer & IT Engineer",
  description: "SK Sahinur Islam — Full Stack Developer, Cybersecurity Enthusiast & IT Engineer from Kolkata, India. MERN stack, IoT, Linux, networking, and web solutions for global clients.",
  keywords: "SK Sahinur Islam, Full Stack Developer, MERN Stack, React, Node.js, Cybersecurity, Network Engineer, Kolkata, Upwork, IoT, Linux",
  authors: [{ name: "SK Sahinur Islam" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://sksahinurislam.dev",
  },
  openGraph: {
    type: "website",
    url: "https://sksahinurislam.dev",
    title: "SK Sahinur Islam — Full Stack Developer & IT Engineer",
    description: "Building reliable systems at the intersection of web, infrastructure, and security. MERN stack, IoT, Linux, penetration testing, and more.",
    images: [
      {
        url: "https://sksahinurislam.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SK Sahinur Islam Profile",
      }
    ],
    siteName: "SK Sahinur Islam",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SK Sahinur Islam — Full Stack Developer & IT Engineer",
    description: "Building reliable systems at the intersection of web, infrastructure, and security.",
    images: ["https://sksahinurislam.dev/og-image.jpg"],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "SK Sahinur Islam",
  "url": "https://sksahinurislam.dev",
  "email": "sahinurislamm2002@gmail.com",
  "jobTitle": "Full Stack Developer & IT Engineer",
  "worksFor": { "@type": "Organization", "name": "WEFIK" },
  "alumniOf": { "@type": "EducationalOrganization", "name": "Guru Nanak Institute of Technology, Kolkata" },
  "address": { "@type": "PostalAddress", "addressLocality": "Kolkata", "addressRegion": "West Bengal", "addressCountry": "IN" },
  "sameAs": [
    "https://www.linkedin.com/in/sksahinurislam/",
    "https://github.com/GeniousSonu",
    "https://www.upwork.com/freelancers/~0104912246c7c7bdbf"
  ],
  "knowsAbout": ["Full-Stack Development", "React", "Node.js", "MongoDB", "Linux", "Cybersecurity", "IoT", "Machine Learning"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
