"use client";

import { Activity, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { useAuth } from "@/features/auth/use-auth";
import { useUser } from "@/entities/user/model/use-user";
import { useLikePost } from "@/features/like-post/use-like-post";
import { PostComments } from "@/entities/post/post-comments";
import { formatCompact } from "@/shared/lib/localization/format-number";
import HeartIcon from "@/shared/assets/icons/heart.svg";
import CommentIcon from "@/shared/assets/icons/comment.svg";
import ArrowDown from "@/shared/assets/icons/arrow-down.svg";
import ArrowUp from "@/shared/assets/icons/arrow-up.svg";
import "./post-control.css";
import { useQuery } from "@tanstack/react-query";
import { commentsQueries } from "@/features/get-comments/get-comments";

const MAX_COMMENTS_HEIGHT = 1000;

interface PostControlProps {
  likesCount: number;
  likedByUsers: { id: number }[];
  postId: number;
}

const checkLiked = (likes: { id: number }[], userId: string | undefined) => {
  if (!userId) return false;
  const id = Number(userId);
  if (id === -1) return false;
  return likes.some((user) => user.id === id);
};

export const PostControl = ({
  likesCount,
  likedByUsers,
  postId,
}: PostControlProps) => {
  const t = useTranslations("main");
  const locale = useLocale();
  const { isAuth } = useAuth();
  const { user } = useUser();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const { data: comments = [] } = useQuery(commentsQueries.forPost(postId));
  const commentsCount = comments.length;
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);

  const { mutate: toggleLike, isPending: isLiking } = useLikePost();

  const heartSpring = useSpring({
    scale: liked ? 1.15 : 1,
    config: { tension: 300, friction: 10 },
  });

  useEffect(() => {
    setLiked(checkLiked(likedByUsers, user?.id));
    setLikes(likesCount);
  }, [likedByUsers, likesCount, user?.id]);

  const transitions = useTransition(areCommentsOpen, {
    from: { opacity: 0, maxHeight: 0 },
    enter: { opacity: 1, maxHeight: MAX_COMMENTS_HEIGHT },
    leave: { opacity: 0, maxHeight: 0 },
    config: { tension: 200, friction: 25 },
  });

  const onLike = () => {
    if (!isAuth || isLiking) return;

    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
    toggleLike({ postId, liked });
  };

  const toggleComments = () => {
    if (!isAuth) return;
    setAreCommentsOpen((prev) => !prev);
  };

  return (
    <footer className="post-control">
      <div className="post-control-buttons">
        <button
          className="post-control-button"
          onClick={onLike}
          aria-pressed={liked}
          aria-label={t("post.likeButton")}
          disabled={!isAuth}
        >
          <animated.span
            className={`post-control-icon ${liked ? "liked" : ""}`}
            style={{ transform: heartSpring.scale.to((s) => `scale(${s})`) }}
          >
            <HeartIcon />
          </animated.span>
          <span>
            {likes < 1000
              ? t("post.likes", { count: likes })
              : `${formatCompact(likes, locale)} ${t("post.likesLabel")}`}
          </span>
        </button>

        <button
          className="post-control-button"
          onClick={toggleComments}
          aria-label={t("post.commentsButton")}
          disabled={!isAuth}
        >
          <span className="post-control-icon">
            <CommentIcon />
          </span>
          <span className="comments-text">
            {isAuth
              ? commentsCount < 1000
                ? t("post.comments", { count: commentsCount })
                : `${formatCompact(commentsCount, locale)} ${t("post.commentsLabel")}`
              : t("post.loginToSeeComments")}
          </span>
          <span className="post-control-arrow">
            {isAuth && (areCommentsOpen ? <ArrowDown /> : <ArrowUp />)}
          </span>
        </button>
      </div>

      {isAuth &&
        transitions(
          (style, item) =>
            item && (
              <Activity mode={areCommentsOpen ? "visible" : "hidden"}>
                <animated.div style={{ ...style, overflow: "hidden" }}>
                  <PostComments postId={postId} />
                </animated.div>
              </Activity>
            ),
        )}
    </footer>
  );
};
