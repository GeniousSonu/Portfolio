/**
 * KuraCode Brand Guidelines & Asset Registry
 */

export const KURACODE_BRAND = {
  name: 'KuraCode',
  wordmark: 'KuraCode',
  descriptor: 'Save code from anywhere on the web in one click',
  typography: 'Bricolage Grotesque, Space Mono, Bebas Neue',

  // Derived real hex values from kuracode-icon.svg
  palette: [
    { name: 'Mint Neon', hex: '#08e88a', role: 'Primary Accent & Logo Stem' },
    { name: 'Emerald Bright', hex: '#00e889', role: 'Chevron Outer Ribbon' },
    { name: 'Emerald Mid', hex: '#00b96c', role: 'Gradient Midpoint' },
    { name: 'Emerald Deep', hex: '#00854f', role: 'Folded Inner Shadow' },
    { name: 'Forest Dark', hex: '#00613f', role: 'Deepest Shadow Ribbon' },
    { name: 'Light Ribbon', hex: '#37f6a6', role: 'Upper Highlight Ribbon' },
  ],

  derivedNotice: 'Color palette is extracted directly from the official geometric SVG vector logo.',

  downloads: [
    { label: 'Vector Icon (SVG)', file: '/assets/kuracode/kuracode-icon.svg', type: 'SVG' },
    { label: 'High-Res Logo (PNG)', file: '/assets/kuracode/kuracode-logo.png', type: 'PNG' },
    { label: 'Optimized Logo (WebP)', file: '/assets/kuracode/kuracode-logo.webp', type: 'WebP' },
    { label: 'Banner Presentation (WebP)', file: '/assets/kuracode/kuracode-hero.webp', type: 'WebP' },
    { label: 'Social Card (1200x630)', file: '/assets/kuracode/og-kuracode.png', type: 'PNG' },
  ],
};

export default KURACODE_BRAND;
