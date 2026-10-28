import { Toggle } from '@/shared/ui/toggle';
import './statistics.css';
import { lazy, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { countByDay } from '@/shared/lib/stats/count-by-day';
import { useThemeStore } from '@/app/store/theme-store';
import { Loader } from '@/shared/ui/loader';
import { statsQueries } from '@/features/get-statistics/stats';
import { countByWeek } from '@/shared/lib/stats/date-stats';
import { StatsCard } from './stats-card';
import { TableView } from './table-view';

const ChartView = lazy(() => import('./chart-view'));

export const Statistics = () => {
  const { t } = useTranslation('profile');
  const [enableChartView, setEnableChartView] = useState(false);
  const { data: posts } = useQuery(statsQueries.posts());
  const { data: comments } = useQuery(statsQueries.comments());
  const { data: likes } = useQuery(statsQueries.likes());
  const theme = useThemeStore((state) => state.theme);

  const postsStats = useMemo(
    () => countByWeek((posts ?? []).map((p) => p.creationDate)),
    [posts],
  );

  const likesStats = useMemo(
    () => countByWeek((likes ?? []).map((l) => l.creationDate)),
    [likes],
  );

  const commentsStats = useMemo(
    () => countByWeek((comments ?? []).map((c) => c.creationDate)),
    [comments],
  );

  const likesByDay = useMemo(
    () =>
      countByDay(
        (likes ?? []).map((l) => l.creationDate),
        7,
      ),
    [likes],
  );

  const commentsByDay = useMemo(
    () =>
      countByDay(
        (comments ?? []).map((c) => c.creationDate),
        7,
      ),
    [comments],
  );

  const switchChartView = () => {
    setEnableChartView(!enableChartView);
  };

  const stats = [
    {
      id: 1,
      title: t('stats.likes'),
      value: likesStats.current,
      percents: likesStats.percents,
    },
    {
      id: 2,
      title: t('stats.comments'),
      value: commentsStats.current,
      percents: commentsStats.percents,
    },
    {
      id: 3,
      title: t('stats.posts'),
      value: postsStats.current,
      percents: postsStats.percents,
    },
  ];

  return (
    <section className="stats">
      <div className="stats-cards">
        {stats.map((stat) => (
          <StatsCard {...stat} key={stat.id} />
        ))}
      </div>

      <div className="stats-toggle">
        <span>{t('stats.tableView')}</span>
        <Toggle
          checked={enableChartView}
          onChange={switchChartView}
          label={t('stats.switchView')}
        />
        <span>{t('stats.enableChartView')}</span>
      </div>

      {enableChartView && (
        <Suspense fallback={<Loader />}>
          <ChartView
            commentsByDay={commentsByDay}
            likesByDay={likesByDay}
            theme={theme}
          />
        </Suspense>
      )}
      {!enableChartView && (
        <TableView likesByDay={likesByDay} commentsByDay={commentsByDay} />
      )}
    </section>
  );
};
