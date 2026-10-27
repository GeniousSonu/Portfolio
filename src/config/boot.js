/**
 * Unified Boot Sequence Configuration (TASK BOOT-002)
 * 
 * Finite State Machine States & Events, Timing Budgets, and Content.
 * Target Total Duration: <= 3.6s
 * Absolute Failsafe: 4.5s
 */

import { BOOT_GREETINGS } from './bootGreetings';

export { BOOT_GREETINGS };

export const BOOT_STATES = Object.freeze({
  IDLE: 'idle',
  TERMINAL: 'terminal',
  NAMES: 'names',
  EXIT: 'exit',
  DONE: 'done',
  SKIPPED: 'skipped',
  FAILED: 'failed',
});

export const BOOT_EVENTS = Object.freeze({
  START: 'START',
  TERMINAL_DONE: 'TERMINAL_DONE',
  NAMES_DONE: 'NAMES_DONE',
  EXIT_DONE: 'EXIT_DONE',
  SKIP: 'SKIP',
  ERROR: 'ERROR',
  FAILSAFE: 'FAILSAFE',
});

/**
 * Valid FSM transitions table:
 * current_state -> { event: next_state }
 */
export const BOOT_TRANSITIONS = Object.freeze({
  [BOOT_STATES.IDLE]: {
    [BOOT_EVENTS.START]: BOOT_STATES.TERMINAL,
    [BOOT_EVENTS.SKIP]: BOOT_STATES.EXIT,
    [BOOT_EVENTS.EXIT_DONE]: BOOT_STATES.DONE,
    [BOOT_EVENTS.ERROR]: BOOT_STATES.DONE,
    [BOOT_EVENTS.FAILSAFE]: BOOT_STATES.DONE,
  },
  [BOOT_STATES.TERMINAL]: {
    [BOOT_EVENTS.TERMINAL_DONE]: BOOT_STATES.NAMES,
    [BOOT_EVENTS.SKIP]: BOOT_STATES.EXIT,
    [BOOT_EVENTS.EXIT_DONE]: BOOT_STATES.DONE,
    [BOOT_EVENTS.ERROR]: BOOT_STATES.DONE,
    [BOOT_EVENTS.FAILSAFE]: BOOT_STATES.DONE,
  },
  [BOOT_STATES.NAMES]: {
    [BOOT_EVENTS.NAMES_DONE]: BOOT_STATES.EXIT,
    [BOOT_EVENTS.SKIP]: BOOT_STATES.EXIT,
    [BOOT_EVENTS.EXIT_DONE]: BOOT_STATES.DONE,
    [BOOT_EVENTS.ERROR]: BOOT_STATES.DONE,
    [BOOT_EVENTS.FAILSAFE]: BOOT_STATES.DONE,
  },
  [BOOT_STATES.EXIT]: {
    [BOOT_EVENTS.EXIT_DONE]: BOOT_STATES.DONE,
    [BOOT_EVENTS.ERROR]: BOOT_STATES.DONE,
    [BOOT_EVENTS.FAILSAFE]: BOOT_STATES.DONE,
  },
  [BOOT_STATES.DONE]: {},
  [BOOT_STATES.SKIPPED]: {
    [BOOT_EVENTS.EXIT_DONE]: BOOT_STATES.DONE,
    [BOOT_EVENTS.FAILSAFE]: BOOT_STATES.DONE,
  },
  [BOOT_STATES.FAILED]: {
    [BOOT_EVENTS.FAILSAFE]: BOOT_STATES.DONE,
  },
});

/**
 * Exact Restored Terminal Lines (from commit ef9ece1 / c20fd70)
 */
export const TERMINAL_CONTENT = Object.freeze({
  title: 'sahinur@dev:~ (boot)',
  skipHint: 'press any key to skip',
  lines: [
    { type: 'cmd', prompt: '$', text: 'whoami', cursor: '▋' },
    { type: 'output', text: 'sahinur_islam' },
    { type: 'cmd', prompt: '$', text: './init_portfolio.sh', cursor: '▋' },
    { type: 'status', label: 'Loading modules...', status: '[OK]' },
    { type: 'status', label: 'Establishing connection...', status: '[OK]' },
    { type: 'status', label: 'Compiling experience.js...', status: '[OK]' },
  ],
});

/**
 * Timing Budgets (BOOT-002 Contract)
 * Terminal: 1.2s - 1.4s
 * Names: 1.8s (6 x 300ms)
 * Exit: ~0.4s
 * Total: <= 3.6s
 * Failsafe: 4.5s
 */
export const BOOT_TIMING = Object.freeze({
  // Font Readiness
  fontReadyTimeoutMs: 600,

  // Stage 1: Terminal (Total 1.20s, within 1.2s - 1.4s)
  terminalTotalMs: 1200,
  terminalFlyInMs: 150,
  terminalLine1TypeMs: 220, // 'whoami'
  terminalLine2DropMs: 100, // 'sahinur_islam'
  terminalLine3TypeMs: 300, // './init_portfolio.sh'
  terminalStatusCascadeMs: 240, // 3 x 80ms status lines
  terminalHoldMs: 190, // brief dwell before handoff

  // Stage 2: Multilingual Names (Total 1.80s)
  nameStageDurationMs: 1800,
  greetingDurationMs: 300, // 6 greetings * 300ms = 1800ms
  greetingTypeMs: 130,
  greetingHoldMs: 160,
  greetingSwapMs: 10,

  // Stage 3: Exit
  exitDurationMs: 350,

  // Totals & Safeguards
  maxTotalBudgetMs: 3600,
  absoluteCeilingMs: 4500, // Deliberately 4.5s (replacing 4.0s for two stages)

  // Accessibility / Reduced Motion
  reducedMotionStaticMs: 900,
  reducedMotionFadeMs: 200,
});

/**
 * Boot Preloader Storage Gate Configuration (TASK SITEWIDE-UNIFY-001 Step 6)
 * - Single configuration value for window duration (default 12 hours)
 * - Versioned storage key
 */
export const BOOT_STORAGE = Object.freeze({
  key: 'sks_boot_seen_v1',
  durationMs: 12 * 60 * 60 * 1000, // 12 hours
});

