import "../user-page.css";
import "./user-page-skeleton.css";

const SkeletonBlock = ({
  width,
  height,
  borderRadius = 4,
}: {
  width: string | number;
  height: string | number;
  borderRadius?: number;
}) => (
  <div className="skeleton-block" style={{ width, height, borderRadius }} />
);

export const UserPageSkeleton = () => {
  return (
    <div className="user-page-container" data-testid="user-page-skeleton">
      <article className="user-page-article">
        <header className="user-page-header">
          <div className="skeleton-avatar skeleton-block" />
          <div className="user-header-info">
            <SkeletonBlock width={180} height={20} />
            <SkeletonBlock width={120} height={14} />
          </div>
        </header>

        <div className="user-skeleton-description">
          <SkeletonBlock width="100%" height={14} />
          <SkeletonBlock width="80%" height={14} />
          <SkeletonBlock width="60%" height={14} />
        </div>
      </article>
    </div>
  );
};
