import "./globals.css";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05070c",
};

export const metadata = {
  metadataBase: new URL("https://sksahinurislam.dev"),
  title: "SK Sahinur Islam — Senior Web Application Developer & IT Engineer",
  description: "Official portfolio of SK Sahinur Islam — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, Patent Holder, and IT Engineer from Kolkata, India. Specialized in Backend Architecture, DevOps, Node.js, React, Linux, and IoT.",
  keywords: [
    "SK Sahinur Islam",
    "Sahinur Islam",
    "GeniousSonu",
    "Senior Web Application Developer",
    "Ib Arts",
    "WEFIK Co-Founder",
    "Full Stack Developer Kolkata",
    "Backend Developer",
    "DevOps Engineer India",
    "MERN Stack Developer",
    "IoT Patent Vaccine Preservation",
    "Node.js Developer",
    "React Developer",
    "Linux Systems Administrator"
  ],
  authors: [{ name: "SK Sahinur Islam", url: "https://sksahinurislam.dev" }],
  creator: "SK Sahinur Islam",
  publisher: "SK Sahinur Islam",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sksahinurislam.dev",
  },
  openGraph: {
    type: "profile",
    url: "https://sksahinurislam.dev",
    title: "SK Sahinur Islam — Senior Web Application Developer & IT Engineer",
    description: "Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and Patent Holder. Engineering web applications, backend APIs, DevOps pipelines, and IoT systems.",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 800,
        alt: "SK Sahinur Islam Logo",
      }
    ],
    siteName: "SK Sahinur Islam Portfolio",
    locale: "en_IN",
    firstName: "SK Sahinur",
    lastName: "Islam",
    username: "GeniousSonu",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    title: "SK Sahinur Islam — Senior Web Application Developer & IT Engineer",
    description: "Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and Patent Holder. Building reliable systems.",
    images: ["/logo.svg"],
  }
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sksahinurislam.dev/#person",
      "name": "SK Sahinur Islam",
      "alternateName": ["Sahinur Islam", "GeniousSonu", "SK Sahinur"],
      "url": "https://sksahinurislam.dev",
      "image": "https://sksahinurislam.dev/logo.svg",
      "email": "mailto:sahinurislamm2002@gmail.com",
      "telephone": "+918159871669",
      "jobTitle": "Senior Web Application Developer",
      "description": "Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, IT Engineer, and IoT Patent Holder.",
      "worksFor": [
        {
          "@type": "Organization",
          "name": "Ib Arts",
          "role": "Senior Web Application Developer",
          "startDate": "2026-07"
        },
        {
          "@type": "Organization",
          "name": "WEFIK",
          "role": "Co-Founder",
          "startDate": "2021-03"
        }
      ],
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Guru Nanak Institute of Technology, Kolkata",
        "sameAs": "https://www.gnit.ac.in/"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressRegion": "West Bengal",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://www.linkedin.com/in/sksahinurislam/",
        "https://github.com/GeniousSonu",
        "https://www.upwork.com/freelancers/~0104912246c7c7bdbf",
        "https://linktr.ee/sksahinurislam",
        "https://instagram.com/genious.exe"
      ],
      "knowsAbout": [
        "Full-Stack Development",
        "Backend Architecture",
        "DevOps",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Docker",
        "Linux Server Administration",
        "Cybersecurity",
        "IoT & Embedded Systems",
        "MQTT Telemetry",
        "Python"
      ],
      "hasCredential": [
        { "@type": "EducationalOccupationalCredential", "name": "CompTIA A+" },
        { "@type": "EducationalOccupationalCredential", "name": "TryHackMe Pre Security Certification" },
        { "@type": "EducationalOccupationalCredential", "name": "CoCubes Certified Coding & Aptitude" },
        { "@type": "EducationalOccupationalCredential", "name": "IBM Machine Learning with Python (Honors)" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://sksahinurislam.dev/#website",
      "url": "https://sksahinurislam.dev",
      "name": "SK Sahinur Islam Portfolio",
      "publisher": { "@id": "https://sksahinurislam.dev/#person" },
      "inLanguage": "en-US"
    },
    {
      "@type": "ProfilePage",
      "@id": "https://sksahinurislam.dev/#profilepage",
      "url": "https://sksahinurislam.dev",
      "name": "SK Sahinur Islam — Official Portfolio & Engineering Resume",
      "mainEntity": { "@id": "https://sksahinurislam.dev/#person" }
    }
  ]
};

import CustomCursor from "@/components/CustomCursor";
import MobileBottomCTA from "@/components/MobileBottomCTA";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${geist.className}`}>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SONU" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Technical Summary" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body>
        <CustomCursor />
        {children}
        <MobileBottomCTA />
      </body>
    </html>
  );
}
