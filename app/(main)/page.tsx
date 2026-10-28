'use client'

import './main.css';
import { MainSidebar } from '@/widgets/main-sidebar';
import { useAuth } from '@/features/auth/use-auth';
import { PostsList } from '@/features/post-feed/posts-list';

export default function HomePage() {
  const { isAuth } = useAuth();

  return (
    <div className="main-page">
      <PostsList />

      <div className={'recommend-sidebars'}>{isAuth && <MainSidebar />}</div>
    </div>
  );
};
