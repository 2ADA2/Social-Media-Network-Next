import { useTranslation } from "react-i18next";

interface StatsCardProps {
  title: string,
  value: number,
  percents: number,
}

export const StatsCard = ({ title, value, percents }: StatsCardProps) => {
  const { t } = useTranslation('profile');

  return (
    <div className="stats-card">
      <div className="stats-card-title">{ title }</div>
      <div className="stats-card-value">{ value || 0 }</div>
      <div
        className='stats-card-delta'>
        { percents >= 0 ? `+${ percents }% ` : `${ percents }% ` }
        { t('stats.weekOverWeek') }
      </div>
    </div>
  );
};
