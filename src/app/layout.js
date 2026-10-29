import './globals.css';
import './tailwind.css';
import './v3.css';
import { fontClassNames } from '@/lib/fonts';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF4EE' },
    { media: '(prefers-color-scheme: dark)', color: '#060A12' },
  ],
};

export const metadata = {
  metadataBase: new URL('https://genioussonu.me'),
  title: {
    default: 'SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer Portfolio',
    template: '%s | SK Sahinur Islam (Genious Sonu)',
  },
  description:
    'Official portfolio of SK Sahinur Islam (Genious Sonu, Sahinur) — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, Patent Holder, and IT Engineer. Explore full stack projects, backend architecture, and engineering articles.',
  keywords: [
    'SK Sahinur Islam',
    'Sahinur Islam',
    'Sahinur',
    'Genious Sonu',
    'GeniousSonu',
    'Sonu',
    'portfolio of Sahinur',
    'Sahinur Islam portfolio',
    'Sonu portfolio',
    'Senior Web Application Developer',
    'Ib Arts',
    'WEFIK Co-Founder',
    'Full Stack Developer Kolkata',
    'Backend Developer',
    'DevOps Engineer India',
    'MERN Stack Developer',
    'IoT Patent Vaccine Preservation',
    'Node.js Developer',
    'React Developer',
    'Linux Systems Administrator',
  ],
  authors: [{ name: 'SK Sahinur Islam (Genious Sonu)', url: 'https://genioussonu.me' }],
  creator: 'SK Sahinur Islam (Genious Sonu)',
  publisher: 'SK Sahinur Islam',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://genioussonu.me',
  },
  openGraph: {
    type: 'profile',
    url: 'https://genioussonu.me',
    title: 'SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer Portfolio',
    description:
      'Official portfolio of SK Sahinur Islam (Genious Sonu, Sahinur) — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and IoT Patent Holder.',
    images: [
      {
        url: '/hero/og-solar-node.png',
        width: 1200,
        height: 630,
        alt: 'SK Sahinur Islam (Genious Sonu) — The Solar Node',
      },
    ],
    siteName: 'SK Sahinur Islam (Genious Sonu) Portfolio',
    locale: 'en_US',
    alternateLocale: ['en_IN'],
    firstName: 'SK Sahinur',
    lastName: 'Islam',
    username: 'GeniousSonu',
    gender: 'male',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SK Sahinur Islam (Genious Sonu) — Full Stack Developer & IT Engineer Portfolio',
    description:
      'Official portfolio of SK Sahinur Islam (Genious Sonu, Sahinur) — Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, and IoT Patent Holder.',
    creator: '@GeniousSonu',
    images: ['/hero/og-solar-node.png'],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SONU',
  },
  icons: {
    icon: [
      { url: '/favicon-sun.svg', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-moon.svg', media: '(prefers-color-scheme: dark)' },
      { url: '/logo.svg' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://genioussonu.me/#person',
      name: 'SK Sahinur Islam',
      alternateName: [
        'Genious Sonu',
        'Sonu',
        'Sahinur Islam',
        'Sahinur',
        'GeniousSonu',
        'SK Sahinur',
      ],
      url: 'https://genioussonu.me',
      image: 'https://genioussonu.me/icon-512.png',
      email: 'mailto:sahinurislamm2002@gmail.com',
      jobTitle: 'Senior Web Application Developer & Full Stack IT Engineer',
      description:
        'Senior Web Application Developer at Ib Arts, Co-Founder of WEFIK, IT Engineer, and IoT Patent Holder.',
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
        'https://www.linkedin.com/in/sksahinurislam/',
        'https://github.com/GeniousSonu',
        'https://x.com/GeniousSonu',
        'https://twitter.com/GeniousSonu',
        'https://instagram.com/genious.exe',
        'https://www.youtube.com/@GeniousSonu',
        'https://www.upwork.com/freelancers/~0104912246c7c7bdbf',
        'https://linktr.ee/sksahinurislam',
        'https://www.facebook.com/profile.php?id=61561884613549',
        'https://t.me/genious_sonu',
        'https://tryhackme.com/p/mrbettle',
      ],
      knowsAbout: [
        'Full-Stack Development',
        'Backend Architecture',
        'DevOps',
        'React',
        'Next.js',
        'Node.js',
        'Express',
        'MongoDB',
        'MySQL',
        'PostgreSQL',
        'Docker',
        'Linux Server Administration',
        'Cybersecurity',
        'IoT & Embedded Systems',
        'MQTT Telemetry',
        'Python',
      ],
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          name: 'Indian Patent No. 544062 (IoT Real-Time Vaccine Storage Monitoring)',
        },
        { '@type': 'EducationalOccupationalCredential', name: 'CompTIA A+' },
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
    },
    {
      '@type': 'WebSite',
      '@id': 'https://genioussonu.me/#website',
      url: 'https://genioussonu.me',
      name: 'SK Sahinur Islam (Genious Sonu) Portfolio',
      publisher: { '@id': 'https://genioussonu.me/#person' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://genioussonu.me/#profilepage',
      url: 'https://genioussonu.me',
      name: 'SK Sahinur Islam (Genious Sonu) — Official Portfolio & Engineering Resume',
      mainEntity: { '@id': 'https://genioussonu.me/#person' },
    },
  ],
};

