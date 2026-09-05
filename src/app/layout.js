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
  metadataBase: new URL("https://genioussonu.me"),
  title: {
    default: "SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer Portfolio",
    template: "%s | SK Sahinur Islam (Genious Sonu)",
  },
  description: "Official portfolio of SK Sahinur Islam (Genious Sonu, Sahinur) — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, Patent Holder, and IT Engineer. Explore full stack projects, backend architecture, and engineering articles.",
  keywords: [
    "SK Sahinur Islam",
    "Sahinur Islam",
    "Sahinur",
    "Genious Sonu",
    "GeniousSonu",
    "Sonu",
    "portfolio of Sahinur",
    "Sahinur Islam portfolio",
    "Sonu portfolio",
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
  authors: [{ name: "SK Sahinur Islam (Genious Sonu)", url: "https://genioussonu.me" }],
  creator: "SK Sahinur Islam (Genious Sonu)",
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
    canonical: "https://genioussonu.me",
  },
  openGraph: {
    type: "profile",
    url: "https://genioussonu.me",
    title: "SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer Portfolio",
    description: "Official portfolio of SK Sahinur Islam (Genious Sonu, Sahinur) — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and IoT Patent Holder.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer",
      }
    ],
    siteName: "SK Sahinur Islam (Genious Sonu) Portfolio",
    locale: "en_US",
    alternateLocale: ["en_IN"],
    firstName: "SK Sahinur",
    lastName: "Islam",
    username: "GeniousSonu",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    title: "SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer Portfolio",
    description: "Official portfolio of SK Sahinur Islam (Genious Sonu, Sahinur) — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and IoT Patent Holder.",
    creator: "@GeniousSonu",
    images: ["/icon-512.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SONU",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://genioussonu.me/#person",
      "name": "SK Sahinur Islam",
      "alternateName": [
        "Genious Sonu",
        "Sonu",
        "Sahinur Islam",
        "Sahinur",
        "GeniousSonu",
        "SK Sahinur"
      ],
      "url": "https://genioussonu.me",
      "image": "https://genioussonu.me/icon-512.png",
      "email": "mailto:sahinurislamm2002@gmail.com",
      "telephone": "+918159871669",
      "jobTitle": "Senior Web Application Developer & Full Stack IT Engineer",
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
        "https://x.com/GeniousSonu",
        "https://twitter.com/GeniousSonu",
        "https://instagram.com/genious.exe",
        "https://www.youtube.com/@GeniousSonu",
        "https://www.upwork.com/freelancers/~0104912246c7c7bdbf",
        "https://linktr.ee/sksahinurislam",
        "https://www.facebook.com/profile.php?id=61561884613549"
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
        { "@type": "EducationalOccupationalCredential", "name": "Indian Patent No. 544062 (IoT Real-Time Vaccine Storage Monitoring)" },
        { "@type": "EducationalOccupationalCredential", "name": "CompTIA A+" },
        { "@type": "EducationalOccupationalCredential", "name": "TryHackMe Pre Security Certification" },
        { "@type": "EducationalOccupationalCredential", "name": "CoCubes Certified Coding & Aptitude" },
        { "@type": "EducationalOccupationalCredential", "name": "IBM Machine Learning with Python (Honors)" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://genioussonu.me/#website",
      "url": "https://genioussonu.me",
      "name": "SK Sahinur Islam (Genious Sonu) Portfolio",
      "publisher": { "@id": "https://genioussonu.me/#person" },
      "inLanguage": "en-US"
    },
    {
      "@type": "ProfilePage",
      "@id": "https://genioussonu.me/#profilepage",
      "url": "https://genioussonu.me",
      "name": "SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Resume",
      "mainEntity": { "@id": "https://genioussonu.me/#person" }
    }
  ]
};

import CustomCursor from "@/components/CustomCursor";
import MobileBottomCTA from "@/components/MobileBottomCTA";
import PWARegistration from "@/components/PWARegistration";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ConsentAnalyticsGate from "@/components/ConsentAnalyticsGate";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import UserPreferences from "@/components/UserPreferences";
import ChatbotWidget from "@/components/ChatbotWidget";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={`dark ${geist.className}`}>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#05070c" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SONU" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SONU" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Technical Summary" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        {/* Google Consent Mode v2 Default Configuration (Allows tag detection while enforcing consent) */}
        {gaId && (
          <script
            id="google-consent-mode-default"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'wait_for_update': 500
                });
                (function(){
                  try {
                    var c = localStorage.getItem('sks_analytics_consent') || (document.cookie.match(/(?:^| )sks_analytics_consent=([^;]+)/) || [])[1];
                    if (c === 'granted') {
                      gtag('consent', 'update', {
                        'analytics_storage': 'granted',
                        'ad_storage': 'granted',
                        'ad_user_data': 'granted',
                        'ad_personalization': 'granted'
                      });
                    }
                  } catch(e) {}
                })();
              `,
            }}
          />
        )}
      </head>
      <body>
        <SmoothScrollProvider />
        <PWARegistration />
        <UserPreferences />
        <CustomCursor />
        {children}
        <ConsentAnalyticsGate />
        <CookieConsentBanner />
        <MobileBottomCTA />
        <ChatbotWidget />
        {/* Google Tag (detected by Google Tag Assistant & Analytics on page load) */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
