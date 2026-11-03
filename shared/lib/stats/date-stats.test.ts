import { describe, expect, test } from 'vitest';
import { countByWeek } from './date-stats';

describe('countByWeek', () => {
  const now = new Date('2026-01-01T12:00:00Z');

  test('counts dates within current period', () => {
    const dates = [
      '2026-01-01T12:00:00Z',
      '2025-12-31T12:00:00Z',
      '2025-12-26T12:00:00Z',
    ];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(3);
    expect(result.previous).toBe(0);
    expect(result.percents).toBe(100);
  });

  test('counts dates within previous period', () => {
    const dates = [
      '2025-12-24T12:00:00Z',
      '2025-12-23T12:00:00Z',
      '2025-12-22T12:00:00Z',
    ];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(0);
    expect(result.previous).toBe(3);
    expect(result.percents).toBe(-100);
  });

  test('ignores dates outside both periods', () => {
    const dates = [
      '2025-12-20T12:00:00Z',
      '2025-01-01T12:00:00Z',
      '2026-02-01T12:00:00Z',
    ];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(0);
    expect(result.previous).toBe(0);
    expect(result.percents).toBe(0);
  });

  test('returns 0 percents when both periods are empty', () => {
    const result = countByWeek([], now);

    expect(result.current).toBe(0);
    expect(result.previous).toBe(0);
    expect(result.percents).toBe(0);
  });

  test('returns 100 percents when previous is empty and current is not', () => {
    const dates = ['2026-01-01T12:00:00Z'];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(1);
    expect(result.previous).toBe(0);
    expect(result.percents).toBe(100);
  });

  test('calculates percents when both periods have data', () => {
    const dates = [
      '2026-01-01T12:00:00Z',
      '2025-12-31T12:00:00Z',
      '2025-12-24T12:00:00Z',
    ];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(2);
    expect(result.previous).toBe(1);
    expect(result.percents).toBe(100);
  });

  test('calculates negative percents', () => {
    const dates = [
      '2026-01-01T12:00:00Z',
      '2025-12-23T12:00:00Z',
      '2025-12-24T12:00:00Z',
    ];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(1);
    expect(result.previous).toBe(2);
    expect(result.percents).toBe(-50);
  });

  test('rounds percents to integer', () => {
    const dates = [
      '2026-01-01T12:00:00Z',
      '2025-12-31T12:00:00Z',
      '2025-12-30T12:00:00Z',
      '2025-12-23T12:00:00Z',
      '2025-12-24T12:00:00Z',
    ];

    const result = countByWeek(dates, now);

    expect(result.current).toBe(3);
    expect(result.previous).toBe(2);
    expect(result.percents).toBe(50);
  });

  test('uses current date by default', () => {
    const now = new Date();
    const dates = [now.toISOString()];

    const result = countByWeek(dates);

    expect(result.current).toBe(1);
  });
});
