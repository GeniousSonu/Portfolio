// Unified Audio & Haptic Engine for SK Sahinur Islam Portfolio
// Built for TASK SOUND-FEEL-001 — Zero-Dependency Native Web Audio & Vibration API
// Strictly adheres to autoplay policies (requires explicit gesture before unlocking)

const DEFAULT_MASTER_LEVEL = 0.85;
const DEFAULT_SFX_LEVEL = 0.40;
const DEFAULT_MUSIC_LEVEL = 0.25;

let ctx = null;
let masterGain = null;
let compressor = null;
let sfxGain = null;
let musicGain = null;

let isMasterMuted = false;
let isSfxMuted = false;
let isMusicMuted = false;
let sfxVolume = DEFAULT_SFX_LEVEL;
let musicVolume = DEFAULT_MUSIC_LEVEL;

// Ambient / Lofi Nodes
let ambientNodes = null;
let ambientGain = null;
let ambientFilter = null;
let ambientPlaying = false;
let ambientTheme = 'dark';
let ambientPaused = false;
let isDucked = false;
let duckTimer = null;
let noiseBuffer = null;

// Lofi Audio Element (for streaming real lofi tracks)
let musicAudioElement = null;
let mediaSourceNode = null;

// Rate limiting & Debounce
let lastSfxTime = 0;
let lastVibrateTime = 0;
const SFX_MIN_INTERVAL = 35; // ms
const VIBRATE_MIN_INTERVAL = 55; // ms

// Haptic patterns (in ms)
export const HAPTIC_PATTERNS = {
  light: [8],
  selection: [10],
  toggle: [12],
  confirm: [16],
  success: [10, 40, 14],
  error: [20, 50, 20],
};

function buildContext() {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  try {
    ctx = new AudioCtor();

    // Master Limiter / Dynamics Compressor to prevent clipping and protect hearing
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 16;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.22;

    // Master Gain Bus
    masterGain = ctx.createGain();
    masterGain.gain.value = isMasterMuted ? 0 : DEFAULT_MASTER_LEVEL;

    // SFX Gain Bus
    sfxGain = ctx.createGain();
    sfxGain.gain.value = isSfxMuted ? 0 : sfxVolume;

    // Music Gain Bus
    musicGain = ctx.createGain();
    musicGain.gain.value = isMusicMuted ? 0 : musicVolume;

    // Wire topology: SFX & Music -> Compressor -> Master -> Destination
    sfxGain.connect(compressor);
    musicGain.connect(compressor);
    compressor.connect(masterGain);
    masterGain.connect(ctx.destination);

    return ctx;
  } catch {
    return null;
  }
}

export function unlock() {
  const audio = buildContext();
  if (!audio) return null;
  if (audio.state === 'suspended') {
    audio.resume().catch(() => {});
  }
  return audio;
}

// Master Mute
export function setMasterMuted(muted) {
  isMasterMuted = Boolean(muted);
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setTargetAtTime(isMasterMuted ? 0 : DEFAULT_MASTER_LEVEL, now, 0.04);
}

// SFX Volume & Mute
export function setSfxMuted(muted) {
  isSfxMuted = Boolean(muted);
  if (!ctx || !sfxGain) return;
  const now = ctx.currentTime;
  sfxGain.gain.cancelScheduledValues(now);
  sfxGain.gain.setTargetAtTime(isSfxMuted ? 0 : sfxVolume, now, 0.03);
}

export function setSfxVolume(vol) {
  sfxVolume = Math.max(0, Math.min(1, vol));
  if (!ctx || !sfxGain || isSfxMuted) return;
  const now = ctx.currentTime;
  sfxGain.gain.cancelScheduledValues(now);
  sfxGain.gain.setTargetAtTime(sfxVolume, now, 0.03);
}

// Music Volume & Mute
export function setMusicMuted(muted) {
  isMusicMuted = Boolean(muted);
  if (!ctx || !musicGain) return;
  const now = ctx.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setTargetAtTime(isMusicMuted ? 0 : (isDucked ? musicVolume * 0.25 : musicVolume), now, 0.05);
}

