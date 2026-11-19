import { getTranslations } from "next-intl/server";

interface StatsCardProps {
  title: string;
  value: number;
  percents: number;
}

export const StatsCard = async ({ title, value, percents }: StatsCardProps) => {
  const t = await getTranslations("profile");

  return (
    <div className="stats-card">
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value || 0}</div>
      <div className="stats-card-delta">
        {percents >= 0 ? `+${percents}% ` : `${percents}% `}
        {t("stats.weekOverWeek")}
      </div>
    </div>
  );
};
