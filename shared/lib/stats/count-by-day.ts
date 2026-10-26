const DAY = 24 * 60 * 60 * 1000;

export interface DailyCount {
  date: string;
  count: number;
}

export const countByDay = (
  dates: string[],
  days = 7,
  now: Date = new Date(),
): DailyCount[] => {
  const nowTime = now.getTime();
  const startTime = nowTime - days * DAY;

  const map = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(nowTime - i * DAY);
    map.set(toDateKey(d), 0);
  }

  for (const dateStr of dates) {
    const time = new Date(dateStr).getTime();

    if (time < startTime || time > nowTime) {
      continue;
    }

    const key = toDateKey(new Date(time));

    if (map.has(key)) {
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
};

const toDateKey = (date: Date): string => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${d}.${m}`;
};
