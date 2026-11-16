import "./statistics.css";
import { countByDay } from "@/shared/lib/stats/count-by-day";
import {
  fetchMyComments,
  fetchMyLikes,
  fetchMyPosts,
} from "@/features/get-statistics/stats";
import { countByWeek } from "@/shared/lib/stats/date-stats";
import { StatsCard } from "./stats-card";
import { getTranslations } from "next-intl/server";
import { StatisticsClient } from "./statistics-client";

export const Statistics = async () => {
  const t = await getTranslations("profile");

  const [posts, likes, comments] = await Promise.all([
    fetchMyPosts(),
    fetchMyLikes(),
    fetchMyComments(),
  ]);

  const postsStats = countByWeek(posts.map((p) => p.creationDate));
  const likesStats = countByWeek(likes.map((l) => l.creationDate));
  const commentsStats = countByWeek(comments.map((c) => c.creationDate));

  const likesByDay = countByDay(
    likes.map((l) => l.creationDate),
    7,
  );
  const commentsByDay = countByDay(
    comments.map((c) => c.creationDate),
    7,
  );

  const stats = [
    {
      id: 1,
      title: t("stats.likes"),
      value: likesStats.current,
      percents: likesStats.percents,
    },
    {
      id: 2,
      title: t("stats.comments"),
      value: commentsStats.current,
      percents: commentsStats.percents,
    },
    {
      id: 3,
      title: t("stats.posts"),
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

      <StatisticsClient likesByDay={likesByDay} commentsByDay={commentsByDay} />
    </section>
  );
};
