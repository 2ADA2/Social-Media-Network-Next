import { ROUTES } from '@/app/lib/routes';
import './user-nav.css';
import { useUser } from '@/entities/user/model/use-user';
import { Avatar } from '@/shared/ui/avatar';
import Link from 'next/link';

export const UserNav = () => {
  const { user } = useUser();

  if (!user?.name) {
    return null;
  }

  return (
    <Link href={ROUTES.PROFILE} className="user-nav" data-testid="user-nav">
      <Avatar src={user!.avatar} alt={`${user!.name} avatar`} size={24} />
      <span>
        {user!.name} {user!.surname}
      </span>
    </Link>
  );
};
