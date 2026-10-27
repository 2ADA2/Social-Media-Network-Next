import "./sidebar.css";
import { useTranslation } from "react-i18next";
import { UserCard } from "@/entities/user";
import { formatCompact } from "@/shared/lib/localization/format-number";
import type { CommunityResponse, SuggestedPeopleResponse } from "@/features/sidebar/types";

type SidebarEntities = SuggestedPeopleResponse[] | CommunityResponse[];

export interface SidebarProps {
  title: string;
  users: SidebarEntities;
}

const isUserArray = (items: SidebarEntities): items is SuggestedPeopleResponse[] => {
  return items.length > 0 && "username" in items[0];
};

export const Sidebar = ({ title, users }: SidebarProps) => {
  const { t, i18n } = useTranslation('main');

  if (users.length === 0) {
    return null;
  }

  if (isUserArray(users)) {
    return (
      <aside className="sidebar">
        <h2>{ title }</h2>
        { users.map((user) => (
          <UserCard
            key={ user.id }
            { ...user }
            title={ user.firstName + " " + user.secondName }
            subtitle={ "@" + user.username }
            avatarUrl={ user.photo || "" }
          />
        )) }
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <h2>{ title }</h2>
      { users.map((user) => (
        <UserCard
          key={ user.id }
          { ...user }
          title={ user.title }
          subtitle={ `${formatCompact(user.membersCount, i18n.language)} ${t('sidebar.members')}` }
          avatarUrl={ user.photo || "" }
        />
      )) }
    </aside>
  );
};
