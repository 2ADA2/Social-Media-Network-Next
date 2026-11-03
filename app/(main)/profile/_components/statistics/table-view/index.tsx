import "./table-view.css";
import { useTranslations } from "next-intl";
import { type DailyCount } from "@/shared/lib/stats/count-by-day";

interface TableViewProps {
  likesByDay: DailyCount[];
  commentsByDay: DailyCount[];
}

export const TableView = ({ likesByDay, commentsByDay }: TableViewProps) => {
  const t = useTranslations('profile');

  return (
    <div className='stats-container'>
      <div className="stats-block">
        <h2 className="stats-heading">{ t('stats.likes') }</h2>
        <div className="stats-table">
          <div className="stats-table-title">{ t('stats.lastWeek') }</div>
          <table className="stats-table-content">
            <thead>
            <tr className="stats-table-head">
              <th className="text-left">{ t('stats.day') }</th>
              <th className="text-right">{ t('stats.count') }</th>
            </tr>
            </thead>
            <tbody>
            { likesByDay.map((row, i) => (
              <tr key={ i } className="stats-table-row">
                <td className="text-left">{ row.date }</td>
                <td className="text-right">{ row.count || "-" }</td>
              </tr>
            )) }
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-block">
        <h2 className="stats-heading">{ t('stats.comments') }</h2>
        <div className="stats-table">
          <div className="stats-table-title">{ t('stats.lastWeek') }</div>
          <table className="stats-table-content">
            <thead>
            <tr className="stats-table-head">
              <th className="text-left">{ t('stats.day') }</th>
              <th className="text-right">{ t('stats.count') }</th>
            </tr>
            </thead>
            <tbody>
            { commentsByDay.map((row, i) => (
              <tr key={ i } className="stats-table-row">
                <td className="text-left">{ row.date }</td>
                <td className="text-right">{ row.count || "-" }</td>
              </tr>
            )) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
