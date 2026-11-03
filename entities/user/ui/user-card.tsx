import { Avatar } from "@/shared/ui/avatar";
import "./user-card.css";

export interface UserCardProps {
  avatarUrl: string;
  title: string;
  subtitle: string;
}

export const UserCard = ({ avatarUrl, title, subtitle }: UserCardProps) => {
  return (
    <div className="user-card">
      <Avatar src={ avatarUrl } size={ 48 }/>
      <div className="user-card-info">
        <div className="user-card-title">{title}</div>
        <div className="user-card-subtitle">{subtitle}</div>
      </div>
    </div>
  );
};
