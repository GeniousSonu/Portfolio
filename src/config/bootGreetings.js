/**
 * Boot Sequence Greetings Configuration (BOOT-001)
 * 
 * Order is strictly specified:
 * 1. Bengali: সাহিনুর (lang bn, dir ltr)
 * 2. Hindi: साहिनुर (lang hi, dir ltr)
 * 3. Japanese: サヒヌル (lang ja, dir ltr)
 * 4. Russian: сахинур (lang ru, dir ltr)
 * 5. Arabic: ساهينور (lang ar, dir rtl)
 * 6. English: Sahinur (lang en, dir ltr)
 */

export const BOOT_GREETINGS = [
  {
    id: 'bn',
    text: 'সাহিনুর',
    lang: 'bn',
    dir: 'ltr',
    fontFamily: 'var(--font-boot-bn)',
    label: 'Bengali',
  },
  {
    id: 'hi',
    text: 'साहिनुर',
    lang: 'hi',
    dir: 'ltr',
    fontFamily: 'var(--font-boot-hi)',
    label: 'Hindi',
  },
  {
    id: 'ja',
    text: 'サヒヌル',
    lang: 'ja',
    dir: 'ltr',
    fontFamily: 'var(--font-boot-ja)',
    label: 'Japanese',
  },
  {
    id: 'ru',
    text: 'сахинур',
    lang: 'ru',
    dir: 'ltr',
    fontFamily: 'var(--font-boot-ru)',
    label: 'Russian',
  },
  {
    id: 'ar',
    text: 'ساهينور',
    lang: 'ar',
    dir: 'rtl',
    fontFamily: 'var(--font-boot-ar)',
    label: 'Arabic',
    useRtlMask: true,
  },
  {
    id: 'en',
    text: 'Sahinur',
    lang: 'en',
    dir: 'ltr',
    fontFamily: 'var(--font-boot-en)',
    label: 'English',
  },
];

export const BOOT_TIMING = {
  greetingDurationMs: 340, // ~340ms per greeting
  typeDurationMs: 160,     // typing / reveal phase
  holdDurationMs: 160,     // hold phase
  swapDurationMs: 20,      // glitch / swap frame
  exitDurationMs: 300,     // clip-path wipe exit
  maxTotalBudgetMs: 2500,  // strictly <= 2.5s hard limit
  fontReadyTimeoutMs: 600, // document.fonts.ready wait cap
  reducedMotionDurationMs: 900, // static presentation duration for reduced motion
  absoluteCeilingMs: 4000, // failsafe timeout
};
