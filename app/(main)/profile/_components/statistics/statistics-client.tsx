"use client";

import { Activity, lazy, Profiler, Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { Toggle } from "@/shared/ui/toggle";
import { Loader } from "@/shared/ui/loader";
import { useThemeStore } from "@/app/store/theme-store";
import { TableView } from "./table-view";
import { DailyCount } from "@/shared/lib/stats/count-by-day";

const ChartView = lazy(() => import("./chart-view"));

interface StatisticsClientProps {
  likesByDay: DailyCount[];
  commentsByDay: DailyCount[];
}

export const StatisticsClient = ({
  likesByDay,
  commentsByDay,
}: StatisticsClientProps) => {
  const t = useTranslations("profile");
  const [enableChartView, setEnableChartView] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  const switchChartView = () => {
    setEnableChartView((prev) => !prev);
  };

  const onRender = (
    id: string,
    _phase: string,
    _actualDuration: number,
    _baseDuration: number,
    startTime: number,
    commitTime: number,
  ) => {
    console.log(id, commitTime - startTime, "ms");
  };

  return (
    <>
      <div className="stats-toggle">
        <span>{t("stats.tableView")}</span>
        <Toggle
          checked={enableChartView}
          onChange={switchChartView}
          label={t("stats.switchView")}
        />
        <span>{t("stats.enableChartView")}</span>
      </div>

      <Activity mode={enableChartView ? "visible" : "hidden"}>
        <Suspense fallback={<Loader />}>
          <Profiler id="chart-view-profiler" onRender={onRender}>
            <ChartView
              commentsByDay={commentsByDay}
              likesByDay={likesByDay}
              theme={theme}
            />
          </Profiler>
        </Suspense>
      </Activity>

      <Activity mode={!enableChartView ? "visible" : "hidden"}>
        {!enableChartView && (
          <TableView likesByDay={likesByDay} commentsByDay={commentsByDay} />
        )}
      </Activity>
    </>
  );
};
