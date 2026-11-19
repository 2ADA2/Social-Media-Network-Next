import { API_URL } from "@/app/lib/config";
import { Sidebar } from "@/entities/sidebar";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import "./main-sidebar.css";

export const MainSidebar = async () => {
  const t = await getTranslations("main");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const [peopleRes, communitiesRes] = await Promise.all([
    fetch(`${API_URL}/getSuggested`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    }),
    fetch(`${API_URL}/groups`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    }),
  ]);

  const suggestedPeople = peopleRes.ok ? await peopleRes.json() : [];
  const communities = communitiesRes.ok ? await communitiesRes.json() : [];

  return (
    <div className={"recommend-sidebars"}>
      <Sidebar title={t("sidebar.suggestedPeople")} users={suggestedPeople} />
      <Sidebar title={t("sidebar.communities")} users={communities} />
    </div>
  );
};
