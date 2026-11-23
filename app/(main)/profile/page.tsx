import "./profile-page.css";
import { Metadata } from "next";
import ProfilePage from "./_components/profile-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileInfo } from "./_components/profile-info";
import { Statistics } from "./_components/statistics";
import { fetchUser } from "./_components/fetchUser";

export const metadata: Metadata = {
  title: "Profile | Sidekick Social",
  description:
    "Manage your account and watch your statistics in  Sidekick Social.",
  alternates: {
    canonical: "/profile",
  },
};

export default async function Profile() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  const user = await fetchUser(token);

  const jsonLd = user && {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.firstName,
    alternateName: user.username,
    image: user.profileImage,
    description: user.description,
  };

  return (
    <div className="profile-page">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <ProfilePage Statistics={<Statistics />} ProfileInfo={<ProfileInfo />} />
    </div>
  );
}