import CustomCursor from '@/components/CustomCursor';
import MobileBottomCTA from '@/components/MobileBottomCTA';
import PWARegistration from '@/components/PWARegistration';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import ConsentAnalyticsGate from '@/components/ConsentAnalyticsGate';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import UserPreferences from '@/components/UserPreferences';
import ChatbotWidget from '@/components/ChatbotWidget';
import SiteVisitTracker from '@/components/SiteVisitTracker';
import { GoogleAnalytics } from '@next/third-parties/google';
import { OverlayProvider } from '@/context/OverlayContext';
import { TransitionProvider } from '@/context/TransitionContext';
import { PlaygroundProvider } from '@/context/PlaygroundContext';
import CommandPalette from '@/components/CommandPalette';
import SiteMenuModal from '@/components/SiteMenuModal';
import LoadingBar from '@/components/LoadingBar';
import SelfHealInit from '@/components/SelfHealInit';
import ThemeProvider from '@/components/v3/ThemeProvider';
import SoundProvider from '@/components/v3/SoundProvider';
import Navbar from '@/components/Navbar';
import FooterV3 from '@/components/v3/home/FooterV3';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const buildId = process.env.NEXT_PUBLIC_BUILD_ID || 'prod';

  return (
    <html lang="en" className={`light ${fontClassNames}`} data-build-id={buildId} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#F4EFE4" />
        <script
          id="portfolio-build-info"
          dangerouslySetInnerHTML={{
            __html: `console.info('[portfolio] build: ${buildId}');`,
          }}
        />
        <script
          id="v3-theme-bootstrap"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var root=document.documentElement;var path=location.pathname;var isHome=path==='/'||path==='/index.html';var stored=localStorage.getItem('v3-theme');var theme=stored==='light'||stored==='dark'?stored:'light';root.setAttribute('data-theme',theme);root.setAttribute('data-v3','true');root.setAttribute('data-v3-home',isHome?'true':'false');var color=theme==='light'?'#F4EFE4':'#070B14';var metas=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<metas.length;i++){metas[i].setAttribute('content',color);}}catch(e){}})();`,
          }}
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SONU" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SONU" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Technical Summary" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        {/* Incident INC-001 Resilience Bootstrap (Early ChunkLoadError catcher & js-motion gate) */}
        <script
          id="sks-resilience-bootstrap"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var RECOVERY_KEY = 'sks_self_heal_attempted';
                function checkChunkError(msg) {
                  if (!msg) return false;
                  var str = String(msg);
                  return str.indexOf('ChunkLoadError') !== -1 ||
                         str.indexOf('Loading chunk') !== -1 ||
                         str.indexOf('Failed to fetch dynamically imported module') !== -1 ||
                         str.indexOf('error loading dynamically imported module') !== -1;
                }
                function handleChunkCrash(err) {
                  if (!checkChunkError(err)) return;
                  try {
                    var attempts = parseInt(sessionStorage.getItem(RECOVERY_KEY) || '0', 10);
                    if (attempts < 1) {
                      sessionStorage.setItem(RECOVERY_KEY, '1');
                      if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(function(regs) {
                          regs.forEach(function(r) { r.unregister(); });
                        });
                      }
                      if ('caches' in window) {
                        caches.keys().then(function(keys) {
                          keys.forEach(function(k) { caches.delete(k); });
                        });
                      }
                      window.location.reload();
                    }
                  } catch(e) {}
                }
                window.addEventListener('error', function(e) { handleChunkCrash(e.error || e.message); });
                window.addEventListener('unhandledrejection', function(e) { handleChunkCrash(e.reason); });

                try {
                  var isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  var manualPref = localStorage.getItem('sks_reduce_motion') === 'true';
                  if (!isReduced && !manualPref) {
                    document.documentElement.classList.add('js-motion');
                    setTimeout(function() {
                      document.documentElement.classList.remove('js-motion');
                    }, 3000);
                  }
                } catch(e) {}
              })();
            `,
          }}
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
      <body suppressHydrationWarning>
        <SelfHealInit />
        <ThemeProvider>
          <SoundProvider>
            <OverlayProvider>
              <TransitionProvider>
                <PlaygroundProvider>
                  <LoadingBar />
                  <SmoothScrollProvider />
                  <PWARegistration />
                  <UserPreferences />
                  <CustomCursor />
                  <Navbar />
                  <div className="page-transition-shell">{children}</div>
                  <FooterV3 />
                  <ConsentAnalyticsGate />
                  <SiteVisitTracker />
                  <CookieConsentBanner />
                  <MobileBottomCTA />
                  <ChatbotWidget />
                  <CommandPalette />
                  <SiteMenuModal />
                </PlaygroundProvider>
              </TransitionProvider>
            </OverlayProvider>
          </SoundProvider>
        </ThemeProvider>
        {/* Google Tag (detected by Google Tag Assistant & Analytics on page load) */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {/* Official Vercel Platform Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
