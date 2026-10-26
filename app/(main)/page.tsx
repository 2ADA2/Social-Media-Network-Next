import { Suspense } from 'react';
import { API_URL } from '@/app/lib/config';
import { Loader } from '@/shared/ui/loader';

async function PostList() {1
  const res = await fetch(`${API_URL}/posts`);
  
  if (!res.ok) {
    return <div>Ошибка: {res.status}</div>;
  }

  const { items } = await res.json();

  return (
    <ul>
      {items.map((post: { id: number; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <div>
      <h1>Посты</h1>
      <Suspense fallback={<Loader/>}>
        <PostList />
      </Suspense>
    </div>
  );
}