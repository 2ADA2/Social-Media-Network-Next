import { useTranslation } from "react-i18next";
import { Sidebar } from "@/entities/sidebar";
import { useQuery } from "@tanstack/react-query";
import { sidebarQueries } from "@/features/sidebar/sidebar.ts";

export const MainSidebar = () => {
  const { t } = useTranslation('main');
  const {
    data: suggestedPeople,
    isPending: isPeoplePending,
    isError: isPeopleError,
  } = useQuery(sidebarQueries.suggestedPeople());
  const {
    data: communities,
    isPending: isCommunitiesPending,
    isError: isCommunitiesError,
  } = useQuery(sidebarQueries.community());

  const showPeople = () => {
    if (isPeopleError) {
      return <Sidebar title='cannot get people' users={ [] }/>;
    }

    if (!isPeoplePending && suggestedPeople) {
      return <Sidebar title={ t('sidebar.suggestedPeople') } users={ suggestedPeople }/>;
    }

    return null;
  };

  const showCommunities = () => {
    if (isCommunitiesError) {
      return <Sidebar title='cannot get communities' users={ [] }/>;
    }

    if (!isCommunitiesPending && communities) {
      return  <Sidebar title={ t('sidebar.communities') } users={ communities }/>;
    }

    return null;
  };

  return (
    <>
      { showPeople() }
      { showCommunities() }
    </>
  );
};