export function setMusicVolume(vol) {
  musicVolume = Math.max(0, Math.min(1, vol));
  if (!ctx || !musicGain || isMusicMuted) return;
  const now = ctx.currentTime;
  const target = isDucked ? musicVolume * 0.25 : musicVolume;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setTargetAtTime(target, now, 0.05);
}

// Haptic trigger with rate limiting and feature detection
export function triggerHaptic(patternName = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  const now = performance.now();
  if (now - lastVibrateTime < VIBRATE_MIN_INTERVAL) return;
  lastVibrateTime = now;

  try {
    const pattern = HAPTIC_PATTERNS[patternName] || HAPTIC_PATTERNS.light;
    navigator.vibrate(pattern);
  } catch {}
}

// Music Ducking during longer sounds or voice/video
export function duckMusic(durationMs = 350) {
  if (!ctx || !musicGain || isMusicMuted) return;
  const now = ctx.currentTime;
  musicGain.gain.cancelScheduledValues(now);
  musicGain.gain.setTargetAtTime(musicVolume * 0.25, now, 0.04);
  isDucked = true;

  clearTimeout(duckTimer);
  duckTimer = setTimeout(() => {
    if (!ctx || !musicGain || isMusicMuted) return;
    const t = ctx.currentTime;
    musicGain.gain.cancelScheduledValues(t);
    musicGain.gain.setTargetAtTime(musicVolume, t, 0.18);
    isDucked = false;
  }, durationMs);
}

// Tone generator for micro-sounds
function tone(freq, opts = {}) {
  if (!buildContext() || isMasterMuted || isSfxMuted) return;
  const {
    type = 'sine',
    duration = 0.08,
    peak = 0.03,
    slideTo = null,
    delay = 0,
    detune = 0,
  } = opts;

  try {
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Subtle pitch micro-variance (±1.5%) to avoid repetition fatigue
    const jitter = (Math.random() * 2 - 1) * 3;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    osc.detune.setValueAtTime(detune + jitter, start);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  } catch {}
}

// Chapter swell with soft pink noise
function chapterSwell() {
  if (!buildContext() || isMasterMuted || isSfxMuted) return;
  try {
    if (!noiseBuffer) {
      const length = Math.floor(ctx.sampleRate * 0.35);
      noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length);
      }
    }

    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(520, now);
    filter.frequency.exponentialRampToValueAtTime(1180, now + 0.28);
    filter.Q.value = 0.85;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);
    source.start(now);
    source.stop(now + 0.35);
  } catch {}
}

// Main Sound Dispatcher with Rate Limiting
export function play(kind) {
  if (!buildContext() || isMasterMuted || isSfxMuted) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const now = performance.now();
  if (now - lastSfxTime < SFX_MIN_INTERVAL) return;
  lastSfxTime = now;

  switch (kind) {
    case 'nav':
      tone(660, { type: 'sine', duration: 0.07, peak: 0.035, slideTo: 880 });
      break;
    case 'toggle':
      tone(480, { type: 'sine', duration: 0.05, peak: 0.03, slideTo: 720 });
      break;
    case 'theme-light':
      tone(660, { type: 'sine', duration: 0.12, peak: 0.038, slideTo: 1320 });
      tone(990, { type: 'triangle', duration: 0.08, peak: 0.015, delay: 0.03 });
      break;
    case 'theme-dark':
      tone(880, { type: 'sine', duration: 0.14, peak: 0.038, slideTo: 440 });
      break;
    case 'confirm':
    case 'submit':
      tone(587, { type: 'sine', duration: 0.14, peak: 0.045, slideTo: 880 });
      duckMusic(180);
      break;
    case 'copy-success':
      tone(880, { type: 'sine', duration: 0.08, peak: 0.035 });
      tone(1174, { type: 'sine', duration: 0.12, peak: 0.035, delay: 0.05 });
      duckMusic(220);
      break;
    case 'error':
      tone(220, { type: 'sine', duration: 0.15, peak: 0.03, slideTo: 160 });
      break;
    case 'card-press':
      tone(340, { type: 'triangle', duration: 0.06, peak: 0.032, slideTo: 280 });
      break;
    case 'chapter':
      chapterSwell();
      duckMusic(320);
      break;
    case 'hover':
      tone(660, { type: 'triangle', duration: 0.03, peak: 0.012 });
      break;
    case 'tick':
    default:
      tone(880, { type: 'sine', duration: 0.06, peak: 0.03 });
      tone(1320, { type: 'sine', duration: 0.04, peak: 0.01, delay: 0.003 });
      break;
  }
}

