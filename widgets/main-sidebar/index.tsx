import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Sidebar } from "@/entities/sidebar";
import "./main-sidebar.css";
import { fetchCommunities, fetchSuggestedPeople } from "./main-sidebar-api";

export const MainSidebar = async () => {
  const t = await getTranslations("main");
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  const [peopleRes, communitiesRes] = await Promise.allSettled([
    fetchSuggestedPeople(token),
    fetchCommunities(token),
  ]);

  if (peopleRes.status === "rejected") console.error(peopleRes.reason);
  if (communitiesRes.status === "rejected")
    console.error(communitiesRes.reason);

  const suggestedPeople =
    peopleRes.status === "fulfilled" ? peopleRes.value : [];
  const communities =
    communitiesRes.status === "fulfilled" ? communitiesRes.value : [];

  return (
    <div className="recommend-sidebars">
      <Sidebar title={t("sidebar.suggestedPeople")} users={suggestedPeople} />
      <Sidebar title={t("sidebar.communities")} users={communities} />
    </div>
  );
};
