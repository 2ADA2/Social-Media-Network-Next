import './chart-view.css';
import Chart from 'react-apexcharts';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DailyCount } from '@/shared/lib/stats/count-by-day';
import i18n from 'i18next';
import { buildOptions } from './options';

interface ChartViewProps {
  likesByDay: DailyCount[];
  commentsByDay: DailyCount[];
  theme: 'light' | 'dark';
}

const ChartView = React.memo(
  ({ likesByDay, commentsByDay, theme }: ChartViewProps) => {
    const { t } = useTranslation('profile');

    const likesSeries = useMemo(
      () => [{ name: t('stats.likes'), data: likesByDay.map((d) => d.count) }],
      [likesByDay, t],
    );

    const commentsSeries = useMemo(
      () => [
        { name: t('stats.comments'), data: commentsByDay.map((d) => d.count) },
      ],
      [commentsByDay, t],
    );

    const likesOptions = useMemo(() => {
      const categories = likesByDay.map((d) => d.date);
      return buildOptions(
        categories,
        theme,
        'likes-chart',
        'line',
        i18n.language,
      );
    }, [likesByDay, theme]);

    const commentsOptions = useMemo(() => {
      const categories = commentsByDay.map((d) => d.date);
      return buildOptions(
        categories,
        theme,
        'comments-chart',
        'bar',
        i18n.language,
      );
    }, [commentsByDay, theme]);

    return (
      <div className="stats-container">
        <div className="stats-chart">
          <h2 className="stats-heading">{t('stats.likes')}</h2>
          <Chart
            options={likesOptions}
            series={likesSeries}
            type="line"
            width="95%"
            height="80%"
            className="chart"
            data-testid="chart-likes"
          />
        </div>

        <div className="stats-chart">
          <h2 className="chart-heading">{t('stats.comments')}</h2>
          <Chart
            options={commentsOptions}
            series={commentsSeries}
            type="bar"
            width="95%"
            height="80%"
            className="chart"
            data-testid="chart-comments"
          />
        </div>
      </div>
    );
  },
);

export default ChartView;
