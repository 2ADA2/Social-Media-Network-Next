const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

const ABSOLUTE_THRESHOLD_DAYS = 7;

export const formatRelativeTime = (
  date: string | Date,
  locale: string = 'en',
): string => {
  const now = Date.now();
  const target = new Date(date).getTime();
  const diffSeconds = Math.round((target - now) / 1000);

  if (Math.abs(diffSeconds) > ABSOLUTE_THRESHOLD_DAYS * 24 * 60 * 60) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
    }).format(new Date(date));
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return rtf.format(0, 'minute');
};
