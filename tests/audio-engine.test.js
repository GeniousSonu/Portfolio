import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as audioEngine from '../src/components/v3/audio/engine';

describe('SOUND-FEEL-001 Audio Engine Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports valid named haptic patterns matching specifications', () => {
    expect(audioEngine.HAPTIC_PATTERNS).toBeDefined();
    expect(audioEngine.HAPTIC_PATTERNS.light).toEqual([8]);
    expect(audioEngine.HAPTIC_PATTERNS.selection).toEqual([10]);
    expect(audioEngine.HAPTIC_PATTERNS.toggle).toEqual([12]);
    expect(audioEngine.HAPTIC_PATTERNS.confirm).toEqual([16]);
    expect(audioEngine.HAPTIC_PATTERNS.success).toEqual([10, 40, 14]);
    expect(audioEngine.HAPTIC_PATTERNS.error).toEqual([20, 50, 20]);
  });

  it('handles volume clamps safely between 0 and 1', () => {
    expect(() => audioEngine.setMusicVolume(1.5)).not.toThrow();
    expect(() => audioEngine.setMusicVolume(-0.5)).not.toThrow();
    expect(() => audioEngine.setSfxVolume(2.0)).not.toThrow();
    expect(() => audioEngine.setSfxVolume(-1.0)).not.toThrow();
  });

  it('handles mute state transitions without throwing', () => {
    expect(() => audioEngine.setMasterMuted(true)).not.toThrow();
    expect(() => audioEngine.setMasterMuted(false)).not.toThrow();
    expect(() => audioEngine.setMusicMuted(true)).not.toThrow();
    expect(() => audioEngine.setMusicMuted(false)).not.toThrow();
    expect(() => audioEngine.setSfxMuted(true)).not.toThrow();
    expect(() => audioEngine.setSfxMuted(false)).not.toThrow();
  });

  it('safely handles play() and triggerHaptic() calls in non-browser/SSR environments', () => {
    expect(() => audioEngine.play('tick')).not.toThrow();
    expect(() => audioEngine.play('nav')).not.toThrow();
    expect(() => audioEngine.play('toggle')).not.toThrow();
    expect(() => audioEngine.play('theme-light')).not.toThrow();
    expect(() => audioEngine.play('theme-dark')).not.toThrow();
    expect(() => audioEngine.play('confirm')).not.toThrow();
    expect(() => audioEngine.play('chapter')).not.toThrow();
    expect(() => audioEngine.triggerHaptic('light')).not.toThrow();
    expect(() => audioEngine.triggerHaptic('unknown-pattern')).not.toThrow();
  });

  it('handles visibility change notifications gracefully', () => {
    expect(() => audioEngine.setPageHidden(true)).not.toThrow();
    expect(() => audioEngine.setPageHidden(false)).not.toThrow();
  });
});
