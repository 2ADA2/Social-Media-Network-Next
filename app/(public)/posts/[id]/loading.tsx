import { PostSkeleton } from "@/entities/post/skeleton/post-skeleton";

export default function Loading() {
  return (
    <div className="post-page-container">
      <PostSkeleton hasImage />
    </div>
  );
}