// Warm Lofi Chord Presets for Light & Dark Theme
const CHORDS = {
  light: {
    frequencies: [174.61, 220.0, 261.63, 349.23], // F major 7 warm morning
    filter: 920,
    level: 0.95,
  },
  dark: {
    frequencies: [110.0, 164.81, 220.0, 329.63], // A minor 7 midnight lofi
    filter: 580,
    level: 0.85,
  },
};

function stopAmbientNodes() {
  if (!ambientNodes) return;
  const nodes = ambientNodes;
  ambientNodes = null;
  const now = ctx ? ctx.currentTime : 0;
  try {
    if (ambientGain) {
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setTargetAtTime(0, now, 0.1);
    }
  } catch {}
  setTimeout(() => {
    nodes.forEach(({ osc, lfo, gain, lfoGain, swell, swellGain }) => {
      try { lfo.stop(); } catch {}
      try { osc.stop(); } catch {}
      try { swell?.stop(); } catch {}
      try { gain.disconnect(); } catch {}
      try { lfoGain.disconnect(); } catch {}
      try { swellGain?.disconnect(); } catch {}
    });
    try { ambientFilter?.disconnect(); } catch {}
    try { ambientGain?.disconnect(); } catch {}
    ambientFilter = null;
    ambientGain = null;
  }, 450);
}

// Start Lofi Music / Ambient Bed
export function startAmbient(theme = 'dark') {
  if (!buildContext()) return;
  const preset = CHORDS[theme] || CHORDS.dark;

  if (ambientPlaying && ambientTheme === theme) {
    ambientPaused = false;
    if (ambientGain) {
      const now = ctx.currentTime;
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setTargetAtTime(preset.level, now, 0.3);
    }
    return;
  }

  stopAmbientNodes();
  ambientTheme = theme;
  ambientPlaying = true;
  ambientPaused = false;

  const now = ctx.currentTime;

  try {
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.0001, now);
    ambientGain.gain.exponentialRampToValueAtTime(preset.level, now + 1.8);

    ambientFilter = ctx.createBiquadFilter();
    ambientFilter.type = 'lowpass';
    ambientFilter.frequency.value = preset.filter;
    ambientFilter.Q.value = 0.45;

    // Connect to musicGain bus
    ambientFilter.connect(ambientGain);
    ambientGain.connect(musicGain);

    const nodes = [];
    preset.frequencies.forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = frequency;
      osc.detune.value = index % 2 === 0 ? -4 : 4;
      gain.gain.value = index === 0 ? 0.42 : 0.25 - index * 0.035;

      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + index * 0.015;
      lfoGain.gain.value = 0.22;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const swell = ctx.createOscillator();
      const swellGain = ctx.createGain();
      swell.type = 'sine';
      swell.frequency.value = 0.04 + index * 0.01;
      swellGain.gain.value = index === 0 ? 0.10 : 0.05;
      swell.connect(swellGain);
      swellGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(ambientFilter);

      osc.start(now);
      lfo.start(now);
      swell.start(now);

      nodes.push({ osc, gain, lfo, lfoGain, swell, swellGain });
    });

    ambientNodes = nodes;

    // Update MediaSession for OS media control centers
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      const isDay = theme === 'light';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: isDay ? 'Morning Coffee' : 'Night City Breeze',
        artist: isDay ? 'LuKremBo' : 'Purrple Cat',
        album: 'SK Sahinur Islam Portfolio (Lofi Experience)',
        artwork: [{ src: '/Image/sonu-sticker.png', sizes: '512x512', type: 'image/png' }],
      });
    }
  } catch {}
}

export function stopAmbient() {
  ambientPlaying = false;
  ambientPaused = false;
  stopAmbientNodes();
}

// Pause/Resume on Tab Visibility Change
export function setPageHidden(hidden) {
  if (!ctx) return;
  ambientPaused = Boolean(hidden);
  const now = ctx.currentTime;
  if (ambientGain && ambientPlaying) {
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setTargetAtTime(hidden ? 0 : 1, now, 0.25);
  }
}
