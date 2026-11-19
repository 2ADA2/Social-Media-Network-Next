import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserById } from "./get-user-by-id";
import { Avatar } from "@/shared/ui/avatar";
import "./user-page.css";
import { PostsList } from "@/features/post-feed/posts-list";
import { PostSkeleton } from "@/entities/post/skeleton/post-skeleton";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: UserPageProps): Promise<Metadata> => {
  const { id } = await params;
  const user = await getUserById(id);

  if (user === null) {
    return {
      title: `Unknown user | Sidekick Social`,
      description: "Unknown user",
    };
  }

  return {
    title: `${user.name} ${user.surname ?? ""} | Sidekick Social`.trim(),
    description: user.description || user.username,
    openGraph: {
      title: `${user.name} ${user.surname ?? ""}`.trim(),
      description: user.description || user.username,
      images: user.avatar ? [user.avatar] : [],
    },
  };
};

const UserPage = async ({ params }: UserPageProps) => {
  const { id } = await params;
  const user = await getUserById(id);

  if (user === null) {
    redirect("/");
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${user.name} ${user.surname ?? ""}`.trim(),
    alternateName: user.username,
    description: user.description || undefined,
    image: user.avatar || undefined,
  };

  return (
    <div className="user-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="user-page-article">
        <header className="user-page-header">
          <Avatar
            src={user.avatar || ""}
            alt={`User ${user.username}`}
            size={80}
          />
          <div className="user-header-info">
            <h1 className="user-name">
              {user.name} {user.surname ?? ""}
            </h1>
            <div className="user-username">@{user.username}</div>
          </div>
        </header>

        {user.description && (
          <p className="user-description">{user.description}</p>
        )}
      </article>
      <PostsList showCreatePost={false} authorId={+user.id}>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton hasImage />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton hasImage />
      </PostsList>
    </div>
  );
};

export default UserPage;
