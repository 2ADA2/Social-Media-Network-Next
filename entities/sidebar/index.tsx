import "./sidebar.css";
import { UserCard } from "@/entities/user";
import { formatCompact } from "@/shared/lib/localization/format-number";
import type {
  CommunityResponse,
  SuggestedPeopleResponse,
} from "@/features/sidebar/types";
import { useLocale, useTranslations } from "next-intl";

type SidebarEntities = SuggestedPeopleResponse[] | CommunityResponse[];

export interface SidebarProps {
  title: string;
  users: SidebarEntities;
}

const isUserArray = (
  items: SidebarEntities,
): items is SuggestedPeopleResponse[] => {
  return items.length > 0 && "username" in items[0];
};

export const Sidebar = ({ title, users }: SidebarProps) => {
  const t = useTranslations("main");
  const locale = useLocale();

  if (users.length === 0) {
    return null;
  }

  if (isUserArray(users)) {
    return (
      <aside className="sidebar">
        <h2>{title}</h2>
        {users.map((user) => (
          <UserCard
            key={user.id}
            {...user}
            title={
              [user.firstName, user.secondName].filter(Boolean).join(" ")
              || "Unknown"
            }
            subtitle={"@" + user.username}
            avatarUrl={user.photo || ""}
          />
        ))}
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <h2>{title}</h2>
      {users.map((user) => (
        <UserCard
          key={user.id}
          {...user}
          title={user.title}
          subtitle={`${formatCompact(user.membersCount, locale)} ${t("sidebar.members")}`}
          avatarUrl={user.photo || ""}
        />
      ))}
    </aside>
  );
};
