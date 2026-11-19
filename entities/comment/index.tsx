import type { CommentInterface } from "@/entities/comment/types.ts";
import { Avatar } from "@/shared/ui/avatar";
import "./comment.css";
import { useDeleteComment } from "@/features/delete-comment/use-delete-comment";
import TrashCanIcon from "@/shared/assets/icons/trashcan.svg";
import { useUser } from "@/entities/user/model/use-user";
import { formatRelativeTime } from "@/shared/lib/localization/format-relative-time";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export const Comment = (data: CommentInterface) => {
  const t = useTranslations("main");
  const locale = useLocale();

  const { mutate: deleteComment, isPending } = useDeleteComment();
  const { user } = useUser();

  const handleDelete = () => {
    deleteComment({ commentId: data.id, postId: data.postId });
  };

  const avatarUrl = data?.author?.profileImage ?? "";
  const firstName = data?.author?.firstName || data?.author?.username || "user";
  const secondName = data?.author?.secondName ?? "";

  const date = formatRelativeTime(data.creationDate, locale);

  return (
    <div className="post-comment" data-testid="comment">
      <div className="post-comment-header">
        {String(data.author?.id) === String(user?.id) && (
          <button
            className="comment-delete-button"
            disabled={isPending}
            onClick={handleDelete}
            aria-label={t("comment.delete")}
            data-testid="comment-delete"
          >
            <TrashCanIcon />
          </button>
        )}
        <Link href={`/users/${data.authorId}`}>
          <Avatar src={avatarUrl} size={32} />
        </Link>

        <div className="post-comment-info">
          <Link href={`/users/${data.authorId}`}>
            <span>
              {firstName} {secondName}
            </span>
          </Link>
          <span className="comment-date">{date}</span>
        </div>
      </div>
      <p className="post-comment-body">{data.text}</p>
    </div>
  );
};
