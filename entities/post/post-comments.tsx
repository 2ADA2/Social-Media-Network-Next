import { useQuery } from '@tanstack/react-query';
import { PostCommentsContainer } from '@/entities/post/post.styles';
import { CreateComment } from '@/features/create-comment';
import { commentsQueries } from '@/features/get-comments/get-comments';
import { useCommentAuthors } from '@/features/get-comments/use-comment-authors';
import { Loader } from '@/shared/ui/loader';
import { Comment } from '@/entities/comment';
import React from 'react';

interface PostCommentsProps {
  postId: number;
}

export const PostComments = React.memo(({ postId }: PostCommentsProps) => {
  const {
    data: comments = [],
    isPending,
    isError,
  } = useQuery(commentsQueries.forPost(postId));
  const usersMap = useCommentAuthors(comments);

  if (isPending) {
    return <Loader isBlock={false} />;
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
