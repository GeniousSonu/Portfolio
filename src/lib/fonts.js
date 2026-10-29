import {
  Bricolage_Grotesque,
  Space_Mono,
  Shantell_Sans,
  Bebas_Neue,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Anek_Bangla,
} from 'next/font/google';

/**
 * Editorial & Neo-Brutalist Typography System (design-reference.md)
 * 1. Display Condensed: Bebas Neue (Uppercase, tight tracking -0.02em, line-height 0.88)
 * 2. Editorial Serif: Playfair Display (Italic narrative hooks & cover story accents)
 * 3. Technical Monospace: Space Mono (Metadata, stats, command strips)
 * 4. UI Sans: Plus Jakarta Sans / Bricolage Grotesque (Clean body & navigation)
 * 5. Accent Hand: Shantell Sans (Playful annotations)
 * 6. Regional Display / Bengali Subset: Anek Bangla (Local cultural accents)
 *
 * Self-hosted build-time via next/font (zero runtime third-party requests).
 */

export const fontBodyDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  display: 'swap',
  preload: true,
  variable: '--font-bricolage',
  adjustFontFallback: true,
});

export const fontDisplay = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-bebas',
  adjustFontFallback: true,
});

export const fontSerif = Playfair_Display({
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-serif',
  adjustFontFallback: true,
});

export const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-sans-ui',
  adjustFontFallback: true,
});

export const fontMono = Space_Mono({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-space-mono',
  adjustFontFallback: true,
});

export const fontHand = Shantell_Sans({
  subsets: ['latin', 'cyrillic'],
  axes: ['BNCE', 'INFM'],
  display: 'swap',
  preload: false,
  variable: '--font-shantell',
  adjustFontFallback: true,
});

export const fontBengali = Anek_Bangla({
  subsets: ['bengali'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-bengali',
  adjustFontFallback: true,
});

export const fontClassNames = [
  fontBodyDisplay.variable,
  fontDisplay.variable,
  fontSerif.variable,
  fontSans.variable,
  fontMono.variable,
  fontHand.variable,
  fontBengali.variable,
].join(' ');

