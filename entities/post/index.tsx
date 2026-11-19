"use client";

import { useLocale, useTranslations } from "next-intl";
import HeartIcon from "@/shared/assets/icons/heart.svg";
import CommentIcon from "@/shared/assets/icons/comment.svg";
import { CoverButton } from "@/shared/ui/cover-button";
import ArrowDown from "@/shared/assets/icons/arrow-down.svg";
import ArrowUp from "@/shared/assets/icons/arrow-up.svg";
import { useAuth } from "@/features/auth/use-auth";
import { Avatar } from "@/shared/ui/avatar";
import { formatCompact } from "@/shared/lib/localization/format-number";
import {
  ControlContainer,
  ControlText,
  Description,
  HeaderData,
  PostControl,
  PostDate,
  PostHeader,
  PostImage,
  StyledArrowIcon,
  StyledPost,
  StyledSVG,
  AuthorLink,
} from "./post.styles";
import type { Post as PostType } from "@/entities/post/types";
import { useLikePost } from "@/features/like-post/use-like-post";
import { useAppSelector } from "@/app/store/hooks";
import { selectUserId } from "@/entities/user/model/selectors";
import { PostComments } from "@/entities/post/post-comments";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { formatRelativeTime } from "@/shared/lib/localization/format-relative-time";
import { DeletePostButton } from "@/features/delete-post";
import { MouseEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import stopPropagation from "@/shared/lib/stop-propogation";

const MAX_COMMENTS_HEIGHT = 1000;
const DEFAULT_IMAGE = "/assets/default-image.png";

interface PostProps {
  post: PostType;
  isFirst?: boolean;
}

const checkLiked = (likes: { id: number }[], userId: number) => {
  if (userId === -1) return false;
  return likes.some((user) => user.id === userId);
};

const AuthorLinkContainer = ({
  id,
  children,
}: {
  id: number;
  children: ReactNode;
}) => {
  return (
    <AuthorLink href={`/users/${id}`} className="author-link-container">
      {children}
    </AuthorLink>
  );
};

export const Post = ({ post, isFirst }: PostProps) => {
  const t = useTranslations("main");
  const locale = useLocale();
  const router = useRouter();
  const { isAuth } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const currentUserId = Number(useAppSelector(selectUserId)) || -1;

  const [hasImageError, setHasImageError] = useState(false);

  const [liked, setLiked] = useState(
    checkLiked(post.likedByUsers, currentUserId),
  );
  const [likes, setLikes] = useState(post.likesCount);
  const comments = post.commentsCount;

  const { mutate: toggleLike, isPending: isLiking } = useLikePost();

  const heartSpring = useSpring({
    scale: liked ? 1.15 : 1,
    config: { tension: 300, friction: 10 },
  });

  const transitions = useTransition(showComments, {
    from: { opacity: 0, maxHeight: 0 },
    enter: { opacity: 1, maxHeight: MAX_COMMENTS_HEIGHT },
    leave: { opacity: 0, maxHeight: 0 },
    config: { tension: 200, friction: 25 },
  });

  const handleLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isAuth || isLiking) return;

    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
    toggleLike({ postId: post.id, liked });
  };

  const toggleComments = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowComments((prev) => !prev);
  };

  const onImageError = () => {
    setHasImageError(true);
  };

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

  const handlePostClick = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <StyledPost onClick={handlePostClick}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {isAuth && currentUserId === post.authorId && (
        <DeletePostButton postId={post.id} />
      )}
      <PostHeader>
        <AuthorLinkContainer id={post.authorId}>
          <Avatar
            src={post.author?.profileImage || ""}
            alt={`Post ${post.id}`}
            size={48}
          />
        </AuthorLinkContainer>
        <HeaderData>
          <div>
            <AuthorLinkContainer id={post.authorId}>
              {post.author?.firstName} {post.author?.secondName}
            </AuthorLinkContainer>
          </div>
          <PostDate>{date}</PostDate>
        </HeaderData>
      </PostHeader>

      {post.image && (
        <PostImage
          src={hasImageError ? DEFAULT_IMAGE : post.image}
          alt={post.title}
          width={1920}
          height={1080}
          loading={isFirst ? "eager" : "lazy"}
          onError={onImageError}
        />
      )}

      <Description>{post.content}</Description>

      <PostControl $auth={isAuth}>
        <CoverButton
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={t("post.likeButton")}
        >
          <ControlContainer>
            <StyledSVG $active={liked}>
              <animated.div
                style={{
                  transform: heartSpring.scale.to((s) => `scale(${s})`),
                  display: "flex",
                }}
              >
                <HeartIcon />
              </animated.div>
            </StyledSVG>
            <ControlText>
              {likes < 1000
                ? t("post.likes", { count: likes })
                : `${formatCompact(likes, locale)} ${t("post.likesLabel")}`}
            </ControlText>
          </ControlContainer>
        </CoverButton>

        <CoverButton
          onClick={toggleComments}
          aria-label={t("post.commentsButton")}
        >
          <ControlContainer>
            <StyledSVG $active={false}>
              <CommentIcon />
            </StyledSVG>
            <ControlText>
              {isAuth
                ? comments < 1000
                  ? t("post.comments", { count: comments })
                  : `${formatCompact(comments, locale)} ${t("post.commentsLabel")}`
                : t("post.loginToSeeComments")}
            </ControlText>
            <StyledArrowIcon>
              {isAuth && (showComments ? <ArrowDown /> : <ArrowUp />)}
            </StyledArrowIcon>
          </ControlContainer>
        </CoverButton>
      </PostControl>

      {isAuth &&
        transitions(
          (style, item) =>
            item && (
              <animated.div
                style={{ ...style, overflow: "hidden", cursor: "default" }}
                onClick={stopPropagation}
              >
                <PostComments postId={post.id} />
              </animated.div>
            ),
        )}
    </StyledPost>
  );
};
