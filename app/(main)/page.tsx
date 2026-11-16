import "./main.css";
import { MainSidebar } from "@/widgets/main-sidebar";
import { PostsList } from "@/features/post-feed/posts-list";
import { Metadata } from "next";
import { PostSkeleton } from "@/entities/post/skeleton/post-skeleton";

export const metadata: Metadata = {
  title: "Main page | Sidekick Social",
  description: "Share your emotions and communicate with other users.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="main-page">
      <PostsList>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton hasImage />
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton hasImage />
      </PostsList>

      <div className={"recommend-sidebars"}>
        <MainSidebar />
      </div>
    </div>
  );
}
