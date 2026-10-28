import "./profile-page.css";
import { Metadata } from "next";
import ProfilePage from "./_components/profile-page";

export const metadata: Metadata = {
  title: "Profile | Sidekick Social",
  description:
    "Manage your account and watch your statistics in  Sidekick Social.",
  alternates: {
    canonical: "/profile",
  },
};

export default function Profile() {
  return (
    <div className="profile-page">
      <ProfilePage />
    </div>
  );
}
