const DAY = 24 * 60 * 60 * 1000;
const PERIOD_DAYS = 7;
const PREV_PERIOD_DAYS = 3;

export interface WeekStats {
  current: number;
  previous: number;
  percents: number;
}

export const countByWeek = (
  dates: string[],
  now: Date = new Date(),
): WeekStats => {
  const nowTime = now.getTime();
  const currentStart = nowTime - PERIOD_DAYS * DAY;
  const previousStart = nowTime - (PREV_PERIOD_DAYS + PERIOD_DAYS) * DAY;

  let current = 0;
  let previous = 0;

  for (const dateStr of dates) {
    const time = new Date(dateStr).getTime();

    if (time >= currentStart && time <= nowTime) {
      current++;
    } else if (time >= previousStart && time < currentStart) {
      previous++;
    }
  }

  let percents;

  if (previous === 0) {
    percents = current > 0 ? 100 : 0;
  } else {
    percents = ((current - previous) / previous) * 100;
  }

  percents = Math.round(percents);
  return {
    current,
    previous,
    percents,
  };
};
