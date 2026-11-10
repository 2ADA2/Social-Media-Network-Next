import { apiClient } from "@/shared/api/api-client";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { graphqlClient } from "@/shared/api/graphql-client";
import type { Post, PostsPage } from "@/entities/post/types";
import { gql } from "graphql-request";
import z from "zod";
import { AxiosError } from "axios";

const POSTS_LIMIT = 20;
const CACHE_TIME = 0;

const postResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  authorId: z.number(),
  likesCount: z.number(),
  commentsCount: z.number(),
  creationDate: z.string(),
  modifiedDate: z.string(),
  author: z.object({
    id: z.number(),
    username: z.string(),
    firstName: z.string(),
    secondName: z.string(),
    profileImage: z.string().nullable(),
  }),
  likedByUsers: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
    }),
  ),
});

const postByIdResponseSchema = z.object({
  post: postResponseSchema.nullable(),
});

const postsTotalResponseSchema = z.object({
  postsTotal: z.number(),
});

const likeStatusResponseSchema = z.object({
  status: z.enum(["liked", "already_liked", "disliked", "not_liked"]),
  postId: z.number(),
  newLikesCount: z.number(),
});

type LikeStatus = z.infer<typeof likeStatusResponseSchema>;

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

const POSTS_TOTAL_QUERY = gql`
  query PostsTotal {
    postsTotal
  }
`;

interface AllPostsResponse {
  allPosts: Post[];
}

interface PostResponse {
  post: Post | null;
}

interface PostsTotalResponse {
  postsTotal: number;
}

const fetchPostsFromEnd = async (
  limit = 20,
  offsetFromEnd = 0,
): Promise<PostsPage> => {
  const totalData =
    await graphqlClient.request<PostsTotalResponse>(POSTS_TOTAL_QUERY);
  const total = totalData.postsTotal;

  const remaining = total - offsetFromEnd;

  if (remaining <= 0) {
    return { items: [], total, limit: 0, offset: 0 };
  }

  const currentLimit = Math.min(limit, remaining);

  const actualOffset = Math.max(0, total - offsetFromEnd - currentLimit);

  const postsData = await graphqlClient.request<AllPostsResponse>(
    ALL_POSTS_QUERY,
    {
      limit: currentLimit,
      offset: actualOffset,
    },
  );

  return {
    items: postsData.allPosts.reverse(),
    total,
    limit: Math.min(limit, actualOffset),
    offset: actualOffset,
  };
};

const fetchPost = async (id: number): Promise<Post | null> => {
  try {
    const data = await graphqlClient.request<PostResponse>(POST_QUERY, {
      id,
    });

    postByIdResponseSchema.parse(data);

    return data.post;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};

export const postsQueries = {
  infinite: () =>
    infiniteQueryOptions({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => fetchPostsFromEnd(POSTS_LIMIT, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const loaded = allPages.reduce(
          (sum, page) => sum + page.items.length,
          0,
        );

        if (loaded < lastPage.total) {
          return loaded;
        }

        return undefined;
      },
      staleTime: CACHE_TIME,
      gcTime: CACHE_TIME,
    }),

  byId: (id: number) =>
    queryOptions({
      queryKey: ["post", id],
      queryFn: () => fetchPost(id),
      staleTime: CACHE_TIME,
      gcTime: CACHE_TIME,
    }),
};

export const likePost = async (postId: number): Promise<LikeStatus> => {
  try {
    const { data } = await apiClient.post<LikeStatus>("/api/like", {
      postId,
    });

    likeStatusResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};

export const dislikePost = async (postId: number): Promise<LikeStatus> => {
  try {
    const { data } = await apiClient.post<LikeStatus>("/api/dislike", {
      postId,
    });

    likeStatusResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
