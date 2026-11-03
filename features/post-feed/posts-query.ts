import { apiClient } from "@/shared/api/api-client";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { graphqlClient } from "@/shared/api/graphql-client";
import type { Post, PostsPage } from "@/entities/post/types";
import { gql } from "graphql-request";
import z from "zod";
import { AxiosError } from "axios";

const POSTS_LIMIT = 20;
const CACHE_TIME = 5 * 60 * 1000;

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

const allPostsResponseSchema = z.object({
  allPosts: z.array(postResponseSchema),
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

const fetchPosts = async (limit = 20, offset = 0): Promise<PostsPage> => {
  try {
    const [postsData, totalData] = await Promise.all([
      graphqlClient.request<AllPostsResponse>(ALL_POSTS_QUERY, {
        limit,
        offset,
      }),
      graphqlClient.request<PostsTotalResponse>(POSTS_TOTAL_QUERY),
    ]);

    allPostsResponseSchema.parse(postsData);
    postsTotalResponseSchema.parse(totalData);

    return {
      items: postsData.allPosts,
      total: totalData.postsTotal,
      limit,
      offset,
    };
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
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
