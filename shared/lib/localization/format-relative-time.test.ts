import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { formatRelativeTime } from './format-relative-time';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('absolute date (more than 7 days)', () => {
    test('formats date in the past', () => {
      const result = formatRelativeTime('2025-12-01T12:00:00Z', 'en');
      expect(result).toBe('Dec 1');
    });

    test('formats date in the future', () => {
      const result = formatRelativeTime('2026-02-01T12:00:00Z', 'en');
      expect(result).toBe('Feb 1');
    });

    test('accepts Date object', () => {
      const result = formatRelativeTime(new Date('2025-12-01T12:00:00Z'), 'en');
      expect(result).toBe('Dec 1');
    });
  });

  describe('relative time', () => {
    test('formats minutes ago', () => {
      const result = formatRelativeTime('2026-01-01T11:55:00Z', 'en');
      expect(result).toBe('5 minutes ago');
    });

    test('formats hours ago', () => {
      const result = formatRelativeTime('2026-01-01T09:00:00Z', 'en');
      expect(result).toBe('3 hours ago');
    });

    test('formats days ago', () => {
      const result = formatRelativeTime('2025-12-30T12:00:00Z', 'en');
      expect(result).toBe('2 days ago');
    });

    test('formats future dates', () => {
      const result = formatRelativeTime('2026-01-01T15:00:00Z', 'en');
      expect(result).toBe('in 3 hours');
    });

    test('formats less than a minute as "now"', () => {
      const result = formatRelativeTime('2026-01-01T11:59:30Z', 'en');
      expect(result).toBe('this minute');
    });
  });

  describe('locale', () => {
    test('uses default locale (en)', () => {
      const result = formatRelativeTime('2026-01-01T11:55:00Z');
      expect(result).toBe('5 minutes ago');
    });

    test('formats in Russian', () => {
      const result = formatRelativeTime('2026-01-01T11:55:00Z', 'ru');
      expect(result).toContain('минут');
    });
  });
});
