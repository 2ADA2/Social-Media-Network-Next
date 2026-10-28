import "./profile-page.css";
import { Metadata } from "next";
import ProfilePage from "./_components/profile-page";
import { API_URL } from "@/app/lib/config";
import { cookies } from "next/headers";
import { UserResponse } from "@/entities/user";
import { redirect } from "next/navigation";
import { ProfileInfo } from "./_components/profile-info";
import { Statistics } from "./_components/statistics";

export const metadata: Metadata = {
  title: "Profile | Sidekick Social",
  description:
    "Manage your account and watch your statistics in  Sidekick Social.",
  alternates: {
    canonical: "/profile",
  },
};

export default async function Profile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    redirect("/");
  }

  const user: UserResponse = await response.json();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.firstName,
    alternateName: user.username,
    image: user.profileImage,
    description: user.description,
  };

  return (
    <div className="profile-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfilePage Statistics={<Statistics />} ProfileInfo={<ProfileInfo/>} />
    </div>
  );
}
