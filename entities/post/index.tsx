import { useLocale, useTranslations } from "next-intl";
import HeartIcon from '@/shared/assets/icons/heart.svg';
import CommentIcon from '@/shared/assets/icons/comment.svg';
import { CoverButton } from '@/shared/ui/cover-button';
import ArrowDown from '@/shared/assets/icons/arrow-down.svg';
import ArrowUp from '@/shared/assets/icons/arrow-up.svg';
import { useAuth } from '@/features/auth/use-auth';
import { Avatar } from '@/shared/ui/avatar';
import { formatCompact } from '@/shared/lib/localization/format-number';
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
} from './post.styles';
import type { Post as PostType } from '@/entities/post/types';
import { useLikePost } from '@/features/like-post/use-like-post';
import { useAppSelector } from '@/app/store/hooks';
import { selectUserId } from '@/entities/user/model/selectors';
import { PostComments } from '@/entities/post/post-comments';
import { animated, useSpring, useTransition } from '@react-spring/web';
import { formatRelativeTime } from '@/shared/lib/localization/format-relative-time';
import { DeletePostButton } from '@/features/delete-post';
import { useState } from 'react';

const MAX_COMMENTS_HEIGHT = 1000;

interface PostProps {
  post: PostType;
}

const checkLiked = (likes: { id: number }[], userId: number) => {
  if (userId === -1) return false;
  return likes.some((user) => user.id === userId);
};

export const Post = ({ post }: PostProps) => {
  const t = useTranslations('main');
  const locale = useLocale();
  const { isAuth } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const currentUserId = Number(useAppSelector(selectUserId)) || -1;

  const [liked, setLiked] = useState(
    checkLiked(post.likedByUsers, currentUserId),
  );
  const likes = post.likesCount;
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

  const handleLike = () => {
    if (!isAuth || isLiking) return;
    setLiked((prev) => !prev);
    toggleLike({ postId: post.id, liked });
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const date = formatRelativeTime(post.creationDate, locale);

  return (
    <StyledPost>
      <PostHeader>
        {isAuth && currentUserId === post.authorId && (
          <DeletePostButton postId={post.id} />
        )}
        <Avatar
          src={post.author.profileImage || ''}
          alt={`Post ${post.id}`}
          size={48}
        />
        <HeaderData>
          <div>
            {post.author.firstName} {post.author.secondName}
          </div>
          <PostDate>{date}</PostDate>
        </HeaderData>
      </PostHeader>

      {post.image && (
        <PostImage loading="lazy" src={post.image} alt={post.title} width={100} height={100}/>
      )}

      <Description>{post.content}</Description>

      <PostControl $auth={isAuth}>
        <CoverButton
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={t('post.likeButton')}
        >
          <ControlContainer>
            <StyledSVG $active={liked}>
              <animated.div
                style={{
                  transform: heartSpring.scale.to((s) => `scale(${s})`),
                  display: 'flex',
                }}
              >
                <HeartIcon />
              </animated.div>
            </StyledSVG>
            <ControlText>
              {likes < 1000
                ? t('post.likes', { count: likes })
                : `${formatCompact(likes, locale)} ${t('post.likesLabel')}`}
            </ControlText>
          </ControlContainer>
        </CoverButton>

        <CoverButton
          onClick={toggleComments}
          aria-label={t('post.commentsButton')}
        >
          <ControlContainer>
            <StyledSVG $active={false}>
              <CommentIcon />
            </StyledSVG>
            <ControlText>
              {isAuth
                ? comments < 1000
                  ? t('post.comments', { count: comments })
                  : `${formatCompact(comments, locale)} ${t('post.commentsLabel')}`
                : t('post.loginToSeeComments')}
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
              <animated.div style={{ ...style, overflow: 'hidden' }}>
                <PostComments postId={post.id} />
              </animated.div>
            ),
        )}
    </StyledPost>
  );
};
