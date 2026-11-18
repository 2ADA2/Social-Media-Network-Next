import {
  HeaderData,
  PostControl,
  PostDate,
  PostHeader,
  StyledPost,
  ControlContainer,
  ControlText,
  SkeletonPulse,
} from "../post.styles";

const SkeletonBlock = ({
  width,
  height,
  borderRadius = 4,
  marginBottom = 0,
}: {
  width: string | number;
  height: string | number;
  borderRadius?: number;
  marginBottom?: number;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: "var(--border-primary)",
      opacity: 0.5,
      marginBottom,
    }}
  />
);

export const PostSkeleton = ({ hasImage = false }: { hasImage?: boolean }) => {
  return (
    <SkeletonPulse>
      <StyledPost>
        <PostHeader>
          <SkeletonBlock width={48} height={48} borderRadius={24} />
          <HeaderData>
            <SkeletonBlock width={120} height={16} marginBottom={4} />
            <PostDate>
              <SkeletonBlock width={60} height={12} />
            </PostDate>
          </HeaderData>
        </PostHeader>

        {hasImage && (
          <div
            style={{
              width: "100%",
              height: 300,
              borderRadius: 4,
              backgroundColor: "var(--border-primary)",
              opacity: 0.3,
            }}
            data-testid="post-skeleton-image"
          />
        )}

        <div data-testid="post-skeleton-text">
          <SkeletonBlock width="100%" height={16} marginBottom={8} />
          <SkeletonBlock width="85%" height={16} marginBottom={8} />
          <SkeletonBlock width="60%" height={16} />
        </div>

        <PostControl $auth={true}>
          <ControlContainer>
            <SkeletonBlock width={24} height={24} />
            <ControlText>
              <SkeletonBlock width={40} height={16} />
            </ControlText>
          </ControlContainer>

          <ControlContainer>
            <SkeletonBlock width={24} height={24} />
            <ControlText>
              <SkeletonBlock width={100} height={16} />
            </ControlText>
          </ControlContainer>
        </PostControl>
      </StyledPost>
    </SkeletonPulse>
  );
};
