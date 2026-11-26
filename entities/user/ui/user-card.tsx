import { Avatar } from "@/shared/ui/avatar";
import "./user-card.css";
import { MouseEvent } from "react";
import Link from "next/link";

export interface UserCardProps {
  avatarUrl: string;
  title: string;
  subtitle: string;
  href?: string;
}

export const UserCard = ({
  avatarUrl,
  title,
  subtitle,
  href,
}: UserCardProps) => {
  return (
    <Link href={href || ""} replace className="user-card-link">
      <div className="user-card">
        <Avatar src={avatarUrl} size={48} />
        <div className="user-card-info">
          <div className="user-card-title">{title}</div>
          <div className="user-card-subtitle">{subtitle}</div>
        </div>
      </div>
    </Link>
  );
};
