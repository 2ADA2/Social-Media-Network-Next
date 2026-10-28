import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { graphqlClient } from '@/shared/api/graphql-client';
import type { Post, PostsPage } from '@/entities/post/types';
import { gql } from 'graphql-request';

const POSTS_LIMIT = 20;
const CACHE_TIME = 5 * 60 * 1000;

const ALL_POSTS_QUERY = gql`
  query AllPosts($limit: Int, $offset: Int) {
    allPosts(limit: $limit, offset: $offset) {
      id
      title
      content
      image
      authorId
      likesCount
      commentsCount
      creationDate
      modifiedDate
      author {
        id
        username
        firstName
        secondName
        profileImage
      }
      likedByUsers {
        id
        username
      }
    }
  }
`;

const POST_QUERY = gql`
  query Post($id: Int!) {
    post(id: $id) {
      id
      title
      content
      image
      authorId
      likesCount
      commentsCount
      creationDate
      modifiedDate
      author {
        id
        username
        firstName
        secondName
        profileImage
      }
      likedByUsers {
        id
        username
      }
    }
  }
`;

interface PostResponse {
  post: Post | null;
}

const POSTS_TOTAL_QUERY = gql`
  query PostsTotal {
    postsTotal
  }
`;

interface AllPostsResponse {
  allPosts: Post[];
}

interface PostsTotalResponse {
  postsTotal: number;
}

const fetchPosts = async (limit = 20, offset = 0): Promise<PostsPage> => {
  const [postsData, totalData] = await Promise.all([
    graphqlClient.request<AllPostsResponse>(ALL_POSTS_QUERY, { limit, offset }),
    graphqlClient.request<PostsTotalResponse>(POSTS_TOTAL_QUERY),
  ]);

  return {
    items: postsData.allPosts,
    total: totalData.postsTotal,
    limit,
    offset,
  };
};

const fetchPost = async (id: number): Promise<Post | null> => {
  const { post } = await graphqlClient.request<PostResponse>(POST_QUERY, {
    id,
  });
  return post;
};

export const postsQueries = {
  infinite: () =>
    infiniteQueryOptions({
      queryKey: ['posts'],
      queryFn: ({ pageParam }) => fetchPosts(POSTS_LIMIT, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce(
          (sum, page) => sum + page.items.length,
          0,
        );

        return loaded < lastPage.total ? loaded : undefined;
      },
      staleTime: CACHE_TIME,
      gcTime: CACHE_TIME,
    }),
  byId: (id: number) =>
    queryOptions({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
      staleTime: CACHE_TIME,
      gcTime: CACHE_TIME,
    }),
};
