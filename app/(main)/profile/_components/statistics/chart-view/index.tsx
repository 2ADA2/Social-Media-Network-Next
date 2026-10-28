import './chart-view.css';
import Chart from 'react-apexcharts';
import React, { useMemo } from 'react';
import { useLocale, useTranslations } from "next-intl";
import type { DailyCount } from '@/shared/lib/stats/count-by-day';
import { buildOptions } from './options';

interface ChartViewProps {
  likesByDay: DailyCount[];
  commentsByDay: DailyCount[];
  theme: 'light' | 'dark';
}

const ChartView = React.memo(
  ({ likesByDay, commentsByDay, theme }: ChartViewProps) => {
    const t = useTranslations('profile');
    const locale = useLocale();

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
        locale,
      );
    }, [likesByDay, theme]);

    const commentsOptions = useMemo(() => {
      const categories = commentsByDay.map((d) => d.date);
      return buildOptions(
        categories,
        theme,
        'comments-chart',
        'bar',
        locale,
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
