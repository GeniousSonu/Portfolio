// Synthesised UI sound + ambient bed for the V3 home.
// No audio files, no network requests. The AudioContext is only created
// after an explicit user gesture (SoundProvider guarantees this).

const MASTER_LEVEL = 0.25;

let ctx = null;
let master = null;
let compressor = null;
let muted = false;

let ambient = null;
let ambientGain = null;
let ambientFilter = null;
let ambientPlaying = false;
let ambientTheme = null;
let ambientPaused = false;
let ducked = false;
let duckTimer = null;

let noiseBuffer = null;

function buildContext() {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;

  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  ctx = new AudioCtor();

  compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.knee.value = 18;
  compressor.ratio.value = 6;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.25;

  master = ctx.createGain();
  master.gain.value = muted ? 0 : MASTER_LEVEL;
  master.connect(compressor);
  compressor.connect(ctx.destination);

  return ctx;
}

export function unlock() {
  const audio = buildContext();
  if (!audio) return null;
  if (audio.state === 'suspended') {
    audio.resume().catch(() => {});
  }
  return audio;
}

export function setMuted(next) {
  muted = Boolean(next);
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, now, 0.04);
}

function tone(freq, opts = {}) {
  if (!buildContext() || muted) return;
  const {
    type = 'sine',
    duration = 0.08,
    peak = 0.02,
    slideTo = null,
    delay = 0,
    detune = 0,
  } = opts;

  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  osc.detune.setValueAtTime(detune, start);
  if (slideTo) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), start + duration);
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function duckAmbient() {
  if (!ctx || !ambientGain || !ambientPlaying || muted) return;
  const now = ctx.currentTime;
  ambientGain.gain.cancelScheduledValues(now);
  ambientGain.gain.setTargetAtTime(0.45, now, 0.05);
  ducked = true;
  clearTimeout(duckTimer);
  duckTimer = setTimeout(() => {
    if (!ctx || !ambientGain || !ambientPlaying) return;
    const t = ctx.currentTime;
    ambientGain.gain.cancelScheduledValues(t);
    ambientGain.gain.setTargetAtTime(ambientPaused ? 0 : 1, t, 0.12);
    ducked = false;
  }, 240);
}

function chapterSwell() {
  if (!buildContext() || muted) return;
  if (!noiseBuffer) {
    const length = Math.floor(ctx.sampleRate * 0.4);
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
  filter.frequency.exponentialRampToValueAtTime(1180, now + 0.3);
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.02, now + 0.09);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(now);
  source.stop(now + 0.36);
}

export function play(kind) {
  if (!buildContext() || muted) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  switch (kind) {
    case 'hover':
      tone(660, { type: 'triangle', duration: 0.04, peak: 0.012 });
      break;
    case 'confirm':
      tone(660, { type: 'sine', duration: 0.14, peak: 0.03, slideTo: 990 });
      duckAmbient();
      break;
    case 'error':
      tone(220, { type: 'sine', duration: 0.16, peak: 0.028, slideTo: 180 });
      break;
    case 'chapter':
      chapterSwell();
      duckAmbient();
      break;
    case 'tick':
    default:
      tone(880, { type: 'sine', duration: 0.07, peak: 0.024 });
      tone(1320, { type: 'sine', duration: 0.05, peak: 0.008, delay: 0.004 });
      duckAmbient();
      break;
  }
}

const CHORDS = {
  light: {
    frequencies: [174.61, 220, 261.63, 349.23],
    filter: 880,
    level: 1,
  },
  dark: {
    frequencies: [110, 164.81, 220, 329.63],
    filter: 560,
    level: 0.85,
  },
};

function stopAmbientNodes() {
  if (!ambient) return;
  const nodes = ambient;
  ambient = null;
  const now = ctx ? ctx.currentTime : 0;
  try {
    if (ambientGain) {
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setTargetAtTime(0, now, 0.08);
    }
  } catch {}
  setTimeout(() => {
    nodes.forEach(({ osc, lfo, gain, lfoGain, swell, swellGain }) => {
      try {
        lfo.stop();
      } catch {}
      try {
        osc.stop();
      } catch {}
      try {
        swell?.stop();
      } catch {}
      try {
        gain.disconnect();
      } catch {}
      try {
        lfoGain.disconnect();
      } catch {}
      try {
        swellGain?.disconnect();
      } catch {}
    });
    try {
      ambientFilter?.disconnect();
    } catch {}
    try {
      ambientGain?.disconnect();
    } catch {}
    ambientFilter = null;
    ambientGain = null;
  }, 420);
}

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

  ambientGain = ctx.createGain();
  ambientGain.gain.setValueAtTime(0.0001, now);
  ambientGain.gain.exponentialRampToValueAtTime(preset.level, now + 1.6);

  ambientFilter = ctx.createBiquadFilter();
  ambientFilter.type = 'lowpass';
  ambientFilter.frequency.value = preset.filter;
  ambientFilter.Q.value = 0.4;

  ambientGain.connect(compressor);
  ambientFilter.connect(ambientGain);

  const nodes = [];
  preset.frequencies.forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = index % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = frequency;
    osc.detune.value = index % 2 === 0 ? -3 : 3;
    gain.gain.value = index === 0 ? 0.5 : 0.28 - index * 0.04;

    lfo.type = 'sine';
    lfo.frequency.value = 0.06 + index * 0.017;
    lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const swell = ctx.createOscillator();
    const swellGain = ctx.createGain();
    swell.type = 'sine';
    swell.frequency.value = 0.045 + index * 0.01;
    swellGain.gain.value = index === 0 ? 0.12 : 0.06;
    swell.connect(swellGain);
    swellGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(ambientFilter);

    osc.start(now);
    lfo.start(now);
    swell.start(now);

    nodes.push({ osc, gain, lfo, lfoGain, swell, swellGain });
  });

  ambient = nodes;
}

export function stopAmbient() {
  ambientPlaying = false;
  ambientTheme = null;
  ambientPaused = false;
  stopAmbientNodes();
}

export function setPageHidden(hidden) {
  if (!ctx || !ambientGain || !ambientPlaying) return;
  ambientPaused = Boolean(hidden);
  const now = ctx.currentTime;
  ambientGain.gain.cancelScheduledValues(now);
  ambientGain.gain.setTargetAtTime(hidden ? 0 : ducked ? 0.45 : 1, now, 0.25);
}
