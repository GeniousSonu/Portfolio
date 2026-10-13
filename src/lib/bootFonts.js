import localFont from 'next/font/local';

export const fontBootBengali = localFont({
  src: '../../public/fonts/boot/noto-sans-bengali-subset.woff2',
  display: 'swap',
  variable: '--font-boot-bn',
});

export const fontBootHindi = localFont({
  src: '../../public/fonts/boot/noto-sans-devanagari-subset.woff2',
  display: 'swap',
  variable: '--font-boot-hi',
});

export const fontBootJapanese = localFont({
  src: '../../public/fonts/boot/noto-sans-jp-subset.woff2',
  display: 'swap',
  variable: '--font-boot-ja',
});

export const fontBootRussian = localFont({
  src: '../../public/fonts/boot/noto-sans-cyrillic-subset.woff2',
  display: 'swap',
  variable: '--font-boot-ru',
});

export const fontBootArabic = localFont({
  src: '../../public/fonts/boot/noto-sans-arabic-subset.woff2',
  display: 'swap',
  variable: '--font-boot-ar',
});

export const fontBootLatin = localFont({
  src: '../../public/fonts/boot/noto-sans-latin-subset.woff2',
  display: 'swap',
  variable: '--font-boot-en',
});

export const bootFontVariables = [
  fontBootBengali.variable,
  fontBootHindi.variable,
  fontBootJapanese.variable,
  fontBootRussian.variable,
  fontBootArabic.variable,
  fontBootLatin.variable,
].join(' ');
