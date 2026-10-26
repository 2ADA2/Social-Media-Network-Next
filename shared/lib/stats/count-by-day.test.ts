import { describe, expect, test } from 'vitest';
import { countByDay } from './count-by-day';

describe('countByDay', () => {
  const now = new Date('2026-01-07T12:00:00Z');

  test('returns 7 days by default', () => {
    const result = countByDay([], 7, now);

    expect(result).toHaveLength(7);
  });

  test('returns N days when passed', () => {
    const result = countByDay([], 3, now);

    expect(result).toHaveLength(3);
  });

  test('all days have count 0 when no dates', () => {
    const result = countByDay([], 7, now);

    expect(result.every((d) => d.count === 0)).toBe(true);
  });

  test('counts dates within range', () => {
    const result = countByDay(
      ['2026-01-07T10:00:00Z', '2026-01-07T11:00:00Z'],
      7,
      now,
    );

    const today = result.find((d) => d.count === 2);
    expect(today).toBeDefined();
  });

  test('ignores dates before range', () => {
    const result = countByDay(['2025-12-01T12:00:00Z'], 7, now);

    expect(result.every((d) => d.count === 0)).toBe(true);
  });

  test('ignores dates after now', () => {
    const result = countByDay(['2026-01-08T12:00:00Z'], 7, now);

    expect(result.every((d) => d.count === 0)).toBe(true);
  });

  test('returns dates in order from oldest to newest', () => {
    const result = countByDay([], 3, now);

    expect(result[0].date).toBe('05.01');
    expect(result[1].date).toBe('06.01');
    expect(result[2].date).toBe('07.01');
  });

  test('counts multiple dates on different days', () => {
    const result = countByDay(
      ['2026-01-07T10:00:00Z', '2026-01-06T10:00:00Z', '2026-01-06T11:00:00Z'],
      7,
      now,
    );

    expect(result.find((d) => d.date === '07.01')?.count).toBe(1);
    expect(result.find((d) => d.date === '06.01')?.count).toBe(2);
  });

  test('ignores invalid dates', () => {
    const result = countByDay(['invalid-date'], 7, now);

    expect(result.every((d) => d.count === 0)).toBe(true);
  });
});
