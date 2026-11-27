import { useQuery } from "@tanstack/react-query";
import { PostCommentsContainer } from "@/entities/post/post.styles";
import { CreateComment } from "@/features/create-comment";
import { commentsQueries } from "@/features/get-comments/get-comments";
import { useCommentAuthors } from "@/features/get-comments/use-comment-authors";
import { Loader } from "@/shared/ui/loader";
import { Comment } from "@/entities/comment";
import React, { useRef } from "react";

interface PostCommentsProps {
  postId: number;
}

export const PostComments = React.memo(function PostComments({
  postId,
}: PostCommentsProps) {
  const wasLoaded = useRef(false);
  const {
    data: comments = [],
    isPending,
    isError,
  } = useQuery(commentsQueries.forPost(postId));
  const { usersMap, authorsCount } = useCommentAuthors(comments);

  if (!wasLoaded.current && (isPending || usersMap.size !== authorsCount)) {
    return <Loader isBlock={false} />;
  } else {
    wasLoaded.current = true;
  }

  return (
    <>
      <PostCommentsContainer>
        {isError && <div>Cannot get comments</div>}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            author={usersMap.get(comment.authorId) ?? null}
          />
        ))}
      </PostCommentsContainer>
      <CreateComment postId={postId} />
    </>
  );
});
