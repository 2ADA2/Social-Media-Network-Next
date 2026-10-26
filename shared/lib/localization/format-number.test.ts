import { describe, expect, test } from 'vitest';
import { formatCompact } from './format-number';

describe('formatCompact', () => {
  test('formats thousands', () => {
    expect(formatCompact(1000, 'en-US')).toBe('1K');
  });

  test('formats millions', () => {
    expect(formatCompact(1_000_000, 'en-US')).toBe('1M');
  });

  test('formats billions', () => {
    expect(formatCompact(1_000_000_000, 'en-US')).toBe('1B');
  });

  test('formats with one decimal', () => {
    expect(formatCompact(1500, 'en-US')).toBe('1.5K');
  });

  test('formats and rounds', () => {
    expect(formatCompact(1570, 'en-US')).toBe('1.6K');
  });

  test('formats small numbers as-is', () => {
    expect(formatCompact(42, 'en-US')).toBe('42');
  });

  test('formats zero', () => {
    expect(formatCompact(0, 'en-US')).toBe('0');
  });

  test('formats negative numbers', () => {
    expect(formatCompact(-1500, 'en-US')).toBe('-1.5K');
  });
});
