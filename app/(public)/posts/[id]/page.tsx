import { Metadata } from "next";
import "./post-page.css";
import { Post } from "@/entities/post/types";
import { Avatar } from "@/shared/ui/avatar";
import { formatRelativeTime } from "@/shared/lib/localization/format-relative-time";
import { getLocale } from "next-intl/server";
import { getPostById } from "./get-post-by-id";
import { redirect } from "next/navigation";
import { PostControl } from "./_components/post-control";
import { PostImage } from "./_components/post-image";
import Link from "next/link";
import { ReactNode } from "react";
import { PostsList } from "@/features/post-feed/posts-list";
import { PostSkeleton } from "@/entities/post/skeleton/post-skeleton";
import { MainSidebar } from "@/widgets/main-sidebar";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<Metadata> => {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    return {
      title: "Post not found | Sidekick Social",
    };
  }

  return {
    title: `${post.author.firstName}: ${post.title} | Sidekick Social`,
    description: post.content.slice(0, 180),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 180),
      images: post.image
        ? [post.image]
        : post.author.profileImage
          ? [post.author.profileImage]
          : [],
    },
  };
};

const LinkContainer = ({
  id,
  children,
}: {
  id: number;
  children: ReactNode;
}) => {
  return (
    <Link href={`/users/${id}`} className="post-page-link">
      {children}
    </Link>
  );
};

const PostPage = async ({ params }: PostPageProps) => {
  const { id } = await params;
  const locale = await getLocale();
  const post: Post | null = await getPostById(Number(id));

  if (post === null) {
    redirect("/");
  }

  if (!post) {
    return null;
  }

  const date = formatRelativeTime(post.creationDate, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: post.title,
    articleBody: post.content,
    image: post.image ?? post.author.profileImage,
    datePublished: post.creationDate,
    author: {
      "@type": "Person",
      name: post.author?.username || "Unknown",
    },
  };

  return (
    <div className="post-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="post-page-article">
        <header className="post-page-header">
          <LinkContainer id={post.authorId}>
            <Avatar
              src={post.author.profileImage || ""}
              alt={`Post ${post.id}`}
              size={48}
            />
          </LinkContainer>

          <div className="post-header-info">
            <LinkContainer id={post.authorId}>
              <div className="post-username">
                {`${post.author.firstName} ${post.author.secondName}` ||
                  `${post.author.username}`}
              </div>
            </LinkContainer>
            <div className="post-date">{date}</div>
          </div>
        </header>

        {post.image && (
          <main>
            <PostImage
              className="post-page-image"
              src={post.image || ""}
              width={1920}
              height={1080}
              alt={post.title}
              loading="eager"
            />
          </main>
        )}

        <p className="post-page-content">{post.content}</p>
        <PostControl
          likesCount={post.likesCount}
          postId={post.id}
          likedByUsers={post.likedByUsers}
        ></PostControl>
      </article>
      <PostsList showCreatePost={false} excludeId={post.id}>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton hasImage />
      </PostsList>

      <MainSidebar />
    </div>
  );
};

export default PostPage;
